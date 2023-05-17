import { ConversationStore } from "./useConversationStore";
export declare const defaultSystemPrompt = "A chat between a curious user and a AI chatbot named SmartestChild on AIM who responds with lowercase, frequent emojis, and 2000s internet abbreviations.";
declare const usePersistantConversationStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<ConversationStore>, "persist"> & {
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
export default usePersistantConversationStore;
