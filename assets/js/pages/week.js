import { $ } from '../core/dom.js';
import { formatNumber, translate } from '../core/i18n.js';
import { renderPageHeader } from '../core/ui.js';
import { GAME_DATA } from '../data.js';

function renderKeyList(keys) {
  return `<ul>${keys.map(key => `<li>${translate(key)}</li>`).join('')}</ul>`;
}

function renderActivityRows(activities) {
  return activities.map(activity => `<tr><td>${translate(activity.labelKey)}</td><td>${formatNumber(activity.quantity)}</td><td>${formatNumber(activity.points)}</td></tr>`).join('');
}

function renderLevelTable(table) {
  if (!table) return '';
  return `<div class="duel-level-table"><h4>${translate(table.labelKey)}</h4><div class="table-wrap"><table><thead><tr><th>${translate('level')}</th>${table.pointsByLevel.map((_, index) => `<th>${index + 1}</th>`).join('')}</tr></thead><tbody><tr><td>${translate('duel_points_per_unit')}</td>${table.pointsByLevel.map(points => `<td>${formatNumber(points)}</td>`).join('')}</tr></tbody></table></div></div>`;
}

function renderPhaseDetails(phase, today) {
  return `<details class="duel-day ${phase.weekday === today ? 'today' : ''}" ${phase.weekday === today ? 'open' : ''}>
   <summary><span class="duel-day-number">${translate('day')} ${phase.weekday}</span><span class="duel-day-title"><strong>${translate(`weekday_${phase.weekday}`)} — ${translate(phase.titleKey)}</strong><small>${translate(phase.summaryKey)}</small></span>${phase.weekday === today ? `<span class="duel-today-badge">${translate('today')}</span>` : ''}</summary>
   <div class="duel-day-content">
    <div class="duel-guidance-grid"><section><h4>${translate('prepare')}</h4>${renderKeyList(phase.prepareKeys)}</section><section><h4>${translate('use')}</h4>${renderKeyList(phase.useKeys)}</section><section><h4>${translate('keep')}</h4>${renderKeyList(phase.saveKeys)}</section></div>
    <section class="duel-tips"><h4>${translate('duel_tips')}</h4>${renderKeyList(phase.tipKeys)}</section>
    ${(phase.noticeKeys || []).map(key => `<p class="duel-notice">${translate(key)}</p>`).join('')}
    <section class="duel-scoring"><h4>${translate('duel_scoring')}</h4><div class="table-wrap"><table><thead><tr><th>${translate('activity')}</th><th>${translate('quantity')}</th><th>${translate('duel_points')}</th></tr></thead><tbody>${renderActivityRows(phase.activities)}</tbody></table></div>${renderLevelTable(phase.levelTable)}${(phase.combatTables || []).map(renderLevelTable).join('')}</section>
   </div>
  </details>`;
}

export function renderWeekPage(tool) {
  const duel = GAME_DATA.duel;
  const today = new Date().getUTCDay();
  const currentPhase = duel.phases.find(phase => phase.weekday === today);
  $('#view').innerHTML = renderPageHeader(tool) + `
   <section class="panel duel-week-intro"><div><span class="kicker">${translate('duel_six_day_event')}</span><h3>${translate('duel_week_intro_title')}</h3><p>${translate('duel_week_intro')}</p></div><div class="duel-reset"><span>${translate('duel_daily_reset')}</span><strong>${String(duel.resetUtcHour).padStart(2, '0')}:00 UTC</strong></div></section>
   <section class="duel-week-strip" aria-label="${translate('duel_week_overview')}">${duel.phases.map(phase => `<button type="button" data-duel-target="duel-${phase.id}" class="duel-week-card ${phase === currentPhase ? 'today' : ''}"><span>${translate(`weekday_${phase.weekday}`)}</span><strong>${translate(phase.titleKey)}</strong></button>`).join('')}<button type="button" data-duel-target="duel-sunday" class="duel-week-card preparation ${today === 0 ? 'today' : ''}"><span>${translate('weekday_0')}</span><strong>${translate('duel_sunday_preparation')}</strong></button></section>
   <section class="duel-guide">${duel.phases.map(phase => `<div id="duel-${phase.id}">${renderPhaseDetails(phase, today)}</div>`).join('')}
    <details id="duel-sunday" class="duel-day preparation ${today === 0 ? 'today' : ''}" ${today === 0 ? 'open' : ''}><summary><span class="duel-day-number">${translate('duel_before_event')}</span><span class="duel-day-title"><strong>${translate('weekday_0')} — ${translate('duel_sunday_preparation')}</strong><small>${translate('duel_sunday_summary')}</small></span>${today === 0 ? `<span class="duel-today-badge">${translate('today')}</span>` : ''}</summary><div class="duel-day-content"><div class="duel-guidance-grid"><section><h4>${translate('prepare')}</h4>${renderKeyList(['duel_sunday_falcon', 'duel_sunday_gathering', 'duel_sunday_building'])}</section><section><h4>${translate('keep')}</h4>${renderKeyList(['duel_sunday_save_resources', 'duel_sunday_save_chests'])}</section><section><h4>${translate('focus')}</h4>${renderKeyList(['duel_sunday_check_reset', 'duel_sunday_check_timers'])}</section></div><p class="duel-notice">${translate('duel_sunday_not_phase')}</p></div></details>
   </section><p class="form-note duel-source-note">${translate('duel_community_disclaimer')} <a href="#/sources">${translate('sources_title')}</a></p>`;

  document.querySelectorAll('[data-duel-target]').forEach(button => button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.duelTarget);
    const details = target?.querySelector('details') || target;
    if (details) details.open = true;
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}
