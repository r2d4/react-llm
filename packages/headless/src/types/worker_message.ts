import { InitProgressReport } from "@/worker/lib/tvm/runtime";
import { Conversation } from "./chat";

export type ModelRequest = GenerateTextRequest | InitRequest;
export type ModelResponse = InitResponse | GenerateTextResponse | ModelErrorResponse | StartGenerateText | EndGenerateText;

export type GenerateTextRequest = {
    type: 'generateText',
    requestId: string,
    conversation: Conversation,
    stopTexts: string[],
    maxTokens: number,
    callback: (data: GenerateTextCallback) => void,
}

export type GenerateTextCallback = (data: GenerateTextResponse) => void;

export type GenerateTextResponse = {
    type: 'generateText',
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

export type StartGenerateText = {
    type: 'startGenerateText',
}

export type EndGenerateText = {
    type: 'endGenerateText',
}

export type ModelErrorResponse = {
    type: 'error',
    requestId: string,
    error: string,
}

export type InitRequest = {
    type: 'init',
}

export type InitResponse = InitProgressReport;

declare global {
    var importScripts: (...url: string[]) => void;
    var sentencepiece: {
        sentencePieceProcessor: (url: string) => void;
    };
}