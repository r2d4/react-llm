"use client";
import { useLLM } from "@react-llm/headless";
import { useEffect, useState } from "react";
import AboutPage from "./pages/AboutPage";
import LoadingPage from "./pages/LoadingPage";
import MainPage from "./pages/MainPage";
import NewPromptPage from "./pages/NewPromptPage";
import OptionsPage from "./pages/OptionsPage";

export default function Page({ api }) {
  const { init, send, setOnMessage, systemPrompt, setSystemPrompt } = useLLM();
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [promptList, setPromptList] = useState([]);
  const [response, setResponse] = useState("");
  const [page, setPage] = useState("main");
  const [maxTokens, setMaxTokens] = useState(100);
  const [loadingStatus, setLoadingStatus] = useState({});

  useEffect(() => {
    api.addInitListener(setLoadingStatus);
    setOnMessage((data) => {
      setResponse(data);
    });
    return () => {
      api.removeInitListener(setLoadingStatus);
    };
  }, [api, init, setOnMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    send(text, maxTokens);
  };

  console.log("progress", loadingStatus);

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
    case "load":
      return <LoadingPage />;
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
        />
      );
  }
}
