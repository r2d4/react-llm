import React, { createContext, useContext } from "react";
import { UseLLMParams, UseLLMResponse, useLLMContext } from "../hooks/useLLM";

export interface ModelProviderProps {
  children: React.ReactNode;
  config?: UseLLMParams;
}

const ModelContext = createContext<UseLLMResponse | null>(null);

export const ModelProvider: React.FC<ModelProviderProps> = ({
  children,
  config = {} as UseLLMParams,
}) => {
  const LLMValue = useLLMContext(config);
  return (
    <ModelContext.Provider value={LLMValue}>{children}</ModelContext.Provider>
  );
};

export const useLLM = (props = {} as UseLLMParams): UseLLMResponse => {
  const context = useContext(ModelContext);
  if (context === null) {
    throw new Error("useLLMContext must be used within a LLMProvider");
  }
  return context;
};
