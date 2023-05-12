import useLLM from "@react-llm/headless";
import { useEffect, useRef } from "react";
import { ScrollView } from "react95";

function MessageList({
  screenName = "endlessbox5",
  assistantScreenName = "SmartestChild",
}) {
  const scrollRef = useRef(null);
  const { conversation } = useLLM();

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
      {conversation?.messages.map((m) => (
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
              {m.role === "user" ? screenName : assistantScreenName}
            </span>
            : {m.text}
          </div>
        </div>
      ))}
      <div ref={scrollRef}></div>
    </ScrollView>
  );
}

export default MessageList;
