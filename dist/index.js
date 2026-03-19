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

// typescript/initialization/pdfium-loader.ts
async function loadPdfiumForNode() {
  try {
    const fs = await import(
      /* @vite-ignore */
      "fs/promises"
    );
    const path = await import(
      /* @vite-ignore */
      "path"
    );
    const url = await import(
      /* @vite-ignore */
      "url"
    );
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    const envPath = process.env.KREUZBERG_PDFIUM_PATH;
    const candidates = [];
    if (envPath) {
      candidates.push(path.join(envPath, "pdfium.js"));
      candidates.push(envPath);
    }
    candidates.push(
      path.join(__dirname, "..", "pdfium.js"),
      // dist/pdfium.js
      path.join(__dirname, "pdfium.js"),
      // dist/initialization/pdfium.js
      path.join(__dirname, "..", "..", "pdfium.js")
      // package root pdfium.js
    );
    for (const candidate of candidates) {
      try {
        await fs.access(candidate);
        const moduleUrl = url.pathToFileURL(candidate).href;
        return await import(
          /* @vite-ignore */
          moduleUrl
        );
      } catch {
      }
    }
    return null;
  } catch {
    return null;
  }
}
async function loadPdfiumModule() {
  if (isNode()) {
    return loadPdfiumForNode();
  }
  try {
    return await import("./pdfium.js");
  } catch {
    return null;
  }
}
async function initializePdfiumAsync(wasmModule) {
  if (!wasmModule || typeof wasmModule.initialize_pdfium_render !== "function") {
    return;
  }
  try {
    const pdfiumModule = await loadPdfiumModule();
    if (!pdfiumModule) {
      console.debug("PDFium module not found, PDF extraction will not be available");
      console.debug("To enable PDF support, provide pdfium.js via KREUZBERG_PDFIUM_PATH or manual initialization");
      return;
    }
    const pdfium = typeof pdfiumModule.default === "function" ? await pdfiumModule.default() : pdfiumModule;
    const success = wasmModule.initialize_pdfium_render(pdfium, wasmModule, false);
    if (!success) {
      console.warn("PDFium initialization returned false");
    }
  } catch (error) {
    console.debug("PDFium initialization error:", error);
  }
}

// typescript/adapters/wasm-adapter.ts
var MAX_FILE_SIZE = 512 * 1024 * 1024;
function isNumberOrNull(value) {
  return typeof value === "number" || value === null || value === void 0;
}
function isStringOrNull(value) {
  return typeof value === "string" || value === null || value === void 0;
}
function isBoolean(value) {
  return typeof value === "boolean" || value === void 0;
}
async function fileToUint8Array(file) {
  try {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File size (${file.size} bytes) exceeds maximum (${MAX_FILE_SIZE} bytes). Maximum file size is 512 MB.`
      );
    }
    const arrayBuffer = await file.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    throw new Error(`Failed to read file: ${error instanceof Error ? error.message : String(error)}`);
  }
}
function configToJS(config) {
  if (!config) {
    return {};
  }
  const toSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  const normalizeValue = (value) => {
    if (value === null || value === void 0) {
      return null;
    }
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return value.map(normalizeValue);
      }
      const obj = value;
      const normalized2 = {};
      for (const [key, val] of Object.entries(obj)) {
        const normalizedVal = normalizeValue(val);
        if (normalizedVal !== null && normalizedVal !== void 0) {
          normalized2[toSnakeCase(key)] = normalizedVal;
        }
      }
      return Object.keys(normalized2).length > 0 ? normalized2 : null;
    }
    return value;
  };
  const normalized = {};
  for (const [key, value] of Object.entries(config)) {
    const normalizedValue = normalizeValue(value);
    if (normalizedValue !== null && normalizedValue !== void 0) {
      normalized[toSnakeCase(key)] = normalizedValue;
    }
  }
  return normalized;
}
function jsToExtractionResult(jsValue) {
  if (!jsValue || typeof jsValue !== "object") {
    throw new Error("Invalid extraction result: value is not an object");
  }
  const result = jsValue;
  const mimeType = typeof result.mimeType === "string" ? result.mimeType : typeof result.mime_type === "string" ? result.mime_type : null;
  if (typeof result.content !== "string") {
    throw new Error("Invalid extraction result: missing or invalid content");
  }
  if (typeof mimeType !== "string") {
    throw new Error("Invalid extraction result: missing or invalid mimeType");
  }
  if (!result.metadata || typeof result.metadata !== "object") {
    throw new Error("Invalid extraction result: missing or invalid metadata");
  }
  const tables = [];
  if (Array.isArray(result.tables)) {
    for (const table of result.tables) {
      if (table && typeof table === "object") {
        const t = table;
        const pageNumber = typeof t.pageNumber === "number" ? t.pageNumber : typeof t.page_number === "number" ? t.page_number : null;
        if (Array.isArray(t.cells) && t.cells.every((row) => Array.isArray(row) && row.every((cell) => typeof cell === "string")) && typeof t.markdown === "string" && pageNumber !== null) {
          tables.push({
            cells: t.cells,
            markdown: t.markdown,
            pageNumber
          });
        }
      }
    }
  }
  const chunks = Array.isArray(result.chunks) ? result.chunks.map((chunk) => {
    if (!chunk || typeof chunk !== "object") {
      throw new Error("Invalid chunk structure");
    }
    const c = chunk;
    if (typeof c.content !== "string") {
      throw new Error("Invalid chunk: missing content");
    }
    if (!c.metadata || typeof c.metadata !== "object") {
      throw new Error("Invalid chunk: missing metadata");
    }
    const metadata = c.metadata;
    let embedding = null;
    if (Array.isArray(c.embedding)) {
      if (!c.embedding.every((item) => typeof item === "number")) {
        throw new Error("Invalid chunk: embedding must contain only numbers");
      }
      embedding = c.embedding;
    }
    const coerceToNumber = (value, fieldName) => {
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "bigint") {
        return Number(value);
      }
      if (typeof value === "string") {
        const parsed = parseInt(value, 10);
        if (Number.isNaN(parsed)) {
          throw new Error(`Invalid chunk metadata: ${fieldName} must be a valid number, got "${value}"`);
        }
        return parsed;
      }
      throw new Error(`Invalid chunk metadata: ${fieldName} must be a number, got ${typeof value}`);
    };
    const charStart = coerceToNumber(
      metadata.charStart ?? metadata.char_start ?? metadata.byteStart ?? metadata.byte_start,
      "charStart"
    );
    const charEnd = coerceToNumber(
      metadata.charEnd ?? metadata.char_end ?? metadata.byteEnd ?? metadata.byte_end,
      "charEnd"
    );
    const chunkIndex = coerceToNumber(metadata.chunkIndex ?? metadata.chunk_index, "chunkIndex");
    const totalChunks = coerceToNumber(metadata.totalChunks ?? metadata.total_chunks, "totalChunks");
    let tokenCount = null;
    const tokenCountValue = metadata.tokenCount ?? metadata.token_count;
    if (tokenCountValue !== null && tokenCountValue !== void 0) {
      tokenCount = coerceToNumber(tokenCountValue, "tokenCount");
    }
    let firstPage = null;
    const firstPageValue = metadata.firstPage ?? metadata.first_page;
    if (firstPageValue !== null && firstPageValue !== void 0) {
      firstPage = coerceToNumber(firstPageValue, "firstPage");
    }
    let lastPage = null;
    const lastPageValue = metadata.lastPage ?? metadata.last_page;
    if (lastPageValue !== null && lastPageValue !== void 0) {
      lastPage = coerceToNumber(lastPageValue, "lastPage");
    }
    const rawHc = metadata["heading_context"] ?? metadata["headingContext"];
    let headingContext = null;
    if (rawHc && typeof rawHc === "object") {
      const rawHeadings = rawHc["headings"];
      if (Array.isArray(rawHeadings)) {
        headingContext = {
          headings: rawHeadings.map((h) => {
            const heading = h;
            return {
              // biome-ignore lint/complexity/useLiteralKeys: dynamic property access from raw object
              level: heading["level"] ?? 0,
              // biome-ignore lint/complexity/useLiteralKeys: dynamic property access from raw object
              text: heading["text"] ?? ""
            };
          })
        };
      }
    }
    return {
      content: c.content,
      embedding,
      metadata: {
        byteStart: charStart,
        byteEnd: charEnd,
        charStart,
        charEnd,
        tokenCount,
        chunkIndex,
        totalChunks,
        firstPage,
        lastPage,
        headingContext
      }
    };
  }) : null;
  const images = Array.isArray(result.images) ? result.images.map((image) => {
    if (!image || typeof image !== "object") {
      throw new Error("Invalid image structure");
    }
    const img = image;
    let imageData;
    if (img.data instanceof Uint8Array) {
      imageData = img.data;
    } else if (Array.isArray(img.data)) {
      imageData = new Uint8Array(img.data);
    } else {
      throw new Error("Invalid image: data must be Uint8Array or array");
    }
    if (typeof img.format !== "string") {
      throw new Error("Invalid image: missing format");
    }
    const imageIndex = img.imageIndex ?? img.image_index;
    const pageNumber = img.pageNumber ?? img.page_number;
    const bitsPerComponent = img.bitsPerComponent ?? img.bits_per_component;
    const isMask = img.isMask ?? img.is_mask;
    const ocrResult = img.ocrResult ?? img.ocr_result;
    if (typeof imageIndex !== "number") {
      throw new Error("Invalid image: imageIndex must be a number");
    }
    if (!isNumberOrNull(pageNumber)) {
      throw new Error("Invalid image: pageNumber must be a number or null");
    }
    if (!isNumberOrNull(img.width)) {
      throw new Error("Invalid image: width must be a number or null");
    }
    if (!isNumberOrNull(img.height)) {
      throw new Error("Invalid image: height must be a number or null");
    }
    if (!isNumberOrNull(bitsPerComponent)) {
      throw new Error("Invalid image: bitsPerComponent must be a number or null");
    }
    if (!isBoolean(isMask)) {
      throw new Error("Invalid image: isMask must be a boolean");
    }
    if (!isStringOrNull(img.colorspace)) {
      throw new Error("Invalid image: colorspace must be a string or null");
    }
    if (!isStringOrNull(img.description)) {
      throw new Error("Invalid image: description must be a string or null");
    }
    return {
      data: imageData,
      format: img.format,
      imageIndex,
      pageNumber: pageNumber ?? null,
      width: img.width ?? null,
      height: img.height ?? null,
      colorspace: img.colorspace ?? null,
      bitsPerComponent: bitsPerComponent ?? null,
      isMask: isMask ?? false,
      description: img.description ?? null,
      ocrResult: ocrResult ? jsToExtractionResult(ocrResult) : null
    };
  }) : null;
  let detectedLanguages = null;
  const detectedLanguagesRaw = Array.isArray(result.detectedLanguages) ? result.detectedLanguages : result.detected_languages;
  if (Array.isArray(detectedLanguagesRaw)) {
    if (!detectedLanguagesRaw.every((lang) => typeof lang === "string")) {
      throw new Error("Invalid result: detectedLanguages must contain only strings");
    }
    detectedLanguages = detectedLanguagesRaw;
  }
  const extractedKeywords = result.extractedKeywords ?? result.extracted_keywords ?? null;
  const qualityScore = typeof (result.qualityScore ?? result.quality_score) === "number" ? result.qualityScore ?? result.quality_score : null;
  const processingWarnings = result.processingWarnings ?? result.processing_warnings ?? null;
  const elements = result.elements ?? null;
  const ocrElements = result.ocrElements ?? result.ocr_elements ?? null;
  const document2 = result.document ?? null;
  const pages = result.pages ?? null;
  const annotations = result.annotations ?? null;
  return {
    content: result.content,
    mimeType,
    metadata: result.metadata ?? {},
    tables,
    detectedLanguages,
    chunks,
    images,
    pages,
    extractedKeywords,
    qualityScore,
    processingWarnings,
    elements,
    ocrElements,
    document: document2,
    annotations
  };
}
function wrapWasmError(error, context) {
  if (error instanceof Error) {
    return new Error(`Error ${context}: ${error.message}`, {
      cause: error
    });
  }
  const message = String(error);
  return new Error(`Error ${context}: ${message}`);
}
function isValidExtractionResult(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const obj = value;
  return typeof obj.content === "string" && (typeof obj.mimeType === "string" || typeof obj.mime_type === "string") && obj.metadata !== null && typeof obj.metadata === "object" && Array.isArray(obj.tables);
}

// typescript/initialization/state.ts
var wasm = null;
var initialized = false;
var initializationError = null;
var initializationPromise = null;
function getWasmModule() {
  return wasm;
}
function setWasmModule(module) {
  wasm = module;
}
function isInitialized() {
  return initialized;
}
function setInitialized(value) {
  initialized = value;
}
function getInitializationError() {
  return initializationError;
}
function setInitializationError(error) {
  initializationError = error;
}
function getInitializationPromise() {
  return initializationPromise;
}
function setInitializationPromise(promise) {
  initializationPromise = promise;
}

// typescript/initialization/wasm-loader.ts
async function loadWasmBinaryForNode() {
  if (!isNode()) {
    return void 0;
  }
  try {
    const fs = await import(
      /* @vite-ignore */
      "fs/promises"
    );
    const path = await import(
      /* @vite-ignore */
      "path"
    );
    const url = await import(
      /* @vite-ignore */
      "url"
    );
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    const wasmPath = path.join(__dirname, "..", "pkg", "kreuzberg_wasm_bg.wasm");
    const wasmBuffer = await fs.readFile(wasmPath);
    return new Uint8Array(wasmBuffer);
  } catch {
    return void 0;
  }
}
function getVersion() {
  if (!isInitialized()) {
    throw new Error("WASM module not initialized. Call initWasm() first.");
  }
  const wasmModule = getWasmModule();
  if (!wasmModule) {
    throw new Error("WASM module not loaded. Call initWasm() first.");
  }
  return wasmModule.version();
}
async function initWasm(options) {
  if (isInitialized()) {
    return;
  }
  let currentPromise = getInitializationPromise();
  if (currentPromise) {
    return currentPromise;
  }
  currentPromise = (async () => {
    try {
      if (!hasWasm()) {
        throw new Error("WebAssembly is not supported in this environment");
      }
      const baseUrl = new URL(import.meta.url);
      const modulePaths = [
        new URL("./pkg/kreuzberg_wasm.js", baseUrl).href,
        new URL("./kreuzberg_wasm.js", baseUrl).href,
        [".", "pkg", "kreuzberg_wasm.js"].join("/"),
        ["..", "pkg", "kreuzberg_wasm.js"].join("/")
      ];
      let wasmModule;
      let lastError;
      for (const modulePath of modulePaths) {
        try {
          wasmModule = await import(
            /* @vite-ignore */
            modulePath
          );
          break;
        } catch (e) {
          lastError = e;
        }
      }
      if (!wasmModule) {
        throw lastError;
      }
      const loadedModule = wasmModule;
      setWasmModule(loadedModule);
      if (loadedModule && typeof loadedModule.default === "function") {
        if (options?.wasmModule) {
          await loadedModule.default(options.wasmModule);
        } else {
          const wasmBinary = await loadWasmBinaryForNode();
          if (wasmBinary) {
            await loadedModule.default(wasmBinary);
          } else if (isEdgeEnvironment()) {
            throw new Error(
              "Edge environment detected (Cloudflare Workers / Vercel Edge). Cannot automatically load .wasm file because fetch() does not support file:// URLs. Pass the WASM module explicitly:\n\n  import wasmModule from '@kreuzberg/wasm/kreuzberg_wasm_bg.wasm';\n  await initWasm({ wasmModule });\n"
            );
          } else {
            await loadedModule.default();
          }
        }
      }
      if (loadedModule && typeof loadedModule.initialize_pdfium_render === "function") {
        try {
          await initializePdfiumAsync(loadedModule);
        } catch (error) {
          console.warn("PDFium auto-initialization failed (PDF extraction disabled):", error);
        }
      }
      setInitialized(true);
      setInitializationError(null);
    } catch (error) {
      setInitializationError(error instanceof Error ? error : new Error(String(error)));
      throw wrapWasmError(error, "initializing Kreuzberg WASM module");
    }
  })();
  setInitializationPromise(currentPromise);
  return currentPromise;
}

// typescript/extraction/internal.ts
function getWasmModule2() {
  const wasm2 = getWasmModule();
  if (!wasm2) {
    throw new Error("WASM module not loaded. Call initWasm() first.");
  }
  return wasm2;
}
function isInitialized2() {
  return isInitialized();
}

// typescript/extraction/bytes.ts
async function extractBytes(data, mimeType, config) {
  if (!isInitialized2()) {
    throw new Error("WASM module not initialized. Call initWasm() first.");
  }
  const wasm2 = getWasmModule2();
  try {
    if (!data || data.length === 0) {
      throw new Error("Document data cannot be empty");
    }
    if (!mimeType) {
      throw new Error("MIME type is required");
    }
    const normalizedConfig = configToJS(config ?? null);
    const result = await wasm2.extractBytes(data, mimeType, normalizedConfig);
    if (!result) {
      throw new Error("Invalid extraction result: no result from WASM module");
    }
    return jsToExtractionResult(result);
  } catch (error) {
    throw wrapWasmError(error, "extracting from bytes");
  }
}
function extractBytesSync(data, mimeType, config) {
  if (!isInitialized2()) {
    throw new Error("WASM module not initialized. Call initWasm() first.");
  }
  const wasm2 = getWasmModule2();
  try {
    if (!data || data.length === 0) {
      throw new Error("Document data cannot be empty");
    }
    if (!mimeType) {
      throw new Error("MIME type is required");
    }
    const normalizedConfig = configToJS(config ?? null);
    const result = wasm2.extractBytesSync(data, mimeType, normalizedConfig);
    if (!result) {
      throw new Error("Invalid extraction result: no result from WASM module");
    }
    return jsToExtractionResult(result);
  } catch (error) {
    throw wrapWasmError(error, "extracting from bytes (sync)");
  }
}

// typescript/extraction/files.ts
async function extractFile(path, mimeType, config) {
  if (!isInitialized2()) {
    throw new Error("WASM module not initialized. Call initWasm() first.");
  }
  const wasm2 = getWasmModule2();
  try {
    if (!path) {
      throw new Error("File path is required");
    }
    const runtime = detectRuntime();
    if (runtime === "browser") {
      throw new Error("Use extractBytes with fileToUint8Array for browser environments");
    }
    let fileData;
    if (runtime === "node") {
      const { readFile } = await import("fs/promises");
      const buffer = await readFile(path);
      fileData = new Uint8Array(buffer);
    } else if (runtime === "deno") {
      const deno = globalThis.Deno;
      fileData = await deno.readFile(path);
    } else if (runtime === "bun") {
      const { readFile } = await import("fs/promises");
      const buffer = await readFile(path);
      fileData = new Uint8Array(buffer);
    } else {
      throw new Error(`Unsupported runtime for file extraction: ${runtime}`);
    }
    let detectedMimeType = mimeType;
    if (!detectedMimeType) {
      detectedMimeType = wasm2.detectMimeFromBytes(fileData);
    }
    if (!detectedMimeType) {
      throw new Error("Could not detect MIME type for file. Please provide mimeType parameter.");
    }
    detectedMimeType = wasm2.normalizeMimeType(detectedMimeType);
    return await extractBytes(fileData, detectedMimeType, config);
  } catch (error) {
    throw wrapWasmError(error, `extracting from file: ${path}`);
  }
}
async function extractFromFile(file, mimeType, config) {
  if (!isInitialized2()) {
    throw new Error("WASM module not initialized. Call initWasm() first.");
  }
  const wasm2 = getWasmModule2();
  try {
    const bytes = await fileToUint8Array(file);
    let type = mimeType ?? (file instanceof File ? file.type : "application/octet-stream");
    type = wasm2.normalizeMimeType(type);
    return await extractBytes(bytes, type, config);
  } catch (error) {
    throw wrapWasmError(error, `extracting from ${file instanceof File ? "file" : "blob"}`);
  }
}

// typescript/extraction/batch.ts
async function batchExtractBytes(files, config) {
  if (!isInitialized2()) {
    throw new Error("WASM module not initialized. Call initWasm() first.");
  }
  const wasm2 = getWasmModule2();
  try {
    if (!Array.isArray(files)) {
      throw new Error("Files parameter must be an array");
    }
    if (files.length === 0) {
      throw new Error("Files array cannot be empty");
    }
    const dataList = [];
    const mimeTypes = [];
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      if (!file || typeof file !== "object") {
        throw new Error(`Invalid file at index ${i}: must be an object with data and mimeType`);
      }
      const f = file;
      if (!(f.data instanceof Uint8Array)) {
        throw new Error(`Invalid file at index ${i}: data must be Uint8Array`);
      }
      if (typeof f.mimeType !== "string") {
        throw new Error(`Invalid file at index ${i}: mimeType must be a string`);
      }
      if (f.data.length === 0) {
        throw new Error(`Invalid file at index ${i}: data cannot be empty`);
      }
      dataList.push(f.data);
      mimeTypes.push(f.mimeType);
    }
    const normalizedConfig = configToJS(config ?? null);
    const results = await wasm2.batchExtractBytes(dataList, mimeTypes, normalizedConfig);
    if (!Array.isArray(results)) {
      throw new Error("Invalid batch extraction result: expected array");
    }
    return results.map((result, index) => {
      if (!result) {
        throw new Error(`Invalid extraction result at index ${index}: no result from WASM module`);
      }
      return jsToExtractionResult(result);
    });
  } catch (error) {
    throw wrapWasmError(error, "batch extracting from bytes");
  }
}
function batchExtractBytesSync(files, config) {
  if (!isInitialized2()) {
    throw new Error("WASM module not initialized. Call initWasm() first.");
  }
  const wasm2 = getWasmModule2();
  try {
    if (!Array.isArray(files)) {
      throw new Error("Files parameter must be an array");
    }
    if (files.length === 0) {
      throw new Error("Files array cannot be empty");
    }
    const dataList = [];
    const mimeTypes = [];
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      if (!file || typeof file !== "object") {
        throw new Error(`Invalid file at index ${i}: must be an object with data and mimeType`);
      }
      const f = file;
      if (!(f.data instanceof Uint8Array)) {
        throw new Error(`Invalid file at index ${i}: data must be Uint8Array`);
      }
      if (typeof f.mimeType !== "string") {
        throw new Error(`Invalid file at index ${i}: mimeType must be a string`);
      }
      if (f.data.length === 0) {
        throw new Error(`Invalid file at index ${i}: data cannot be empty`);
      }
      dataList.push(f.data);
      mimeTypes.push(f.mimeType);
    }
    const normalizedConfig = configToJS(config ?? null);
    const results = wasm2.batchExtractBytesSync(dataList, mimeTypes, normalizedConfig);
    if (!Array.isArray(results)) {
      throw new Error("Invalid batch extraction result: expected array");
    }
    return results.map((result, index) => {
      if (!result) {
        throw new Error(`Invalid extraction result at index ${index}: no result from WASM module`);
      }
      return jsToExtractionResult(result);
    });
  } catch (error) {
    throw wrapWasmError(error, "batch extracting from bytes (sync)");
  }
}
async function batchExtractFiles(files, config) {
  if (!isInitialized2()) {
    throw new Error("WASM module not initialized. Call initWasm() first.");
  }
  try {
    if (!Array.isArray(files)) {
      throw new Error("Files parameter must be an array");
    }
    if (files.length === 0) {
      throw new Error("Files array cannot be empty");
    }
    const byteFiles = [];
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      if (!(file instanceof File)) {
        throw new Error(`Invalid file at index ${i}: must be a File object`);
      }
      const bytes = await fileToUint8Array(file);
      byteFiles.push({
        data: bytes,
        mimeType: file.type || "application/octet-stream"
      });
    }
    return await batchExtractBytes(byteFiles, config);
  } catch (error) {
    throw wrapWasmError(error, "batch extracting from files");
  }
}

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

// typescript/ocr/tesseract-wasm-backend.ts
var TesseractWasmBackend = class {
  /** Tesseract WASM client instance */
  client = null;
  /** Track which models are currently loaded to avoid redundant loads */
  loadedLanguages = /* @__PURE__ */ new Set();
  /** Cache for language availability validation */
  supportedLangsCache = null;
  /** Progress callback for UI updates */
  progressCallback = null;
  /** Base URL for training data CDN */
  CDN_BASE_URL = "https://cdn.jsdelivr.net/npm/tesseract-wasm@0.11.0/dist";
  /**
   * Return the unique name of this OCR backend
   *
   * @returns Backend identifier "tesseract-wasm"
   */
  name() {
    return "tesseract-wasm";
  }
  /**
   * Return list of supported language codes
   *
   * Returns a curated list of commonly available Tesseract language models.
   * Tesseract supports many more languages through custom models.
   *
   * @returns Array of ISO 639-1/2/3 language codes
   */
  supportedLanguages() {
    if (this.supportedLangsCache) {
      return this.supportedLangsCache;
    }
    this.supportedLangsCache = [
      "eng",
      "deu",
      "fra",
      "spa",
      "ita",
      "por",
      "nld",
      "rus",
      "jpn",
      "kor",
      "chi_sim",
      "chi_tra",
      "pol",
      "tur",
      "swe",
      "dan",
      "fin",
      "nor",
      "ces",
      "slk",
      "ron",
      "hun",
      "hrv",
      "srp",
      "bul",
      "ukr",
      "ell",
      "ara",
      "heb",
      "hin",
      "tha",
      "vie",
      "mkd",
      "ben",
      "tam",
      "tel",
      "kan",
      "mal",
      "mya",
      "khm",
      "lao",
      "sin"
    ];
    return this.supportedLangsCache;
  }
  /**
   * Initialize the OCR backend
   *
   * Creates the Tesseract WASM client instance. This is called once when
   * the backend is registered with the extraction pipeline.
   *
   * The actual model loading happens in processImage() on-demand to avoid
   * loading all models upfront.
   *
   * @throws {Error} If tesseract-wasm is not available or initialization fails
   *
   * @example
   * ```typescript
   * const backend = new TesseractWasmBackend();
   * try {
   *   await backend.initialize();
   * } catch (error) {
   *   console.error('Failed to initialize OCR:', error);
   * }
   * ```
   */
  async initialize() {
    if (this.client) {
      return;
    }
    try {
      const tesseractModule = await this.loadTesseractWasm();
      if (!tesseractModule || typeof tesseractModule.OCRClient !== "function") {
        throw new Error("tesseract-wasm OCRClient not found. Ensure tesseract-wasm is installed and available.");
      }
      this.client = new tesseractModule.OCRClient();
      this.loadedLanguages.clear();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to initialize TesseractWasmBackend: ${message}`);
    }
  }
  /**
   * Process image bytes and extract text via OCR
   *
   * Handles image loading, model loading, OCR processing, and result formatting.
   * Automatically loads the language model on first use and caches it for subsequent calls.
   *
   * @param imageBytes - Raw image data (Uint8Array) or Base64-encoded string
   * @param language - ISO 639-2/3 language code (e.g., "eng", "deu")
   * @returns Promise resolving to OCR result with content and metadata
   * @throws {Error} If image processing fails, model loading fails, or language is unsupported
   *
   * @example
   * ```typescript
   * const backend = new TesseractWasmBackend();
   * await backend.initialize();
   *
   * const imageBuffer = fs.readFileSync('scanned.png');
   * const result = await backend.processImage(
   *   new Uint8Array(imageBuffer),
   *   'eng'
   * );
   *
   * console.log(result.content); // Extracted text
   * console.log(result.metadata.confidence); // OCR confidence score
   * ```
   */
  async processImage(imageBytes, language) {
    if (!this.client) {
      throw new Error("TesseractWasmBackend not initialized. Call initialize() first.");
    }
    const supported = this.supportedLanguages();
    const normalizedLang = language.toLowerCase();
    const isSupported = supported.some((lang) => lang.toLowerCase() === normalizedLang);
    if (!isSupported) {
      throw new Error(`Language "${language}" is not supported. Supported languages: ${supported.join(", ")}`);
    }
    try {
      if (!this.loadedLanguages.has(normalizedLang)) {
        this.reportProgress(10);
        await this.loadLanguageModel(normalizedLang);
        this.loadedLanguages.add(normalizedLang);
        this.reportProgress(30);
      }
      this.reportProgress(40);
      const imageBitmap = await this.convertToImageBitmap(imageBytes);
      this.reportProgress(50);
      await this.client.loadImage(imageBitmap);
      this.reportProgress(70);
      const text = await this.client.getText();
      const confidence = await this.getConfidenceScore();
      const pageMetadata = await this.getPageMetadata();
      this.reportProgress(90);
      return {
        content: text,
        mime_type: "text/plain",
        metadata: {
          language: normalizedLang,
          confidence,
          ...pageMetadata
        },
        tables: []
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`OCR processing failed for language "${language}": ${message}`);
    } finally {
      this.reportProgress(100);
    }
  }
  /**
   * Shutdown the OCR backend and release resources
   *
   * Properly cleans up the Tesseract WASM client, freeing memory and Web Workers.
   * Called when the backend is unregistered or the application shuts down.
   *
   * @throws {Error} If cleanup fails (errors are logged but not critical)
   *
   * @example
   * ```typescript
   * const backend = new TesseractWasmBackend();
   * await backend.initialize();
   * // ... use backend ...
   * await backend.shutdown(); // Clean up resources
   * ```
   */
  async shutdown() {
    try {
      if (this.client) {
        if (typeof this.client.destroy === "function") {
          this.client.destroy();
        }
        if (typeof this.client.terminate === "function") {
          this.client.terminate();
        }
        this.client = null;
      }
      this.loadedLanguages.clear();
      this.supportedLangsCache = null;
      this.progressCallback = null;
    } catch (error) {
      console.warn(
        `Warning during TesseractWasmBackend shutdown: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  /**
   * Set a progress callback for UI updates
   *
   * Allows the UI to display progress during OCR processing.
   * The callback will be called with values from 0 to 100.
   *
   * @param callback - Function to call with progress percentage
   *
   * @example
   * ```typescript
   * const backend = new TesseractWasmBackend();
   * backend.setProgressCallback((progress) => {
   *   console.log(`OCR Progress: ${progress}%`);
   *   document.getElementById('progress-bar').style.width = `${progress}%`;
   * });
   * ```
   */
  setProgressCallback(callback) {
    this.progressCallback = callback;
  }
  /**
   * Load language model from CDN
   *
   * Fetches the training data for a specific language from jsDelivr CDN.
   * This is an MVP approach - models are cached by the browser.
   *
   * @param language - ISO 639-2/3 language code
   * @throws {Error} If model download fails or language is not available
   *
   * @internal
   */
  async loadLanguageModel(language) {
    if (!this.client) {
      throw new Error("Client not initialized");
    }
    const modelFilename = `${language}.traineddata`;
    const modelUrl = `${this.CDN_BASE_URL}/${modelFilename}`;
    try {
      await this.client.loadModel(modelUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to load model for language "${language}" from ${modelUrl}: ${message}`);
    }
  }
  /**
   * Convert image bytes or Base64 string to ImageBitmap
   *
   * Handles both Uint8Array and Base64-encoded image data, converting to
   * ImageBitmap format required by Tesseract WASM.
   *
   * @param imageBytes - Image data as Uint8Array or Base64 string
   * @returns Promise resolving to ImageBitmap
   * @throws {Error} If conversion fails (browser API not available or invalid image data)
   *
   * @internal
   */
  async convertToImageBitmap(imageBytes) {
    if (typeof createImageBitmap === "undefined") {
      throw new Error("createImageBitmap is not available. TesseractWasmBackend requires a browser environment.");
    }
    try {
      let bytes = imageBytes;
      if (typeof imageBytes === "string") {
        const binaryString = atob(imageBytes);
        bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
      }
      const blob = new Blob([bytes]);
      const imageBitmap = await createImageBitmap(blob);
      return imageBitmap;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to convert image bytes to ImageBitmap: ${message}`);
    }
  }
  /**
   * Get confidence score from OCR result
   *
   * Attempts to retrieve confidence score from Tesseract.
   * Returns a safe default if unavailable.
   *
   * @returns Confidence score between 0 and 1
   *
   * @internal
   */
  async getConfidenceScore() {
    try {
      if (this.client && typeof this.client.getConfidence === "function") {
        const confidence = await this.client.getConfidence();
        return confidence > 1 ? confidence / 100 : confidence;
      }
    } catch {
    }
    return 0.9;
  }
  /**
   * Get page metadata from OCR result
   *
   * Retrieves additional metadata like image dimensions and processing info.
   *
   * @returns Metadata object (may be empty if unavailable)
   *
   * @internal
   */
  async getPageMetadata() {
    try {
      if (this.client && typeof this.client.getPageMetadata === "function") {
        return await this.client.getPageMetadata();
      }
    } catch {
    }
    return {};
  }
  /**
   * Dynamically load tesseract-wasm module
   *
   * Uses dynamic import to load tesseract-wasm only when needed,
   * avoiding hard dependency in browser environments where it may not be bundled.
   *
   * @returns tesseract-wasm module object
   * @throws {Error} If module cannot be imported
   *
   * @internal
   */
  async loadTesseractWasm() {
    try {
      const module = await import("tesseract-wasm");
      return module;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to import tesseract-wasm. Ensure it is installed via: npm install tesseract-wasm. Error: ${message}`
      );
    }
  }
  /**
   * Report progress to progress callback
   *
   * Internal helper for notifying progress updates during OCR processing.
   *
   * @param progress - Progress percentage (0-100)
   *
   * @internal
   */
  reportProgress(progress) {
    if (this.progressCallback) {
      try {
        this.progressCallback(Math.min(100, Math.max(0, progress)));
      } catch {
      }
    }
  }
};

// typescript/ocr/worker-bridge.ts
var workerHandle = null;
var pendingRequests = /* @__PURE__ */ new Map();
var nextRequestId = 0;
var workerReady = false;
var readyResolve = null;
var readyReject = null;
var useFallback = false;
var fallbackFn = null;
async function cleanupWorker() {
  if (workerHandle) {
    await workerHandle.terminate();
    workerHandle = null;
  }
  workerReady = false;
}
function handleWorkerMessage(msg) {
  switch (msg["type"]) {
    case "ready":
      workerReady = true;
      readyResolve?.();
      readyResolve = null;
      readyReject = null;
      break;
    case "init-error":
      readyReject?.(new Error(msg["error"]));
      readyResolve = null;
      readyReject = null;
      break;
    case "result": {
      const id = msg["id"];
      const pending = pendingRequests.get(id);
      if (pending) {
        pendingRequests.delete(id);
        pending.resolve(msg["text"]);
      }
      break;
    }
    case "error": {
      const id = msg["id"];
      const pending = pendingRequests.get(id);
      if (pending) {
        pendingRequests.delete(id);
        pending.reject(new Error(msg["error"]));
      }
      break;
    }
  }
}
async function createOcrWorker(wasmGluePath, wasmBinary, directFallback) {
  fallbackFn = directFallback;
  if (workerHandle) return;
  const readyPromise = new Promise((resolve, reject) => {
    readyResolve = resolve;
    readyReject = reject;
  });
  try {
    if (isNode()) {
      await createNodeWorker(wasmGluePath, wasmBinary);
    } else if (typeof Worker !== "undefined") {
      await createBrowserWorker(wasmGluePath, wasmBinary);
    } else {
      useFallback = true;
      return;
    }
    const timeoutMs = 3e4;
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("OCR worker initialization timed out")), timeoutMs);
    });
    await Promise.race([readyPromise, timeout]);
  } catch {
    await cleanupWorker();
    useFallback = true;
  }
}
async function createNodeWorker(wasmGluePath, wasmBinary) {
  const { Worker: Worker2 } = await import(
    /* @vite-ignore */
    "worker_threads"
  );
  const nodePath = await import(
    /* @vite-ignore */
    "path"
  );
  const nodeUrl = await import(
    /* @vite-ignore */
    "url"
  );
  const __dirname = nodePath.dirname(nodeUrl.fileURLToPath(import.meta.url));
  const workerPath = nodePath.join(__dirname, "ocr-worker.js");
  const worker = new Worker2(workerPath, {
    workerData: { wasmGluePath, wasmBinary }
  });
  worker.on("message", (msg) => handleWorkerMessage(msg));
  worker.on("error", (err) => {
    for (const pending of pendingRequests.values()) {
      pending.reject(err);
    }
    pendingRequests.clear();
    readyReject?.(err);
  });
  workerHandle = {
    postMessage: (data) => worker.postMessage(data),
    terminate: () => worker.terminate()
  };
}
async function createBrowserWorker(wasmGluePath, wasmBinary) {
  const workerUrl = new URL("./ocr-worker.js", import.meta.url);
  const worker = new Worker(workerUrl, { type: "module" });
  worker.onmessage = (e) => handleWorkerMessage(e.data);
  worker.onerror = (e) => {
    const err = new Error(e.message);
    for (const pending of pendingRequests.values()) {
      pending.reject(err);
    }
    pendingRequests.clear();
    readyReject?.(err);
  };
  workerHandle = {
    postMessage: (data) => worker.postMessage(data),
    terminate: () => worker.terminate()
  };
  worker.postMessage({
    type: "init",
    wasmGluePath,
    wasmBinary
  });
}
function runOcrInWorker(imageData, tessdata, language) {
  if (useFallback || !workerHandle || !workerReady) {
    if (fallbackFn) {
      try {
        const text = fallbackFn(imageData, tessdata, language);
        return Promise.resolve(text);
      } catch (e) {
        return Promise.reject(e instanceof Error ? e : new Error(String(e)));
      }
    }
    return Promise.reject(new Error("OCR worker not initialized and no fallback available"));
  }
  const id = nextRequestId++;
  return new Promise((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject });
    workerHandle.postMessage({
      type: "ocr",
      id,
      imageData,
      tessdata,
      language
    });
  });
}
async function terminateOcrWorker() {
  if (workerHandle) {
    await workerHandle.terminate();
    workerHandle = null;
  }
  workerReady = false;
  useFallback = false;
  fallbackFn = null;
  for (const pending of pendingRequests.values()) {
    pending.reject(new Error("OCR worker terminated"));
  }
  pendingRequests.clear();
}

// typescript/ocr/enabler.ts
var TESSDATA_CDN_BASE = "https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main";
var NativeWasmOcrBackend = class {
  tessdataCache = /* @__PURE__ */ new Map();
  tessdataCdnBase = TESSDATA_CDN_BASE;
  progressCallback = null;
  name() {
    return "kreuzberg-tesseract";
  }
  supportedLanguages() {
    return [
      "eng",
      "deu",
      "fra",
      "spa",
      "ita",
      "por",
      "nld",
      "rus",
      "jpn",
      "kor",
      "chi_sim",
      "chi_tra",
      "pol",
      "tur",
      "swe",
      "dan",
      "fin",
      "nor",
      "ces",
      "slk",
      "ron",
      "hun",
      "hrv",
      "srp",
      "bul",
      "ukr",
      "ell",
      "ara",
      "heb",
      "hin",
      "tha",
      "vie",
      "mkd",
      "ben",
      "tam",
      "tel",
      "kan",
      "mal",
      "mya",
      "khm",
      "lao",
      "sin"
    ];
  }
  async initialize() {
    const wasm2 = getWasmModule();
    if (!wasm2?.ocrIsAvailable || !wasm2.ocrIsAvailable()) {
      throw new Error(
        "Native WASM OCR is not available. Build with the 'ocr-wasm' feature to enable kreuzberg-tesseract."
      );
    }
    let wasmGluePath;
    let wasmBinary;
    if (isNode()) {
      const nodePath = await import(
        /* @vite-ignore */
        "path"
      );
      const nodeUrl = await import(
        /* @vite-ignore */
        "url"
      );
      const nodeFs = await import(
        /* @vite-ignore */
        "fs/promises"
      );
      const __dirname = nodePath.dirname(nodeUrl.fileURLToPath(import.meta.url));
      wasmGluePath = nodePath.join(__dirname, "..", "pkg", "kreuzberg_wasm.js");
      try {
        const wasmPath = nodePath.join(__dirname, "..", "pkg", "kreuzberg_wasm_bg.wasm");
        const buf = await nodeFs.readFile(wasmPath);
        wasmBinary = new Uint8Array(buf);
      } catch {
      }
    } else {
      wasmGluePath = new URL("./pkg/kreuzberg_wasm.js", import.meta.url).href;
    }
    const directFallback = (imageData, tessdata, language) => {
      if (!wasm2.ocrRecognize) throw new Error("ocrRecognize not available");
      return wasm2.ocrRecognize(imageData, tessdata, language);
    };
    await createOcrWorker(wasmGluePath, wasmBinary, directFallback);
  }
  async shutdown() {
    this.tessdataCache.clear();
    this.progressCallback = null;
    await terminateOcrWorker();
  }
  setProgressCallback(callback) {
    this.progressCallback = callback;
  }
  async processImage(imageBytes, language) {
    const normalizedLang = language.toLowerCase();
    this.reportProgress(10);
    const tessdata = await this.getTessdata(normalizedLang);
    this.reportProgress(40);
    let imageData;
    if (typeof imageBytes === "string") {
      const binaryString = atob(imageBytes);
      imageData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        imageData[i] = binaryString.charCodeAt(i);
      }
    } else {
      imageData = imageBytes;
    }
    this.reportProgress(50);
    const text = await runOcrInWorker(imageData, tessdata, normalizedLang);
    this.reportProgress(90);
    return {
      content: text,
      mime_type: "text/plain",
      metadata: { language: normalizedLang },
      tables: []
    };
  }
  async getTessdata(language) {
    const cached = this.tessdataCache.get(language);
    if (cached) {
      return cached;
    }
    const url = `${this.tessdataCdnBase}/${language}.traineddata`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download tessdata for "${language}" from ${url}: ${response.status}`);
    }
    const data = new Uint8Array(await response.arrayBuffer());
    this.tessdataCache.set(language, data);
    return data;
  }
  reportProgress(progress) {
    if (this.progressCallback) {
      try {
        this.progressCallback(Math.min(100, Math.max(0, progress)));
      } catch {
      }
    }
  }
};
async function enableOcr() {
  if (!isInitialized2()) {
    throw new Error("WASM module not initialized. Call initWasm() first.");
  }
  try {
    const wasm2 = getWasmModule();
    if (wasm2?.ocrIsAvailable?.()) {
      const backend = new NativeWasmOcrBackend();
      await backend.initialize();
      registerOcrBackend(backend);
      registerBackendInRustRegistry(wasm2, backend);
      return;
    }
    if (isBrowser()) {
      const backend = new TesseractWasmBackend();
      await backend.initialize();
      registerOcrBackend(backend);
      registerBackendInRustRegistry(wasm2, backend);
      return;
    }
    throw new Error(
      "No OCR backend available. Build with the 'ocr-wasm' feature to enable native Tesseract OCR in all environments, or use a browser environment with the tesseract-wasm npm package."
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to enable OCR: ${message}`);
  }
}
function registerBackendInRustRegistry(wasm2, backend) {
  const registerFn = wasm2?.register_ocr_backend;
  if (!registerFn) {
    return;
  }
  const rustAdapter = {
    name: () => "tesseract",
    supportedLanguages: () => backend.supportedLanguages?.() ?? ["eng"],
    processImage: async (imageBase64, language) => {
      const result = await backend.processImage(imageBase64, language);
      return typeof result === "string" ? result : JSON.stringify(result);
    }
  };
  try {
    registerFn(rustAdapter);
  } catch {
  }
}

// typescript/plugin-registry.ts
var postProcessors = /* @__PURE__ */ new Map();
var validators = /* @__PURE__ */ new Map();
function validatePostProcessor(processor) {
  if (processor === null || processor === void 0) {
    throw new Error("Post-processor cannot be null or undefined");
  }
  const obj = processor;
  if (typeof obj.name !== "function") {
    throw new Error("Post-processor must implement name() method");
  }
  if (typeof obj.process !== "function") {
    throw new Error("Post-processor must implement process() method");
  }
  const name = obj.name();
  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Post-processor name must be a non-empty string");
  }
  return true;
}
function registerPostProcessor(processor) {
  validatePostProcessor(processor);
  const name = processor.name();
  if (postProcessors.has(name)) {
    console.warn(`Post-processor "${name}" already registered, overwriting with new implementation`);
  }
  postProcessors.set(name, processor);
}
function getPostProcessor(name) {
  return postProcessors.get(name);
}
function listPostProcessors() {
  return Array.from(postProcessors.keys());
}
async function unregisterPostProcessor(name) {
  const processor = postProcessors.get(name);
  if (!processor) {
    const available = Array.from(postProcessors.keys());
    const availableStr = available.length > 0 ? ` Available: ${available.join(", ")}` : "";
    throw new Error(`Post-processor "${name}" is not registered.${availableStr}`);
  }
  try {
    if (processor.shutdown) {
      await processor.shutdown();
    }
  } catch (error) {
    console.warn(`Error during shutdown of post-processor "${name}":`, error);
  }
  postProcessors.delete(name);
}
async function clearPostProcessors() {
  const entries = Array.from(postProcessors.entries());
  for (const [_name, processor] of entries) {
    try {
      if (processor.shutdown) {
        await processor.shutdown();
      }
    } catch (error) {
      console.warn(`Error during shutdown of post-processor "${_name}":`, error);
    }
  }
  postProcessors.clear();
}
function validateValidator(validator) {
  if (validator === null || validator === void 0) {
    throw new Error("Validator cannot be null or undefined");
  }
  const obj = validator;
  if (typeof obj.name !== "function") {
    throw new Error("Validator must implement name() method");
  }
  if (typeof obj.validate !== "function") {
    throw new Error("Validator must implement validate() method");
  }
  const name = obj.name();
  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Validator name must be a non-empty string");
  }
  return true;
}
function registerValidator(validator) {
  validateValidator(validator);
  const name = validator.name();
  if (validators.has(name)) {
    console.warn(`Validator "${name}" already registered, overwriting with new implementation`);
  }
  validators.set(name, validator);
}
function getValidator(name) {
  return validators.get(name);
}
function listValidators() {
  return Array.from(validators.keys());
}
async function unregisterValidator(name) {
  const validator = validators.get(name);
  if (!validator) {
    const available = Array.from(validators.keys());
    const availableStr = available.length > 0 ? ` Available: ${available.join(", ")}` : "";
    throw new Error(`Validator "${name}" is not registered.${availableStr}`);
  }
  try {
    if (validator.shutdown) {
      await validator.shutdown();
    }
  } catch (error) {
    console.warn(`Error during shutdown of validator "${name}":`, error);
  }
  validators.delete(name);
}
async function clearValidators() {
  const entries = Array.from(validators.entries());
  for (const [_name, validator] of entries) {
    try {
      if (validator.shutdown) {
        await validator.shutdown();
      }
    } catch (error) {
      console.warn(`Error during shutdown of validator "${_name}":`, error);
    }
  }
  validators.clear();
}
function executePostProcessor(name, result) {
  const processor = postProcessors.get(name);
  if (!processor) {
    return Promise.reject(new Error(`Post-processor "${name}" is not registered`));
  }
  try {
    const output = processor.process(result);
    if (output instanceof Promise) {
      return output;
    }
    return Promise.resolve(output);
  } catch (error) {
    return Promise.reject(new Error(`Error executing post-processor "${name}": ${String(error)}`));
  }
}
function executeValidator(name, result) {
  const validator = validators.get(name);
  if (!validator) {
    return Promise.reject(new Error(`Validator "${name}" is not registered`));
  }
  try {
    const output = validator.validate(result);
    if (output instanceof Promise) {
      return output;
    }
    return Promise.resolve(output);
  } catch (error) {
    return Promise.reject(new Error(`Error executing validator "${name}": ${String(error)}`));
  }
}
function setupGlobalCallbacks() {
  if (typeof globalThis !== "undefined") {
    const callbacksObj = globalThis;
    callbacksObj.__kreuzberg_execute_post_processor = executePostProcessor;
    callbacksObj.__kreuzberg_execute_validator = executeValidator;
  }
}
setupGlobalCallbacks();

// typescript/mime/utilities.ts
function detectMimeFromBytes(data) {
  if (!isInitialized2()) {
    throw new Error("WASM module not initialized. Call initWasm() first.");
  }
  const wasm2 = getWasmModule2();
  try {
    return wasm2.detectMimeFromBytes(data);
  } catch (error) {
    throw wrapWasmError(error, "detecting MIME type from bytes");
  }
}
function getExtensionsForMime(mimeType) {
  if (!isInitialized2()) {
    throw new Error("WASM module not initialized. Call initWasm() first.");
  }
  const wasm2 = getWasmModule2();
  try {
    return wasm2.getExtensionsForMime(mimeType);
  } catch (error) {
    throw wrapWasmError(error, "getting extensions for MIME type");
  }
}
export {
  TesseractWasmBackend,
  batchExtractBytes,
  batchExtractBytesSync,
  batchExtractFiles,
  clearOcrBackends,
  clearPostProcessors,
  clearValidators,
  configToJS,
  detectMimeFromBytes,
  detectRuntime,
  enableOcr,
  extractBytes,
  extractBytesSync,
  extractFile,
  extractFromFile,
  fileToUint8Array,
  getExtensionsForMime,
  getInitializationError,
  getOcrBackend,
  getPostProcessor,
  getRuntimeInfo,
  getRuntimeVersion,
  getValidator,
  getVersion,
  getWasmCapabilities,
  getWasmModule,
  hasBigInt,
  hasBlob,
  hasFileApi,
  hasModuleWorkers,
  hasSharedArrayBuffer,
  hasWasm,
  hasWasmStreaming,
  hasWorkers,
  initWasm,
  initializePdfiumAsync,
  isBrowser,
  isBun,
  isCloudflareWorkers,
  isDeno,
  isEdgeEnvironment,
  isEdgeRuntime,
  isInitialized,
  isNode,
  isServerEnvironment,
  isValidExtractionResult,
  isWebEnvironment,
  jsToExtractionResult,
  listOcrBackends,
  listPostProcessors,
  listValidators,
  registerOcrBackend,
  registerPostProcessor,
  registerValidator,
  unregisterOcrBackend,
  unregisterPostProcessor,
  unregisterValidator,
  wrapWasmError
};
//# sourceMappingURL=index.js.map