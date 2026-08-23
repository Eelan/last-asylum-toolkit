import { $, createLevelOptions } from '../core/dom.js';
import { formatDuration, formatNumber, translate } from '../core/i18n.js';
import { renderPageHeader } from '../core/ui.js';
import { calculateSanctuaryProgression } from '../domain/sanctuary.js';

function formatPrerequisites(prerequisites) {
  if (!prerequisites.length) return '—';
  return prerequisites
    .map(([building, level]) => `${translate(`building_${building}`)} ${translate('level_abbr')} ${level}`)
    .join(' · ');
}

export function renderSanctuaryPage(tool) {
  $('#view').innerHTML = renderPageHeader(tool) + `
 <div class="calc-grid">
  <section class="panel"><div class="form-grid">
   <label><span>${translate('current')}</span><select id="sanctuary-current">${createLevelOptions(1,30,18)}</select></label>
   <label><span>${translate('target')}</span><select id="sanctuary-target">${createLevelOptions(1,30,20)}</select></label>
  </div></section>
  <section class="panel result-panel">
   <span class="result-label">${translate('hero_level_cap')}</span><strong class="result-main" id="sanctuary-hero-cap">—</strong>
   <div class="stat-row"><div class="stat"><span>${translate('power_gained')}</span><strong id="sanctuary-power">—</strong></div><div class="stat"><span>${translate('total_time')}</span><strong id="sanctuary-time">—</strong></div></div>
  </section>
 </div>
 <section class="panel table-panel"><h3>${translate('total_cost')}</h3><div class="sanctuary-totals">
  <div class="stat"><span>${translate('grain')}</span><strong id="sanctuary-grain">—</strong></div>
  <div class="stat"><span>${translate('timber')}</span><strong id="sanctuary-timber">—</strong></div>
  <div class="stat"><span>${translate('herb')}</span><strong id="sanctuary-herb">—</strong></div>
  <div class="stat"><span>${translate('stars')}</span><strong id="sanctuary-stars">—</strong></div>
  <div class="stat"><span>${translate('antitoxin_reward')}</span><strong id="sanctuary-antitoxin">—</strong></div>
 </div></section>
 <section class="panel table-panel"><h3>${translate('level_breakdown')}</h3><div class="table-wrap"><table class="sanctuary-table"><thead><tr>
  <th>${translate('level')}</th><th>${translate('grain')}</th><th>${translate('timber')}</th><th>${translate('herb')}</th><th>${translate('stars')}</th><th>${translate('time')}</th><th>${translate('prerequisites')}</th>
 </tr></thead><tbody id="sanctuary-body"></tbody></table></div><p class="form-note">${translate('sanctuary_source_note')} <a href="https://lastasylumdatabase.com/buildings/sanctuary" target="_blank" rel="noreferrer">Last Asylum Database</a></p></section>`;

  const calculate = () => {
    const result = calculateSanctuaryProgression(+$('#sanctuary-current').value, +$('#sanctuary-target').value);
    if (!result.valid) {
      ['sanctuary-hero-cap', 'sanctuary-power', 'sanctuary-time', 'sanctuary-grain', 'sanctuary-timber', 'sanctuary-herb', 'sanctuary-stars', 'sanctuary-antitoxin'].forEach(id => $('#' + id).textContent = '—');
      $('#sanctuary-body').innerHTML = '';
      return;
    }
    $('#sanctuary-hero-cap').textContent = formatNumber(result.heroLevelCap);
    $('#sanctuary-power').textContent = formatNumber(result.powerGain);
    $('#sanctuary-time').textContent = formatDuration(result.totals.seconds);
    $('#sanctuary-grain').textContent = formatNumber(result.totals.grain);
    $('#sanctuary-timber').textContent = formatNumber(result.totals.timber);
    $('#sanctuary-herb').textContent = formatNumber(result.totals.herb);
    $('#sanctuary-stars').textContent = formatNumber(result.totals.stars);
    $('#sanctuary-antitoxin').textContent = formatNumber(result.totals.antitoxinReward);
    $('#sanctuary-body').innerHTML = result.levels.map(row => `<tr>
      <td>${row.level}</td><td>${formatNumber(row.grain)}</td><td>${formatNumber(row.timber)}</td><td>${formatNumber(row.herb)}</td><td>${formatNumber(row.stars)}</td><td>${formatDuration(row.seconds)}</td><td>${formatPrerequisites(row.prerequisites)}</td>
    </tr>`).join('');
  };

  ['sanctuary-current', 'sanctuary-target'].forEach(id => $('#' + id).addEventListener('input', calculate));
  calculate();
}
