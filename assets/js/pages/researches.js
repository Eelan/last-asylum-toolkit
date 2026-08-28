import { RESEARCH_CATALOG, RESEARCH_CATEGORIES, RESEARCH_TREE_LAYOUTS } from '../data/researches.js';
import { $, $$, icon } from '../core/dom.js';
import { translate } from '../core/i18n.js';
import { renderPageHeader } from '../core/ui.js';

const CATEGORY_ICONS = {
  development: 'hammer', economy: 'coins', hero: 'shield', soldier: 'hard-hat',
  'squad-1': 'swords', 'squad-2': 'swords', 'squad-3': 'swords', 'squad-4': 'swords',
  'alliance-duel': 'trophy', 'caravan-transport': 'package', 'elite-troop': 'shield-check',
  'offensive-tactics': 'crosshair', 'defensive-tactics': 'shield', 'full-development': 'castle',
  'prosperous-economy': 'landmark', 'warrior-mastery': 'axe', 'ranger-mastery': 'crosshair',
  'warlock-mastery': 'wand-sparkles'
};

const RESEARCH_NODE_ICONS = {
  'rapid-construction-i': 'hammer', 'rapid-construction-ii': 'hammer', 'construction-master': 'badge-percent',
  'research-upgrade-i': 'flask-conical', 'research-upgrade-ii': 'flask-conical',
  'barracks-expansion-i': 'castle', 'barracks-expansion-ii': 'castle',
  'training-grounds-expansion-i': 'hard-hat', 'training-grounds-expansion-ii': 'hard-hat',
  'training-specialization-i': 'hard-hat', 'training-specialization-ii': 'hard-hat', 'training-specialization-iii': 'hard-hat',
  'infirmary-expansion-i': 'heart-pulse', 'infirmary-expansion-ii': 'heart-pulse',
  'quick-bandage-i': 'cross', 'quick-bandage-ii': 'cross', 'quick-bandage-iii': 'cross',
  'extra-training-grounds': 'tent-tree'
};

function getResearchLevel(research) {
  try {
    return Math.min(research.maxLevel, Math.max(0, Number(localStorage.getItem(`lat-research-${research.id}-level`)) || 0));
  } catch (error) {
    return 0;
  }
}

function setResearchLevel(researchId, level) {
  try {
    localStorage.setItem(`lat-research-${researchId}-level`, String(level));
  } catch (error) {}
}

function getCategoryResearches(categoryId) {
  return RESEARCH_CATALOG.filter(research => research.category === categoryId);
}

function getCategoryProgress(categoryId) {
  const researches = getCategoryResearches(categoryId);
  const current = researches.reduce((total, research) => total + getResearchLevel(research), 0);
  const maximum = researches.reduce((total, research) => total + research.maxLevel, 0);
  return { current, maximum, percent: maximum ? Math.round((current / maximum) * 100) : 0 };
}

function renderResearchCard(category, selectedId) {
  const progress = getCategoryProgress(category.id);
  return `<button class="research-card ${category.id === selectedId ? 'selected' : ''}" type="button" data-research-category="${category.id}">
    <span class="research-card-icon">${icon(CATEGORY_ICONS[category.id] || 'flask-conical')}</span>
    <strong>${progress.percent}%</strong>
    <span>${translate(`research_category_${category.id}`)}</span>
    <small>${getCategoryResearches(category.id).length} ${translate('researches_count')}</small>
  </button>`;
}

function renderResearchNode(research, gameTree = false) {
  const level = getResearchLevel(research);
  const complete = level === research.maxLevel;
  return `<button class="research-node ${gameTree ? 'game-tree-node' : ''} ${complete ? 'complete' : ''}" type="button" data-research-upgrade="${research.id}" title="${research.name} — ${translate('research_click_to_upgrade')}" aria-label="${research.name}, ${level}/${research.maxLevel}. ${translate('research_click_to_upgrade')}">
    <span class="research-node-icon">${icon(complete ? 'badge-check' : (RESEARCH_NODE_ICONS[research.id] || 'flask-conical'))}</span>
    <span class="research-node-content"><strong>${research.name}</strong><small>${research.description}</small></span>
    <span class="research-node-level">${level}/${research.maxLevel}</span>
  </button>`;
}

function renderVerifiedTree(category, researches) {
  const byId = new Map(researches.map(research => [research.id, research]));
  return `<div class="research-game-tree">${RESEARCH_TREE_LAYOUTS[category.id].map(row => `<div class="research-tree-tier ${row.length > 1 ? 'branch' : ''}">${row.map(id => renderResearchNode(byId.get(id), true)).join('')}</div>`).join('')}</div>`;
}

function renderResearchTree(category) {
  const researches = getCategoryResearches(category.id);
  const progress = getCategoryProgress(category.id);
  const hasVerifiedTree = Boolean(RESEARCH_TREE_LAYOUTS[category.id]);
  return `<section class="panel research-tree-panel">
    <div class="research-tree-head"><div><span class="kicker">${translate('research_progress')}</span><h3>${translate(`research_category_${category.id}`)}</h3></div><strong>${progress.percent}%</strong></div>
    <div class="research-progress"><span style="width:${progress.percent}%"></span></div>
    <div class="research-tree-canvas">${hasVerifiedTree ? renderVerifiedTree(category, researches) : `<div class="research-tree-root"><span>${icon(CATEGORY_ICONS[category.id] || 'flask-conical')}</span><strong>${translate(`research_category_${category.id}`)}</strong></div><div class="research-node-grid">${researches.map(renderResearchNode).join('')}</div>`}</div>
    <p class="research-click-hint">${icon('mouse-pointer-click')} ${translate('research_click_to_upgrade')}</p>
    <p class="form-note">${translate(hasVerifiedTree ? 'research_tree_verified' : 'research_catalogue_note')}</p>
  </section>`;
}

/** Renders the complete, locally tracked catalogue of research nodes. */
export function renderResearchesPage(tool) {
  let selectedId = RESEARCH_CATEGORIES[0].id;

  const render = () => {
    const selectedCategory = RESEARCH_CATEGORIES.find(category => category.id === selectedId);
    $('#view').innerHTML = renderPageHeader(tool) + `<section class="research-overview">
      <p class="sources-intro">${translate('researches_intro')}</p>
      <div class="research-grid">${RESEARCH_CATEGORIES.map(category => renderResearchCard(category, selectedId)).join('')}</div>
    </section>${renderResearchTree(selectedCategory)}`;

    $$('[data-research-category]').forEach(button => button.addEventListener('click', () => {
      selectedId = button.dataset.researchCategory;
      render();
    }));
    $$('[data-research-upgrade]').forEach(node => node.addEventListener('click', () => {
      const research = RESEARCH_CATALOG.find(item => item.id === node.dataset.researchUpgrade);
      const nextLevel = Math.min(research.maxLevel, getResearchLevel(research) + 1);
      setResearchLevel(research.id, nextLevel);
      render();
    }));
    lucide.createIcons();
  };

  render();
}
