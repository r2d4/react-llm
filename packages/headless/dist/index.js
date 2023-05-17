import require$$0, { useDebugValue, useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { d as detectGPUDevice, w as wrap, p as proxy } from './comlink-225113f4.js';

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }
  return getRandomValues(rnds8);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = {
  randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}

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

const defaultSystemPrompt$1 = "A chat between a curious user and a AI chatbot named SmartestChild on AIM who responds with lowercase, frequent emojis, and 2000s internet abbreviations.";
const useConversationStore = create()((set, get) => {
    const initialConversation = {
        id: v4(),
        title: "Untitled",
        updatedAt: new Date().getTime(),
        systemPrompt: defaultSystemPrompt$1,
        createdAt: new Date().getTime(),
        messages: [],
    };
    return {
        conversations: [initialConversation],
        currentConversationId: initialConversation.id,
        createConversation: (conversation) => {
            set((state) => {
                return {
                    currentConversationId: conversation.id,
                    conversations: [...state.conversations, conversation],
                };
            });
        },
        setConversationPrompt(conversationId, prompt) {
            set((state) => {
                const conversation = state.conversations.find((c) => c.id === conversationId);
                if (!conversation) {
                    return state;
                }
                return {
                    conversations: [
                        ...state.conversations.filter((c) => c.id !== conversationId),
                        {
                            ...conversation,
                            systemPrompt: prompt,
                        },
                    ],
                };
            });
        },
        setConversationTitle(conversationId, title) {
            set((state) => {
                const conversation = state.conversations.find((c) => c.id === conversationId);
                if (!conversation) {
                    return state;
                }
                return {
                    conversations: [
                        ...state.conversations.filter((c) => c.id !== conversationId),
                        {
                            ...conversation,
                            title,
                        },
                    ],
                };
            });
        },
        deleteConversation(conversationId) {
            set((state) => {
                return {
                    conversations: state.conversations.filter((c) => c.id !== conversationId),
                };
            });
        },
        setConversationId: (conversationId) => {
            const conversationExists = get().conversations.some((c) => c.id === conversationId);
            if (!conversationExists) {
                throw new Error("Invalid conversation id");
            }
            set((state) => {
                return {
                    ...state,
                    currentConversationId: conversationId,
                };
            });
        },
        deleteAllConversations: () => {
            set((state) => {
                return {
                    conversations: [],
                };
            });
        },
        deleteMessages: (conversationId) => {
            set((state) => {
                const conversation = state.conversations.find((c) => c.id === conversationId);
                if (!conversation) {
                    return state;
                }
                return {
                    conversations: [
                        ...state.conversations.filter((c) => c.id !== conversationId),
                        {
                            ...conversation,
                            updatedAt: new Date().getTime(),
                            messages: [],
                        },
                    ],
                };
            });
        },
        getConversation(conversationId) {
            return get().conversations.find((c) => c.id === conversationId);
        },
        getAllConversations() {
            return get().conversations;
        },
        addMessage: (conversationId, message) => {
            set((state) => {
                const conversation = state.conversations.find((c) => c.id === conversationId);
                if (!conversation) {
                    return state;
                }
                const existingMessage = conversation.messages.find((m) => m.id === message.id);
                if (existingMessage) {
                    // Update message
                    return {
                        conversations: [
                            ...state.conversations.filter((c) => c.id !== conversationId),
                            {
                                ...conversation,
                                updatedAt: new Date().getTime(),
                                messages: [
                                    ...conversation.messages.filter((m) => m.id !== message.id),
                                    message,
                                ],
                            },
                        ],
                    };
                }
                // Add message
                return {
                    conversations: [
                        ...state.conversations.filter((c) => c.id !== conversationId),
                        {
                            ...conversation,
                            updatedAt: new Date().getTime(),
                            messages: [...conversation.messages, message],
                        },
                    ],
                };
            });
        },
    };
});

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

const defaultSystemPrompt = "A chat between a curious user and a AI chatbot named SmartestChild on AIM who responds with lowercase, frequent emojis, and 2000s internet abbreviations.";
const usePersistantConversationStore = create()(persist((set, get) => {
    const initialConversation = {
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
        createConversation: (conversation) => {
            set((state) => {
                return {
                    currentConversationId: conversation.id,
                    conversations: [...state.conversations, conversation],
                };
            });
        },
        setConversationPrompt(conversationId, prompt) {
            set((state) => {
                const conversation = state.conversations.find((c) => c.id === conversationId);
                if (!conversation) {
                    return state;
                }
                return {
                    conversations: [
                        ...state.conversations.filter((c) => c.id !== conversationId),
                        {
                            ...conversation,
                            systemPrompt: prompt,
                        },
                    ],
                };
            });
        },
        setConversationTitle(conversationId, title) {
            set((state) => {
                const conversation = state.conversations.find((c) => c.id === conversationId);
                if (!conversation) {
                    return state;
                }
                return {
                    conversations: [
                        ...state.conversations.filter((c) => c.id !== conversationId),
                        {
                            ...conversation,
                            title,
                        },
                    ],
                };
            });
        },
        deleteConversation(conversationId) {
            set((state) => {
                return {
                    conversations: state.conversations.filter((c) => c.id !== conversationId),
                };
            });
        },
        setConversationId: (conversationId) => {
            const conversationExists = get().conversations.some((c) => c.id === conversationId);
            if (!conversationExists) {
                throw new Error("Invalid conversation id");
            }
            set((state) => {
                return {
                    ...state,
                    currentConversationId: conversationId,
                };
            });
        },
        deleteAllConversations: () => {
            set((state) => {
                return {
                    conversations: [],
                };
            });
        },
        deleteMessages: (conversationId) => {
            set((state) => {
                const conversation = state.conversations.find((c) => c.id === conversationId);
                if (!conversation) {
                    return state;
                }
                return {
                    conversations: [
                        ...state.conversations.filter((c) => c.id !== conversationId),
                        {
                            ...conversation,
                            updatedAt: new Date().getTime(),
                            messages: [],
                        },
                    ],
                };
            });
        },
        getConversation(conversationId) {
            return get().conversations.find((c) => c.id === conversationId);
        },
        getAllConversations() {
            return get().conversations;
        },
        addMessage: (conversationId, message) => {
            set((state) => {
                const conversation = state.conversations.find((c) => c.id === conversationId);
                if (!conversation) {
                    return state;
                }
                const existingMessage = conversation.messages.find((m) => m.id === message.id);
                if (existingMessage) {
                    // Update message
                    return {
                        conversations: [
                            ...state.conversations.filter((c) => c.id !== conversationId),
                            {
                                ...conversation,
                                updatedAt: new Date().getTime(),
                                messages: [
                                    ...conversation.messages.filter((m) => m.id !== message.id),
                                    message,
                                ],
                            },
                        ],
                    };
                }
                // Add message
                return {
                    conversations: [
                        ...state.conversations.filter((c) => c.id !== conversationId),
                        {
                            ...conversation,
                            updatedAt: new Date().getTime(),
                            messages: [...conversation.messages, message],
                        },
                    ],
                };
            });
        },
    };
}, {
    name: "chat-store",
    getStorage: () => sessionStorage,
}));

// https://github.com/pmndrs/zustand/blob/65d2bc0660ab0d542cf9f97a3b004754ffa73f3e/docs/integrations/persisting-store-data.md?plain=1#L471-L488
const useStore = (store, callback) => {
    const result = store(callback);
    const [data, setData] = useState();
    useEffect(() => {
        setData(result);
    }, [result]);
    return data;
};

const initialProgress = {
    type: "init",
    progress: 0,
    timeElapsed: 0,
    currentChunk: 0,
    totalChunks: 0,
    fetchedBytes: 0,
    totalBytes: 0,
};
const useLLMContext = (props = {
    persistToLocalStorage: true,
}) => {
    const [loadingStatus, setLoadingStatus] = useState(initialProgress);
    const [isGenerating, setIsGenerating] = useState(false);
    const workerRef = useRef();
    const cStore = props.persistToLocalStorage
        ? useStore(usePersistantConversationStore, (state) => state)
        : useStore(useConversationStore, (state) => state);
    const [userRoleName, setUserRoleName] = useState("user");
    const [assistantRoleName, setAssistantRoleName] = useState("assistant");
    const [gpuDevice, setGpuDevice] = useState({
        adapter: null,
        device: null,
        adapterInfo: null,
        checked: false,
        unsupportedReason: null,
    });
    useEffect(() => {
        if (!gpuDevice || !gpuDevice.checked) {
            detectGPUDevice()
                .then((resp) => {
                if (resp) {
                    setGpuDevice({
                        unsupportedReason: null,
                        checked: true,
                        adapter: resp.adapter,
                        device: resp.device,
                        adapterInfo: resp.adapterInfo,
                    });
                }
                else {
                    setGpuDevice({
                        ...gpuDevice,
                        checked: true,
                        unsupportedReason: "GPU is not supported",
                    });
                }
            })
                .catch((err) => {
                setGpuDevice({
                    adapter: null,
                    device: null,
                    adapterInfo: null,
                    checked: true,
                    unsupportedReason: err.message,
                });
            });
        }
    }, []);
    const [onMessage, setOnMessage] = useState();
    const addMessage = useCallback((resp) => {
        if (resp.isFinished) {
            setIsGenerating(false);
        }
        if (onMessage)
            onMessage(resp);
        cStore?.addMessage(cStore?.currentConversationId, {
            id: resp.requestId,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            role: assistantRoleName,
            text: resp.outputText,
        });
    }, [cStore, cStore?.currentConversationId, onMessage, setOnMessage]);
    useEffect(() => {
        if (!workerRef.current) {
            if (props.api) {
                workerRef.current = props.api;
            }
            else {
                workerRef.current = wrap(new Worker(new URL("worker-e4952377.js", import.meta.url)));
            }
        }
    }, [props.api]);
    const send = useCallback((text, maxTokens = 100, stopStrings = [userRoleName, assistantRoleName]) => {
        const currentConversation = cStore?.getConversation(cStore?.currentConversationId);
        if (!currentConversation) {
            throw new Error("Invalid conversation id");
        }
        currentConversation?.messages.push({
            id: v4(),
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            role: userRoleName,
            text,
        });
        setIsGenerating(true);
        workerRef?.current?.generate({
            conversation: currentConversation,
            stopTexts: stopStrings,
            maxTokens,
            assistantRoleName,
        }, proxy(addMessage));
    }, [workerRef?.current]);
    return {
        conversation: cStore?.getConversation(cStore?.currentConversationId),
        allConversations: cStore?.conversations.sort((a, b) => b.updatedAt - a.updatedAt),
        createConversation: (title, prompt) => {
            const id = v4();
            cStore?.createConversation({
                id,
                title: title ?? "Untitled",
                systemPrompt: prompt ?? defaultSystemPrompt$1,
                messages: [],
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime(),
            });
        },
        setConversationTitle: (id, title) => {
            cStore?.setConversationTitle(id, title);
        },
        setConversationPrompt: (prompt) => {
            cStore?.setConversationPrompt(cStore?.currentConversationId, prompt);
        },
        setConversationId: (id) => {
            cStore?.setConversationId(id);
        },
        deleteConversation: (id) => {
            cStore?.deleteConversation(id);
        },
        deleteMessages: () => cStore?.deleteMessages(cStore?.currentConversationId),
        onMessage,
        setOnMessage,
        loadingStatus,
        isGenerating,
        userRoleName,
        setUserRoleName,
        assistantRoleName,
        setAssistantRoleName,
        gpuDevice,
        send,
        init: (config) => workerRef?.current?.init(proxy(setLoadingStatus), config),
        deleteAllConversations: () => cStore?.deleteAllConversations(),
    };
};

const ModelContext = createContext(null);
const ModelProvider = ({ children, config, }) => {
    const LLMValue = useLLMContext(config);
    return (require$$0.createElement(ModelContext.Provider, { value: LLMValue }, children));
};
const useLLM = () => {
    const context = useContext(ModelContext);
    if (context === null) {
        throw new Error("useLLMContext must be used within a LLMProvider");
    }
    return context;
};

export { ModelProvider, useLLM as default, useLLM };
