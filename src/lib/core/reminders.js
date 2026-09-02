import { readPreference, writePreference } from '../platform/storage.ts';
const REMINDERS_KEY = 'lat-reminders';

export function getReminders() {
  try {
    const reminders = JSON.parse(readPreference(REMINDERS_KEY) || '[]');
    return Array.isArray(reminders)
      ? reminders.filter(reminder => reminder.id && reminder.title && Number.isFinite(reminder.endAt))
      : [];
  } catch (error) {
    return [];
  }
}

export function saveReminders(reminders) {
  try {
    writePreference(REMINDERS_KEY, JSON.stringify(reminders));
  } catch (error) {}
  document.dispatchEvent(new CustomEvent('lat-reminders-change'));
}

export function addReminder(reminder) {
  const reminders = getReminders();
  reminders.push(reminder);
  saveReminders(reminders);
}

export function removeReminder(reminderId) {
  saveReminders(getReminders().filter(reminder => reminder.id !== reminderId));
}

export function snoozeReminder(reminderId, minutes) {
  const reminders = getReminders().map(reminder => reminder.id === reminderId
    ? { ...reminder, endAt: Date.now() + minutes * 60 * 1000, notified: false }
    : reminder);
  saveReminders(reminders);
}

/** Checks persisted reminders globally so alerts can fire from any application page. */
export function checkDueReminders(onDue, now = Date.now()) {
  const reminders = getReminders();
  let changed = false;
  reminders.forEach(reminder => {
    if (!reminder.notified && reminder.endAt <= now) {
      reminder.notified = true;
      changed = true;
      onDue(reminder);
    }
  });
  if (changed) saveReminders(reminders);
}
