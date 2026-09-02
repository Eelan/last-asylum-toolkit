<script>
  import Icon from './Icon.svelte';
  import { t } from '../state/preferences.ts';
  let { tool } = $props();
  let section = $derived(tool.section === 'guides' ? 'guides' : 'tools');
</script>

<div class="page-head">
  <div class="page-title">
    <span class="tool-icon"><Icon name={tool.icon} /></span>
    <div>
      <h2>{$t(tool.title)}</h2>
      <p>{$t(tool.desc)}</p>
    </div>
  </div>
  <a class="back-link" href={'#/' + section}><Icon name="arrow-left" /> {$t(`back_${section}`)}</a>
</div>
