<script>
  import { GAME_DATA } from '../lib/data.js';
  import { calculateSkillProgression } from '../lib/domain/skills.js';
  import { parseNumber } from '../lib/core/storage.js';
  import { t, number } from '../lib/state/preferences.ts';
  import LevelField from '../lib/components/LevelField.svelte';
  import StockField from '../lib/components/StockField.svelte';
  let current = $state(1),
    target = $state(10),
    stock = $state('0');
  const max = Math.max(...Object.keys(GAME_DATA.skills).map(Number));
  let result = $derived(calculateSkillProgression(current, target, parseNumber(stock)));
  const stockIncrements = [1, 5, 10, 50].map((value) => ({ value: value * 1_000, label: `${value}k` }));
</script>

<div class="calc-grid">
  <section class="panel">
    <div class="form-grid">
      <LevelField id="skill-current" label={$t('skill_current')} {max} bind:value={current} /><LevelField
        id="skill-target"
        label={$t('skill_target')}
        {max}
        bind:value={target}
      /><StockField
        id="skill-stock"
        resource="skill-badges"
        label={$t('stock')}
        increments={stockIncrements}
        bind:value={stock}
        addLabel={$t('stocks_add')}
        removeLabel={$t('stocks_remove')}
        resetLabel={$t('stocks_reset')}
        resetConfirmLabel={$t('stocks_reset_confirm')}
        quick
        full
      />
    </div>
  </section>
  <section class="panel result-panel">
    <span class="result-label">{$t('badges_required')}</span><strong id="skill-total" class="result-main"
      >{result.valid ? $number(result.required) : '—'}</strong
    ><span class="result-unit">{$t('skill_badges')}</span>
    <div class="stat-row">
      <div class="stat">
        <span>{$t('missing')}</span><strong id="skill-missing"
          >{result.valid ? $number(result.missing) : '—'}</strong
        >
      </div>
      <div class="stat">
        <span>{$t('duel_points')}</span><strong id="skill-points"
          >{result.valid ? $number(result.duelPoints) : '—'}</strong
        >
      </div>
    </div>
  </section>
</div>
