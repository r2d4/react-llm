import useLLM from "@react-llm/headless";
import { Button, ProgressBar, Window } from "react95";

const Loader = () => {
  const { loadingStatus, isReady, init } = useLLM();
  if (isReady) return null;
  if (loadingStatus.progress === 1) return null;

  if (loadingStatus.progress == 0) {
    return (
      <div style={{ padding: "10px" }}>
        <Window>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div>
              This will download the model and may take a few minutes. After the
              first time, it will be cached.
            </div>

            <Button
              style={{ padding: "10px" }}
              size="lg"
              primary
              onClick={() => init()}
            >
              Load Model
            </Button>
          </div>
        </Window>
      </div>
    );
  }

  return (
    <Window style={{ width: "50%", margin: "10px" }}>
      Loading {loadingStatus.progress * 100}%
      <ProgressBar
        variant="tile"
        value={Math.floor(loadingStatus.progress * 100)}
      />
    </Window>
  );
};

export default Loader;
