/// <reference types="@webgpu/types" />
import { InitProgressReport } from "@/worker/lib/tvm/runtime";
import { Conversation } from "../types/chat";
import { GenerateTextResponse } from "../types/worker_message";
export type UseLLMParams = {
    autoInit?: boolean;
};
export type GPUDeviceInfo = {
    adapter: GPUAdapter | null;
    device: GPUDevice | null;
    adapterInfo: GPUAdapterInfo | null;
    checked: boolean;
    unsupportedReason: string | null;
};
export type UseLLMResponse = {
    conversation: Conversation | undefined;
    allConversations: Conversation[] | undefined;
    loadingStatus: InitProgressReport;
    isGenerating: boolean;
    createConversation: (title?: string, prompt?: string) => void;
    setConversationId: (conversationId: string) => void;
    deleteConversation: (conversationId: string) => void;
    deleteAllConversations: () => void;
    deleteMessages: () => void;
    setConversationTitle: (conversationId: string, title: string) => void;
    onMessage: (msg: GenerateTextResponse) => void;
    setOnMessage: (cb: (msg: GenerateTextResponse) => void) => void;
    userRoleName: string;
    setUserRoleName: (roleName: string) => void;
    assistantRoleName: string;
    setAssistantRoleName: (roleName: string) => void;
    gpuDevice: GPUDeviceInfo;
    send: (text: string, maxToken: number, stopSequences: string[]) => void;
    init: () => void;
};
export declare const useLLMContext: () => UseLLMResponse;
