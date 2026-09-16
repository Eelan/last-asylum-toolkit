<script>
  import { loadJsonDocument } from '../core/datasets.js';
  import { getResearchInputLevel, setResearchLevel } from '../core/researches.js';
  import { t, number } from '../state/preferences.ts';
  let { onchange = () => {}, embedded = false } = $props();
  const data = loadJsonDocument('data/research/alliance.json');
  let revision = $state(0);
  function update(value) {
    setResearchLevel('alliance', 'rapid-construction', value);
    revision++;
    onchange();
  }
</script>

<section class:panel={!embedded} class:sanctuary-research-panel={!embedded}>
  <h3>{$t('alliance_research_title')}</h3>
  <p class="form-note">{$t('alliance_research_help')}</p>
  {#await data}<p>{$t('research_loading')}</p>{:then tree}
    {@const research = { id: 'rapid-construction', ...tree.researches['rapid-construction'] }}
    {@const level = (revision, getResearchInputLevel(tree.id, research))}
    {@const bonus = level === null ? null : level === 0 ? 0 : research.levels.find(row => row.level === level)?.effectAtLevel}
    <label class="sanctuary-research-slide">
      <span class="sanctuary-research-slide-head"><strong>{$t('alliance_rapid_construction')}</strong><span>{level === null ? $t('sanctuary_not_entered') : level === 0 ? $t('sanctuary_not_researched') : `${$t('research_level')} ${level}/${research.maxLevel}`}</span></span>
      <input type="range" min="0" max={research.maxLevel} step="1" value={level ?? 0} oninput={(event) => update(Number(event.currentTarget.value))} />
      <span>{bonus === null ? '—' : `+${$number(bonus)}%`}</span>
    </label>
    <button type="button" class="text-button" onclick={() => update('')}>{$t('sanctuary_not_entered')}</button>
  {:catch}<p>{$t('research_load_error')}</p>{/await}
</section>
