import { getResearchInputLevel } from '../core/researches.js';

export const CONSTRUCTION_RESEARCH_IDS = [
  'rapid-construction-1', 'rapid-construction-2', 'rapid-construction-3', 'rapid-construction-4'
];

/** Reads only verified construction-speed research from the shared personal research store. */
export function getConstructionResearchState(trees) {
  const catalogue = Array.isArray(trees) ? trees : [trees];
  return CONSTRUCTION_RESEARCH_IDS.map(id => {
    const tree = catalogue.find(candidate => candidate.researches[id]);
    const research = tree?.researches[id];
    if (!research) return { id, research: null, level: null, bonus: null };
    const level = getResearchInputLevel(tree.id, { id, ...research });
    const levelData = level === null ? null : research.levels.find(item => item.level === level);
    return { id, treeId: tree.id, research, level, bonus: level === 0 ? 0 : levelData?.effectAtLevel ?? null };
  });
}

export function getConstructionResearchSummary(tree, mode = 'detailed', manualBonus = 0) {
  const entries = getConstructionResearchState(tree);
  if (mode === 'manual') return { entries, bonus: Number(manualBonus) || 0, incomplete: false };
  const verified = entries.filter(entry => entry.research);
  return { entries, bonus: verified.reduce((total, entry) => total + (entry.bonus || 0), 0),
    incomplete: entries.some(entry => !entry.research || entry.level === null || entry.bonus === null) };
}
