import { Conversation, Message } from "@/types/chat";
export interface ConversationStore {
    conversations: Conversation[];
    conversationId: string;
    setConversationId: (conversationId: string) => void;
    addMessage: (conversationId: string, message: Message) => void;
    getConversation: (conversationId: string) => Conversation | undefined;
    getAllConversations: () => Conversation[];
    deleteMessages: (conversationId: string) => void;
    createConversation: (conversation: Conversation) => void;
    deleteAllConversations: () => void;
}
export declare const defaultSystemPrompt: string;
declare const useConversationStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<ConversationStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<ConversationStore, ConversationStore>>) => void;
        clearStorage: () => void;
        rehydrate: () => void | Promise<void>;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: ConversationStore) => void) => () => void;
        onFinishHydration: (fn: (state: ConversationStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<ConversationStore, ConversationStore>>;
    };
}>;
export default useConversationStore;
