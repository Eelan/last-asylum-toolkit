import { getServerDate, getAbsoluteDateFromServerDate } from './time.js';
/** Returns the next or ongoing event occurrence as an absolute instant. */
export function getNextOccurrence(event, now) {
  if (event.timeMode === 'server') {
    const serverNow = getServerDate(now);
    const serverOccurrence = new Date(serverNow);
    serverOccurrence.setUTCHours(event.hour, event.minute, 0, 0);
    let daysUntilEvent = (event.weekday - serverNow.getUTCDay() + 7) % 7;
    serverOccurrence.setUTCDate(serverOccurrence.getUTCDate() + daysUntilEvent);

    let occurrence = getAbsoluteDateFromServerDate(serverOccurrence);
    const occurrenceEnd = new Date(occurrence.getTime() + (event.durationMinutes || 0) * 60_000);
    const hasPassed = event.durationMinutes ? occurrenceEnd <= now : occurrence <= now;
    if (daysUntilEvent === 0 && hasPassed) {
      serverOccurrence.setUTCDate(serverOccurrence.getUTCDate() + 7);
      occurrence = getAbsoluteDateFromServerDate(serverOccurrence);
    }
    return occurrence;
  }

  const occurrence = new Date(now);
  occurrence.setHours(event.hour, event.minute, 0, 0);
  let daysUntilEvent = (event.weekday - now.getDay() + 7) % 7;
  const occurrenceEnd = new Date(occurrence.getTime() + (event.durationMinutes || 0) * 60_000);
  const hasPassed = event.durationMinutes ? occurrenceEnd <= now : occurrence <= now;
  if (daysUntilEvent === 0 && hasPassed) daysUntilEvent = 7;
  occurrence.setDate(occurrence.getDate() + daysUntilEvent);
  return occurrence;
}

/** Formats the occurrence date in the selected server/local clock. */
export function formatEventDate(occurrence, mode, locale) {
  const serverMode = mode === 'server';
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(serverMode ? { timeZone: 'UTC' } : {})
  }).format(serverMode ? getServerDate(occurrence) : occurrence);
}

/** Formats the displayed weekday after timezone conversion. */
export function formatEventWeekday(occurrence, mode, locale) {
  const serverMode = mode === 'server';
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    ...(serverMode ? { timeZone: 'UTC' } : {})
  }).format(serverMode ? getServerDate(occurrence) : occurrence);
}
