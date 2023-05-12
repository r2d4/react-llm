import * as React from "react";
import { UseLLMParams, UseLLMResponse } from "../hooks/useLLM";
interface ModelProviderProps {
    children: React.ReactNode;
    props?: UseLLMParams;
}
export declare const ModelProvider: React.FC<ModelProviderProps>;
export declare const useLLM: () => UseLLMResponse;
export {};
