import { ModelInitConfig } from "@react-llm/model";
declare global {
    var importScripts: (...url: string[]) => void;
    var sentencepiece: {
        sentencePieceProcessor: (url: string) => void;
    };
}
export declare const defaultWorkerConfig: ModelInitConfig;
