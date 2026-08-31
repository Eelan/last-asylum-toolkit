import { $, $$, createLevelOptions } from '../core/dom.js';
import { formatNumber, translate } from '../core/i18n.js';
import { bindPersistentStocks, parseNumber } from '../core/storage.js';
import { renderPageHeader, renderResourceLabel } from '../core/ui.js';
import { calculateRavenProgression, getRavenUpgradeCost } from '../domain/raven.js';

export function renderRavenPage(tool) {
  $('#view').innerHTML = renderPageHeader(tool) + `
 <div class="calc-grid">
  <section class="panel"><div class="form-grid">
   <label><span>${translate('current')}</span><select id="raven-current">${createLevelOptions(1,250,1)}</select></label>
   <label><span>${translate('target')}</span><select id="raven-target">${createLevelOptions(1,250,30)}</select></label>
   <label class="full" id="raven-phase-field" hidden><span>${translate('raven_completed_phases')}</span><select id="raven-completed-phases">
    <option value="0">0 / 5</option><option value="1">1 / 5</option><option value="2">2 / 5</option><option value="3">3 / 5</option><option value="4">4 / 5</option>
   </select><small class="field-hint">${translate('raven_phase_hint')}</small></label>
   <label>${renderResourceLabel('raven-fruit', translate('raven_fruit_stock'))}<input id="raven-fruit-stock" inputmode="numeric" value="0"></label>
   <label>${renderResourceLabel('raven-essence', translate('raven_essence_stock'))}<input id="raven-essence-stock" inputmode="numeric" value="0"></label>
  </div><p class="raven-rule-note">${translate('raven_phase_rule')}</p><div class="quick-actions"><button data-raven-range="1,30">1 → 30</button><button data-raven-range="30,50">30 → 50</button><button data-raven-range="50,90">50 → 90</button><button data-raven-range="90,110">90 → 110</button></div></section>
  <section class="panel result-panel"><span class="result-label">${translate('required')}</span>
   <div class="stat-row"><div class="stat"><span>${translate('raven_fruit')}</span><strong id="raven-fruit-total">—</strong></div><div class="stat"><span>${translate('raven_essence')}</span><strong id="raven-essence-total">—</strong></div></div>
   <div class="stat-row"><div class="stat"><span>${translate('raven_fruit_missing')}</span><strong id="raven-fruit-missing">—</strong></div><div class="stat"><span>${translate('raven_essence_missing')}</span><strong id="raven-essence-missing">—</strong></div></div>
  </section>
 </div>
 <p class="range-error" id="raven-range-error" hidden>${translate('raven_invalid_range')}</p>
 <section class="panel table-panel"><h3>${translate('level_breakdown')}</h3><div class="table-wrap"><table class="raven-table"><thead><tr><th>${translate('raven_upgrade')}</th><th>${translate('raven_fruit')}</th><th>${translate('raven_essence_per_phase')}</th><th>${translate('raven_phases')}</th><th>${translate('raven_essence')}</th><th>${translate('fruit_cumulative')}</th><th>${translate('essence_cumulative')}</th></tr></thead><tbody id="raven-body"></tbody></table></div></section>`;

  // #region Calculation
  const calculate = () => {
    const current = +$('#raven-current').value;
    const target = +$('#raven-target').value;
    const completedPhases = +$('#raven-completed-phases').value;
    const fruitStock = parseNumber($('#raven-fruit-stock').value);
    const essenceStock = parseNumber($('#raven-essence-stock').value);
    const currentCost = getRavenUpgradeCost(current);
    const hasPhases = currentCost.phaseCount > 0 && target > current;
    $('#raven-phase-field').hidden = !hasPhases;
    const progression = calculateRavenProgression(current, target, hasPhases ? completedPhases : 0);
    $('#raven-range-error').hidden = progression.valid;
    if (!progression.valid) {
      ['raven-fruit-total', 'raven-essence-total', 'raven-fruit-missing', 'raven-essence-missing'].forEach(id => $('#' + id).textContent = '—');
      $('#raven-body').innerHTML = '';
      return;
    }
    $('#raven-fruit-total').textContent = formatNumber(progression.fruit);
    $('#raven-essence-total').textContent = formatNumber(progression.essence);
    $('#raven-fruit-missing').textContent = formatNumber(Math.max(0, progression.fruit - fruitStock));
    $('#raven-essence-missing').textContent = formatNumber(Math.max(0, progression.essence - essenceStock));
    $('#raven-body').innerHTML = progression.levels.map(row => `<tr><td>${row.level - 1} → ${row.level}</td><td>${formatNumber(row.fruit)}</td><td>${row.phasesRemaining ? formatNumber(row.essencePerPhase) : '—'}</td><td>${row.phasesRemaining ? `${row.phasesRemaining} / 5` : '—'}</td><td>${formatNumber(row.essence)}</td><td>${formatNumber(row.fruitCumulative)}</td><td>${formatNumber(row.essenceCumulative)}</td></tr>`).join('');
  };
  // #endregion

  // #region Events
  bindPersistentStocks({ 'raven-fruit-stock': 'raven-fruit', 'raven-essence-stock': 'raven-essence' });
  $('#raven-current').addEventListener('input', () => {
    $('#raven-completed-phases').value = '0';
    calculate();
  });
  ['raven-target', 'raven-completed-phases', 'raven-fruit-stock', 'raven-essence-stock'].forEach(id => $('#' + id).addEventListener('input', calculate));
  $$('[data-raven-range]').forEach(button => button.addEventListener('click', () => {
    const [current, target] = button.dataset.ravenRange.split(',');
    $('#raven-current').value = current;
    $('#raven-target').value = target;
    $('#raven-completed-phases').value = '0';
    calculate();
  }));
  calculate();
  // #endregion
}
