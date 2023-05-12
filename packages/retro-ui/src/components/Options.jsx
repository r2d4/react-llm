import useLLM from "@react-llm/headless";
import { useEffect, useState } from "react";
import {
  Button,
  GroupBox,
  NumberInput,
  Tab,
  Tabs,
  TextInput,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";

const Options = ({ screenName, setScreenName }) => {
  const {
    init,
    maxTokens,
    setMaxTokens,
    deleteMessages,
    deleteConversation,
    conversation,
  } = useLLM();

  const [activeTab, setActiveTab] = useState(0);

  return (
    <Window
      className="window"
      style={{ marginLeft: "10px", maxWidth: "300px", minWidth: "300px" }}
    >
      <WindowHeader className="window-header">Options</WindowHeader>
      <WindowContent>
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
          <Tab value={0}>About</Tab>
          <Tab value={1}>Conversation</Tab>
          <Tab value={2}>Settings</Tab>
        </Tabs>

        {activeTab === 0 && <AboutTab />}
        {activeTab === 1 && (
          <ConversationTab
            screenName={screenName}
            setScreenName={setScreenName}
            conversation={conversation}
          />
        )}
        {activeTab === 2 && <SettingsTab />}
      </WindowContent>
    </Window>
  );
};

const ConversationTab = ({ screenName, setScreenName, conversation }) => {
  const {
    init,
    maxTokens,
    setMaxTokens,
    deleteMessages,
    deleteConversation,
    setConversationTitle,
  } = useLLM();

  const [title, setTitle] = useState(conversation?.title);

  useEffect(() => {
    setTitle(conversation?.title);
  }, [conversation?.title]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "10px",
      }}
    >
      <GroupBox label="Title">
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <TextInput
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Button
            onClick={() => {
              setConversationTitle(conversation.id, title);
            }}
          >
            Save
          </Button>
        </div>
      </GroupBox>
      <GroupBox label="ID">
        <div>{conversation?.id}</div>
      </GroupBox>
      <GroupBox label="System Prompt">
        <div style={{ overflowWrap: "break" }}>
          {conversation?.systemPrompt}
        </div>
      </GroupBox>
      <div>Screen Name</div>
      <TextInput
        value={screenName}
        onChange={(e) => setScreenName(e.target.value)}
        placeholder="Screen Name"
      />
      <Button onClick={() => deleteMessages()}>Clear Messages</Button>
    </div>
  );
};

const SettingsTab = () => {
  const {
    init,
    maxTokens,
    setMaxTokens,
    deleteMessages,
    deleteConversation,
    setConversationTitle,
  } = useLLM();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "15px",
      }}
    >
      <Button onClick={() => init()}>Reload Model</Button>
      <Button onClick={() => deleteConversation(conversation.id)}>
        Delete Conversation
      </Button>
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
    </div>
  );
};

const AboutTab = () => {
  return (
    <div>
      <div>
        <p>
          A Large Language Model that runs entirely in the browser with WebGPU.
        </p>
        <p>WebGPU is only supported in Desktop Google Chrome 113</p>
        <p>Powered by Apache TVM and MLC Relax Runtime.</p>
      </div>
      <GroupBox label="Model">
        <a href="https://lmsys.org/blog/2023-03-30-vicuna/" target="_blank">
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
      <GroupBox label="License">MIT</GroupBox>
    </div>
  );
};

export default Options;
