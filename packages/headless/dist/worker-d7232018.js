import { e as expose, L as LLMInstance } from './comlink-34a1f4b2.js';

const defaultWorkerConfig = {
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
const API = (importScripts) => {
    return {
        instance: null,
        init(callback, config = defaultWorkerConfig) {
            importScripts(...[
                config.sentencePieceJsUrl, config.tvmRuntimeJsUrl
            ]);
            this.instance = new LLMInstance(config, () => globalThis.sentencepiece.sentencePieceProcessor);
            this.instance.init(callback);
        },
        generate(request, cb) {
            this.instance?.generate(request, cb);
        }
    };
};
expose(API(globalThis.importScripts));

export { defaultWorkerConfig };
