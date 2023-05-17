"use client";
import { useLLM } from "@react-llm/headless";
import { useCallback, useEffect, useState } from "react";
import AboutPage from "./pages/AboutPage";
import LoadingPage from "./pages/LoadingPage";
import MainPage from "./pages/MainPage";
import NewPromptPage from "./pages/NewPromptPage";
import OptionsPage from "./pages/OptionsPage";

export default function Page({
  loadingStatus,
  loadedSystemPrompt,
  loadedPromptList,
  setPersistedPromptList,
  setPersistedSystemPrompt,
}) {
  const {
    send,
    setOnMessage,
    isGenerating,
    setConversationPrompt,
    conversation,
  } = useLLM();
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [page, setPage] = useState("main");
  const [maxTokens, setMaxTokens] = useState(100);
  const [systemPrompt, setSystemPrompt] = useState(loadedSystemPrompt);
  const [promptList, setPromptList] = useState(loadedPromptList);
  const [prompt, setPrompt] = useState(loadedPromptList && loadedPromptList[0]);

  useEffect(() => {
    return () => {
      setPersistedPromptList(promptList);
      setPersistedSystemPrompt(systemPrompt);
    };
  });

  useEffect(() => {
    setOnMessage(() => (data) => {
      console.log(data);
      setResponse(data);
    });
  }, [setOnMessage]);

  useEffect(() => {
    if (conversation?.systemPrompt !== systemPrompt) {
      setConversationPrompt(systemPrompt);
    }
  }, [systemPrompt, conversation]);

  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      const tmpl = prompt ? prompt.replace(/\$TEXT/g, text) : text;
      send(tmpl, maxTokens);
    },
    [send, prompt, text, maxTokens]
  );

  if (loadingStatus.progress < 1) {
    return <LoadingPage progress={loadingStatus.progress} />;
  }

  switch (page) {
    case "about":
      return <AboutPage setPage={setPage} />;
    case "options":
      return (
        <OptionsPage
          setPage={setPage}
          maxTokens={maxTokens}
          setMaxTokens={setMaxTokens}
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
        />
      );
    case "newPrompt":
      return (
        <NewPromptPage
          setPage={setPage}
          promptList={promptList}
          setPromptList={setPromptList}
        />
      );
    default:
      return (
        <MainPage
          prompt={prompt}
          setPrompt={setPrompt}
          promptList={promptList}
          handleSubmit={handleSubmit}
          setPage={setPage}
          response={response}
          text={text}
          setText={setText}
          isGenerating={isGenerating}
        />
      );
  }
}
