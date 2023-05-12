/// <reference types="@webgpu/types" />
import { Memory } from "./memory";
/** A pointer to points to the raw address space. */
export type GPUPointer = number;
export interface GPUDeviceDetectOutput {
    adapter: GPUAdapter;
    adapterInfo: GPUAdapterInfo;
    device: GPUDevice;
}
/**
 * DetectGPU device in the environment.
 */
export declare function detectGPUDevice(): Promise<GPUDeviceDetectOutput | undefined>;
/**
 * Function info from the API
 */
export interface FunctionInfo {
    name: string;
    arg_types: Array<string>;
    launch_param_tags: Array<string>;
}
/**
 * WebGPU context
 * Manages all the webgpu resources here.
 */
export declare class WebGPUContext {
    device: GPUDevice;
    memory: Memory;
    private bufferTable;
    private bufferTableFreeId;
    private podArgStagingBuffers;
    private canvasRenderManager?;
    private maxNumPodArgsStagingBuffers;
    private peakAllocatedBytes;
    private currAllocatedBytes;
    private allAllocatedBytes;
    private shaderSubmitCounter;
    protected debugShaderSubmitLimit: number;
    protected debugLogFinish: boolean;
    constructor(memory: Memory, device: GPUDevice);
    /**
     * Dispose context.
     */
    dispose(): void;
    /**
     * Wait for all pending GPU tasks to complete
     */
    sync(): Promise<void>;
    /**
     * Obtain the runtime information in readable format.
     */
    runtimeStatsText(): string;
    /**
     * Draw image from data in storage buffer.
     * @param ptr The GPU ptr
     * @param height The height of the image.
     * @param width The width of the image.
     */
    drawImageFromBuffer(ptr: GPUPointer, height: number, width: number): void;
    /**
     * Copy raw bytes into buffer ptr.
     *
     * @param rawBytes The raw bytes
     * @param toPtr The target gpu buffer ptr
     * @param toOffset The beginning offset
     * @param nbytes Number of bytes
     */
    copyRawBytesToBuffer(rawBytes: Uint8Array, toPtr: GPUPointer, toOffset: number, nbytes: number): void;
    /**
     * Clear canvas
     */
    clearCanvas(): void;
    /**
     * Bind a canvas element to the runtime.
     * @param canvas The HTML canvas/
     */
    bindCanvas(canvas: HTMLCanvasElement): void;
    /**
     * Create a PackedFunc that runs the given shader
     * via createComputePipeline
     *
     * @param info The function information already parsed as a record.
     * @param code The shader data(in WGSL)
     * @returns The shader
     */
    createShader(finfo: FunctionInfo, code: string): Function;
    /**
     * Create a PackedFunc that runs the given shader asynchrously
     * via createComputePipelineAsync
     *
     * @param info The function information already parsed as a record.
     * @param code The shader data(in WGSL)
     * @returns The shader
     */
    createShaderAsync(finfo: FunctionInfo, code: string): Promise<Function>;
    /**
     * Get the pod arg staging buffer
     * \param nbytes The minimum size.
     * \return The allocated buffer
     */
    private getPodArgsBuffer;
    /**
     * Internal impl of createShader for both async and sync mode.
     *
     * @param info The function information already parsed as a record.
     * @param code The shader data(in WGSL)
     * @param asyncMode Whether use async mode.
     * @returns The shader function or promise of shader func.
     */
    private createShadeInternal;
    /**
     * Get the device API according to its name
     * @param The name of the API.
     * @returns The corresponding device api.
     */
    getDeviceAPI(name: string): Function;
    private deviceAllocDataSpace;
    private deviceFreeDataSpace;
    private deviceCopyToGPU;
    private deviceCopyFromGPU;
    private deviceCopyWithinGPU;
    private gpuBufferFromPtr;
    private attachToBufferTable;
}
