import { Conversation, Message } from "@react-llm/model";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

export interface ConversationStore {
  conversations: Conversation[];
  currentConversationId: string;
  setConversationId: (conversationId: string) => void;

  addMessage: (conversationId: string, message: Message) => void;
  getConversation: (conversationId: string) => Conversation | undefined;

  setConversationTitle: (conversationId: string, title: string) => void;

  getAllConversations: () => Conversation[];
  deleteMessages: (conversationId: string) => void;

  deleteConversation: (conversationId: string) => void;
  createConversation: (conversation: Conversation) => void;
  deleteAllConversations: () => void;
}

export const defaultSystemPrompt =
  "A chat between a curious user and a AI chatbot named SmartestChild on AIM who responds with lowercase, frequent emojis, and 2000s internet abbreviations.";

const useConversationStore = create<ConversationStore>()((set, get) => {
  const initialConversation = {
    id: uuidv4(),
    title: "Untitled",
    updatedAt: new Date().getTime(),
    systemPrompt: defaultSystemPrompt,
    createdAt: new Date().getTime(),
    messages: [] as Message[],
  };

  return {
    conversations: [initialConversation],
    currentConversationId: initialConversation.id,
    createConversation: (conversation: Conversation) => {
      set((state) => {
        return {
          currentConversationId: conversation.id,
          conversations: [...state.conversations, conversation],
        };
      });
    },
    setConversationTitle(conversationId, title) {
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
              title,
            },
          ],
        };
      });
    },
    deleteConversation(conversationId: string) {
      set((state) => {
        return {
          conversations: state.conversations.filter(
            (c) => c.id !== conversationId
          ),
        };
      });
    },
    setConversationId: (conversationId: string) => {
      const conversationExists = get().conversations.some(
        (c) => c.id === conversationId
      );
      if (!conversationExists) {
        throw new Error("Invalid conversation id");
      }

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
  };
});

export default useConversationStore;
