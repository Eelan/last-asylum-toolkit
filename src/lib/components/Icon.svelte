<script lang="ts">
  import { icons } from '../config/icons.ts';
  let { name, size = 24 }: { name: string; size?: number } = $props();
  let Component = $derived(icons[name as keyof typeof icons] || icons['circle-help']);
</script>

<Component {size} aria-hidden="true" />
