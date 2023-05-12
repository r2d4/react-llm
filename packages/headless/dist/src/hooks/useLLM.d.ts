import { Conversation } from "@/types/chat";
type UseLLMParams = {
    autoInit?: boolean;
};
declare const useLLM: (props: UseLLMParams | undefined) => {
    conversationId: string | undefined;
    loadingStatus: import("../worker/lib/tvm/runtime").InitProgressReport;
    error: string;
    sendUserMessage: (text: string) => void;
    isGenerating: boolean;
    maxTokens: number;
    init: () => void | undefined;
    setMaxTokens: import("react").Dispatch<import("react").SetStateAction<number>>;
    allConversations: Conversation[] | undefined;
    conversation: Conversation | undefined;
    createConversation: (c: Conversation) => void | undefined;
    deleteAllConversations: () => void | undefined;
    clearMessages: () => void | undefined;
};
export default useLLM;
