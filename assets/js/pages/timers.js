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

function getLocalDateTimeValue(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

const TIMER_PRESETS = [
  { minutes: 1, labelKey: 'timer_preset_1m' },
  { minutes: 15, labelKey: 'timer_preset_15m' },
  { minutes: 60, labelKey: 'timer_preset_1h' },
  { minutes: 240, labelKey: 'timer_preset_4h' },
  { minutes: 1440, labelKey: 'timer_preset_1d' }
];

const TIMER_TYPES = [
  { id: 'other', icon: 'bell' },
  { id: 'research', icon: 'flask-conical' },
  { id: 'construction', icon: 'hammer' },
  { id: 'training', icon: 'shield' },
  { id: 'builder', icon: 'crown' }
];

function renderTimerTypeButtons(selectedType) {
  return TIMER_TYPES.map(type => `<button class="timer-type-button ${type.id === selectedType ? 'selected' : ''}" type="button" data-timer-type="${type.id}" aria-pressed="${type.id === selectedType}">${icon(type.icon)}<span>${translate(`timer_type_${type.id}`)}</span></button>`).join('');
}

function renderReminder(reminder) {
  const finished = reminder.endAt <= Date.now();
  return `<article class="timer-card ${finished ? 'finished' : ''}" data-reminder-id="${reminder.id}">
   <div class="timer-card-icon">${icon(TIMER_TYPES.find(type => type.id === reminder.type)?.icon || 'bell')}</div>
   <div class="timer-card-content"><span>${translate(`timer_type_${reminder.type}`)}</span><strong>${escapeHtml(reminder.title)}</strong><small>${translate('timer_ends_at')} ${formatEndTime(reminder.endAt)}</small></div>
   <time data-timer-remaining="${reminder.endAt}">${formatRemaining(reminder.endAt - Date.now())}</time>
   <div class="timer-actions">${finished ? `<button type="button" data-timer-snooze="5">${translate('timer_snooze_5')}</button><button type="button" data-timer-snooze="15">${translate('timer_snooze_15')}</button>` : ''}<button type="button" data-timer-remove aria-label="${translate('timer_delete')}">${icon('trash-2')}</button></div>
  </article>`;
}

export function renderTimersPage(tool) {
  cleanupActiveTimers();
  let refreshInterval;
  let selectedType = 'other';

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
   <section class="panel timers-layout"><form id="timer-form">
    <div class="form-grid">
     <label class="full"><span>${translate('timer_name')}</span><input id="timer-name" maxlength="80" required placeholder="${translate('timer_name_placeholder')}"></label>
     <div class="full timer-type-field"><span>${translate('timer_type')}</span><div class="timer-type-buttons" role="group" aria-label="${translate('timer_type')}">${renderTimerTypeButtons(selectedType)}</div></div>
     <label class="full"><span>${translate('timer_end')}</span><input id="timer-end" type="datetime-local" required></label>
    </div>
    <div class="timer-presets"><span>${translate('timer_quick_add')}</span>${TIMER_PRESETS.map(preset => `<button type="button" data-timer-preset="${preset.minutes}">${translate(preset.labelKey)}</button>`).join('')}</div>
    <button class="primary-btn timer-submit" type="submit">${icon('bell-plus')} ${translate('timer_create')}</button>
   </form></section>
   <section class="timers-list" id="timers-list"></section>
   <section class="panel timer-notification-panel"><span class="tool-icon">${icon('bell-ring')}</span><h3>${translate('timer_notifications')}</h3><p>${translate('timer_notification_help')}</p><button id="enable-notifications" class="primary-btn" type="button">${translate('timer_enable_notifications')}</button><p class="form-note">${translate('timer_browser_limit')}</p></section>`;

  $('#timer-form').addEventListener('submit', event => {
    event.preventDefault();
    const title = $('#timer-name').value.trim();
    const endAt = new Date($('#timer-end').value).getTime();
    if (!title || !Number.isFinite(endAt) || endAt <= Date.now()) {
      $('#timer-end').setCustomValidity(translate('timer_future_required'));
      $('#timer-end').reportValidity();
      return;
    }
    addReminder({ id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, title, type: selectedType, endAt, notified: false });
    $('#timer-name').value = '';
    $('#timer-end').value = '';
  });
  $$('[data-timer-type]').forEach(button => button.addEventListener('click', () => {
    selectedType = button.dataset.timerType;
    $$('[data-timer-type]').forEach(typeButton => {
      const selected = typeButton.dataset.timerType === selectedType;
      typeButton.classList.toggle('selected', selected);
      typeButton.setAttribute('aria-pressed', String(selected));
    });
  }));
  $$('[data-timer-preset]').forEach(button => button.addEventListener('click', () => {
    const endInput = $('#timer-end');
    const currentEnd = new Date(endInput.value).getTime();
    const nextWholeMinute = Math.ceil(Date.now() / 60_000) * 60_000;
    const baseTimestamp = Number.isFinite(currentEnd) && currentEnd >= nextWholeMinute ? currentEnd : nextWholeMinute;
    const nextEnd = new Date(baseTimestamp + Number(button.dataset.timerPreset) * 60_000);
    endInput.setCustomValidity('');
    endInput.value = getLocalDateTimeValue(nextEnd);
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
