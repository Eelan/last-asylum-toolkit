import { GAME_DATA } from '../data.js';
import { $, createLevelOptions } from '../core/dom.js';
import { formatNumber, translate } from '../core/i18n.js';
import { bindPersistentStocks, parseNumber } from '../core/storage.js';
import { renderPageHeader } from '../core/ui.js';

export function renderSkillsPage(tool) {
  const maxLevel = Math.max(...Object.keys(GAME_DATA.skills).map(Number));
  $('#view').innerHTML = renderPageHeader(tool) + `
 <div class="calc-grid"><section class="panel"><div class="form-grid">
  <label><span>${translate('skill_current')}</span><select id="skill-current">${createLevelOptions(1,maxLevel,1)}</select></label>
  <label><span>${translate('skill_target')}</span><select id="skill-target">${createLevelOptions(1,maxLevel,10)}</select></label>
  <label class="full"><span>${translate('stock')}</span><input id="skill-stock" inputmode="numeric" value="0"></label></div></section>
 <section class="panel result-panel"><span class="result-label">${translate('badges_required')}</span><strong id="skill-total" class="result-main">—</strong><span class="result-unit">${translate('skill_badges')}</span>
 <div class="stat-row"><div class="stat"><span>${translate('missing')}</span><strong id="skill-missing">—</strong></div><div class="stat"><span>${translate('duel_points')}</span><strong id="skill-points">—</strong></div></div></section></div>`;

  const calculate = () => {
    const current = +$('#skill-current').value;
    const target = +$('#skill-target').value;
    const stock = parseNumber($('#skill-stock').value);
    let total = 0;
    if (target > current) {
      for (let level = current + 1; level <= target; level++) total += GAME_DATA.skills[level] || 0;
    }
    $('#skill-total').textContent = target > current ? formatNumber(total) : '—';
    $('#skill-missing').textContent = target > current ? formatNumber(Math.max(0, total - stock)) : '—';
    $('#skill-points').textContent = target > current ? formatNumber(total * GAME_DATA.duel.skillBadgePoints) : '—';
  };

  bindPersistentStocks({ 'skill-stock': 'skill-badges' });
  ['skill-current', 'skill-target', 'skill-stock'].forEach(id => $('#' + id).addEventListener('input', calculate));
  calculate();
}
