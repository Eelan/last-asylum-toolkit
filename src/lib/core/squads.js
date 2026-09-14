import { readPreference, writePreference } from '../platform/storage.ts';
import { normalizeSlots } from '../domain/squads.js';

/** Repairs persisted compositions against the current personal roster. */
export function normalizeSquads(value, heroes) {
  return {
    squads: Array.from({ length: 4 }, (_, index) => normalizeSlots(value?.squads?.[index], heroes)),
    presets: (Array.isArray(value?.presets) ? value.presets : [])
      .filter(
        (preset) =>
          preset && typeof preset.id === 'string' && typeof preset.name === 'string' && preset.name.trim()
      )
      .filter((preset, index, presets) => presets.findIndex((item) => item.id === preset.id) === index)
      .map((preset) => ({
        id: preset.id,
        name: preset.name.trim().slice(0, 80),
        slots: normalizeSlots(preset.slots, heroes)
      }))
  };
}

/** Loads local formations, tolerating malformed or older storage. */
export function getSquads(heroes) {
  try {
    return normalizeSquads(JSON.parse(readPreference('lat-hero-squads') || '{}'), heroes);
  } catch {
    return normalizeSquads({}, heroes);
  }
}

/** Saves references only; levels and power remain owned by the personal roster. */
export function saveSquads(value, heroes) {
  writePreference('lat-hero-squads', JSON.stringify(normalizeSquads(value, heroes)));
}
