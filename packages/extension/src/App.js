import { ModelProvider } from "@react-llm/headless";
import Model from "./Model";
import api from "./lib/api";

function App() {
  return (
    <div>
      <ModelProvider
        config={{
          api,
        }}
      >
        <div>
          <Model />
        </div>
      </ModelProvider>
    </div>
  );
}

export default App;
