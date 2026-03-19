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
  const document = result.document ?? null;
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
    document,
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
export {
  configToJS,
  fileToUint8Array,
  isValidExtractionResult,
  jsToExtractionResult,
  wrapWasmError
};
//# sourceMappingURL=wasm-adapter.js.map