<script>
  import { GAME_DATA } from '../lib/data.js';
  import { calculateFragmentUpgrade } from '../lib/domain/fragments.js';
  import { parseNumber } from '../lib/core/storage.js';
  import { t, number } from '../lib/state/preferences.ts';
  import StockField from '../lib/components/StockField.svelte';
  let current = $state(0),
    target = $state(5),
    rarity = $state('ur'),
    specific = $state('0'),
    omni = $state('0');
  let result = $derived(
    calculateFragmentUpgrade({
      current,
      target,
      rarity,
      specificStock: parseNumber(specific),
      omniStock: parseNumber(omni)
    })
  );
</script>

<div class="calc-grid">
  <section class="panel">
    <div class="form-grid">
      <label
        ><span>{$t('stars_current')}</span><select id="star-current" bind:value={current}
          >{#each GAME_DATA.stars as star}<option value={star.value}>{star.value} ★</option>{/each}</select
        ></label
      ><label
        ><span>{$t('stars_target')}</span><select id="star-target" bind:value={target}
          >{#each GAME_DATA.stars as star}<option value={star.value}>{star.value} ★</option>{/each}</select
        ></label
      >
      <label class="full"
        ><span>{$t('hero_rarity')}</span><select id="star-rarity" bind:value={rarity}
          >{#each ['ur', 'ssr', 'sr'] as option}<option value={option}>{option.toUpperCase()}</option
            >{/each}</select
        ></label
      >
      <StockField
        id="star-specific-stock"
        resource="hero-specific-shards"
        label={$t('specific_shards_stock')}
        bind:value={specific}
      /><StockField
        id="star-omni-stock"
        resource={rarity + '-omni-shards'}
        label={$t('omni_shards_stock')}
        bind:value={omni}
      />
    </div>
  </section>
  <section class="panel result-panel">
    <span class="result-label">{$t('shards_required')}</span><strong id="star-total" class="result-main"
      >{result.valid ? $number(result.required) : '—'}</strong
    ><span class="result-unit">{$t('specific_or_omni_shards')}</span>
    <div class="stat-row">
      <div class="stat">
        <span>{$t('missing')}</span><strong id="star-missing"
          >{result.valid ? $number(result.missing) : '—'}</strong
        >
      </div>
      <div class="stat">
        <span>{$t('duel_points')}</span><strong id="star-points"
          >{result.valid ? $number(result.duelPoints) : '—'}</strong
        >
      </div>
    </div>
  </section>
</div>
