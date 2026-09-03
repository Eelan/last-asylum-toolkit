<script>
  import { getStoredStock, parseNumber, setStoredStock } from '../core/storage.js';
  import ResourceLabel from './ResourceLabel.svelte';
  let {
    resource,
    label,
    id,
    value = $bindable('0'),
    full = false,
    increments = [],
    quick = false,
    onstockchange = null,
    addLabel = '',
    removeLabel = '',
    resetLabel = '',
    resetConfirmLabel = ''
  } = $props();
  let resetPending = $state(false);
  let editPreviousValue = $state(null);
  let adjustmentMode = $state('add');

  $effect(() => {
    value = getStoredStock(resource) ?? '0';
  });

  const formatStock = (stock) => new Intl.NumberFormat('fr-FR').format(stock);

  function updateStock(nextValue) {
    const previousValue = parseNumber(value);
    value = formatStock(Math.max(0, nextValue));
    setStoredStock(resource, value);
    onstockchange?.({ resource, previousValue, nextValue: parseNumber(value) });
    resetPending = false;
  }

  function adjustStock(amount) {
    const direction = adjustmentMode === 'add' ? 1 : -1;
    updateStock(parseNumber(value) + direction * amount);
  }

  function resetStock() {
    if (!resetPending) {
      resetPending = true;
      return;
    }
    updateStock(0);
  }
</script>

{#if quick}
  <article class="quick-stock-field" class:full>
    <label for={id}><ResourceLabel {resource} {label} /></label>
    <input
      {id}
      class="quick-stock-value"
      inputmode="numeric"
      bind:value
      onfocus={(event) => {
        editPreviousValue = parseNumber(value);
        event.currentTarget.select();
      }}
      oninput={(event) => {
        setStoredStock(resource, event.currentTarget.value);
        resetPending = false;
      }}
      onblur={(event) => {
        const nextValue = parseNumber(event.currentTarget.value);
        if (editPreviousValue !== null && editPreviousValue !== nextValue) {
          onstockchange?.({ resource, previousValue: editPreviousValue, nextValue });
        }
        editPreviousValue = null;
      }}
    />
    <div class="quick-stock-actions">
      <div class="stock-mode" role="group" aria-label={`${addLabel} / ${removeLabel}`}>
        <button
          type="button"
          class:active={adjustmentMode === 'add'}
          aria-pressed={adjustmentMode === 'add'}
          aria-label={addLabel}
          title={addLabel}
          onclick={() => (adjustmentMode = 'add')}>+</button
        >
        <button
          type="button"
          class:active={adjustmentMode === 'remove'}
          aria-pressed={adjustmentMode === 'remove'}
          aria-label={removeLabel}
          title={removeLabel}
          onclick={() => (adjustmentMode = 'remove')}>−</button
        >
      </div>
      {#each increments as increment}
        <button type="button" class="stock-increment" onclick={() => adjustStock(increment.value)}>
          {adjustmentMode === 'add' ? '+' : '−'}{increment.label}
        </button>
      {/each}
      <button
        type="button"
        class:pending={resetPending}
        class="stock-reset"
        onclick={resetStock}
        onblur={() => (resetPending = false)}
      >{resetPending ? resetConfirmLabel : resetLabel}</button>
    </div>
  </article>
{:else}
  <label class:full
    ><ResourceLabel {resource} {label} /><input
      {id}
      inputmode="numeric"
      bind:value
      oninput={(event) => setStoredStock(resource, event.currentTarget.value)}
    /></label
  >
{/if}
