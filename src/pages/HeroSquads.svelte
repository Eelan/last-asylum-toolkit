<script>
  import { GAME_DATA } from '../lib/data.js';
  import { normalizeSlots, squadPower } from '../lib/domain/squads.js';
  import { t, number } from '../lib/state/preferences.ts';
  import HeroPortrait from '../lib/components/HeroPortrait.svelte';
  let { heroes, formations = $bindable(), mode } = $props();
  let active = $state(0);
  let slot = $state(0);
  let search = $state('');
  let faction = $state('');
  let presetName = $state('');
  let presetId = $state('');
  let notice = $state('');
  let picker;
  let slots = $derived(normalizeSlots(formations.squads[active], heroes));
  let power = $derived(squadPower(slots, heroes));
  const catalog = (hero) => GAME_DATA.heroes.find((candidate) => candidate.id === hero.catalogId);
  let factions = $derived([...new Set(heroes.map((hero) => catalog(hero).faction))]);
  let filtered = $derived(
    heroes.filter(
      (hero) =>
        hero.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()) &&
        (!faction || catalog(hero).faction === faction)
    )
  );
  function choose(index) {
    slot = index;
    search = '';
    faction = '';
    picker.showModal();
  }
  function assign(id) {
    const next = [...slots];
    next[slot] = id;
    formations.squads[active] = normalizeSlots(next, heroes);
    picker.close();
  }
  function createPreset() {
    if (!presetName.trim()) return;
    formations.presets.push({ id: crypto.randomUUID(), name: presetName.trim(), slots: [...slots] });
    presetName = '';
    notice = 'squad_saved';
  }
  function applyPreset(id) {
    const preset = formations.presets.find((candidate) => candidate.id === id);
    if (!preset) return;
    formations.squads[active] = normalizeSlots(preset.slots, heroes);
    notice = 'squad_applied';
  }
</script>

<section class="panel squad-workspace">
  <div class="hero-filter-buttons squad-tabs">
    {#each formations.squads as _, index}
      <button
        class="hero-filter-btn"
        class:active={active === index}
        aria-pressed={active === index}
        onclick={() => {
          active = index;
          notice = '';
        }}>{$t('squad_label')} {index + 1}</button
      >
    {/each}
  </div>
  {#if mode === 'squads'}
    <div class="squad-heading">
      <h3>{$t('squad_label')} {active + 1}</h3>
      <span>{$t('squad_total')}</span><strong>{power === null ? '—' : $number(power)}</strong><small
        >{$t('squad_total_hint')}</small
      >
    </div>
    <div class="squad-formation">
      {#each slots as id, index}
        {@const hero = heroes.find((candidate) => candidate.id === id)}
        <button
          class="squad-slot"
          class:occupied={hero}
          onclick={() => choose(index)}
          aria-label={$t('squad_slot') + ' ' + (index + 1) + (hero ? ': ' + hero.name : '')}
        >
          <small>{$t(index < 2 ? 'squad_front' : 'squad_back')} · {index + 1}</small>
          {#if hero}<HeroPortrait hero={catalog(hero)} /><strong>{hero.name}</strong><span
              >{$t('level_abbr')} {hero.current}</span
            ><span>{hero.power == null ? $t('squad_unknown') : $number(hero.power)}</span>
          {:else}<span class="squad-plus">+</span><strong>{$t('squad_choose')}</strong>{/if}
        </button>
      {/each}
    </div>
    <div class="quick-actions">
      <label
        >{$t('squad_load')}<select bind:value={presetId}
          ><option value="">{$t('squad_select_preset')}</option>{#each formations.presets as preset}<option
              value={preset.id}>{preset.name}</option
            >{/each}</select
        ></label
      >
      <button
        class="primary-btn"
        disabled={!formations.presets.some((preset) => preset.id === presetId)}
        onclick={() => applyPreset(presetId)}>{$t('squad_apply')}</button
      >
      <button
        class="text-btn"
        disabled={!slots.some(Boolean)}
        onclick={() => {
          formations.squads[active] = [null, null, null, null, null];
          notice = '';
        }}>{$t('squad_clear')}</button
      >
    </div>
  {:else}
    <p class="form-note">{$t('squad_presets_hint')}</p>
    {#each formations.presets as preset (preset.id)}
      <article class="squad-preset">
        <label
          >{$t('squad_preset_name')}<input
            aria-label={$t('squad_rename') + ': ' + preset.name}
            maxlength="80"
            value={preset.name}
            onchange={(event) => {
              preset.name = event.currentTarget.value.trim() || preset.name;
              event.currentTarget.value = preset.name;
            }}
          /></label
        >
        <p>
          {normalizeSlots(preset.slots, heroes)
            .map((id) => heroes.find((hero) => hero.id === id)?.name || '—')
            .join(' · ')}
        </p>
        <div class="quick-actions">
          <button class="primary-btn" onclick={() => applyPreset(preset.id)}
            >{$t('squad_apply')} · {$t('squad_label')} {active + 1}</button
          ><button
            class="text-btn"
            onclick={() => {
              formations.presets = formations.presets.filter((candidate) => candidate.id !== preset.id);
              notice = '';
            }}>{$t('squad_delete_preset')}</button
          >
        </div>
      </article>
    {:else}<p class="heroes-empty">{$t('squad_no_presets')}</p>{/each}
  {/if}
  <form
    class="quick-actions squad-save"
    onsubmit={(event) => {
      event.preventDefault();
      createPreset();
    }}
  >
    <label>{$t('squad_preset_name')}<input maxlength="80" bind:value={presetName} required /></label>
    <button class="primary-btn" disabled={!presetName.trim()}
      >{$t('squad_save')} · {$t('squad_label')} {active + 1}</button
    >
  </form>
  <p role="status">{notice ? $t(notice) : ''}</p>
</section>

<dialog bind:this={picker} class="squad-picker" aria-labelledby="squad-picker-title">
  <div class="heroes-list-head">
    <h3 id="squad-picker-title">{$t('squad_choose')}</h3>
    <button class="text-btn" onclick={() => picker.close()}>{$t('squad_close')}</button>
  </div>
  <label>{$t('squad_search')}<input type="search" bind:value={search} /></label>
  <label
    >{$t('hero_faction')}<select bind:value={faction}
      ><option value="">{$t('squad_all')}</option>{#each factions as value}<option {value}
          >{$t('hero_faction_' + value)}</option
        >{/each}</select
    ></label
  >
  <button class="text-btn" onclick={() => assign(null)}>{$t('squad_remove_slot')}</button>
  {#each filtered as hero}
    {@const assigned = slots.includes(hero.id) && slots[slot] !== hero.id}
    <button class="tracked-hero" disabled={assigned} onclick={() => assign(hero.id)}
      ><span class="tracked-hero-identity"
        ><HeroPortrait hero={catalog(hero)} tracked /><span
          ><strong>{hero.name}</strong><small
            >{$t('level_abbr')}
            {hero.current} · {hero.power == null ? $t('squad_unknown') : $number(hero.power)}</small
          ></span
        ></span
      >{#if assigned}<span>{$t('squad_assigned')}</span>{/if}</button
    >
  {:else}<p class="heroes-empty">{$t('squad_no_results')}</p>{/each}
  <a class="back-link" href="#/heroes">{$t('my_heroes_add')}</a>
</dialog>
