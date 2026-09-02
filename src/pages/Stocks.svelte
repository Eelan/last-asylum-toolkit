<script>
  import { t } from '../lib/state/preferences.ts';
  import StockField from '../lib/components/StockField.svelte';
  const resources = [
    ['antitoxin', 'antitoxin'],
    ['skill-badges', 'skill_badges'],
    ['recruitments', 'recruits'],
    ['ur-omni-shards', 'ur_omni_shards'],
    ['ssr-omni-shards', 'ssr_omni_shards'],
    ['sr-omni-shards', 'sr_omni_shards'],
    ['raven-fruit', 'raven_fruit'],
    ['raven-essence', 'raven_essence']
  ];
</script>

<section class="panel">
  <div class="form-grid">
    {#each resources as [resource, key]}<StockField
        id={'stock-' + resource}
        {resource}
        label={$t(key)}
      />{/each}
  </div>
  <p class="form-note">{$t('stocks_saved_automatically')}</p>
</section>
