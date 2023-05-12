"use client";
import localFont from "next/font/local";
import { useState } from "react";
import { Anchor, AppBar, Button } from "react95";
import highContrast from "react95/dist/themes/highContrast";
import matrix from "react95/dist/themes/matrix";
import millenium from "react95/dist/themes/millenium";
import modernDark from "react95/dist/themes/modernDark";
import original from "react95/dist/themes/original";
import rose from "react95/dist/themes/rose";
import { ThemeProvider, type CSSProperties } from "styled-components";
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
    value: highContrast,
    label: "High Contrast",
  },
  {
    value: modernDark,
    label: "Modern Dark",
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
  const [soundLevel, setSoundLevel] = useState(0.2);
  const [showConversationList, setShowConversationList] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [theme, setTheme] = useState({
    value: original,
    label: "Original",
  });

  return (
    <div className={myFont.className}>
      <ThemeProvider theme={theme.value}>
        {showConversationList && (
          <div className="absolute z-10 lg:hidden">
            <ConversationList />
          </div>
        )}
        {showOptions && (
          <div className="absolute z-10 lg:hidden right-0">
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
        )}
        <div className="flex justify-center m-3 gap-2">
          <div className="hidden lg:block">
            <ConversationList />
          </div>
          <div className="w-[500px]">
            <ChatWindow
              screenName={screenName}
              assistantScreenName={"SmartestChild"}
              maxTokens={maxTokens}
              stopStrings={stopStrings}
              soundLevel={soundLevel}
            />
          </div>
          <div className="hidden lg:block">
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
          <div className="lg:hidden bottom-0 left-0 fixed w-full">
            <AppBar position={"absolute bottom" as CSSProperties["position"]}>
              <div className="flex gap-8 p-2 items-center">
                <div>
                  <Button
                    fullWidth
                    onClick={() => setShowOptions(!showOptions)}
                  >
                    Options
                  </Button>
                </div>
                <div className="flex-grow">
                  <Button
                    onClick={() =>
                      setShowConversationList(!showConversationList)
                    }
                  >
                    Conversations
                  </Button>
                </div>
                <div>Vicuna 13B</div>
                <div>
                  <Anchor href="https://github.com/r2d4">GitHub</Anchor>
                </div>
                <div>
                  <Anchor href="https://twitter.com/mattrickard">
                    Twitter
                  </Anchor>
                </div>
              </div>
            </AppBar>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
