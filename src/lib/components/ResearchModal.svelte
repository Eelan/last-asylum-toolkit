<script>
  import { onMount } from 'svelte';
  import {
    getResearchLevel,
    getUnmetResearchPrerequisites,
    getPrerequisiteLabel,
    RESEARCH_NODE_ICONS
  } from '../core/researches.js';
  import { t } from '../state/preferences.ts';
  import Icon from './Icon.svelte';
  let { tree, research, revision, onadjust, onclose } = $props();
  let modal;
  let level = $derived.by(() => {
    revision;
    return getResearchLevel(tree.id, research);
  });
  let unmet = $derived.by(() => {
    revision;
    return getUnmetResearchPrerequisites(tree, research);
  });
  onMount(() => {
    modal.showModal();
  });
</script>

<dialog
  class="research-modal"
  bind:this={modal}
  aria-labelledby="research-modal-title"
  {onclose}
  onclick={(event) => {
    if (event.target === modal) modal.close();
  }}
>
  <aside class="research-detail-card">
    <button class="research-modal-close" onclick={() => modal.close()} aria-label={$t('research_close_modal')}
      ><Icon name="x" /></button
    ><span class="research-detail-icon"
      ><Icon name={RESEARCH_NODE_ICONS[research.category] || 'flask-conical'} /></span
    >
    <div>
      <span class="kicker">{$t('research_selected')}</span>
      <h4 id="research-modal-title">{research.sourceNameFr}</h4>
      <p>{research.sourceDescriptionFr || ''}</p>
      {#if unmet.length}<p class="research-prerequisites">
          <strong>{$t('research_requires')}</strong>{unmet
            .map((item) => `${getPrerequisiteLabel(tree, item)} (${item.minimumLevel})`)
            .join(', ')}
        </p>{/if}
    </div>
    <div class="research-level-controls" aria-label={$t('research_level_controls')}>
      <button disabled={level === 0} onclick={() => onadjust(-1)} aria-label={$t('research_decrease_level')}
        ><Icon name="minus" /></button
      ><strong><small>{$t('research_level')}</small>{level}/{research.maxLevel}</strong><button
        disabled={level >= research.maxLevel || unmet.length > 0}
        onclick={() => onadjust(1)}
        aria-label={$t('research_increase_level')}><Icon name="plus" /></button
      >
    </div>
  </aside>
</dialog>
