import * as Comlink from 'comlink';
import { InitProgressCallback } from "../worker/lib/tvm/runtime";
import { Conversation } from "./chat";
export type ModelWorker = {
    init(callback: Comlink.ProxyOrClone<InitCallback>): void;
    generate(conversation: Conversation, stopTexts: string[], maxTokens: number, callback: Comlink.ProxyOrClone<GenerateTextCallback>): void;
};
export type InitCallback = InitProgressCallback;
export type GenerateTextCallback = (data: GenerateTextResponse) => void;
export type GenerateTextResponse = {
    type: 'generateText';
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
