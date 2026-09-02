<script>
  import { t } from '../state/preferences.ts';
  let { keys = [] } = $props();
</script>

<ul>
  {#each keys as key}<li>{$t(key)}</li>{/each}
</ul>
