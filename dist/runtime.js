// typescript/runtime.ts
function detectRuntime() {
  const globalCaches = globalThis.caches;
  if (typeof caches !== "undefined" && globalCaches !== null && typeof globalCaches === "object" && "default" in globalCaches && typeof window === "undefined" && typeof document === "undefined") {
    return "cloudflare-workers";
  }
  if (typeof globalThis.EdgeRuntime !== "undefined") {
    return "edge-runtime";
  }
  if (typeof globalThis.Deno !== "undefined") {
    return "deno";
  }
  if (typeof globalThis.Bun !== "undefined") {
    return "bun";
  }
  if (typeof process !== "undefined" && process.versions && process.versions.node) {
    return "node";
  }
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return "browser";
  }
  return "unknown";
}
function isBrowser() {
  return detectRuntime() === "browser";
}
function isNode() {
  return detectRuntime() === "node";
}
function isDeno() {
  return detectRuntime() === "deno";
}
function isBun() {
  return detectRuntime() === "bun";
}
function isCloudflareWorkers() {
  return detectRuntime() === "cloudflare-workers";
}
function isEdgeRuntime() {
  return detectRuntime() === "edge-runtime";
}
function isEdgeEnvironment() {
  const runtime = detectRuntime();
  return runtime === "cloudflare-workers" || runtime === "edge-runtime";
}
function isWebEnvironment() {
  const runtime = detectRuntime();
  return runtime === "browser";
}
function isServerEnvironment() {
  const runtime = detectRuntime();
  return runtime === "node" || runtime === "deno" || runtime === "bun" || runtime === "cloudflare-workers" || runtime === "edge-runtime";
}
function hasFileApi() {
  return typeof window !== "undefined" && typeof File !== "undefined" && typeof Blob !== "undefined";
}
function hasBlob() {
  return typeof Blob !== "undefined";
}
function hasWorkers() {
  return typeof Worker !== "undefined";
}
function hasSharedArrayBuffer() {
  return typeof SharedArrayBuffer !== "undefined";
}
function hasModuleWorkers() {
  if (!hasWorkers()) {
    return false;
  }
  try {
    const blob = new Blob(['console.log("test")'], {
      type: "application/javascript"
    });
    const workerUrl = URL.createObjectURL(blob);
    try {
      return true;
    } finally {
      URL.revokeObjectURL(workerUrl);
    }
  } catch {
    return false;
  }
}
function hasWasm() {
  return typeof WebAssembly !== "undefined" && WebAssembly.instantiate !== void 0;
}
function hasWasmStreaming() {
  return typeof WebAssembly !== "undefined" && WebAssembly.instantiateStreaming !== void 0;
}
function hasBigInt() {
  try {
    const test = BigInt("1");
    return typeof test === "bigint";
  } catch {
    return false;
  }
}
function getRuntimeVersion() {
  const runtime = detectRuntime();
  switch (runtime) {
    case "node":
      return process.version?.substring(1);
    case "deno": {
      const deno = globalThis.Deno;
      const version = deno?.version;
      return version?.deno;
    }
    case "bun": {
      const bun = globalThis.Bun;
      return bun?.version;
    }
    default:
      return void 0;
  }
}
function getWasmCapabilities() {
  const runtime = detectRuntime();
  const version = getRuntimeVersion();
  const capabilities = {
    runtime,
    hasWasm: hasWasm(),
    hasWasmStreaming: hasWasmStreaming(),
    hasFileApi: hasFileApi(),
    hasBlob: hasBlob(),
    hasWorkers: hasWorkers(),
    hasSharedArrayBuffer: hasSharedArrayBuffer(),
    hasModuleWorkers: hasModuleWorkers(),
    hasBigInt: hasBigInt(),
    ...version !== void 0 ? { runtimeVersion: version } : {}
  };
  return capabilities;
}
function getRuntimeInfo() {
  const runtime = detectRuntime();
  const capabilities = getWasmCapabilities();
  return {
    runtime,
    isBrowser: isBrowser(),
    isNode: isNode(),
    isDeno: isDeno(),
    isBun: isBun(),
    isWeb: isWebEnvironment(),
    isServer: isServerEnvironment(),
    runtimeVersion: getRuntimeVersion(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "N/A",
    capabilities
  };
}
export {
  detectRuntime,
  getRuntimeInfo,
  getRuntimeVersion,
  getWasmCapabilities,
  hasBigInt,
  hasBlob,
  hasFileApi,
  hasModuleWorkers,
  hasSharedArrayBuffer,
  hasWasm,
  hasWasmStreaming,
  hasWorkers,
  isBrowser,
  isBun,
  isCloudflareWorkers,
  isDeno,
  isEdgeEnvironment,
  isEdgeRuntime,
  isNode,
  isServerEnvironment,
  isWebEnvironment
};
//# sourceMappingURL=runtime.js.map