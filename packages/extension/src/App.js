import { ModelProvider } from "@react-llm/headless";
import { useEffect, useState } from "react";
import Page from "./Page";

function App() {
  const [api, setApi] = useState(null);
  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.runtime.getBackgroundPage((backgroundPage) => {
      setApi(backgroundPage.API);
    });
  }, []);
  if (!api) return null;
  return (
    <div className="w-[300px]">
      <ModelProvider
        config={{
          api,
        }}
      >
        <div>
          <Page api={api} />
        </div>
      </ModelProvider>
    </div>
  );
}

export default App;
