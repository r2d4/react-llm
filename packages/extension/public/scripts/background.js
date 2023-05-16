/* eslint-disable no-undef */

function importScripts(scriptUrls) {
  const scriptPromises = scriptUrls.map((scriptUrl) =>
    fetch(scriptUrl)
      .then((response) => response.text())
      .then((scriptContent) => {
        eval(scriptContent);
      })
      .catch((error) => {
        console.error("Error fetching or executing remote script:", error);
        throw error;
      })
  );

  return Promise.all(scriptPromises);
}

const api = {
  instance: null,
  init(callback, config) {
    console.log("called init!", config);
    importScripts([config.sentencePieceJsUrl, config.tvmRuntimeJsUrl]).then(
      () => {
        this.instance = new llm.LLMInstance(
          config,
          () => globalThis.Comlink.sentencepiece.sentencePieceProcessor
        );
        this.instance.init(callback);
      }
    );
  },
  generate(request, cb) {
    this.instance?.generate(request, cb);
  },
};

// into a MessagePort-like object that can be used with Comlink.
function MessageChannelAdapter(port) {
  port.onMessage.addListener((message) => {
    console.log("Message received:", message);
  });
  return {
    postMessage: port.postMessage.bind(port),
    addEventListener: port.onMessage.addListener.bind(port.onMessage),
    removeEventListener: port.onMessage.removeListener.bind(port.onMessage),
  };
}

importScripts(["https://unpkg.com/comlink/dist/umd/comlink.js"]).then(() => {
  chrome.runtime.onConnect.addListener((port) => {
    console.log("on connect!", port);
    if (port.name === "comlink-port") {
      port.onMessage.addListener((message) => {
        console.log("Message received:", message);
      });

      const adaptedPort = MessageChannelAdapter(port);
      console.log("adaptedPort", adaptedPort);
      globalThis.Comlink.expose(api, adaptedPort);
    }
  });
});
