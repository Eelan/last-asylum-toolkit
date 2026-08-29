const CLOCK_MODE_KEY = 'lat-clock-mode';
export const SERVER_UTC_OFFSET_HOURS = -2;

export function getClockMode() {
  return localStorage.getItem(CLOCK_MODE_KEY) === 'local' ? 'local' : 'server';
}

export function setClockMode(mode) {
  localStorage.setItem(CLOCK_MODE_KEY, mode === 'local' ? 'local' : 'server');
}

/** Returns a date shifted so UTC formatting displays the fixed game-server time. */
export function getServerDate(date) {
  return new Date(date.getTime() + SERVER_UTC_OFFSET_HOURS * 60 * 60 * 1000);
}

/** Converts a shifted server-wall-clock date back to its absolute instant. */
export function getAbsoluteDateFromServerDate(serverDate) {
  return new Date(serverDate.getTime() - SERVER_UTC_OFFSET_HOURS * 60 * 60 * 1000);
}

/** Returns an absolute date for a weekday and hour in the current game-server week. */
export function getServerWeekdayDate(weekday, serverHour, now = new Date()) {
  const serverNow = getServerDate(now);
  const daysSinceMonday = (serverNow.getUTCDay() + 6) % 7;
  const targetDay = (weekday + 6) % 7;
  const serverMonday = new Date(serverNow);
  serverMonday.setUTCDate(serverMonday.getUTCDate() - daysSinceMonday);
  serverMonday.setUTCHours(0, 0, 0, 0);
  const serverTarget = new Date(serverMonday.getTime() + (targetDay * 24 + serverHour) * 60 * 60 * 1000);
  return getAbsoluteDateFromServerDate(serverTarget);
}

/** Formats a date in either fixed game-server time or the browser's local timezone. */
export function formatClockTime(date, mode, locale, includeSeconds = true) {
  const serverMode = mode === 'server';
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit', minute: '2-digit',
    ...(includeSeconds ? { second: '2-digit' } : {}),
    hourCycle: 'h23',
    ...(serverMode ? { timeZone: 'UTC' } : {})
  }).format(serverMode ? getServerDate(date) : date);
}

/** Returns the next absolute occurrence of a reset defined in fixed game-server time. */
export function getNextServerReset(resetServerHour, now = new Date()) {
  const serverNow = getServerDate(now);
  const serverReset = new Date(serverNow);
  serverReset.setUTCHours(resetServerHour, 0, 0, 0);
  if (serverReset <= serverNow) serverReset.setUTCDate(serverReset.getUTCDate() + 1);
  return getAbsoluteDateFromServerDate(serverReset);
}
