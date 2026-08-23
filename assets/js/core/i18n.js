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

export function setLanguage(language) {
  currentLanguage = language;
  localStorage.setItem('lat-lang', currentLanguage);
}

export function applyStaticI18n() {
  document.documentElement.lang = currentLanguage;
  $$('[data-i18n]').forEach(element => element.textContent = translate(element.dataset.i18n));
  $$('.flag-btn').forEach(button => button.classList.toggle('active', button.dataset.lang === currentLanguage));
}
