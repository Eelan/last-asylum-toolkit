<script>
  import { calculateDuelPlan } from '../lib/domain/duel.js';
  import { parseNumber } from '../lib/core/storage.js';
  import { t, number } from '../lib/state/preferences.ts';
  import StockField from '../lib/components/StockField.svelte';
  import ResourceLabel from '../lib/components/ResourceLabel.svelte';
  import { readPreference, writePreference } from '../lib/platform/storage.ts';
  const standardIncrements = [1, 10, 50, 100].map((value) => ({ value, label: String(value) }));
  const antitoxinIncrements = [1, 10, 50, 100].map((value) => ({ value: value * 1_000_000, label: `${value}M` }));
  const badgeIncrements = [1, 5, 10, 50].map((value) => ({ value: value * 1_000, label: `${value}k` }));
  const fields = [
    ['antitoxin', 'antitoxin', 'antitoxin', 'd-a', antitoxinIncrements],
    ['recruits', 'recruitments', 'recruits', 'd-r', standardIncrements],
    ['ur', 'ur-omni-shards', 'ur_omni_shards', 'd-u', standardIncrements],
    ['ssr', 'ssr-omni-shards', 'ssr_omni_shards', 'd-s', standardIncrements],
    ['sr', 'sr-omni-shards', 'sr_omni_shards', 'd-sr', standardIncrements],
    ['badges', 'skill-badges', 'skill_badges', 'd-b', badgeIncrements]
  ];
  let stocks = $state({ antitoxin: '0', recruits: '0', ur: '0', ssr: '0', sr: '0', badges: '0' });
  let target = $state(readPreference('lat-duel-target', '0'));
  let bonus = $state(readPreference('lat-duel-research-bonus', '0'));
  let plan = $derived(
    calculateDuelPlan({
      target: parseNumber(target),
      bonus: parseNumber(bonus),
      stocks: Object.fromEntries(Object.entries(stocks).map(([key, value]) => [key, parseNumber(value)]))
    })
  );
</script>

<div class="calc-grid">
  <section class="panel">
    <div class="form-grid">
      <label
        ><span>{$t('duel_target')}</span><input
          id="d-target"
          inputmode="numeric"
          bind:value={target}
          oninput={(event) => writePreference('lat-duel-target', event.currentTarget.value)}
        /></label
      ><label
        ><span>{$t('research_bonus')}</span><input
          id="d-bonus"
          inputmode="numeric"
          bind:value={bonus}
          oninput={(event) => writePreference('lat-duel-research-bonus', event.currentTarget.value)}
        /></label
      >{#each fields as [key, resource, label, id, increments]}<StockField
          {id}
          {resource}
          label={$t(label)}
          {increments}
          bind:value={stocks[key]}
          addLabel={$t('stocks_add')}
          removeLabel={$t('stocks_remove')}
          resetLabel={$t('stocks_reset')}
          resetConfirmLabel={$t('stocks_reset_confirm')}
          quick
        />{/each}
    </div>
  </section>
  <section class="panel result-panel">
    <span class="result-label">{$t('available_points')}</span><strong class="result-main" id="d-total"
      >{$number(plan.availablePoints)}</strong
    ><span class="result-unit">{$t('hero_phase')}</span>
    <div class="stat-row">
      <div class="stat">
        <span>{$t('duel_target')}</span><strong id="d-target-result">{$number(parseNumber(target))}</strong>
      </div>
      <div class="stat">
        <span>{$t('points_missing')}</span><strong id="d-missing">{$number(plan.missingPoints)}</strong>
      </div>
    </div>
  </section>
</div>
<section class="panel table-panel">
  <h3>{$t('consumption_plan')}</h3>
  <div class="table-wrap">
    <table>
      <thead
        ><tr
          >{#each ['resource', 'stock', 'use', 'keep', 'duel_points'] as key}<th>{$t(key)}</th>{/each}</tr
        ></thead
      ><tbody id="d-plan"
        >{#each plan.resources as resource}{@const field = fields.find(
            (field) => field[0] === resource.key
          )}<tr
            ><td><ResourceLabel resource={field[1]} label={$t(field[2])} /></td
            >{#each ['stock', 'use', 'keep', 'points'] as key}<td>{$number(resource[key])}</td>{/each}</tr
          >{/each}</tbody
      >
    </table>
  </div>
  <p class="form-note">{$t('duel_plan_note')}</p>
</section>
