const DOCUMENT_CACHE = new Map();

/** Loads bundled, versioned JSON relative to the web/Tauri application root. */
export async function loadJsonDocument(path) {
  const url = new URL(path, new URL(import.meta.env.BASE_URL, document.baseURI)).href;
  if (!DOCUMENT_CACHE.has(url)) {
    DOCUMENT_CACHE.set(url, fetch(url).then(async response => {
      if (!response.ok) throw new Error(`Unable to load ${path}: ${response.status}`);
      const document = await response.json();
      if (document.schemaVersion !== 1 || !document.id) throw new Error(`Invalid dataset: ${path}`);
      return document;
    }).catch(error => { DOCUMENT_CACHE.delete(url); throw error; }));
  }
  return DOCUMENT_CACHE.get(url);
}

/** Returns the payload while retaining version/source metadata in the JSON source. */
export async function loadDataset(path) {
  const document = await loadJsonDocument(path);
  if (!('data' in document)) throw new Error(`Missing dataset payload: ${path}`);
  return document.data;
}
