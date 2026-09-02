<script>
  let { id, label, min = 1, max, value = $bindable(1) } = $props();
</script>

<label
  ><span>{label}</span><select {id} bind:value
    >{#each Array.from({ length: max - min + 1 }, (_, index) => index + min) as level}<option value={level}
        >{level}</option
      >{/each}</select
  ></label
>
