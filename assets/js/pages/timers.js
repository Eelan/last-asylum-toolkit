import { $, $$, icon } from '../core/dom.js';
import { getLanguage, translate } from '../core/i18n.js';
import { addReminder, getReminders, removeReminder, snoozeReminder } from '../core/reminders.js';
import { renderPageHeader } from '../core/ui.js';

let cleanupActiveTimers = () => {};

function escapeHtml(value) {
  const element = document.createElement('div');
  element.textContent = value;
  return element.innerHTML;
}

function formatRemaining(milliseconds) {
  if (milliseconds <= 0) return translate('timer_finished');
  const seconds = Math.ceil(milliseconds / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return [
    days ? `${days} ${translate('day_short')}` : '',
    hours ? `${hours} ${translate('hour_short')}` : '',
    minutes ? `${minutes} ${translate('minute_short')}` : '',
    `${remainingSeconds} ${translate('second_short')}`
  ].filter(Boolean).join(' ');
}

function formatEndTime(timestamp) {
  const locale = getLanguage() === 'fr' ? 'fr-FR' : 'en-GB';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }).format(new Date(timestamp));
}

function getDefaultEndValue(minutes = 60) {
  const date = new Date(Date.now() + minutes * 60 * 1000);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function renderReminder(reminder) {
  const finished = reminder.endAt <= Date.now();
  return `<article class="timer-card ${finished ? 'finished' : ''}" data-reminder-id="${reminder.id}">
   <div class="timer-card-icon">${icon(reminder.type === 'research' ? 'flask-conical' : reminder.type === 'construction' ? 'hammer' : reminder.type === 'builder' ? 'hard-hat' : reminder.type === 'training' ? 'shield' : 'bell')}</div>
   <div class="timer-card-content"><span>${translate(`timer_type_${reminder.type}`)}</span><strong>${escapeHtml(reminder.title)}</strong><small>${translate('timer_ends_at')} ${formatEndTime(reminder.endAt)}</small></div>
   <time data-timer-remaining="${reminder.endAt}">${formatRemaining(reminder.endAt - Date.now())}</time>
   <div class="timer-actions">${finished ? `<button type="button" data-timer-snooze="5">${translate('timer_snooze_5')}</button><button type="button" data-timer-snooze="15">${translate('timer_snooze_15')}</button>` : ''}<button type="button" data-timer-remove aria-label="${translate('timer_delete')}">${icon('trash-2')}</button></div>
  </article>`;
}

export function renderTimersPage(tool) {
  cleanupActiveTimers();
  let refreshInterval;

  const renderList = () => {
    const reminders = getReminders().sort((left, right) => left.endAt - right.endAt);
    $('#timers-list').innerHTML = reminders.length
      ? reminders.map(renderReminder).join('')
      : `<div class="timers-empty">${icon('timer-off')}<strong>${translate('timers_empty')}</strong><span>${translate('timers_empty_hint')}</span></div>`;
    $$('[data-timer-remove]').forEach(button => button.addEventListener('click', () => removeReminder(button.closest('[data-reminder-id]').dataset.reminderId)));
    $$('[data-timer-snooze]').forEach(button => button.addEventListener('click', () => snoozeReminder(button.closest('[data-reminder-id]').dataset.reminderId, Number(button.dataset.timerSnooze))));
    lucide.createIcons();
  };

  $('#view').innerHTML = renderPageHeader(tool) + `
   <div class="calc-grid timers-layout"><section class="panel"><form id="timer-form">
    <div class="form-grid">
     <label class="full"><span>${translate('timer_name')}</span><input id="timer-name" maxlength="80" required placeholder="${translate('timer_name_placeholder')}"></label>
     <label><span>${translate('timer_type')}</span><select id="timer-type"><option value="research">${translate('timer_type_research')}</option><option value="construction">${translate('timer_type_construction')}</option><option value="builder">${translate('timer_type_builder')}</option><option value="training">${translate('timer_type_training')}</option><option value="other">${translate('timer_type_other')}</option></select></label>
     <label><span>${translate('timer_end')}</span><input id="timer-end" type="datetime-local" required value="${getDefaultEndValue()}"></label>
    </div>
    <div class="timer-presets"><span>${translate('timer_quick_add')}</span>${[15, 30, 60, 240].map(minutes => `<button type="button" data-timer-preset="${minutes}">+${minutes < 60 ? `${minutes} ${translate('minute_short')}` : `${minutes / 60} ${translate('hour_short')}`}</button>`).join('')}</div>
    <button class="primary-btn timer-submit" type="submit">${icon('bell-plus')} ${translate('timer_create')}</button>
   </form></section>
   <section class="panel timer-notification-panel"><span class="tool-icon">${icon('bell-ring')}</span><h3>${translate('timer_notifications')}</h3><p>${translate('timer_notification_help')}</p><button id="enable-notifications" class="primary-btn" type="button">${translate('timer_enable_notifications')}</button><p class="form-note">${translate('timer_browser_limit')}</p></section></div>
   <section class="timers-list" id="timers-list"></section>`;

  $('#timer-form').addEventListener('submit', event => {
    event.preventDefault();
    const title = $('#timer-name').value.trim();
    const endAt = new Date($('#timer-end').value).getTime();
    if (!title || !Number.isFinite(endAt) || endAt <= Date.now()) {
      $('#timer-end').setCustomValidity(translate('timer_future_required'));
      $('#timer-end').reportValidity();
      return;
    }
    addReminder({ id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, title, type: $('#timer-type').value, endAt, notified: false });
    $('#timer-name').value = '';
    $('#timer-end').value = getDefaultEndValue();
  });
  $$('[data-timer-preset]').forEach(button => button.addEventListener('click', () => {
    $('#timer-end').setCustomValidity('');
    $('#timer-end').value = getDefaultEndValue(Number(button.dataset.timerPreset));
  }));
  $('#timer-end').addEventListener('input', () => $('#timer-end').setCustomValidity(''));
  $('#enable-notifications').addEventListener('click', async () => {
    if ('Notification' in window) await Notification.requestPermission();
  });
  const handleReminderChange = () => renderList();
  document.addEventListener('lat-reminders-change', handleReminderChange);
  renderList();
  refreshInterval = setInterval(() => {
    $$('[data-timer-remaining]').forEach(element => element.textContent = formatRemaining(Number(element.dataset.timerRemaining) - Date.now()));
  }, 1000);
  cleanupActiveTimers = () => {
    clearInterval(refreshInterval);
    document.removeEventListener('lat-reminders-change', handleReminderChange);
  };
  window.addEventListener('hashchange', cleanupActiveTimers, { once: true });
}
