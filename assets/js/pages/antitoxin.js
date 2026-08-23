import { GAME_DATA } from '../data.js';
import { $, $$, createLevelOptions } from '../core/dom.js';
import { formatNumber, translate } from '../core/i18n.js';
import { bindPersistentStocks, parseNumber } from '../core/storage.js';
import { renderPageHeader } from '../core/ui.js';
import { calculateAntitoxinProgression } from '../domain/antitoxin.js';

export function renderAntitoxinPage(tool) {
  const maxLevel = Math.max(...Object.keys(GAME_DATA.antitoxin).map(Number));
  $('#view').innerHTML = renderPageHeader(tool) + `
 <div class="calc-grid">
  <section class="panel">
   <div class="form-grid">
    <label><span>${translate('current')}</span><select id="anti-current">${createLevelOptions(1,maxLevel,85)}</select></label>
    <label><span>${translate('target')}</span><select id="anti-target">${createLevelOptions(1,maxLevel,90)}</select></label>
    <label class="full"><span>${translate('stock')}</span><input id="anti-stock" inputmode="numeric" value="0"></label>
   </div>
   <div class="quick-actions"><button data-range="80,85">80 → 85</button><button data-range="85,90">85 → 90</button><button data-range="90,95">90 → 95</button><button data-range="95,100">95 → 100</button></div>
  </section>
  <section class="panel result-panel">
   <span class="result-label">${translate('required')}</span><strong class="result-main" id="anti-total">—</strong><span class="result-unit">${translate('antitoxin')}</span>
   <div class="stat-row"><div class="stat"><span>${translate('missing')}</span><strong id="anti-missing">—</strong></div><div class="stat"><span>${translate('duel_points')}</span><strong id="anti-points">—</strong></div></div>
  </section>
 </div>
 <section class="panel table-panel"><h3>${translate('level_breakdown')}</h3><div class="table-wrap"><table><thead><tr><th>${translate('level')}</th><th>${translate('sanctuary_required')}</th><th>${translate('cost')}</th><th>${translate('cumulative')}</th></tr></thead><tbody id="anti-body"></tbody></table></div></section>`;

  // #region Calculation
  const calculate = () => {
    const current = +$('#anti-current').value;
    const target = +$('#anti-target').value;
    const stock = parseNumber($('#anti-stock').value);
    const progression = calculateAntitoxinProgression(current, target);
    if (!progression.valid) {
      ['anti-total', 'anti-missing', 'anti-points'].forEach(id => $('#' + id).textContent = '—');
      $('#anti-body').innerHTML = '';
      return;
    }
    $('#anti-total').textContent = formatNumber(progression.total);
    $('#anti-missing').textContent = formatNumber(Math.max(0, progression.total - stock));
    $('#anti-points').textContent = formatNumber(progression.duelPoints);
    $('#anti-body').innerHTML = progression.levels.map(row => `<tr><td>${row.level}</td><td>${row.sanctuary}</td><td>${formatNumber(row.cost)}</td><td>${formatNumber(row.cumulative)}</td></tr>`).join('');
  };
  // #endregion

  // #region Events
  bindPersistentStocks({ 'anti-stock': 'antitoxin' });
  ['anti-current', 'anti-target', 'anti-stock'].forEach(id => $('#' + id).addEventListener('input', calculate));
  $$('[data-range]').forEach(button => button.addEventListener('click', () => {
    const [current, target] = button.dataset.range.split(',');
    $('#anti-current').value = current;
    $('#anti-target').value = target;
    calculate();
  }));
  calculate();
  // #endregion
}
