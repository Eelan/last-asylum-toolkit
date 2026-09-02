<script>
  import { calculateSanctuaryProgression } from '../lib/domain/sanctuary.js';
  import { t, number, duration } from '../lib/state/preferences.ts';
  import { readPreference, writePreference } from '../lib/platform/storage.ts';
  let current = $state(Math.min(29, Math.max(1, Number(readPreference('lat-sanctuary-current-level')) || 1))),
    target = $state(30);
  let result = $derived(calculateSanctuaryProgression(current, target));
  function updateCurrent(event) {
    current = Math.min(Number(event.currentTarget.value), target - 1);
    writePreference('lat-sanctuary-current-level', current);
  }
  function updateTarget(event) {
    target = Math.max(Number(event.currentTarget.value), current + 1);
  }
</script>

<div class="calc-grid">
  <section class="panel sanctuary-level-picker">
    <div class="sanctuary-level-values">
      <div>
        <span>{$t('current')}</span><strong
          ><span>{$t('level_abbr')}</span>
          <output id="sanctuary-current-value" for="sanctuary-current">{current}</output></strong
        >
      </div>
      <div>
        <span>{$t('target')}</span><strong
          ><span>{$t('level_abbr')}</span>
          <output id="sanctuary-target-value" for="sanctuary-target">{target}</output></strong
        >
      </div>
    </div>
    <div
      class="range-slider"
      id="sanctuary-range"
      style={'--range-start:' +
        ((current - 1) / 29) * 100 +
        '%;--range-end:' +
        ((target - 1) / 29) * 100 +
        '%'}
    >
      <div class="range-slider-track" aria-hidden="true"></div>
      <input
        id="sanctuary-current"
        type="range"
        min="1"
        max="30"
        value={current}
        oninput={updateCurrent}
        aria-label={$t('current')}
      /><input
        id="sanctuary-target"
        type="range"
        min="1"
        max="30"
        value={target}
        oninput={updateTarget}
        aria-label={$t('target')}
      />
    </div>
    <div class="range-slider-bounds"><span>{$t('level_abbr')} 1</span><span>{$t('level_abbr')} 30</span></div>
  </section>
  <section class="panel result-panel">
    <span class="result-label">{$t('hero_level_cap')}</span><strong
      class="result-main"
      id="sanctuary-hero-cap">{result.valid ? $number(result.heroLevelCap) : '—'}</strong
    >
    <div class="stat-row">
      <div class="stat">
        <span>{$t('power_gained')}</span><strong id="sanctuary-power"
          >{result.valid ? $number(result.powerGain) : '—'}</strong
        >
      </div>
      <div class="stat">
        <span>{$t('total_time')}</span><strong id="sanctuary-time"
          >{result.valid ? $duration(result.totals.seconds) : '—'}</strong
        >
      </div>
    </div>
  </section>
</div>
<section class="panel table-panel">
  <h3>{$t('total_cost')}</h3>
  <div class="sanctuary-totals">
    {#each [['grain', 'grain'], ['timber', 'timber'], ['herb', 'herb'], ['stars', 'stars'], ['antitoxinReward', 'antitoxin_reward']] as [key, label]}<div
        class="stat"
      >
        <span>{$t(label)}</span><strong>{result.valid ? $number(result.totals[key]) : '—'}</strong>
      </div>{/each}
  </div>
</section>
<section class="panel table-panel">
  <h3>{$t('level_breakdown')}</h3>
  <div class="table-wrap">
    <table class="sanctuary-table">
      <thead
        ><tr
          >{#each ['level', 'grain', 'timber', 'herb', 'stars', 'time', 'prerequisites'] as key}<th
              >{$t(key)}</th
            >{/each}</tr
        ></thead
      ><tbody id="sanctuary-body"
        >{#each result.levels as row}<tr
            ><td>{row.level}</td>{#each ['grain', 'timber', 'herb', 'stars'] as key}<td
                >{$number(row[key])}</td
              >{/each}<td>{$duration(row.seconds)}</td><td
              >{row.prerequisites
                .map(([building, level]) => `${$t('building_' + building)} ${$t('level_abbr')} ${level}`)
                .join(' · ') || '—'}</td
            ></tr
          >{/each}</tbody
      >
    </table>
  </div>
  <p class="form-note">
    {$t('sanctuary_source_note')}
    <a href="https://lastasylumdatabase.com/buildings/sanctuary" target="_blank" rel="noreferrer"
      >Last Asylum Database</a
    >
  </p>
</section>
