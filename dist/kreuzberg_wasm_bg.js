/**
 * Get information about the WASM module
 */
export class ModuleInfo {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ModuleInfo.prototype);
        obj.__wbg_ptr = ptr;
        ModuleInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ModuleInfoFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_moduleinfo_free(ptr, 0);
    }
    /**
     * Get the module name
     * @returns {string}
     */
    name() {
        const ret = wasm.moduleinfo_name(this.__wbg_ptr);
        var v1 = getCachedStringFromWasm0(ret[0], ret[1]);
        if (ret[0] !== 0) { wasm.__wbindgen_free_command_export(ret[0], ret[1], 1); }
        return v1;
    }
    /**
     * Get the module version
     * @returns {string}
     */
    version() {
        const ret = wasm.moduleinfo_version(this.__wbg_ptr);
        var v1 = getCachedStringFromWasm0(ret[0], ret[1]);
        if (ret[0] !== 0) { wasm.__wbindgen_free_command_export(ret[0], ret[1], 1); }
        return v1;
    }
}
if (Symbol.dispose) ModuleInfo.prototype[Symbol.dispose] = ModuleInfo.prototype.free;

/**
 * Batch extract from multiple byte arrays (asynchronous).
 *
 * Asynchronously processes multiple document byte arrays in parallel.
 * Non-blocking alternative to `batchExtractBytesSync`.
 *
 * # JavaScript Parameters
 *
 * * `dataList: Uint8Array[]` - Array of document bytes
 * * `mimeTypes: string[]` - Array of MIME types (must match dataList length)
 * * `config?: object` - Optional extraction configuration (applied to all)
 *
 * # Returns
 *
 * `Promise<object[]>` - Promise resolving to array of ExtractionResults
 *
 * # Throws
 *
 * Rejects if dataList and mimeTypes lengths don't match.
 *
 * # Example
 *
 * ```javascript
 * import { batchExtractBytes } from '@kreuzberg/wasm';
 *
 * const responses = await Promise.all([
 *   fetch('doc1.pdf'),
 *   fetch('doc2.docx')
 * ]);
 *
 * const buffers = await Promise.all(
 *   responses.map(r => r.arrayBuffer().then(b => new Uint8Array(b)))
 * );
 *
 * const results = await batchExtractBytes(
 *   buffers,
 *   ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
 *   null
 * );
 * ```
 * @param {Uint8Array[]} data_list
 * @param {string[]} mime_types
 * @param {any | null} [config]
 * @returns {Promise<any>}
 */
export function batchExtractBytes(data_list, mime_types, config) {
    const ptr0 = passArrayJsValueToWasm0(data_list, wasm.__wbindgen_malloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayJsValueToWasm0(mime_types, wasm.__wbindgen_malloc_command_export);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.batchExtractBytes(ptr0, len0, ptr1, len1, isLikeNone(config) ? 0 : addToExternrefTable0(config));
    return ret;
}

/**
 * Batch extract from multiple byte arrays (synchronous).
 *
 * Processes multiple document byte arrays in parallel. All documents use the
 * same extraction configuration.
 *
 * # JavaScript Parameters
 *
 * * `dataList: Uint8Array[]` - Array of document bytes
 * * `mimeTypes: string[]` - Array of MIME types (must match dataList length)
 * * `config?: object` - Optional extraction configuration (applied to all)
 *
 * # Returns
 *
 * `object[]` - Array of ExtractionResults in the same order as inputs
 *
 * # Throws
 *
 * Throws if dataList and mimeTypes lengths don't match.
 *
 * # Example
 *
 * ```javascript
 * import { batchExtractBytesSync } from '@kreuzberg/wasm';
 *
 * const buffers = [buffer1, buffer2, buffer3];
 * const mimeTypes = ['application/pdf', 'text/plain', 'image/png'];
 * const results = batchExtractBytesSync(buffers, mimeTypes, null);
 *
 * results.forEach((result, i) => {
 *   console.log(`Document ${i}: ${result.content.substring(0, 50)}...`);
 * });
 * ```
 * @param {Uint8Array[]} data_list
 * @param {string[]} mime_types
 * @param {any | null} [config]
 * @returns {any}
 */
export function batchExtractBytesSync(data_list, mime_types, config) {
    const ptr0 = passArrayJsValueToWasm0(data_list, wasm.__wbindgen_malloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayJsValueToWasm0(mime_types, wasm.__wbindgen_malloc_command_export);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.batchExtractBytesSync(ptr0, len0, ptr1, len1, isLikeNone(config) ? 0 : addToExternrefTable0(config));
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Batch extract from multiple Files or Blobs (asynchronous).
 *
 * Processes multiple web File or Blob objects in parallel using the FileReader API.
 * Only available in browser environments (FileReader API limitation).
 * For server-side environments, use `batchExtractBytes` with file data converted to Uint8Array.
 *
 * # JavaScript Parameters
 *
 * * `files: (File | Blob)[]` - Array of files or blobs to extract
 * * `config?: object` - Optional extraction configuration (applied to all)
 *
 * # Returns
 *
 * `Promise<object[]>` - Promise resolving to array of ExtractionResults
 *
 * # Example
 *
 * ```javascript
 * import { batchExtractFiles } from '@kreuzberg/wasm';
 *
 * // From file input with multiple files
 * const fileInput = document.getElementById('file-input');
 * const files = Array.from(fileInput.files);
 *
 * const results = await batchExtractFiles(files, null);
 * console.log(`Processed ${results.length} files`);
 * ```
 * @param {File[]} files
 * @param {any | null} [config]
 * @returns {Promise<any>}
 */
export function batchExtractFiles(files, config) {
    const ptr0 = passArrayJsValueToWasm0(files, wasm.__wbindgen_malloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.batchExtractFiles(ptr0, len0, isLikeNone(config) ? 0 : addToExternrefTable0(config));
    return ret;
}

/**
 * Batch extract from multiple files (synchronous) - NOT AVAILABLE IN WASM.
 *
 * File system operations are not available in WebAssembly environments.
 * Use `batchExtractBytesSync` or `batchExtractBytes` instead.
 *
 * # Throws
 *
 * Always throws: "File operations are not available in WASM. Use batchExtractBytesSync or batchExtractBytes instead."
 * @returns {any}
 */
export function batchExtractFilesSync() {
    const ret = wasm.batchExtractFilesSync();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Clear all registered OCR backends.
 *
 * # Returns
 *
 * Ok if clearing succeeds, Err if an error occurs.
 *
 * # Example
 *
 * ```javascript
 * clearOcrBackends();
 * ```
 */
export function clear_ocr_backends() {
    const ret = wasm.clear_ocr_backends();
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Clear all registered post-processors.
 *
 * # Returns
 *
 * Ok if clearing succeeds, Err if an error occurs.
 *
 * # Example
 *
 * ```javascript
 * clearPostProcessors();
 * ```
 */
export function clear_post_processors() {
    const ret = wasm.clear_post_processors();
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Clear all registered validators.
 *
 * # Returns
 *
 * Ok if clearing succeeds, Err if an error occurs.
 *
 * # Example
 *
 * ```javascript
 * clearValidators();
 * ```
 */
export function clear_validators() {
    const ret = wasm.clear_validators();
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Compresses multiple entries into a 7z archive in WebAssembly environment.
 *
 * This function creates a compressed archive from multiple file entries,
 * designed specifically for WASM targets.
 *
 * # Arguments
 * * `entries` - Vector of JavaScript strings representing file names/paths
 * * `datas` - Vector of Uint8Arrays containing the file data corresponding to entries
 * @param {string[]} entries
 * @param {Uint8Array[]} datas
 * @returns {Uint8Array}
 */
export function compress(entries, datas) {
    const ptr0 = passArrayJsValueToWasm0(entries, wasm.__wbindgen_malloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayJsValueToWasm0(datas, wasm.__wbindgen_malloc_command_export);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.compress(ptr0, len0, ptr1, len1);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Decompresses a 7z archive in WebAssembly environment.
 *
 * This function is specifically designed for WASM targets and uses JavaScript interop
 * to handle the decompression process with a callback function.
 *
 * # Arguments
 * * `src` - Uint8Array containing the compressed archive data
 * * `pwd` - Password string for encrypted archives (use empty string for unencrypted)
 * * `f` - JavaScript callback function to handle extracted entries
 * @param {Uint8Array} src
 * @param {string} pwd
 * @param {Function} f
 */
export function decompress(src, pwd, f) {
    const ptr0 = passStringToWasm0(pwd, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.decompress(src, ptr0, len0, f);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Detect MIME type from raw file bytes.
 *
 * Uses magic byte signatures and content analysis to detect the MIME type of
 * a document from its binary content. Falls back to text detection if binary
 * detection fails.
 *
 * # JavaScript Parameters
 *
 * * `data: Uint8Array` - The raw file bytes
 *
 * # Returns
 *
 * `string` - The detected MIME type (e.g., "application/pdf", "image/png")
 *
 * # Throws
 *
 * Throws an error if MIME type cannot be determined from the content.
 *
 * # Example
 *
 * ```javascript
 * import { detectMimeFromBytes } from '@kreuzberg/wasm';
 * import { readFileSync } from 'fs';
 *
 * const pdfBytes = readFileSync('document.pdf');
 * const mimeType = detectMimeFromBytes(new Uint8Array(pdfBytes));
 * console.log(mimeType); // "application/pdf"
 * ```
 * @param {Uint8Array} data
 * @returns {string}
 */
export function detectMimeFromBytes(data) {
    const ret = wasm.detectMimeFromBytes(data);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v1 = getCachedStringFromWasm0(ret[0], ret[1]);
    if (ret[0] !== 0) { wasm.__wbindgen_free_command_export(ret[0], ret[1], 1); }
    return v1;
}

/**
 * Discover configuration file in the project hierarchy.
 *
 * In WebAssembly environments, configuration discovery is not available because
 * there is no file system access. This function always returns an error with a
 * descriptive message directing users to use `loadConfigFromString()` instead.
 *
 * # JavaScript Parameters
 *
 * None
 *
 * # Returns
 *
 * Never returns successfully.
 *
 * # Throws
 *
 * Always throws an error with message:
 * "discoverConfig is not available in WebAssembly (no file system access). Use loadConfigFromString() instead."
 *
 * # Example
 *
 * ```javascript
 * import { discoverConfig } from '@kreuzberg/wasm';
 *
 * try {
 *   const config = discoverConfig();
 * } catch (e) {
 *   console.error(e.message);
 *   // "discoverConfig is not available in WebAssembly (no file system access).
 *   // Use loadConfigFromString() instead."
 * }
 * ```
 * @returns {any}
 */
export function discoverConfig() {
    const ret = wasm.discoverConfig();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Extract content from a byte array (asynchronous).
 *
 * Asynchronously extracts text, tables, images, and metadata from a document.
 * Non-blocking alternative to `extractBytesSync` suitable for large documents
 * or browser environments.
 *
 * # JavaScript Parameters
 *
 * * `data: Uint8Array` - The document bytes to extract
 * * `mimeType: string` - MIME type of the data (e.g., "application/pdf")
 * * `config?: object` - Optional extraction configuration
 *
 * # Returns
 *
 * `Promise<object>` - Promise resolving to ExtractionResult
 *
 * # Throws
 *
 * Rejects if data is malformed or MIME type is unsupported.
 *
 * # Example
 *
 * ```javascript
 * import { extractBytes } from '@kreuzberg/wasm';
 *
 * // Fetch from URL
 * const response = await fetch('document.pdf');
 * const arrayBuffer = await response.arrayBuffer();
 * const data = new Uint8Array(arrayBuffer);
 *
 * const result = await extractBytes(data, 'application/pdf', null);
 * console.log(result.content.substring(0, 100));
 * ```
 * @param {Uint8Array} data
 * @param {string} mime_type
 * @param {any | null} [config]
 * @returns {Promise<any>}
 */
export function extractBytes(data, mime_type, config) {
    const ptr0 = passStringToWasm0(mime_type, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.extractBytes(data, ptr0, len0, isLikeNone(config) ? 0 : addToExternrefTable0(config));
    return ret;
}

/**
 * Extract content from a byte array (synchronous).
 *
 * Extracts text, tables, images, and metadata from a document represented as bytes.
 * This is a synchronous, blocking operation suitable for smaller documents or when
 * async execution is not available.
 *
 * # JavaScript Parameters
 *
 * * `data: Uint8Array` - The document bytes to extract
 * * `mimeType: string` - MIME type of the data (e.g., "application/pdf", "image/png")
 * * `config?: object` - Optional extraction configuration
 *
 * # Returns
 *
 * `object` - ExtractionResult with extracted content and metadata
 *
 * # Throws
 *
 * Throws an error if data is malformed or MIME type is unsupported.
 *
 * # Example
 *
 * ```javascript
 * import { extractBytesSync } from '@kreuzberg/wasm';
 * import { readFileSync } from 'fs';
 *
 * const buffer = readFileSync('document.pdf');
 * const data = new Uint8Array(buffer);
 * const result = extractBytesSync(data, 'application/pdf', null);
 * console.log(result.content);
 * ```
 * @param {Uint8Array} data
 * @param {string} mime_type
 * @param {any | null} [config]
 * @returns {any}
 */
export function extractBytesSync(data, mime_type, config) {
    const ptr0 = passStringToWasm0(mime_type, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.extractBytesSync(data, ptr0, len0, isLikeNone(config) ? 0 : addToExternrefTable0(config));
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Extract content from a web File or Blob (asynchronous).
 *
 * Extracts content from a web File (from `<input type="file">`) or Blob object
 * using the FileReader API. Only available in browser environments (FileReader API limitation).
 * For server-side environments, use `extractBytes` with file data converted to Uint8Array.
 *
 * # JavaScript Parameters
 *
 * * `file: File | Blob` - The file or blob to extract
 * * `mimeType?: string` - Optional MIME type hint (auto-detected if omitted)
 * * `config?: object` - Optional extraction configuration
 *
 * # Returns
 *
 * `Promise<object>` - Promise resolving to ExtractionResult
 *
 * # Throws
 *
 * Rejects if file cannot be read or is malformed.
 *
 * # Example
 *
 * ```javascript
 * import { extractFile } from '@kreuzberg/wasm';
 *
 * // From file input
 * const fileInput = document.getElementById('file-input');
 * const file = fileInput.files[0];
 *
 * const result = await extractFile(file, null, null);
 * console.log(`Extracted ${result.content.length} characters`);
 * ```
 * @param {File} file
 * @param {string | null} [mime_type]
 * @param {any | null} [config]
 * @returns {Promise<any>}
 */
export function extractFile(file, mime_type, config) {
    var ptr0 = isLikeNone(mime_type) ? 0 : passStringToWasm0(mime_type, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.extractFile(file, ptr0, len0, isLikeNone(config) ? 0 : addToExternrefTable0(config));
    return ret;
}

/**
 * Extract content from a file (synchronous) - NOT AVAILABLE IN WASM.
 *
 * File system operations are not available in WebAssembly environments.
 * Use `extractBytesSync` or `extractBytes` instead.
 *
 * # Throws
 *
 * Always throws: "File operations are not available in WASM. Use extractBytesSync or extractBytes instead."
 * @returns {any}
 */
export function extractFileSync() {
    const ret = wasm.extractFileSync();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Get file extensions for a given MIME type.
 *
 * Looks up all known file extensions that correspond to the specified MIME type.
 * Returns a JavaScript Array of extension strings (without leading dots).
 *
 * # JavaScript Parameters
 *
 * * `mimeType: string` - The MIME type to look up (e.g., "application/pdf")
 *
 * # Returns
 *
 * `string[]` - Array of file extensions for the MIME type
 *
 * # Throws
 *
 * Throws an error if the MIME type is not recognized.
 *
 * # Example
 *
 * ```javascript
 * import { getExtensionsForMime } from '@kreuzberg/wasm';
 *
 * const pdfExts = getExtensionsForMime('application/pdf');
 * console.log(pdfExts); // ["pdf"]
 *
 * const jpegExts = getExtensionsForMime('image/jpeg');
 * console.log(jpegExts); // ["jpg", "jpeg"]
 * ```
 * @param {string} mime_type
 * @returns {Array<any>}
 */
export function getExtensionsForMime(mime_type) {
    const ptr0 = passStringToWasm0(mime_type, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.getExtensionsForMime(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Get MIME type from file extension.
 *
 * Looks up the MIME type associated with a given file extension.
 * Returns None if the extension is not recognized.
 *
 * # JavaScript Parameters
 *
 * * `extension: string` - The file extension (with or without leading dot)
 *
 * # Returns
 *
 * `string | null` - The MIME type if found, null otherwise
 *
 * # Example
 *
 * ```javascript
 * import { getMimeFromExtension } from '@kreuzberg/wasm';
 *
 * const pdfMime = getMimeFromExtension('pdf');
 * console.log(pdfMime); // "application/pdf"
 *
 * const docMime = getMimeFromExtension('docx');
 * console.log(docMime); // "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
 *
 * const unknownMime = getMimeFromExtension('unknown');
 * console.log(unknownMime); // null
 * ```
 * @param {string} extension
 * @returns {string}
 */
export function getMimeFromExtension(extension) {
    const ptr0 = passStringToWasm0(extension, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.getMimeFromExtension(ptr0, len0);
    var v2 = getCachedStringFromWasm0(ret[0], ret[1]);
    if (ret[0] !== 0) { wasm.__wbindgen_free_command_export(ret[0], ret[1], 1); }
    return v2;
}

/**
 * Get module information
 * @returns {ModuleInfo}
 */
export function get_module_info() {
    const ret = wasm.get_module_info();
    return ModuleInfo.__wrap(ret);
}

/**
 * Initialize the WASM module
 * This function should be called once at application startup
 */
export function init() {
    wasm.init();
}

/**
 * @param {number} _num_threads
 * @returns {Promise<any>}
 */
export function initThreadPool(_num_threads) {
    const ret = wasm.initThreadPool(_num_threads);
    return ret;
}

/**
 * Helper function to initialize the thread pool with error handling
 * Accepts the number of threads to use for the thread pool.
 * Returns true if initialization succeeded, false for graceful degradation.
 *
 * This function wraps init_thread_pool with panic handling to ensure graceful
 * degradation if thread pool initialization fails. The application will continue
 * to work in single-threaded mode if the thread pool cannot be initialized.
 * @param {number} num_threads
 * @returns {boolean}
 */
export function init_thread_pool_safe(num_threads) {
    const ret = wasm.init_thread_pool_safe(num_threads);
    return ret !== 0;
}

/**
 * Establishes a binding between an external Pdfium WASM module and `pdfium-render`'s WASM module.
 * This function should be called from Javascript once the external Pdfium WASM module has been loaded
 * into the browser. It is essential that this function is called _before_ initializing
 * `pdfium-render` from within Rust code. For an example, see:
 * <https://github.com/ajrcarey/pdfium-render/blob/master/examples/index.html>
 * @param {any} pdfium_wasm_module
 * @param {any} local_wasm_module
 * @param {boolean} debug
 * @returns {boolean}
 */
export function initialize_pdfium_render(pdfium_wasm_module, local_wasm_module, debug) {
    const ret = wasm.initialize_pdfium_render(pdfium_wasm_module, local_wasm_module, debug);
    return ret !== 0;
}

/**
 * List all registered OCR backend names.
 *
 * # Returns
 *
 * Array of OCR backend names, or Err if an error occurs.
 *
 * # Example
 *
 * ```javascript
 * const backends = listOcrBackends();
 * console.log(backends); // ["tesseract", "custom-ocr", ...]
 * ```
 * @returns {Array<any>}
 */
export function list_ocr_backends() {
    const ret = wasm.list_ocr_backends();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * List all registered post-processor names.
 *
 * # Returns
 *
 * Array of post-processor names, or Err if an error occurs.
 *
 * # Example
 *
 * ```javascript
 * const processors = listPostProcessors();
 * console.log(processors); // ["my-post-processor", ...]
 * ```
 * @returns {Array<any>}
 */
export function list_post_processors() {
    const ret = wasm.list_post_processors();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * List all registered validator names.
 *
 * # Returns
 *
 * Array of validator names, or Err if an error occurs.
 *
 * # Example
 *
 * ```javascript
 * const validators = listValidators();
 * console.log(validators); // ["min-content-length", ...]
 * ```
 * @returns {Array<any>}
 */
export function list_validators() {
    const ret = wasm.list_validators();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Load configuration from a string in the specified format.
 *
 * Parses configuration content from TOML, YAML, or JSON formats and returns
 * a JavaScript object representing the ExtractionConfig. This is the primary
 * way to load configuration in WebAssembly environments since file system
 * access is not available.
 *
 * # JavaScript Parameters
 *
 * * `content: string` - The configuration content as a string
 * * `format: string` - The format of the content: "toml", "yaml", or "json"
 *
 * # Returns
 *
 * `object` - JavaScript object representing the ExtractionConfig
 *
 * # Throws
 *
 * Throws an error if:
 * - The content is invalid for the specified format
 * - The format is not one of "toml", "yaml", or "json"
 * - Required configuration fields are missing or invalid
 *
 * # Example
 *
 * ```javascript
 * import { loadConfigFromString } from '@kreuzberg/wasm';
 *
 * // Load from TOML string
 * const tomlConfig = `
 * use_cache = true
 * enable_quality_processing = true
 * `;
 * const config1 = loadConfigFromString(tomlConfig, 'toml');
 * console.log(config1.use_cache); // true
 *
 * // Load from YAML string
 * const yamlConfig = `
 * use_cache: true
 * enable_quality_processing: true
 * `;
 * const config2 = loadConfigFromString(yamlConfig, 'yaml');
 *
 * // Load from JSON string
 * const jsonConfig = `{"use_cache": true, "enable_quality_processing": true}`;
 * const config3 = loadConfigFromString(jsonConfig, 'json');
 * ```
 * @param {string} content
 * @param {string} format
 * @returns {any}
 */
export function loadConfigFromString(content, format) {
    const ptr0 = passStringToWasm0(content, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(format, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.loadConfigFromString(ptr0, len0, ptr1, len1);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Normalize a MIME type string.
 *
 * Normalizes a MIME type by converting to lowercase and removing parameters
 * (e.g., "application/json; charset=utf-8" becomes "application/json").
 * This is useful for consistent MIME type comparison.
 *
 * # JavaScript Parameters
 *
 * * `mimeType: string` - The MIME type string to normalize
 *
 * # Returns
 *
 * `string` - The normalized MIME type
 *
 * # Example
 *
 * ```javascript
 * import { normalizeMimeType } from '@kreuzberg/wasm';
 *
 * const normalized1 = normalizeMimeType('Application/JSON');
 * console.log(normalized1); // "application/json"
 *
 * const normalized2 = normalizeMimeType('text/html; charset=utf-8');
 * console.log(normalized2); // "text/html"
 *
 * const normalized3 = normalizeMimeType('Text/Plain; charset=ISO-8859-1');
 * console.log(normalized3); // "text/plain"
 * ```
 * @param {string} mime_type
 * @returns {string}
 */
export function normalizeMimeType(mime_type) {
    const ptr0 = passStringToWasm0(mime_type, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.normalizeMimeType(ptr0, len0);
    var v2 = getCachedStringFromWasm0(ret[0], ret[1]);
    if (ret[0] !== 0) { wasm.__wbindgen_free_command_export(ret[0], ret[1], 1); }
    return v2;
}

/**
 * Check if OCR support is available in this WASM build.
 *
 * Returns `true` if the `ocr-wasm` feature was enabled at build time.
 * @returns {boolean}
 */
export function ocrIsAvailable() {
    const ret = wasm.ocrIsAvailable();
    return ret !== 0;
}

/**
 * Perform OCR on encoded image bytes (PNG, JPEG, BMP, GIF, TIFF).
 *
 * Automatically decodes the image to RGB pixels before running Tesseract.
 * This is the primary function for OCR in WASM - it handles image decoding
 * internally so the caller doesn't need browser APIs like `createImageBitmap`.
 *
 * # Arguments
 *
 * * `image_bytes` - Encoded image data (PNG, JPEG, BMP, GIF, TIFF)
 * * `tessdata` - Raw `.traineddata` file content loaded into memory
 * * `language` - Tesseract language code (e.g., "eng")
 *
 * # Returns
 *
 * The recognized text as a string.
 * @param {Uint8Array} image_bytes
 * @param {Uint8Array} tessdata
 * @param {string} language
 * @returns {string}
 */
export function ocrRecognize(image_bytes, tessdata, language) {
    const ptr0 = passArray8ToWasm0(image_bytes, wasm.__wbindgen_malloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(tessdata, wasm.__wbindgen_malloc_command_export);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(language, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.ocrRecognize(ptr0, len0, ptr1, len1, ptr2, len2);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v4 = getCachedStringFromWasm0(ret[0], ret[1]);
    if (ret[0] !== 0) { wasm.__wbindgen_free_command_export(ret[0], ret[1], 1); }
    return v4;
}

/**
 * Perform OCR on raw image pixel data using Tesseract.
 *
 * This function accepts pre-decoded image pixels (RGB format) along with
 * tessdata loaded into memory. No filesystem access is needed.
 *
 * # Arguments
 *
 * * `image_data` - Raw pixel data in RGB format (3 bytes per pixel)
 * * `width` - Image width in pixels
 * * `height` - Image height in pixels
 * * `bytes_per_pixel` - Bytes per pixel (typically 3 for RGB, 1 for grayscale)
 * * `bytes_per_line` - Bytes per scan line (typically width * bytes_per_pixel)
 * * `tessdata` - Raw `.traineddata` file content loaded into memory
 * * `language` - Tesseract language code (e.g., "eng")
 *
 * # Returns
 *
 * The recognized text as a string.
 * @param {Uint8Array} image_data
 * @param {number} width
 * @param {number} height
 * @param {number} bytes_per_pixel
 * @param {number} bytes_per_line
 * @param {Uint8Array} tessdata
 * @param {string} language
 * @returns {string}
 */
export function ocrRecognizeRaw(image_data, width, height, bytes_per_pixel, bytes_per_line, tessdata, language) {
    const ptr0 = passArray8ToWasm0(image_data, wasm.__wbindgen_malloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(tessdata, wasm.__wbindgen_malloc_command_export);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(language, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.ocrRecognizeRaw(ptr0, len0, width, height, bytes_per_pixel, bytes_per_line, ptr1, len1, ptr2, len2);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v4 = getCachedStringFromWasm0(ret[0], ret[1]);
    if (ret[0] !== 0) { wasm.__wbindgen_free_command_export(ret[0], ret[1], 1); }
    return v4;
}

/**
 * Get the Tesseract version string compiled into this WASM binary.
 *
 * Returns the version of the statically linked Tesseract library.
 * @returns {string}
 */
export function ocrTesseractVersion() {
    const ret = wasm.ocrTesseractVersion();
    var v1 = getCachedStringFromWasm0(ret[0], ret[1]);
    if (ret[0] !== 0) { wasm.__wbindgen_free_command_export(ret[0], ret[1], 1); }
    return v1;
}

/**
 * A callback function that can be invoked by Pdfium's `FPDF_LoadCustomDocument()` function,
 * wrapping around `crate::utils::files::read_block_from_callback()` to shuffle data buffers
 * from our WASM memory heap to Pdfium's WASM memory heap as they are loaded.
 * @param {number} param
 * @param {number} position
 * @param {number} pBuf
 * @param {number} size
 * @returns {number}
 */
export function read_block_from_callback_wasm(param, position, pBuf, size) {
    const ret = wasm.read_block_from_callback_wasm(param, position, pBuf, size);
    return ret;
}

/**
 * Register a custom OCR backend.
 *
 * # Arguments
 *
 * * `backend` - JavaScript object implementing the OcrBackendProtocol interface:
 *   - `name(): string` - Unique backend name
 *   - `supportedLanguages(): string[]` - Array of language codes the backend supports
 *   - `processImage(imageBase64: string, language: string): Promise<string>` - Process image and return JSON result
 *
 * # Returns
 *
 * Ok if registration succeeds, Err with description if it fails.
 *
 * # Example
 *
 * ```javascript
 * registerOcrBackend({
 *   name: () => "custom-ocr",
 *   supportedLanguages: () => ["en", "es", "fr"],
 *   processImage: async (imageBase64, language) => {
 *     const buffer = Buffer.from(imageBase64, "base64");
 *     // Process image with custom OCR engine
 *     const text = await customOcrEngine.recognize(buffer, language);
 *     return JSON.stringify({
 *       content: text,
 *       mime_type: "text/plain",
 *       metadata: {}
 *     });
 *   }
 * });
 * ```
 * @param {any} backend
 */
export function register_ocr_backend(backend) {
    const ret = wasm.register_ocr_backend(backend);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Register a custom post-processor.
 *
 * # Arguments
 *
 * * `processor` - JavaScript object implementing the PostProcessorProtocol interface:
 *   - `name(): string` - Unique processor name
 *   - `process(jsonString: string): Promise<string>` - Process function that takes JSON input
 *   - `processingStage(): "early" | "middle" | "late"` - Optional processing stage (defaults to "middle")
 *
 * # Returns
 *
 * Ok if registration succeeds, Err with description if it fails.
 *
 * # Example
 *
 * ```javascript
 * registerPostProcessor({
 *   name: () => "my-post-processor",
 *   processingStage: () => "middle",
 *   process: async (jsonString) => {
 *     const result = JSON.parse(jsonString);
 *     // Process the extraction result
 *     result.metadata.processed_by = "my-post-processor";
 *     return JSON.stringify(result);
 *   }
 * });
 * ```
 * @param {any} processor
 */
export function register_post_processor(processor) {
    const ret = wasm.register_post_processor(processor);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Register a custom validator.
 *
 * # Arguments
 *
 * * `validator` - JavaScript object implementing the ValidatorProtocol interface:
 *   - `name(): string` - Unique validator name
 *   - `validate(jsonString: string): Promise<string>` - Validation function returning empty string on success, error message on failure
 *   - `priority(): number` - Optional priority (defaults to 50, higher runs first)
 *
 * # Returns
 *
 * Ok if registration succeeds, Err with description if it fails.
 *
 * # Example
 *
 * ```javascript
 * registerValidator({
 *   name: () => "min-content-length",
 *   priority: () => 100,
 *   validate: async (jsonString) => {
 *     const result = JSON.parse(jsonString);
 *     if (result.content.length < 100) {
 *       return "Content too short"; // Validation failure
 *     }
 *     return ""; // Success
 *   }
 * });
 * ```
 * @param {any} validator
 */
export function register_validator(validator) {
    const ret = wasm.register_validator(validator);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Unregister an OCR backend by name.
 *
 * # Arguments
 *
 * * `name` - Name of the OCR backend to unregister
 *
 * # Returns
 *
 * Ok if unregistration succeeds, Err if the backend is not found or other error occurs.
 *
 * # Example
 *
 * ```javascript
 * unregisterOcrBackend("custom-ocr");
 * ```
 * @param {string} name
 */
export function unregister_ocr_backend(name) {
    const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.unregister_ocr_backend(ptr0, len0);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Unregister a post-processor by name.
 *
 * # Arguments
 *
 * * `name` - Name of the post-processor to unregister
 *
 * # Returns
 *
 * Ok if unregistration succeeds, Err if the processor is not found or other error occurs.
 *
 * # Example
 *
 * ```javascript
 * unregisterPostProcessor("my-post-processor");
 * ```
 * @param {string} name
 */
export function unregister_post_processor(name) {
    const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.unregister_post_processor(ptr0, len0);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Unregister a validator by name.
 *
 * # Arguments
 *
 * * `name` - Name of the validator to unregister
 *
 * # Returns
 *
 * Ok if unregistration succeeds, Err if the validator is not found or other error occurs.
 *
 * # Example
 *
 * ```javascript
 * unregisterValidator("min-content-length");
 * ```
 * @param {string} name
 */
export function unregister_validator(name) {
    const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.unregister_validator(ptr0, len0);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Version of the kreuzberg-wasm binding
 * @returns {string}
 */
export function version() {
    const ret = wasm.version();
    var v1 = getCachedStringFromWasm0(ret[0], ret[1]);
    if (ret[0] !== 0) { wasm.__wbindgen_free_command_export(ret[0], ret[1], 1); }
    return v1;
}

/**
 * A callback function that can be invoked by Pdfium's `FPDF_SaveAsCopy()` and `FPDF_SaveWithVersion()`
 * functions, wrapping around `crate::utils::files::write_block_from_callback()` to shuffle data buffers
 * from Pdfium's WASM memory heap to our WASM memory heap as they are written.
 * @param {number} param
 * @param {number} buf
 * @param {number} size
 * @returns {number}
 */
export function write_block_from_callback_wasm(param, buf, size) {
    const ret = wasm.write_block_from_callback_wasm(param, buf, size);
    return ret;
}
export function __wbg_Error_83742b46f01ce22d(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = Error(v0);
    return ret;
}
export function __wbg_String_8564e559799eccda(arg0, arg1) {
    const ret = String(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg___wbindgen_bigint_get_as_i64_447a76b5c6ef7bda(arg0, arg1) {
    const v = arg1;
    const ret = typeof(v) === 'bigint' ? v : undefined;
    getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
}
export function __wbg___wbindgen_boolean_get_c0f3f60bac5a78d1(arg0) {
    const v = arg0;
    const ret = typeof(v) === 'boolean' ? v : undefined;
    return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
}
export function __wbg___wbindgen_debug_string_5398f5bb970e0daa(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg___wbindgen_in_41dbb8413020e076(arg0, arg1) {
    const ret = arg0 in arg1;
    return ret;
}
export function __wbg___wbindgen_is_bigint_e2141d4f045b7eda(arg0) {
    const ret = typeof(arg0) === 'bigint';
    return ret;
}
export function __wbg___wbindgen_is_function_3c846841762788c1(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
}
export function __wbg___wbindgen_is_object_781bc9f159099513(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
}
export function __wbg___wbindgen_is_string_7ef6b97b02428fae(arg0) {
    const ret = typeof(arg0) === 'string';
    return ret;
}
export function __wbg___wbindgen_is_undefined_52709e72fb9f179c(arg0) {
    const ret = arg0 === undefined;
    return ret;
}
export function __wbg___wbindgen_jsval_eq_ee31bfad3e536463(arg0, arg1) {
    const ret = arg0 === arg1;
    return ret;
}
export function __wbg___wbindgen_jsval_loose_eq_5bcc3bed3c69e72b(arg0, arg1) {
    const ret = arg0 == arg1;
    return ret;
}
export function __wbg___wbindgen_number_get_34bb9d9dcfa21373(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
}
export function __wbg___wbindgen_string_get_395e606bd0ee4427(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg___wbindgen_throw_6ddd609b62940d55(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    throw new Error(v0);
}
export function __wbg__wbg_cb_unref_6b5b6b8576d35cb1(arg0) {
    arg0._wbg_cb_unref();
}
export function __wbg_addEventListener_2d985aa8a656f6dc() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    arg0.addEventListener(v0, arg3);
}, arguments); }
export function __wbg_apply_ac9afb97ca32f169() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.apply(arg1, arg2);
    return ret;
}, arguments); }
export function __wbg_call_2d781c1f4d5c0ef8() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
}, arguments); }
export function __wbg_call_dcc2662fa17a72cf() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg0.call(arg1, arg2, arg3);
    return ret;
}, arguments); }
export function __wbg_call_e133b57c9155d22c() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments); }
export function __wbg_construct_526a6dedb187eba9() { return handleError(function (arg0, arg1) {
    const ret = Reflect.construct(arg0, arg1);
    return ret;
}, arguments); }
export function __wbg_debug_4b9b1a2d5972be57(arg0) {
    console.debug(arg0);
}
export function __wbg_decode_0e9a915643d7b97b() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg1.decode(getArrayU8FromWasm0(arg2, arg3));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments); }
export function __wbg_done_08ce71ee07e3bd17(arg0) {
    const ret = arg0.done;
    return ret;
}
export function __wbg_entries_e8a20ff8c9757101(arg0) {
    const ret = Object.entries(arg0);
    return ret;
}
export function __wbg_error_8d9a8e04cd1d3588(arg0) {
    console.error(arg0);
}
export function __wbg_error_a6fa202b58aa1cd3(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    if (arg0 !== 0) { wasm.__wbindgen_free_command_export(arg0, arg1, 1); }
    console.error(v0);
}
export function __wbg_fromCodePoint_4a02c6dcced1d233() { return handleError(function (arg0) {
    const ret = String.fromCodePoint(arg0 >>> 0);
    return ret;
}, arguments); }
export function __wbg_from_4bdf88943703fd48(arg0) {
    const ret = Array.from(arg0);
    return ret;
}
export function __wbg_getRandomValues_3f44b700395062e5() { return handleError(function (arg0, arg1) {
    globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
}, arguments); }
export function __wbg_getTime_1dad7b5386ddd2d9(arg0) {
    const ret = arg0.getTime();
    return ret;
}
export function __wbg_get_326e41e095fb2575() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments); }
export function __wbg_get_3ef1eba1850ade27() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments); }
export function __wbg_get_a8ee5c45dabc1b3b(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
}
export function __wbg_get_bc0da515bc47196d() { return handleError(function (arg0, arg1) {
    const ret = arg0.get(arg1 >>> 0);
    return ret;
}, arguments); }
export function __wbg_get_index_87179971b8d350e4(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
}
export function __wbg_get_unchecked_329cfe50afab7352(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
}
export function __wbg_info_7d4e223bb1a7e671(arg0) {
    console.info(arg0);
}
export function __wbg_instanceof_ArrayBuffer_101e2bf31071a9f6(arg0) {
    let result;
    try {
        result = arg0 instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_instanceof_Map_f194b366846aca0c(arg0) {
    let result;
    try {
        result = arg0 instanceof Map;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_instanceof_Uint8Array_740438561a5b956d(arg0) {
    let result;
    try {
        result = arg0 instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_isArray_33b91feb269ff46e(arg0) {
    const ret = Array.isArray(arg0);
    return ret;
}
export function __wbg_isSafeInteger_ecd6a7f9c3e053cd(arg0) {
    const ret = Number.isSafeInteger(arg0);
    return ret;
}
export function __wbg_iterator_d8f549ec8fb061b1() {
    const ret = Symbol.iterator;
    return ret;
}
export function __wbg_length_74a17482fb9756fe(arg0) {
    const ret = arg0.length;
    return ret;
}
export function __wbg_length_b3416cf66a5452c8(arg0) {
    const ret = arg0.length;
    return ret;
}
export function __wbg_length_cc4db358f624b4bc(arg0) {
    const ret = arg0.length;
    return ret;
}
export function __wbg_length_ea16607d7b61445b(arg0) {
    const ret = arg0.length;
    return ret;
}
export function __wbg_log_524eedafa26daa59(arg0) {
    console.log(arg0);
}
export function __wbg_new_0_1dcafdf5e786e876() {
    const ret = new Date();
    return ret;
}
export function __wbg_new_227d7c05414eb861() {
    const ret = new Error();
    return ret;
}
export function __wbg_new_4503a92ca6e5898d() { return handleError(function () {
    const ret = new FileReader();
    return ret;
}, arguments); }
export function __wbg_new_49d5571bd3f0c4d4() {
    const ret = new Map();
    return ret;
}
export function __wbg_new_5f486cdf45a04d78(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
}
export function __wbg_new_a70fbab9066b301f() {
    const ret = new Array();
    return ret;
}
export function __wbg_new_ab79df5bd7c26067() {
    const ret = new Object();
    return ret;
}
export function __wbg_new_d098e265629cd10f(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return wasm_bindgen__convert__closures_____invoke__h8e9fc28c4e841be2(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return ret;
    } finally {
        state0.a = state0.b = 0;
    }
}
export function __wbg_new_from_slice_22da9388ac046e50(arg0, arg1) {
    const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
    return ret;
}
export function __wbg_new_typed_aaaeaf29cf802876(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return wasm_bindgen__convert__closures_____invoke__h8e9fc28c4e841be2(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return ret;
    } finally {
        state0.a = state0.b = 0;
    }
}
export function __wbg_new_typed_bccac67128ed885a() {
    const ret = new Array();
    return ret;
}
export function __wbg_new_with_label_4ef7ad3ba8414280() { return handleError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new TextDecoder(v0);
    return ret;
}, arguments); }
export function __wbg_new_with_length_3259a525196bd8cc(arg0) {
    const ret = new Array(arg0 >>> 0);
    return ret;
}
export function __wbg_new_with_length_825018a1616e9e55(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
}
export function __wbg_next_11b99ee6237339e3() { return handleError(function (arg0) {
    const ret = arg0.next();
    return ret;
}, arguments); }
export function __wbg_next_e01a967809d1aa68(arg0) {
    const ret = arg0.next;
    return ret;
}
export function __wbg_of_4a6892ab933301c3(arg0, arg1, arg2, arg3) {
    const ret = Array.of(arg0, arg1, arg2, arg3);
    return ret;
}
export function __wbg_of_8bf7ed3eca00ea43(arg0) {
    const ret = Array.of(arg0);
    return ret;
}
export function __wbg_of_8fd5dd402bc67165(arg0, arg1, arg2) {
    const ret = Array.of(arg0, arg1, arg2);
    return ret;
}
export function __wbg_of_bccc72834fbc1287(arg0, arg1, arg2, arg3, arg4) {
    const ret = Array.of(arg0, arg1, arg2, arg3, arg4);
    return ret;
}
export function __wbg_of_d6376e3774c51f89(arg0, arg1) {
    const ret = Array.of(arg0, arg1);
    return ret;
}
export function __wbg_parse_e9eddd2a82c706eb() { return handleError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = JSON.parse(v0);
    return ret;
}, arguments); }
export function __wbg_prototypesetcall_d62e5099504357e6(arg0, arg1, arg2) {
    Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
}
export function __wbg_push_e87b0e732085a946(arg0, arg1) {
    const ret = arg0.push(arg1);
    return ret;
}
export function __wbg_queueMicrotask_0c399741342fb10f(arg0) {
    const ret = arg0.queueMicrotask;
    return ret;
}
export function __wbg_queueMicrotask_a082d78ce798393e(arg0) {
    queueMicrotask(arg0);
}
export function __wbg_readAsArrayBuffer_42e72fd798694e26() { return handleError(function (arg0, arg1) {
    arg0.readAsArrayBuffer(arg1);
}, arguments); }
export function __wbg_reject_452b6409a2fde3cd(arg0) {
    const ret = Promise.reject(arg0);
    return ret;
}
export function __wbg_resolve_ae8d83246e5bcc12(arg0) {
    const ret = Promise.resolve(arg0);
    return ret;
}
export function __wbg_result_e9e044267b3f176a() { return handleError(function (arg0) {
    const ret = arg0.result;
    return ret;
}, arguments); }
export function __wbg_set_282384002438957f(arg0, arg1, arg2) {
    arg0[arg1 >>> 0] = arg2;
}
export function __wbg_set_6be42768c690e380(arg0, arg1, arg2) {
    arg0[arg1] = arg2;
}
export function __wbg_set_726a6b65926212b5() { return handleError(function (arg0, arg1, arg2) {
    arg0.set(arg1 >>> 0, arg2);
}, arguments); }
export function __wbg_set_8c0b3ffcf05d61c2(arg0, arg1, arg2) {
    arg0.set(getArrayU8FromWasm0(arg1, arg2));
}
export function __wbg_set_bf7251625df30a02(arg0, arg1, arg2) {
    const ret = arg0.set(arg1, arg2);
    return ret;
}
export function __wbg_set_e80615d7a9a43981(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
}
export function __wbg_slice_f3fd3c2bec9310f6(arg0, arg1, arg2) {
    const ret = arg0.slice(arg1 >>> 0, arg2 >>> 0);
    return ret;
}
export function __wbg_stack_3b0d974bbf31e44f(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg_static_accessor_GLOBAL_8adb955bd33fac2f() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_static_accessor_GLOBAL_THIS_ad356e0db91c7913() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_static_accessor_SELF_f207c857566db248() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_static_accessor_WINDOW_bb9f1ba69d61b386() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_subarray_a068d24e39478a8a(arg0, arg1, arg2) {
    const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
    return ret;
}
export function __wbg_then_098abe61755d12f6(arg0, arg1) {
    const ret = arg0.then(arg1);
    return ret;
}
export function __wbg_then_9e335f6dd892bc11(arg0, arg1, arg2) {
    const ret = arg0.then(arg1, arg2);
    return ret;
}
export function __wbg_type_7a6bb36555a59d6d(arg0, arg1) {
    const ret = arg1.type;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc_command_export, wasm.__wbindgen_realloc_command_export);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg_value_21fc78aab0322612(arg0) {
    const ret = arg0.value;
    return ret;
}
export function __wbg_warn_69424c2d92a2fa73(arg0) {
    console.warn(arg0);
}
export function __wbindgen_cast_0000000000000001(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 2, function: Function { arguments: [Externref], shim_idx: 3, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__hb1815f7351a8f99b, wasm_bindgen__convert__closures_____invoke__h10e2de02a95760ed);
    return ret;
}
export function __wbindgen_cast_0000000000000002(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 3600, function: Function { arguments: [Externref], shim_idx: 3601, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__hcbea9f36b367d3d8, wasm_bindgen__convert__closures_____invoke__h240eec0b57535315);
    return ret;
}
export function __wbindgen_cast_0000000000000003(arg0) {
    // Cast intrinsic for `F64 -> Externref`.
    const ret = arg0;
    return ret;
}
export function __wbindgen_cast_0000000000000004(arg0) {
    // Cast intrinsic for `I64 -> Externref`.
    const ret = arg0;
    return ret;
}
export function __wbindgen_cast_0000000000000005(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    // Cast intrinsic for `Ref(CachedString) -> Externref`.
    const ret = v0;
    return ret;
}
export function __wbindgen_cast_0000000000000006(arg0) {
    // Cast intrinsic for `U64 -> Externref`.
    const ret = BigInt.asUintN(64, arg0);
    return ret;
}
export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_externrefs;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
}
function wasm_bindgen__convert__closures_____invoke__h10e2de02a95760ed(arg0, arg1, arg2) {
    wasm.wasm_bindgen__convert__closures_____invoke__h10e2de02a95760ed(arg0, arg1, arg2);
}

function wasm_bindgen__convert__closures_____invoke__h240eec0b57535315(arg0, arg1, arg2) {
    const ret = wasm.wasm_bindgen__convert__closures_____invoke__h240eec0b57535315(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen__convert__closures_____invoke__h8e9fc28c4e841be2(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures_____invoke__h8e9fc28c4e841be2(arg0, arg1, arg2, arg3);
}

const ModuleInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_moduleinfo_free(ptr >>> 0, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc_command_export();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => state.dtor(state.a, state.b));

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function getCachedStringFromWasm0(ptr, len) {
    if (ptr === 0) {
        return getFromExternrefTable0(len);
    } else {
        return getStringFromWasm0(ptr, len);
    }
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getFromExternrefTable0(idx) { return wasm.__wbindgen_externrefs.get(idx); }

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store_command_export(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            state.dtor(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc_command_export(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;


let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}
