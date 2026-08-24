import { icon } from './dom.js';
import { translate } from './i18n.js';

const RESOURCE_ICONS = {
  antitoxin: 'antitoxin.webp',
  recruitments: 'recruit-ticket.webp',
  'skill-badges': 'skill-badge.webp',
  'raven-fruit': 'raven-fruit.webp',
  'raven-essence': 'raven-essence.webp',
  gearstones: 'gearstone-box.webp',
  'ur-omni-shards': 'ur-omni-shard.webp',
  'ssr-omni-shards': 'ssr-omni-shard.webp',
  'sr-omni-shards': 'sr-omni-shard.webp'
};

/** Returns the image path for a stock resource, when custom artwork is available. */
export function getResourceIcon(resource) {
  const filename = RESOURCE_ICONS[resource];
  return filename ? `assets/images/resources/${filename}` : null;
}

/** Builds a compact resource label, falling back to text when no artwork exists. */
export function renderResourceLabel(resource, label) {
  const source = getResourceIcon(resource);
  return `<span class="resource-label">${source ? `<img src="${source}" alt="">` : ''}<span>${label}</span></span>`;
}

/** Builds the shared heading displayed above every tool page. */
export function renderPageHeader(tool) {
  return `<div class="page-head">
  <div class="page-title"><span class="tool-icon">${icon(tool.icon)}</span><div><h2>${translate(tool.title)}</h2><p>${translate(tool.desc)}</p></div></div>
  <a class="back-link" href="#/">${icon('arrow-left')} ${translate('back')}</a>
 </div>`;
}
