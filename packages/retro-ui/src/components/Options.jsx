import useLLM from "@react-llm/headless";
import {
  Button,
  GroupBox,
  NumberInput,
  TextInput,
  Window,
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
  return (
    <Window className="window" style={{ marginLeft: "10px" }}>
      <WindowHeader className="window-header">Options</WindowHeader>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "10px",
        }}
      >
        Screen Name
        <TextInput
          value={screenName}
          onChange={(e) => setScreenName(e.target.value)}
          placeholder="Screen Name"
        />
        <Button onClick={() => deleteMessages()}>Clear Messages</Button>
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
        <div>
          <p>A Large Language Model that runs </p>
          <p>entirely in the browser.</p>
          <p>Your browser must support WebGPU.</p>
          <p>(latest version of Chrome)</p>
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
      </div>
    </Window>
  );
};

export default Options;
