<script>
  import { t } from '../lib/state/preferences.ts';
  import StockField from '../lib/components/StockField.svelte';
  import { setStoredStock } from '../lib/core/storage.js';

  const units = (values, suffix = '') =>
    values.map((value) => ({
      value,
      label: `${value / (suffix === 'M' ? 1_000_000 : suffix === 'k' ? 1_000 : 1)}${suffix}`
    }));
  const resources = [
    { resource: 'antitoxin', key: 'antitoxin', increments: units([1_000_000, 10_000_000, 50_000_000, 100_000_000], 'M'), featured: true },
    { resource: 'skill-badges', key: 'skill_badges', increments: units([1_000, 5_000, 10_000, 50_000], 'k') },
    { resource: 'recruitments', key: 'recruits', increments: units([1, 10, 50, 100]) },
    { resource: 'ur-omni-shards', key: 'ur_omni_shards', increments: units([1, 10, 50, 100]) },
    { resource: 'ssr-omni-shards', key: 'ssr_omni_shards', increments: units([1, 10, 50, 100]) },
    { resource: 'sr-omni-shards', key: 'sr_omni_shards', increments: units([1, 10, 50, 100]) },
    { resource: 'raven-fruit', key: 'raven_fruit', increments: units([1_000, 5_000, 10_000, 50_000], 'k') },
    { resource: 'raven-essence', key: 'raven_essence', increments: units([1, 10, 50, 100]) }
  ];
  let values = $state(Object.fromEntries(resources.map(({ resource }) => [resource, '0'])));
  let lastChange = $state(null);

  function rememberChange(change) {
    lastChange = change;
  }

  function undoLastChange() {
    if (!lastChange) return;
    values[lastChange.resource] = new Intl.NumberFormat('fr-FR').format(lastChange.previousValue);
    setStoredStock(lastChange.resource, values[lastChange.resource]);
    lastChange = null;
  }
</script>

<section class="panel">
  <p class="stocks-intro">{$t('stocks_quick_intro')}</p>
  <div class="stock-grid">
    {#each resources as item}<StockField
        id={'stock-' + item.resource}
        resource={item.resource}
        label={$t(item.key)}
        increments={item.increments}
        full={item.featured}
        bind:value={values[item.resource]}
        quick
        onstockchange={rememberChange}
        addLabel={$t('stocks_add')}
        removeLabel={$t('stocks_remove')}
        resetLabel={$t('stocks_reset')}
        resetConfirmLabel={$t('stocks_reset_confirm')}
      />{/each}
  </div>
  <div class="stocks-footer">
    <p class="form-note">{$t('stocks_quick_note')}</p>
    {#if lastChange}<button type="button" class="stocks-undo" onclick={undoLastChange}>{$t('stocks_undo')}</button>{/if}
  </div>
</section>
