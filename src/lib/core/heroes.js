import { readPreference, writePreference } from '../platform/storage.ts';
import { GAME_DATA } from '../data.js';

const HEROES_STORAGE_KEY = 'lat-my-heroes';
function normalizeLevel(value) {
  const maxLevel = Math.max(...Object.keys(GAME_DATA.antitoxin).map(Number));
  return Math.min(maxLevel, Math.max(1, Number(value) || 1));
}

function findCatalogHero(hero) {
  if (hero.catalogId) return GAME_DATA.heroes.find(candidate => candidate.id === hero.catalogId);
  const normalizedName = String(hero.name || '').trim().toLocaleLowerCase();
  return GAME_DATA.heroes.find(candidate => candidate.name.toLocaleLowerCase() === normalizedName);
}

function normalizeHero(hero) {
  const catalogHero = findCatalogHero(hero);
  if (!catalogHero) return null;
  return {
    id: String(hero.id),
    catalogId: catalogHero.id,
    name: catalogHero.name,
    rarity: catalogHero.rarity,
    current: normalizeLevel(hero.current),
    target: normalizeLevel(hero.target)
  };
}

/** Reads catalogue heroes and migrates matching legacy free-text names in memory. */
export function getTrackedHeroes() {
  try {
    const heroes = JSON.parse(readPreference(HEROES_STORAGE_KEY) || '[]');
    return Array.isArray(heroes) ? heroes.filter(hero => hero && hero.id).map(normalizeHero).filter(Boolean) : [];
  } catch (error) {
    return [];
  }
}

export function saveTrackedHeroes(heroes) {
  try {
    writePreference(HEROES_STORAGE_KEY, JSON.stringify(heroes));
  } catch (error) {}
}

export function createTrackedHero(catalogHero) {
  return {
    id: `hero-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    catalogId: catalogHero?.id || null,
    name: catalogHero?.name || '',
    rarity: catalogHero?.rarity || 'ur',
    current: 1,
    target: 1
  };
}

/** Adds a catalogue hero once and returns the existing record when it is already tracked. */
export function addCatalogHero(catalogHero) {
  const heroes = getTrackedHeroes();
  const existing = heroes.find(hero => hero.catalogId === catalogHero.id);
  if (existing) return existing;
  const hero = createTrackedHero(catalogHero);
  heroes.push(hero);
  saveTrackedHeroes(heroes);
  return hero;
}
