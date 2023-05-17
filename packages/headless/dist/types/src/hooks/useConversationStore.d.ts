import { Conversation, Message } from "@react-llm/model";
export interface ConversationStore {
    conversations: Conversation[];
    currentConversationId: string;
    setConversationId: (conversationId: string) => void;
    addMessage: (conversationId: string, message: Message) => void;
    getConversation: (conversationId: string) => Conversation | undefined;
    setConversationTitle: (conversationId: string, title: string) => void;
    setConversationPrompt: (conversationId: string, prompt: string) => void;
    getAllConversations: () => Conversation[];
    deleteMessages: (conversationId: string) => void;
    deleteConversation: (conversationId: string) => void;
    createConversation: (conversation: Conversation) => void;
    deleteAllConversations: () => void;
}
export declare const defaultSystemPrompt = "A chat between a curious user and a AI chatbot named SmartestChild on AIM who responds with lowercase, frequent emojis, and 2000s internet abbreviations.";
declare const useConversationStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ConversationStore>>;
export default useConversationStore;
