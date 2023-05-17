const MainPage = ({
  prompt,
  setPrompt,
  handleSubmit,
  promptList,
  setPage,
  response,
  text,
  setText,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col m-auto p-3 text-sm gap-2 relative">
        <div
          className="absolute right-0 top-0 mr-2 mt-1 text-gray-400 cursor-pointer"
          onClick={() => setPage("about")}
        >
          ?
        </div>
        <div>
          <div>Text</div>
          <textarea
            className="w-full rounded-md border border-blue-500 p-2 resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <div>Prompt Template</div>
          <select
            className="w-full rounded-md border border-blue-500 p-1"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          >
            {promptList.map((prompt, idx) => (
              <option key={idx} value={prompt}>
                {prompt}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-full items-center">
          <div className="flex-grow flex gap-2 flex-col">
            <div>
              <button
                className="text-blue-500 "
                onClick={() => setPage("newPrompt")}
              >
                Add New Prompt
              </button>
            </div>
            <div className="flex">
              <button
                className="self-end text-blue-500"
                onClick={() => setPage("options")}
              >
                Advanced Options
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="self-end rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              Generate
            </button>
          </div>
        </div>

        {response && (
          <div>
            <div>Response</div>
            <div className="border h-[50px] rounded-md"></div>
          </div>
        )}
      </div>
    </form>
  );
};

export default MainPage;
