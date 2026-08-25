import { GAME_DATA } from '../data.js';
import { $, $$, createLevelOptions, icon } from '../core/dom.js';
import { formatNumber, translate } from '../core/i18n.js';
import { getStoredStock, parseNumber } from '../core/storage.js';
import { renderPageHeader } from '../core/ui.js';
import { calculateAntitoxinProgression } from '../domain/antitoxin.js';

const HEROES_STORAGE_KEY = 'lat-my-heroes';
const DEFAULT_HERO = { name: '', rarity: 'ur', current: 1, target: 1 };

function createHeroId() {
  return `hero-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
}

function normalizeLevel(value) {
  const maxLevel = Math.max(...Object.keys(GAME_DATA.antitoxin).map(Number));
  return Math.min(maxLevel, Math.max(1, Number(value) || 1));
}

function normalizeHero(hero) {
  return {
    id: String(hero.id),
    name: String(hero.name || ''),
    rarity: ['ur', 'ssr', 'sr'].includes(hero.rarity) ? hero.rarity : 'ur',
    current: normalizeLevel(hero.current),
    target: normalizeLevel(hero.target)
  };
}

/** Reads the locally tracked heroes, discarding malformed saved values. */
function getTrackedHeroes() {
  try {
    const heroes = JSON.parse(localStorage.getItem(HEROES_STORAGE_KEY) || '[]');
    return Array.isArray(heroes) ? heroes.filter(hero => hero && hero.id).map(normalizeHero) : [];
  } catch (error) {
    return [];
  }
}

function saveTrackedHeroes(heroes) {
  try {
    localStorage.setItem(HEROES_STORAGE_KEY, JSON.stringify(heroes));
  } catch (error) {}
}

function renderHeroList(heroes, selectedId) {
  return heroes.map(hero => `
    <button class="tracked-hero ${hero.id === selectedId ? 'selected' : ''}" type="button" data-hero-id="${escapeHtml(hero.id)}">
      <span class="tracked-hero-name">${escapeHtml(hero.name) || translate('hero_name')}</span>
      <span>${translate('level_abbr')} ${hero.current} → ${hero.target}</span>
    </button>`).join('');
}

function renderHeroDetails(hero, maxLevel) {
  const progression = calculateAntitoxinProgression(hero.current, hero.target);
  const stock = parseNumber(getStoredStock('antitoxin'));
  const required = progression.valid ? formatNumber(progression.total) : '—';
  const missing = progression.valid ? formatNumber(Math.max(0, progression.total - stock)) : '—';

  return `<section class="panel hero-details">
    <h3>${translate('hero_progress')}</h3>
    <div class="form-grid">
      <label class="full"><span>${translate('hero_name')}</span><input id="hero-name" value="${escapeHtml(hero.name)}" placeholder="${translate('hero_name_placeholder')}"></label>
      <label><span>${translate('hero_rarity')}</span><select id="hero-rarity"><option value="ur" ${hero.rarity === 'ur' ? 'selected' : ''}>UR</option><option value="ssr" ${hero.rarity === 'ssr' ? 'selected' : ''}>SSR</option><option value="sr" ${hero.rarity === 'sr' ? 'selected' : ''}>SR</option></select></label>
      <label><span>${translate('current')}</span><select id="hero-current">${createLevelOptions(1, maxLevel, hero.current)}</select></label>
      <label class="full"><span>${translate('target')}</span><select id="hero-target">${createLevelOptions(1, maxLevel, hero.target)}</select></label>
    </div>
    <div class="hero-progress">
      <span class="result-label">${translate('hero_upgrade_cost')}</span>
      <strong>${required}</strong><span>${translate('antitoxin')}</span>
      <div class="stat-row"><div class="stat"><span>${translate('stock')}</span><strong>${formatNumber(stock)}</strong></div><div class="stat"><span>${translate('missing')}</span><strong>${missing}</strong></div></div>
      ${progression.valid ? '' : `<p class="form-note">${translate('hero_target_hint')}</p>`}
    </div>
    <div class="quick-actions"><a class="primary-btn" href="#/stocks">${icon('package-open')} ${translate('manage_stocks')}</a><a class="back-link" href="#/antitoxin">${icon('calculator')} ${translate('anti_title')}</a></div>
    <button id="remove-hero" class="text-btn" type="button">${icon('trash-2')} ${translate('hero_delete')}</button>
  </section>`;
}

/** Renders the personal, device-local hero tracker. */
export function renderMyHeroesPage(tool) {
  const heroes = getTrackedHeroes();
  const maxLevel = Math.max(...Object.keys(GAME_DATA.antitoxin).map(Number));
  let selectedId = heroes[0]?.id || null;

  const render = () => {
    const selectedHero = heroes.find(hero => hero.id === selectedId);
    $('#view').innerHTML = renderPageHeader(tool) + `<div class="heroes-layout">
      <section class="panel heroes-list"><div class="heroes-list-head"><h3>${translate('my_heroes_title')}</h3><button id="add-hero" class="primary-btn" type="button">${icon('plus')} ${translate('my_heroes_add')}</button></div>
      <div id="tracked-heroes">${heroes.length ? renderHeroList(heroes, selectedId) : `<div class="heroes-empty"><strong>${translate('my_heroes_empty')}</strong><p>${translate('my_heroes_empty_hint')}</p></div>`}</div></section>
      ${selectedHero ? renderHeroDetails(selectedHero, maxLevel) : ''}
    </div>`;

    $('#add-hero').addEventListener('click', () => {
      const hero = { id: createHeroId(), ...DEFAULT_HERO };
      heroes.push(hero);
      selectedId = hero.id;
      saveTrackedHeroes(heroes);
      render();
    });

    $$('[data-hero-id]').forEach(button => button.addEventListener('click', () => {
      selectedId = button.dataset.heroId;
      render();
    }));

    if (!selectedHero) return;
    const updateHero = () => {
      selectedHero.name = $('#hero-name').value.trim();
      selectedHero.rarity = $('#hero-rarity').value;
      selectedHero.current = +$('#hero-current').value;
      selectedHero.target = +$('#hero-target').value;
      saveTrackedHeroes(heroes);
      render();
    };
    ['hero-name', 'hero-rarity', 'hero-current', 'hero-target'].forEach(id => $('#' + id).addEventListener('change', updateHero));
    $('#remove-hero').addEventListener('click', () => {
      const index = heroes.findIndex(hero => hero.id === selectedId);
      heroes.splice(index, 1);
      selectedId = heroes[0]?.id || null;
      saveTrackedHeroes(heroes);
      render();
    });
  };

  render();
}
