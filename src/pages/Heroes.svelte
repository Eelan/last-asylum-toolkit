<script>
  import { GAME_DATA } from '../lib/data.js';
  import { addCatalogHero, getTrackedHeroes } from '../lib/core/heroes.js';
  import { loadDataset } from '../lib/core/datasets.js';
  import { t, language } from '../lib/state/preferences.ts';
  import Icon from '../lib/components/Icon.svelte';
  import HeroPortrait from '../lib/components/HeroPortrait.svelte';
  import HeroSkill from '../lib/components/HeroSkill.svelte';
  let { heroId = '' } = $props();
  let tracked = $state(getTrackedHeroes().map((hero) => hero.catalogId));
  let query = $state(''),
    rarity = $state(''),
    faction = $state(''),
    role = $state('');
  let selected = $derived(GAME_DATA.heroes.find((hero) => hero.id === heroId));
  let filtered = $derived(
    GAME_DATA.heroes.filter(
      (hero) =>
        (!rarity || hero.rarity === rarity) &&
        (!faction || hero.faction === faction) &&
        (!role || hero.role === role) &&
        hero.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
    )
  );
  const locales = import.meta.glob('../lib/data/heroes/locales/*/*.js', { import: 'default' });
  async function loadProfile(hero, language) {
    if (!hero) return null;
    const [skills, localized] = await Promise.all([
      loadDataset(`data/heroes/skills/${hero.id}.json`),
      locales[`../lib/data/heroes/locales/${language}/${hero.id}.js`]?.()
    ]);
    return { skills, localized };
  }
  let profileData = $derived(loadProfile(selected, $language));
  function add(hero) {
    addCatalogHero(hero);
    tracked = [...tracked, hero.id];
  }
</script>

{#snippet attributes(hero)}<div class="hero-attributes">
    {#each [['camp', 'faction', hero.faction], ['role', 'role', hero.role]] as [prefix, key, value]}<img
        src={'assets/images/heroes/attributes/' + prefix + '-' + value + '.webp'}
        alt={$t('hero_' + key + '_' + value)}
        title={$t('hero_' + key) + ': ' + $t('hero_' + key + '_' + value)}
      />{/each}
  </div>{/snippet}
{#snippet addButton(hero)}<button
    class={tracked.includes(hero.id) ? 'catalog-added' : 'primary-btn'}
    disabled={tracked.includes(hero.id)}
    onclick={() => add(hero)}
    ><Icon name={tracked.includes(hero.id) ? 'check' : 'plus'} />
    {$t(tracked.includes(hero.id) ? 'hero_already_added' : 'hero_add_to_mine')}</button
  >{/snippet}
{#if selected}
  {@const profile = GAME_DATA.heroProfiles[selected.id]}
  <a class="back-link hero-profile-back" href="#/heroes"
    ><Icon name="arrow-left" /> {$t('heroes_list_title')}</a
  >
  <section class={'panel hero-profile rarity-profile-' + selected.rarity}>
    <div class="hero-profile-summary">
      <HeroPortrait hero={selected} profile />
      <div>
        <span class={'rarity-badge rarity-' + selected.rarity}>{selected.rarity.toUpperCase()}</span>
        <h2>{selected.name}</h2>
        <p class="hero-profile-title">{$t('hero_title_' + profile.title)}</p>
        {@render attributes(selected)}{@render addButton(selected)}
      </div>
    </div>
    <div class="hero-profile-stats">
      <div class="stat">
        <span>{$t('hero_strong_against')}</span><strong>{$t('hero_faction_' + profile.counters)}</strong>
      </div>
      <div class="stat">
        <span>{$t('hero_weak_against')}</span><strong>{$t('hero_faction_' + profile.counteredBy)}</strong>
      </div>
      <div class="stat">
        <span>{$t('hero_awakenable')}</span><strong>{$t(profile.awakenable ? 'yes' : 'no')}</strong>
      </div>
      <div class="stat"><span>{$t('hero_max_rank')}</span><strong>{profile.maxRank}</strong></div>
    </div>
    <p class="hero-counter-note"><Icon name="info" /> {$t('hero_counter_rule')}</p>
    <section class="hero-skills">
      <h3>{$t('hero_skills')}</h3>
      <div class="hero-skills-grid">
        {#await profileData}<p>
            {$t('hero_profile_loading')}
          </p>{:then data}{#each data.skills as skill}<HeroSkill
              {skill}
              localized={data.localized?.skills.find((candidate) => candidate.slot === skill.slot)}
            />{/each}{:catch}<p role="alert">{$t('app_load_error')}</p>{/await}
      </div>
    </section>
    <a
      class="hero-profile-source back-link"
      href={'https://lastasylumdatabase.com/heroes/' + selected.id}
      target="_blank"
      rel="noreferrer"><Icon name="external-link" /> {$t('hero_profile_source')}</a
    >
  </section>
{:else}
  <section class="panel hero-catalog">
    <div class="catalog-toolbar">
      <label
        ><span>{$t('search')}</span><input
          id="hero-search"
          type="search"
          bind:value={query}
          placeholder={$t('hero_search_placeholder')}
        /></label
      >
      <div class="hero-filter-group" role="group" aria-label={$t('hero_rarity')}>
        <span class="hero-filter-label">{$t('hero_rarity')}</span>
        <div class="hero-filter-buttons">
          {#each ['', 'ur', 'ssr', 'sr'] as value}<button
              class={'hero-filter-btn rarity-' + (value || 'ur')}
              class:active={rarity === value}
              onclick={() => (rarity = value)}>{value ? value.toUpperCase() : $t('all')}</button
            >{/each}
        </div>
      </div>
      <div class="hero-filter-group" role="group" aria-label={$t('hero_faction')}>
        <span class="hero-filter-label">{$t('hero_faction')}</span>
        <div class="hero-filter-buttons">
          {#each ['', 'warrior', 'ranger', 'warlock'] as value}<button
              class="hero-filter-btn"
              class:active={faction === value}
              onclick={() => (faction = value)}>{value ? $t('hero_faction_' + value) : $t('all')}</button
            >{/each}
        </div>
      </div>
      <div class="hero-filter-group" role="group" aria-label={$t('hero_role')}>
        <span class="hero-filter-label">{$t('hero_role')}</span>
        <div class="hero-filter-buttons">
          {#each ['', 'tank', 'carry', 'support'] as value}<button
              class="hero-filter-btn"
              class:active={role === value}
              onclick={() => (role = value)}>{value ? $t('hero_role_' + value) : $t('all')}</button
            >{/each}
        </div>
      </div>
    </div>
    <div class="hero-catalog-grid">
      {#each filtered as hero}<article class="catalog-hero">
          <div class="catalog-hero-identity">
            <HeroPortrait {hero} />
            <div>
              <span class={'rarity-badge rarity-' + hero.rarity}>{hero.rarity.toUpperCase()}</span>
              <h3>{hero.name}</h3>
              {@render attributes(hero)}
            </div>
          </div>
          <div class="catalog-hero-actions">
            <a class="back-link" href={'#/heroes/' + hero.id}
              ><Icon name="id-card" /> {$t('hero_view_profile')}</a
            >{@render addButton(hero)}
          </div>
        </article>{:else}<p class="heroes-empty">{$t('hero_no_results')}</p>{/each}
    </div>
  </section>
{/if}
