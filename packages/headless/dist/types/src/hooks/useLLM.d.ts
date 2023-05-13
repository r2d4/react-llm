import { InitProgressReport } from "@/worker/lib/tvm/runtime";
import { Conversation } from "../types/chat";
export type UseLLMParams = {
    autoInit?: boolean;
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
    userRoleName: string;
    setUserRoleName: (roleName: string) => void;
    assistantRoleName: string;
    setAssistantRoleName: (roleName: string) => void;
    send: (msg: string) => void;
    init: () => void;
};
export declare const useLLMContext: () => UseLLMResponse;
