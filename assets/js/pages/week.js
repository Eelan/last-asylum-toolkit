import { $ } from '../core/dom.js';
import { translate } from '../core/i18n.js';
import { renderPageHeader } from '../core/ui.js';

export function renderWeekPage(tool) {
  const days = translate('days');
  // JavaScript starts weeks on Sunday; the planner data starts on Monday.
  const today = (new Date().getDay() + 6) % 7;
  $('#view').innerHTML = renderPageHeader(tool) + `<div class="week-list">${days.map((day,index)=>`
 <article class="day-row ${index === today ? 'today' : ''}">
  <div class="day-name"><strong>${day[0]}</strong><span>${day[1]} ${index === today ? '• ' + translate('today') : ''}</span></div>
  <div class="day-col"><b>${translate('use')}</b><span>${day[2]}</span></div>
  <div class="day-col"><b>${translate('keep')}</b><span>${day[3]}</span></div>
  <div class="day-col"><b>${translate('focus')}</b><span>${day[4]}</span></div>
 </article>`).join('')}</div>`;
}
