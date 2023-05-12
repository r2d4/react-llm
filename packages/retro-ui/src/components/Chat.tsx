"use client";
import localFont from "next/font/local";
import { useState } from "react";
import original from "react95/dist/themes/original";
import { ThemeProvider } from "styled-components";
import ChatWindow from "./ChatWindow";
import ConversationList from "./ConversationList";
import Options from "./Options";
const myFont = localFont({ src: "./ms_sans_serif.woff2" });

export default function Chat() {
  const [screenName, setScreenName] = useState("endlessbox5");

  return (
    <div className={myFont.className}>
      <ThemeProvider theme={original}>
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
            />
            <Options screenName={screenName} setScreenName={setScreenName} />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
