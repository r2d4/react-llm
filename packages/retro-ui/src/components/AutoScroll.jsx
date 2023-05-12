import { useEffect, useRef } from "react";
import { ScrollView } from "react95";

function AutoScroll({ children }) {
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [children]);

  return (
    <ScrollView
      style={{ height: "300px", width: "400px", background: "white" }}
    >
      <div>{children}</div>
      <div ref={scrollRef}></div>
    </ScrollView>
  );
}

export default AutoScroll;
