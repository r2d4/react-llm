interface GPUDeviceDetectOutput {
    adapter: GPUAdapter;
    adapterInfo: GPUAdapterInfo;
    device: GPUDevice;
}
/**
 * DetectGPU device in the environment.
 */
declare function detectGPUDevice(): Promise<GPUDeviceDetectOutput | undefined>;

/**
 * TVM JS Wasm Runtime library.
 */

interface InitProgressReport {
    type: 'init';
    progress: number;
    timeElapsed: number;
    currentChunk: number;
    totalChunks: number;
    fetchedBytes: number;
    totalBytes: number;
}
type InitProgressCallback = (report: InitProgressReport) => void;

interface Conversation {
    id: string;
    title: string;
    systemPrompt: string;
    createdAt: number;
    updatedAt: number;
    messages: Message[];
}
interface Message {
    id: string;
    role: string;
    text: string;
    createdAt: number;
    updatedAt: number;
}
type ModelAPI = {
    instance: null | LLMInstance;
    init(callback: InitCallback, config?: ModelInitConfig): void;
    generate(request: GenerateTextRequest, callback: GenerateTextCallback): void;
};
type ModelInitConfig = {
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
};
type InitCallback = InitProgressCallback;
type InitResponse = InitProgressReport;
type GenerateTextCallback = (data: GenerateTextResponse) => void;
type GenerateTextRequest = {
    conversation: Conversation;
    stopTexts: string[];
    maxTokens: number;
    assistantRoleName: string;
};
type GenerateTextResponse = {
    requestId: string;
    step: number;
    outputText: string;
    stats: {
        totalDecodingSeconds: number;
        totalDecodedTokens: number;
        totalEncodedTokens: number;
    };
    isFinished: boolean;
};

declare class LLMInstance {
    config: ModelInitConfig;
    tvm: any;
    tokenizer: any;
    model: any;
    spp: any;
    processing: boolean;
    constructor(config: ModelInitConfig, sentencePieceProcessor: any);
    isInitialized(): boolean;
    init(cb?: InitProgressCallback): Promise<any>;
    generate(request: GenerateTextRequest, cb?: GenerateTextCallback): Promise<void>;
}

export { Conversation, GenerateTextCallback, GenerateTextRequest, GenerateTextResponse, InitCallback, InitResponse, LLMInstance, Message, ModelAPI, ModelInitConfig, LLMInstance as default, detectGPUDevice };
