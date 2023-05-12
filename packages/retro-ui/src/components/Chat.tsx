"use client";
import useLLM from "@react-llm/headless";
import localFont from "next/font/local";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import AutoScroll from "./AutoScroll";
const myFont = localFont({ src: "./ms_sans_serif.woff2" });

import {
  Button,
  GroupBox,
  MenuList,
  MenuListItem,
  NumberInput,
  ProgressBar,
  Separator,
  TextInput,
  Toolbar,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";
import original from "react95/dist/themes/original";
import { ThemeProvider } from "styled-components";

export default function Chat() {
  const {
    loadingStatus,
    sendUserMessage,
    isGenerating,
    conversation,
    allConversations,
    clearMessages,
    maxTokens,
    setMaxTokens,
    init,
  } = useLLM({
    autoInit: false,
  });
  const [userInput, setUserInput] = useState("");
  const [screenName, setScreenName] = useState("endlessbox5");

  const handleChange = (event: any) => {
    setUserInput(event.target.value);
  };

  const isReady = loadingStatus.progress === 1;

  const handleSubmit = useCallback(() => {
    if (isGenerating || !isReady) {
      return;
    }
    sendUserMessage(userInput);
    setUserInput("");
  }, [userInput, sendUserMessage, isGenerating, isReady]);

  useEffect(() => {
    const handleKeyPress = (event: any) => {
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
    <div className={myFont.className}>
      <ThemeProvider theme={original}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Window className="window" style={{ marginRight: "10px" }}>
            <WindowHeader className="window-header">Conversations</WindowHeader>
            <MenuList>
              {allConversations?.map((c: any) => (
                <div key={c.id}>
                  <MenuListItem primary>
                    <div>{new Date(c.updatedAt).toLocaleString()}</div>
                  </MenuListItem>
                </div>
              ))}
            </MenuList>
          </Window>
          <Window className="window">
            <WindowHeader className="window-header">
              <span>Instant Message with SmartestChild</span>
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
            <WindowContent
              className="window-content"
              style={{ display: "flex" }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <AutoScroll>
                  {conversation?.messages.map((m: any) => (
                    <div key={m.id} style={{ display: "flex" }}>
                      <div
                        style={{
                          background: "white",
                          padding: "2px",
                          borderRadius: "5px",
                          // margin: "5px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            color: m.role === "user" ? "blue" : "red",
                          }}
                        >
                          {m.role === "user" ? screenName : "SmartestChild"}
                        </span>
                        : {m.text}
                      </div>
                    </div>
                  ))}
                </AutoScroll>

                <Separator />
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "flex" }}>
                    <TextInput
                      value={userInput}
                      placeholder="Type here..."
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                    />
                  </div>
                </form>
                <div style={{ height: "16px" }}>
                  {isGenerating && <span>SmartestChild is typing...</span>}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    margin: "10px",
                  }}
                >
                  <div style={{ flexGrow: 1 }}>
                    <Image
                      src="/buddy88.gif"
                      width={64}
                      height={64}
                      alt={"buddy icon"}
                    />
                  </div>
                  <div style={{}}>
                    <Button
                      onClick={handleSubmit}
                      className="submit"
                      style={{ height: "65px", width: "65px" }}
                    >
                      <Image
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAiCAYAAABIiGl0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ2MCwgMjAyMC8wNS8xMi0xNjowNDoxNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU3MUQ1NTRFMTdFQTExRUM5MDA1OTZFMzQ1Q0E2MTMxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU3MUQ1NTRGMTdFQTExRUM5MDA1OTZFMzQ1Q0E2MTMxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTcxRDU1NEMxN0VBMTFFQzkwMDU5NkUzNDVDQTYxMzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTcxRDU1NEQxN0VBMTFFQzkwMDU5NkUzNDVDQTYxMzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz53k5gpAAACU0lEQVR42sRWAZKDIAyETn9k3wRv0jfBm7xsIEwuAtZee43DDKhhk+wadPu+u6sjpbQvy7Kv67q/4o/xklMIgUEBjjkC+TgwAB251WxbAFezv9MmLsaIzaZGmTkC8Nu2odTwwVruO9x/PB4IgN872+9yiTFgwrO2K9k/JSQBtEDCtTV5d8b9gT8BwRyOKMoSSERr+MWtmA3GZl8rdAD2jD4wcJ9ddgTK65xpFTPz2tY0wDG4HezB71jub+6CLXRhE55XYUFoMIirZwDEQABaxJwxOe2yoVYx7sEhpMCgW9yG2ZGiWxCTCvKeXLGZsMARD+IY/Ooh6hYTlYuqsa7i6nI/5BhVQPmQrXBb612+21i+Z8yttUoZLehqDoHRDChTh+FyAWwbb7lwmguHAnBWevhUofnbiZqKA2W3PcqIPjJwWIqwsBFArEakm1ngFuS0H8uVCi/qOz68rzpW41zrQDWbfucSUAhqNZeIrAcuQKpjteai2uuxc4kjK5a6VAOrqtbgs3aos9fHp33/mGVaf4PWtscBpdDuj1qhPlDMp+e6wBxlvQAgoBKpBMfgqczPfgAk6+khISUWHnsOwiGp/fT0efpYlE3PfmX++q/11On0Sbu5L9nXgO/tfPR+V/9h/p0gsrfe924eYM5r/dIoKH2/F7B9Xr9rfyg1QOEsn5cNarBZ95n163LcycJLZDooE/nwj/mSuGYltKfY21QNIMtrL/LKv7PVeBlYAHu8qGeaz9O0rd8hCVM6vfAT7nqV8WY+qpzvAf+b+VHZ3t1ErP0IMAAwT6EpM/krMwAAAABJRU5ErkJggg=="
                        alt="Send Message"
                        style={{
                          filter: !isReady ? "grayscale(100%)" : undefined,
                        }}
                        width="40"
                        height="40"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </WindowContent>
            {!isReady && (
              <div>
                Loading {loadingStatus.progress * 100}%
                <ProgressBar
                  variant="tile"
                  value={Math.floor(loadingStatus.progress * 100)}
                />
              </div>
            )}
          </Window>
          <Window className="window" style={{ marginLeft: "10px" }}>
            <WindowHeader className="window-header">Options</WindowHeader>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "10px",
              }}
            >
              Screen Name
              <TextInput
                value={screenName}
                onChange={(e) => setScreenName(e.target.value)}
                placeholder="Screen Name"
              />
              <Button onClick={() => clearMessages()}>Clear Messages</Button>
              <div>Max Tokens</div>
              <NumberInput
                defaultValue={maxTokens}
                step={10}
                min={1}
                max={300}
                onChange={(value) => {
                  if (typeof value === "number") setMaxTokens(value);
                }}
              />
              <div>
                <p>A Large Language Model that runs </p>
                <p>entirely in the browser.</p>
                <p>Your browser must support WebGPU.</p>
                <p>(latest version of Chrome)</p>
              </div>
              <GroupBox label="Model">
                <a
                  href="https://lmsys.org/blog/2023-03-30-vicuna/"
                  target="_blank"
                >
                  Vicuna-13B
                </a>
              </GroupBox>
              <GroupBox label="Twitter">
                <a href="https://twitter.com/mattrickard" target="_blank">
                  @mattrickard
                </a>
              </GroupBox>
              <GroupBox label="GitHub">
                <a href="https://github.com/r2d4/react-llm" target="_blank">
                  r2d4/react-llm
                </a>
              </GroupBox>
              {loadingStatus.progress === 0 && (
                <div style={{ margin: "10px" }}>
                  <div style={{ marginBottom: "10px" }}>
                    After the first load, the model will be cached.
                  </div>
                  <Button onClick={() => init()}>Load</Button>
                </div>
              )}
            </div>
          </Window>
        </div>
      </ThemeProvider>
    </div>
  );
}
