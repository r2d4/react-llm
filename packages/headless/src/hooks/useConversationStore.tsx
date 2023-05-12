import { Conversation, Message } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  // addConversation: (conversation: Conversation) => void;
  // updateConversation: (conversation: Conversation) => void;
}

export const defaultSystemPrompt =
  "A chat between a curious user and an artificial intelligence assistant. " +
  "The assistant gives helpful, detailed, and polite answers to the user's questions.";

const useConversationStore = create<ConversationStore>()(
  persist(
    (set, get) => ({
      conversations: [
        {
          id: uuidv4(),
          systemPrompt: defaultSystemPrompt,
          createdAt: new Date().getTime(),
          messages: [] as Message[],
        },
      ] as Conversation[],
      conversationId: "",
      createConversation: (conversation: Conversation) => {
        set((state) => {
          return {
            conversationId: conversation.id,
            conversations: [...state.conversations, conversation],
          };
        });
      },
      setConversationId: (conversationId: string) => {
        set((state) => {
          return {
            ...state,
            currentConversationId: conversationId,
          };
        });
      },
      deleteAllConversations: () => {
        set((state) => {
          return {
            conversations: [],
          };
        });
      },
      deleteMessages: (conversationId) => {
        set((state) => {
          const conversation = state.conversations.find(
            (c) => c.id === conversationId
          );
          if (!conversation) {
            return state;
          }
          return {
            conversations: [
              ...state.conversations.filter((c) => c.id !== conversationId),
              {
                ...conversation,
                updatedAt: new Date().getTime(),
                messages: [],
              },
            ],
          };
        });
      },
      getConversation(conversationId) {
        return get().conversations.find((c) => c.id === conversationId);
      },
      getAllConversations() {
        return get().conversations;
      },
      addMessage: (conversationId, message) => {
        set((state) => {
          const conversation = state.conversations.find(
            (c) => c.id === conversationId
          );
          if (!conversation) {
            return state;
          }
          const existingMessage = conversation.messages.find(
            (m) => m.id === message.id
          );
          if (existingMessage) {
            // Update message
            return {
              conversations: [
                ...state.conversations.filter((c) => c.id !== conversationId),
                {
                  ...conversation,
                  updatedAt: new Date().getTime(),
                  messages: [
                    ...conversation.messages.filter((m) => m.id !== message.id),
                    message,
                  ],
                },
              ],
            };
          }
          // Add message
          return {
            conversations: [
              ...state.conversations.filter((c) => c.id !== conversationId),
              {
                ...conversation,
                updatedAt: new Date().getTime(),
                messages: [...conversation.messages, message],
              },
            ],
          };
        });
      },
    }),
    {
      name: "chat-store",
      getStorage: () => sessionStorage,
    }
  )
);

export default useConversationStore;
