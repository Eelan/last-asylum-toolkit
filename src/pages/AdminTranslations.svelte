<script>
  import { TRANSLATIONS } from '../lib/i18n/translations.js';
  import { getTranslationValue, setTranslationOverride } from '../lib/core/i18n.js';
  import { readPreference, writePreference } from '../lib/platform/storage.ts';
  import { refreshTranslations, t } from '../lib/state/preferences.ts';

  const verificationStorageKey = 'lat-translation-verifications';
  const gamePrefixes = ['anti_', 'duel_', 'survival_', 'raven_', 'shard_', 'skill_', 'sanctuary_', 'research_', 'hero_', 'heroes_', 'event_', 'events_', 'week_'];

  function readVerifications() {
    try {
      const saved = JSON.parse(readPreference(verificationStorageKey, '{}') || '{}');
      return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
    } catch { return {}; }
  }

  function displayValue(value) {
    if (value === undefined) return null;
    return typeof value === 'string' ? value : JSON.stringify(value);
  }

  function getScope(key) {
    return gamePrefixes.some((prefix) => key.startsWith(prefix)) ? 'game' : 'site';
  }

  let query = $state('');
  let filter = $state('all');
  let scope = $state('game');
  let verifications = $state(readVerifications());
  let editingKey = $state(null);
  let draftFrench = $state('');
  let draftEnglish = $state('');
  let entries = $derived.by(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const keys = new Set([...Object.keys(TRANSLATIONS.fr), ...Object.keys(TRANSLATIONS.en)]);
    return [...keys].sort().map((key) => ({
      key, scope: getScope(key), french: displayValue(getTranslationValue('fr', key)),
      english: displayValue(getTranslationValue('en', key)), verified: Boolean(verifications[key])
    })).filter((entry) => entry.scope === scope && (filter === 'all' || (filter === 'verified') === entry.verified))
      .filter((entry) => !normalizedQuery || [entry.key, entry.french, entry.english]
        .some((value) => value?.toLocaleLowerCase().includes(normalizedQuery)));
  });

  function toggleVerification(key) {
    const next = { ...verifications };
    if (next[key]) delete next[key]; else next[key] = true;
    verifications = next;
    writePreference(verificationStorageKey, JSON.stringify(next));
  }

  function startEdit(entry) {
    editingKey = entry.key;
    draftFrench = entry.french || '';
    draftEnglish = entry.english || '';
  }

  function saveEdit(key) {
    setTranslationOverride('fr', key, draftFrench);
    setTranslationOverride('en', key, draftEnglish);
    refreshTranslations();
    editingKey = null;
  }
</script>

<section class="panel translation-review">
  <p class="form-note translation-review-intro">{$t('translation_review_intro')}</p>
  <div class="translation-tabs" role="tablist">
    {#each ['game', 'site'] as candidate}
      <button type="button" role="tab" class:active={scope === candidate} aria-selected={scope === candidate} onclick={() => scope = candidate}>{$t('translation_scope_' + candidate)}</button>
    {/each}
  </div>
  <div class="translation-review-controls">
    <label><span>{$t('translation_search')}</span><input bind:value={query} type="search" placeholder={$t('translation_search')} /></label>
    <label><span>{$t('translation_filter')}</span><select bind:value={filter}><option value="all">{$t('translation_filter_all')}</option><option value="unverified">{$t('translation_filter_unverified')}</option><option value="verified">{$t('translation_filter_verified')}</option></select></label>
  </div>
  <p class="translation-review-count">{entries.length} {$t('translation_results')}</p>
  <div class="table-wrap"><table class="translation-table">
    <thead><tr><th>{$t('translation_key')}</th><th>{$t('translation_french')}</th><th>{$t('translation_english')}</th><th>{$t('translation_status')}</th></tr></thead>
    <tbody>{#each entries as entry (entry.key)}
      <tr><td><code>{entry.key}</code></td><td class:missing={!entry.french}>{entry.french ?? $t('translation_missing')}</td><td class:missing={!entry.english}>{entry.english ?? $t('translation_missing')}</td><td class="translation-actions"><button type="button" class="translation-status" class:verified={entry.verified} aria-pressed={entry.verified} onclick={() => toggleVerification(entry.key)}>{entry.verified ? $t('translation_verified') : $t('translation_unverified')}</button><button type="button" class="translation-edit" onclick={() => startEdit(entry)}>{$t('translation_edit')}</button></td></tr>
      {#if editingKey === entry.key}<tr class="translation-editor"><td colspan="4"><div class="translation-editor-grid"><label><span>{$t('translation_french')}</span><textarea bind:value={draftFrench}></textarea></label><label><span>{$t('translation_english')}</span><textarea bind:value={draftEnglish}></textarea></label></div><p class="form-note">{$t('translation_edit_help')}</p><div class="quick-actions"><button class="primary-btn" onclick={() => saveEdit(entry.key)}>{$t('translation_save')}</button><button onclick={() => editingKey = null}>{$t('translation_cancel')}</button></div></td></tr>{/if}
    {:else}<tr><td class="translation-empty" colspan="4">{$t('translation_no_results')}</td></tr>{/each}</tbody>
  </table></div>
</section>
