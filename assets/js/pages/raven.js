import { $, $$, createLevelOptions } from '../core/dom.js';
import { formatNumber, translate } from '../core/i18n.js';
import { bindPersistentStocks, parseNumber } from '../core/storage.js';
import { renderPageHeader, renderResourceLabel } from '../core/ui.js';
import { calculateRavenProgression } from '../domain/raven.js';

export function renderRavenPage(tool) {
  $('#view').innerHTML = renderPageHeader(tool) + `
 <div class="calc-grid">
  <section class="panel"><div class="form-grid">
   <label><span>${translate('current')}</span><select id="raven-current">${createLevelOptions(1,250,1)}</select></label>
   <label><span>${translate('target')}</span><select id="raven-target">${createLevelOptions(1,250,30)}</select></label>
   <label>${renderResourceLabel('raven-fruit', translate('raven_fruit_stock'))}<input id="raven-fruit-stock" inputmode="numeric" value="0"></label>
   <label><span>${translate('raven_essence_stock')}</span><input id="raven-essence-stock" inputmode="numeric" value="0"></label>
  </div><div class="quick-actions"><button data-raven-range="1,30">1 → 30</button><button data-raven-range="30,50">30 → 50</button><button data-raven-range="50,90">50 → 90</button><button data-raven-range="90,110">90 → 110</button></div></section>
  <section class="panel result-panel"><span class="result-label">${translate('required')}</span>
   <div class="stat-row"><div class="stat"><span>${translate('raven_fruit')}</span><strong id="raven-fruit-total">—</strong></div><div class="stat"><span>${translate('raven_essence')}</span><strong id="raven-essence-total">—</strong></div></div>
   <div class="stat-row"><div class="stat"><span>${translate('raven_fruit_missing')}</span><strong id="raven-fruit-missing">—</strong></div><div class="stat"><span>${translate('raven_essence_missing')}</span><strong id="raven-essence-missing">—</strong></div></div>
  </section>
 </div>
 <section class="panel table-panel"><h3>${translate('level_breakdown')}</h3><div class="table-wrap"><table><thead><tr><th>${translate('level')}</th><th>${translate('raven_fruit')}</th><th>${translate('raven_essence')}</th><th>${translate('fruit_cumulative')}</th><th>${translate('essence_cumulative')}</th></tr></thead><tbody id="raven-body"></tbody></table></div></section>`;

  // #region Calculation
  const calculate = () => {
    const current = +$('#raven-current').value;
    const target = +$('#raven-target').value;
    const fruitStock = parseNumber($('#raven-fruit-stock').value);
    const essenceStock = parseNumber($('#raven-essence-stock').value);
    const progression = calculateRavenProgression(current, target);
    if (!progression.valid) {
      ['raven-fruit-total', 'raven-essence-total', 'raven-fruit-missing', 'raven-essence-missing'].forEach(id => $('#' + id).textContent = '—');
      $('#raven-body').innerHTML = '';
      return;
    }
    $('#raven-fruit-total').textContent = formatNumber(progression.fruit);
    $('#raven-essence-total').textContent = formatNumber(progression.essence);
    $('#raven-fruit-missing').textContent = formatNumber(Math.max(0, progression.fruit - fruitStock));
    $('#raven-essence-missing').textContent = formatNumber(Math.max(0, progression.essence - essenceStock));
    $('#raven-body').innerHTML = progression.levels.map(row => `<tr><td>${row.level}</td><td>${formatNumber(row.fruit)}</td><td>${formatNumber(row.essence)}</td><td>${formatNumber(row.fruitCumulative)}</td><td>${formatNumber(row.essenceCumulative)}</td></tr>`).join('');
  };
  // #endregion

  // #region Events
  bindPersistentStocks({ 'raven-fruit-stock': 'raven-fruit', 'raven-essence-stock': 'raven-essence' });
  ['raven-current', 'raven-target', 'raven-fruit-stock', 'raven-essence-stock'].forEach(id => $('#' + id).addEventListener('input', calculate));
  $$('[data-raven-range]').forEach(button => button.addEventListener('click', () => {
    const [current, target] = button.dataset.ravenRange.split(',');
    $('#raven-current').value = current;
    $('#raven-target').value = target;
    calculate();
  }));
  calculate();
  // #endregion
}
