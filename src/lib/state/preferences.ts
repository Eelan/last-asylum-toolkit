import { writable, derived } from 'svelte/store';
import { getLanguage, setLanguage, translate, formatNumber, formatDuration } from '../core/i18n.js';
import { getClockMode, setClockMode } from '../core/time.js';

export const language = writable(getLanguage());
export const clockMode = writable(getClockMode());
language.subscribe(setLanguage);
clockMode.subscribe(setClockMode);
export const t = derived(language, () => (key: string) => translate(key));
export const number = derived(language, () => (value: number) => formatNumber(value));
export const duration = derived(language, () => (value: number) => formatDuration(value));
export const locale = derived(language, (value) => (value === 'fr' ? 'fr-FR' : 'en-GB'));
