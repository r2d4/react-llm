import { InitProgressReport } from "@/worker/lib/tvm/runtime";
import { Conversation } from "../types/chat";
export type UseLLMParams = {
    autoInit?: boolean;
};
export type UseLLMResponse = {
    conversation: Conversation | undefined;
    allConversations: Conversation[] | undefined;
    maxTokens: number;
    loadingStatus: InitProgressReport;
    isGenerating: boolean;
    createConversation: (title?: string, prompt?: string) => void;
    setConversationId: (conversationId: string) => void;
    deleteConversation: (conversationId: string) => void;
    deleteAllConversations: () => void;
    deleteMessages: () => void;
    send: (msg: string) => void;
    init: () => void;
    setMaxTokens: (n: number) => void;
};
export declare const useLLMContext: () => UseLLMResponse;
