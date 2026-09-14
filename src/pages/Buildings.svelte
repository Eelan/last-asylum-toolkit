<script>
  import { loadJsonDocument } from '../lib/core/datasets.js';
  import { t, number, duration } from '../lib/state/preferences.ts';
  import Icon from '../lib/components/Icon.svelte';

  const document = loadJsonDocument('data/buildings/buildings.json');
  let query = $state('');
  let sanctuaryLevel = $state(30);
  let selectedId = $state(null);

  function matchingBuildings(buildings) {
    const search = query.trim().toLocaleLowerCase();
    return buildings.filter(
      (building) =>
        building.unlocksAt.minimumLevel <= sanctuaryLevel &&
        (!search || building.name.toLocaleLowerCase().includes(search) || building.id.includes(search))
    );
  }

  function sourceEffectLabel(key) {
    return key.replaceAll('-', ' ');
  }

  function formatEffect(effect) {
    if (!effect) return '—';
    if (effect.unit === 'percent') return $number(effect.value) + '%';
    if (effect.unit === 'minute') return $duration(effect.value * 60);
    if (effect.unit === 'second') return $duration(effect.value);
    return $number(effect.value);
  }

  function formatCost(cost, resource) {
    return cost?.[resource] == null ? '—' : $number(cost[resource]);
  }
</script>

{#await document}
  <section class="panel" aria-busy="true"><p>{$t('app_loading')}</p></section>
{:then dataset}
  {@const buildings = dataset.data}
  {@const selected = buildings.find((building) => building.id === selectedId)}
  {#if selected}
    <button class="back-link buildings-back" onclick={() => (selectedId = null)}>
      <Icon name="arrow-left" />
      {$t('buildings_back')}
    </button>
    <section class="panel buildings-detail">
      <div class="buildings-detail-heading">
        <div>
          <span class="kicker">{$t('buildings_catalogue')}</span>
          <h3>{selected.name}</h3>
          <p>{$t('buildings_source_names')}</p>
        </div>
        <a href={selected.source.url} target="_blank" rel="noreferrer">
          {$t('open_source')}
          <Icon name="external-link" />
        </a>
      </div>
      <div class="buildings-facts">
        <div class="stat">
          <span>{$t('buildings_unlocks_at')}</span>
          <strong>{$t('level_abbr')} {selected.unlocksAt.minimumLevel}</strong>
        </div>
        <div class="stat">
          <span>{$t('buildings_base_copies')}</span>
          <strong>{selected.baseMaxCopies}</strong>
        </div>
        <div class="stat">
          <span>{$t('buildings_max_level')}</span>
          <strong>{selected.maxLevel}</strong>
        </div>
        <div class="stat">
          <span>{$t('buildings_coverage')}</span>
          <strong
            >{$t(
              selected.levelCoverage === 'complete' ? 'buildings_complete' : 'buildings_reference_levels'
            )}</strong
          >
        </div>
      </div>
      <p class="form-note">{$t('buildings_source_note')} {selected.source.verifiedOn}</p>
      <p class="form-note">{$t('buildings_cost_note')}</p>
      <div class="table-wrap">
        <table class="buildings-table">
          <thead>
            <tr>
              <th>{$t('level')}</th>
              <th>{$t('buildings_effects')}</th>
              <th>{$t('buildings_might')}</th>
              <th>{$t('grain')}</th>
              <th>{$t('timber')}</th>
              <th>{$t('herb')}</th>
              <th>{$t('time')}</th>
            </tr>
          </thead>
          <tbody>
            {#each selected.levels as level}
              <tr>
                <th scope="row">{level.level}</th>
                <td>
                  {#each Object.entries(level.effectsAtLevel) as [key, effect]}
                    <span class="buildings-effect"
                      ><span>{sourceEffectLabel(key)}</span><strong>{formatEffect(effect)}</strong></span
                    >
                  {:else}
                    —
                  {/each}
                </td>
                <td>{$number(level.powerAtLevel)}</td>
                <td>{formatCost(level.upgradeCost, 'grain')}</td>
                <td>{formatCost(level.upgradeCost, 'timber')}</td>
                <td>{formatCost(level.upgradeCost, 'herb')}</td>
                <td
                  >{level.durationMinutesApprox == null
                    ? '—'
                    : $duration(level.durationMinutesApprox * 60)}</td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
  {:else}
    <section class="panel buildings-intro">
      <p>{$t('buildings_intro')}</p>
      <p class="form-note">{$t('buildings_source_names')}</p>
      <div class="buildings-toolbar">
        <label>
          <span>{$t('search')}</span>
          <input
            id="building-search"
            type="search"
            bind:value={query}
            placeholder={$t('buildings_search_placeholder')}
          />
        </label>
        <label>
          <span>{$t('buildings_sanctuary_filter')}</span>
          <select id="building-sanctuary-filter" bind:value={sanctuaryLevel}>
            {#each Array.from({ length: 30 }, (_, index) => index + 1) as level}
              <option value={level}>{$t('level_abbr')} {level}</option>
            {/each}
          </select>
        </label>
      </div>
      <p class="buildings-count">
        {$t('buildings_results')}: {matchingBuildings(buildings).length} / {buildings.length}
      </p>
    </section>
    <div class="buildings-grid">
      {#each matchingBuildings(buildings) as building}
        <article class="panel buildings-card">
          <div>
            <span class="buildings-card-level"
              >{$t('buildings_unlocks_at')} {$t('level_abbr')} {building.unlocksAt.minimumLevel}</span
            >
            <h3>{building.name}</h3>
            <p>
              {$t('buildings_max_level')}
              {building.maxLevel} · {$t('buildings_base_copies')}
              {building.baseMaxCopies}
            </p>
          </div>
          <div class="buildings-card-bottom">
            <span
              >{$t(
                building.levelCoverage === 'complete' ? 'buildings_complete' : 'buildings_reference_levels'
              )}</span
            >
            <button class="back-link" onclick={() => (selectedId = building.id)}>
              {$t('buildings_view')}
              <Icon name="arrow-right" />
            </button>
          </div>
        </article>
      {:else}
        <section class="panel buildings-empty">{$t('buildings_no_results')}</section>
      {/each}
    </div>
  {/if}
{:catch}
  <section class="panel" role="alert"><p>{$t('app_load_error')}</p></section>
{/await}
