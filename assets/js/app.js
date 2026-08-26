import { TOOLS } from './config/tools.js';
import { $, $$, icon } from './core/dom.js';
import { applyStaticI18n, setLanguage, translate } from './core/i18n.js';
import { renderPageHeader } from './core/ui.js';
import { renderAntitoxinPage } from './pages/antitoxin.js';
import { renderDuelPage } from './pages/duel.js';
import { renderFragmentsPage } from './pages/fragments.js';
import { renderHeroesPage } from './pages/heroes.js';
import { renderMyHeroesPage } from './pages/my-heroes.js';
import { renderRavenPage } from './pages/raven.js';
import { renderSanctuaryPage } from './pages/sanctuary.js';
import { renderSkillsPage } from './pages/skills.js';
import { renderSourcesPage } from './pages/sources.js';
import { renderStocksPage } from './pages/stocks.js';
import { renderWeekPage } from './pages/week.js';

// #region Navigation and shared pages

const NAV_CATEGORIES = ['personal', 'development', 'heroes', 'alliance', 'information'];

/**
 * Returns ready tools in the same category and display order as the sidebar.
 * The tool catalogue remains the single source of ordering within each category.
 */
function getNavigationTools() {
  const readyTools = TOOLS.filter(tool => tool.ready);
  const categorizedTools = NAV_CATEGORIES.flatMap(category =>
    readyTools.filter(tool => tool.category === category)
  );

  return categorizedTools;
}

function renderNavLink(tool) {
  return `<a class="nav-link" data-route="${tool.id}" href="#/${tool.id}">${icon(tool.icon)}<span>${translate(tool.title)}</span></a>`;
}

function renderNav() {
  const navigationTools = getNavigationTools();
  $('#main-nav').innerHTML = `
  <a class="nav-link" data-route="home" href="#/">${icon('house')}<span>${translate('home')}</span></a>
  ${NAV_CATEGORIES.map(category => {
    const categoryTools = navigationTools.filter(tool => tool.category === category);
    if (!categoryTools.length) return '';
    return `<div class="nav-group-title">${translate(`category_${category}`)}</div>${categoryTools.map(renderNavLink).join('')}`;
  }).join('')}
 `;
}

function renderToolCard(tool) {
  return `<a class="tool-card" href="#/${tool.id}">
   <span class="tool-icon">${icon(tool.icon)}</span>
   <h3>${translate(tool.title)}</h3><p>${translate(tool.desc)}</p>
   <span class="tool-open">${translate('open')} ${icon('arrow-right')}</span>
 </a>`;
}

function renderHome() {
  $('#view').innerHTML = `<section class="hero-panel">
  <span class="kicker">${translate('tools')}</span>
  <h1>${translate('tagline')}</h1>
  <p>${translate('subtitle')}</p>
 </section>
 <section class="tools-grid">${getNavigationTools().map(renderToolCard).join('')}</section>`;
  $('#breadcrumb').textContent = translate('home');
}

function renderComingSoonPage(tool) {
  $('#view').innerHTML = renderPageHeader(tool) + `<section class="empty-state"><span class="tool-icon">${icon(tool.icon)}</span><h2>${translate('soon')}</h2><p>${translate(tool.desc)}</p><a href="#/" class="primary-btn">${icon('arrow-left')} ${translate('back')}</a></section>`;
}

// #endregion

// #region Routing

/** Page renderers indexed by the route identifiers declared in config/tools.js. */
const PAGE_RENDERERS = {
  stocks: renderStocksPage,
  heroes: renderHeroesPage,
  'my-heroes': renderMyHeroesPage,
  antitoxin: renderAntitoxinPage,
  shards: renderFragmentsPage,
  skills: renderSkillsPage,
  duel: renderDuelPage,
  week: renderWeekPage,
  sources: renderSourcesPage,
  raven: renderRavenPage,
  sanctuary: renderSanctuaryPage
};

function renderRoute() {
  const route = (location.hash.replace(/^#\//, '') || 'home').split('/')[0];
  renderNav();
  applyStaticI18n();

  if (route === 'home') {
    renderHome();
  } else {
    const tool = TOOLS.find(candidate => candidate.id === route);
    if (!tool) {
      location.hash = '#/';
      return;
    }
    $('#breadcrumb').textContent = translate(tool.title);
    if (!tool.ready) renderComingSoonPage(tool);
    else PAGE_RENDERERS[route]?.(tool);
  }

  $$('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.route === route));
  lucide.createIcons();
  $('.sidebar').classList.remove('open');
}

// #endregion

// #region Application bootstrap

$$('.flag-btn').forEach(button => button.addEventListener('click', () => {
  setLanguage(button.dataset.lang);
  renderRoute();
}));
$('#mobile-menu').addEventListener('click', () => $('.sidebar').classList.toggle('open'));
window.addEventListener('hashchange', renderRoute);
renderRoute();

// #endregion
