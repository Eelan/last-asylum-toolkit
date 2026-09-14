import { writable, derived } from 'svelte/store';
import { getLanguage, setLanguage, translate, formatNumber, formatDuration } from '../core/i18n.js';
import { getClockMode, setClockMode } from '../core/time.js';

export const language = writable(getLanguage());
export const clockMode = writable(getClockMode());
export const translationRevision = writable(0);
language.subscribe(setLanguage);
clockMode.subscribe(setClockMode);
export const t = derived([language, translationRevision], () => (key: string) => translate(key));
export const number = derived(language, () => (value: number) => formatNumber(value));
export const duration = derived([language, translationRevision], () => (value: number) => formatDuration(value));
export const locale = derived(language, (value) => (value === 'fr' ? 'fr-FR' : 'en-GB'));

/** Rerenders translated UI after a local administrator edit. */
export function refreshTranslations() {
  translationRevision.update((value) => value + 1);
}
