/** Foreground reminders only; Android background scheduling is a separate native feature. */
export async function requestNotifications() {
  if ('Notification' in window) return Notification.requestPermission();
  return 'denied';
}
/** Delivers a foreground reminder, falling back to the existing in-app alert. */
export function notifyReminder(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, { body });
      return;
    } catch {
      /* WebViews may reject this API. */
    }
  }
  window.alert(`${title}\n${body}`);
}
