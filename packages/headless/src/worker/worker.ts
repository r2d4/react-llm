import { GenerateTextResponse, ModelErrorResponse, ModelRequest } from '@/types/worker_message';
import { InitProgressCallback, InitProgressReport } from '@/worker/lib/tvm/runtime';
import { LLMInstance } from '@/worker/llm';


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

const imports = [
    config.sentencePieceJsUrl, config.tvmRuntimeJsUrl
]

const initialProgressCallback = (report: InitProgressReport) => {
    globalThis.postMessage(report)
};
const instance = new LLMInstance(config, () => globalThis.sentencepiece.sentencePieceProcessor);
globalThis.addEventListener(
    'message',
    ({ data }: { data: ModelRequest }) => {
        console.log("Message received", data)
        if (data.type === 'init') {
            if (instance.isInitialized()) {
                return;
            }
            globalThis.importScripts(...imports);
            instance.init(initialProgressCallback as InitProgressCallback)
            return;
        }
        if (!instance.isInitialized()) {
            globalThis.postMessage({
                requestId: data.requestId,
                type: 'error',
                error: 'Model is not initialized',
            } as ModelErrorResponse);
            return;
        }
        if (data.type === 'generateText') {
            globalThis.postMessage({
                type: 'startGenerateText',
            })
            instance.generate(data.conversation, data.stopTexts, data.maxTokens, (res: GenerateTextResponse) => {
                globalThis.postMessage(res);
            });
        }
    },
    { passive: true },
);


