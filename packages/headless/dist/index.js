import require$$0, { useDebugValue, useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { v as v4, _ as __spreadArray, a as __assign, w as wrap, p as proxy } from './_tslib-f6a38a96.js';

const createStoreImpl = createState => {
  let state;
  const listeners = /* @__PURE__ */new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object") ? nextState : Object.assign({}, state, nextState);
      listeners.forEach(listener => listener(state, previousState));
    }
  };
  const getState = () => state;
  const subscribe = listener => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const destroy = () => {
    if ((import.meta.env && import.meta.env.MODE) !== "production") {
      console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected.");
    }
    listeners.clear();
  };
  const api = {
    setState,
    getState,
    subscribe,
    destroy
  };
  state = createState(setState, getState, api);
  return api;
};
const createStore = createState => createState ? createStoreImpl(createState) : createStoreImpl;

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var withSelector = {exports: {}};

var withSelector_production_min = {};

var shim = {exports: {}};

var useSyncExternalStoreShim_production_min = {};

/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredUseSyncExternalStoreShim_production_min;

function requireUseSyncExternalStoreShim_production_min () {
	if (hasRequiredUseSyncExternalStoreShim_production_min) return useSyncExternalStoreShim_production_min;
	hasRequiredUseSyncExternalStoreShim_production_min = 1;

	var e = require$$0;
	function h(a, b) {
	  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
	}
	var k = "function" === typeof Object.is ? Object.is : h,
	  l = e.useState,
	  m = e.useEffect,
	  n = e.useLayoutEffect,
	  p = e.useDebugValue;
	function q(a, b) {
	  var d = b(),
	    f = l({
	      inst: {
	        value: d,
	        getSnapshot: b
	      }
	    }),
	    c = f[0].inst,
	    g = f[1];
	  n(function () {
	    c.value = d;
	    c.getSnapshot = b;
	    r(c) && g({
	      inst: c
	    });
	  }, [a, d, b]);
	  m(function () {
	    r(c) && g({
	      inst: c
	    });
	    return a(function () {
	      r(c) && g({
	        inst: c
	      });
	    });
	  }, [a]);
	  p(d);
	  return d;
	}
	function r(a) {
	  var b = a.getSnapshot;
	  a = a.value;
	  try {
	    var d = b();
	    return !k(a, d);
	  } catch (f) {
	    return !0;
	  }
	}
	function t(a, b) {
	  return b();
	}
	var u = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? t : q;
	useSyncExternalStoreShim_production_min.useSyncExternalStore = void 0 !== e.useSyncExternalStore ? e.useSyncExternalStore : u;
	return useSyncExternalStoreShim_production_min;
}

var useSyncExternalStoreShim_development = {};

/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredUseSyncExternalStoreShim_development;

function requireUseSyncExternalStoreShim_development () {
	if (hasRequiredUseSyncExternalStoreShim_development) return useSyncExternalStoreShim_development;
	hasRequiredUseSyncExternalStoreShim_development = 1;

	if (process.env.NODE_ENV !== "production") {
	  (function () {

	    /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
	    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === 'function') {
	      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
	    }
	    var React = require$$0;
	    var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
	    function error(format) {
	      {
	        {
	          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	            args[_key2 - 1] = arguments[_key2];
	          }
	          printWarning('error', format, args);
	        }
	      }
	    }
	    function printWarning(level, format, args) {
	      // When changing this logic, you might want to also
	      // update consoleWithStackDev.www.js as well.
	      {
	        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
	        var stack = ReactDebugCurrentFrame.getStackAddendum();
	        if (stack !== '') {
	          format += '%s';
	          args = args.concat([stack]);
	        } // eslint-disable-next-line react-internal/safe-string-coercion

	        var argsWithFormat = args.map(function (item) {
	          return String(item);
	        }); // Careful: RN currently depends on this prefix

	        argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
	        // breaks IE9: https://github.com/facebook/react/issues/13610
	        // eslint-disable-next-line react-internal/no-production-logging

	        Function.prototype.apply.call(console[level], console, argsWithFormat);
	      }
	    }

	    /**
	     * inlined Object.is polyfill to avoid requiring consumers ship their own
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	     */
	    function is(x, y) {
	      return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y // eslint-disable-line no-self-compare
	      ;
	    }

	    var objectIs = typeof Object.is === 'function' ? Object.is : is;

	    // dispatch for CommonJS interop named imports.

	    var useState = React.useState,
	      useEffect = React.useEffect,
	      useLayoutEffect = React.useLayoutEffect,
	      useDebugValue = React.useDebugValue;
	    var didWarnOld18Alpha = false;
	    var didWarnUncachedGetSnapshot = false; // Disclaimer: This shim breaks many of the rules of React, and only works
	    // because of a very particular set of implementation details and assumptions
	    // -- change any one of them and it will break. The most important assumption
	    // is that updates are always synchronous, because concurrent rendering is
	    // only available in versions of React that also have a built-in
	    // useSyncExternalStore API. And we only use this shim when the built-in API
	    // does not exist.
	    //
	    // Do not assume that the clever hacks used by this hook also work in general.
	    // The point of this shim is to replace the need for hacks by other libraries.

	    function useSyncExternalStore(subscribe, getSnapshot,
	    // Note: The shim does not use getServerSnapshot, because pre-18 versions of
	    // React do not expose a way to check if we're hydrating. So users of the shim
	    // will need to track that themselves and return the correct value
	    // from `getSnapshot`.
	    getServerSnapshot) {
	      {
	        if (!didWarnOld18Alpha) {
	          if (React.startTransition !== undefined) {
	            didWarnOld18Alpha = true;
	            error('You are using an outdated, pre-release alpha of React 18 that ' + 'does not support useSyncExternalStore. The ' + 'use-sync-external-store shim will not work correctly. Upgrade ' + 'to a newer pre-release.');
	          }
	        }
	      } // Read the current snapshot from the store on every render. Again, this
	      // breaks the rules of React, and only works here because of specific
	      // implementation details, most importantly that updates are
	      // always synchronous.

	      var value = getSnapshot();
	      {
	        if (!didWarnUncachedGetSnapshot) {
	          var cachedValue = getSnapshot();
	          if (!objectIs(value, cachedValue)) {
	            error('The result of getSnapshot should be cached to avoid an infinite loop');
	            didWarnUncachedGetSnapshot = true;
	          }
	        }
	      } // Because updates are synchronous, we don't queue them. Instead we force a
	      // re-render whenever the subscribed state changes by updating an some
	      // arbitrary useState hook. Then, during render, we call getSnapshot to read
	      // the current value.
	      //
	      // Because we don't actually use the state returned by the useState hook, we
	      // can save a bit of memory by storing other stuff in that slot.
	      //
	      // To implement the early bailout, we need to track some things on a mutable
	      // object. Usually, we would put that in a useRef hook, but we can stash it in
	      // our useState hook instead.
	      //
	      // To force a re-render, we call forceUpdate({inst}). That works because the
	      // new object always fails an equality check.

	      var _useState = useState({
	          inst: {
	            value: value,
	            getSnapshot: getSnapshot
	          }
	        }),
	        inst = _useState[0].inst,
	        forceUpdate = _useState[1]; // Track the latest getSnapshot function with a ref. This needs to be updated
	      // in the layout phase so we can access it during the tearing check that
	      // happens on subscribe.

	      useLayoutEffect(function () {
	        inst.value = value;
	        inst.getSnapshot = getSnapshot; // Whenever getSnapshot or subscribe changes, we need to check in the
	        // commit phase if there was an interleaved mutation. In concurrent mode
	        // this can happen all the time, but even in synchronous mode, an earlier
	        // effect may have mutated the store.

	        if (checkIfSnapshotChanged(inst)) {
	          // Force a re-render.
	          forceUpdate({
	            inst: inst
	          });
	        }
	      }, [subscribe, value, getSnapshot]);
	      useEffect(function () {
	        // Check for changes right before subscribing. Subsequent changes will be
	        // detected in the subscription handler.
	        if (checkIfSnapshotChanged(inst)) {
	          // Force a re-render.
	          forceUpdate({
	            inst: inst
	          });
	        }
	        var handleStoreChange = function () {
	          // TODO: Because there is no cross-renderer API for batching updates, it's
	          // up to the consumer of this library to wrap their subscription event
	          // with unstable_batchedUpdates. Should we try to detect when this isn't
	          // the case and print a warning in development?
	          // The store changed. Check if the snapshot changed since the last time we
	          // read from the store.
	          if (checkIfSnapshotChanged(inst)) {
	            // Force a re-render.
	            forceUpdate({
	              inst: inst
	            });
	          }
	        }; // Subscribe to the store and return a clean-up function.

	        return subscribe(handleStoreChange);
	      }, [subscribe]);
	      useDebugValue(value);
	      return value;
	    }
	    function checkIfSnapshotChanged(inst) {
	      var latestGetSnapshot = inst.getSnapshot;
	      var prevValue = inst.value;
	      try {
	        var nextValue = latestGetSnapshot();
	        return !objectIs(prevValue, nextValue);
	      } catch (error) {
	        return true;
	      }
	    }
	    function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
	      // Note: The shim does not use getServerSnapshot, because pre-18 versions of
	      // React do not expose a way to check if we're hydrating. So users of the shim
	      // will need to track that themselves and return the correct value
	      // from `getSnapshot`.
	      return getSnapshot();
	    }
	    var canUseDOM = !!(typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined');
	    var isServerEnvironment = !canUseDOM;
	    var shim = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore;
	    var useSyncExternalStore$2 = React.useSyncExternalStore !== undefined ? React.useSyncExternalStore : shim;
	    useSyncExternalStoreShim_development.useSyncExternalStore = useSyncExternalStore$2;
	    /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
	    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === 'function') {
	      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
	    }
	  })();
	}
	return useSyncExternalStoreShim_development;
}

var hasRequiredShim;

function requireShim () {
	if (hasRequiredShim) return shim.exports;
	hasRequiredShim = 1;

	if (process.env.NODE_ENV === 'production') {
	  shim.exports = requireUseSyncExternalStoreShim_production_min();
	} else {
	  shim.exports = requireUseSyncExternalStoreShim_development();
	}
	return shim.exports;
}

/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredWithSelector_production_min;

function requireWithSelector_production_min () {
	if (hasRequiredWithSelector_production_min) return withSelector_production_min;
	hasRequiredWithSelector_production_min = 1;

	var h = require$$0,
	  n = requireShim();
	function p(a, b) {
	  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
	}
	var q = "function" === typeof Object.is ? Object.is : p,
	  r = n.useSyncExternalStore,
	  t = h.useRef,
	  u = h.useEffect,
	  v = h.useMemo,
	  w = h.useDebugValue;
	withSelector_production_min.useSyncExternalStoreWithSelector = function (a, b, e, l, g) {
	  var c = t(null);
	  if (null === c.current) {
	    var f = {
	      hasValue: !1,
	      value: null
	    };
	    c.current = f;
	  } else f = c.current;
	  c = v(function () {
	    function a(a) {
	      if (!c) {
	        c = !0;
	        d = a;
	        a = l(a);
	        if (void 0 !== g && f.hasValue) {
	          var b = f.value;
	          if (g(b, a)) return k = b;
	        }
	        return k = a;
	      }
	      b = k;
	      if (q(d, a)) return b;
	      var e = l(a);
	      if (void 0 !== g && g(b, e)) return b;
	      d = a;
	      return k = e;
	    }
	    var c = !1,
	      d,
	      k,
	      m = void 0 === e ? null : e;
	    return [function () {
	      return a(b());
	    }, null === m ? void 0 : function () {
	      return a(m());
	    }];
	  }, [b, e, l, g]);
	  var d = r(a, c[0], c[1]);
	  u(function () {
	    f.hasValue = !0;
	    f.value = d;
	  }, [d]);
	  w(d);
	  return d;
	};
	return withSelector_production_min;
}

var withSelector_development = {};

/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredWithSelector_development;

function requireWithSelector_development () {
	if (hasRequiredWithSelector_development) return withSelector_development;
	hasRequiredWithSelector_development = 1;

	if (process.env.NODE_ENV !== "production") {
	  (function () {

	    /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
	    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === 'function') {
	      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
	    }
	    var React = require$$0;
	    var shim = requireShim();

	    /**
	     * inlined Object.is polyfill to avoid requiring consumers ship their own
	     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	     */
	    function is(x, y) {
	      return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y // eslint-disable-line no-self-compare
	      ;
	    }

	    var objectIs = typeof Object.is === 'function' ? Object.is : is;
	    var useSyncExternalStore = shim.useSyncExternalStore;

	    // for CommonJS interop.

	    var useRef = React.useRef,
	      useEffect = React.useEffect,
	      useMemo = React.useMemo,
	      useDebugValue = React.useDebugValue; // Same as useSyncExternalStore, but supports selector and isEqual arguments.

	    function useSyncExternalStoreWithSelector(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
	      // Use this to track the rendered snapshot.
	      var instRef = useRef(null);
	      var inst;
	      if (instRef.current === null) {
	        inst = {
	          hasValue: false,
	          value: null
	        };
	        instRef.current = inst;
	      } else {
	        inst = instRef.current;
	      }
	      var _useMemo = useMemo(function () {
	          // Track the memoized state using closure variables that are local to this
	          // memoized instance of a getSnapshot function. Intentionally not using a
	          // useRef hook, because that state would be shared across all concurrent
	          // copies of the hook/component.
	          var hasMemo = false;
	          var memoizedSnapshot;
	          var memoizedSelection;
	          var memoizedSelector = function (nextSnapshot) {
	            if (!hasMemo) {
	              // The first time the hook is called, there is no memoized result.
	              hasMemo = true;
	              memoizedSnapshot = nextSnapshot;
	              var _nextSelection = selector(nextSnapshot);
	              if (isEqual !== undefined) {
	                // Even if the selector has changed, the currently rendered selection
	                // may be equal to the new selection. We should attempt to reuse the
	                // current value if possible, to preserve downstream memoizations.
	                if (inst.hasValue) {
	                  var currentSelection = inst.value;
	                  if (isEqual(currentSelection, _nextSelection)) {
	                    memoizedSelection = currentSelection;
	                    return currentSelection;
	                  }
	                }
	              }
	              memoizedSelection = _nextSelection;
	              return _nextSelection;
	            } // We may be able to reuse the previous invocation's result.

	            // We may be able to reuse the previous invocation's result.
	            var prevSnapshot = memoizedSnapshot;
	            var prevSelection = memoizedSelection;
	            if (objectIs(prevSnapshot, nextSnapshot)) {
	              // The snapshot is the same as last time. Reuse the previous selection.
	              return prevSelection;
	            } // The snapshot has changed, so we need to compute a new selection.

	            // The snapshot has changed, so we need to compute a new selection.
	            var nextSelection = selector(nextSnapshot); // If a custom isEqual function is provided, use that to check if the data
	            // has changed. If it hasn't, return the previous selection. That signals
	            // to React that the selections are conceptually equal, and we can bail
	            // out of rendering.

	            // If a custom isEqual function is provided, use that to check if the data
	            // has changed. If it hasn't, return the previous selection. That signals
	            // to React that the selections are conceptually equal, and we can bail
	            // out of rendering.
	            if (isEqual !== undefined && isEqual(prevSelection, nextSelection)) {
	              return prevSelection;
	            }
	            memoizedSnapshot = nextSnapshot;
	            memoizedSelection = nextSelection;
	            return nextSelection;
	          }; // Assigning this to a constant so that Flow knows it can't change.

	          // Assigning this to a constant so that Flow knows it can't change.
	          var maybeGetServerSnapshot = getServerSnapshot === undefined ? null : getServerSnapshot;
	          var getSnapshotWithSelector = function () {
	            return memoizedSelector(getSnapshot());
	          };
	          var getServerSnapshotWithSelector = maybeGetServerSnapshot === null ? undefined : function () {
	            return memoizedSelector(maybeGetServerSnapshot());
	          };
	          return [getSnapshotWithSelector, getServerSnapshotWithSelector];
	        }, [getSnapshot, getServerSnapshot, selector, isEqual]),
	        getSelection = _useMemo[0],
	        getServerSelection = _useMemo[1];
	      var value = useSyncExternalStore(subscribe, getSelection, getServerSelection);
	      useEffect(function () {
	        inst.hasValue = true;
	        inst.value = value;
	      }, [value]);
	      useDebugValue(value);
	      return value;
	    }
	    withSelector_development.useSyncExternalStoreWithSelector = useSyncExternalStoreWithSelector;
	    /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
	    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === 'function') {
	      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
	    }
	  })();
	}
	return withSelector_development;
}

if (process.env.NODE_ENV === 'production') {
  withSelector.exports = requireWithSelector_production_min();
} else {
  withSelector.exports = requireWithSelector_development();
}

var withSelectorExports = withSelector.exports;
var useSyncExternalStoreExports = /*@__PURE__*/getDefaultExportFromCjs(withSelectorExports);

const {
  useSyncExternalStoreWithSelector
} = useSyncExternalStoreExports;
function useStore$1(api, selector = api.getState, equalityFn) {
  const slice = useSyncExternalStoreWithSelector(api.subscribe, api.getState, api.getServerState || api.getState, selector, equalityFn);
  useDebugValue(slice);
  return slice;
}
const createImpl = createState => {
  if ((import.meta.env && import.meta.env.MODE) !== "production" && typeof createState !== "function") {
    console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");
  }
  const api = typeof createState === "function" ? createStore(createState) : createState;
  const useBoundStore = (selector, equalityFn) => useStore$1(api, selector, equalityFn);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = createState => createState ? createImpl(createState) : createImpl;

function createJSONStorage(getStorage, options) {
  let storage;
  try {
    storage = getStorage();
  } catch (e) {
    return;
  }
  const persistStorage = {
    getItem: name => {
      var _a;
      const parse = str2 => {
        if (str2 === null) {
          return null;
        }
        return JSON.parse(str2, options == null ? void 0 : options.reviver);
      };
      const str = (_a = storage.getItem(name)) != null ? _a : null;
      if (str instanceof Promise) {
        return str.then(parse);
      }
      return parse(str);
    },
    setItem: (name, newValue) => storage.setItem(name, JSON.stringify(newValue, options == null ? void 0 : options.replacer)),
    removeItem: name => storage.removeItem(name)
  };
  return persistStorage;
}
const toThenable = fn => input => {
  try {
    const result = fn(input);
    if (result instanceof Promise) {
      return result;
    }
    return {
      then(onFulfilled) {
        return toThenable(onFulfilled)(result);
      },
      catch(_onRejected) {
        return this;
      }
    };
  } catch (e) {
    return {
      then(_onFulfilled) {
        return this;
      },
      catch(onRejected) {
        return toThenable(onRejected)(e);
      }
    };
  }
};
const oldImpl = (config, baseOptions) => (set, get, api) => {
  let options = {
    getStorage: () => localStorage,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    partialize: state => state,
    version: 0,
    merge: (persistedState, currentState) => ({
      ...currentState,
      ...persistedState
    }),
    ...baseOptions
  };
  let hasHydrated = false;
  const hydrationListeners = /* @__PURE__ */new Set();
  const finishHydrationListeners = /* @__PURE__ */new Set();
  let storage;
  try {
    storage = options.getStorage();
  } catch (e) {}
  if (!storage) {
    return config((...args) => {
      console.warn(`[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`);
      set(...args);
    }, get, api);
  }
  const thenableSerialize = toThenable(options.serialize);
  const setItem = () => {
    const state = options.partialize({
      ...get()
    });
    let errorInSync;
    const thenable = thenableSerialize({
      state,
      version: options.version
    }).then(serializedValue => storage.setItem(options.name, serializedValue)).catch(e => {
      errorInSync = e;
    });
    if (errorInSync) {
      throw errorInSync;
    }
    return thenable;
  };
  const savedSetState = api.setState;
  api.setState = (state, replace) => {
    savedSetState(state, replace);
    void setItem();
  };
  const configResult = config((...args) => {
    set(...args);
    void setItem();
  }, get, api);
  let stateFromStorage;
  const hydrate = () => {
    var _a;
    if (!storage) return;
    hasHydrated = false;
    hydrationListeners.forEach(cb => cb(get()));
    const postRehydrationCallback = ((_a = options.onRehydrateStorage) == null ? void 0 : _a.call(options, get())) || void 0;
    return toThenable(storage.getItem.bind(storage))(options.name).then(storageValue => {
      if (storageValue) {
        return options.deserialize(storageValue);
      }
    }).then(deserializedStorageValue => {
      if (deserializedStorageValue) {
        if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
          if (options.migrate) {
            return options.migrate(deserializedStorageValue.state, deserializedStorageValue.version);
          }
          console.error(`State loaded from storage couldn't be migrated since no migrate function was provided`);
        } else {
          return deserializedStorageValue.state;
        }
      }
    }).then(migratedState => {
      var _a2;
      stateFromStorage = options.merge(migratedState, (_a2 = get()) != null ? _a2 : configResult);
      set(stateFromStorage, true);
      return setItem();
    }).then(() => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(stateFromStorage, void 0);
      hasHydrated = true;
      finishHydrationListeners.forEach(cb => cb(stateFromStorage));
    }).catch(e => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
    });
  };
  api.persist = {
    setOptions: newOptions => {
      options = {
        ...options,
        ...newOptions
      };
      if (newOptions.getStorage) {
        storage = newOptions.getStorage();
      }
    },
    clearStorage: () => {
      storage == null ? void 0 : storage.removeItem(options.name);
    },
    getOptions: () => options,
    rehydrate: () => hydrate(),
    hasHydrated: () => hasHydrated,
    onHydrate: cb => {
      hydrationListeners.add(cb);
      return () => {
        hydrationListeners.delete(cb);
      };
    },
    onFinishHydration: cb => {
      finishHydrationListeners.add(cb);
      return () => {
        finishHydrationListeners.delete(cb);
      };
    }
  };
  hydrate();
  return stateFromStorage || configResult;
};
const newImpl = (config, baseOptions) => (set, get, api) => {
  let options = {
    storage: createJSONStorage(() => localStorage),
    partialize: state => state,
    version: 0,
    merge: (persistedState, currentState) => ({
      ...currentState,
      ...persistedState
    }),
    ...baseOptions
  };
  let hasHydrated = false;
  const hydrationListeners = /* @__PURE__ */new Set();
  const finishHydrationListeners = /* @__PURE__ */new Set();
  let storage = options.storage;
  if (!storage) {
    return config((...args) => {
      console.warn(`[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`);
      set(...args);
    }, get, api);
  }
  const setItem = () => {
    const state = options.partialize({
      ...get()
    });
    return storage.setItem(options.name, {
      state,
      version: options.version
    });
  };
  const savedSetState = api.setState;
  api.setState = (state, replace) => {
    savedSetState(state, replace);
    void setItem();
  };
  const configResult = config((...args) => {
    set(...args);
    void setItem();
  }, get, api);
  let stateFromStorage;
  const hydrate = () => {
    var _a, _b;
    if (!storage) return;
    hasHydrated = false;
    hydrationListeners.forEach(cb => {
      var _a2;
      return cb((_a2 = get()) != null ? _a2 : configResult);
    });
    const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
    return toThenable(storage.getItem.bind(storage))(options.name).then(deserializedStorageValue => {
      if (deserializedStorageValue) {
        if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
          if (options.migrate) {
            return options.migrate(deserializedStorageValue.state, deserializedStorageValue.version);
          }
          console.error(`State loaded from storage couldn't be migrated since no migrate function was provided`);
        } else {
          return deserializedStorageValue.state;
        }
      }
    }).then(migratedState => {
      var _a2;
      stateFromStorage = options.merge(migratedState, (_a2 = get()) != null ? _a2 : configResult);
      set(stateFromStorage, true);
      return setItem();
    }).then(() => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(stateFromStorage, void 0);
      stateFromStorage = get();
      hasHydrated = true;
      finishHydrationListeners.forEach(cb => cb(stateFromStorage));
    }).catch(e => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
    });
  };
  api.persist = {
    setOptions: newOptions => {
      options = {
        ...options,
        ...newOptions
      };
      if (newOptions.storage) {
        storage = newOptions.storage;
      }
    },
    clearStorage: () => {
      storage == null ? void 0 : storage.removeItem(options.name);
    },
    getOptions: () => options,
    rehydrate: () => hydrate(),
    hasHydrated: () => hasHydrated,
    onHydrate: cb => {
      hydrationListeners.add(cb);
      return () => {
        hydrationListeners.delete(cb);
      };
    },
    onFinishHydration: cb => {
      finishHydrationListeners.add(cb);
      return () => {
        finishHydrationListeners.delete(cb);
      };
    }
  };
  if (!options.skipHydration) {
    hydrate();
  }
  return stateFromStorage || configResult;
};
const persistImpl = (config, baseOptions) => {
  if ("getStorage" in baseOptions || "serialize" in baseOptions || "deserialize" in baseOptions) {
    if ((import.meta.env && import.meta.env.MODE) !== "production") {
      console.warn("[DEPRECATED] `getStorage`, `serialize` and `deserialize` options are deprecated. Use `storage` option instead.");
    }
    return oldImpl(config, baseOptions);
  }
  return newImpl(config, baseOptions);
};
const persist = persistImpl;

var defaultSystemPrompt = "A chat between a curious user and a AI chatbot named SmartestChild on AIM who responds with lowercase, frequent emojis, and 2000s internet abbreviations.";
var useConversationStore = create()(persist(function (set, get) {
    var initialConversation = {
        id: v4(),
        title: "Untitled",
        updatedAt: new Date().getTime(),
        systemPrompt: defaultSystemPrompt,
        createdAt: new Date().getTime(),
        messages: [],
    };
    return {
        conversations: [initialConversation],
        currentConversationId: initialConversation.id,
        createConversation: function (conversation) {
            set(function (state) {
                return {
                    currentConversationId: conversation.id,
                    conversations: __spreadArray(__spreadArray([], state.conversations, true), [conversation], false),
                };
            });
        },
        setConversationTitle: function (conversationId, title) {
            set(function (state) {
                var conversation = state.conversations.find(function (c) { return c.id === conversationId; });
                if (!conversation) {
                    return state;
                }
                return {
                    conversations: __spreadArray(__spreadArray([], state.conversations.filter(function (c) { return c.id !== conversationId; }), true), [
                        __assign(__assign({}, conversation), { title: title }),
                    ], false),
                };
            });
        },
        deleteConversation: function (conversationId) {
            console.log("delete", conversationId);
            set(function (state) {
                return {
                    conversations: state.conversations.filter(function (c) { return c.id !== conversationId; }),
                };
            });
        },
        setConversationId: function (conversationId) {
            var conversationExists = get().conversations.some(function (c) { return c.id === conversationId; });
            if (!conversationExists) {
                throw new Error("Invalid conversation id");
            }
            set(function (state) {
                return __assign(__assign({}, state), { currentConversationId: conversationId });
            });
        },
        deleteAllConversations: function () {
            set(function (state) {
                return {
                    conversations: [],
                };
            });
        },
        deleteMessages: function (conversationId) {
            set(function (state) {
                var conversation = state.conversations.find(function (c) { return c.id === conversationId; });
                if (!conversation) {
                    return state;
                }
                return {
                    conversations: __spreadArray(__spreadArray([], state.conversations.filter(function (c) { return c.id !== conversationId; }), true), [
                        __assign(__assign({}, conversation), { updatedAt: new Date().getTime(), messages: [] }),
                    ], false),
                };
            });
        },
        getConversation: function (conversationId) {
            return get().conversations.find(function (c) { return c.id === conversationId; });
        },
        getAllConversations: function () {
            return get().conversations;
        },
        addMessage: function (conversationId, message) {
            set(function (state) {
                var conversation = state.conversations.find(function (c) { return c.id === conversationId; });
                if (!conversation) {
                    return state;
                }
                var existingMessage = conversation.messages.find(function (m) { return m.id === message.id; });
                if (existingMessage) {
                    // Update message
                    return {
                        conversations: __spreadArray(__spreadArray([], state.conversations.filter(function (c) { return c.id !== conversationId; }), true), [
                            __assign(__assign({}, conversation), { updatedAt: new Date().getTime(), messages: __spreadArray(__spreadArray([], conversation.messages.filter(function (m) { return m.id !== message.id; }), true), [
                                    message,
                                ], false) }),
                        ], false),
                    };
                }
                // Add message
                return {
                    conversations: __spreadArray(__spreadArray([], state.conversations.filter(function (c) { return c.id !== conversationId; }), true), [
                        __assign(__assign({}, conversation), { updatedAt: new Date().getTime(), messages: __spreadArray(__spreadArray([], conversation.messages, true), [message], false) }),
                    ], false),
                };
            });
        },
    };
}, {
    name: "chat-store",
    getStorage: function () { return sessionStorage; },
}));

// https://github.com/pmndrs/zustand/blob/65d2bc0660ab0d542cf9f97a3b004754ffa73f3e/docs/integrations/persisting-store-data.md?plain=1#L471-L488
var useStore = function (store, callback) {
    var result = store(callback);
    var _a = useState(), data = _a[0], setData = _a[1];
    useEffect(function () {
        setData(result);
    }, [result]);
    return data;
};

var initialProgress = {
    type: "init",
    progress: 0,
    timeElapsed: 0,
    currentChunk: 0,
    totalChunks: 0,
    fetchedBytes: 0,
    totalBytes: 0,
};
var useLLMContext = function () {
    var _a = useState(initialProgress), loadingStatus = _a[0], setLoadingStatus = _a[1];
    var _b = useState(false), isGenerating = _b[0], setIsGenerating = _b[1];
    var _c = useState(100), maxTokens = _c[0], setMaxTokens = _c[1];
    var workerRef = useRef();
    var cStore = useStore(useConversationStore, function (state) { return state; });
    var addMessage = useCallback(function (resp) {
        if (resp.isFinished) {
            setIsGenerating(false);
        }
        cStore === null || cStore === void 0 ? void 0 : cStore.addMessage(cStore === null || cStore === void 0 ? void 0 : cStore.currentConversationId, {
            id: resp.requestId,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            role: "assistant",
            text: resp.outputText,
        });
    }, [cStore, cStore === null || cStore === void 0 ? void 0 : cStore.currentConversationId]);
    useEffect(function () {
        if (!workerRef.current) {
            workerRef.current = wrap(new Worker(new URL("worker-13bc6d56.js", import.meta.url)));
        }
    }, []);
    var send = function (msg) {
        var _a;
        var currentConversation = cStore === null || cStore === void 0 ? void 0 : cStore.getConversation(cStore === null || cStore === void 0 ? void 0 : cStore.currentConversationId);
        if (!currentConversation) {
            throw new Error("Invalid conversation id");
        }
        currentConversation === null || currentConversation === void 0 ? void 0 : currentConversation.messages.push({
            id: v4(),
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            role: "user",
            text: msg,
        });
        setIsGenerating(true);
        (_a = workerRef === null || workerRef === void 0 ? void 0 : workerRef.current) === null || _a === void 0 ? void 0 : _a.generate(currentConversation, [], maxTokens, proxy(addMessage));
    };
    return {
        conversation: cStore === null || cStore === void 0 ? void 0 : cStore.getConversation(cStore === null || cStore === void 0 ? void 0 : cStore.currentConversationId),
        // sort by updatedAt
        allConversations: cStore === null || cStore === void 0 ? void 0 : cStore.conversations.sort(function (a, b) { return b.updatedAt - a.updatedAt; }),
        createConversation: function (title, prompt) {
            var id = v4();
            cStore === null || cStore === void 0 ? void 0 : cStore.createConversation({
                id: id,
                title: title !== null && title !== void 0 ? title : "Untitled",
                systemPrompt: prompt !== null && prompt !== void 0 ? prompt : defaultSystemPrompt,
                messages: [],
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime(),
            });
        },
        setConversationTitle: function (id, title) {
            cStore === null || cStore === void 0 ? void 0 : cStore.setConversationTitle(id, title);
        },
        setConversationId: function (id) {
            cStore === null || cStore === void 0 ? void 0 : cStore.setConversationId(id);
        },
        deleteConversation: function (id) {
            cStore === null || cStore === void 0 ? void 0 : cStore.deleteConversation(id);
        },
        deleteMessages: function () { return cStore === null || cStore === void 0 ? void 0 : cStore.deleteMessages(cStore === null || cStore === void 0 ? void 0 : cStore.currentConversationId); },
        maxTokens: maxTokens,
        setMaxTokens: setMaxTokens,
        loadingStatus: loadingStatus,
        isGenerating: isGenerating,
        send: send,
        init: function () { var _a; return (_a = workerRef === null || workerRef === void 0 ? void 0 : workerRef.current) === null || _a === void 0 ? void 0 : _a.init(proxy(setLoadingStatus)); },
        deleteAllConversations: function () { return cStore === null || cStore === void 0 ? void 0 : cStore.deleteAllConversations(); },
    };
};

var ModelContext = createContext(null);
var ModelProvider = function (_a) {
    var children = _a.children;
    var LLMValue = useLLMContext();
    return (require$$0.createElement(ModelContext.Provider, { value: LLMValue }, children));
};
var useLLM = function () {
    var context = useContext(ModelContext);
    if (context === null) {
        throw new Error("useLLMContext must be used within a LLMProvider");
    }
    return context;
};

export { ModelProvider, useLLM as default };
