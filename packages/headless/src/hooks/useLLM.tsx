import { Conversation, Message } from "@/types/chat";
import {
  GenerateTextRequest,
  GenerateTextResponse,
  InitRequest,
  InitResponse,
  ModelErrorResponse,
  ModelResponse,
} from "@/types/worker_message";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useConversationStore, {
  defaultSystemPrompt,
} from "./useConversationStore";
import useStore from "./useStore";

type UseLLMParams = {
  autoInit?: boolean;
};

type StatsPayload = {
  encodingTotalTime: number;
  encodingTotalTokens: number;
  decodingTotalTime: number;
  decodingTotalTokens: number;
};

const useLLM = (props: UseLLMParams | undefined) => {
  const [loadingStatus, setLoadingStatus] = useState<InitResponse>({
    type: "init",
    progress: 0,
    timeElapsed: 0,
    currentChunk: 0,
    totalChunks: 0,
    fetchedBytes: 0,
    totalBytes: 0,
  });
  const [maxTokens, setMaxTokens] = useState<number>(100);
  const [error, setError] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const workerRef = useRef<Worker>();
  const cStore = useStore(useConversationStore, (state) => state);

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../worker/worker", import.meta.url)
      );
    }

    if (props?.autoInit) {
      workerRef.current?.postMessage({
        type: "init",
      } as InitRequest);
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (!workerRef.current) {
      return;
    }
    workerRef.current.onmessage = (event: MessageEvent<ModelResponse>) => {
      console.log(event.data);
      switch (event.data.type) {
        case "init":
          setLoadingStatus(event.data as InitResponse);
          break;
        case "error":
          setError((event.data as ModelErrorResponse).error);
          break;
        case "startGenerateText":
          setIsGenerating(true);
          break;
        case "generateText":
          const resp = event.data as GenerateTextResponse;
          cStore?.addMessage(cStore?.conversationId, {
            id: resp.requestId,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            role: "assistant",
            text: resp.outputText,
          });
          if (resp.isFinished) {
            setIsGenerating(false);
          }
      }
    };
  }, [cStore?.conversationId, workerRef]);

  useEffect(() => {
    if (cStore?.conversationId === "" && cStore.conversations.length > 0) {
      cStore.conversationId =
        cStore?.conversations[cStore?.conversations.length - 1].id;
    }
  }, [cStore?.conversationId, cStore?.conversations]);

  const sendUserMessage = (text: string) => {
    if (loadingStatus.progress !== 1 || isGenerating) {
      console.log("model not ready");
      return;
    }
    const msg = {
      id: uuidv4(),
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      role: "user",
      text,
    } as Message;

    let conversation = cStore?.getConversation(cStore?.conversationId);
    if (!conversation) {
      conversation = {
        id: uuidv4(),
        systemPrompt: defaultSystemPrompt,
        title: "Untitled",
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        messages: [msg],
      } as Conversation;
      cStore?.createConversation(conversation);
    } else {
      cStore?.addMessage(conversation.id, {
        id: uuidv4(),
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        role: "user",
        text,
      });
    }

    workerRef.current?.postMessage({
      type: "generateText",
      conversation: {
        ...conversation,
        messages: [...conversation.messages, msg],
      },
      maxTokens,
    } as GenerateTextRequest);
  };

  return {
    conversationId: cStore?.conversationId,
    loadingStatus,
    error,
    sendUserMessage,
    isGenerating,
    maxTokens,
    init: () =>
      workerRef.current?.postMessage({
        type: "init",
      } as InitRequest),
    setMaxTokens,
    allConversations: cStore?.conversations,
    conversation: cStore?.getConversation(cStore?.conversationId),
    createConversation: (c: Conversation) => cStore?.createConversation(c),
    deleteAllConversations: () => cStore?.deleteAllConversations(),
    clearMessages: () => cStore?.deleteMessages(cStore?.conversationId),
  };
};

export default useLLM;
