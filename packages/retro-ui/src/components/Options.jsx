import useLLM from "@react-llm/headless";
import { useEffect, useState } from "react";
import {
  Button,
  GroupBox,
  NumberInput,
  Select,
  Slider,
  Tab,
  Tabs,
  TextInput,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";

import { themeList } from "./Chat";

const Options = ({
  screenName,
  setScreenName,
  stopStrings,
  setStopStrings,
  maxTokens,
  setMaxTokens,
  theme,
  setTheme,
  soundLevel,
  setSoundLevel,
}) => {
  const { conversation } = useLLM();
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
        {activeTab === 2 && (
          <SettingsTab
            stopStrings={stopStrings}
            setStopStrings={setStopStrings}
            maxTokens={maxTokens}
            setMaxTokens={setMaxTokens}
            theme={theme}
            setTheme={setTheme}
            soundLevel={soundLevel}
            setSoundLevel={setSoundLevel}
          />
        )}
        {activeTab === 3 && <StatsTab />}
      </WindowContent>
    </Window>
  );
};

const StatsTab = () => {
  const { gpuDevice } = useLLM();
  return (
    <div>
      {gpuDevice.checked && !gpuDevice.unsupportedReason && (
        <GroupBox label="GPU">
          <div>Vendor={gpuDevice.adapterInfo.vendor}</div>
          <div>Architecture={gpuDevice.adapterInfo.architecture}</div>
          <div>Device={gpuDevice.adapterInfo.device}</div>
          <div>Description={gpuDevice.adapterInfo.description}</div>
          <div>
            maxBufferSize=
            {gpuDevice.adapter.limits.maxBufferSize / (1024 * 1024)} MB
          </div>
        </GroupBox>
      )}
      <GroupBox label="Encoding/Decoding"></GroupBox>
    </div>
  );
};

const ConversationTab = ({ screenName, setScreenName, conversation }) => {
  const { deleteMessages, setConversationTitle } = useLLM();

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

const SettingsTab = ({
  stopStrings,
  setStopStrings,
  maxTokens,
  setMaxTokens,
  theme,
  setTheme,
  soundLevel,
  setSoundLevel,
}) => {
  const {
    init,
    deleteConversation,
    conversation,
    userRoleName,
    setUserRoleName,
    assistantRoleName,
    setAssistantRoleName,
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
      <GroupBox label={"Max Tokens"}>
        <NumberInput
          defaultValue={maxTokens}
          step={10}
          min={1}
          max={300}
          onChange={(value) => {
            if (typeof value === "number") setMaxTokens(value);
          }}
        />
      </GroupBox>
      <GroupBox label={"Stop Strings (comma separated)"}>
        <TextInput
          value={stopStrings?.join(",")}
          multiline
          rows={2}
          onChange={(e) => setStopStrings(e.target.value.split(","))}
          placeholder="Stop Strings"
        />
      </GroupBox>
      <GroupBox label={"Role Names"}>
        <div style={{ display: "flex" }}>
          <div>
            <div>Bot</div>
            <TextInput
              value={assistantRoleName}
              onChange={(e) => setAssistantRoleName(e.target.value)}
              placeholder="Assistant Role Name"
            />
          </div>
          <div>
            <div>User</div>
            <TextInput
              value={userRoleName}
              onChange={(e) => setUserRoleName(e.target.value)}
              placeholder="User Role Name"
            />
          </div>
        </div>
      </GroupBox>
      <GroupBox label={"Sound Level"}>
        <Slider
          min={0}
          max={1}
          step={0.1}
          value={soundLevel}
          defaultValue={soundLevel}
          marks={Array.from({ length: 11 }, (_, i) => ({ value: i / 10 }))}
          onChange={setSoundLevel}
        />
      </GroupBox>
      <GroupBox label={"Theme"}>
        <Select
          fullWidth
          style={{ width: "100%" }}
          width={"75%"}
          value={theme.value}
          defaultValue={theme.label}
          options={themeList}
          onChange={(e) => {
            setTheme(e);
          }}
        />
      </GroupBox>
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
        <p>
          No data is sent to the server. Conversations are cached in local
          storage.
        </p>
        <p>WebGPU is only supported in Desktop Google Chrome 113</p>
        <p>
          Powered by Apache TVM and MLC Relax Runtime. Vicuna trained by LMSys
        </p>
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
