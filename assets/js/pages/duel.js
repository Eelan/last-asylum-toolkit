import { $ } from '../core/dom.js';
import { formatNumber, translate } from '../core/i18n.js';
import { bindPersistentStocks, parseNumber } from '../core/storage.js';
import { renderPageHeader } from '../core/ui.js';
import { calculateDuelPlan } from '../domain/duel.js';

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
    const target = parseNumber($('#d-target').value);
    const plan = calculateDuelPlan({
      target,
      bonus: parseNumber($('#d-bonus').value),
      stocks: {
        antitoxin: parseNumber($('#d-a').value),
        recruits: parseNumber($('#d-r').value),
        ur: parseNumber($('#d-u').value),
        ssr: parseNumber($('#d-s').value),
        sr: parseNumber($('#d-sr').value),
        badges: parseNumber($('#d-b').value)
      }
    });
    const labels = {
      ur: translate('ur_omni_shards'), ssr: translate('ssr_omni_shards'),
      recruits: translate('recruits'), sr: translate('sr_omni_shards'),
      badges: translate('skill_badges'), antitoxin: translate('antitoxin')
    };

    $('#d-total').textContent = formatNumber(plan.availablePoints);
    $('#d-target-result').textContent = formatNumber(target);
    $('#d-missing').textContent = formatNumber(plan.missingPoints);
    $('#d-plan').innerHTML = plan.resources.map(resource => `<tr><td>${labels[resource.key]}</td><td>${formatNumber(resource.stock)}</td><td>${formatNumber(resource.use)}</td><td>${formatNumber(resource.keep)}</td><td>${formatNumber(resource.points)}</td></tr>`).join('');
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
