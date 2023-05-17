import React, { useEffect, useRef } from "react";

const TextArea = ({ onChange, value }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  const handleInput = () => {
    const textarea = textareaRef.current;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <textarea
      ref={textareaRef}
      className="resize-none w-full px-3 py-2 border border-gray-300 rounded-md"
      onInput={handleInput}
      onChange={onChange}
      value={value}
    />
  );
};

export default TextArea;
