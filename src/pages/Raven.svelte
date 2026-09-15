<script>
  import { calculateRavenEventPoints, calculateRavenProgression, getRavenUpgradeCost } from '../lib/domain/raven.js';
  import { parseNumber } from '../lib/core/storage.js';
  import { getResourceIcon } from '../lib/core/ui.js';
  import { t, number } from '../lib/state/preferences.ts';
  import { readPreference, writePreference } from '../lib/platform/storage.ts';
  import LevelField from '../lib/components/LevelField.svelte';
  import StockField from '../lib/components/StockField.svelte';
  let current = $state(1),
    target = $state(30),
    completed = $state(0),
    fruit = $state('0'),
    essence = $state('0'),
    duelBonus = $state(Math.min(150, Math.max(0, parseNumber(readPreference('lat-raven-duel-points-bonus', '100')))));
  let currentCost = $derived(getRavenUpgradeCost(current));
  let hasProgressSteps = $derived(currentCost.stepCount > 0 && target > current);
  let usesEssence = $derived(currentCost.phaseCount > 0);
  let progressSteps = $derived(Array.from({ length: currentCost.stepCount }, (_, index) => index + 1));
  let currentFruitProgress = $derived(
    currentCost.stepCosts.slice(0, completed).reduce((sum, stepCost) => sum + stepCost, 0)
  );
  let totalLevelFruitCost = $derived(currentCost.stepCosts.reduce((sum, stepCost) => sum + stepCost, 0));
  let previousCurrent = $state(1);
  $effect(() => {
    const currentLevel = Number(current);
    if (currentLevel === previousCurrent) return;
    target = Math.min((Math.floor(currentLevel / 5) + 1) * 5, 250);
    completed = 0;
    previousCurrent = currentLevel;
  });
  let result = $derived(calculateRavenProgression(current, target, hasProgressSteps ? completed : 0));
  let eventPoints = $derived(calculateRavenEventPoints({
    fruit: result.fruit ?? 0,
    essence: result.essence,
    duelBonus: parseNumber(duelBonus)
  }));
  const fruitIncrements = [1, 5, 10, 50].map((value) => ({ value: value * 1_000, label: `${value}k` }));
  const essenceIncrements = [1, 10, 50, 100].map((value) => ({ value, label: String(value) }));
  const fruitIcon = getResourceIcon('raven-fruit');
  const essenceIcon = getResourceIcon('raven-essence');
  let quickTargets = $derived(
    Array.from({ length: 3 }, (_, index) => {
      const currentLevel = Number(current);
      const nextMilestone = Math.floor(currentLevel / 5) * 5 + 5;
      return Math.min(nextMilestone + index * 5, 250);
    }).filter((targetLevel, index, targets) => targetLevel > current && targets.indexOf(targetLevel) === index)
  );

  function selectQuickTarget(targetLevel) {
    target = targetLevel;
    completed = 0;
  }
</script>

<div class="calc-grid raven-planner-grid">
  <section class="panel raven-planner-controls">
    <div class="raven-section-heading"><span class="kicker">{$t('raven_plan_title')}</span><p>{$t('raven_plan_intro')}</p></div>
    <div class="form-grid">
      <div class="full raven-level-selectors">
        <LevelField id="raven-current" label={$t('current')} max={250} bind:value={current} /><LevelField
          id="raven-target"
          label={$t('target')}
          min={Number(current)}
          max={250}
          bind:value={target}
        />
      </div>
      <div class="full quick-actions raven-quick-targets">
        {#each quickTargets as quickTarget}<button onclick={() => selectQuickTarget(quickTarget)}
            >{current} → {quickTarget}</button
          >{/each}
      </div>
      <div class:fruit-only={!usesEssence} class="full raven-phase-picker" id="raven-phase-field" hidden={!hasProgressSteps}>
        <div class="raven-phase-picker-head"><span>{$t(usesEssence ? 'raven_completed_phases' : 'raven_completed_steps')}</span><div><strong class="raven-fruit-progress">{#if fruitIcon}<img src={fruitIcon} alt={$t('raven_fruit')} />{/if}{$number(currentFruitProgress)} / {$number(totalLevelFruitCost)}</strong><button type="button" class="raven-phase-reset" disabled={completed === 0} onclick={() => (completed = 0)}>{$t('raven_phase_reset')}</button></div></div>
        <div class:fruit-only={!usesEssence} class:essence={usesEssence} class="raven-phase-segments" style={`--raven-step-count:${currentCost.stepCount}`} role="group" aria-label={$t(usesEssence ? 'raven_completed_phases' : 'raven_completed_steps')}>
          {#each progressSteps as step}<button
              type="button"
              class:complete={step <= completed}
              class:partial={currentCost.stepCosts[step - 1] < currentCost.fruitPerAction}
              aria-pressed={step === completed}
              aria-label={`${$t(usesEssence ? 'raven_phase' : 'raven_step')} ${step} / ${currentCost.stepCount}${usesEssence ? `, ${currentCost.essencePerPhase * step} ${$t('raven_essence')}` : ''}`}
              onclick={() => (completed = step)}
            >{#if usesEssence && essenceIcon}<span class="raven-phase-essence"><img src={essenceIcon} alt="" /><span>{currentCost.essencePerPhase * step}</span></span>{/if}</button>{/each}
        </div>
        <small class="field-hint">{$t(usesEssence ? 'raven_phase_bar_hint' : 'raven_step_bar_hint')}</small>
      </div>      <StockField
        id="raven-fruit-stock"
        resource="raven-fruit"
        label={$t('raven_fruit_stock')}
        increments={fruitIncrements}
        bind:value={fruit}
        addLabel={$t('stocks_add')}
        removeLabel={$t('stocks_remove')}
        resetLabel={$t('stocks_reset')}
        resetConfirmLabel={$t('stocks_reset_confirm')}
        quick
      /><StockField
        id="raven-essence-stock"
        resource="raven-essence"
        label={$t('raven_essence_stock')}
        increments={essenceIncrements}
        bind:value={essence}
        addLabel={$t('stocks_add')}
        removeLabel={$t('stocks_remove')}
        resetLabel={$t('stocks_reset')}
        resetConfirmLabel={$t('stocks_reset_confirm')}
        quick
      />
    </div>
    <p class="raven-rule-note">{$t('raven_incremental_rule')}</p>
  </section>
  <section class="panel raven-resources-summary">
    <div class="raven-section-heading"><span class="kicker">{$t('required')}</span><h3>{$t('raven_resources_title')}</h3></div>
    <div class="raven-resource-grid">
      {#each [['fruit', fruit], ['essence', essence]] as [resource, stock]}<article class="raven-resource-card">
        <span>{$t('raven_' + resource)}</span><strong id={'raven-' + resource + '-total'}>{result.valid && (resource !== 'fruit' || result.fruitKnown) ? $number(result[resource]) : '—'}</strong>
        <div><span>{$t('raven_' + resource + '_missing')}</span><strong id={'raven-' + resource + '-missing'}>{result.valid && (resource !== 'fruit' || result.fruitKnown) ? $number(Math.max(0, result[resource] - parseNumber(stock))) : '—'}</strong></div>
      </article>{/each}
    </div>
  </section>
</div>
<section class="panel raven-event-points">  <div class="raven-event-points-head">
    <div><span class="kicker">{$t('raven_event_points')}</span><h3>{$t('raven_event_points_title')}</h3></div>
    <p>{$t('raven_event_points_intro')}</p>
  </div>
  <label class="raven-duel-bonus-slider">
    <span><span>{$t('raven_duel_bonus')}</span><strong>+{duelBonus}%</strong></span>
    <input
      id="raven-duel-bonus"
      type="range"
      min="0"
      max="150"
      step="5"
      bind:value={duelBonus}
      oninput={(event) => writePreference('lat-raven-duel-points-bonus', event.currentTarget.value)}
    />
    <small><span>0%</span><span>150%</span></small>
  </label>  <div class="raven-event-points-grid">
    <article class="raven-event-card survival">
      <span>{$t('survival_battle')}</span>
      <strong id="raven-survival-points">{result.valid && result.fruitKnown ? $number(eventPoints.survivalBattlePoints) : '—'}</strong>
      <small>{$t('raven_total_points')}</small>
      <p>{$t('raven_survival_points_hint')}</p>
      <div class="raven-event-rate"><span>{$t('raven_survival_points_rate')}</span><strong>{$number(eventPoints.survivalBattleFruitPoints)} / {$number(eventPoints.survivalBattleFruitUnit)} {$t('raven_fruit')}</strong></div>
    </article>
    <article class="raven-event-card duel">
      <span>{$t('raven_alliance_duel_points')}</span>
      <strong id="raven-duel-points">{result.valid && result.fruitKnown ? $number(eventPoints.allianceDuelPoints) : '—'}</strong>
      <small>{$t('raven_total_points')}</small>
      <p>{$t('raven_duel_points_hint')}</p>
      <div class="raven-event-rate"><span>{$t('raven_duel_fruit_rate')}</span><strong>{$number(eventPoints.allianceDuelFruitBasePoints)} → {$number(eventPoints.allianceDuelFruitPoints)}</strong></div>
      <div class="raven-event-rate"><span>{$t('raven_duel_essence_rate')}</span><strong>{$number(eventPoints.allianceDuelEssenceBasePoints)} → {$number(eventPoints.allianceDuelEssencePoints)}</strong></div>
    </article>
  </div>
</section>
<p class="range-error" id="raven-range-error" hidden={result.valid}>{$t('raven_invalid_range')}</p>
<details class="panel table-panel raven-level-details">
  <summary><span class="kicker">{$t('level_breakdown')}</span><strong>{$t('raven_level_details')}</strong></summary>
  <div class="table-wrap">
    <table class="raven-table">
      <thead
        ><tr
          >{#each ['raven_upgrade', 'raven_fruit_per_action', 'raven_incremental_cost', 'raven_essence_per_phase', 'raven_steps_remaining', 'raven_essence', 'fruit_cumulative', 'essence_cumulative'] as key}<th
              >{$t(key)}</th
            >{/each}</tr
        ></thead
      ><tbody id="raven-body"
        >{#each result.levels as row}<tr
            ><td>{row.level - 1} → {row.level}</td><td>{#if row.fruitPerAction === null}<strong class="raven-unknown-value">?</strong>{:else}{$number(row.fruitPerAction)}{/if}</td><td>{#if row.fruit === null}<strong class="raven-unknown-value">?</strong>{:else}{$number(row.fruit)}{/if}</td><td
              >{row.essencePerPhase > 0 ? $number(row.essencePerPhase) : '—'}</td
            ><td>{row.stepsRemaining}</td><td>{row.essence > 0 ? $number(row.essence) : '—'}</td><td
              >{#if row.fruitCumulative === null}<strong class="raven-unknown-value">?</strong>{:else}{$number(row.fruitCumulative)}{/if}</td
            ><td>{$number(row.essenceCumulative)}</td></tr
          >{/each}</tbody
      >
    </table>
  </div>
</details>
