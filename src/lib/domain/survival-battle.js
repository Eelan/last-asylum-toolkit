/** Returns the Monday-based day index used by the weekly Survival Battle cycle. */
function getMondayBasedDay(weekday, resetWeekday) {
  return (weekday - resetWeekday + 7) % 7;
}

/** Returns every server-time window matching a theme on a given server weekday. */
export function getThemeWindowsForWeekday(schedule, weekday, themeId) {
  if (!themeId || !schedule.themeIds.includes(themeId)) return [];
  const windowsPerDay = 24 / schedule.windowDurationHours;
  const firstWindow = getMondayBasedDay(weekday, schedule.resetWeekday) * windowsPerDay;
  const windows = [];

  for (let index = 0; index < windowsPerDay; index++) {
    const theme = schedule.themeIds[(firstWindow + index) % schedule.themeIds.length];
    if (theme === themeId) {
      const startHour = schedule.resetServerHour + index * schedule.windowDurationHours;
      windows.push({ startHour, endHour: startHour + schedule.windowDurationHours });
    }
  }
  return windows;
}

/** Returns the active theme from a date whose UTC fields represent server wall-clock time. */
export function getCurrentSurvivalWindow(schedule, serverDate) {
  const windowsPerDay = 24 / schedule.windowDurationHours;
  const dayIndex = getMondayBasedDay(serverDate.getUTCDay(), schedule.resetWeekday);
  const elapsedHours = (serverDate.getUTCHours() - schedule.resetServerHour + 24) % 24;
  const dailyWindow = Math.floor(elapsedHours / schedule.windowDurationHours);
  const cycleWindow = dayIndex * windowsPerDay + dailyWindow;
  const startHour = schedule.resetServerHour + dailyWindow * schedule.windowDurationHours;
  return {
    themeId: schedule.themeIds[cycleWindow % schedule.themeIds.length],
    startHour,
    endHour: startHour + schedule.windowDurationHours
  };
}
