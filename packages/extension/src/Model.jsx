import useLLM from "@react-llm/headless";
import obj from "./lib/api";

const config = {
  kvConfig: {
    numLayers: 64,
    shape: [32, 32, 128],
    dtype: "float32",
  },
  wasmUrl: "/vicuna-7b-v1_webgpu.wasm",
  tokenizerUrl: "/tokenizer.model",
  sentencePieceJsUrl: "/sentencepiece.js",
  tvmRuntimeJsUrl: "/tvmjs_runtime.wasi.js",
  cacheUrl:
    "https://huggingface.co/mrick/react-llm/resolve/main/models/vicuna-7b-v1/params/",
  maxWindowSize: 2048,
};

const Model = () => {
  const { send, setOnMessage, init, loadingStatus } = useLLM();
  obj.test();

  return <div className="w-[500px] h-[500px]"></div>;
};

export default Model;
