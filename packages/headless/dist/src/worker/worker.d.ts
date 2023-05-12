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
};