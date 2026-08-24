import { GAME_DATA } from '../data.js';
import { $ } from '../core/dom.js';
import { formatNumber, translate } from '../core/i18n.js';
import { bindPersistentStocks, getStoredStock, parseNumber, setStoredStock } from '../core/storage.js';
import { getResourceIcon, renderPageHeader, renderResourceLabel } from '../core/ui.js';
import { calculateFragmentUpgrade } from '../domain/fragments.js';

function createStarOptions(selected) {
  return GAME_DATA.stars.map(star => `<option value="${star.value}" ${star.value === selected ? 'selected' : ''}>${star.value.toFixed(1).replace('.0','')} ★</option>`).join('');
}

export function renderFragmentsPage(tool) {
  $('#view').innerHTML = renderPageHeader(tool) + `
 <div class="calc-grid"><section class="panel"><div class="form-grid">
  <label><span>${translate('stars_current')}</span><select id="star-current">${createStarOptions(0)}</select></label>
  <label><span>${translate('stars_target')}</span><select id="star-target">${createStarOptions(5)}</select></label>
  <label class="full"><span>${translate('hero_rarity')}</span><select id="star-rarity"><option value="ur">UR</option><option value="ssr">SSR</option><option value="sr">SR</option></select></label>
  <label><span>${translate('specific_shards_stock')}</span><input id="star-specific-stock" inputmode="numeric" value="0"></label>
  <label>${renderResourceLabel('ur-omni-shards', translate('omni_shards_stock'))}<input id="star-omni-stock" inputmode="numeric" value="0"></label>
 </div></section>
 <section class="panel result-panel"><span class="result-label">${translate('shards_required')}</span><strong id="star-total" class="result-main">—</strong><span class="result-unit">${translate('specific_or_omni_shards')}</span>
 <div class="stat-row"><div class="stat"><span>${translate('missing')}</span><strong id="star-missing">—</strong></div><div class="stat"><span>${translate('duel_points')}</span><strong id="star-points">—</strong></div></div></section></div>`;

  /** Omni stocks are account-wide and selected dynamically from hero rarity. */
  const loadOmniStock = () => {
    const resource = `${$('#star-rarity').value}-omni-shards`;
    $('#star-omni-stock').value = getStoredStock(resource) ?? '0';
    $('#star-omni-stock').closest('label').querySelector('.resource-label img').src = getResourceIcon(resource);
  };

  const calculate = () => {
    const current = +$('#star-current').value;
    const target = +$('#star-target').value;
    const result = calculateFragmentUpgrade({
      current,
      target,
      rarity: $('#star-rarity').value,
      specificStock: parseNumber($('#star-specific-stock').value),
      omniStock: parseNumber($('#star-omni-stock').value)
    });
    $('#star-total').textContent = result.valid ? formatNumber(result.required) : '—';
    $('#star-missing').textContent = result.valid ? formatNumber(result.missing) : '—';
    $('#star-points').textContent = result.valid ? formatNumber(result.duelPoints) : '—';
  };

  // #region Events and persistence
  bindPersistentStocks({ 'star-specific-stock': 'hero-specific-shards' });
  loadOmniStock();
  $('#star-rarity').addEventListener('input', () => { loadOmniStock(); calculate(); });
  $('#star-omni-stock').addEventListener('input', () => {
    setStoredStock(`${$('#star-rarity').value}-omni-shards`, $('#star-omni-stock').value);
    calculate();
  });
  ['star-current', 'star-target', 'star-specific-stock'].forEach(id => $('#' + id).addEventListener('input', calculate));
  calculate();
  // #endregion
}
