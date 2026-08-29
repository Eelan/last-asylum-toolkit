import { loadJsonDocument } from '../core/datasets.js';
import { $, $$, icon } from '../core/dom.js';
import { translate } from '../core/i18n.js';
import { renderPageHeader } from '../core/ui.js';

const RESEARCH_TREES = [{
  id: 'development', path: '../../data/research/development.json', icon: 'hammer', title: 'research_category_development'
}, {
  id: 'economy', path: '../../data/research/economy.json', icon: 'coins', title: 'research_category_economy'
}];

const RESEARCH_NODE_ICONS = {
  'construction-speed': 'hammer', 'construction-cost': 'badge-percent', 'research-speed': 'flask-conical',
  'barracks-capacity': 'castle', 'training-capacity': 'hard-hat', 'training-speed': 'hard-hat',
  'infirmary-capacity': 'heart-pulse', 'healing-speed': 'cross', 'training-ground-limit': 'tent-tree',
  'grain-production': 'wheat', 'wood-production': 'trees', 'herb-production': 'sprout',
  'grain-gathering-speed': 'wheat', 'wood-gathering-speed': 'trees', 'herb-gathering-speed': 'sprout',
  'farm-limit': 'tractor', 'sawmill-limit': 'axe', 'herb-garden-limit': 'flower-2',
  'grain-protection': 'shield', 'wood-protection': 'shield', 'herb-protection': 'shield'
};

function getResearchLevel(treeId, research) {
  try {
    return Math.min(research.maxLevel, Math.max(0, Number(localStorage.getItem(`lat-research-${treeId}-${research.id}-level`)) || 0));
  } catch (error) {
    return 0;
  }
}

function setResearchLevel(treeId, researchId, level) {
  try {
    localStorage.setItem(`lat-research-${treeId}-${researchId}-level`, String(level));
  } catch (error) {}
}

function getTreeResearches(tree) {
  return Object.entries(tree.researches).map(([id, research]) => ({ id, ...research }));
}

function getOrderedNodes(tree) {
  return [...tree.nodes].sort((first, second) => first.position - second.position);
}

/**
 * Lists the requirements for the next point of a research.
 *
 * A tree follows the in-game default observed by the contributor: the first
 * point of each tier requires one point in every research from the preceding
 * tier. Level data can add confirmed exceptions through `prerequisites`.
 */
function getResearchPrerequisites(tree, research) {
  const level = getResearchLevel(tree.id, research);
  const prerequisites = [];
  const nodes = getOrderedNodes(tree);
  const nodeIndex = nodes.findIndex(node => node.id === research.nodeId);

  if (level === 0 && nodeIndex > 0) {
    nodes[nodeIndex - 1].researchIds.forEach(id => {
      prerequisites.push({ type: 'research', id, minimumLevel: 1 });
    });
  }

  const nextLevel = research.levels.find(item => item.level === level + 1);
  (nextLevel?.prerequisites || []).forEach(prerequisite => prerequisites.push(prerequisite));

  return prerequisites.filter((prerequisite, index, all) => all.findIndex(item => (
    item.type === prerequisite.type
      && item.id === prerequisite.id
      && item.minimumLevel === prerequisite.minimumLevel
  )) === index);
}

/** Returns requirements that are not yet satisfied by the locally saved progress. */
function getUnmetResearchPrerequisites(tree, research) {
  return getResearchPrerequisites(tree, research).filter(prerequisite => {
    if (prerequisite.type !== 'research') return true;

    const prerequisiteResearch = tree.researches[prerequisite.id];
    return !prerequisiteResearch || getResearchLevel(tree.id, {
      id: prerequisite.id,
      ...prerequisiteResearch
    }) < prerequisite.minimumLevel;
  });
}

function getResearchState(tree, research) {
  const level = getResearchLevel(tree.id, research);
  if (level === research.maxLevel) return 'complete';
  if (getUnmetResearchPrerequisites(tree, research).length) return 'locked';
  return level ? 'in-progress' : 'available';
}

function getPrerequisiteLabel(tree, prerequisite) {
  if (prerequisite.type === 'research') return tree.researches[prerequisite.id]?.sourceNameFr || prerequisite.id;
  return prerequisite.id;
}

function getTreeProgress(tree) {
  const researches = getTreeResearches(tree);
  const current = researches.reduce((total, research) => total + getResearchLevel(tree.id, research), 0);
  const maximum = researches.reduce((total, research) => total + research.maxLevel, 0);
  return { current, maximum, percent: maximum ? Math.round((current / maximum) * 100) : 0 };
}

function getTreeTitle(tree) {
  return translate(RESEARCH_TREES.find(item => item.id === tree.id)?.title || tree.nameKey);
}

function renderResearchCard(tree, selectedId) {
  const progress = getTreeProgress(tree);
  const config = RESEARCH_TREES.find(item => item.id === tree.id);
  return `<button class="research-card research-tree-selector ${tree.id === selectedId ? 'selected' : ''}" type="button" data-research-category="${tree.id}">
    <span class="research-card-icon">${icon(config.icon)}</span>
    <strong>${progress.percent}%</strong>
    <span>${getTreeTitle(tree)}</span>
    <small>${getTreeResearches(tree).length} ${translate('researches_count')}</small>
  </button>`;
}

function renderResearchNode(tree, research, selectedResearchId) {
  const level = getResearchLevel(tree.id, research);
  const state = getResearchState(tree, research);
  const complete = state === 'complete';
  const locked = state === 'locked';
  const actionLabel = translate('research_click_to_select');
  return `<button class="research-node game-tree-node ${state} ${research.id === selectedResearchId ? 'selected' : ''}" type="button" data-research-select="${research.id}" title="${research.sourceNameFr} — ${actionLabel}" aria-label="${research.sourceNameFr}, ${level}/${research.maxLevel}. ${actionLabel}">
    <span class="research-node-icon">${icon(locked ? 'lock-keyhole' : (complete ? 'badge-check' : (RESEARCH_NODE_ICONS[research.category] || 'flask-conical')))}</span>
    <span class="research-node-content"><strong>${research.sourceNameFr}</strong><small>${research.sourceDescriptionFr || ''}</small></span>
    <span class="research-node-level">${level}/${research.maxLevel}</span>
  </button>`;
}

function renderResearchModal(tree, researchId) {
  const research = { id: researchId, ...tree.researches[researchId] };
  const level = getResearchLevel(tree.id, research);
  const unmetPrerequisites = getUnmetResearchPrerequisites(tree, research);
  const prerequisites = unmetPrerequisites.length ? `<p class="research-prerequisites"><strong>${translate('research_requires')}</strong>${unmetPrerequisites.map(prerequisite => `${getPrerequisiteLabel(tree, prerequisite)} (${prerequisite.minimumLevel})`).join(', ')}</p>` : '';
  const canIncrease = level < research.maxLevel && !unmetPrerequisites.length;
  return `<dialog class="research-modal" data-research-modal aria-labelledby="research-modal-title">
    <aside class="research-detail-card">
    <button class="research-modal-close" type="button" data-research-close aria-label="${translate('research_close_modal')}" title="${translate('research_close_modal')}">${icon('x')}</button>
    <span class="research-detail-icon">${icon(RESEARCH_NODE_ICONS[research.category] || 'flask-conical')}</span>
    <div><span class="kicker">${translate('research_selected')}</span><h4 id="research-modal-title">${research.sourceNameFr}</h4><p>${research.sourceDescriptionFr || ''}</p>${prerequisites}</div>
    <div class="research-level-controls" aria-label="${translate('research_level_controls')}">
      <button type="button" data-research-adjust="decrease" aria-label="${translate('research_decrease_level')}" title="${translate('research_decrease_level')}" ${level === 0 ? 'disabled' : ''}>${icon('minus')}</button>
      <strong><small>${translate('research_level')}</small>${level}/${research.maxLevel}</strong>
      <button type="button" data-research-adjust="increase" aria-label="${translate('research_increase_level')}" title="${translate('research_increase_level')}" ${canIncrease ? '' : 'disabled'}>${icon('plus')}</button>
    </div>
    </aside>
  </dialog>`;
}

function renderResearchTree(tree, selectedResearchId) {
  const progress = getTreeProgress(tree);
  const nodes = getOrderedNodes(tree);
  const renderTier = (node, previousNode, nextNode) => {
    const researches = node.researchIds.map(id => `<div class="research-tree-node-slot">${renderResearchNode(tree, { id, ...tree.researches[id] }, selectedResearchId)}</div>`).join('');
    const connectionClasses = [
      previousNode ? `receives-${previousNode.researchIds.length}` : '',
      nextNode ? `feeds-${nextNode.researchIds.length}` : ''
    ].filter(Boolean).join(' ');
    return `<div class="research-tree-tier ${connectionClasses}">${researches}</div>`;
  };
  const renderConnector = (fromNode, toNode) => `<div class="research-tree-connector from-${fromNode.researchIds.length} to-${toNode.researchIds.length}" aria-hidden="true">
    <span class="research-connector-parent-rail"></span><span class="research-connector-trunk"></span><span class="research-connector-child-rail"></span>
  </div>`;
  const treeMarkup = nodes.map((node, index) => `${renderTier(node, nodes[index - 1], nodes[index + 1])}${nodes[index + 1] ? renderConnector(node, nodes[index + 1]) : ''}`).join('');
  return `<section class="panel research-tree-panel research-experience">
    <div class="research-tree-head"><div><span class="kicker">${translate('research_progress')}</span><h3>${getTreeTitle(tree)}</h3></div><strong>${progress.percent}%</strong></div>
    <div class="research-progress"><span style="width:${progress.percent}%"></span></div>
    <div class="research-tree-viewport"><div class="research-tree-canvas"><div class="research-game-tree">${treeMarkup}</div></div></div>
    <p class="research-click-hint">${icon('mouse-pointer-click')} ${translate('research_click_to_select')}</p>
    <p class="form-note">${translate('research_tree_verified')}</p>
  </section>`;
}

function renderLoadingPage(tool) {
  $('#view').innerHTML = renderPageHeader(tool) + `<section class="panel"><p class="form-note">${translate('research_loading')}</p></section>`;
}

/** Renders the research trees currently verified from in-game records. */
export function renderResearchesPage(tool) {
  renderLoadingPage(tool);

  Promise.all(RESEARCH_TREES.map(item => loadJsonDocument(item.path))).then(trees => {
    let selectedId = trees[0].id;
    let selectedResearchId = null;

    const render = () => {
      const selectedTree = trees.find(tree => tree.id === selectedId);
      $('#view').innerHTML = renderPageHeader(tool) + `<section class="research-overview research-experience">
        <p class="sources-intro">${translate('researches_intro')}</p>
        <div class="research-grid">${trees.map(tree => renderResearchCard(tree, selectedId)).join('')}</div>
      </section>${renderResearchTree(selectedTree, selectedResearchId)}${selectedResearchId ? renderResearchModal(selectedTree, selectedResearchId) : ''}`;

      $$('[data-research-category]').forEach(button => button.addEventListener('click', () => {
        selectedId = button.dataset.researchCategory;
        selectedResearchId = null;
        render();
      }));
      $$('[data-research-select]').forEach(node => node.addEventListener('click', () => {
        selectedResearchId = node.dataset.researchSelect;
        render();
      }));
      $$('[data-research-adjust]').forEach(button => button.addEventListener('click', () => {
        const research = { id: selectedResearchId, ...selectedTree.researches[selectedResearchId] };
        const currentLevel = getResearchLevel(selectedTree.id, research);
        const levelChange = button.dataset.researchAdjust === 'increase' ? 1 : -1;
        const nextLevel = Math.min(research.maxLevel, Math.max(0, currentLevel + levelChange));

        if (levelChange < 0 || !getUnmetResearchPrerequisites(selectedTree, research).length) {
          setResearchLevel(selectedTree.id, selectedResearchId, nextLevel);
          render();
        }
      }));
      lucide.createIcons();

      const modal = $('[data-research-modal]');
      if (modal) {
        modal.showModal();
        modal.addEventListener('close', () => { selectedResearchId = null; });
        modal.addEventListener('click', event => {
          if (event.target === modal) modal.close();
        });
      }
      $('[data-research-close]')?.addEventListener('click', () => modal.close());
    };

    render();
  }).catch(() => {
    $('#view').innerHTML = renderPageHeader(tool) + `<section class="panel"><p class="form-note">${translate('research_load_error')}</p></section>`;
  });
}
