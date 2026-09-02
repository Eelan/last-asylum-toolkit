import { isTauri } from '@tauri-apps/api/core';

/** Tauri source links use the system browser; web links keep normal anchor behavior. */
export async function openExternalLink(event: MouseEvent) {
  const anchor = (event.target as Element)?.closest('a');
  if (!anchor || !isTauri() || !anchor.href.startsWith('https://')) return;
  event.preventDefault();
  const { openUrl } = await import('@tauri-apps/plugin-opener');
  await openUrl(anchor.href);
}
