import React, { useEffect, useRef } from "react";
import TextArea from "./Textarea";
const MainPage = ({
  prompt,
  setPrompt,
  handleSubmit,
  promptList,
  setPage,
  response,
  text,
  setText,
  isGenerating,
}) => {
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [response, isGenerating]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      console.log(event);
      if (event.metaKey && event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col m-auto p-3 text-sm gap-2 relative">
        <div
          className="absolute right-0 top-0 mr-2 mt-1 text-gray-400 cursor-pointer"
          onClick={() => setPage("about")}
        >
          ?
        </div>
        <div>
          <div>Text</div>
          <TextArea value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div>
          <div>Prompt Template</div>
          <select
            className="w-full rounded-md border border-gray-300 p-1"
            defaultValue={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          >
            {promptList.map((item, idx) => (
              <option key={idx} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="flex  w-full items-center">
          <div className="flex-grow flex gap-2 justify-center m-2">
            <div>
              <button
                className="text-blue-500"
                onClick={() => setPage("newPrompt")}
              >
                Manage templates
              </button>
            </div>
            <div className="">
              <button
                className="self-end text-blue-500"
                onClick={() => setPage("options")}
              >
                Advanced Options
              </button>
            </div>
            <div className="self-end flex flex-col justify-center">
              <button
                type="submit"
                className="self-end rounded bg-blue-500 px-2 py-2 font-bold text-white hover:bg-blue-700"
              >
                Generate
              </button>
              <div className="text-xs text-gray-400 m-1">(⌘+Enter)</div>
            </div>
          </div>
        </div>

        {isGenerating && (
          <div className="flex flex-col gap-2 items-center py-3">
            <div className="self-start">
              <p className="text-bold">Thinking... </p>
            </div>
          </div>
        )}

        {response && (
          <div>
            <div>Assistant</div>
            <div className="border rounded-md p-3">{response.outputText}</div>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>
    </form>
  );
};

export default MainPage;
