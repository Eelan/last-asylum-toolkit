<script>
  import { calculateRavenProgression, getRavenUpgradeCost } from '../lib/domain/raven.js';
  import { parseNumber } from '../lib/core/storage.js';
  import { t, number } from '../lib/state/preferences.ts';
  import LevelField from '../lib/components/LevelField.svelte';
  import StockField from '../lib/components/StockField.svelte';
  let current = $state(1),
    target = $state(30),
    completed = $state(0),
    fruit = $state('0'),
    essence = $state('0');
  let hasPhases = $derived(getRavenUpgradeCost(current).phaseCount > 0 && target > current);
  let result = $derived(calculateRavenProgression(current, target, hasPhases ? completed : 0));
</script>

<div class="calc-grid">
  <section class="panel">
    <div class="form-grid">
      <LevelField id="raven-current" label={$t('current')} max={250} bind:value={current} /><LevelField
        id="raven-target"
        label={$t('target')}
        max={250}
        bind:value={target}
      />
      <label class="full" id="raven-phase-field" hidden={!hasPhases}
        ><span>{$t('raven_completed_phases')}</span><select id="raven-completed-phases" bind:value={completed}
          >{#each [0, 1, 2, 3, 4] as phase}<option value={phase}>{phase} / 5</option>{/each}</select
        ><small class="field-hint">{$t('raven_phase_hint')}</small></label
      >
      <StockField
        id="raven-fruit-stock"
        resource="raven-fruit"
        label={$t('raven_fruit_stock')}
        bind:value={fruit}
      /><StockField
        id="raven-essence-stock"
        resource="raven-essence"
        label={$t('raven_essence_stock')}
        bind:value={essence}
      />
    </div>
    <p class="raven-rule-note">{$t('raven_phase_rule')}</p>
    <div class="quick-actions">
      {#each [[1, 30], [30, 50], [50, 90], [90, 110]] as range}<button
          onclick={() => {
            [current, target] = range;
            completed = 0;
          }}>{range[0]} → {range[1]}</button
        >{/each}
    </div>
  </section>
  <section class="panel result-panel">
    <span class="result-label">{$t('required')}</span>
    <div class="stat-row">
      {#each ['fruit', 'essence'] as resource}<div class="stat">
          <span>{$t('raven_' + resource)}</span><strong id={'raven-' + resource + '-total'}
            >{result.valid ? $number(result[resource]) : '—'}</strong
          >
        </div>{/each}
    </div>
    <div class="stat-row">
      {#each [['fruit', fruit], ['essence', essence]] as [resource, stock]}<div class="stat">
          <span>{$t('raven_' + resource + '_missing')}</span><strong id={'raven-' + resource + '-missing'}
            >{result.valid ? $number(Math.max(0, result[resource] - parseNumber(stock))) : '—'}</strong
          >
        </div>{/each}
    </div>
  </section>
</div>
<p class="range-error" id="raven-range-error" hidden={result.valid}>{$t('raven_invalid_range')}</p>
<section class="panel table-panel">
  <h3>{$t('level_breakdown')}</h3>
  <div class="table-wrap">
    <table class="raven-table">
      <thead
        ><tr
          >{#each ['raven_upgrade', 'raven_fruit', 'raven_essence_per_phase', 'raven_phases', 'raven_essence', 'fruit_cumulative', 'essence_cumulative'] as key}<th
              >{$t(key)}</th
            >{/each}</tr
        ></thead
      ><tbody id="raven-body"
        >{#each result.levels as row}<tr
            ><td>{row.level - 1} → {row.level}</td><td>{$number(row.fruit)}</td><td
              >{$number(row.essencePerPhase)}</td
            ><td>{row.phasesRemaining}</td><td>{$number(row.essence)}</td><td
              >{$number(row.fruitCumulative)}</td
            ><td>{$number(row.essenceCumulative)}</td></tr
          >{/each}</tbody
      >
    </table>
  </div>
</section>
