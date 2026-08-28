import { GAME_DATA } from '../data.js';
import { $, $$, createLevelOptions, icon } from '../core/dom.js';
import { formatNumber, translate } from '../core/i18n.js';
import { getTrackedHeroes, saveTrackedHeroes } from '../core/heroes.js';
import { getStoredStock, parseNumber } from '../core/storage.js';
import { renderPageHeader } from '../core/ui.js';
import { calculateAntitoxinProgression } from '../domain/antitoxin.js';

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
}

function renderHeroList(heroes, selectedId) {
  return heroes.map(hero => {
    const catalogHero = GAME_DATA.heroes.find(candidate => candidate.id === hero.catalogId);
    return `
    <button class="tracked-hero ${hero.id === selectedId ? 'selected' : ''}" type="button" data-hero-id="${escapeHtml(hero.id)}">
      <span class="tracked-hero-identity">
        <span class="hero-portrait-shell tracked-hero-portrait-shell rarity-frame-${hero.rarity}">
          ${catalogHero?.image ? `<img class="tracked-hero-portrait" src="${catalogHero.image}" alt="">` : `<span class="tracked-hero-portrait tracked-hero-placeholder">${icon('user-round')}</span>`}
        </span>
        <span><span class="tracked-hero-name">${escapeHtml(hero.name) || translate('hero_name')}</span>
          ${catalogHero ? `<span class="tracked-hero-attributes"><img src="assets/images/heroes/attributes/camp-${catalogHero.faction}.webp" alt="${translate(`hero_faction_${catalogHero.faction}`)}" title="${translate('hero_faction')}: ${translate(`hero_faction_${catalogHero.faction}`)}"><img src="assets/images/heroes/attributes/role-${catalogHero.role}.webp" alt="${translate(`hero_role_${catalogHero.role}`)}" title="${translate('hero_role')}: ${translate(`hero_role_${catalogHero.role}`)}"></span>` : ''}
        </span>
      </span>
      <span>${translate('level_abbr')} ${hero.current} → ${hero.target}</span>
    </button>`;
  }).join('');
}

function renderHeroDetails(hero, maxLevel) {
  const catalogHero = GAME_DATA.heroes.find(candidate => candidate.id === hero.catalogId);
  const progression = calculateAntitoxinProgression(hero.current, hero.target);
  const stock = parseNumber(getStoredStock('antitoxin'));
  const required = progression.valid ? formatNumber(progression.total) : '—';
  const missing = progression.valid ? formatNumber(Math.max(0, progression.total - stock)) : '—';

  return `<section class="panel hero-details">
    <h3>${translate('hero_progress')}</h3>
    <div class="form-grid">
      <div class="hero-readonly"><span>${translate('hero_name')}</span><strong>${escapeHtml(hero.name)}</strong></div>
      <div class="hero-readonly"><span>${translate('hero_rarity')}</span><strong>${catalogHero.rarity.toUpperCase()}</strong></div>
      <label><span>${translate('current')}</span><select id="hero-current">${createLevelOptions(1, maxLevel, hero.current)}</select></label>
      <label><span>${translate('target')}</span><select id="hero-target">${createLevelOptions(1, maxLevel, hero.target)}</select></label>
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

/** Renders the personal, device-local tracker for heroes in the shared catalogue. */
export function renderMyHeroesPage(tool) {
  const heroes = getTrackedHeroes();
  const maxLevel = Math.max(...Object.keys(GAME_DATA.antitoxin).map(Number));
  let selectedId = heroes[0]?.id || null;

  const render = () => {
    const selectedHero = heroes.find(hero => hero.id === selectedId);
    $('#view').innerHTML = renderPageHeader(tool) + `<div class="heroes-layout">
      <section class="panel heroes-list"><div class="heroes-list-head"><h3>${translate('my_heroes_title')}</h3><div class="heroes-list-actions"><a class="back-link" href="#/heroes">${icon('list')} ${translate('heroes_list_title')}</a></div></div>
      <div id="tracked-heroes">${heroes.length ? renderHeroList(heroes, selectedId) : `<div class="heroes-empty"><strong>${translate('my_heroes_empty')}</strong><p>${translate('my_heroes_empty_hint')}</p></div>`}</div></section>
      ${selectedHero ? renderHeroDetails(selectedHero, maxLevel) : ''}
    </div>`;

    $$('[data-hero-id]').forEach(button => button.addEventListener('click', () => {
      selectedId = button.dataset.heroId;
      render();
    }));

    lucide.createIcons();
    if (!selectedHero) return;
    const updateHero = () => {
      selectedHero.current = +$('#hero-current').value;
      selectedHero.target = +$('#hero-target').value;
      saveTrackedHeroes(heroes);
      render();
    };
    ['hero-current', 'hero-target'].forEach(id => $('#' + id).addEventListener('change', updateHero));
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
