import useLLM from "@react-llm/headless";
import { useEffect, useRef } from "react";
import { Frame, ScrollView } from "react95";

function MessageList({
  screenName = "endlessbox5",
  assistantScreenName = "SmartestChild",
}) {
  const scrollRef = useRef(null);
  const { conversation, userRoleName } = useLLM();

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  return (
    <ScrollView
      style={{ height: "300px", width: "400px", background: "white" }}
    >
      <Frame style={{ padding: "2px" }} variant="field">
        {conversation?.messages.map((m) => (
          <div key={m.id} style={{ display: "flex" }}>
            <div
              style={{
                padding: "2px",
                borderRadius: "5px",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  color: m.role === userRoleName ? "blue" : "red",
                }}
              >
                {m.role === userRoleName ? screenName : assistantScreenName}
              </span>
              : {m.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef}></div>
      </Frame>
    </ScrollView>
  );
}

export default MessageList;
