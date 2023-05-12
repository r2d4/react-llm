import { InitProgressReport } from "@/worker/lib/tvm/runtime";
import * as Comlink from "comlink";
import { Remote } from "comlink";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Conversation } from "../types/chat";
import { GenerateTextResponse, ModelWorker } from "../types/worker_message";
import useConversationStore, {
  defaultSystemPrompt,
} from "./useConversationStore";
import useStore from "./useStore";

export type UseLLMParams = {
  autoInit?: boolean;
};

const initialProgress = {
  type: "init" as const,
  progress: 0,
  timeElapsed: 0,
  currentChunk: 0,
  totalChunks: 0,
  fetchedBytes: 0,
  totalBytes: 0,
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

export const useLLMContext = (): UseLLMResponse => {
  const [loadingStatus, setLoadingStatus] =
    useState<InitProgressReport>(initialProgress);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [maxTokens, setMaxTokens] = useState<number>(100);
  const workerRef = useRef<Remote<ModelWorker>>();
  const cStore = useStore(useConversationStore, (state) => state);

  const addMessage = useCallback(
    (resp: GenerateTextResponse) => {
      if (resp.isFinished) {
        setIsGenerating(false);
      }
      cStore?.addMessage(cStore?.currentConversationId, {
        id: resp.requestId,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        role: "assistant",
        text: resp.outputText,
      });
    },
    [cStore, cStore?.currentConversationId]
  );

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = Comlink.wrap(
        new Worker(new URL("../worker/worker", import.meta.url))
      );
    }
  }, []);

  const send = (msg: string) => {
    const currentConversation = cStore?.getConversation(
      cStore?.currentConversationId
    );
    if (!currentConversation) {
      throw new Error("Invalid conversation id");
    }
    currentConversation?.messages.push({
      id: uuidv4(),
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      role: "user",
      text: msg,
    });
    setIsGenerating(true);
    workerRef?.current?.generate(
      currentConversation,
      [],
      maxTokens,
      Comlink.proxy(addMessage)
    );
  };

  return {
    conversation: cStore?.getConversation(cStore?.currentConversationId),
    allConversations: cStore?.conversations,

    createConversation: (title?: string, prompt?: string) => {
      const id = uuidv4();
      console.log("title", title, "prmpt", prompt);
      console.log("to create", {
        id,
        title: title ?? "Untitled",
        systemPrompt: prompt ?? defaultSystemPrompt,
        messages: [],
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      });
      cStore?.createConversation({
        id,
        title: title ?? "Untitled",
        systemPrompt: prompt ?? defaultSystemPrompt,
        messages: [],
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      });
    },

    setConversationId: (id: string) => {
      cStore?.setConversationId(id);
    },

    deleteConversation: (id: string) => {
      cStore?.deleteConversation(id);
    },
    deleteMessages: () => cStore?.deleteMessages(cStore?.currentConversationId),

    maxTokens,
    setMaxTokens,
    loadingStatus,
    isGenerating,

    send,
    init: () => workerRef?.current?.init(Comlink.proxy(setLoadingStatus)),

    deleteAllConversations: () => cStore?.deleteAllConversations(),
  };
};
