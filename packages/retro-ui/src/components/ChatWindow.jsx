import useLLM from "@react-llm/headless";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  TextInput,
  Toolbar,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";
import Loader from "./Loader";
import MessageList from "./MessageList";

import useSound from "use-sound";

function ChatWindow({
  stopStrings,
  maxTokens,
  screenName = "endlessbox5",
  assistantScreenName = "SmartestChild",
  soundLevel,
}) {
  const { loadingStatus, send, isGenerating, setOnMessage } = useLLM();
  const [userInput, setUserInput] = useState("");
  const [playSend] = useSound("/sounds/imsend.wav", { volume: soundLevel });
  const [playRcv] = useSound("/sounds/imrcv.wav", { volume: soundLevel });

  useEffect(() => {
    const cb = () => (resp) => {
      if (resp.step === 1) {
        playRcv();
      }
    };
    setOnMessage(cb);
  }, [setOnMessage, playRcv]);

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  const isReady = loadingStatus.progress === 1;

  const handleSubmit = useCallback(() => {
    if (isGenerating || !isReady) {
      return;
    }
    playSend();
    send(userInput, maxTokens, stopStrings);
    setUserInput("");
  }, [
    userInput,
    send,
    isGenerating,
    isReady,
    maxTokens,
    stopStrings,
    playSend,
  ]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleSubmit]);

  return (
    <Window fullWidth className="window sm:w-[500px] w-full">
      <WindowHeader className="window-header">
        <span>Instant Message with {assistantScreenName}</span>
      </WindowHeader>
      <Toolbar>
        <Button variant="menu" size="sm">
          File
        </Button>
        <Button variant="menu" size="sm">
          Edit
        </Button>
        <Button variant="menu" size="sm" disabled>
          Save
        </Button>
      </Toolbar>
      <WindowContent className="window-content w-full">
        <div className="flex flex-col w-full">
          <MessageList
            screenName={screenName}
            assistantScreenName={assistantScreenName}
          />
          {/* <Separator /> */}
          <div className="h-4" />
          {isReady && (
            <div>
              <form onSubmit={handleSubmit}>
                <div className="flex">
                  <TextInput
                    value={userInput}
                    placeholder="Say something..."
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </div>
              </form>
              <div className="h-4">
                {isGenerating && (
                  <span>{assistantScreenName} is typing...</span>
                )}
              </div>
              <div className="flex justify-start m-2">
                <div className="flex-grow">
                  <Image
                    src="/buddy88.gif"
                    width={64}
                    height={64}
                    alt={"buddy icon"}
                  />
                </div>
                <div>
                  <Button
                    onClick={handleSubmit}
                    className="submit"
                    style={{ height: "65px", width: "65px" }}
                  >
                    <Image
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAiCAYAAABIiGl0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ2MCwgMjAyMC8wNS8xMi0xNjowNDoxNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU3MUQ1NTRFMTdFQTExRUM5MDA1OTZFMzQ1Q0E2MTMxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU3MUQ1NTRGMTdFQTExRUM5MDA1OTZFMzQ1Q0E2MTMxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTcxRDU1NEMxN0VBMTFFQzkwMDU5NkUzNDVDQTYxMzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTcxRDU1NEQxN0VBMTFFQzkwMDU5NkUzNDVDQTYxMzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz53k5gpAAACU0lEQVR42sRWAZKDIAyETn9k3wRv0jfBm7xsIEwuAtZee43DDKhhk+wadPu+u6sjpbQvy7Kv67q/4o/xklMIgUEBjjkC+TgwAB251WxbAFezv9MmLsaIzaZGmTkC8Nu2odTwwVruO9x/PB4IgN872+9yiTFgwrO2K9k/JSQBtEDCtTV5d8b9gT8BwRyOKMoSSERr+MWtmA3GZl8rdAD2jD4wcJ9ddgTK65xpFTPz2tY0wDG4HezB71jub+6CLXRhE55XYUFoMIirZwDEQABaxJwxOe2yoVYx7sEhpMCgW9yG2ZGiWxCTCvKeXLGZsMARD+IY/Ooh6hYTlYuqsa7i6nI/5BhVQPmQrXBb612+21i+Z8yttUoZLehqDoHRDChTh+FyAWwbb7lwmguHAnBWevhUofnbiZqKA2W3PcqIPjJwWIqwsBFArEakm1ngFuS0H8uVCi/qOz68rzpW41zrQDWbfucSUAhqNZeIrAcuQKpjteai2uuxc4kjK5a6VAOrqtbgs3aos9fHp33/mGVaf4PWtscBpdDuj1qhPlDMp+e6wBxlvQAgoBKpBMfgqczPfgAk6+khISUWHnsOwiGp/fT0efpYlE3PfmX++q/11On0Sbu5L9nXgO/tfPR+V/9h/p0gsrfe924eYM5r/dIoKH2/F7B9Xr9rfyg1QOEsn5cNarBZ95n163LcycJLZDooE/nwj/mSuGYltKfY21QNIMtrL/LKv7PVeBlYAHu8qGeaz9O0rd8hCVM6vfAT7nqV8WY+qpzvAf+b+VHZ3t1ErP0IMAAwT6EpM/krMwAAAABJRU5ErkJggg=="
                      alt="Send Message"
                      style={{
                        filter:
                          !isReady || isGenerating
                            ? "grayscale(100%)"
                            : undefined,
                      }}
                      width="40"
                      height="40"
                    />
                  </Button>
                  <div
                    className="w-full h-1 mt-2"
                    style={{
                      backgroundColor:
                        !isReady || isGenerating ? "red" : "green",
                      width: "100%",
                      height: "5px",
                      marginTop: "2px",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          {!isReady && <Loader />}
        </div>
      </WindowContent>
    </Window>
  );
}

export default ChatWindow;
