import { LLMInstance } from "@react-llm/model";

const defaultWorkerConfig = {
  kvConfig: {
    numLayers: 64,
    shape: [32, 32, 128],
    dtype: "float32",
  },
  wasmUrl: "/models/vicuna-7b-v1/vicuna-7b-v1_webgpu.wasm",
  cacheUrl:
    "https://huggingface.co/mrick/react-llm/resolve/main/models/vicuna-7b-v1/params/",
  tokenizerUrl: "/models/vicuna-7b-v1/tokenizer.model",
  sentencePieceJsUrl: "/models/sentencepiece.js",
  tvmRuntimeJsUrl: "/models/tvmjs_runtime.wasi.js",
  maxWindowSize: 2048,
};

const defaultSystemPrompt =
  "A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user's questions and always follows the users instructions.";

const API = {
  instance: null,
  initialized: false,
  loadingStatus: {
    progress: 0,
  },
  initListeners: [],
  systemPrompt: defaultSystemPrompt,
  promptTemplates: ["$TEXT"],
  addInitListener(cb) {
    this.initListeners.push(cb);
    cb(this.loadingStatus);
  },
  removeInitListener(cb) {
    this.initListeners = this.initListeners.filter((c) => c !== cb);
  },
  init(cb = console.log, config = defaultWorkerConfig) {
    if (this.initialized) return;
    this.instance = new LLMInstance(
      config,
      // eslint-disable-next-line no-undef
      () => globalThis.sentencepiece.sentencePieceProcessor
    );
    this.initialized = true;
    this.instance.init((resp) => {
      cb(resp);
      this.loadingStatus = resp;
      console.log("init: ", resp);
      this.initListeners.forEach((cb) => cb(resp));
    });
  },
  generate(request, cb = console.log) {
    console.log("generate request: ", request);
    this.instance?.generate(request, (resp) => {
      console.log("generate: ", resp);
      cb(resp);
    });
  },
};

// eslint-disable-next-line no-undef
globalThis.API = API;
