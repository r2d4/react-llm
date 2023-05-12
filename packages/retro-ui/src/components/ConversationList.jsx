"use client";
import useLLM from "@react-llm/headless";

import {
  Button,
  GroupBox,
  MenuList,
  MenuListItem,
  ScrollView,
  TextInput,
  Window,
  WindowHeader,
} from "react95";

import { useState } from "react";

const ConversationList = () => {
  const { allConversations, createConversation, setConversationId } = useLLM();
  const [systemPrompt, setSystemPrompt] = useState(
    "A chat between a curious user and a AI chatbot named SmartestChild on AIM who responds with lowercase, frequent emojis, and 2000s internet abbreviations."
  );
  const [title, setTitle] = useState("New Conversation");

  return (
    <Window className="window" style={{ marginRight: "10px" }}>
      <WindowHeader className="window-header">Conversations</WindowHeader>
      <MenuList>
        <ScrollView style={{ width: "300px", height: "200px" }}>
          {allConversations?.map((c) => (
            <div key={c.id}>
              <MenuListItem
                primary
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setConversationId(c.id);
                }}
              >
                <div>{new Date(c.updatedAt).toLocaleString()}</div>
              </MenuListItem>
            </div>
          ))}
        </ScrollView>
      </MenuList>
      <GroupBox label={"New Conversation"}>
        <GroupBox label={"Title"}>
          <TextInput
            fullWidth
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </GroupBox>
        <GroupBox label={"System Prompt"}>
          <TextInput
            multiline
            fullWidth
            value={systemPrompt}
            onChange={(event) => setSystemPrompt(event.target.value)}
            rows={6}
          />
        </GroupBox>
        <Button
          size="lg"
          style={{ cursor: "pointer" }}
          onClick={() => {
            createConversation(title, systemPrompt);
          }}
        >
          Create
        </Button>
      </GroupBox>
    </Window>
  );
};

export default ConversationList;
