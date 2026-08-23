import { GAME_DATA } from '../data.js';
import { $ } from '../core/dom.js';
import { formatNumber, translate } from '../core/i18n.js';
import { bindPersistentStocks, parseNumber } from '../core/storage.js';
import { renderPageHeader } from '../core/ui.js';

const DUEL_SETTINGS = {
  'd-target': 'lat-duel-target',
  'd-bonus': 'lat-duel-research-bonus'
};

/** Restores planner-only settings; account stocks use the shared stock service. */
function bindPlannerSettings() {
  Object.entries(DUEL_SETTINGS).forEach(([id, key]) => {
    try {
      $('#' + id).value = localStorage.getItem(key) ?? '0';
    } catch (error) {}
    $('#' + id).addEventListener('input', () => {
      try {
        localStorage.setItem(key, $('#' + id).value);
      } catch (error) {}
    });
  });
}

export function renderDuelPage(tool) {
  $('#view').innerHTML = renderPageHeader(tool) + `
 <div class="calc-grid"><section class="panel"><div class="form-grid">
  <label><span>${translate('duel_target')}</span><input id="d-target" inputmode="numeric" value="0"></label>
  <label><span>${translate('research_bonus')}</span><input id="d-bonus" inputmode="numeric" value="0"></label>
  <label><span>${translate('antitoxin')}</span><input id="d-a" inputmode="numeric" value="0"></label>
  <label><span>${translate('recruits')}</span><input id="d-r" inputmode="numeric" value="0"></label>
  <label><span>${translate('ur_omni_shards')}</span><input id="d-u" inputmode="numeric" value="0"></label>
  <label><span>${translate('ssr_omni_shards')}</span><input id="d-s" inputmode="numeric" value="0"></label>
  <label><span>${translate('sr_omni_shards')}</span><input id="d-sr" inputmode="numeric" value="0"></label>
  <label><span>${translate('skill_badges')}</span><input id="d-b" inputmode="numeric" value="0"></label>
 </div></section>
 <section class="panel result-panel"><span class="result-label">${translate('available_points')}</span><strong class="result-main" id="d-total">0</strong><span class="result-unit">${translate('hero_phase')}</span><div class="stat-row"><div class="stat"><span>${translate('duel_target')}</span><strong id="d-target-result">0</strong></div><div class="stat"><span>${translate('points_missing')}</span><strong id="d-missing">0</strong></div></div></section></div>
 <section class="panel table-panel"><h3>${translate('consumption_plan')}</h3><div class="table-wrap"><table><thead><tr><th>${translate('resource')}</th><th>${translate('stock')}</th><th>${translate('use')}</th><th>${translate('keep')}</th><th>${translate('duel_points')}</th></tr></thead><tbody id="d-plan"></tbody></table></div><p class="form-note">${translate('duel_plan_note')}</p></section>`;

  // #region Planner algorithm
  const calculate = () => {
    const duel = GAME_DATA.duel;
    // Order defines the default spending priority. A final pass uses the
    // smallest remaining point unit to reduce target overshoot.
    const resources = [
      { id: 'd-u', label: translate('ur_omni_shards'), points: duel.urShardPoints, unit: 1 },
      { id: 'd-s', label: translate('ssr_omni_shards'), points: duel.ssrShardPoints, unit: 1 },
      { id: 'd-r', label: translate('recruits'), points: duel.recruitPoints, unit: 1 },
      { id: 'd-sr', label: translate('sr_omni_shards'), points: duel.srShardPoints, unit: 1 },
      { id: 'd-b', label: translate('skill_badges'), points: duel.skillBadgePoints, unit: 1 },
      { id: 'd-a', label: translate('antitoxin'), points: 1, unit: duel.antitoxinUnit }
    ].map(resource => ({ ...resource, stock: parseNumber($('#' + resource.id).value), useUnits: 0 }));

    const multiplier = 1 + parseNumber($('#d-bonus').value) / 100;
    const target = parseNumber($('#d-target').value);
    const availableBasePoints = resources.reduce((sum, resource) => sum + Math.floor(resource.stock / resource.unit) * resource.points, 0);
    let remainingBasePoints = target > 0 ? Math.ceil(target / multiplier) : 0;

    resources.forEach(resource => {
      const availableUnits = Math.floor(resource.stock / resource.unit);
      resource.useUnits = Math.min(availableUnits, Math.floor(remainingBasePoints / resource.points));
      remainingBasePoints -= resource.useUnits * resource.points;
    });

    if (remainingBasePoints > 0) {
      const smallestAvailableUnit = [...resources]
        .filter(resource => resource.useUnits < Math.floor(resource.stock / resource.unit))
        .sort((a, b) => a.points - b.points)[0];
      if (smallestAvailableUnit) smallestAvailableUnit.useUnits += 1;
    }

    const plannedBasePoints = resources.reduce((sum, resource) => sum + resource.useUnits * resource.points, 0);
    const plannedPoints = Math.floor(plannedBasePoints * multiplier);
    $('#d-total').textContent = formatNumber(Math.floor(availableBasePoints * multiplier));
    $('#d-target-result').textContent = formatNumber(target);
    $('#d-missing').textContent = formatNumber(target > 0 ? Math.max(0, target - plannedPoints) : 0);
    $('#d-plan').innerHTML = resources.map(resource => {
      const use = resource.useUnits * resource.unit;
      return `<tr><td>${resource.label}</td><td>${formatNumber(resource.stock)}</td><td>${formatNumber(use)}</td><td>${formatNumber(resource.stock - use)}</td><td>${formatNumber(Math.floor(resource.useUnits * resource.points * multiplier))}</td></tr>`;
    }).join('');
  };
  // #endregion

  // #region Events and persistence
  bindPlannerSettings();
  bindPersistentStocks({
    'd-a': 'antitoxin', 'd-r': 'recruitments', 'd-u': 'ur-omni-shards',
    'd-s': 'ssr-omni-shards', 'd-sr': 'sr-omni-shards', 'd-b': 'skill-badges'
  });
  ['d-target', 'd-bonus', 'd-a', 'd-r', 'd-u', 'd-s', 'd-sr', 'd-b'].forEach(id => $('#' + id).addEventListener('input', calculate));
  calculate();
  // #endregion
}
