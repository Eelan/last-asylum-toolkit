import { readPreference, writePreference } from '../platform/storage.ts';
import { TRANSLATIONS } from '../i18n/translations.js';

let currentLanguage = readPreference('lat-lang') || 'fr';

export function translate(key) {
  return TRANSLATIONS[currentLanguage]?.[key] ?? TRANSLATIONS.fr[key] ?? key;
}

export function formatNumber(value) {
  const locale = currentLanguage === 'fr' ? 'fr-FR' : 'en-GB';
  return new Intl.NumberFormat(locale).format(Math.round(value));
}

/** Formats a duration without displaying empty units. */
export function formatDuration(totalSeconds) {
  const units = [
    ['day_short', 86400], ['hour_short', 3600], ['minute_short', 60], ['second_short', 1]
  ];
  let remaining = Math.max(0, Math.floor(totalSeconds));
  return units.map(([key, size]) => {
    const value = Math.floor(remaining / size);
    remaining %= size;
    return value ? `${value} ${translate(key)}` : '';
  }).filter(Boolean).join(' ') || `0 ${translate('second_short')}`;
}

export function setLanguage(language) {
  currentLanguage = language;
  writePreference('lat-lang', currentLanguage);
}

export function getLanguage() {
  return currentLanguage;
}
