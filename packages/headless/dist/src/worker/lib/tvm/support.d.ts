/**
 * Convert string to Uint8array.
 * @param str The string.
 * @returns The corresponding Uint8Array.
 */
export declare function StringToUint8Array(str: string): Uint8Array;
/**
 * Convert Uint8array to string.
 * @param array The array.
 * @returns The corresponding string.
 */
export declare function Uint8ArrayToString(arr: Uint8Array): string;
/**
 * Internal assert helper
 * @param condition condition The condition to fail.
 * @param msg msg The message.
 */
export declare function assert(condition: boolean, msg?: string): asserts condition;
/**
 * Get the path to the wasm library in nodejs.
 * @return The wasm path.
 */
export declare function wasmPath(): string;
