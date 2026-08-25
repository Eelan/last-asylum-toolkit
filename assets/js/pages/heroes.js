import { GAME_DATA } from '../data.js';
import { $, $$, icon } from '../core/dom.js';
import { translate } from '../core/i18n.js';
import { addCatalogHero, getTrackedHeroes } from '../core/heroes.js';
import { renderPageHeader } from '../core/ui.js';

function renderHeroCard(hero, trackedIds) {
  const isTracked = trackedIds.has(hero.id);
  return `<article class="catalog-hero">
    <div class="catalog-hero-identity">
      <span class="hero-portrait-shell rarity-frame-${hero.rarity}">
        ${hero.image ? `<img class="hero-portrait" src="${hero.image}" alt="">` : `<span class="hero-portrait hero-portrait-placeholder">${icon('user-round')}</span>`}
      </span>
      <div><span class="rarity-badge rarity-${hero.rarity}">${hero.rarity.toUpperCase()}</span><h3>${hero.name}</h3>
        <div class="hero-attributes">
          <img src="assets/images/heroes/attributes/camp-${hero.faction}.webp" alt="${translate(`hero_faction_${hero.faction}`)}" title="${translate('hero_faction')}: ${translate(`hero_faction_${hero.faction}`)}">
          <img src="assets/images/heroes/attributes/role-${hero.role}.webp" alt="${translate(`hero_role_${hero.role}`)}" title="${translate('hero_role')}: ${translate(`hero_role_${hero.role}`)}">
        </div>
      </div>
    </div>
    <div class="catalog-hero-actions">
      <a class="back-link" href="#/heroes/${hero.id}">${icon('id-card')} ${translate('hero_view_profile')}</a>
      <button class="${isTracked ? 'catalog-added' : 'primary-btn'}" type="button" data-catalog-id="${hero.id}" ${isTracked ? 'disabled' : ''}>${icon(isTracked ? 'check' : 'plus')} ${translate(isTracked ? 'hero_already_added' : 'hero_add_to_mine')}</button>
    </div>
  </article>`;
}

function renderHeroProfile(hero, trackedIds) {
  const profile = GAME_DATA.heroProfiles[hero.id];
  const isTracked = trackedIds.has(hero.id);
  return `<a class="back-link hero-profile-back" href="#/heroes">${icon('arrow-left')} ${translate('heroes_list_title')}</a>
    <section class="panel hero-profile rarity-profile-${hero.rarity}">
      <div class="hero-profile-summary">
        <span class="hero-portrait-shell hero-profile-portrait-shell rarity-frame-${hero.rarity}"><img class="hero-portrait hero-profile-portrait" src="${hero.image}" alt=""></span>
        <div><span class="rarity-badge rarity-${hero.rarity}">${hero.rarity.toUpperCase()}</span><h2>${hero.name}</h2>
          <div class="hero-profile-tags"><span><img src="assets/images/heroes/attributes/camp-${hero.faction}.webp" alt="">${translate(`hero_faction_${hero.faction}`)}</span><span><img src="assets/images/heroes/attributes/role-${hero.role}.webp" alt="">${translate(`hero_role_${hero.role}`)}</span></div>
          <button id="profile-add-hero" class="${isTracked ? 'catalog-added' : 'primary-btn'}" type="button" ${isTracked ? 'disabled' : ''}>${icon(isTracked ? 'check' : 'plus')} ${translate(isTracked ? 'hero_already_added' : 'hero_add_to_mine')}</button>
        </div>
      </div>
      <div class="hero-profile-stats">
        <div class="stat"><span>${translate('hero_strong_against')}</span><strong>${translate(`hero_faction_${profile.counters}`)}</strong></div>
        <div class="stat"><span>${translate('hero_weak_against')}</span><strong>${translate(`hero_faction_${profile.counteredBy}`)}</strong></div>
        <div class="stat"><span>${translate('hero_awakenable')}</span><strong>${translate(profile.awakenable ? 'yes' : 'no')}</strong></div>
        <div class="stat"><span>${translate('hero_max_rank')}</span><strong>50</strong></div>
      </div>
      <section class="hero-skills"><h3>${translate('hero_skills')}</h3><div class="hero-skills-grid">
        ${profile.skills.map(([name, type, unlockLevel]) => `<article class="hero-skill"><span class="hero-skill-slot">${icon('sparkles')}</span><div><strong>${name}</strong><span>${translate(`hero_skill_${type.replaceAll('-', '_')}`)}</span><small>${translate('hero_unlock_level')} ${unlockLevel}</small></div></article>`).join('')}
      </div></section>
    </section>`;
}

/** Renders the shared hero catalogue and lets players reuse entries in My Heroes. */
export function renderHeroesPage(tool) {
  const trackedIds = new Set(getTrackedHeroes().map(hero => hero.catalogId).filter(Boolean));
  const heroId = location.hash.split('/')[2] || '';
  const selectedHero = GAME_DATA.heroes.find(hero => hero.id === heroId);
  if (selectedHero) {
    $('#view').innerHTML = renderPageHeader(tool) + renderHeroProfile(selectedHero, trackedIds);
    $('#profile-add-hero').addEventListener('click', () => {
      addCatalogHero(selectedHero);
      renderHeroesPage(tool);
    });
    lucide.createIcons();
    return;
  }

  $('#view').innerHTML = renderPageHeader(tool) + `
    <section class="panel hero-catalog">
      <div class="catalog-toolbar">
        <label><span>${translate('search')}</span><input id="hero-search" type="search" placeholder="${translate('hero_search_placeholder')}"></label>
        <label><span>${translate('hero_rarity')}</span><select id="hero-filter"><option value="">${translate('all')}</option><option value="ur">UR</option><option value="ssr">SSR</option><option value="sr">SR</option></select></label>
      </div>
      <div class="hero-catalog-grid" id="hero-catalog-grid"></div>
    </section>`;

  const renderCards = () => {
    const query = $('#hero-search').value.trim().toLocaleLowerCase();
    const rarity = $('#hero-filter').value;
    const heroes = GAME_DATA.heroes.filter(hero =>
      (!rarity || hero.rarity === rarity) && (!query || hero.name.toLocaleLowerCase().includes(query))
    );
    $('#hero-catalog-grid').innerHTML = heroes.length
      ? heroes.map(hero => renderHeroCard(hero, trackedIds)).join('')
      : `<p class="heroes-empty">${translate('hero_no_results')}</p>`;

    $$('[data-catalog-id]').forEach(button => button.addEventListener('click', () => {
      const hero = GAME_DATA.heroes.find(candidate => candidate.id === button.dataset.catalogId);
      addCatalogHero(hero);
      trackedIds.add(hero.id);
      renderCards();
    }));
    lucide.createIcons();
  };

  $('#hero-search').addEventListener('input', renderCards);
  $('#hero-filter').addEventListener('change', renderCards);
  renderCards();
}
