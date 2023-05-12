import * as Comlink from "comlink";
import { GenerateTextCallback, GenerateTextRequest, ModelWorker } from "../types/worker_message";
import { InitProgressCallback } from '../worker/lib/tvm/runtime';
import { LLMInstance } from '../worker/llm';

declare global {
    var importScripts: (...url: string[]) => void;
    var sentencepiece: {
        sentencePieceProcessor: (url: string) => void;
    };
}

const config = {
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
} as Config;

export type Config = {
    kvConfig: {
        numLayers: number;
        shape: number[];
        dtype: string;
    };
    wasmUrl: string;
    cacheUrl: string;
    tokenizerUrl: string;
    sentencePieceJsUrl: string;
    tvmRuntimeJsUrl: string;
    maxWindowSize: number;
}
const instance = new LLMInstance(config, () => globalThis.sentencepiece.sentencePieceProcessor);
const worker = {
    init(callback: Comlink.ProxyOrClone<InitProgressCallback>) {
        instance.init(callback);
    },
    generate(request: GenerateTextRequest, cb: Comlink.ProxyOrClone<GenerateTextCallback>) {
        instance.generate(request, cb);
    }
} as ModelWorker;

importScripts(...[
    config.sentencePieceJsUrl, config.tvmRuntimeJsUrl
]);

Comlink.expose(worker);
