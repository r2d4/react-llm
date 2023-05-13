"use client";
import localFont from "next/font/local";
import { useState } from "react";
import matrix from "react95/dist/themes/matrix";
import millenium from "react95/dist/themes/millenium";
import original from "react95/dist/themes/original";
import rose from "react95/dist/themes/rose";
import { ThemeProvider } from "styled-components";
import ChatWindow from "./ChatWindow";
import ConversationList from "./ConversationList";
import Options from "./Options";
const myFont = localFont({ src: "../assets/fonts/ms_sans_serif.woff2" });

export const themeList = [
  {
    value: original,
    label: "Original",
  },
  {
    value: matrix,
    label: "Matrix",
  },
  {
    value: millenium,
    label: "Millenium",
  },
  {
    value: rose,
    label: "Rose",
  },
];

export default function Chat() {
  const [screenName, setScreenName] = useState("endlessbox5");
  const [stopStrings, setStopStrings] = useState(["user:", "assistant:"]);
  const [maxTokens, setMaxTokens] = useState(100);
  const [soundLevel, setSoundLevel] = useState(0.5);
  const [theme, setTheme] = useState({
    value: original,
    label: "Original",
  });

  return (
    <div className={myFont.className}>
      <ThemeProvider theme={theme.value}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ConversationList />
            <ChatWindow
              screenName={screenName}
              assistantScreenName={"SmartestChild"}
              maxTokens={maxTokens}
              stopStrings={stopStrings}
              soundLevel={soundLevel}
            />
            <Options
              screenName={screenName}
              setScreenName={setScreenName}
              stopStrings={stopStrings}
              setStopStrings={setStopStrings}
              maxTokens={maxTokens}
              setMaxTokens={setMaxTokens}
              theme={theme}
              setTheme={setTheme}
              soundLevel={soundLevel}
              setSoundLevel={setSoundLevel}
            />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
