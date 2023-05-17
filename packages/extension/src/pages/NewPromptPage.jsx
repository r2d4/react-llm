import React, { useState } from "react";
import TextArea from "./Textarea";
const NewPromptPage = ({ setPage, promptList, setPromptList }) => {
  const [newPrompt, setNewPrompt] = useState("");

  const handleAddPrompt = () => {
    if (newPrompt.trim() !== "") {
      setPromptList([...promptList, newPrompt]);
      setNewPrompt("");
    }
  };

  const handleDeletePrompt = (index) => {
    const newPromptList = [...promptList];
    newPromptList.splice(index, 1);
    setPromptList(newPromptList);
  };

  return (
    <div className="flex flex-col gap-2 p-4 text-sm">
      <div className="self-end">
        <button
          className="text-blue-500 hover:underline"
          onClick={() => setPage("main")}
        >
          Back
        </button>
      </div>

      <div className="mb-4">
        <p className="mb-2">
          A template for the prompt. $TEXT will be replaced by the input text.
        </p>
        <TextArea
          value={newPrompt}
          onChange={(e) => setNewPrompt(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            className="mt-2 bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
            onClick={handleAddPrompt}
          >
            Add New Prompt
          </button>
        </div>
      </div>

      {promptList.map((prompt, index) => (
        <div key={index} className="mb-2">
          <p className="text-gray-700">{prompt}</p>
          <div className="flex justify-end">
            <button
              className="text-red-500 hover:underline"
              onClick={() => handleDeletePrompt(index)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewPromptPage;
