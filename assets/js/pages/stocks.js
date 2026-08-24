import { $ } from '../core/dom.js';
import { translate } from '../core/i18n.js';
import { bindPersistentStocks } from '../core/storage.js';
import { renderPageHeader, renderResourceLabel } from '../core/ui.js';

/** Central editor for every account-wide resource stored by the toolkit. */
export function renderStocksPage(tool) {
  $('#view').innerHTML = renderPageHeader(tool) + `
 <section class="panel">
  <div class="form-grid">
   <label>${renderResourceLabel('antitoxin', translate('antitoxin'))}<input id="stock-antitoxin" inputmode="numeric" value="0"></label>
   <label>${renderResourceLabel('skill-badges', translate('skill_badges'))}<input id="stock-skill-badges" inputmode="numeric" value="0"></label>
   <label>${renderResourceLabel('recruitments', translate('recruits'))}<input id="stock-recruitments" inputmode="numeric" value="0"></label>
   <label>${renderResourceLabel('ur-omni-shards', translate('ur_omni_shards'))}<input id="stock-ur-omni-shards" inputmode="numeric" value="0"></label>
   <label>${renderResourceLabel('ssr-omni-shards', translate('ssr_omni_shards'))}<input id="stock-ssr-omni-shards" inputmode="numeric" value="0"></label>
   <label>${renderResourceLabel('sr-omni-shards', translate('sr_omni_shards'))}<input id="stock-sr-omni-shards" inputmode="numeric" value="0"></label>
   <label>${renderResourceLabel('raven-fruit', translate('raven_fruit'))}<input id="stock-raven-fruit" inputmode="numeric" value="0"></label>
   <label><span>${translate('raven_essence')}</span><input id="stock-raven-essence" inputmode="numeric" value="0"></label>
  </div>
  <p class="form-note">${translate('stocks_saved_automatically')}</p>
 </section>`;

  bindPersistentStocks({
    'stock-antitoxin': 'antitoxin',
    'stock-skill-badges': 'skill-badges',
    'stock-recruitments': 'recruitments',
    'stock-ur-omni-shards': 'ur-omni-shards',
    'stock-ssr-omni-shards': 'ssr-omni-shards',
    'stock-sr-omni-shards': 'sr-omni-shards',
    'stock-raven-fruit': 'raven-fruit',
    'stock-raven-essence': 'raven-essence'
  });
}
