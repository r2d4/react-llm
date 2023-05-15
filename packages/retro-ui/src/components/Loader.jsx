import useLLM from "@react-llm/headless";
import { Button, ProgressBar } from "react95";

const Loader = () => {
  const { loadingStatus, isReady, init, gpuDevice } = useLLM();
  if (isReady) return null;
  if (loadingStatus.progress === 1) return null;

  if (gpuDevice.unsupportedReason) {
    return (
      <div style={{ fontSize: "20px" }}>
        <p style={{ color: "red" }}>Sorry, unsupported!</p>
        <p> Reason: {gpuDevice.unsupportedReason}</p>
        <p>
          <a href={"http://github.com/react-llm"}>react-llm</a> runs models in
          the browser with WebGPU and only works in Google Chrome v113 and above
          on Desktop with supported GPUs.
        </p>
      </div>
    );
  }

  if (loadingStatus.progress == 0) {
    return (
      <div style={{ padding: "10px", width: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div className="lg:hidden">
            <p className="p-1">
              A Large Language Model that runs entirely in the browser with
              WebGPU.
            </p>
            <p className="p-1">
              No data is sent to the server. Conversations are cached in local
              storage.
            </p>
            <p className="p-1">
              WebGPU is only supported in Desktop Google Chrome 113
            </p>
            <p className="p-1">
              Powered by Apache TVM and MLC Relax Runtime. Vicuna trained by
              LMSys
            </p>
          </div>
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
      </div>
    );
  }

  return (
    <div style={{ width: "100%", margin: "10px" }}>
      Loading {loadingStatus.progress * 100}%
      <ProgressBar
        variant="tile"
        value={Math.floor(loadingStatus.progress * 100)}
      />
    </div>
  );
};

export default Loader;
