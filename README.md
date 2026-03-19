# Kreuzberg Live Demo

A static, server-free demo for [Kreuzberg](https://github.com/kreuzberg-dev/kreuzberg) — drop any document and extract text, tables, and metadata instantly in your browser.

**[→ Try it live](https://kreuzberg-dev.github.io/demo/)**

## How it works

The demo runs entirely in the browser using `@kreuzberg/wasm`. No file is uploaded anywhere — everything is processed locally via WebAssembly.

The `dist/` folder is the unpacked contents of the `@kreuzberg/wasm` npm package, served as static files alongside `index.html`. The WASM loader uses `new URL('kreuzberg_wasm_bg.wasm', import.meta.url)` to resolve the binary relative to itself, so no bundler is needed — just a static file server with correct MIME types.

## Supported formats

PDF, DOCX, XLSX, PPTX, ODT, ODP, ODS, RTF, EPUB, PNG, JPG, WEBP, BMP, TIFF, GIF, HTML, XML, CSV, TSV, JSON, YAML, TXT, Markdown, EML, MSG, ZIP, TAR, and 60+ more.

## Run locally

```bash
git clone https://github.com/kreuzberg-dev/demo
cd demo
python3 -m http.server 8080
# open http://localhost:8080
```

Any static file server works. The one requirement is that files are served over HTTP (not opened as `file://`) so the browser can load the WASM binary.

## Updating the WASM package

The `dist/` folder tracks a specific version of `@kreuzberg/wasm`. To update:

```bash
npm pack @kreuzberg/wasm
tar -xzf kreuzberg-wasm-*.tgz --strip-components=1
rm kreuzberg-wasm-*.tgz
```

Then commit the updated `dist/` folder.

## File structure

```
index.html
dist/
  index.js                        # main entrypoint
  runtime.js                      # runtime detection
  pdfium.js                       # PDF engine loader
  pdfium.esm.wasm                 # PDFium WASM binary (~3.8 MB)
  ocr-worker.js                   # OCR web worker
  adapters/
    wasm-adapter.js
  ocr/
    registry.js
    tesseract-wasm-backend.js
  pkg/
    kreuzberg_wasm.js             # wasm-bindgen glue
    kreuzberg_wasm_bg.js
    kreuzberg_wasm_bg.wasm        # core WASM binary (~19 MB)
```

## License

MIT — same as [Kreuzberg](https://github.com/kreuzberg-dev/kreuzberg/blob/main/LICENSE).