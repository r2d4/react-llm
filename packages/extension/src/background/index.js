import { LLMInstance } from "@react-llm/headless";
import * as Comlink from "comlink";
import { createBackgroundEndpoint, isMessagePort } from "comlink-extension";

const inst = new LLMInstance();
// eslint-disable-next-line no-undef
chrome.runtime.onConnect.addListener((port) => {
  console.log("on connect!", port);
  if (isMessagePort(port)) return;

  Comlink.expose(
    {
      test() {
        console.log("called");
      },
    },
    createBackgroundEndpoint(port)
  );
});
