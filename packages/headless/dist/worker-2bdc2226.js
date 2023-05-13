import { b as __awaiter, c as __generator, d as __extends, a as __assign, v as v4, e as expose } from './_tslib-f6a38a96.js';

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/** NodeJS and Web compact layer */
/**
 * Get performance measurement.
 */
function getPerformance() {
    return performance;
}

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/**
 * Size of common data types.
 */
var SizeOf;
(function (SizeOf) {
    SizeOf[SizeOf["U8"] = 1] = "U8";
    SizeOf[SizeOf["U16"] = 2] = "U16";
    SizeOf[SizeOf["I32"] = 4] = "I32";
    SizeOf[SizeOf["I64"] = 8] = "I64";
    SizeOf[SizeOf["F32"] = 4] = "F32";
    SizeOf[SizeOf["F64"] = 8] = "F64";
    SizeOf[SizeOf["TVMValue"] = 8] = "TVMValue";
    SizeOf[SizeOf["DLDataType"] = 4] = "DLDataType";
    SizeOf[SizeOf["DLDevice"] = 8] = "DLDevice";
})(SizeOf || (SizeOf = {}));
/**
 * Argument Type code in TVM FFI.
 */
var ArgTypeCode;
(function (ArgTypeCode) {
    ArgTypeCode[ArgTypeCode["Int"] = 0] = "Int";
    ArgTypeCode[ArgTypeCode["UInt"] = 1] = "UInt";
    ArgTypeCode[ArgTypeCode["Float"] = 2] = "Float";
    ArgTypeCode[ArgTypeCode["TVMOpaqueHandle"] = 3] = "TVMOpaqueHandle";
    ArgTypeCode[ArgTypeCode["Null"] = 4] = "Null";
    ArgTypeCode[ArgTypeCode["TVMDataType"] = 5] = "TVMDataType";
    ArgTypeCode[ArgTypeCode["DLDevice"] = 6] = "DLDevice";
    ArgTypeCode[ArgTypeCode["TVMDLTensorHandle"] = 7] = "TVMDLTensorHandle";
    ArgTypeCode[ArgTypeCode["TVMObjectHandle"] = 8] = "TVMObjectHandle";
    ArgTypeCode[ArgTypeCode["TVMModuleHandle"] = 9] = "TVMModuleHandle";
    ArgTypeCode[ArgTypeCode["TVMPackedFuncHandle"] = 10] = "TVMPackedFuncHandle";
    ArgTypeCode[ArgTypeCode["TVMStr"] = 11] = "TVMStr";
    ArgTypeCode[ArgTypeCode["TVMBytes"] = 12] = "TVMBytes";
    ArgTypeCode[ArgTypeCode["TVMNDArrayHandle"] = 13] = "TVMNDArrayHandle";
    ArgTypeCode[ArgTypeCode["TVMObjectRValueRefArg"] = 14] = "TVMObjectRValueRefArg";
})(ArgTypeCode || (ArgTypeCode = {}));

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/**
 * Convert string to Uint8array.
 * @param str The string.
 * @returns The corresponding Uint8Array.
 */
function StringToUint8Array(str) {
    var arr = new Uint8Array(str.length + 1);
    for (var i = 0; i < str.length; ++i) {
        arr[i] = str.charCodeAt(i);
    }
    arr[str.length] = 0;
    return arr;
}
/**
 * Internal assert helper
 * @param condition condition The condition to fail.
 * @param msg msg The message.
 */
function assert(condition, msg) {
    if (!condition) {
        throw new Error("AssertError:" + (msg || ""));
    }
}

/**
 * Detect library provider from the importObject.
 *
 * @param importObject The import object.
 */
function detectLibraryProvider(importObject) {
    if (importObject["wasmLibraryProvider"] &&
        importObject["wasmLibraryProvider"]["start"] &&
        importObject["wasmLibraryProvider"]["imports"] !== undefined) {
        var item_1 = importObject;
        // create provider so that we capture imports in the provider.
        return {
            imports: item_1.wasmLibraryProvider.imports,
            start: function (inst) {
                item_1.wasmLibraryProvider.start(inst);
            },
        };
    }
    else if (importObject["imports"] && importObject["start"] !== undefined) {
        return importObject;
    }
    else if (importObject["wasiImport"] && importObject["start"] !== undefined) {
        // WASI
        return {
            imports: {
                "wasi_snapshot_preview1": importObject["wasiImport"],
            },
            start: function (inst) {
                importObject["start"](inst);
            }
        };
    }
    else {
        return undefined;
    }
}
/**
 * Environment to impelement most of the JS library functions.
 */
var Environment = /** @class */ (function () {
    function Environment(importObject, logger) {
        if (importObject === void 0) { importObject = {}; }
        if (logger === void 0) { logger = console.log; }
        /**
         * Maintains a table of FTVMWasmPackedCFunc that the C part
         * can call via TVMWasmPackedCFunc.
         *
         * We maintain a separate table so that we can have un-limited amount
         * of functions that do not maps to the address space.
         */
        this.packedCFuncTable = [
            undefined,
        ];
        /**
         * Free table index that can be recycled.
         */
        this.packedCFuncTableFreeId = [];
        this.logger = logger;
        this.libProvider = detectLibraryProvider(importObject);
        // get imports from the provider
        if (this.libProvider !== undefined) {
            this.imports = this.libProvider.imports;
        }
        else {
            this.imports = importObject;
        }
        // update with more functions
        this.imports.env = this.environment(this.imports.env);
    }
    /** Mark the start of the instance. */
    Environment.prototype.start = function (inst) {
        if (this.libProvider !== undefined) {
            this.libProvider.start(inst);
        }
    };
    Environment.prototype.environment = function (initEnv) {
        var _this = this;
        // default env can be be overriden by libraries.
        var defaultEnv = {
            "__cxa_thread_atexit": function () { },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            "emscripten_notify_memory_growth": function (index) { }
        };
        var wasmPackedCFunc = function (args, typeCodes, nargs, ret, resourceHandle) {
            var cfunc = _this.packedCFuncTable[resourceHandle];
            assert(cfunc !== undefined);
            return cfunc(args, typeCodes, nargs, ret, resourceHandle);
        };
        var wasmPackedCFuncFinalizer = function (resourceHandle) {
            _this.packedCFuncTable[resourceHandle] = undefined;
            _this.packedCFuncTableFreeId.push(resourceHandle);
        };
        var newEnv = {
            TVMWasmPackedCFunc: wasmPackedCFunc,
            TVMWasmPackedCFuncFinalizer: wasmPackedCFuncFinalizer,
            "__console_log": function (msg) {
                _this.logger(msg);
            }
        };
        return Object.assign(defaultEnv, initEnv, newEnv);
    };
    return Environment;
}());

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/**
 * Classes to manipulate Wasm memories.
 */
/**
 * Wasm Memory wrapper to perform JS side raw memory access.
 */
var Memory = /** @class */ (function () {
    function Memory(memory) {
        this.wasm32 = true;
        this.memory = memory;
        this.buffer = this.memory.buffer;
        this.viewU8 = new Uint8Array(this.buffer);
        this.viewU16 = new Uint16Array(this.buffer);
        this.viewI32 = new Int32Array(this.buffer);
        this.viewU32 = new Uint32Array(this.buffer);
        this.viewF32 = new Float32Array(this.buffer);
        this.viewF64 = new Float64Array(this.buffer);
    }
    Memory.prototype.loadU8 = function (ptr) {
        if (this.buffer != this.memory.buffer) {
            this.updateViews();
        }
        return this.viewU8[ptr >> 0];
    };
    Memory.prototype.loadU16 = function (ptr) {
        if (this.buffer != this.memory.buffer) {
            this.updateViews();
        }
        return this.viewU16[ptr >> 1];
    };
    Memory.prototype.loadU32 = function (ptr) {
        if (this.buffer != this.memory.buffer) {
            this.updateViews();
        }
        return this.viewU32[ptr >> 2];
    };
    Memory.prototype.loadI32 = function (ptr) {
        if (this.buffer != this.memory.buffer) {
            this.updateViews();
        }
        return this.viewI32[ptr >> 2];
    };
    Memory.prototype.loadI64 = function (ptr) {
        if (this.buffer != this.memory.buffer) {
            this.updateViews();
        }
        var base = ptr >> 2;
        // assumes little endian, for now truncate high.
        return this.viewI32[base];
    };
    Memory.prototype.loadF32 = function (ptr) {
        if (this.buffer != this.memory.buffer) {
            this.updateViews();
        }
        return this.viewF32[ptr >> 2];
    };
    Memory.prototype.loadF64 = function (ptr) {
        if (this.buffer != this.memory.buffer) {
            this.updateViews();
        }
        return this.viewF64[ptr >> 3];
    };
    Memory.prototype.loadPointer = function (ptr) {
        if (this.buffer != this.memory.buffer) {
            this.updateViews();
        }
        if (this.wasm32) {
            return this.loadU32(ptr);
        }
        else {
            return this.loadI64(ptr);
        }
    };
    Memory.prototype.loadUSize = function (ptr) {
        if (this.buffer != this.memory.buffer) {
            this.updateViews();
        }
        if (this.wasm32) {
            return this.loadU32(ptr);
        }
        else {
            return this.loadI64(ptr);
        }
    };
    Memory.prototype.sizeofPtr = function () {
        return this.wasm32 ? SizeOf.I32 : SizeOf.I64;
    };
    /**
     * Load raw bytes from ptr.
     * @param ptr The head address
     * @param numBytes The number
     */
    Memory.prototype.loadRawBytes = function (ptr, numBytes) {
        if (this.buffer != this.memory.buffer) {
            this.updateViews();
        }
        var result = new Uint8Array(numBytes);
        result.set(this.viewU8.slice(ptr, ptr + numBytes));
        return result;
    };
    /**
     * Load TVMByteArray from ptr.
     *
     * @param ptr The address of the header.
     */
    Memory.prototype.loadTVMBytes = function (ptr) {
        var data = this.loadPointer(ptr);
        var length = this.loadUSize(ptr + this.sizeofPtr());
        return this.loadRawBytes(data, length);
    };
    /**
     * Load null-terminated C-string from ptr.
     * @param ptr The head address
     */
    Memory.prototype.loadCString = function (ptr) {
        if (this.buffer != this.memory.buffer) {
            this.updateViews();
        }
        // NOTE: the views are still valid for read.
        var ret = [];
        var ch = 1;
        while (ch != 0) {
            ch = this.viewU8[ptr];
            if (ch != 0) {
                ret.push(String.fromCharCode(ch));
            }
            ++ptr;
        }
        return ret.join("");
    };
    /**
     * Store raw bytes to the ptr.
     * @param ptr The head address.
     * @param bytes The bytes content.
     */
    Memory.prototype.storeRawBytes = function (ptr, bytes) {
        if (this.buffer != this.memory.buffer) {
            this.updateViews();
        }
        this.viewU8.set(bytes, ptr);
    };
    /**
     * Update memory view after the memory growth.
     */
    Memory.prototype.updateViews = function () {
        this.buffer = this.memory.buffer;
        this.viewU8 = new Uint8Array(this.buffer);
        this.viewU16 = new Uint16Array(this.buffer);
        this.viewI32 = new Int32Array(this.buffer);
        this.viewU32 = new Uint32Array(this.buffer);
        this.viewF32 = new Float32Array(this.buffer);
        this.viewF64 = new Float64Array(this.buffer);
    };
    return Memory;
}());
/**
 * Auxiliary call stack for the FFI calls.
 *
 * Lifecyle of a call stack.
 * - Calls into allocXX to allocate space, mixed with storeXXX to store data.
 * - Calls into ptrFromOffset, no further allocation(as ptrFromOffset can change),
 *   can still call into storeXX
 * - Calls into commitToWasmMemory once.
 * - reset.
 */
var CachedCallStack = /** @class */ (function () {
    function CachedCallStack(memory, allocSpace, freeSpace) {
        /** List of temporay arguments that can be disposed during reset. */
        this.tempArgs = [];
        this.stackTop = 0;
        this.basePtr = 0;
        this.addressToSetTargetValue = [];
        var initCallStackSize = 128;
        this.memory = memory;
        this.cAllocSpace = allocSpace;
        this.cFreeSpace = freeSpace;
        this.buffer = new ArrayBuffer(initCallStackSize);
        this.basePtr = this.cAllocSpace(initCallStackSize);
        this.viewU8 = new Uint8Array(this.buffer);
        this.viewI32 = new Int32Array(this.buffer);
        this.viewU32 = new Uint32Array(this.buffer);
        this.viewF64 = new Float64Array(this.buffer);
        this.updateViews();
    }
    CachedCallStack.prototype.dispose = function () {
        if (this.basePtr != 0) {
            this.cFreeSpace(this.basePtr);
            this.basePtr = 0;
        }
    };
    /**
     * Rest the call stack so that it can be reused again.
     */
    CachedCallStack.prototype.reset = function () {
        this.stackTop = 0;
        assert(this.addressToSetTargetValue.length == 0);
        while (this.tempArgs.length != 0) {
            this.tempArgs.pop().dispose();
        }
    };
    /**
     * Commit all the cached data to WasmMemory.
     * This function can only be called once.
     * No further store function should be called.
     *
     * @param nbytes Number of bytes to be stored.
     */
    CachedCallStack.prototype.commitToWasmMemory = function (nbytes) {
        if (nbytes === void 0) { nbytes = this.stackTop; }
        // commit all pointer values.
        while (this.addressToSetTargetValue.length != 0) {
            var _a = this.addressToSetTargetValue.pop(), targetOffset = _a[0], valueOffset = _a[1];
            this.storePtr(targetOffset, this.ptrFromOffset(valueOffset));
        }
        this.memory.storeRawBytes(this.basePtr, this.viewU8.slice(0, nbytes));
    };
    /**
     * Allocate space by number of bytes
     * @param nbytes Number of bytes.
     * @note This function always allocate space that aligns to 64bit.
     */
    CachedCallStack.prototype.allocRawBytes = function (nbytes) {
        // always aligns to 64bit
        nbytes = ((nbytes + 7) >> 3) << 3;
        if (this.stackTop + nbytes > this.buffer.byteLength) {
            var newSize = Math.max(this.buffer.byteLength * 2, this.stackTop + nbytes);
            var oldU8 = this.viewU8;
            this.buffer = new ArrayBuffer(newSize);
            this.updateViews();
            this.viewU8.set(oldU8);
            if (this.basePtr != 0) {
                this.cFreeSpace(this.basePtr);
            }
            this.basePtr = this.cAllocSpace(newSize);
        }
        var retOffset = this.stackTop;
        this.stackTop += nbytes;
        return retOffset;
    };
    /**
     * Allocate space for pointers.
     * @param count Number of pointers.
     * @returns The allocated pointer array.
     */
    CachedCallStack.prototype.allocPtrArray = function (count) {
        return this.allocRawBytes(this.memory.sizeofPtr() * count);
    };
    /**
     * Get the real pointer from offset values.
     * Note that the returned value becomes obsolete if alloc is called on the stack.
     * @param offset The allocated offset.
     */
    CachedCallStack.prototype.ptrFromOffset = function (offset) {
        return this.basePtr + offset;
    };
    // Store APIs
    CachedCallStack.prototype.storePtr = function (offset, value) {
        if (this.memory.wasm32) {
            this.storeU32(offset, value);
        }
        else {
            this.storeI64(offset, value);
        }
    };
    CachedCallStack.prototype.storeUSize = function (offset, value) {
        if (this.memory.wasm32) {
            this.storeU32(offset, value);
        }
        else {
            this.storeI64(offset, value);
        }
    };
    CachedCallStack.prototype.storeI32 = function (offset, value) {
        this.viewI32[offset >> 2] = value;
    };
    CachedCallStack.prototype.storeU32 = function (offset, value) {
        this.viewU32[offset >> 2] = value;
    };
    CachedCallStack.prototype.storeI64 = function (offset, value) {
        // For now, just store as 32bit
        // NOTE: wasm always uses little endian.
        var low = value & 0xffffffff;
        var base = offset >> 2;
        this.viewI32[base] = low;
        this.viewI32[base + 1] = 0;
    };
    CachedCallStack.prototype.storeF64 = function (offset, value) {
        this.viewF64[offset >> 3] = value;
    };
    CachedCallStack.prototype.storeRawBytes = function (offset, bytes) {
        this.viewU8.set(bytes, offset);
    };
    /**
     * Allocate then set C-String pointer to the offset.
     * This function will call into allocBytes to allocate necessary data.
     * The address won't be set immediately(because the possible change of basePtr)
     * and will be filled when we commit the data.
     *
     * @param offset The offset to set ot data pointer.
     * @param data The string content.
     */
    CachedCallStack.prototype.allocThenSetArgString = function (offset, data) {
        var strOffset = this.allocRawBytes(data.length + 1);
        this.storeRawBytes(strOffset, StringToUint8Array(data));
        this.addressToSetTargetValue.push([offset, strOffset]);
    };
    /**
     * Allocate then set the argument location with a TVMByteArray.
     * Allocate new temporary space for bytes.
     *
     * @param offset The offset to set ot data pointer.
     * @param data The string content.
     */
    CachedCallStack.prototype.allocThenSetArgBytes = function (offset, data) {
        // Note: size of size_t equals sizeof ptr.
        var headerOffset = this.allocRawBytes(this.memory.sizeofPtr() * 2);
        var dataOffset = this.allocRawBytes(data.length);
        this.storeRawBytes(dataOffset, data);
        this.storeUSize(headerOffset + this.memory.sizeofPtr(), data.length);
        this.addressToSetTargetValue.push([offset, headerOffset]);
        this.addressToSetTargetValue.push([headerOffset, dataOffset]);
    };
    /**
     * Update internal cache views.
     */
    CachedCallStack.prototype.updateViews = function () {
        this.viewU8 = new Uint8Array(this.buffer);
        this.viewI32 = new Int32Array(this.buffer);
        this.viewU32 = new Uint32Array(this.buffer);
        this.viewF64 = new Float64Array(this.buffer);
    };
    return CachedCallStack;
}());

/**
 * DetectGPU device in the environment.
 */
function detectGPUDevice() {
    return __awaiter(this, void 0, void 0, function () {
        var adapter, computeMB, requiedMaxBufferSize, requiredMaxStorageBufferBindingSize, requiredMaxComputeWorkgroupStorageSize, adapterInfo, device;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof navigator !== "undefined" && navigator.gpu !== undefined)) return [3 /*break*/, 4];
                    return [4 /*yield*/, navigator.gpu.requestAdapter({ "powerPreference": "high-performance" })];
                case 1:
                    adapter = _a.sent();
                    if (adapter == null) {
                        throw Error("Cannot find adapter that matches the request");
                    }
                    computeMB = function (value) {
                        return Math.ceil(value / (1 << 20)) + "MB";
                    };
                    requiedMaxBufferSize = 1 << 30;
                    if (requiedMaxBufferSize > adapter.limits.maxBufferSize) {
                        throw Error("Cannot initialize runtime because of requested maxBufferSize " +
                            "exceeds limit. requested=".concat(computeMB(requiedMaxBufferSize), ", ") +
                            "limit=".concat(computeMB(adapter.limits.maxBufferSize), ". ") +
                            "This error may be caused by an older version of the browser (e.g. Chrome 112). " +
                            "You can try to upgrade your browser to Chrome 113 or later.");
                    }
                    requiredMaxStorageBufferBindingSize = 1 << 30;
                    if (requiredMaxStorageBufferBindingSize > adapter.limits.maxStorageBufferBindingSize) {
                        throw Error("Cannot initialize runtime because of requested maxStorageBufferBindingSize " +
                            "exceeds limit. requested=".concat(computeMB(requiredMaxStorageBufferBindingSize), ", ") +
                            "limit=".concat(computeMB(adapter.limits.maxStorageBufferBindingSize), ". "));
                    }
                    requiredMaxComputeWorkgroupStorageSize = 32 << 10;
                    if (requiredMaxComputeWorkgroupStorageSize > adapter.limits.maxComputeWorkgroupStorageSize) {
                        throw Error("Cannot initialize runtime because of requested maxComputeWorkgroupStorageSize " +
                            "exceeds limit. requested=".concat(requiredMaxComputeWorkgroupStorageSize, ", ") +
                            "limit=".concat(adapter.limits.maxComputeWorkgroupStorageSize, ". "));
                    }
                    return [4 /*yield*/, adapter.requestAdapterInfo()];
                case 2:
                    adapterInfo = _a.sent();
                    return [4 /*yield*/, adapter.requestDevice({
                            requiredLimits: {
                                maxBufferSize: requiedMaxBufferSize,
                                maxStorageBufferBindingSize: requiredMaxStorageBufferBindingSize,
                                maxComputeWorkgroupStorageSize: requiredMaxComputeWorkgroupStorageSize,
                            }
                        })];
                case 3:
                    device = _a.sent();
                    return [2 /*return*/, {
                            adapter: adapter,
                            adapterInfo: adapterInfo,
                            device: device
                        }];
                case 4: return [2 /*return*/, undefined];
            }
        });
    });
}
var canvasRenderWGSL = "\n@group(0) @binding(0) var my_sampler : sampler;\n@group(0) @binding(1) var my_texture : texture_2d<f32>;\n\nstruct VertexOutput {\n  @builtin(position) position : vec4<f32>,\n  @location(0) uv : vec2<f32>,\n}\n\n@vertex\nfn vertex_main(@builtin(vertex_index) vidx : u32) -> VertexOutput {\n  const pos = array(\n    vec2( 1.0,  1.0),\n    vec2( 1.0, -1.0),\n    vec2(-1.0, -1.0),\n    vec2( 1.0,  1.0),\n    vec2(-1.0, -1.0),\n    vec2(-1.0,  1.0),\n  );\n\n  const uv = array(\n    vec2(1.0, 0.0),\n    vec2(1.0, 1.0),\n    vec2(0.0, 1.0),\n    vec2(1.0, 0.0),\n    vec2(0.0, 1.0),\n    vec2(0.0, 0.0),\n  );\n\n  var output : VertexOutput;\n  output.position = vec4(pos[vidx], 0.0, 1.0);\n  output.uv = uv[vidx];\n  return output;\n}\n\n@fragment\nfn fragment_main(@location(0) uv : vec2<f32>) -> @location(0) vec4<f32> {\n  return textureSample(my_texture, my_sampler, uv);\n}\n\n@fragment\nfn fragment_clear(@location(0) uv : vec2<f32>) -> @location(0) vec4<f32> {\n  return vec4(1.0, 1.0, 1.0, 1.0);\n}\n";
var CanvaRenderManager = /** @class */ (function () {
    function CanvaRenderManager(device, canvas) {
        this.device = device;
        var ctx = canvas.getContext("webgpu");
        if (ctx == null) {
            throw Error("Cannot bind WebGPU context");
        }
        // @ts-ignore
        this.canvasContext = ctx;
        this.canvasTextureFormat = navigator.gpu.getPreferredCanvasFormat();
        this.canvasContext.configure({
            device: this.device,
            format: this.canvasTextureFormat,
            alphaMode: "opaque",
        });
        this.renderPipeline = device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: device.createShaderModule({
                    code: canvasRenderWGSL,
                }),
                entryPoint: "vertex_main",
            },
            fragment: {
                module: device.createShaderModule({
                    code: canvasRenderWGSL,
                }),
                entryPoint: "fragment_main",
                targets: [{
                        format: this.canvasTextureFormat,
                    }],
            },
            primitive: {
                topology: "triangle-list",
            },
        });
        this.clearPipeline = device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: device.createShaderModule({
                    code: canvasRenderWGSL,
                }),
                entryPoint: "vertex_main",
            },
            fragment: {
                module: device.createShaderModule({
                    code: canvasRenderWGSL,
                }),
                entryPoint: "fragment_clear",
                targets: [{
                        format: this.canvasTextureFormat,
                    }],
            },
            primitive: {
                topology: "triangle-list",
            },
        });
        this.renderSampler = device.createSampler({
            magFilter: "linear",
            minFilter: "linear",
        });
        // staging texture always be in RGBA
        this.stagingTexture = device.createTexture({
            size: [canvas.height, canvas.width, 1],
            format: "rgba8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST |
                GPUTextureUsage.RENDER_ATTACHMENT,
        });
    }
    CanvaRenderManager.prototype.clear = function () {
        var commandEncoder = this.device.createCommandEncoder();
        var passEncoder = commandEncoder.beginRenderPass({
            //@ts-ignore
            colorAttachments: [
                {
                    view: this.canvasContext.getCurrentTexture().createView(),
                    clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    loadOp: "clear",
                    storeOp: "store",
                },
            ],
        });
        passEncoder.setPipeline(this.clearPipeline);
        var renderBindingGroup = this.device.createBindGroup({
            layout: this.renderPipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: this.renderSampler },
                { binding: 1, resource: this.stagingTexture.createView() },
            ],
        });
        passEncoder.setBindGroup(0, renderBindingGroup);
        passEncoder.draw(6, 1, 0, 0);
        passEncoder.end();
        this.device.queue.submit([commandEncoder.finish()]);
    };
    CanvaRenderManager.prototype.draw = function (buffer, height, width) {
        // resize the staging texture
        if (height != this.stagingTexture.height || width != this.stagingTexture.width) {
            this.stagingTexture.destroy();
            this.stagingTexture = this.device.createTexture({
                size: [height, width, 1],
                format: "rgba8unorm",
                usage: GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.COPY_DST |
                    GPUTextureUsage.RENDER_ATTACHMENT,
            });
        }
        var commandEncoder = this.device.createCommandEncoder();
        commandEncoder.copyBufferToTexture({
            buffer: buffer,
            offset: 0,
            bytesPerRow: this.stagingTexture.width * 4
        }, {
            texture: this.stagingTexture
        }, {
            width: this.stagingTexture.width,
            height: this.stagingTexture.height
        });
        var passEncoder = commandEncoder.beginRenderPass({
            //@ts-ignore
            colorAttachments: [
                {
                    view: this.canvasContext.getCurrentTexture().createView(),
                    clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    loadOp: "clear",
                    storeOp: "store",
                },
            ],
        });
        passEncoder.setPipeline(this.renderPipeline);
        var renderBindingGroup = this.device.createBindGroup({
            layout: this.renderPipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: this.renderSampler },
                { binding: 1, resource: this.stagingTexture.createView() },
            ],
        });
        passEncoder.setBindGroup(0, renderBindingGroup);
        passEncoder.draw(6, 1, 0, 0);
        passEncoder.end();
        this.device.queue.submit([commandEncoder.finish()]);
    };
    CanvaRenderManager.prototype.dispose = function () {
        this.stagingTexture.destroy();
    };
    return CanvaRenderManager;
}());
/**
 * WebGPU context
 * Manages all the webgpu resources here.
 */
var WebGPUContext = /** @class */ (function () {
    function WebGPUContext(memory, device) {
        // internal data
        this.bufferTable = [undefined];
        this.bufferTableFreeId = [];
        this.podArgStagingBuffers = [];
        this.canvasRenderManager = undefined;
        // number of pod arg staging buffers
        this.maxNumPodArgsStagingBuffers = 2;
        // flags for debugging
        // stats of the runtime.
        // peak allocation
        this.peakAllocatedBytes = 0;
        // current allocation
        this.currAllocatedBytes = 0;
        // all allocation(ignoring free)
        this.allAllocatedBytes = 0;
        // shader submit counter
        this.shaderSubmitCounter = 0;
        // limite number of shaders to be submitted, useful for debugging, default to -1
        this.debugShaderSubmitLimit = -1;
        // log and sync each step
        this.debugLogFinish = false;
        this.memory = memory;
        this.device = device;
    }
    /**
     * Dispose context.
     */
    WebGPUContext.prototype.dispose = function () {
        var _a, _b, _c;
        (_a = this.canvasRenderManager) === null || _a === void 0 ? void 0 : _a.dispose();
        this.bufferTableFreeId = [];
        while (this.bufferTable.length != 0) {
            (_b = this.bufferTable.pop()) === null || _b === void 0 ? void 0 : _b.destroy();
        }
        while (this.podArgStagingBuffers.length != 0) {
            (_c = this.podArgStagingBuffers.pop()) === null || _c === void 0 ? void 0 : _c.destroy();
        }
        this.device.destroy();
    };
    /**
     * Wait for all pending GPU tasks to complete
     */
    WebGPUContext.prototype.sync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.device.queue.onSubmittedWorkDone()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtain the runtime information in readable format.
     */
    WebGPUContext.prototype.runtimeStatsText = function () {
        var info = "peak-memory=" + Math.ceil(this.peakAllocatedBytes / (1 << 20)) + " MB";
        info += ", all-memory=" + Math.ceil(this.allAllocatedBytes / (1 << 20)) + " MB";
        info += ", shader-submissions=" + this.shaderSubmitCounter;
        return info;
    };
    /**
     * Draw image from data in storage buffer.
     * @param ptr The GPU ptr
     * @param height The height of the image.
     * @param width The width of the image.
     */
    WebGPUContext.prototype.drawImageFromBuffer = function (ptr, height, width) {
        if (this.canvasRenderManager == undefined) {
            throw Error("Do not have a canvas context, call bindCanvas first");
        }
        this.canvasRenderManager.draw(this.gpuBufferFromPtr(ptr), height, width);
    };
    /**
     * Copy raw bytes into buffer ptr.
     *
     * @param rawBytes The raw bytes
     * @param toPtr The target gpu buffer ptr
     * @param toOffset The beginning offset
     * @param nbytes Number of bytes
     */
    WebGPUContext.prototype.copyRawBytesToBuffer = function (rawBytes, toPtr, toOffset, nbytes) {
        // Perhaps it would be more useful to use a staging buffer?
        this.device.queue.writeBuffer(this.gpuBufferFromPtr(toPtr), toOffset, rawBytes, 0, nbytes);
    };
    /**
     * Clear canvas
     */
    WebGPUContext.prototype.clearCanvas = function () {
        var _a;
        (_a = this.canvasRenderManager) === null || _a === void 0 ? void 0 : _a.clear();
    };
    /**
     * Bind a canvas element to the runtime.
     * @param canvas The HTML canvas/
     */
    WebGPUContext.prototype.bindCanvas = function (canvas) {
        this.canvasRenderManager = new CanvaRenderManager(this.device, canvas);
    };
    /**
     * Create a PackedFunc that runs the given shader
     * via createComputePipeline
     *
     * @param info The function information already parsed as a record.
     * @param code The shader data(in WGSL)
     * @returns The shader
     */
    WebGPUContext.prototype.createShader = function (finfo, code) {
        return this.createShadeInternal(finfo, code, false);
    };
    /**
     * Create a PackedFunc that runs the given shader asynchrously
     * via createComputePipelineAsync
     *
     * @param info The function information already parsed as a record.
     * @param code The shader data(in WGSL)
     * @returns The shader
     */
    WebGPUContext.prototype.createShaderAsync = function (finfo, code) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createShadeInternal(finfo, code, true)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get the pod arg staging buffer
     * \param nbytes The minimum size.
     * \return The allocated buffer
     */
    WebGPUContext.prototype.getPodArgsBuffer = function (nbytes) {
        var buffer = undefined;
        if (this.podArgStagingBuffers.length >= this.maxNumPodArgsStagingBuffers) {
            buffer = this.podArgStagingBuffers.shift();
        }
        // minimum of 16 bytes
        var allocSize = 16;
        if (buffer !== undefined) {
            allocSize = buffer.size;
            if (buffer.size < nbytes) {
                buffer.destroy();
                buffer = undefined;
            }
        }
        while (allocSize < nbytes) {
            allocSize *= 2;
        }
        if (buffer == undefined) {
            // create uniform buffer
            buffer = this.device.createBuffer({
                size: allocSize,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
        }
        assert(nbytes <= buffer.size);
        return buffer;
    };
    /**
     * Internal impl of createShader for both async and sync mode.
     *
     * @param info The function information already parsed as a record.
     * @param code The shader data(in WGSL)
     * @param asyncMode Whether use async mode.
     * @returns The shader function or promise of shader func.
     */
    WebGPUContext.prototype.createShadeInternal = function (finfo, code, asyncMode) {
        var _this = this;
        var dispatchToDim = [];
        var paramWriteAccess = [];
        for (var i = 0; i < finfo.launch_param_tags.length; ++i) {
            var tag = finfo.launch_param_tags[i];
            if (tag.startsWith("blockIdx.")) {
                var target = tag.charCodeAt(tag.length - 1) - ("x".charCodeAt(0));
                assert(target >= 0 && target < 3);
                dispatchToDim.push(target);
            }
            else if (tag.startsWith("threadIdx.")) {
                var target = tag.charCodeAt(tag.length - 1) - ("x".charCodeAt(0));
                assert(target >= 0 && target < 3);
                dispatchToDim.push(target + 3);
            }
            else if (tag.startsWith("paramWriteAccess:")) {
                paramWriteAccess = JSON.parse(tag.substring(17));
            }
            else {
                throw new Error("Cannot handle thread_axis " + tag);
            }
        }
        var layoutEntries = [];
        var bufferArgIndices = [];
        var podArgIndices = [];
        for (var i = 0; i < finfo.arg_types.length; ++i) {
            var dtype = finfo.arg_types[i];
            if (dtype == "handle") {
                layoutEntries.push({
                    binding: bufferArgIndices.length,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: paramWriteAccess[bufferArgIndices.length] ? "storage" : "read-only-storage"
                    }
                });
                bufferArgIndices.push(i);
            }
            else if (dtype.startsWith("int") || dtype.startsWith("uint") || dtype.startsWith("float")) {
                podArgIndices.push(i);
            }
            else {
                throw new Error("Cannot handle argument type " + dtype + " in WebGPU shader");
            }
        }
        assert(paramWriteAccess.length == bufferArgIndices.length);
        // POD arguments are pass in the end
        layoutEntries.push({
            binding: bufferArgIndices.length,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
                type: "uniform"
            }
        });
        var bindGroupLayout = this.device.createBindGroupLayout({
            entries: layoutEntries
        });
        var pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });
        // Function to create the pipeline.
        var createShaderFunc = function (pipeline) {
            var submitShader = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (_this.debugShaderSubmitLimit != -1 &&
                    _this.shaderSubmitCounter >= _this.debugShaderSubmitLimit) {
                    _this.shaderSubmitCounter += 1;
                    return;
                }
                var commandEncoder = _this.device.createCommandEncoder();
                var compute = commandEncoder.beginComputePass();
                compute.setPipeline(pipeline);
                var bindGroupEntries = [];
                var numBufferOrPodArgs = bufferArgIndices.length + podArgIndices.length;
                assert(args.length == numBufferOrPodArgs + dispatchToDim.length);
                var workDim = [1, 1, 1, 1, 1, 1];
                for (var i = 0; i < dispatchToDim.length; ++i) {
                    workDim[dispatchToDim[i]] = args[numBufferOrPodArgs + i];
                }
                // get around 65535 restriction of blockIdx.x
                if (workDim[2] != 1) {
                    throw Error("WebGPU: blockIdx.z is reserved for internal use");
                }
                var packDimX = workDim[0];
                // spread thinsg out into blockIdx.z
                if (workDim[0] >= (1 << 16)) {
                    var wl_x = workDim[0];
                    var wl_z = workDim[2];
                    while (wl_x >= (1 << 16)) {
                        if (wl_x % 2 == 0) {
                            wl_x = wl_x / 2;
                        }
                        else {
                            // pad up
                            wl_x = (wl_x + 1) / 2;
                        }
                        wl_z *= 2;
                    }
                    workDim[0] = wl_x;
                    workDim[2] = wl_z;
                    assert(wl_x * wl_z >= packDimX);
                }
                for (var i = 0; i < bufferArgIndices.length; ++i) {
                    bindGroupEntries.push({
                        binding: i,
                        resource: {
                            buffer: _this.gpuBufferFromPtr(args[bufferArgIndices[i]])
                        }
                    });
                }
                // push pod buffer
                var sizeOfI32 = 4;
                var podArgBuffer = _this.getPodArgsBuffer((podArgIndices.length + 1) * sizeOfI32);
                var i32View = new Int32Array(podArgIndices.length + 1);
                var u32View = new Uint32Array(i32View.buffer);
                var f32View = new Float32Array(i32View.buffer);
                for (var i = 0; i < podArgIndices.length; ++i) {
                    var value = args[podArgIndices[i]];
                    var dtype = finfo.arg_types[podArgIndices[i]];
                    if (dtype.startsWith("int")) {
                        i32View[i] = value;
                    }
                    else if (dtype.startsWith("uint")) {
                        u32View[i] = value;
                    }
                    else if (dtype.startsWith("float")) {
                        f32View[i] = value;
                    }
                    else {
                        throw Error("Unknown pod dtype " + dtype);
                    }
                }
                // always pass in dim z launching grid size in
                u32View[podArgIndices.length] = packDimX;
                _this.device.queue.writeBuffer(podArgBuffer, 0, i32View.buffer);
                bindGroupEntries.push({
                    binding: bufferArgIndices.length,
                    resource: {
                        buffer: podArgBuffer,
                        size: i32View.buffer.byteLength
                    }
                });
                compute.setBindGroup(0, _this.device.createBindGroup({
                    layout: bindGroupLayout,
                    entries: bindGroupEntries
                }));
                compute.dispatchWorkgroups(workDim[0], workDim[1], workDim[2]);
                compute.end();
                var command = commandEncoder.finish();
                _this.device.queue.submit([command]);
                if (_this.debugLogFinish) {
                    var currCounter_1 = _this.shaderSubmitCounter;
                    _this.device.queue.onSubmittedWorkDone().then(function () {
                        console.log("[" + currCounter_1 + "][Debug] finish shader" + finfo.name);
                    });
                }
                _this.shaderSubmitCounter += 1;
            };
            return submitShader;
        };
        var shaderModule = this.device.createShaderModule({
            code: code,
            hints: {
                main: {
                    layout: pipelineLayout
                }
            }
        });
        if (asyncMode) {
            return this.device.createComputePipelineAsync({
                layout: pipelineLayout,
                compute: {
                    module: shaderModule,
                    entryPoint: finfo.name
                }
            }).then(function (pipeline) {
                return createShaderFunc(pipeline);
            });
        }
        else {
            var pipeline = this.device.createComputePipeline({
                layout: pipelineLayout,
                compute: {
                    module: shaderModule,
                    entryPoint: finfo.name
                }
            });
            return createShaderFunc(pipeline);
        }
    };
    /**
     * Get the device API according to its name
     * @param The name of the API.
     * @returns The corresponding device api.
     */
    WebGPUContext.prototype.getDeviceAPI = function (name) {
        var _this = this;
        if (name == "deviceAllocDataSpace") {
            return function (nbytes) {
                return _this.deviceAllocDataSpace(nbytes);
            };
        }
        else if (name == "deviceFreeDataSpace") {
            return function (ptr) {
                return _this.deviceFreeDataSpace(ptr);
            };
        }
        else if (name == "deviceCopyToGPU") {
            return function (from, to, toOffset, nbytes) {
                _this.deviceCopyToGPU(from, to, toOffset, nbytes);
            };
        }
        else if (name == "deviceCopyFromGPU") {
            return function (from, fromOffset, to, nbytes) {
                _this.deviceCopyFromGPU(from, fromOffset, to, nbytes);
            };
        }
        else if (name == "deviceCopyWithinGPU") {
            return function (from, fromOffset, to, toOffset, nbytes) {
                _this.deviceCopyWithinGPU(from, fromOffset, to, toOffset, nbytes);
            };
        }
        else {
            throw new Error("Unknown DeviceAPI function " + name);
        }
    };
    // DeviceAPI
    WebGPUContext.prototype.deviceAllocDataSpace = function (nbytes) {
        // allocate 0 bytes buffer as 1 bytes buffer.
        if (nbytes == 0) {
            nbytes = 1;
        }
        var buffer = this.device.createBuffer({
            size: nbytes,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        });
        this.currAllocatedBytes += nbytes;
        this.allAllocatedBytes += nbytes;
        if (this.currAllocatedBytes > this.peakAllocatedBytes) {
            this.peakAllocatedBytes = this.currAllocatedBytes;
        }
        var ptr = this.attachToBufferTable(buffer);
        return ptr;
    };
    WebGPUContext.prototype.deviceFreeDataSpace = function (ptr) {
        var idx = ptr;
        var buffer = this.bufferTable[idx];
        this.bufferTable[idx] = undefined;
        assert(buffer !== undefined);
        this.bufferTableFreeId.push(idx);
        this.currAllocatedBytes -= buffer.size;
        buffer.destroy();
    };
    WebGPUContext.prototype.deviceCopyToGPU = function (from, to, toOffset, nbytes) {
        // Perhaps it would be more useful to use a staging buffer?
        var rawBytes = this.memory.loadRawBytes(from, nbytes);
        this.device.queue.writeBuffer(this.gpuBufferFromPtr(to), toOffset, rawBytes, 0, nbytes);
    };
    WebGPUContext.prototype.deviceCopyFromGPU = function (from, fromOffset, to, nbytes) {
        var _this = this;
        // Perhaps it would be more useful to resuse a staging buffer?
        var gpuTemp = this.device.createBuffer({
            size: nbytes,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
        });
        var copyEncoder = this.device.createCommandEncoder();
        copyEncoder.copyBufferToBuffer(this.gpuBufferFromPtr(from), fromOffset, gpuTemp, 0, nbytes);
        var copyCommands = copyEncoder.finish();
        this.device.queue.submit([copyCommands]);
        gpuTemp.mapAsync(GPUMapMode.READ).then(function () {
            var data = gpuTemp.getMappedRange();
            _this.memory.storeRawBytes(to, new Uint8Array(data));
            gpuTemp.destroy();
        });
    };
    WebGPUContext.prototype.deviceCopyWithinGPU = function (from, fromOffset, to, toOffset, nbytes) {
        var copyEncoder = this.device.createCommandEncoder();
        copyEncoder.copyBufferToBuffer(this.gpuBufferFromPtr(from), fromOffset, this.gpuBufferFromPtr(to), toOffset, nbytes);
        var copyCommands = copyEncoder.finish();
        this.device.queue.submit([copyCommands]);
    };
    WebGPUContext.prototype.gpuBufferFromPtr = function (ptr) {
        var buffer = this.bufferTable[ptr];
        assert(buffer !== undefined);
        return buffer;
    };
    WebGPUContext.prototype.attachToBufferTable = function (buffer) {
        if (this.bufferTableFreeId.length != 0) {
            var idx = this.bufferTableFreeId.pop();
            this.bufferTable[idx] = buffer;
            return idx;
        }
        else {
            var idx = this.bufferTable.length;
            this.bufferTable.push(buffer);
            return idx;
        }
    };
    return WebGPUContext;
}());

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/**
 * @internal
 * FFI Library wrapper, maintains most runtime states.
 */
var FFILibrary = /** @class */ (function () {
    function FFILibrary(wasmInstance, imports) {
        this.recycledCallStacks = [];
        this.wasmInstance = wasmInstance;
        this.memory = new Memory(this.detectWasmMemory(this.wasmInstance, imports));
        assert(this.wasmInstance.exports !== undefined, "Expect the library module contains exports");
        this.exports = this.wasmInstance.exports;
        this.wasm32 = this.memory.wasm32;
        this.validateInstance();
    }
    FFILibrary.prototype.dispose = function () {
        var _a;
        while (this.recycledCallStacks.length != 0) {
            this.recycledCallStacks.pop().dispose();
        }
        (_a = this.webGPUContext) === null || _a === void 0 ? void 0 : _a.dispose();
    };
    FFILibrary.prototype.sizeofPtr = function () {
        return this.memory.sizeofPtr();
    };
    FFILibrary.prototype.checkCall = function (code) {
        if (code != 0) {
            var msgPtr = this.exports
                .TVMGetLastError();
            throw new Error("TVMError: " + this.memory.loadCString(msgPtr));
        }
    };
    FFILibrary.prototype.getOrAllocCallStack = function () {
        if (this.recycledCallStacks.length != 0) {
            return this.recycledCallStacks.pop();
        }
        return new CachedCallStack(this.memory, this.exports.TVMWasmAllocSpace, this.exports.TVMWasmFreeSpace);
    };
    FFILibrary.prototype.recycleCallStack = function (callstack) {
        callstack.reset();
        this.recycledCallStacks.push(callstack);
    };
    FFILibrary.prototype.validateInstance = function () {
        this.checkExports(["TVMWasmAllocSpace", "TVMWasmFreeSpace", "TVMFuncFree"]);
    };
    FFILibrary.prototype.checkExports = function (funcNames) {
        var missList = [];
        for (var _i = 0, funcNames_1 = funcNames; _i < funcNames_1.length; _i++) {
            var name_1 = funcNames_1[_i];
            var f = this.exports[name_1];
            if (!(f instanceof Function)) {
                missList.push(name_1);
            }
        }
        if (missList.length != 0) {
            throw new Error("Cannot find " + missList + " in exports");
        }
    };
    FFILibrary.prototype.detectWasmMemory = function (instance, imports) {
        if (instance.exports.memory instanceof WebAssembly.Memory) {
            return instance.exports.memory;
        }
        if (imports.env && imports.env.memory instanceof WebAssembly.Memory) {
            return imports.env.memory;
        }
        throw new Error("Cannt detect wasm memory from imports " +
            imports +
            " or exports" +
            instance.exports);
    };
    return FFILibrary;
}());
/**
 * @internal
 * Manages extra runtime context for the runtime.
 */
var RuntimeContext = /** @class */ (function () {
    function RuntimeContext(getGlobalFunc) {
        this.autoDisposeScope = [];
        this.arrayGetItem = getGlobalFunc("runtime.ArrayGetItem");
        this.arrayGetSize = getGlobalFunc("runtime.ArraySize");
        this.arrayMake = getGlobalFunc("runtime.Array");
        this.getSysLib = getGlobalFunc("runtime.SystemLib");
        this.arrayCacheGet = getGlobalFunc("vm.builtin.ndarray_cache.get");
        this.arrayCacheRemove = getGlobalFunc("vm.builtin.ndarray_cache.remove");
        this.arrayCacheUpdate = getGlobalFunc("vm.builtin.ndarray_cache.update");
        this.arrayCacheClear = getGlobalFunc("vm.builtin.ndarray_cache.clear");
        this.arrayDecodeStorage = getGlobalFunc("tvmjs.array.decode_storage");
        this.paramModuleFromCache = getGlobalFunc("vm.builtin.param_module_from_cache");
        this.makeShapeTuple = getGlobalFunc("runtime.ShapeTuple");
        this.ndarrayCreateView = getGlobalFunc("runtime.TVMArrayCreateView");
        this.sampleTopPFromLogits = getGlobalFunc("vm.builtin.sample_top_p_from_logits");
    }
    RuntimeContext.prototype.dispose = function () {
        // call array cache clear to clear all cached items
        this.arrayCacheClear.dispose();
        this.arrayGetItem.dispose();
        this.arrayGetSize.dispose();
        this.arrayMake.dispose();
        this.arrayCacheGet.dispose();
        this.arrayCacheRemove.dispose();
        this.arrayCacheUpdate.dispose();
        this.arrayCacheClear.dispose();
        this.arrayDecodeStorage.dispose();
        this.paramModuleFromCache.dispose();
        this.makeShapeTuple.dispose();
        this.ndarrayCreateView.dispose();
        this.sampleTopPFromLogits.dispose();
    };
    RuntimeContext.prototype.beginScope = function () {
        this.autoDisposeScope.push([]);
    };
    RuntimeContext.prototype.endScope = function () {
        if (this.autoDisposeScope.length == 0) {
            throw Error("tvm.endScope called when the stack is empty.");
        }
        // automatically dispose all the tracked values in the current scope.
        var currScope = this.autoDisposeScope.pop();
        for (var i = 0; i < currScope.length; ++i) {
            var val = currScope[i];
            if (val !== undefined) {
                val.dispose();
            }
        }
    };
    /**
     * Track object for dispose in current scope.
     *
     * @param obj The object to be tracked.
     * @returns the same object.
     * @note This function only needs to be called for raw system C API values.
     *       The return value of PackedFunc will be automatically tracked.
     */
    RuntimeContext.prototype.attachToCurrentScope = function (obj) {
        if (this.autoDisposeScope.length == 0) {
            throw Error("Must call beginScope to use functions that returns TVM objects");
        }
        var currScope = this.autoDisposeScope[this.autoDisposeScope.length - 1];
        currScope.push(obj);
        return obj;
    };
    RuntimeContext.prototype.moveToParentScope = function (obj) {
        this.detachFromCurrentScope(obj);
        if (this.autoDisposeScope.length < 2) {
            throw Error("moveToParentScope: Parent scope do not exist");
        }
        var parentScope = this.autoDisposeScope[this.autoDisposeScope.length - 2];
        parentScope.push(obj);
        return obj;
    };
    RuntimeContext.prototype.detachFromCurrentScope = function (obj) {
        var currScope = this.autoDisposeScope[this.autoDisposeScope.length - 1];
        var occurance = 0;
        for (var i = 0; i < currScope.length; ++i) {
            if (currScope[i] === obj) {
                occurance += 1;
                currScope[i] = undefined;
            }
        }
        if (occurance == 0) {
            throw Error("Cannot find obj in the current auto conversion pool");
        }
        if (occurance > 1) {
            throw Error("Value attached to scope multiple times");
        }
        return obj;
    };
    return RuntimeContext;
}());
/**
 * A typed scalar constant used to represent a typed number
 * argument to PackedFunc calls.
 */
var Scalar = /** @class */ (function () {
    function Scalar(value, dtype) {
        this.value = value;
        this.dtype = dtype;
    }
    return Scalar;
}());
/**
 * Cell holds the PackedFunc object.
 */
var PackedFuncCell = /** @class */ (function () {
    function PackedFuncCell(handle, lib) {
        this.handle = handle;
        this.lib = lib;
    }
    PackedFuncCell.prototype.dispose = function () {
        if (this.handle != 0) {
            this.lib.checkCall(this.lib.exports.TVMFuncFree(this.handle));
            this.handle = 0;
        }
    };
    PackedFuncCell.prototype.getHandle = function (requireNotNull) {
        if (requireNotNull === void 0) { requireNotNull = true; }
        if (requireNotNull && this.handle == 0) {
            throw Error("PackedFunc has already been disposed");
        }
        return this.handle;
    };
    return PackedFuncCell;
}());
var DeviceEnumToStr = {
    1: "cpu",
    2: "cuda",
    4: "opencl",
    8: "metal",
    15: "webgpu"
};
var DeviceStrToEnum = {
    cpu: 1,
    cuda: 2,
    cl: 4,
    opencl: 4,
    vulkan: 7,
    metal: 8,
    webgpu: 15
};
/**
 * Represent a runtime context where a NDArray can reside.
 */
var DLDevice = /** @class */ (function () {
    function DLDevice(deviceType, deviceId, lib) {
        var tp = typeof deviceType;
        if (tp == "string") {
            this.deviceType = DeviceStrToEnum[deviceType];
            if (this.deviceType == undefined) {
                throw new Error("Cannot recogonize deviceType " + deviceType);
            }
        }
        else if (tp == "number") {
            this.deviceType = deviceType;
        }
        else {
            throw new Error("Cannot take type " + tp + " as deviceType");
        }
        this.deviceId = deviceId;
        this.lib = lib;
    }
    /**
     * Synchronize the device
     */
    DLDevice.prototype.sync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.deviceType == DeviceStrToEnum.webgpu)) return [3 /*break*/, 2];
                        assert(this.lib.webGPUContext !== undefined);
                        return [4 /*yield*/, this.lib.webGPUContext.sync()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    DLDevice.prototype.toString = function () {
        return (DeviceEnumToStr[this.deviceType] + "(" + this.deviceId.toString() + ")");
    };
    return DLDevice;
}());
/**
 * The data type code in DLDataType
 */
var DLDataTypeCode;
(function (DLDataTypeCode) {
    DLDataTypeCode[DLDataTypeCode["Int"] = 0] = "Int";
    DLDataTypeCode[DLDataTypeCode["UInt"] = 1] = "UInt";
    DLDataTypeCode[DLDataTypeCode["Float"] = 2] = "Float";
    DLDataTypeCode[DLDataTypeCode["OpaqueHandle"] = 3] = "OpaqueHandle";
})(DLDataTypeCode || (DLDataTypeCode = {}));
var DLDataTypeCodeToStr = {
    0: "int",
    1: "uint",
    2: "float",
    3: "handle",
};
/**
 * Runtime data type of NDArray.
 */
var DLDataType = /** @class */ (function () {
    function DLDataType(code, bits, lanes) {
        this.code = code;
        this.bits = bits;
        this.lanes = lanes;
    }
    DLDataType.prototype.toString = function () {
        var ret = DLDataTypeCodeToStr[this.code] + this.bits.toString();
        if (this.lanes != 1) {
            return ret + "x" + this.lanes.toString();
        }
        else {
            return ret;
        }
    };
    DLDataType.prototype.numStorageBytes = function () {
        return (this.bits * this.lanes + 7) >> 3;
    };
    return DLDataType;
}());
/**
 * n-dimnesional array.
 */
var NDArray = /** @class */ (function () {
    function NDArray(handle, isView, lib, ctx) {
        this.handle = handle;
        this.isView = isView;
        this.lib = lib;
        this.ctx = ctx;
        if (this.isView) {
            this.dltensor = handle;
        }
        else {
            this.dltensor = this.getDLTensorFromArrayHandle(this.handle);
        }
        // constant offsets.
        var arrayOffsetData = 0;
        var arrayOffsetContext = arrayOffsetData + this.lib.sizeofPtr();
        var arrayOffsetDevType = arrayOffsetContext;
        var arrayOffsetDevId = arrayOffsetContext + SizeOf.I32;
        var arrayOffsetNdim = arrayOffsetContext + SizeOf.DLDevice;
        var arrayOffsetDtype = arrayOffsetNdim + SizeOf.I32;
        var arrayOffsetDtypeCode = arrayOffsetDtype;
        var arrayOffsetDtypeBits = arrayOffsetDtype + SizeOf.U8;
        var arrayOffsetDtypeLanes = arrayOffsetDtypeBits + SizeOf.U8;
        var arrayOffsetShape = arrayOffsetDtype + SizeOf.DLDataType;
        var arrayOffsetStrides = arrayOffsetShape + this.lib.sizeofPtr();
        var arrayOffsetByteOffset = arrayOffsetStrides + this.lib.sizeofPtr();
        // dataPtr
        this.dataPtr = lib.memory.loadPointer(this.dltensor);
        // ndim
        this.ndim = lib.memory.loadI32(this.dltensor + arrayOffsetNdim);
        // shape
        var cshapePtr = lib.memory.loadPointer(this.dltensor + arrayOffsetShape);
        this.shape = [];
        for (var i = 0; i < this.ndim; ++i) {
            this.shape.push(lib.memory.loadI64(cshapePtr + i * SizeOf.I64));
        }
        // dtype
        var code = lib.memory.loadU8(this.dltensor + arrayOffsetDtypeCode);
        var bits = lib.memory.loadU8(this.dltensor + arrayOffsetDtypeBits);
        var lanes = lib.memory.loadU16(this.dltensor + arrayOffsetDtypeLanes);
        this.dlDataType = new DLDataType(code, bits, lanes);
        this.dtype = this.dlDataType.toString();
        // device
        var deviceType = lib.memory.loadI32(this.dltensor + arrayOffsetDevType);
        var deviceId = lib.memory.loadI32(this.dltensor + arrayOffsetDevId);
        this.device = new DLDevice(deviceType, deviceId, lib);
        // byte_offset
        this.byteOffset = lib.memory.loadI64(this.dltensor + arrayOffsetByteOffset);
    }
    /**
     * Create a view of the array.
     * @param shape The shape of the view.
     * @returns The new sliced ndarray.
     */
    NDArray.prototype.view = function (shape) {
        var _a;
        var shapeArray = shape.map(function (value) { return new Scalar(value, "int"); });
        return this.ctx.ndarrayCreateView(this, (_a = this.ctx).makeShapeTuple.apply(_a, shapeArray));
    };
    /**
     * Get handle of ndarray, check it is not null.
     *
     * @param requireNotNull require handle is not null.
     * @returns The handle.
     */
    NDArray.prototype.getHandle = function (requireNotNull) {
        if (requireNotNull === void 0) { requireNotNull = true; }
        if (requireNotNull && this.handle == 0) {
            throw Error("NDArray has already been disposed");
        }
        return this.handle;
    };
    /**
     * Get dataPtr of NDarray
     *
     * @returns The handle.
     */
    NDArray.prototype.getDataPtr = function () {
        if (this.handle == 0) {
            throw Error("NDArray has already been disposed");
        }
        return this.dataPtr;
    };
    NDArray.prototype.dispose = function () {
        if (this.handle != 0 && !this.isView) {
            this.lib.checkCall(this.lib.exports.TVMArrayFree(this.handle));
            this.handle = 0;
        }
    };
    /**
     * Copy data from another NDArray or javascript array.
     * The number of elements must match.
     *
     * @param data The source data array.
     * @returns this
     */
    NDArray.prototype.copyFrom = function (data) {
        if (data instanceof NDArray) {
            this.lib.checkCall(this.lib.exports.TVMArrayCopyFromTo(data.getHandle(), this.getHandle(), 0));
            return this;
        }
        else {
            var size = this.shape.reduce(function (a, b) {
                return a * b;
            }, 1);
            if (data.length != size) {
                throw new Error("data size and shape mismatch data.length" +
                    data.length +
                    " vs " +
                    size);
            }
            var buffer = void 0;
            if (this.dtype == "float32") {
                buffer = Float32Array.from(data).buffer;
            }
            else if (this.dtype == "float64") {
                buffer = Float64Array.from(data).buffer;
            }
            else if (this.dtype == "int32") {
                buffer = Int32Array.from(data).buffer;
            }
            else if (this.dtype == "int8") {
                buffer = Int8Array.from(data).buffer;
            }
            else if (this.dtype == "uint8") {
                buffer = Uint8Array.from(data).buffer;
            }
            else {
                throw new Error("Unsupported data type " + this.dtype);
            }
            return this.copyFromRawBytes(new Uint8Array(buffer));
        }
    };
    /**
     * Copy data from raw bytes.
     * @param data Uint8Array of bytes.
     * @returns this
     */
    NDArray.prototype.copyFromRawBytes = function (data) {
        var _a;
        // short cut for gpu copy
        if (this.device.deviceType == DeviceStrToEnum.webgpu) {
            (_a = this.lib.webGPUContext) === null || _a === void 0 ? void 0 : _a.copyRawBytesToBuffer(data, this.getDataPtr(), 0, data.length);
            return this;
        }
        // CPU copy
        var size = this.shape.reduce(function (a, b) {
            return a * b;
        }, 1);
        var nbytes = this.dlDataType.numStorageBytes() * size;
        if (nbytes != data.length) {
            throw new Error("Expect the data's length equals nbytes=" + nbytes);
        }
        var stack = this.lib.getOrAllocCallStack();
        var tempOffset = stack.allocRawBytes(nbytes);
        var tempPtr = stack.ptrFromOffset(tempOffset);
        this.lib.memory.storeRawBytes(tempPtr, data);
        this.lib.checkCall(this.lib.exports.TVMArrayCopyFromBytes(this.getHandle(), tempPtr, nbytes));
        this.lib.recycleCallStack(stack);
        return this;
    };
    /**
     * Return a copied Uint8Array of the raw bytes in the NDArray.
     * @returns The result array.
     */
    NDArray.prototype.toRawBytes = function () {
        if (this.device.deviceType != DeviceStrToEnum.cpu) {
            throw new Error("Can only sync copy CPU array, use cpu_arr.copyfrom(gpu_arr) then sync instead.");
        }
        var size = this.shape.reduce(function (a, b) {
            return a * b;
        }, 1);
        var nbytes = this.dlDataType.numStorageBytes() * size;
        var stack = this.lib.getOrAllocCallStack();
        var tempOffset = stack.allocRawBytes(nbytes);
        var tempPtr = stack.ptrFromOffset(tempOffset);
        this.lib.checkCall(this.lib.exports.TVMArrayCopyToBytes(this.getHandle(), tempPtr, nbytes));
        var ret = this.lib.memory.loadRawBytes(tempPtr, nbytes);
        this.lib.recycleCallStack(stack);
        return ret;
    };
    /**
     * Return a TypedArray copy of the NDArray, the specific type depends on
     * the dtype of the NDArray.
     * @returns The result array.
     */
    NDArray.prototype.toArray = function () {
        var stype = this.dtype;
        if (stype == "float32") {
            return new Float32Array(this.toRawBytes().buffer);
        }
        else if (stype == "float64") {
            return new Float64Array(this.toRawBytes().buffer);
        }
        else if (stype == "int32") {
            return new Int32Array(this.toRawBytes().buffer);
        }
        else if (stype == "int8") {
            return new Int8Array(this.toRawBytes().buffer);
        }
        else if (stype == "uint8") {
            return new Uint8Array(this.toRawBytes().buffer);
        }
        else {
            throw new Error("Unsupported data type " + this.dtype);
        }
    };
    NDArray.prototype.getDLTensorFromArrayHandle = function (handle) {
        // Note: this depends on the NDArray C ABI.
        // keep this function in case of ABI change.
        return handle;
    };
    return NDArray;
}());
/**
 * Runtime Module.
 */
var Module = /** @class */ (function () {
    function Module(handle, lib, makePackedFunc) {
        this.handle = handle;
        this.lib = lib;
        this.makePackedFunc = makePackedFunc;
    }
    Module.prototype.dispose = function () {
        if (this.handle != 0) {
            this.lib.checkCall(this.lib.exports.TVMModFree(this.handle));
            this.handle = 0;
        }
    };
    /**
     * Get handle of module, check it is not null.
     *
     * @param requireNotNull require handle is not null.
     * @returns The handle.
     */
    Module.prototype.getHandle = function (requireNotNull) {
        if (requireNotNull === void 0) { requireNotNull = true; }
        if (requireNotNull && this.handle == 0) {
            throw Error("Module has already been disposed");
        }
        return this.handle;
    };
    /**
     * Get a function in the module.
     * @param name The name of the function.
     * @param queryImports Whether to also query imports
     * @returns The result function.
     */
    Module.prototype.getFunction = function (name, queryImports) {
        if (queryImports === void 0) { queryImports = true; }
        if (this.handle == 0) {
            throw Error("Module has already been disposed");
        }
        var stack = this.lib.getOrAllocCallStack();
        var nameOffset = stack.allocRawBytes(name.length + 1);
        stack.storeRawBytes(nameOffset, StringToUint8Array(name));
        var outOffset = stack.allocPtrArray(1);
        var outPtr = stack.ptrFromOffset(outOffset);
        stack.commitToWasmMemory(outOffset);
        this.lib.checkCall(this.lib.exports.TVMModGetFunction(this.getHandle(), stack.ptrFromOffset(nameOffset), queryImports ? 1 : 0, outPtr));
        var handle = this.lib.memory.loadPointer(outPtr);
        this.lib.recycleCallStack(stack);
        if (handle == 0) {
            throw Error("Cannot find function " + name);
        }
        var ret = this.makePackedFunc(handle);
        return ret;
    };
    /**
     * Import another module into the current runtime module.
     * @param mod The module to be imported.
     */
    Module.prototype.importModule = function (mod) {
        this.lib.checkCall(this.lib.exports.TVMModImport(this.getHandle(), mod.getHandle()));
    };
    return Module;
}());
/**
 * Generic object base
 */
var TVMObject = /** @class */ (function () {
    function TVMObject(handle, lib, ctx) {
        this.handle = handle;
        this.lib = lib;
        this.ctx = ctx;
    }
    TVMObject.prototype.dispose = function () {
        if (this.handle != 0) {
            this.lib.checkCall(this.lib.exports.TVMObjectFree(this.handle));
            this.handle = 0;
        }
    };
    /**
     * Get handle of module, check it is not null.
     *
     * @param requireNotNull require handle is not null.
     * @returns The handle.
     */
    TVMObject.prototype.getHandle = function (requireNotNull) {
        if (requireNotNull === void 0) { requireNotNull = true; }
        if (requireNotNull && this.handle == 0) {
            throw Error("Module has already been disposed");
        }
        return this.handle;
    };
    /** get the type index of the object */
    TVMObject.prototype.typeIndex = function () {
        if (this.handle == 0) {
            throw Error("The current Object has already been disposed");
        }
        var stack = this.lib.getOrAllocCallStack();
        var outOffset = stack.allocPtrArray(1);
        var outPtr = stack.ptrFromOffset(outOffset);
        this.lib.checkCall(this.lib.exports.TVMObjectGetTypeIndex(this.getHandle(), outPtr));
        var result = this.lib.memory.loadU32(outPtr);
        this.lib.recycleCallStack(stack);
        return result;
    };
    /** get the type key of the object */
    TVMObject.prototype.typeKey = function () {
        var type_index = this.typeIndex();
        var stack = this.lib.getOrAllocCallStack();
        var outOffset = stack.allocPtrArray(1);
        var outPtr = stack.ptrFromOffset(outOffset);
        this.lib.checkCall(this.lib.exports.TVMObjectTypeIndex2Key(type_index, outPtr));
        var result = this.lib.memory.loadCString(this.lib.memory.loadPointer(outPtr));
        this.lib.recycleCallStack(stack);
        return result;
    };
    return TVMObject;
}());
/** Runtime array object. */
var TVMArray = /** @class */ (function (_super) {
    __extends(TVMArray, _super);
    function TVMArray(handle, lib, ctx) {
        return _super.call(this, handle, lib, ctx) || this;
    }
    /**
     * @returns the size of the array.
     */
    TVMArray.prototype.size = function () {
        return this.ctx.arrayGetSize(this);
    };
    /**
     * Get index-th element of the array
     * @param index the array index.
     * @returns The element.
     */
    TVMArray.prototype.get = function (index) {
        return this.ctx.arrayGetItem(this, new Scalar(index, "int32"));
    };
    return TVMArray;
}(TVMObject));
var VMAllocatorKind;
(function (VMAllocatorKind) {
    VMAllocatorKind[VMAllocatorKind["NAIVE_ALLOCATOR"] = 1] = "NAIVE_ALLOCATOR";
    VMAllocatorKind[VMAllocatorKind["POOLED_ALLOCATOR"] = 2] = "POOLED_ALLOCATOR";
})(VMAllocatorKind || (VMAllocatorKind = {}));
/**
 *  VirtualMachine Executor.
 *
 *  This is a thin wrapper of the underlying TVM module.
 *  you can also directly call set_input, run, and get_output
 *  of underlying module functions
 */
var VirtualMachine = /** @class */ (function () {
    /**
     * Constructor
     * @param mod The underlying module, need to be detached.
     * @param device The main device ro run VM on.
     */
    function VirtualMachine(mod, device) {
        this.mod = mod;
        this.mod.getFunction("vm_initialization")(new Scalar(device.deviceType, "int"), new Scalar(device.deviceId, "int"), new Scalar(VMAllocatorKind.POOLED_ALLOCATOR, "int"), 
        // explicitly specify host device type
        new Scalar(DeviceStrToEnum.cpu, "int"), new Scalar(0, "int"), new Scalar(VMAllocatorKind.POOLED_ALLOCATOR, "int"));
    }
    VirtualMachine.prototype.dispose = function () {
        this.mod.dispose();
    };
    /**
     * Get a function in the VM module.
     * @param name The name of the function.
     * @returns The result function.
     */
    VirtualMachine.prototype.getFunction = function (name) {
        return this.mod.getFunction(name);
    };
    /**
     * Get the internal module.
     */
    VirtualMachine.prototype.getInternalModule = function () {
        return this.mod;
    };
    return VirtualMachine;
}());
/** Code used as the first argument of the async callback. */
var AyncCallbackCode;
(function (AyncCallbackCode) {
    AyncCallbackCode[AyncCallbackCode["kReturn"] = 4] = "kReturn";
    AyncCallbackCode[AyncCallbackCode["kException"] = 5] = "kException";
})(AyncCallbackCode || (AyncCallbackCode = {}));
/**
 * TVM runtime instance.
 *
 * All objects(NDArray, Module, PackedFunc) returned by TVM runtim function call
 * and PackedFunc instance are tracked through a scope mechanism that will get
 * auto-released when we call EndScope.
 *
 * This is necessarily to be able to release the underlying WASM and WebGPU memory that
 * are not tracked through JS native garbage collection mechanism.
 *
 * This does mean that we have to get familar with the following functions:
 * - {@link beginScope}
 * - {@link endScope}
 * - {@link withNewScope}
 * - {@link attachToCurrentScope}
 * - {@link detachFromCurrentScope}
 */
var Instance = /** @class */ (function () {
    /**
     * Constructor
     *
     * importObject can also be a {@link LibraryProvider} object,
     * a WASI object, or an object containing wasmLibraryProvider field.
     *
     * @param wasmModule The input module or instance.
     * @param importObject The imports to initialize the wasmInstance if it is not provided.
     * @param wasmInstance Additional wasm instance argument for deferred construction.
     * @param env Directly specified environment module.
     *
     * @see Please use the async version {@link instantiate} when targeting browsers.
     */
    function Instance(wasmModule, importObject, wasmInstance, env) {
        if (importObject === void 0) { importObject = {}; }
        var _this = this;
        this.cacheMetadata = {};
        this.initProgressCallback = [];
        if (wasmInstance instanceof WebAssembly.Instance) {
            assert(env instanceof Environment, "env must be provided when passing in instance");
        }
        else {
            assert(env === undefined);
            env = new Environment(importObject);
            wasmInstance = new WebAssembly.Instance(wasmModule, env.imports);
        }
        env.start(wasmInstance);
        this.env = env;
        this.lib = new FFILibrary(wasmInstance, env.imports);
        this.memory = this.lib.memory;
        this.exports = this.lib.exports;
        this.objFactory = new Map();
        this.ctx = new RuntimeContext(function (name) {
            var autoAttachToScope = false;
            // runtime context function do not auto-release.
            return _this.getGlobalFuncInternal(name, autoAttachToScope);
        });
        this.registerEnvGlobalPackedFuncs();
        this.registerObjectFactoryFuncs();
    }
    /**
     * Benchmark stable execution of the run function.
     *
     * @params run The run function
     * @params dev The device to sync during each run.
     * @number The number of times to compute the average.
     * @repeat The number of times to repeat the run.
     */
    Instance.prototype.benchmark = function (run, dev, number, repeat) {
        if (number === void 0) { number = 10; }
        if (repeat === void 0) { repeat = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var perf, results, k, tstart, i, tend;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        perf = getPerformance();
                        results = [];
                        // run with new scope
                        this.withNewScope(run);
                        return [4 /*yield*/, dev.sync()];
                    case 1:
                        _a.sent();
                        k = 0;
                        _a.label = 2;
                    case 2:
                        if (!(k < repeat)) return [3 /*break*/, 5];
                        tstart = perf.now();
                        for (i = 0; i < number; ++i) {
                            this.withNewScope(run);
                        }
                        return [4 /*yield*/, dev.sync()];
                    case 3:
                        _a.sent();
                        tend = perf.now();
                        results.push((tend - tstart) / number);
                        _a.label = 4;
                    case 4:
                        ++k;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, results];
                }
            });
        });
    };
    Instance.prototype.dispose = function () {
        // order matters
        // ctx release goes back into lib.
        this.ctx.dispose();
        this.lib.dispose();
    };
    /**
     * Obtain the runtime information in readable format.
     */
    Instance.prototype.runtimeStatsText = function () {
        if (this.lib.webGPUContext !== undefined) {
            return this.lib.webGPUContext.runtimeStatsText();
        }
        else {
            return "";
        }
    };
    /**
     * Begin a new scope for tracking object disposal.
     */
    Instance.prototype.beginScope = function () {
        this.ctx.beginScope();
    };
    /**
     * End a scope and release all created TVM objects
     * under the current scope.
     *
     * Exception: one can call {@link moveToParentScope} to move
     * a value to parent scope.
     */
    Instance.prototype.endScope = function () {
        this.ctx.endScope();
    };
    /**
     * Perform action under a new scope.
     *
     * @param action The action function.
     * @returns The result value.
     *
     * @note For action to return a valid value,
     *       we will need to call {@link moveToParentScope}
     *       for the objects that are created in the scope.
     */
    Instance.prototype.withNewScope = function (action) {
        this.beginScope();
        var val = action();
        this.endScope();
        return val;
    };
    /**
     * Attach a detached obj to the auto-release pool of the current scope.
     *
     * @param obj The input obj.
     * @note Normally user do not need to call this function explicitly, as
     *       all library call return values are explicitly attached to
     *       the current scope. You only need to do so when you call
     *       {@link detachFromCurrentScope} to create a detached object.
     */
    Instance.prototype.attachToCurrentScope = function (obj) {
        return this.ctx.attachToCurrentScope(obj);
    };
    /**
     * Move obj's attachment to the parent scope.
     *
     * This function is useful to make sure objects are still
     * alive when exit the current scope.
     *
     * @param obj The object to be moved.
     * @returns The input obj.
     */
    Instance.prototype.moveToParentScope = function (obj) {
        return this.ctx.moveToParentScope(obj);
    };
    /**
     * Detach the object from the current scope
     * so it won't be released via auto-release during endscope.
     *
     * User needs to either explicitly call obj.dispose(), or
     * {@link attachToCurrentScope} to re-attach to the current scope.
     *
     * This function can be used to return values to the parent scope.
     * @param obj The object.
     */
    Instance.prototype.detachFromCurrentScope = function (obj) {
        return this.ctx.detachFromCurrentScope(obj);
    };
    /**
     * Get system-wide library module in the wasm.
     * System lib is a global module that contains self register functions in startup.
     * @returns The system library module.
     */
    Instance.prototype.systemLib = function () {
        return this.ctx.getSysLib();
    };
    /**
     * List all the global function names registered in the runtime.
     * @returns The name list.
     */
    Instance.prototype.listGlobalFuncNames = function () {
        var stack = this.lib.getOrAllocCallStack();
        var outSizeOffset = stack.allocPtrArray(2);
        var outSizePtr = stack.ptrFromOffset(outSizeOffset);
        var outArrayPtr = stack.ptrFromOffset(outSizeOffset + this.lib.sizeofPtr());
        this.lib.checkCall(this.exports.TVMFuncListGlobalNames(outSizePtr, outArrayPtr));
        var size = this.memory.loadI32(outSizePtr);
        var array = this.memory.loadPointer(outArrayPtr);
        var names = [];
        for (var i = 0; i < size; ++i) {
            names.push(this.memory.loadCString(this.memory.loadPointer(array + this.lib.sizeofPtr() * i)));
        }
        this.lib.recycleCallStack(stack);
        return names;
    };
    /**
     * Register function to be global function in tvm runtime.
     * @param name The name of the function.
     * @param f function to be registered.
     * @param override Whether overwrite function in existing registry.
     */
    Instance.prototype.registerFunc = function (name, func, override) {
        var _this = this;
        if (override === void 0) { override = false; }
        this.withNewScope(function () {
            var autoAttachToScope = true;
            // packed func can be released once it is registered
            var packedFunc = _this.toPackedFuncInternal(func, autoAttachToScope);
            var ioverride = override ? 1 : 0;
            var stack = _this.lib.getOrAllocCallStack();
            var nameOffset = stack.allocRawBytes(name.length + 1);
            stack.storeRawBytes(nameOffset, StringToUint8Array(name));
            stack.commitToWasmMemory();
            _this.lib.checkCall(_this.lib.exports.TVMFuncRegisterGlobal(stack.ptrFromOffset(nameOffset), packedFunc._tvmPackedCell.getHandle(), ioverride));
            _this.lib.recycleCallStack(stack);
        });
    };
    /**
     * Get global PackedFunc from the runtime.
     * @param name The name of the function.
     * @param autoAttachToScope Whether to track it via autoDispose
     * @returns The result function.
     */
    Instance.prototype.getGlobalFunc = function (name) {
        return this.getGlobalFuncInternal(name, true);
    };
    Instance.prototype.getGlobalFuncInternal = function (name, autoAttachToScope) {
        if (autoAttachToScope === void 0) { autoAttachToScope = true; }
        var stack = this.lib.getOrAllocCallStack();
        var nameOffset = stack.allocRawBytes(name.length + 1);
        stack.storeRawBytes(nameOffset, StringToUint8Array(name));
        var outOffset = stack.allocPtrArray(1);
        var outPtr = stack.ptrFromOffset(outOffset);
        stack.commitToWasmMemory(outOffset);
        this.lib.checkCall(this.exports.TVMFuncGetGlobal(stack.ptrFromOffset(nameOffset), outPtr));
        var handle = this.memory.loadPointer(outPtr);
        this.lib.recycleCallStack(stack);
        if (handle == 0) {
            throw Error("Cannot find global function " + name);
        }
        var ret = this.makePackedFunc(handle);
        if (autoAttachToScope)
            this.ctx.attachToCurrentScope(ret);
        return ret;
    };
    /**
     * Check if func is PackedFunc.
     *
     * @param func The input.
     * @returns The check result.
     */
    Instance.prototype.isPackedFunc = function (func) {
        // eslint-disable-next-line no-prototype-builtins
        return typeof func == "function" && func.hasOwnProperty("_tvmPackedCell");
    };
    /**
     * Convert func to PackedFunc
     *
     * @param func Input function.
     * @returns The converted function.
     */
    Instance.prototype.toPackedFunc = function (func) {
        return this.toPackedFuncInternal(func, true);
    };
    Instance.prototype.toPackedFuncInternal = function (func, autoAttachToScope) {
        if (this.isPackedFunc(func))
            return func;
        var ret = this.createPackedFuncFromCFunc(this.wrapJSFuncAsPackedCFunc(func));
        if (autoAttachToScope)
            return this.ctx.attachToCurrentScope(ret);
        return ret;
    };
    /**
    * Setup a virtual machine module with given device.
    *
    * @param dev DLDevice the device.
    * @returns The created virtual machime.
    */
    Instance.prototype.createVirtualMachine = function (dev) {
        var mod = this.ctx.detachFromCurrentScope(this.systemLib().getFunction("vm_load_executable")());
        return this.ctx.attachToCurrentScope(new VirtualMachine(mod, dev));
    };
    //-----------------------------------------------
    // Native NDArray Cache Support
    //-----------------------------------------------
    /**
     * Register a call back for fetch progress.
    *
     * @param cb the fetch progress callback.
     */
    Instance.prototype.registerInitProgressCallback = function (cb) {
        this.initProgressCallback.push(cb);
    };
    /**
     * Get parameters in the form of prefix_i
     *
     * @param prefix The parameter prefix.
     * @param numParams  Number of parameters.
     * @returns
     */
    Instance.prototype.getParamsFromCache = function (prefix, numParams) {
        return this.ctx.paramModuleFromCache(prefix, new Scalar(numParams, "int32")).getFunction("get_params")();
    };
    /**
     * Get NDArray from cache.
     * @param name  The name of array.
     * @returns  The result.
     */
    Instance.prototype.ndarrayCacheGet = function (name) {
        return this.ctx.arrayCacheGet(name);
    };
    /**
     * Get NDArray from cache.
     * @param name  The name of array.
     * @returns  The result.
     */
    Instance.prototype.ndarrayCacheRemove = function (name) {
        return this.ctx.arrayCacheRemove(name);
    };
    /**
     * Update the ndarray cache.
     * @param name The name of the array.
     * @param arr The content.
     */
    Instance.prototype.ndarrayCacheUpdate = function (name, arr, override) {
        if (override === void 0) { override = false; }
        this.ctx.arrayCacheUpdate(name, arr, this.scalar(override ? 1 : 0, "int32"));
    };
    /**
     * Update the ndarray cache.
     * @param name The name of the array.
     * @param arr The content.
     */
    Instance.prototype.ndarrayCacheClear = function () {
        this.ctx.arrayCacheClear();
    };
    /**
     * Fetch NDArray cache from url.
     *
     * @param ndarrayCacheUrl The cache url.
     * @param device The device to be fetched to.
     * @returns The meta data
     */
    Instance.prototype.fetchNDArrayCache = function (ndarrayCacheUrl, device) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonUrl, request, cache, result, list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jsonUrl = new URL("ndarray-cache.json", ndarrayCacheUrl).href;
                        request = new Request(jsonUrl);
                        return [4 /*yield*/, caches.open("tvmjs")];
                    case 1:
                        cache = _a.sent();
                        return [4 /*yield*/, cache.match(request)];
                    case 2:
                        result = _a.sent();
                        if (!(result === undefined)) return [3 /*break*/, 5];
                        return [4 /*yield*/, cache.add(request)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, cache.match(request)];
                    case 4:
                        result = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!(result === undefined)) return [3 /*break*/, 9];
                        this.env.logger("Error: Cannot cache " + jsonUrl + ", reloading will be slow");
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, fetch(request)];
                    case 7:
                        result = _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        _a.sent();
                        this.env.logger("Cannot fetch " + jsonUrl);
                        return [3 /*break*/, 9];
                    case 9:
                        if (!(result instanceof Response)) return [3 /*break*/, 11];
                        return [4 /*yield*/, result.json()];
                    case 10:
                        list = _a.sent();
                        _a.label = 11;
                    case 11: return [4 /*yield*/, this.fetchNDArrayCacheInternal(ndarrayCacheUrl, list["records"], device)];
                    case 12:
                        _a.sent();
                        this.cacheMetadata = __assign(__assign({}, this.cacheMetadata), list["metadata"]);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fetch list of NDArray into the NDArrayCache.
     *
     * @param ndarrayCacheUrl The cache url.
     * @param list The list of array data.
     * @param device The device to store the data to.
     */
    Instance.prototype.fetchNDArrayCacheInternal = function (ndarrayCacheUrl, list, device) {
        return __awaiter(this, void 0, void 0, function () {
            var perf, tstart, totalBytes, i, fetchedBytes, timeElapsed, reportCallback, j, cache, i, dataUrl, request, buffer, result, err_2, shardRecords, _loop_1, this_1, j;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        perf = getPerformance();
                        tstart = perf.now();
                        totalBytes = 0;
                        for (i = 0; i < list.length; ++i) {
                            totalBytes += list[i].nbytes;
                        }
                        fetchedBytes = 0;
                        timeElapsed = 0;
                        reportCallback = function (iter) {
                            // report
                            for (var j = 0; j < _this.initProgressCallback.length; ++j) {
                                _this.initProgressCallback[j]({
                                    type: 'init',
                                    progress: fetchedBytes / totalBytes,
                                    timeElapsed: timeElapsed,
                                    currentChunk: iter,
                                    totalChunks: list.length,
                                    fetchedBytes: fetchedBytes,
                                    totalBytes: totalBytes,
                                });
                            }
                        };
                        for (j = 0; j < this.initProgressCallback.length; ++j) {
                            this.initProgressCallback[j]({
                                type: 'init',
                                progress: fetchedBytes / totalBytes,
                                timeElapsed: 0,
                                currentChunk: 0,
                                totalChunks: list.length,
                                fetchedBytes: fetchedBytes,
                                totalBytes: totalBytes,
                            });
                        }
                        return [4 /*yield*/, caches.open("tvmjs")];
                    case 1:
                        cache = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < list.length)) return [3 /*break*/, 18];
                        reportCallback(i);
                        fetchedBytes += list[i].nbytes;
                        dataUrl = new URL(list[i].dataPath, ndarrayCacheUrl).href;
                        request = new Request(dataUrl);
                        buffer = void 0;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 11, , 12]);
                        return [4 /*yield*/, cache.match(request)];
                    case 4:
                        result = _a.sent();
                        if (!(result === undefined)) return [3 /*break*/, 7];
                        return [4 /*yield*/, cache.add(request)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, cache.match(request)];
                    case 6:
                        result = _a.sent();
                        _a.label = 7;
                    case 7:
                        if (!(result == undefined)) return [3 /*break*/, 9];
                        this.env.logger("Error: Cannot cache " + dataUrl + ", reloading will be slow");
                        return [4 /*yield*/, fetch(request)];
                    case 8:
                        result = _a.sent();
                        _a.label = 9;
                    case 9: return [4 /*yield*/, result.arrayBuffer()];
                    case 10:
                        buffer = _a.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        err_2 = _a.sent();
                        this.env.logger("Error: Cannot fetch " + dataUrl + " err= " + err_2);
                        throw err_2;
                    case 12:
                        shardRecords = list[i].records;
                        _loop_1 = function (j) {
                            var rec, cpu_arr, recSource, gpu_arr;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        rec = shardRecords[j];
                                        cpu_arr = this_1.withNewScope(function () {
                                            return _this.detachFromCurrentScope(_this.empty(rec.shape, rec.dtype, _this.cpu()));
                                        });
                                        recSource = buffer.slice(rec.byteOffset, rec.byteOffset + rec.nbytes);
                                        // first sync copy to cpu.
                                        this_1.ctx.arrayDecodeStorage(cpu_arr, new Uint8Array(recSource), rec.format);
                                        if (!(device.deviceType == DeviceStrToEnum.cpu)) return [3 /*break*/, 1];
                                        this_1.ndarrayCacheUpdate(rec.name, cpu_arr, false);
                                        cpu_arr.dispose();
                                        return [3 /*break*/, 3];
                                    case 1:
                                        gpu_arr = this_1.withNewScope(function () {
                                            return _this.detachFromCurrentScope(_this.empty(rec.shape, rec.dtype, device));
                                        });
                                        gpu_arr.copyFrom(cpu_arr);
                                        return [4 /*yield*/, device.sync()];
                                    case 2:
                                        _b.sent();
                                        this_1.ndarrayCacheUpdate(rec.name, gpu_arr, false);
                                        cpu_arr.dispose();
                                        gpu_arr.dispose();
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        j = 0;
                        _a.label = 13;
                    case 13:
                        if (!(j < shardRecords.length)) return [3 /*break*/, 16];
                        return [5 /*yield**/, _loop_1(j)];
                    case 14:
                        _a.sent();
                        _a.label = 15;
                    case 15:
                        ++j;
                        return [3 /*break*/, 13];
                    case 16:
                        timeElapsed = Math.ceil((perf.now() - tstart) / 1000);
                        _a.label = 17;
                    case 17:
                        ++i;
                        return [3 /*break*/, 2];
                    case 18:
                        reportCallback(list.length);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Convert dtype to {@link DLDataType}
     *
     * @param dtype The input dtype string or DLDataType.
     * @returns The converted result.
     */
    Instance.prototype.toDLDataType = function (dtype) {
        if (dtype instanceof DLDataType)
            return dtype;
        if (typeof dtype == "string") {
            var pattern = dtype;
            var code = void 0, bits = 32, lanes = 1;
            if (pattern.substring(0, 5) == "float") {
                pattern = pattern.substring(5, pattern.length);
                code = DLDataTypeCode.Float;
            }
            else if (pattern.substring(0, 3) == "int") {
                pattern = pattern.substring(3, pattern.length);
                code = DLDataTypeCode.Int;
            }
            else if (pattern.substring(0, 4) == "uint") {
                pattern = pattern.substring(4, pattern.length);
                code = DLDataTypeCode.UInt;
            }
            else if (pattern.substring(0, 6) == "handle") {
                pattern = pattern.substring(5, pattern.length);
                code = DLDataTypeCode.OpaqueHandle;
                bits = 64;
            }
            else {
                throw new Error("Unknown dtype " + dtype);
            }
            var arr = pattern.split("x");
            if (arr.length >= 1) {
                var parsed = parseInt(arr[0]);
                if (parsed + "" == arr[0]) {
                    bits = parsed;
                }
            }
            if (arr.length >= 2) {
                lanes = parseInt(arr[1]);
            }
            return new DLDataType(code, bits, lanes);
        }
        else {
            throw new Error("Unknown dtype " + dtype);
        }
    };
    /**
     * Create a new {@link Scalar} that can be passed to a PackedFunc.
     * @param value The number value.
     * @param dtype The dtype string.
     * @returns The created scalar.
     */
    Instance.prototype.scalar = function (value, dtype) {
        return new Scalar(value, dtype);
    };
    /**
     * Create a new {@link DLDevice}
     * @param deviceType The device type.
     * @param deviceId The device index.
     * @returns The created device.
     */
    Instance.prototype.device = function (deviceType, deviceId) {
        if (deviceId === void 0) { deviceId = 0; }
        return new DLDevice(deviceType, deviceId, this.lib);
    };
    /**
     * Create a new cpu {@link DLDevice}
     * @param deviceId The device index.
     */
    Instance.prototype.cpu = function (deviceId) {
        if (deviceId === void 0) { deviceId = 0; }
        return this.device("cpu", deviceId);
    };
    /**
     * Create a new webgpu {@link DLDevice}
     * @param deviceId The device index.
     */
    Instance.prototype.webgpu = function (deviceId) {
        if (deviceId === void 0) { deviceId = 0; }
        return this.device("webgpu", deviceId);
    };
    /**
     * Create an empty {@link NDArray} with given shape and dtype.
     *
     * @param shape The shape of the array.
     * @param dtype The data type of the array.
     * @param dev The device of the ndarray.
     * @returns The created ndarray.
     */
    Instance.prototype.empty = function (shape, dtype, dev) {
        if (dtype === void 0) { dtype = "float32"; }
        if (dev === void 0) { dev = this.device("cpu", 0); }
        dtype = this.toDLDataType(dtype);
        shape = typeof shape == "number" ? [shape] : shape;
        var stack = this.lib.getOrAllocCallStack();
        var shapeOffset = stack.allocRawBytes(shape.length * SizeOf.I64);
        for (var i = 0; i < shape.length; ++i) {
            stack.storeI64(shapeOffset + i * SizeOf.I64, shape[i]);
        }
        var outOffset = stack.allocPtrArray(1);
        var outPtr = stack.ptrFromOffset(outOffset);
        stack.commitToWasmMemory(outOffset);
        this.lib.checkCall(this.exports.TVMArrayAlloc(stack.ptrFromOffset(shapeOffset), shape.length, dtype.code, dtype.bits, dtype.lanes, dev.deviceType, dev.deviceId, outPtr));
        var ret = this.ctx.attachToCurrentScope(new NDArray(this.memory.loadPointer(outPtr), false, this.lib, this.ctx));
        this.lib.recycleCallStack(stack);
        return ret;
    };
    /**
     * Create am uniform {@link NDArray} with given shape.
     *
     * @param shape The shape of the array.
     * @param low The low value.
     * @param high The high value.
     * @param dev The device of the ndarray.
     * @returns The created ndarray.
     */
    Instance.prototype.uniform = function (shape, low, high, dev) {
        var ret = this.empty(shape, "float32", dev);
        var size = shape.reduce(function (a, b) {
            return a * b;
        }, 1);
        var scale = high - low;
        var input = new Float32Array(size);
        for (var i = 0; i < input.length; ++i) {
            input[i] = low + Math.random() * scale;
        }
        return ret.copyFrom(input);
    };
    /**
     * Sample index via top-p sampling.
     *
     * @param logits The input logits before normalization.
     * @param temperature  The temperature factor, will take argmax if temperature = 0.0
     * @param top_p The top_p
     * @returns The sampled index.
     */
    Instance.prototype.sampleTopPFromLogits = function (logits, temperature, top_p) {
        return this.ctx.sampleTopPFromLogits(logits, temperature, top_p, Math.random());
    };
    /**
     * Bind canvas to the current WebGPU context
     * @param canvas The canvas.
     */
    Instance.prototype.bindCanvas = function (canvas) {
        var _a;
        (_a = this.lib.webGPUContext) === null || _a === void 0 ? void 0 : _a.bindCanvas(canvas);
    };
    /**
     * Show image in canvas.
     *
     * @param dataRGBA Image array in height x width uint32 NDArray RGBA format on GPU.
     */
    Instance.prototype.showImage = function (dataRGBA) {
        var _a;
        if (dataRGBA.shape.length != 2) {
            throw Error("Require a height x width uint32 NDArray in RGBA" +
                "get shape=" + dataRGBA.shape.toString() + " instead.");
        }
        if (dataRGBA.device.deviceType != DeviceStrToEnum.webgpu) {
            throw new Error("Can only run showImage on WebGPU array, " +
                "get " + DeviceEnumToStr[dataRGBA.device.deviceType] + " instead.");
        }
        if (dataRGBA.dtype != "uint32") {
            throw Error("Require a height x width uint32 NDArray in RGBA, " +
                "get " + dataRGBA.dtype + " instead.");
        }
        (_a = this.lib.webGPUContext) === null || _a === void 0 ? void 0 : _a.drawImageFromBuffer(dataRGBA.getDataPtr(), dataRGBA.shape[0], dataRGBA.shape[1]);
    };
    /**
     * Clear canvas
     */
    Instance.prototype.clearCanvas = function () {
        var _a;
        (_a = this.lib.webGPUContext) === null || _a === void 0 ? void 0 : _a.clearCanvas();
    };
    /**
     * Create an tuple {@link TVMArray} input array.
     *
     * The input array can be passed to tvm runtime function
     * and needs to b explicitly disposed.
     *
     * @param inputs The input array
     * @returns The result array.
     */
    Instance.prototype.makeTVMArray = function (inputs) {
        var _a;
        return (_a = this.ctx).arrayMake.apply(_a, inputs);
    };
    /**
     * Create a shape tuple to pass to runtime.
     * @param shape The shape .
     * @returns The created shape tuple.
     */
    Instance.prototype.makeShapeTuple = function (shape) {
        var _a;
        var shapeArray = shape.map(function (value) { return new Scalar(value, "int"); });
        return (_a = this.ctx).makeShapeTuple.apply(_a, shapeArray);
    };
    /**
     * Get type index from type key.
     * @param typeKey The type key.
     * @returns The corresponding type index.
     */
    Instance.prototype.typeKey2Index = function (typeKey) {
        var stack = this.lib.getOrAllocCallStack();
        var typeKeyOffset = stack.allocRawBytes(typeKey.length + 1);
        stack.storeRawBytes(typeKeyOffset, StringToUint8Array(typeKey));
        var outOffset = stack.allocPtrArray(1);
        var outPtr = stack.ptrFromOffset(outOffset);
        stack.commitToWasmMemory(outOffset);
        this.lib.checkCall(this.lib.exports.TVMObjectTypeKey2Index(stack.ptrFromOffset(typeKeyOffset), outPtr));
        var typeIndex = this.memory.loadU32(outPtr);
        this.lib.recycleCallStack(stack);
        return typeIndex;
    };
    /**
     * Register an object constructor.
     * @param typeKey The name of the function.
     * @param func function to be registered.
     * @param override Whether overwrite function in existing registry.
     */
    Instance.prototype.registerObjectConstructor = function (typeKey, func, override) {
        if (override === void 0) { override = false; }
        var typeIndex = this.typeKey2Index(typeKey);
        if (this.objFactory.has(typeIndex)) {
            if (!override) {
                throw new Error("Type " + typeKey + " already registered");
            }
        }
        this.objFactory.set(typeIndex, func);
    };
    /**
     * Register an asyncfunction to be global function in the server.
     * @param name The name of the function.
     * @param func function to be registered.
     * @param override Whether overwrite function in existing registry.
     *
     * @note The async function will only be used for serving remote calls in the rpc.
     */
    Instance.prototype.registerAsyncServerFunc = function (name, func, override) {
        var _this = this;
        if (override === void 0) { override = false; }
        var asyncVariant = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var fargs = args.slice(0, args.length - 1);
            // need to keep it alive until callback is fulfilled.
            var callback = _this.detachFromCurrentScope(args[args.length - 1]);
            var promise = func.apply(void 0, fargs);
            promise.then(function (rv) {
                callback(_this.scalar(AyncCallbackCode.kReturn, "int32"), rv);
                callback.dispose();
            });
        };
        this.registerFunc("__async." + name, asyncVariant, override);
    };
    /**
     * Asynchrously load webgpu pipelines when possible.
     * @param mod The input module.
     */
    Instance.prototype.asyncLoadWebGPUPiplines = function (mod) {
        return __awaiter(this, void 0, void 0, function () {
            var webgpuContext, fmap_str, fmap, fGetShader, fUpdatePrebuild, perf, tstart, tlastReport, finishCounter, fmapEntries, allEvents, _loop_2, _i, fmapEntries_1, _a, key, finfo;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.lib.webGPUContext == undefined)
                            throw Error("WebGPU not initialied");
                        webgpuContext = this.lib.webGPUContext;
                        this.beginScope();
                        fmap_str = mod.getFunction("webgpu.get_fmap", true)();
                        fmap = JSON.parse(fmap_str);
                        fmap.length;
                        fGetShader = this.detachFromCurrentScope(mod.getFunction("webgpu.get_shader"));
                        fUpdatePrebuild = this.detachFromCurrentScope(mod.getFunction("webgpu.update_prebuild"));
                        this.endScope();
                        perf = getPerformance();
                        tstart = perf.now();
                        tlastReport = tstart;
                        finishCounter = 0;
                        fmapEntries = Object.entries(fmap);
                        allEvents = Promise.resolve();
                        _loop_2 = function (key, finfo) {
                            var code = fGetShader(key);
                            assert(key == finfo.name);
                            var event_1 = webgpuContext.createShaderAsync(finfo, code).then(function (func) {
                                _this.beginScope();
                                fUpdatePrebuild(key, func);
                                _this.endScope();
                            }).then(function () {
                                finishCounter += 1;
                                var tend = perf.now();
                                // skip report if gap is smaller than 1000
                                if ((tend - tlastReport) < 1000 && finishCounter != fmapEntries.length) {
                                    return;
                                }
                                tlastReport = tend;
                                var timeElapsed = Math.ceil((perf.now() - tstart) / 1000);
                                // report
                                for (var j = 0; j < _this.initProgressCallback.length; ++j) {
                                    var progress = finishCounter / fmapEntries.length;
                                    var text = "Loading GPU shader modules[" + finishCounter + "/" + fmapEntries.length + "]: ";
                                    text += Math.floor(progress * 100).toString() + "% completed, ";
                                    text += timeElapsed + " secs elapsed.";
                                    // this.initProgressCallback[j]({
                                    //   progress: progress,
                                    //   timeElapsed: timeElapsed,
                                    //   text: text
                                    // });
                                }
                            });
                            allEvents = Promise.all([allEvents, event_1]).then(function () { });
                        };
                        for (_i = 0, fmapEntries_1 = fmapEntries; _i < fmapEntries_1.length; _i++) {
                            _a = fmapEntries_1[_i], key = _a[0], finfo = _a[1];
                            _loop_2(key, finfo);
                        }
                        return [4 /*yield*/, allEvents];
                    case 1:
                        _b.sent();
                        assert(finishCounter == fmapEntries.length);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Initialize webgpu in the runtime.
     * @param device The given GPU device.
     */
    Instance.prototype.initWebGPU = function (device) {
        var _this = this;
        var webGPUContext = new WebGPUContext(this.memory, device);
        this.registerFunc("wasm.WebGPUDeviceAPI", function (name) {
            return webGPUContext.getDeviceAPI(name);
        });
        this.registerFunc("wasm.WebGPUCreateShader", function (info, code) {
            var finfo = JSON.parse(info);
            return webGPUContext.createShader(finfo, code);
        });
        this.registerAsyncServerFunc("wasm.WebGPUWaitForTasks", function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, webGPUContext.sync()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.lib.webGPUContext = webGPUContext;
    };
    /** Register all object factory */
    Instance.prototype.registerObjectFactoryFuncs = function () {
        this.registerObjectConstructor("Array", function (handle, lib, ctx) {
            return new TVMArray(handle, lib, ctx);
        });
    };
    /** Register global packed functions needed by the backend to the env. */
    Instance.prototype.registerEnvGlobalPackedFuncs = function () {
        var _this = this;
        // Register the timer function to enable the time_evaluator.
        var perf = getPerformance();
        // Helper function to time the finvoke
        var timeExecution = function (finvoke, dev, nstep, repeat, minRepeatMs, limitZeroTimeIterations, cooldownIntervalMs, repeatsToCooldown) { return __awaiter(_this, void 0, void 0, function () {
            var result, setupNumber, i, durationMs, absoluteZeroTimes, golden_ratio, tstart, tend, speed, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // detach and explicit dispose when tasks is fullfilled
                        // the promise will immediately return and we need to makesure
                        // finvoke do not get recycled.
                        this.ctx.detachFromCurrentScope(finvoke);
                        finvoke(this.scalar(1, "int32"));
                        return [4 /*yield*/, dev.sync()];
                    case 1:
                        _a.sent();
                        result = [];
                        setupNumber = nstep;
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < repeat)) return [3 /*break*/, 9];
                        durationMs = 0.0;
                        absoluteZeroTimes = 0;
                        _a.label = 3;
                    case 3:
                        if (durationMs > 0.0) {
                            golden_ratio = 1.618;
                            setupNumber = Math.floor(Math.max(minRepeatMs / (durationMs / setupNumber) + 1, setupNumber * golden_ratio));
                        }
                        tstart = perf.now();
                        finvoke(this.scalar(setupNumber, "int32"));
                        return [4 /*yield*/, dev.sync()];
                    case 4:
                        _a.sent();
                        tend = perf.now();
                        durationMs = tend - tstart;
                        if (durationMs == 0) {
                            absoluteZeroTimes++;
                        }
                        _a.label = 5;
                    case 5:
                        if (durationMs < minRepeatMs && absoluteZeroTimes < limitZeroTimeIterations) return [3 /*break*/, 3];
                        _a.label = 6;
                    case 6:
                        speed = durationMs / setupNumber / 1000;
                        result.push(speed);
                        if (!(cooldownIntervalMs > 0.0 && (i % repeatsToCooldown) == 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, cooldownIntervalMs); })];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        ++i;
                        return [3 /*break*/, 2];
                    case 9:
                        ret = new Float64Array(result.length);
                        ret.set(result);
                        // dispose finvoke
                        finvoke.dispose();
                        return [2 /*return*/, new Uint8Array(ret.buffer)];
                }
            });
        }); };
        var addOne = function (x) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, x + 1];
                }
            });
        }); };
        this.registerAsyncServerFunc("wasm.TimeExecution", timeExecution);
        this.registerAsyncServerFunc("testing.asyncAddOne", addOne);
    };
    Instance.prototype.createPackedFuncFromCFunc = function (func) {
        var findex = this.env.packedCFuncTable.length;
        if (this.env.packedCFuncTableFreeId.length != 0) {
            findex = this.env.packedCFuncTableFreeId.pop();
        }
        else {
            this.env.packedCFuncTable.push(undefined);
        }
        this.env.packedCFuncTable[findex] = func;
        var stack = this.lib.getOrAllocCallStack();
        var outOffset = stack.allocPtrArray(1);
        var outPtr = stack.ptrFromOffset(outOffset);
        this.lib.checkCall(this.exports
            .TVMWasmFuncCreateFromCFunc(findex, outPtr));
        var ret = this.makePackedFunc(this.memory.loadPointer(outPtr));
        this.lib.recycleCallStack(stack);
        return ret;
    };
    /**
     * Set packed function arguments into the location indicated by argsValue and argsCode.
     * Allocate new temporary space from the stack if necessary.
     *
     * @parma stack The call stack
     * @param args  The input arguments.
     * @param argsValue The offset of argsValue.
     * @param argsCode The offset of argsCode.
     */
    Instance.prototype.setPackedArguments = function (stack, args, argsValue, argsCode) {
        for (var i = 0; i < args.length; ++i) {
            var val = args[i];
            var tp = typeof val;
            var valueOffset = argsValue + i * SizeOf.TVMValue;
            var codeOffset = argsCode + i * SizeOf.I32;
            if (val instanceof NDArray) {
                if (!val.isView) {
                    stack.storePtr(valueOffset, val.getHandle());
                    stack.storeI32(codeOffset, ArgTypeCode.TVMNDArrayHandle);
                }
                else {
                    stack.storePtr(valueOffset, val.getHandle());
                    stack.storeI32(codeOffset, ArgTypeCode.TVMDLTensorHandle);
                }
            }
            else if (val instanceof Scalar) {
                if (val.dtype.startsWith("int") || val.dtype.startsWith("uint")) {
                    stack.storeI64(valueOffset, val.value);
                    stack.storeI32(codeOffset, ArgTypeCode.Int);
                }
                else if (val.dtype.startsWith("float")) {
                    stack.storeF64(valueOffset, val.value);
                    stack.storeI32(codeOffset, ArgTypeCode.Float);
                }
                else {
                    assert(val.dtype == "handle", "Expect handle");
                    stack.storePtr(valueOffset, val.value);
                    stack.storeI32(codeOffset, ArgTypeCode.TVMOpaqueHandle);
                }
            }
            else if (val instanceof DLDevice) {
                stack.storeI32(valueOffset, val.deviceType);
                stack.storeI32(valueOffset + SizeOf.I32, val.deviceType);
                stack.storeI32(codeOffset, ArgTypeCode.DLDevice);
            }
            else if (tp == "number") {
                stack.storeF64(valueOffset, val);
                stack.storeI32(codeOffset, ArgTypeCode.Float);
                // eslint-disable-next-line no-prototype-builtins
            }
            else if (tp == "function" && val.hasOwnProperty("_tvmPackedCell")) {
                stack.storePtr(valueOffset, val._tvmPackedCell.getHandle());
                stack.storeI32(codeOffset, ArgTypeCode.TVMPackedFuncHandle);
            }
            else if (val === null || val == undefined) {
                stack.storePtr(valueOffset, 0);
                stack.storeI32(codeOffset, ArgTypeCode.Null);
            }
            else if (tp == "string") {
                stack.allocThenSetArgString(valueOffset, val);
                stack.storeI32(codeOffset, ArgTypeCode.TVMStr);
            }
            else if (val instanceof Uint8Array) {
                stack.allocThenSetArgBytes(valueOffset, val);
                stack.storeI32(codeOffset, ArgTypeCode.TVMBytes);
            }
            else if (val instanceof Function) {
                val = this.toPackedFuncInternal(val, false);
                stack.tempArgs.push(val);
                stack.storePtr(valueOffset, val._tvmPackedCell.getHandle());
                stack.storeI32(codeOffset, ArgTypeCode.TVMPackedFuncHandle);
            }
            else if (val instanceof Module) {
                stack.storePtr(valueOffset, val.getHandle());
                stack.storeI32(codeOffset, ArgTypeCode.TVMModuleHandle);
            }
            else if (val instanceof TVMObject) {
                stack.storePtr(valueOffset, val.getHandle());
                stack.storeI32(codeOffset, ArgTypeCode.TVMObjectHandle);
            }
            else {
                throw new Error("Unsupported argument type " + tp);
            }
        }
    };
    Instance.prototype.wrapJSFuncAsPackedCFunc = function (func) {
        var _this = this;
        var lib = this.lib;
        return function (argValues, argCodes, nargs, ret, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _handle) {
            var jsArgs = [];
            // use scope to track js values.
            _this.ctx.beginScope();
            for (var i = 0; i < nargs; ++i) {
                var valuePtr = argValues + i * SizeOf.TVMValue;
                var codePtr = argCodes + i * SizeOf.I32;
                var tcode = lib.memory.loadI32(codePtr);
                if (tcode == ArgTypeCode.TVMObjectHandle ||
                    tcode == ArgTypeCode.TVMObjectRValueRefArg ||
                    tcode == ArgTypeCode.TVMPackedFuncHandle ||
                    tcode == ArgTypeCode.TVMNDArrayHandle ||
                    tcode == ArgTypeCode.TVMModuleHandle) {
                    lib.checkCall(lib.exports.TVMCbArgToReturn(valuePtr, codePtr));
                }
                tcode = lib.memory.loadI32(codePtr);
                jsArgs.push(_this.retValueToJS(valuePtr, tcode, true));
            }
            var rv = func.apply(void 0, jsArgs);
            // recycle all js object value in function unless we want to retain them.
            _this.ctx.endScope();
            if (rv !== undefined && rv !== null) {
                var stack = lib.getOrAllocCallStack();
                var valueOffset = stack.allocRawBytes(SizeOf.TVMValue);
                var codeOffset = stack.allocRawBytes(SizeOf.I32);
                _this.setPackedArguments(stack, [rv], valueOffset, codeOffset);
                var valuePtr = stack.ptrFromOffset(valueOffset);
                var codePtr = stack.ptrFromOffset(codeOffset);
                stack.commitToWasmMemory();
                lib.checkCall(lib.exports.TVMCFuncSetReturn(ret, valuePtr, codePtr, 1));
                lib.recycleCallStack(stack);
            }
            return 0;
        };
    };
    Instance.prototype.makePackedFunc = function (handle) {
        var _this = this;
        var cell = new PackedFuncCell(handle, this.lib);
        var packedFunc = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var stack = _this.lib.getOrAllocCallStack();
            var valueOffset = stack.allocRawBytes(SizeOf.TVMValue * args.length);
            var tcodeOffset = stack.allocRawBytes(SizeOf.I32 * args.length);
            _this.setPackedArguments(stack, args, valueOffset, tcodeOffset);
            var rvalueOffset = stack.allocRawBytes(SizeOf.TVMValue);
            var rcodeOffset = stack.allocRawBytes(SizeOf.I32);
            var rvaluePtr = stack.ptrFromOffset(rvalueOffset);
            var rcodePtr = stack.ptrFromOffset(rcodeOffset);
            // commit to wasm memory, till rvalueOffset (the return value don't need to be committed)
            stack.commitToWasmMemory(rvalueOffset);
            _this.lib.checkCall(_this.exports.TVMFuncCall(cell.getHandle(), stack.ptrFromOffset(valueOffset), stack.ptrFromOffset(tcodeOffset), args.length, rvaluePtr, rcodePtr));
            var ret = _this.retValueToJS(rvaluePtr, _this.memory.loadI32(rcodePtr), false);
            _this.lib.recycleCallStack(stack);
            return ret;
        };
        // Attach attributes to the function type.
        // This is because javascript do not allow us to overload call.
        var ret = packedFunc;
        ret.dispose = function () {
            cell.dispose();
        };
        ret._tvmPackedCell = cell;
        return ret;
    };
    /**
     * Creaye return value of the packed func. The value us auto-tracked for dispose.
     * @param rvaluePtr The location of rvalue
     * @param tcode     The type code.
     * @param callbackArg Whether it is being used in callbackArg.
     * @returns The JS value.
     */
    Instance.prototype.retValueToJS = function (rvaluePtr, tcode, callbackArg) {
        var _this = this;
        switch (tcode) {
            case ArgTypeCode.Int:
            case ArgTypeCode.UInt:
                return this.memory.loadI64(rvaluePtr);
            case ArgTypeCode.Float:
                return this.memory.loadF64(rvaluePtr);
            case ArgTypeCode.TVMOpaqueHandle: {
                return this.memory.loadPointer(rvaluePtr);
            }
            case ArgTypeCode.TVMNDArrayHandle: {
                return this.ctx.attachToCurrentScope(new NDArray(this.memory.loadPointer(rvaluePtr), false, this.lib, this.ctx));
            }
            case ArgTypeCode.TVMDLTensorHandle: {
                assert(callbackArg);
                // no need to attach as we are only looking at view
                return new NDArray(this.memory.loadPointer(rvaluePtr), true, this.lib, this.ctx);
            }
            case ArgTypeCode.TVMPackedFuncHandle: {
                return this.ctx.attachToCurrentScope(this.makePackedFunc(this.memory.loadPointer(rvaluePtr)));
            }
            case ArgTypeCode.TVMModuleHandle: {
                return this.ctx.attachToCurrentScope(new Module(this.memory.loadPointer(rvaluePtr), this.lib, function (ptr) {
                    return _this.ctx.attachToCurrentScope(_this.makePackedFunc(ptr));
                }));
            }
            case ArgTypeCode.TVMObjectHandle: {
                var obj = new TVMObject(this.memory.loadPointer(rvaluePtr), this.lib, this.ctx);
                var func = this.objFactory.get(obj.typeIndex());
                if (func != undefined) {
                    return this.ctx.attachToCurrentScope(func(obj.getHandle(), this.lib, this.ctx));
                }
                else {
                    return this.ctx.attachToCurrentScope(obj);
                }
            }
            case ArgTypeCode.Null: return undefined;
            case ArgTypeCode.DLDevice: {
                var deviceType = this.memory.loadI32(rvaluePtr);
                var deviceId = this.memory.loadI32(rvaluePtr + SizeOf.I32);
                return this.device(deviceType, deviceId);
            }
            case ArgTypeCode.TVMStr: {
                var ret = this.memory.loadCString(this.memory.loadPointer(rvaluePtr));
                return ret;
            }
            case ArgTypeCode.TVMBytes: {
                return this.memory.loadTVMBytes(this.memory.loadPointer(rvaluePtr));
            }
            default:
                throw new Error("Unsupported return type code=" + tcode);
        }
    };
    return Instance;
}());
/**
 * Asynchrously instantiate a new {@link Instance}.
 *
 * importObject can also be a {@link LibraryProvider} object,
 * a WASI object, or an object containing wasmLibraryProvider field.
 * We can take benefit of syslib implementations from the Emscripten
 * by passing its generated js Module as the imports.
 *
 * @param bufferSource The source to be compiled.
 * @param importObject The import objects.
 * @param logger The system logger.
 */
function instantiate(bufferSource, importObject, logger) {
    if (importObject === void 0) { importObject = {}; }
    if (logger === void 0) { logger = console.log; }
    var env = new Environment(importObject, logger);
    return WebAssembly.instantiate(bufferSource, env.imports).then(function (result) {
        return new Instance(result.module, {}, result.instance, env);
    });
}

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var RPCServerState;
(function (RPCServerState) {
    RPCServerState[RPCServerState["InitHeader"] = 0] = "InitHeader";
    RPCServerState[RPCServerState["InitHeaderKey"] = 1] = "InitHeaderKey";
    RPCServerState[RPCServerState["InitServer"] = 2] = "InitServer";
    RPCServerState[RPCServerState["WaitForCallback"] = 3] = "WaitForCallback";
    RPCServerState[RPCServerState["ReceivePacketHeader"] = 4] = "ReceivePacketHeader";
    RPCServerState[RPCServerState["ReceivePacketBody"] = 5] = "ReceivePacketBody";
})(RPCServerState || (RPCServerState = {}));

var LLMInstance = /** @class */ (function () {
    function LLMInstance(config, sentencePieceProcessor) {
        this.config = config;
        this.tvm = undefined;
        this.tokenizer = undefined;
        this.model = undefined;
        this.spp = sentencePieceProcessor;
        this.processing = false;
    }
    LLMInstance.prototype.isInitialized = function () {
        return this.model != undefined;
    };
    LLMInstance.prototype.init = function (cb) {
        return __awaiter(this, void 0, void 0, function () {
            var wasmSource, _a, output, err_1, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.model) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, fetch(this.config.wasmUrl)];
                    case 1: return [4 /*yield*/, (_c.sent()).arrayBuffer()];
                    case 2:
                        wasmSource = _c.sent();
                        _a = this;
                        return [4 /*yield*/, instantiate(new Uint8Array(wasmSource), 
                            //@ts-ignore
                            new EmccWASI(), console.log)];
                    case 3:
                        _a.tvm = _c.sent();
                        _c.label = 4;
                    case 4:
                        _c.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, detectGPUDevice()];
                    case 5:
                        output = _c.sent();
                        if (output !== undefined) {
                            this.tvm.initWebGPU(output.device);
                        }
                        else {
                            throw Error("This browser env do not support WebGPU");
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _c.sent();
                        throw Error("Find an error initializing WebGPU: " + err_1.toString());
                    case 7:
                        this.tvm.registerInitProgressCallback(cb);
                        return [4 /*yield*/, this.tvm.fetchNDArrayCache(this.config.cacheUrl, this.tvm.webgpu())];
                    case 8:
                        _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.spp()(this.config.tokenizerUrl)];
                    case 9:
                        _b.tokenizer = _c.sent();
                        this.model = this.tvm.withNewScope(function () {
                            return new LLMInstanceScope(_this.tvm, _this.tokenizer, _this.config.maxWindowSize);
                        });
                        return [2 /*return*/, this.model.init()];
                }
            });
        });
    };
    LLMInstance.prototype.generate = function (request, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.processing) {
                            return [2 /*return*/];
                        }
                        this.processing = true;
                        return [4 /*yield*/, this.model.generate(request, cb)];
                    case 1:
                        _a.sent();
                        this.processing = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    return LLMInstance;
}());
var LLMInstanceScope = /** @class */ (function () {
    function LLMInstanceScope(tvm, tokenizer, maxWindowSize) {
        if (maxWindowSize === void 0) { maxWindowSize = 2048; }
        this.tvm = tvm;
        this.tokenizer = tokenizer;
        this.bosTokenId = 1;
        this.eosTokenId = 2;
        this.maxWindowSize = maxWindowSize;
        this.device = this.tvm.webgpu();
        this.vm = this.tvm.detachFromCurrentScope(this.tvm.createVirtualMachine(this.device));
        this.encoding = this.tvm.detachFromCurrentScope(this.vm.getFunction("encoding"));
        this.decoding = this.tvm.detachFromCurrentScope(this.vm.getFunction("decoding"));
        this.params = this.tvm.detachFromCurrentScope(this.tvm.getParamsFromCache("param", this.tvm.cacheMetadata.ParamSize));
        var fcreateCache = this.vm.getFunction("create_kv_cache");
        this.fclearKVCaches = this.tvm.detachFromCurrentScope(this.tvm.getGlobalFunc("vm.builtin.attention_kv_cache_array_clear"));
        // use extern config for now
        this.kvCache = this.tvm.detachFromCurrentScope(fcreateCache());
        // fill with pad token
        this.logitsOnCPU = undefined;
        this.kvCacheLength = 0;
        this.lastMessageId = "";
    }
    LLMInstanceScope.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tvm.asyncLoadWebGPUPiplines(this.vm.getInternalModule())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LLMInstanceScope.prototype.getTokensFromStart = function (conversation, maxTokens) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens, i, message, text, messageTokens, _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        this.clearKVCache();
                        tokens = [];
                        i = conversation.messages.length - 1;
                        _g.label = 1;
                    case 1:
                        if (!(i >= 0)) return [3 /*break*/, 5];
                        message = conversation.messages[i];
                        text = "".concat(message.role, ": ").concat(message.text, "\n");
                        return [4 /*yield*/, this.tokenizer.encodeIds(text)];
                    case 2:
                        messageTokens = _g.sent();
                        if (tokens.length + messageTokens.length + maxTokens >
                            this.maxWindowSize) {
                            return [3 /*break*/, 5];
                        }
                        _b = (_a = tokens.unshift).apply;
                        _c = [tokens];
                        return [4 /*yield*/, this.tokenizer.encodeIds(text)];
                    case 3:
                        _b.apply(_a, _c.concat([(_g.sent())]));
                        _g.label = 4;
                    case 4:
                        i--;
                        return [3 /*break*/, 1];
                    case 5:
                        _e = (_d = tokens.unshift).apply;
                        _f = [tokens];
                        return [4 /*yield*/, this.tokenizer.encodeIds(conversation.systemPrompt)];
                    case 6:
                        _e.apply(_d, _f.concat([(_g.sent())]));
                        tokens.unshift(this.bosTokenId);
                        return [2 /*return*/, tokens];
                }
            });
        });
    };
    LLMInstanceScope.prototype.getTokens = function (conversation, maxTokens) {
        return __awaiter(this, void 0, void 0, function () {
            var startMsgIdx, i, tokens, i, message, text, messageTokens, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(this.kvCacheLength == 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getTokensFromStart(conversation, maxTokens)];
                    case 1: 
                    // Case 1
                    return [2 /*return*/, _d.sent()];
                    case 2:
                        startMsgIdx = 0;
                        for (i = conversation.messages.length - 1; i >= 0; i--) {
                            if (conversation.messages[i].id == this.lastMessageId) {
                                startMsgIdx = i + 1;
                                break;
                            }
                        }
                        if (!(startMsgIdx == 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getTokensFromStart(conversation, maxTokens)];
                    case 3: 
                    // Case 2
                    return [2 /*return*/, _d.sent()];
                    case 4:
                        tokens = [this.eosTokenId];
                        i = startMsgIdx;
                        _d.label = 5;
                    case 5:
                        if (!(i < conversation.messages.length)) return [3 /*break*/, 11];
                        message = conversation.messages[i];
                        text = "".concat(message.role, ": ").concat(message.text);
                        return [4 /*yield*/, this.tokenizer.encodeIds(text)];
                    case 6:
                        messageTokens = _d.sent();
                        if (!(tokens.length + messageTokens.length + maxTokens >
                            this.maxWindowSize)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.getTokensFromStart(conversation, maxTokens)];
                    case 7: 
                    // Case 4
                    return [2 /*return*/, _d.sent()];
                    case 8:
                        _b = (_a = tokens.push).apply;
                        _c = [tokens];
                        return [4 /*yield*/, this.tokenizer.encodeIds(text)];
                    case 9:
                        _b.apply(_a, _c.concat([(_d.sent())]));
                        _d.label = 10;
                    case 10:
                        i++;
                        return [3 /*break*/, 5];
                    case 11: 
                    // Case 3
                    return [2 /*return*/, tokens];
                }
            });
        });
    };
    LLMInstanceScope.prototype.generate = function (request, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var conversation, maxTokens, assistantRoleName, stopTexts, tokens, _a, _b, _c, _d, _e, _f, inputTokenLength, outputText, tstart, tend, step, id, input, logits, nextToken, outputTokens, stopPos, stop_1, i;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        conversation = request.conversation, maxTokens = request.maxTokens, assistantRoleName = request.assistantRoleName, stopTexts = request.stopTexts;
                        return [4 /*yield*/, this.getTokens(conversation, maxTokens)];
                    case 1:
                        tokens = _g.sent();
                        _b = (_a = tokens.push).apply;
                        _c = [tokens];
                        return [4 /*yield*/, this.tokenizer.encodeIds("".concat(assistantRoleName, ":"))];
                    case 2:
                        _b.apply(_a, _c.concat([(_g.sent())]));
                        _e = (_d = console).log;
                        _f = ["decoded: "];
                        return [4 /*yield*/, this.tokenizer.decodeIds(tokens)];
                    case 3:
                        _e.apply(_d, _f.concat([_g.sent()]));
                        inputTokenLength = tokens.length;
                        outputText = "";
                        tstart = 0, tend = 0, step = 0;
                        id = v4();
                        _g.label = 4;
                    case 4:
                        if (!(step < maxTokens)) return [3 /*break*/, 7];
                        this.tvm.beginScope();
                        tstart = performance.now();
                        if (step == 0) {
                            input = this.tvm.empty([1, tokens.length], "int32", this.device);
                            input.copyFrom(tokens);
                        }
                        else {
                            input = this.tvm.empty([1, 1], "int32", this.device);
                            input.copyFrom(tokens.slice(tokens.length - 1));
                        }
                        logits = this.tvm.detachFromCurrentScope(this.forward(input, this.kvCacheLength + inputTokenLength + step));
                        this.tvm.endScope();
                        return [4 /*yield*/, this.sampleTokenFromLogits(logits)];
                    case 5:
                        nextToken = _g.sent();
                        logits.dispose();
                        tokens.push(nextToken);
                        outputTokens = tokens.slice(inputTokenLength);
                        outputText = this.tokenizer.decodeIds(outputTokens);
                        tend = performance.now();
                        if (nextToken == this.eosTokenId)
                            return [3 /*break*/, 7];
                        stopPos = outputText.lastIndexOf("</s>");
                        if (stopPos != -1) {
                            outputText = outputText.substring(0, stopPos);
                            return [3 /*break*/, 7];
                        }
                        stop_1 = false;
                        for (i = 0; i < stopTexts.length; i++) {
                            console.log("outputText.endsWith(stopTexts[i])", outputText.endsWith(stopTexts[i]), stopTexts[i], outputText);
                            if (outputText.endsWith(stopTexts[i])) {
                                console.log("true!");
                                outputText = outputText.substring(0, outputText.length - stopTexts[i].length);
                                stop_1 = true;
                                break;
                            }
                        }
                        if (stop_1)
                            return [3 /*break*/, 7];
                        if (step != 0) {
                            cb({
                                requestId: id,
                                step: step,
                                outputText: outputText,
                                stats: {
                                    totalDecodingSeconds: (tend - tstart) / 1000,
                                    totalDecodedTokens: tokens.length - inputTokenLength,
                                    totalEncodedTokens: inputTokenLength,
                                },
                                isFinished: false,
                            });
                        }
                        _g.label = 6;
                    case 6:
                        step++;
                        return [3 /*break*/, 4];
                    case 7:
                        this.kvCacheLength += tokens.length - 1;
                        this.lastMessageId = id;
                        cb({
                            requestId: id,
                            outputText: outputText,
                            step: step,
                            stats: {
                                totalDecodingSeconds: (tend - tstart) / 1000,
                                totalDecodedTokens: tokens.length - inputTokenLength,
                                totalEncodedTokens: inputTokenLength,
                            },
                            isFinished: true,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    LLMInstanceScope.prototype.dispose = function () {
        // note: tvm instance is not owned by this class
        this.params.dispose();
        this.decoding.dispose();
        this.encoding.dispose();
        this.vm.dispose();
        this.kvCache.dispose();
        this.fclearKVCaches.dispose();
        if (this.logitsOnCPU != undefined) {
            this.logitsOnCPU.dispose();
        }
    };
    LLMInstanceScope.prototype.clearKVCache = function () {
        console.log("cleared conversation attention kv cache");
        this.fclearKVCaches(this.kvCache);
        this.kvCacheLength = 0;
        this.lastMessageId = "";
    };
    LLMInstanceScope.prototype.forward = function (inputs, curPos) {
        this.tvm.beginScope();
        var retValue;
        var seqLenShape = this.tvm.makeShapeTuple([curPos]);
        if (inputs.shape[1] > 1) {
            retValue = this.encoding(inputs, seqLenShape, this.kvCache, this.params);
        }
        else {
            retValue = this.decoding(inputs, seqLenShape, this.kvCache, this.params);
        }
        var logits = this.tvm.detachFromCurrentScope(retValue.get(0));
        this.tvm.endScope();
        this.tvm.attachToCurrentScope(logits);
        return logits;
    };
    // NOTE: caller must call device.sync()
    LLMInstanceScope.prototype.updateLogitsOnCPU = function (logits) {
        if (this.logitsOnCPU == undefined) {
            this.logitsOnCPU = this.tvm.detachFromCurrentScope(this.tvm.empty(logits.shape, logits.dtype, this.tvm.cpu()));
        }
        else {
            if (logits.shape[0] != this.logitsOnCPU.shape[0]) {
                throw Error("We expect the size of logits to remain unchanged");
            }
        }
        this.logitsOnCPU.copyFrom(logits);
    };
    LLMInstanceScope.prototype.sampleTokenFromLogits = function (logits, temperature, top_p) {
        if (temperature === void 0) { temperature = 0.8; }
        if (top_p === void 0) { top_p = 0.95; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.tvm.beginScope();
                        this.updateLogitsOnCPU(logits);
                        this.tvm.endScope();
                        return [4 /*yield*/, this.device.sync()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.tvm.sampleTopPFromLogits(this.logitsOnCPU, temperature, top_p)];
                }
            });
        });
    };
    return LLMInstanceScope;
}());

var config = {
    kvConfig: {
        numLayers: 64,
        shape: [32, 32, 128],
        dtype: 'float32',
    },
    wasmUrl: 'https://huggingface.co/mrick/react-llm/resolve/main/models/vicuna-7b-v1/vicuna-7b-v1_webgpu.wasm',
    cacheUrl: 'https://huggingface.co/mrick/react-llm/resolve/main/models/vicuna-7b-v1/params/',
    tokenizerUrl: 'https://huggingface.co/mrick/react-llm/resolve/main/models/vicuna-7b-v1/tokenizer.model',
    sentencePieceJsUrl: 'https://cdn.matt-rickard.com/code/sentencepiece.js',
    tvmRuntimeJsUrl: 'https://cdn.matt-rickard.com/code/tvmjs_runtime.wasi.js',
    maxWindowSize: 2048,
};
var instance = new LLMInstance(config, function () { return globalThis.sentencepiece.sentencePieceProcessor; });
var worker = {
    init: function (callback) {
        instance.init(callback);
    },
    generate: function (request, cb) {
        instance.generate(request, cb);
    }
};
importScripts.apply(void 0, [
    config.sentencePieceJsUrl, config.tvmRuntimeJsUrl
]);
expose(worker);
