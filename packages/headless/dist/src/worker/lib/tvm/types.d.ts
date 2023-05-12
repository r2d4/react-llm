/** Common type definitions. */
/**
 * Library interface provider that can provide
 * syslibs(e.g. libs provided by WASI and beyond) for the Wasm runtime.
 *
 * It can be viewed as a generalization of imports used in WebAssembly instance creation.
 *
 * The {@link LibraryProvider.start} callback will be called
 * to allow the library provider to initialize related resources during startup time.
 *
 * We can use Emscripten generated js Module as a { wasmLibraryProvider: LibraryProvider }.
 */
export interface LibraryProvider {
    /** The imports that can be passed to WebAssembly instance creation. */
    imports: Record<string, any>;
    /**
     * Callback function to notify the provider the created instance.
     * @param inst The created instance.
     */
    start: (inst: WebAssembly.Instance) => void;
}
/**
 * Disposable classes that contains resources (WasmMemory, GPU buffer)
 * which needs to be explicitly disposed.
 */
export interface Disposable {
    /**
     * Dispose the internal resource
     * This function can be called multiple times,
     * only the first call will take effect.
     */
    dispose: () => void;
}
