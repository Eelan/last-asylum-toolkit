const DOCUMENT_CACHE = new Map();

/** Loads and caches a versioned JSON document, including specialized domain schemas. */
export async function loadJsonDocument(relativePath) {
  const url = new URL(relativePath, import.meta.url).href;
  if (!DOCUMENT_CACHE.has(url)) {
    DOCUMENT_CACHE.set(url, fetch(url).then(async response => {
      if (!response.ok) throw new Error(`Unable to load JSON document ${relativePath}: ${response.status}`);

      const document = await response.json();
      if (!document || document.schemaVersion !== 1 || !document.id) {
        throw new Error(`Invalid versioned JSON document: ${relativePath}`);
      }
      return document;
    }).catch(error => {
      DOCUMENT_CACHE.delete(url);
      throw error;
    }));
  }
  return DOCUMENT_CACHE.get(url);
}

/** Loads a regular dataset envelope and returns its application payload. */
export async function loadDataset(relativePath) {
  const dataset = await loadJsonDocument(relativePath);
  if (!("data" in dataset)) throw new Error(`Missing dataset payload: ${relativePath}`);
  return dataset.data;
}
