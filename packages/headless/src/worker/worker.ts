import { GenerateTextCallback, GenerateTextRequest, InitCallback, LLMInstance, ModelAPI, ModelInitConfig } from "@react-llm/model";
import * as Comlink from "comlink";

declare global {
    var importScripts: (...url: string[]) => void;
    var sentencepiece: {
        sentencePieceProcessor: (url: string) => void;
    };
}

export const defaultWorkerConfig = {
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
} as ModelInitConfig;

const API = (importScripts: (...urls: string[]) => void) => {
    return {
        instance: null as LLMInstance | null,
        init(callback: Comlink.ProxyOrClone<InitCallback>, config = defaultWorkerConfig) {
            callback({
                type: 'init',
                progress: 0.01,
                timeElapsed: 0,
                currentChunk: 0,
                totalChunks: 0,
                fetchedBytes: 0,
                totalBytes: 0
            })
            importScripts(...[
                config.sentencePieceJsUrl, config.tvmRuntimeJsUrl
            ]);
            this.instance = new LLMInstance(config, () => globalThis.sentencepiece.sentencePieceProcessor);
            this.instance.init(callback);
        },
        generate(request: GenerateTextRequest, cb: Comlink.ProxyOrClone<GenerateTextCallback>) {
            this.instance?.generate(request, cb);
        }
    } as ModelAPI;
}


Comlink.expose(API(globalThis.importScripts));
