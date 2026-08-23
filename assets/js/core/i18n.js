import { $$ } from './dom.js';
import { TRANSLATIONS } from '../i18n.js';

let currentLanguage = localStorage.getItem('lat-lang') || (navigator.language?.startsWith('fr') ? 'fr' : 'en');

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
  localStorage.setItem('lat-lang', currentLanguage);
}

export function applyStaticI18n() {
  document.documentElement.lang = currentLanguage;
  $$('[data-i18n]').forEach(element => element.textContent = translate(element.dataset.i18n));
  $$('.flag-btn').forEach(button => button.classList.toggle('active', button.dataset.lang === currentLanguage));
}
