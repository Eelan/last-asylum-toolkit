<script>
  import { getStoredStock, setStoredStock } from '../core/storage.js';
  import ResourceLabel from './ResourceLabel.svelte';
  let { resource, label, id, value = $bindable('0'), full = false } = $props();
  $effect(() => {
    value = getStoredStock(resource) ?? '0';
  });
</script>

<label class:full
  ><ResourceLabel {resource} {label} /><input
    {id}
    inputmode="numeric"
    bind:value
    oninput={(event) => setStoredStock(resource, event.currentTarget.value)}
  /></label
>
