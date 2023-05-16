import { LLMInstance } from "./model/llm";
import { detectGPUDevice } from "./tvm";

export type * from './types/modelApi';
export {
    LLMInstance,
    detectGPUDevice,
};
export default LLMInstance;


