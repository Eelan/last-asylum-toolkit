import { translate } from './i18n.js';
import { readPreference, writePreference } from '../platform/storage.ts';
export const RESEARCH_TREES = [{
  id: 'development', path: 'data/research/development.json', icon: 'hammer', title: 'research_category_development'
}, {
  id: 'economy', path: 'data/research/economy.json', icon: 'coins', title: 'research_category_economy'
}];

export const RESEARCH_NODE_ICONS = {
  'construction-speed': 'hammer', 'construction-cost': 'badge-percent', 'research-speed': 'flask-conical',
  'barracks-capacity': 'castle', 'training-capacity': 'hard-hat', 'training-speed': 'hard-hat',
  'infirmary-capacity': 'heart-pulse', 'healing-speed': 'cross', 'training-ground-limit': 'tent-tree',
  'grain-production': 'wheat', 'wood-production': 'trees', 'herb-production': 'sprout',
  'grain-gathering-speed': 'wheat', 'wood-gathering-speed': 'trees', 'herb-gathering-speed': 'sprout',
  'farm-limit': 'tractor', 'sawmill-limit': 'axe', 'herb-garden-limit': 'flower-2',
  'grain-protection': 'shield', 'wood-protection': 'shield', 'herb-protection': 'shield'
};

export function getResearchLevel(treeId, research) {
  try {
    return Math.min(research.maxLevel, Math.max(0, Number(readPreference(`lat-research-${treeId}-${research.id}-level`)) || 0));
  } catch (error) {
    return 0;
  }
}

export function setResearchLevel(treeId, researchId, level) {
  try {
    writePreference(`lat-research-${treeId}-${researchId}-level`, String(level));
  } catch (error) {}
}

export function getTreeResearches(tree) {
  return Object.entries(tree.researches).map(([id, research]) => ({ id, ...research }));
}

export function getOrderedNodes(tree) {
  return [...tree.nodes].sort((first, second) => first.position - second.position);
}

/**
 * Lists the requirements for the next point of a research.
 *
 * A tree follows the in-game default observed by the contributor: the first
 * point of each tier requires one point in every research from the preceding
 * tier. Level data can add confirmed exceptions through `prerequisites`.
 */
export function getResearchPrerequisites(tree, research) {
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
export function getUnmetResearchPrerequisites(tree, research) {
  return getResearchPrerequisites(tree, research).filter(prerequisite => {
    if (prerequisite.type !== 'research') return true;

    const prerequisiteResearch = tree.researches[prerequisite.id];
    return !prerequisiteResearch || getResearchLevel(tree.id, {
      id: prerequisite.id,
      ...prerequisiteResearch
    }) < prerequisite.minimumLevel;
  });
}

export function getResearchState(tree, research) {
  const level = getResearchLevel(tree.id, research);
  if (level === research.maxLevel) return 'complete';
  if (getUnmetResearchPrerequisites(tree, research).length) return 'locked';
  return level ? 'in-progress' : 'available';
}

export function getPrerequisiteLabel(tree, prerequisite) {
  if (prerequisite.type === 'research') return tree.researches[prerequisite.id]?.sourceNameFr || prerequisite.id;
  return prerequisite.id;
}

export function getTreeProgress(tree) {
  const researches = getTreeResearches(tree);
  const current = researches.reduce((total, research) => total + getResearchLevel(tree.id, research), 0);
  const maximum = researches.reduce((total, research) => total + research.maxLevel, 0);
  return { current, maximum, percent: maximum ? Math.round((current / maximum) * 100) : 0 };
}

export function getTreeTitle(tree) {
  return translate(RESEARCH_TREES.find(item => item.id === tree.id)?.title || tree.nameKey);
}
