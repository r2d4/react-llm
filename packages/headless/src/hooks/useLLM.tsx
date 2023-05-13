import { InitProgressReport } from "@/worker/lib/tvm/runtime";
import * as Comlink from "comlink";
import { Remote } from "comlink";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Conversation } from "../types/chat";
import {
  GenerateTextRequest,
  GenerateTextResponse,
  ModelWorker,
} from "../types/worker_message";
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

  send: (msg: string) => void;
  init: () => void;
};

export const useLLMContext = (): UseLLMResponse => {
  const [loadingStatus, setLoadingStatus] =
    useState<InitProgressReport>(initialProgress);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const workerRef = useRef<Remote<ModelWorker>>();
  const cStore = useStore(useConversationStore, (state) => state);
  const [userRoleName, setUserRoleName] = useState<string>("user");
  const [assistantRoleName, setAssistantRoleName] =
    useState<string>("assistant");

  const [onMessage, setOnMessage] = useState<any>();

  const addMessage = useCallback(
    (resp: GenerateTextResponse) => {
      if (resp.isFinished) {
        setIsGenerating(false);
      }
      if (onMessage) onMessage(resp);
      cStore?.addMessage(cStore?.currentConversationId, {
        id: resp.requestId,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        role: assistantRoleName,
        text: resp.outputText,
      });
    },
    [cStore, cStore?.currentConversationId, onMessage, setOnMessage]
  );

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = Comlink.wrap(
        new Worker(new URL("../worker/worker", import.meta.url))
      );
    }
  }, []);

  const send = (
    msg: string,
    maxTokens = 100,
    stopStrings = [userRoleName, assistantRoleName] as string[]
  ) => {
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
      role: userRoleName,
      text: msg,
    });
    setIsGenerating(true);
    workerRef?.current?.generate(
      {
        conversation: currentConversation,
        stopTexts: stopStrings,
        maxTokens,
        assistantRoleName,
      } as GenerateTextRequest,
      Comlink.proxy(addMessage)
    );
  };

  return {
    conversation: cStore?.getConversation(cStore?.currentConversationId),

    allConversations: cStore?.conversations.sort(
      (a: Conversation, b: Conversation) => b.updatedAt - a.updatedAt
    ),

    createConversation: (title?: string, prompt?: string) => {
      const id = uuidv4();
      cStore?.createConversation({
        id,
        title: title ?? "Untitled",
        systemPrompt: prompt ?? defaultSystemPrompt,
        messages: [],
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      });
    },

    setConversationTitle: (id: string, title: string) => {
      cStore?.setConversationTitle(id, title);
    },

    setConversationId: (id: string) => {
      cStore?.setConversationId(id);
    },

    deleteConversation: (id: string) => {
      cStore?.deleteConversation(id);
    },
    deleteMessages: () => cStore?.deleteMessages(cStore?.currentConversationId),

    onMessage,
    setOnMessage,

    loadingStatus,
    isGenerating,

    userRoleName,
    setUserRoleName,

    assistantRoleName,
    setAssistantRoleName,

    send,
    init: () => workerRef?.current?.init(Comlink.proxy(setLoadingStatus)),

    deleteAllConversations: () => cStore?.deleteAllConversations(),
  };
};
