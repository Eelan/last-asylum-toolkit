<script>
  import { calculateSanctuaryProgression } from '../lib/domain/sanctuary.js';
  import { calculateSanctuaryBuildTime } from '../lib/domain/sanctuary.js';
  import { getConstructionResearchSummary } from '../lib/domain/constructionResearch.js';
  import { loadJsonDocument } from '../lib/core/datasets.js';
  import { getResearchInputLevel } from '../lib/core/researches.js';
  import AllianceConstructionResearch from '../lib/components/AllianceConstructionResearch.svelte';
  import { t, number, duration } from '../lib/state/preferences.ts';
  import { readPreference, writePreference } from '../lib/platform/storage.ts';
  let current = $state(Math.min(29, Math.max(1, Number(readPreference('lat-sanctuary-current-level')) || 1))),
    target = $state(30), researchMode = $state(readPreference('lat-sanctuary-research-mode', 'detailed')),
    manualBonus = $state(Number(readPreference('lat-sanctuary-manual-research-bonus')) || 0), builderActive = $state(false), researchRevision = $state(0);
  let vipLevel = $state(Math.min(20, Math.max(1, Number(readPreference('lat-account-vip-level')) || 1)));
  let vipActive = $state(readPreference('lat-account-vip-active') === 'true');
  const vipData = loadJsonDocument('data/progression/vip-construction.json');
  const development = Promise.all(['development', 'full-development', 'alliance'].map(id => loadJsonDocument(`data/research/${id}.json`)));
  let result = $derived(calculateSanctuaryProgression(current, target));
  function updateCurrent(event) {
    current = Math.min(Number(event.currentTarget.value), target - 1);
    writePreference('lat-sanctuary-current-level', current);
  }
  function updateTarget(event) {
    target = Math.max(Number(event.currentTarget.value), current + 1);
  }
</script>

{#await Promise.all([development, vipData])}<section class="panel"><p class="form-note">{$t('research_loading')}</p></section>{:then [tree, vipDataset]}
{@const research = (researchRevision, getConstructionResearchSummary(tree, researchMode, manualBonus))}
{@const allianceResearch = { id: 'rapid-construction', ...tree.find(item => item.id === 'alliance').researches['rapid-construction'] }}
{@const allianceLevel = (researchRevision, getResearchInputLevel('alliance', allianceResearch))}
{@const allianceBonus = allianceLevel === null ? null : allianceLevel === 0 ? 0 : allianceResearch.levels.find(item => item.level === allianceLevel)?.effectAtLevel}
{@const vipBonus = vipActive ? vipDataset.data.find(item => item.level === vipLevel)?.constructionSpeedPercent : 0}
{@const validBonus = vipBonus !== undefined && (researchMode !== 'manual' || (Number.isFinite(manualBonus) && manualBonus >= 0))}
{@const time = result.valid && validBonus ? calculateSanctuaryBuildTime(result.totals.seconds, research.bonus, builderActive, researchMode === 'manual' ? 0 : allianceBonus ?? 0, vipBonus) : null}
<section class="panel sanctuary-summary">
  <div class="sanctuary-summary-main">
    <div><span>{$t('sanctuary_estimated_time')}</span><strong id="sanctuary-time">{time ? $duration(time.estimatedSeconds) : '—'}</strong></div>
    <div><span>{$t('sanctuary_time_saved')}</span><strong>{time ? $duration(time.secondsSaved) : '—'}</strong></div>
  </div>
  <div class="sanctuary-summary-metrics">
    <div class="stat"><span>{$t('sanctuary_base_time')}</span><strong>{time ? $duration(time.baseSeconds) : '—'}</strong></div>
    <div class="stat"><span>{$t(researchMode === 'manual' ? 'sanctuary_manual_total' : 'sanctuary_research_bonus')}</span><strong>{validBonus ? '+' + $number(research.bonus) + '%' : '—'}</strong></div>
    {#if researchMode !== 'manual'}<div class="stat"><span>{$t('alliance_research_title')}</span><strong>{allianceBonus === null ? '—' : '+' + $number(allianceBonus) + '%'}</strong></div>{/if}
    <div class="stat"><span>{$t('sanctuary_builder_bonus')}</span><strong>{time ? '+' + time.builderSpeedPercent + '%' : '—'}</strong></div>
    <div class="stat"><span>{$t('sanctuary_vip_title')}</span><strong>{vipBonus === undefined ? '—' : '+' + $number(vipBonus) + '%'}</strong></div>
    <div class="stat"><span>{$t('hero_level_cap')}</span><strong id="sanctuary-hero-cap">{result.valid ? $number(result.heroLevelCap) : '—'}</strong></div>
    <div class="stat"><span>{$t('power_gained')}</span><strong id="sanctuary-power">{result.valid ? $number(result.powerGain) : '—'}</strong></div>
  </div>
  {#if !validBonus}<p class="form-note">{$t('sanctuary_invalid_bonus')}</p>{/if}
  {#if researchMode !== 'manual' && (research.incomplete || allianceBonus === null)}<p class="form-note">{$t('sanctuary_research_incomplete')}</p>{/if}
</section>
<div class="sanctuary-objective">
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
</div>
<div class="sanctuary-settings-layout">
<details open class="panel sanctuary-research-panel">
  <summary>{$t('sanctuary_research_title')}</summary>
  <p class="form-note">{$t('sanctuary_research_help')}</p>
  <div class="form-grid">
    <label class="sanctuary-mode-switch switch-control">
      <span>{$t('sanctuary_research_mode')}</span>
      <input type="checkbox" checked={researchMode === 'manual'} onchange={(event) => { researchMode = event.currentTarget.checked ? 'manual' : 'detailed'; writePreference('lat-sanctuary-research-mode', researchMode); }} />
      <span class="switch-track" aria-hidden="true"><span></span></span>
      <small>{researchMode === 'manual' ? $t('sanctuary_research_manual') : $t('sanctuary_research_detailed')}</small>
    </label>
    {#if researchMode === 'manual'}
      <p class="form-note">{$t('sanctuary_manual_help')}</p><label>{$t('sanctuary_manual_total')}<input type="number" min="0" step="0.1" bind:value={manualBonus} onchange={() => writePreference('lat-sanctuary-manual-research-bonus', manualBonus)} />%</label>
    {:else}
      {#each research.entries as entry}
        <div class="sanctuary-research-slide">
          <small>{$t(entry.treeId === 'full-development' ? 'research_category_full-development' : 'research_category_development')}</small>
          <div class="sanctuary-research-slide-head"><strong>{entry.research?.sourceNameFr || entry.id}</strong><span>{entry.level === null ? $t('sanctuary_not_entered') : `${$t('research_level')} ${entry.level}`}</span></div>
          {#if entry.research}
            <input type="range" min="0" max={entry.research.maxLevel} value={entry.level ?? 0} oninput={(event) => { writePreference(`lat-research-${entry.treeId}-${entry.id}-level`, event.currentTarget.value); researchRevision++; }} aria-label={entry.research.sourceNameFr} />
            <div class="sanctuary-research-slide-foot"><small>{entry.bonus === null ? $t('sanctuary_research_missing') : `+${entry.bonus}%`}</small><button type="button" class="text-button" onclick={() => { writePreference(`lat-research-${entry.treeId}-${entry.id}-level`, ''); researchRevision++; }}>{$t('sanctuary_not_entered')}</button></div>
          {:else}<small>{$t('sanctuary_research_missing')}</small>{/if}
        </div>
      {/each}
      {#if research.incomplete}<p class="form-note">{$t('sanctuary_research_incomplete')}</p>{/if}
    {/if}

  </div>
{#if researchMode !== 'manual'}<AllianceConstructionResearch embedded onchange={() => researchRevision++} />{/if}
</details>
<div class="sanctuary-active-bonuses">
<section class="panel"><h3>{$t('sanctuary_builder_bonus')}</h3>
    <label class="sanctuary-builder-switch switch-control">
      <input type="checkbox" role="switch" bind:checked={builderActive} />
      <span class="switch-track" aria-hidden="true"><span></span></span>
      <span>{$t(builderActive ? 'sanctuary_builder_active' : 'sanctuary_builder_inactive')}</span>
    </label>
<p class="form-note">{$t('sanctuary_builder_help')}</p>
</section>
<section class="panel">
<h3>{$t('sanctuary_vip_title')}</h3>
<div class="sanctuary-vip-controls">
<label>{$t('research_level')} <input type="number" min="1" max="20" step="1" bind:value={vipLevel} onchange={() => { if (Number.isInteger(vipLevel) && vipLevel >= 1 && vipLevel <= 20) writePreference('lat-account-vip-level', vipLevel); }} /></label>
<label class="switch-control"><input type="checkbox" role="switch" bind:checked={vipActive} onchange={() => writePreference('lat-account-vip-active', vipActive)} /><span class="switch-track" aria-hidden="true"><span></span></span><span>{$t(vipActive ? 'sanctuary_vip_active' : 'sanctuary_vip_inactive')}</span></label>
</div>
<p class="sanctuary-vip-value">{vipBonus === undefined ? '—' : '+' + $number(vipBonus) + '%'}</p>
<p class="form-note">{$t('sanctuary_vip_help')}</p>
</section>
</div>
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
{/await}
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
