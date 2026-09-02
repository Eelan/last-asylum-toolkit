<script>
  import { GAME_DATA } from '../lib/data.js';
  import { calculateAntitoxinProgression } from '../lib/domain/antitoxin.js';
  import { parseNumber } from '../lib/core/storage.js';
  import { t, number } from '../lib/state/preferences.ts';
  import LevelField from '../lib/components/LevelField.svelte';
  import StockField from '../lib/components/StockField.svelte';
  let current = $state(85),
    target = $state(90),
    stock = $state('0');
  const max = Math.max(...Object.keys(GAME_DATA.antitoxin).map(Number));
  let result = $derived(calculateAntitoxinProgression(current, target));
</script>

<div class="calc-grid">
  <section class="panel">
    <div class="form-grid">
      <LevelField id="anti-current" label={$t('current')} {max} bind:value={current} /><LevelField
        id="anti-target"
        label={$t('target')}
        {max}
        bind:value={target}
      /><StockField id="anti-stock" resource="antitoxin" label={$t('stock')} bind:value={stock} full />
    </div>
    <div class="quick-actions">
      {#each [[80, 85], [85, 90], [90, 95], [95, 100]] as range}<button
          onclick={() => {
            [current, target] = range;
          }}>{range[0]} → {range[1]}</button
        >{/each}
    </div>
  </section>
  <section class="panel result-panel">
    <span class="result-label">{$t('required')}</span><strong class="result-main" id="anti-total"
      >{result.valid ? $number(result.total) : '—'}</strong
    ><span class="result-unit">{$t('antitoxin')}</span>
    <div class="stat-row">
      <div class="stat">
        <span>{$t('missing')}</span><strong id="anti-missing"
          >{result.valid ? $number(Math.max(0, result.total - parseNumber(stock))) : '—'}</strong
        >
      </div>
      <div class="stat">
        <span>{$t('duel_points')}</span><strong id="anti-points"
          >{result.valid ? $number(result.duelPoints) : '—'}</strong
        >
      </div>
    </div>
  </section>
</div>
<section class="panel table-panel">
  <h3>{$t('level_breakdown')}</h3>
  <div class="table-wrap">
    <table>
      <thead
        ><tr
          >{#each ['level', 'sanctuary_required', 'cost', 'cumulative'] as key}<th>{$t(key)}</th>{/each}</tr
        ></thead
      ><tbody id="anti-body"
        >{#each result.levels as row}<tr
            ><td>{row.level}</td><td>{row.sanctuary}</td><td>{$number(row.cost)}</td><td
              >{$number(row.cumulative)}</td
            ></tr
          >{/each}</tbody
      >
    </table>
  </div>
</section>
