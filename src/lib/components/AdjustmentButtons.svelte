<script>
  let { increments, addLabel, removeLabel, onadjust } = $props();
  let mode = $state('add');
</script>

<div class="stock-mode" role="group" aria-label={`${addLabel} / ${removeLabel}`}>
  <button type="button" class:active={mode === 'add'} aria-pressed={mode === 'add'} aria-label={addLabel} title={addLabel} onclick={() => mode = 'add'}>+</button>
  <button type="button" class:active={mode === 'remove'} aria-pressed={mode === 'remove'} aria-label={removeLabel} title={removeLabel} onclick={() => mode = 'remove'}>−</button>
</div>
{#each increments as increment}
  <button type="button" class="stock-increment" onclick={() => onadjust((mode === 'add' ? 1 : -1) * increment.value)}>{mode === 'add' ? '+' : '−'}{increment.label}</button>
{/each}
