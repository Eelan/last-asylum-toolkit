import { GAME_DATA } from '../data.js';

const HEROES_STORAGE_KEY = 'lat-my-heroes';
const VALID_RARITIES = ['ur', 'ssr', 'sr'];

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
  return {
    id: String(hero.id),
    catalogId: catalogHero?.id || null,
    name: catalogHero?.name || String(hero.name || ''),
    rarity: catalogHero?.rarity || (VALID_RARITIES.includes(hero.rarity) ? hero.rarity : 'ur'),
    current: normalizeLevel(hero.current),
    target: normalizeLevel(hero.target)
  };
}

/** Reads locally tracked heroes and migrates matching free-text names to catalogue ids in memory. */
export function getTrackedHeroes() {
  try {
    const heroes = JSON.parse(localStorage.getItem(HEROES_STORAGE_KEY) || '[]');
    return Array.isArray(heroes) ? heroes.filter(hero => hero && hero.id).map(normalizeHero) : [];
  } catch (error) {
    return [];
  }
}

export function saveTrackedHeroes(heroes) {
  try {
    localStorage.setItem(HEROES_STORAGE_KEY, JSON.stringify(heroes));
  } catch (error) {}
}

export function createTrackedHero(catalogHero = null) {
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
