import TextArea from "./Textarea";

const defaultSystemPrompt =
  "A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user's questions and always follows the users instructions.";

const OptionsPage = ({
  setPage,
  maxTokens,
  setMaxTokens,
  systemPrompt,
  setSystemPrompt,
}) => {
  return (
    <form className="flex flex-col gap-2 text-sm p-3">
      <div className="self-end ">
        <button className="text-blue-500" onClick={() => setPage("main")}>
          Back
        </button>
      </div>
      <div>
        <div>Max Tokens</div>
        <input
          className="w-full rounded-md border border-blue-500 px-3 py-2"
          type="number"
          min="1"
          value={maxTokens}
          onChange={(e) => setMaxTokens(e.target.value)}
          max="2000"
        />
      </div>
      <div>
        <div>System Prompt</div>
        <div className="relative">
          <TextArea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          />
        </div>
        <div
          className="cursor-pointer text-blue-500 hover:underline "
          onClick={() => {
            setSystemPrompt(defaultSystemPrompt);
          }}
        >
          Default
        </div>
      </div>
    </form>
  );
};

export default OptionsPage;
