/** All browser/WebView persistence goes through this boundary, with an in-memory fallback. */
const fallback = new Map<string, string>();
/** Reads a key without making storage availability a requirement for opening the app. */
export function readPreference(key: string, defaultValue: string | null = null): string | null {
  try {
    return localStorage.getItem(key) ?? fallback.get(key) ?? defaultValue;
  } catch {
    return fallback.get(key) ?? defaultValue;
  }
}
/** Keeps the current session usable when persistent storage is unavailable. */
export function writePreference(key: string, value: unknown) {
  fallback.set(key, String(value));
  try {
    localStorage.setItem(key, String(value));
  } catch {
    /* Keep this session usable. */
  }
}
