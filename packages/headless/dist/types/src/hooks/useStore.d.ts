declare const useStore: <T, F>(store: (callback: (state: T) => unknown) => unknown, callback: (state: T) => F) => F | undefined;
export default useStore;
