import { DATA_SOURCES } from '../config/sources.js';
import { $, icon } from '../core/dom.js';
import { translate } from '../core/i18n.js';
import { renderPageHeader } from '../core/ui.js';

/** Displays data provenance without fetching remote sources at runtime. */
export function renderSourcesPage(tool) {
  $('#view').innerHTML = renderPageHeader(tool) + `
 <section class="panel">
  <p class="sources-intro">${translate('sources_intro')}</p>
  <div class="sources-list">${DATA_SOURCES.map(source => `
   <article class="source-card">
    <div><h3>${source.name}</h3><p>${translate(source.description)}</p><span>${translate('verified_on')} ${source.verified}</span></div>
    <a href="${source.url}" target="_blank" rel="noreferrer">${translate('open_source')} ${icon('external-link')}</a>
   </article>`).join('')}</div>
  <p class="form-note">${translate('sources_disclaimer')}</p>
 </section>`;
}
