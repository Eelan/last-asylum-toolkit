import { loadDataset } from './core/datasets.js';

export const GAME_DATA = {};

/** Loads shared game tables before mounting tool pages. Failed loads can be retried. */
export async function initializeGameData() {
const [
  antitoxin,
  sanctuary,
  raven,
  stars,
  skills,
  duel,
  heroes,
  heroProfiles
] = await Promise.all([
  loadDataset('data/progression/antitoxin.json'),
  loadDataset('data/progression/sanctuary.json'),
  loadDataset('data/progression/raven.json'),
  loadDataset('data/progression/hero-stars.json'),
  loadDataset('data/progression/skill-badges.json'),
  loadDataset('data/events/alliance-duel.json'),
  loadDataset('data/heroes/catalog.json'),
  loadDataset('data/heroes/profiles.json')
]);

Object.assign(GAME_DATA, {
  heroes,
  heroProfiles,
  antitoxin,
  sanctuary,
  raven,
  stars,
  skills,
  duel
});
}
