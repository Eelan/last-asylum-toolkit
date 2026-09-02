<script>
  import Icon from './Icon.svelte';
  let { hero, profile = false, tracked = false } = $props();
</script>

<span
  class={'hero-portrait-shell rarity-frame-' + hero.rarity}
  class:hero-profile-portrait-shell={profile}
  class:tracked-hero-portrait-shell={tracked}
>
  {#if hero.image}<img
      class="hero-portrait"
      class:hero-profile-portrait={profile}
      class:tracked-hero-portrait={tracked}
      src={hero.image}
      alt=""
    />{:else}<span class="hero-portrait hero-portrait-placeholder"><Icon name="user-round" /></span
    >{/if}</span
>
