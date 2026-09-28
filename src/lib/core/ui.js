const RESOURCE_ICONS = {
  grain: 'grain.webp',
  herb: 'herb.webp',
  timber: 'timber.webp',
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

/** Returns the image path for a resource, when custom artwork is available. */
export function getResourceIcon(resource) {
  const filename = RESOURCE_ICONS[resource];
  return filename ? `assets/images/resources/${filename}` : null;
}
