<script>
  import { DATA_SOURCES } from '../lib/config/sources.js';
  import { t } from '../lib/state/preferences.ts';
  import Icon from '../lib/components/Icon.svelte';
</script>

<section class="panel">
  <p class="sources-intro">{$t('sources_intro')}</p>
  <div class="sources-list">
    {#each DATA_SOURCES as source}<article class="source-card">
        <div>
          <h3>{source.name}</h3>
          <p>{$t(source.description)}</p>
          <span>{$t('verified_on')} {source.verified}</span>
        </div>
        <a href={source.url} target="_blank" rel="noreferrer"
          >{$t('open_source')} <Icon name="external-link" /></a
        >
      </article>{/each}
  </div>
  <p class="form-note">{$t('sources_disclaimer')}</p>
</section>
