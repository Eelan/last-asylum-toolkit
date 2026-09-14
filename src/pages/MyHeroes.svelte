<script>
  import AdjustmentButtons from '../lib/components/AdjustmentButtons.svelte';
  import HeroSquads from './HeroSquads.svelte';
  import { getSquads, saveSquads, normalizeSquads } from '../lib/core/squads.js';
  import { untrack } from 'svelte';
  import { GAME_DATA } from '../lib/data.js';
  import { getTrackedHeroes, saveTrackedHeroes } from '../lib/core/heroes.js';
  import { getStoredStock, parseNumber } from '../lib/core/storage.js';
  import { calculateAntitoxinProgression } from '../lib/domain/antitoxin.js';
  import { t, number } from '../lib/state/preferences.ts';
  import Icon from '../lib/components/Icon.svelte';
  import HeroPortrait from '../lib/components/HeroPortrait.svelte';
  import LevelField from '../lib/components/LevelField.svelte';
  let heroes = $state(getTrackedHeroes()),
    selectedId = $state(untrack(() => heroes[0]?.id || null));
  let tab = $state('heroes');
  let formations = $state(getSquads(untrack(() => heroes)));
  $effect(() => {
    saveSquads($state.snapshot(formations), heroes);
  });
  let selected = $derived(heroes.find((hero) => hero.id === selectedId));
  let progression = $derived(
    selected ? calculateAntitoxinProgression(selected.current, selected.target) : null
  );
  const max = Math.max(...Object.keys(GAME_DATA.antitoxin).map(Number));
  const stock = parseNumber(getStoredStock('antitoxin'));
  $effect(() => {
    for (const hero of heroes) {
      if (hero.target < hero.current) hero.target = hero.current;
    }
    saveTrackedHeroes($state.snapshot(heroes));
  });
  function remove() {
    heroes = heroes.filter((hero) => hero.id !== selectedId);
    formations = normalizeSquads(formations, heroes);
    selectedId = heroes[0]?.id || null;
  }
</script>

<div class="quick-actions hero-workspace-tabs" aria-label={$t('my_heroes_title')}>
  {#each ['heroes', 'squads', 'presets'] as item}
    <button
      class="hero-filter-btn"
      class:active={tab === item}
      aria-pressed={tab === item}
      onclick={() => (tab = item)}>{$t('workspace_' + item)}</button
    >
  {/each}
</div>
{#if tab !== 'heroes'}
  <HeroSquads {heroes} bind:formations mode={tab} />
{:else}
  <div class="heroes-layout">
    <section class="panel heroes-list">
      <div class="heroes-list-head">
        <h3>{$t('my_heroes_title')}</h3>
        <div class="heroes-list-actions">
          <a class="back-link" href="#/heroes"><Icon name="list" /> {$t('heroes_list_title')}</a>
        </div>
      </div>
      <div id="tracked-heroes">
        {#each heroes as hero}{@const catalog = GAME_DATA.heroes.find(
            (candidate) => candidate.id === hero.catalogId
          )}<button
            class="tracked-hero"
            class:selected={hero.id === selectedId}
            onclick={() => (selectedId = hero.id)}
            ><span class="tracked-hero-identity"
              ><HeroPortrait hero={catalog} tracked /><span
                ><span class="tracked-hero-name">{hero.name}</span><span class="tracked-hero-attributes"
                  >{#each [['camp', 'faction', catalog.faction], ['role', 'role', catalog.role]] as [prefix, key, value]}<img
                      src={'assets/images/heroes/attributes/' + prefix + '-' + value + '.webp'}
                      alt={$t('hero_' + key + '_' + value)}
                    />{/each}</span
                ></span
              ></span
            ><span>{$t('level_abbr')} {hero.current} → {hero.target}</span></button
          >{:else}<div class="heroes-empty">
            <strong>{$t('my_heroes_empty')}</strong>
            <p>{$t('my_heroes_empty_hint')}</p>
          </div>{/each}
      </div>
    </section>
    {#if selected}<section class="panel hero-details">
        <h3>{$t('hero_progress')}</h3>
        <div class="form-grid">
          <div class="hero-readonly"><span>{$t('hero_name')}</span><strong>{selected.name}</strong></div>
          <div class="hero-readonly">
            <span>{$t('hero_rarity')}</span><strong>{selected.rarity.toUpperCase()}</strong>
          </div>
          <LevelField
            id="hero-current"
            label={$t('current')}
            {max}
            bind:value={selected.current}
          /><LevelField id="hero-target" label={$t('target')} min={selected.current} {max} bind:value={selected.target} />
        </div>
        <div class="squad-power-field">
          <label for="hero-power">{$t('squad_hero_power')}</label>
          <input id="hero-power" type="number" min="0" step="1" aria-describedby="hero-power-hint" value={selected.power ?? ''} onfocus={(event) => event.currentTarget.select()} oninput={(event) => {
            const value = event.currentTarget.valueAsNumber;
            selected.power = Number.isFinite(value) && value >= 0 ? value : null;
          }} />
          <div class="quick-stock-actions">
            <AdjustmentButtons increments={[1, 1000, 10000, 100000, 1000000].map(value => ({ value, label: value >= 1000000 ? $number(value / 1000000) + $t('hero_power_million_suffix') : value >= 1000 ? $number(value / 1000) + $t('hero_power_thousand_suffix') : $number(value) }))} addLabel={$t('hero_power_increase')} removeLabel={$t('hero_power_decrease')} onadjust={(amount) => {
              if (selected.power == null && amount < 0) return;
              selected.power = Math.max(0, (selected.power ?? 0) + amount);
            }} />
          </div>
          <small id="hero-power-hint">{$t('squad_power_hint')}</small>
        </div>
        <div class="hero-progress">
          <span class="result-label">{$t('hero_upgrade_cost')}</span><strong
            >{progression.valid ? $number(progression.total) : '—'}</strong
          ><span>{$t('antitoxin')}</span>
          <div class="stat-row">
            <div class="stat"><span>{$t('stock')}</span><strong>{$number(stock)}</strong></div>
            <div class="stat">
              <span>{$t('missing')}</span><strong
                >{progression.valid ? $number(Math.max(0, progression.total - stock)) : '—'}</strong
              >
            </div>
          </div>
          {#if !progression.valid}<p class="form-note">{$t('hero_target_hint')}</p>{/if}
        </div>
        <div class="quick-actions">
          <a class="primary-btn" href="#/stocks"><Icon name="package-open" /> {$t('manage_stocks')}</a><a
            class="back-link"
            href="#/antitoxin"><Icon name="calculator" /> {$t('anti_title')}</a
          >
        </div>
        <button class="text-btn" onclick={remove}><Icon name="trash-2" /> {$t('hero_delete')}</button>
      </section>{/if}
  </div>
{/if}
