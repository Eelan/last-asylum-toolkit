export const $ = (selector, context = document) => context.querySelector(selector);
export const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

export function icon(name) {
  return `<i data-lucide="${name}"></i>`;
}

export function createLevelOptions(min, max, selected) {
  let options = '';
  for (let level = min; level <= max; level++) {
    options += `<option value="${level}" ${level === selected ? 'selected' : ''}>${level}</option>`;
  }
  return options;
}
