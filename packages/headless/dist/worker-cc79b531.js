import { b as __awaiter, c as __generator, d as detectGPUDevice, i as instantiate, v as v4, e as expose } from './v4-2119d9d5.js';

var LLMInstance = /** @class */ (function () {
    function LLMInstance(config, sentencePieceProcessor) {
        this.config = config;
        this.tvm = undefined;
        this.tokenizer = undefined;
        this.model = undefined;
        this.spp = sentencePieceProcessor;
        this.processing = false;
    }
    LLMInstance.prototype.isInitialized = function () {
        return this.model != undefined;
    };
    LLMInstance.prototype.init = function (cb) {
        return __awaiter(this, void 0, void 0, function () {
            var wasmSource, _a, output, err_1, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.model) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, fetch(this.config.wasmUrl)];
                    case 1: return [4 /*yield*/, (_c.sent()).arrayBuffer()];
                    case 2:
                        wasmSource = _c.sent();
                        _a = this;
                        return [4 /*yield*/, instantiate(new Uint8Array(wasmSource), 
                            //@ts-ignore
                            new EmccWASI(), console.log)];
                    case 3:
                        _a.tvm = _c.sent();
                        _c.label = 4;
                    case 4:
                        _c.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, detectGPUDevice()];
                    case 5:
                        output = _c.sent();
                        if (output !== undefined) {
                            this.tvm.initWebGPU(output.device);
                        }
                        else {
                            throw Error("This browser env do not support WebGPU");
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _c.sent();
                        throw Error("Find an error initializing WebGPU: " + err_1.toString());
                    case 7:
                        this.tvm.registerInitProgressCallback(cb);
                        return [4 /*yield*/, this.tvm.fetchNDArrayCache(this.config.cacheUrl, this.tvm.webgpu())];
                    case 8:
                        _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.spp()(this.config.tokenizerUrl)];
                    case 9:
                        _b.tokenizer = _c.sent();
                        this.model = this.tvm.withNewScope(function () {
                            return new LLMInstanceScope(_this.tvm, _this.tokenizer, _this.config.maxWindowSize);
                        });
                        return [2 /*return*/, this.model.init()];
                }
            });
        });
    };
    LLMInstance.prototype.generate = function (request, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.processing) {
                            return [2 /*return*/];
                        }
                        this.processing = true;
                        return [4 /*yield*/, this.model.generate(request, cb)];
                    case 1:
                        _a.sent();
                        this.processing = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    return LLMInstance;
}());
var LLMInstanceScope = /** @class */ (function () {
    function LLMInstanceScope(tvm, tokenizer, maxWindowSize) {
        if (maxWindowSize === void 0) { maxWindowSize = 2048; }
        this.tvm = tvm;
        this.tokenizer = tokenizer;
        this.bosTokenId = 1;
        this.eosTokenId = 2;
        this.maxWindowSize = maxWindowSize;
        this.device = this.tvm.webgpu();
        this.vm = this.tvm.detachFromCurrentScope(this.tvm.createVirtualMachine(this.device));
        this.encoding = this.tvm.detachFromCurrentScope(this.vm.getFunction("encoding"));
        this.decoding = this.tvm.detachFromCurrentScope(this.vm.getFunction("decoding"));
        this.params = this.tvm.detachFromCurrentScope(this.tvm.getParamsFromCache("param", this.tvm.cacheMetadata.ParamSize));
        var fcreateCache = this.vm.getFunction("create_kv_cache");
        this.fclearKVCaches = this.tvm.detachFromCurrentScope(this.tvm.getGlobalFunc("vm.builtin.attention_kv_cache_array_clear"));
        // use extern config for now
        this.kvCache = this.tvm.detachFromCurrentScope(fcreateCache());
        // fill with pad token
        this.logitsOnCPU = undefined;
        this.kvCacheLength = 0;
        this.lastMessageId = "";
    }
    LLMInstanceScope.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tvm.asyncLoadWebGPUPiplines(this.vm.getInternalModule())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LLMInstanceScope.prototype.getTokensFromStart = function (conversation, maxTokens) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens, i, message, text, messageTokens, _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        this.clearKVCache();
                        tokens = [];
                        i = conversation.messages.length - 1;
                        _g.label = 1;
                    case 1:
                        if (!(i >= 0)) return [3 /*break*/, 5];
                        message = conversation.messages[i];
                        text = "".concat(message.role, ": ").concat(message.text, "\n");
                        return [4 /*yield*/, this.tokenizer.encodeIds(text)];
                    case 2:
                        messageTokens = _g.sent();
                        if (tokens.length + messageTokens.length + maxTokens >
                            this.maxWindowSize) {
                            return [3 /*break*/, 5];
                        }
                        _b = (_a = tokens.unshift).apply;
                        _c = [tokens];
                        return [4 /*yield*/, this.tokenizer.encodeIds(text)];
                    case 3:
                        _b.apply(_a, _c.concat([(_g.sent())]));
                        _g.label = 4;
                    case 4:
                        i--;
                        return [3 /*break*/, 1];
                    case 5:
                        _e = (_d = tokens.unshift).apply;
                        _f = [tokens];
                        return [4 /*yield*/, this.tokenizer.encodeIds(conversation.systemPrompt)];
                    case 6:
                        _e.apply(_d, _f.concat([(_g.sent())]));
                        tokens.unshift(this.bosTokenId);
                        return [2 /*return*/, tokens];
                }
            });
        });
    };
    LLMInstanceScope.prototype.getTokens = function (conversation, maxTokens) {
        return __awaiter(this, void 0, void 0, function () {
            var startMsgIdx, i, tokens, i, message, text, messageTokens, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(this.kvCacheLength == 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getTokensFromStart(conversation, maxTokens)];
                    case 1: 
                    // Case 1
                    return [2 /*return*/, _d.sent()];
                    case 2:
                        startMsgIdx = 0;
                        for (i = conversation.messages.length - 1; i >= 0; i--) {
                            if (conversation.messages[i].id == this.lastMessageId) {
                                startMsgIdx = i + 1;
                                break;
                            }
                        }
                        if (!(startMsgIdx == 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getTokensFromStart(conversation, maxTokens)];
                    case 3: 
                    // Case 2
                    return [2 /*return*/, _d.sent()];
                    case 4:
                        tokens = [this.eosTokenId];
                        i = startMsgIdx;
                        _d.label = 5;
                    case 5:
                        if (!(i < conversation.messages.length)) return [3 /*break*/, 11];
                        message = conversation.messages[i];
                        text = "".concat(message.role, ": ").concat(message.text);
                        return [4 /*yield*/, this.tokenizer.encodeIds(text)];
                    case 6:
                        messageTokens = _d.sent();
                        if (!(tokens.length + messageTokens.length + maxTokens >
                            this.maxWindowSize)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.getTokensFromStart(conversation, maxTokens)];
                    case 7: 
                    // Case 4
                    return [2 /*return*/, _d.sent()];
                    case 8:
                        _b = (_a = tokens.push).apply;
                        _c = [tokens];
                        return [4 /*yield*/, this.tokenizer.encodeIds(text)];
                    case 9:
                        _b.apply(_a, _c.concat([(_d.sent())]));
                        _d.label = 10;
                    case 10:
                        i++;
                        return [3 /*break*/, 5];
                    case 11: 
                    // Case 3
                    return [2 /*return*/, tokens];
                }
            });
        });
    };
    LLMInstanceScope.prototype.generate = function (request, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var conversation, maxTokens, assistantRoleName, stopTexts, tokens, _a, _b, _c, _d, _e, _f, inputTokenLength, outputText, tstart, tend, step, id, input, logits, nextToken, outputTokens, stopPos, stop_1, i;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        conversation = request.conversation, maxTokens = request.maxTokens, assistantRoleName = request.assistantRoleName, stopTexts = request.stopTexts;
                        return [4 /*yield*/, this.getTokens(conversation, maxTokens)];
                    case 1:
                        tokens = _g.sent();
                        _b = (_a = tokens.push).apply;
                        _c = [tokens];
                        return [4 /*yield*/, this.tokenizer.encodeIds("".concat(assistantRoleName, ":"))];
                    case 2:
                        _b.apply(_a, _c.concat([(_g.sent())]));
                        _e = (_d = console).log;
                        _f = ["debug: "];
                        return [4 /*yield*/, this.tokenizer.decodeIds(tokens)];
                    case 3:
                        _e.apply(_d, _f.concat([_g.sent()]));
                        inputTokenLength = tokens.length;
                        outputText = "";
                        tstart = 0, tend = 0, step = 0;
                        id = v4();
                        _g.label = 4;
                    case 4:
                        if (!(step < maxTokens)) return [3 /*break*/, 7];
                        this.tvm.beginScope();
                        tstart = performance.now();
                        if (step == 0) {
                            input = this.tvm.empty([1, tokens.length], "int32", this.device);
                            input.copyFrom(tokens);
                        }
                        else {
                            input = this.tvm.empty([1, 1], "int32", this.device);
                            input.copyFrom(tokens.slice(tokens.length - 1));
                        }
                        logits = this.tvm.detachFromCurrentScope(this.forward(input, this.kvCacheLength + inputTokenLength + step));
                        this.tvm.endScope();
                        return [4 /*yield*/, this.sampleTokenFromLogits(logits)];
                    case 5:
                        nextToken = _g.sent();
                        logits.dispose();
                        tokens.push(nextToken);
                        outputTokens = tokens.slice(inputTokenLength);
                        outputText = this.tokenizer.decodeIds(outputTokens);
                        tend = performance.now();
                        if (nextToken == this.eosTokenId)
                            return [3 /*break*/, 7];
                        stopPos = outputText.lastIndexOf("</s>");
                        if (stopPos != -1) {
                            outputText = outputText.substring(0, stopPos);
                            return [3 /*break*/, 7];
                        }
                        stop_1 = false;
                        for (i = 0; i < stopTexts.length; i++) {
                            if (outputText.endsWith(stopTexts[i])) {
                                outputText = outputText.substring(0, outputText.length - stopTexts[i].length);
                                stop_1 = true;
                                break;
                            }
                        }
                        if (stop_1)
                            return [3 /*break*/, 7];
                        if (step != 0) {
                            cb({
                                requestId: id,
                                step: step,
                                outputText: outputText,
                                stats: {
                                    totalDecodingSeconds: (tend - tstart) / 1000,
                                    totalDecodedTokens: tokens.length - inputTokenLength,
                                    totalEncodedTokens: inputTokenLength,
                                },
                                isFinished: false,
                            });
                        }
                        _g.label = 6;
                    case 6:
                        step++;
                        return [3 /*break*/, 4];
                    case 7:
                        this.kvCacheLength += tokens.length - 1;
                        this.lastMessageId = id;
                        cb({
                            requestId: id,
                            outputText: outputText,
                            step: step,
                            stats: {
                                totalDecodingSeconds: (tend - tstart) / 1000,
                                totalDecodedTokens: tokens.length - inputTokenLength,
                                totalEncodedTokens: inputTokenLength,
                            },
                            isFinished: true,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    LLMInstanceScope.prototype.dispose = function () {
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
    };
    LLMInstanceScope.prototype.clearKVCache = function () {
        this.fclearKVCaches(this.kvCache);
        this.kvCacheLength = 0;
        this.lastMessageId = "";
    };
    LLMInstanceScope.prototype.forward = function (inputs, curPos) {
        this.tvm.beginScope();
        var retValue;
        var seqLenShape = this.tvm.makeShapeTuple([curPos]);
        if (inputs.shape[1] > 1) {
            retValue = this.encoding(inputs, seqLenShape, this.kvCache, this.params);
        }
        else {
            retValue = this.decoding(inputs, seqLenShape, this.kvCache, this.params);
        }
        var logits = this.tvm.detachFromCurrentScope(retValue.get(0));
        this.tvm.endScope();
        this.tvm.attachToCurrentScope(logits);
        return logits;
    };
    // NOTE: caller must call device.sync()
    LLMInstanceScope.prototype.updateLogitsOnCPU = function (logits) {
        if (this.logitsOnCPU == undefined) {
            this.logitsOnCPU = this.tvm.detachFromCurrentScope(this.tvm.empty(logits.shape, logits.dtype, this.tvm.cpu()));
        }
        else {
            if (logits.shape[0] != this.logitsOnCPU.shape[0]) {
                throw Error("We expect the size of logits to remain unchanged");
            }
        }
        this.logitsOnCPU.copyFrom(logits);
    };
    LLMInstanceScope.prototype.sampleTokenFromLogits = function (logits, temperature, top_p) {
        if (temperature === void 0) { temperature = 0.8; }
        if (top_p === void 0) { top_p = 0.95; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.tvm.beginScope();
                        this.updateLogitsOnCPU(logits);
                        this.tvm.endScope();
                        return [4 /*yield*/, this.device.sync()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.tvm.sampleTopPFromLogits(this.logitsOnCPU, temperature, top_p)];
                }
            });
        });
    };
    return LLMInstanceScope;
}());

var config = {
    kvConfig: {
        numLayers: 64,
        shape: [32, 32, 128],
        dtype: 'float32',
    },
    wasmUrl: 'https://huggingface.co/mrick/react-llm/resolve/main/models/vicuna-7b-v1/vicuna-7b-v1_webgpu.wasm',
    cacheUrl: 'https://huggingface.co/mrick/react-llm/resolve/main/models/vicuna-7b-v1/params/',
    tokenizerUrl: 'https://huggingface.co/mrick/react-llm/resolve/main/models/vicuna-7b-v1/tokenizer.model',
    sentencePieceJsUrl: 'https://cdn.matt-rickard.com/code/sentencepiece.js',
    tvmRuntimeJsUrl: 'https://cdn.matt-rickard.com/code/tvmjs_runtime.wasi.js',
    maxWindowSize: 2048,
};
var instance = new LLMInstance(config, function () { return globalThis.sentencepiece.sentencePieceProcessor; });
var worker = {
    init: function (callback) {
        instance.init(callback);
    },
    generate: function (request, cb) {
        instance.generate(request, cb);
    }
};
importScripts.apply(void 0, [
    config.sentencePieceJsUrl, config.tvmRuntimeJsUrl
]);
expose(worker);
