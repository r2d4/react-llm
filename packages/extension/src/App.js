import { ModelProvider } from "@react-llm/headless";
import { useEffect, useState } from "react";
import Page from "./Page";

function App() {
  const [api, setApi] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState({ progress: 0 });
  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.runtime.getBackgroundPage((backgroundPage) => {
      setApi(backgroundPage.API);
      backgroundPage.API.addInitListener(setLoadingStatus);
    });
    return () => {
      // eslint-disable-next-line no-undef
      chrome.runtime.getBackgroundPage((backgroundPage) => {
        backgroundPage.API.removeInitListener(setLoadingStatus);
      });
    };
  }, []);

  if (!api) return null;
  return (
    <div className="w-[300px]">
      <ModelProvider
        config={{
          api,
          persistToLocalStorage: false,
        }}
      >
        <div>
          <Page
            loadingStatus={loadingStatus}
            loadedSystemPrompt={api.systemPrompt}
            loadedPromptList={api.promptTemplates}
            setPersistedPromptList={(templates) => {
              api.promptTemplates = templates;
            }}
            setPersistedSystemPrompt={(systemPrompt) => {
              api.systemPrompt = systemPrompt;
            }}
          />
        </div>
      </ModelProvider>
    </div>
  );
}

export default App;
