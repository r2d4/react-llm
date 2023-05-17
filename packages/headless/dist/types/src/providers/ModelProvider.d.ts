import React from "react";
import { UseLLMParams, UseLLMResponse } from "../hooks/useLLM";
export interface ModelProviderProps {
    children: React.ReactNode;
    config?: UseLLMParams;
}
export declare const ModelProvider: React.FC<ModelProviderProps>;
export declare const useLLM: () => UseLLMResponse;
