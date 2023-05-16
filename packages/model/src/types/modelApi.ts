import { LLMInstance } from '../model/llm';
import { InitProgressCallback, InitProgressReport } from '../tvm/runtime';

export interface Conversation {
    id: string;
    title: string;
    systemPrompt: string;
    createdAt: number;
    updatedAt: number;
    messages: Message[];
}

export interface Message {
    id: string;
    role: string;
    text: string;
    createdAt: number;
    updatedAt: number;
}

export type ModelAPI = {
    instance: null | LLMInstance;
    init(callback: InitCallback, config?: ModelInitConfig): void;
    generate(request: GenerateTextRequest, callback: GenerateTextCallback): void;
}

export type ModelInitConfig = {
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

export type InitCallback = InitProgressCallback;
export type InitResponse = InitProgressReport;
export type GenerateTextCallback = (data: GenerateTextResponse) => void;

export type GenerateTextRequest = {
    conversation: Conversation,
    stopTexts: string[],
    maxTokens: number,
    assistantRoleName: string,
}

export type GenerateTextResponse = {
    requestId: string,
    step: number,
    outputText: string,
    stats: {
        totalDecodingSeconds: number,
        totalDecodedTokens: number,
        totalEncodedTokens: number,
    }
    isFinished: boolean,
}


