// typescript/ocr/registry.ts
var ocrBackendRegistry = /* @__PURE__ */ new Map();
function registerOcrBackend(backend) {
  if (!backend) {
    throw new Error("Backend cannot be null or undefined");
  }
  if (typeof backend.name !== "function") {
    throw new Error("Backend must implement name() method");
  }
  if (typeof backend.supportedLanguages !== "function") {
    throw new Error("Backend must implement supportedLanguages() method");
  }
  if (typeof backend.processImage !== "function") {
    throw new Error("Backend must implement processImage() method");
  }
  const backendName = backend.name();
  if (!backendName || typeof backendName !== "string") {
    throw new Error("Backend name must be a non-empty string");
  }
  if (ocrBackendRegistry.has(backendName)) {
    console.warn(`OCR backend "${backendName}" is already registered and will be replaced`);
  }
  ocrBackendRegistry.set(backendName, backend);
}
function getOcrBackend(name) {
  return ocrBackendRegistry.get(name);
}
function listOcrBackends() {
  return Array.from(ocrBackendRegistry.keys());
}
async function unregisterOcrBackend(name) {
  const backend = ocrBackendRegistry.get(name);
  if (!backend) {
    return;
  }
  if (typeof backend.shutdown === "function") {
    try {
      await backend.shutdown();
    } catch (error) {
      console.warn(
        `Error shutting down OCR backend "${name}": ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  ocrBackendRegistry.delete(name);
}
async function clearOcrBackends() {
  const backends = Array.from(ocrBackendRegistry.entries());
  for (const [name, backend] of backends) {
    if (typeof backend.shutdown === "function") {
      try {
        await backend.shutdown();
      } catch (error) {
        console.warn(
          `Error shutting down OCR backend "${name}": ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  }
  ocrBackendRegistry.clear();
}
export {
  clearOcrBackends,
  getOcrBackend,
  listOcrBackends,
  registerOcrBackend,
  unregisterOcrBackend
};
//# sourceMappingURL=registry.js.map