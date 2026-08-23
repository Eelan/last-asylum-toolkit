import { icon } from './dom.js';
import { translate } from './i18n.js';

/** Builds the shared heading displayed above every tool page. */
export function renderPageHeader(tool) {
  return `<div class="page-head">
  <div class="page-title"><span class="tool-icon">${icon(tool.icon)}</span><div><h2>${translate(tool.title)}</h2><p>${translate(tool.desc)}</p></div></div>
  <a class="back-link" href="#/">${icon('arrow-left')} ${translate('back')}</a>
 </div>`;
}
