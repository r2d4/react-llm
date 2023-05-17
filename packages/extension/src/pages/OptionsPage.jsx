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
          className="w-full rounded-md border border-blue-500 p-1"
          type="number"
          min="1"
          value={maxTokens}
          onChange={(e) => setMaxTokens(e.target.value)}
          max="2000"
        />
      </div>
      <div>
        <div>System Prompt</div>
        <textarea
          className="w-full rounded-md border border-blue-500 p-2 resize-none"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
      </div>
    </form>
  );
};

export default OptionsPage;
