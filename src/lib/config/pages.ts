/** Lazy page modules keep each tool separate from application navigation. */
export const pages = {
  antitoxin: () => import('../../pages/Antitoxin.svelte'),
  skills: () => import('../../pages/Skills.svelte'),
  stocks: () => import('../../pages/Stocks.svelte'),
  shards: () => import('../../pages/Fragments.svelte'),
  raven: () => import('../../pages/Raven.svelte'),
  sanctuary: () => import('../../pages/Sanctuary.svelte'),
  duel: () => import('../../pages/Duel.svelte'),
  heroes: () => import('../../pages/Heroes.svelte'),
  'my-heroes': () => import('../../pages/MyHeroes.svelte'),
  researches: () => import('../../pages/Researches.svelte'),
  timers: () => import('../../pages/Timers.svelte'),
  events: () => import('../../pages/Events.svelte'),
  week: () => import('../../pages/Week.svelte'),
  sources: () => import('../../pages/Sources.svelte')
};
