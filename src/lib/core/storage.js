import { readPreference, writePreference } from '../platform/storage.ts';

const LEGACY_STOCKS = {
  'hero-specific-shards': 'hero-shards',
  'ur-omni-shards': 'ur-shards',
  'ssr-omni-shards': 'ssr-shards',
  'sr-omni-shards': 'sr-shards'
};

export function parseNumber(value) {
  return Number(String(value ?? '').replace(/[^\d]/g, '')) || 0;
}

export function getStoredStock(resource) {
  try {
    const value = readPreference(`lat-stock-${resource}`);
    if (value !== null) return value;
    const legacyResource = LEGACY_STOCKS[resource];
    const legacyValue = legacyResource ? readPreference(`lat-stock-${legacyResource}`) : null;
    if (legacyValue !== null) writePreference(`lat-stock-${resource}`, legacyValue);
    return legacyValue;
  } catch (error) {
    return null;
  }
}

export function setStoredStock(resource, value) {
  try {
    writePreference(`lat-stock-${resource}`, value);
  } catch (error) {}
}
