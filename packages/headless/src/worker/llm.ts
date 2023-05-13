import { v4 as uuidv4 } from "uuid";
import { Conversation } from "../types/chat";
import { GenerateTextCallback, GenerateTextRequest } from "../types/worker_message";
import { detectGPUDevice, instantiate } from "./lib/tvm";
import { InitProgressCallback } from "./lib/tvm/runtime";
import { Config } from "./worker";

export class LLMInstance {
  config: Config;
  tvm: any;
  tokenizer: any;
  model: any;
  spp: any;
  processing: boolean;

  constructor(config: Config, sentencePieceProcessor: any) {
    this.config = config;
    this.tvm = undefined;
    this.tokenizer = undefined;
    this.model = undefined;
    this.spp = sentencePieceProcessor;
    this.processing = false;
  }

  isInitialized() {
    return this.model != undefined;
  }

  async init(cb: InitProgressCallback) {
    if (this.model) {
      return;
    }
    const wasmSource = await (await fetch(this.config.wasmUrl)).arrayBuffer();
    this.tvm = await instantiate(
      new Uint8Array(wasmSource),
      //@ts-ignore
      new EmccWASI(),
      console.log,
    );
    try {
      const output = await detectGPUDevice();
      if (output !== undefined) {
        this.tvm.initWebGPU(output.device);
      } else {
        throw Error("This browser env do not support WebGPU");
      }
    } catch (err: any) {
      throw Error("Find an error initializing WebGPU: " + err.toString());
    }
    this.tvm.registerInitProgressCallback(cb);
    await this.tvm.fetchNDArrayCache(this.config.cacheUrl, this.tvm.webgpu());

    this.tokenizer = await this.spp()(this.config.tokenizerUrl);
    this.model = this.tvm.withNewScope(() => {
      return new LLMInstanceScope(
        this.tvm,
        this.tokenizer,
        this.config.maxWindowSize
      );
    });
    return this.model.init();
  }

  async generate(request: GenerateTextRequest, cb: GenerateTextCallback) {
    if (this.processing) {
      return;
    }
    this.processing = true;
    await this.model.generate(request, cb);
    this.processing = false;
  }
}

export class LLMInstanceScope {
  tvm: any;
  tokenizer: any;
  maxWindowSize: number;
  device: any;
  vm: any;
  encoding: any;
  decoding: any;
  params: any;
  bosTokenId: number;
  eosTokenId: number;
  fclearKVCaches: any;
  kvCache: any;
  fcreateCache: any;
  logitsOnCPU: any;
  kvCacheLength: number;
  lastMessageId: string;

  constructor(tvm: any, tokenizer: any, maxWindowSize = 2048) {
    this.tvm = tvm;
    this.tokenizer = tokenizer;

    this.bosTokenId = 1;
    this.eosTokenId = 2;

    this.maxWindowSize = maxWindowSize;

    this.device = this.tvm.webgpu();

    this.vm = this.tvm.detachFromCurrentScope(
      this.tvm.createVirtualMachine(this.device)
    );
    this.encoding = this.tvm.detachFromCurrentScope(
      this.vm.getFunction("encoding")
    );
    this.decoding = this.tvm.detachFromCurrentScope(
      this.vm.getFunction("decoding")
    );
    this.params = this.tvm.detachFromCurrentScope(
      this.tvm.getParamsFromCache("param", this.tvm.cacheMetadata.ParamSize)
    );
    const fcreateCache = this.vm.getFunction("create_kv_cache");
    this.fclearKVCaches = this.tvm.detachFromCurrentScope(
      this.tvm.getGlobalFunc("vm.builtin.attention_kv_cache_array_clear")
    );

    // use extern config for now
    this.kvCache = this.tvm.detachFromCurrentScope(fcreateCache());
    // fill with pad token
    this.logitsOnCPU = undefined;

    this.kvCacheLength = 0;
    this.lastMessageId = "";
  }

  async init() {
    await this.tvm.asyncLoadWebGPUPiplines(this.vm.getInternalModule());
  }

  async getTokensFromStart(conversation: Conversation, maxTokens: number) {
    this.clearKVCache();
    const tokens = [];

    for (let i = conversation.messages.length - 1; i >= 0; i--) {
      const message = conversation.messages[i];
      const text = `${message.role}: ${message.text}\n`;
      const messageTokens = await this.tokenizer.encodeIds(text);
      if (
        tokens.length + messageTokens.length + maxTokens >
        this.maxWindowSize
      ) {
        break;
      }
      tokens.unshift(...(await this.tokenizer.encodeIds(text)));
    }
    tokens.unshift(
      ...(await this.tokenizer.encodeIds(conversation.systemPrompt))
    );
    tokens.unshift(this.bosTokenId);

    return tokens;
  }

  async getTokens(conversation: Conversation, maxTokens: number) {
    // Case 1. Attention Cache is empty, start from beginning
    // Case 2. Attention Cache is not empty, but the last message we processed is not in the cache, start from beginning
    // Case 3. Attention Cache is not empty, and the last message we processed is in the cache, start from the next message
    // Case 4. Attention Cache is not empty, and the last message we processed is in the cache, but the cache is too long, start from beginning
    if (this.kvCacheLength == 0) {
      // Case 1
      return await this.getTokensFromStart(conversation, maxTokens);
    }

    // Calculate the index of the last message we processed
    let startMsgIdx = 0;
    for (let i = conversation.messages.length - 1; i >= 0; i--) {
      if (conversation.messages[i].id == this.lastMessageId) {
        startMsgIdx = i + 1;
        break;
      }
    }

    if (startMsgIdx == 0) {
      // Case 2
      return await this.getTokensFromStart(conversation, maxTokens);
    }

    const tokens = [this.eosTokenId];
    for (let i = startMsgIdx; i < conversation.messages.length; i++) {
      const message = conversation.messages[i];
      const text = `${message.role}: ${message.text}`;
      const messageTokens = await this.tokenizer.encodeIds(text);
      if (
        tokens.length + messageTokens.length + maxTokens >
        this.maxWindowSize
      ) {
        // Case 4
        return await this.getTokensFromStart(conversation, maxTokens);
      }
      tokens.push(...(await this.tokenizer.encodeIds(text)));
    }

    // Case 3
    return tokens;
  }

  async generate(request: GenerateTextRequest, cb: GenerateTextCallback) {
    const { conversation, maxTokens, assistantRoleName, stopTexts } = request;
    const tokens = await this.getTokens(conversation, maxTokens);
    tokens.push(...(await this.tokenizer.encodeIds(`${assistantRoleName}:`)));
    console.log("debug: ", await this.tokenizer.decodeIds(tokens));

    const inputTokenLength = tokens.length;
    let outputText = "";
    let tstart = 0,
      tend = 0, step = 0;

    const id = uuidv4();
    for (; step < maxTokens; step++) {
      this.tvm.beginScope();
      tstart = performance.now();
      var input;
      if (step == 0) {
        input = this.tvm.empty([1, tokens.length], "int32", this.device);
        input.copyFrom(tokens);
      } else {
        input = this.tvm.empty([1, 1], "int32", this.device);
        input.copyFrom(tokens.slice(tokens.length - 1));
      }
      const logits = this.tvm.detachFromCurrentScope(
        this.forward(input, this.kvCacheLength + inputTokenLength + step)
      );
      this.tvm.endScope();
      const nextToken = await this.sampleTokenFromLogits(logits);
      logits.dispose();

      tokens.push(nextToken);
      const outputTokens = tokens.slice(inputTokenLength);
      outputText = this.tokenizer.decodeIds(outputTokens);
      tend = performance.now();
      if (nextToken == this.eosTokenId) break;
      const stopPos = outputText.lastIndexOf("</s>");
      if (stopPos != -1) {
        outputText = outputText.substring(0, stopPos);
        break;
      }
      let stop = false;
      for (let i = 0; i < stopTexts.length; i++) {
        if (outputText.endsWith(stopTexts[i])) {
          outputText = outputText.substring(
            0,
            outputText.length - stopTexts[i].length
          );
          stop = true;
          break;
        }
      }
      if (stop) break;
      if (step != 0) {
        cb({
          requestId: id,
          step: step,
          outputText,
          stats: {
            totalDecodingSeconds: (tend - tstart) / 1000,
            totalDecodedTokens: tokens.length - inputTokenLength,
            totalEncodedTokens: inputTokenLength,
          },
          isFinished: false,
        });
      }
    }
    this.kvCacheLength += tokens.length - 1;
    this.lastMessageId = id;

    cb({
      requestId: id,
      outputText,
      step: step,
      stats: {
        totalDecodingSeconds: (tend - tstart) / 1000,
        totalDecodedTokens: tokens.length - inputTokenLength,
        totalEncodedTokens: inputTokenLength,
      },
      isFinished: true,
    });
  }

  dispose() {
    // note: tvm instance is not owned by this class
    this.params.dispose();
    this.decoding.dispose();
    this.encoding.dispose();
    this.vm.dispose();
    this.kvCache.dispose();
    this.fclearKVCaches.dispose();
    if (this.logitsOnCPU != undefined) {
      this.logitsOnCPU.dispose();
    }
  }

  clearKVCache() {
    this.fclearKVCaches(this.kvCache);
    this.kvCacheLength = 0;
    this.lastMessageId = "";
  }

  forward(inputs: any, curPos: number) {
    this.tvm.beginScope();
    var retValue;
    const seqLenShape = this.tvm.makeShapeTuple([curPos]);
    if (inputs.shape[1] > 1) {
      retValue = this.encoding(inputs, seqLenShape, this.kvCache, this.params);
    } else {
      retValue = this.decoding(inputs, seqLenShape, this.kvCache, this.params);
    }
    const logits = this.tvm.detachFromCurrentScope(retValue.get(0));
    this.tvm.endScope();
    this.tvm.attachToCurrentScope(logits);
    return logits;
  }

  // NOTE: caller must call device.sync()
  updateLogitsOnCPU(logits: any) {
    if (this.logitsOnCPU == undefined) {
      this.logitsOnCPU = this.tvm.detachFromCurrentScope(
        this.tvm.empty(logits.shape, logits.dtype, this.tvm.cpu())
      );
    } else {
      if (logits.shape[0] != this.logitsOnCPU.shape[0]) {
        throw Error("We expect the size of logits to remain unchanged");
      }
    }
    this.logitsOnCPU.copyFrom(logits);
  }

  async sampleTokenFromLogits(logits: any, temperature = 0.8, top_p = 0.95) {
    this.tvm.beginScope();
    this.updateLogitsOnCPU(logits);
    this.tvm.endScope();
    await this.device.sync();
    return this.tvm.sampleTopPFromLogits(this.logitsOnCPU, temperature, top_p);
  }
}
