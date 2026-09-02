<script>
  import { getResourceIcon } from '../core/ui.js';
  let { resource, label } = $props();
  let source = $derived(getResourceIcon(resource));
</script>

<span class="resource-label"
  >{#if source}<img src={source} alt="" />{/if}<span>{label}</span></span
>
