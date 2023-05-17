"use client";
import Chat from "@/components/Chat";
import { ModelProvider } from "@react-llm/headless";

export default function Home() {
  return (
    <ModelProvider
      config={{
        persistToLocalStorage: true,
      }}
    >
      <Chat />
    </ModelProvider>
  );
}
