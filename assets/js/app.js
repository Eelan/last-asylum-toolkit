import { TOOLS } from './config/tools.js';
import { $, $$, icon } from './core/dom.js';
import { applyStaticI18n, getLanguage, setLanguage, translate } from './core/i18n.js';
import { formatClockTime, getClockMode, setClockMode } from './core/time.js';
import { checkDueReminders } from './core/reminders.js';
import { renderPageHeader } from './core/ui.js';
import { renderAntitoxinPage } from './pages/antitoxin.js';
import { renderDuelPage } from './pages/duel.js';
import { renderEventsPage } from './pages/events.js';
import { renderFragmentsPage } from './pages/fragments.js';
import { renderHeroesPage } from './pages/heroes.js';
import { renderMyHeroesPage } from './pages/my-heroes.js';
import { renderRavenPage } from './pages/raven.js';
import { renderResearchesPage } from './pages/researches.js';
import { renderSanctuaryPage } from './pages/sanctuary.js';
import { renderSkillsPage } from './pages/skills.js';
import { renderSourcesPage } from './pages/sources.js';
import { renderStocksPage } from './pages/stocks.js';
import { renderTimersPage } from './pages/timers.js';
import { renderWeekPage } from './pages/week.js';

// #region Navigation and shared pages

const NAV_CATEGORIES = ['personal', 'development', 'heroes', 'alliance', 'information'];
const SITE_SECTIONS = ['tools', 'guides'];
let clockMode = getClockMode();

/** Updates the shared clock using the fixed game-server offset or the browser timezone. */
function updateClock() {
  const serverMode = clockMode === 'server';
  const locale = getLanguage() === 'fr' ? 'fr-FR' : 'en-GB';
  const now = new Date();
  $('#clock-label').textContent = translate(serverMode ? 'server_time' : 'local_time');
  $('#clock-time').textContent = formatClockTime(now, clockMode, locale);
  $('#clock-zone').textContent = serverMode ? 'UTC−02:00' : (Intl.DateTimeFormat().resolvedOptions().timeZone || translate('clock_local_short'));
  $$('[data-clock-mode]').forEach(button => {
    const active = button.dataset.clockMode === clockMode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

/**
 * Returns ready tools in the same category and display order as the sidebar.
 * The tool catalogue remains the single source of ordering within each category.
 */
function getNavigationTools(section) {
  const readyTools = TOOLS.filter(tool => tool.ready && tool.section === section);
  const categorizedTools = NAV_CATEGORIES.flatMap(category =>
    readyTools.filter(tool => tool.category === category)
  );

  return categorizedTools;
}

function renderNavLink(tool) {
  return `<a class="nav-link" data-route="${tool.id}" href="#/${tool.id}">${icon(tool.icon)}<span>${translate(tool.title)}</span></a>`;
}

function renderNav(section) {
  const navigationTools = getNavigationTools(section);
  $('#main-nav').innerHTML = `
  <a class="nav-link" data-route="${section}" href="#/${section}">${icon('house')}<span>${translate(`section_${section}`)}</span></a>
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

function renderHome(section) {
  $('#view').innerHTML = `<section class="hero-panel">
  <span class="kicker">${translate(`section_${section}`)}</span>
  <h1>${translate(`section_${section}_title`)}</h1>
  <p>${translate(`section_${section}_subtitle`)}</p>
 </section>
 <section class="tools-grid">${getNavigationTools(section).map(renderToolCard).join('')}</section>`;
  $('#breadcrumb').textContent = translate(`section_${section}`);
}

function renderSectionTabs(section) {
  let tabs = $('.section-tabs');
  if (!tabs) {
    tabs = document.createElement('nav');
    tabs.className = 'section-tabs';
    tabs.setAttribute('aria-label', translate('section_navigation'));
    $('.topbar').insertBefore(tabs, $('.topbar-actions'));
  }
  tabs.innerHTML = SITE_SECTIONS.map(candidate => `<a href="#/${candidate}" class="section-tab${candidate === section ? ' active' : ''}" aria-current="${candidate === section ? 'page' : 'false'}">${icon(candidate === 'tools' ? 'wrench' : 'book-open-text')}<span>${translate(`section_${candidate}`)}</span></a>`).join('');
}

function renderComingSoonPage(tool) {
  $('#view').innerHTML = renderPageHeader(tool) + `<section class="empty-state"><span class="tool-icon">${icon(tool.icon)}</span><h2>${translate('soon')}</h2><p>${translate(tool.desc)}</p><a href="#/" class="primary-btn">${icon('arrow-left')} ${translate('back')}</a></section>`;
}

// #endregion

// #region Routing

/** Page renderers indexed by the route identifiers declared in config/tools.js. */
const PAGE_RENDERERS = {
  timers: renderTimersPage,
  stocks: renderStocksPage,
  researches: renderResearchesPage,
  heroes: renderHeroesPage,
  'my-heroes': renderMyHeroesPage,
  antitoxin: renderAntitoxinPage,
  shards: renderFragmentsPage,
  skills: renderSkillsPage,
  duel: renderDuelPage,
  week: renderWeekPage,
  events: renderEventsPage,
  sources: renderSourcesPage,
  raven: renderRavenPage,
  sanctuary: renderSanctuaryPage
};

function renderRoute() {
  const route = (location.hash.replace(/^#\//, '') || 'home').split('/')[0];
  const routedTool = TOOLS.find(candidate => candidate.id === route);
  const section = SITE_SECTIONS.includes(route) ? route : (routedTool?.section || 'tools');
  renderNav(section);
  renderSectionTabs(section);
  applyStaticI18n();
  updateClock();

  if (route === 'home' || SITE_SECTIONS.includes(route)) {
    renderHome(section);
  } else {
    const tool = routedTool;
    if (!tool) {
      location.hash = '#/';
      return;
    }
    $('#breadcrumb').textContent = translate(tool.title);
    if (!tool.ready) renderComingSoonPage(tool);
    else PAGE_RENDERERS[route]?.(tool);
  }

  $$('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.route === route || (route === 'home' && link.dataset.route === 'tools')));
  lucide.createIcons();
  $('.sidebar').classList.remove('open');
}

// #endregion

// #region Application bootstrap

$$('.flag-btn').forEach(button => button.addEventListener('click', () => {
  setLanguage(button.dataset.lang);
  renderRoute();
}));
$$('[data-clock-mode]').forEach(button => button.addEventListener('click', () => {
  clockMode = button.dataset.clockMode;
  setClockMode(clockMode);
  renderRoute();
}));
$('#mobile-menu').addEventListener('click', () => $('.sidebar').classList.toggle('open'));
window.addEventListener('hashchange', renderRoute);
renderRoute();
setInterval(updateClock, 1000);
const notifyReminder = reminder => {
  const title = translate('timer_notification_title');
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, { body: reminder.title });
    } catch (error) {
      window.alert(`${title}\n${reminder.title}`);
    }
  } else {
    window.alert(`${title}\n${reminder.title}`);
  }
};
checkDueReminders(notifyReminder);
setInterval(() => checkDueReminders(notifyReminder), 1000);

// #endregion
