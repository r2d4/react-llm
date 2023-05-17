import { useLLM } from "@react-llm/headless";

const LoadingPage = ({ progress }) => {
  const { init, gpuDevice } = useLLM();

  if (gpuDevice?.unsupportedReason !== null && gpuDevice?.checked) {
    return (
      <div className="flex flex-col gap-2 p-4 text-sm">
        <p>
          {JSON.stringify(gpuDevice)}
          Sorry! LLamaTab is not supported on your device. Reason $
          {gpuDevice.unsupportedReason}. LLamaTab requires a device with WebGPU
          support.
        </p>
      </div>
    );
  }
  if (progress === 0)
    return (
      <div className="flex flex-col gap-2 p-4 text-sm">
        <p>
          A Large Language Model that runs entirely in the browser via WebGPU.
        </p>
        <p>
          No data is sent to a server. Loading the model for the first time may
          take a few minutes. Afterwards, the model will load instantly.
        </p>
        <button
          onClick={() => init()}
          className="text-white bg-blue-500 px-2 py-2 rounded-md"
        >
          Load Model
        </button>

        <div></div>
      </div>
    );

  if (progress > 0 && progress < 1) {
    return (
      <div className="flex flex-col gap-2 items-center p-3 h-[200px] text-base">
        <div className="self-start">
          <p className="text-bold">Loading model... </p>
          {progress < 0.5 && <p>Reticulating splines...</p>}
          {progress > 0.5 && <p>Herding Llamas...</p>}
        </div>

        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            class="bg-blue-600 h-2.5 rounded-full"
            style={{
              width: `${Math.floor(progress * 100)}%`,
            }}
          ></div>
          <div className="font-mono">
            <p>{Math.floor(progress * 100 * 100) / 100}%</p>
          </div>
        </div>
      </div>
    );
  }
};

export default LoadingPage;
