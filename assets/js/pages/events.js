import { $, icon } from '../core/dom.js';
import { loadDataset } from '../core/datasets.js';
import { getLanguage, translate } from '../core/i18n.js';
import { formatClockTime, getAbsoluteDateFromServerDate, getClockMode, getServerDate } from '../core/time.js';
import { renderPageHeader } from '../core/ui.js';

function getNextOccurrence(event, now) {
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

function formatEventDate(occurrence, mode, locale) {
  const serverMode = mode === 'server';
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(serverMode ? { timeZone: 'UTC' } : {})
  }).format(serverMode ? getServerDate(occurrence) : occurrence);
}

function formatEventWeekday(occurrence, mode, locale) {
  const serverMode = mode === 'server';
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    ...(serverMode ? { timeZone: 'UTC' } : {})
  }).format(serverMode ? getServerDate(occurrence) : occurrence);
}

function renderEventCard({ event, occurrence }, mode, locale, nextTimestamp) {
  const date = formatEventDate(occurrence, mode, locale);
  const occurrenceEnd = new Date(occurrence.getTime() + (event.durationMinutes || 0) * 60_000);
  const startTime = formatClockTime(occurrence, mode, locale, false);
  const time = event.durationMinutes
    ? `${startTime}–${formatClockTime(occurrenceEnd, mode, locale, false)}`
    : startTime;
  const isNext = occurrence.getTime() === nextTimestamp;

  return `<article class="weekly-event-card ${isNext ? 'next' : ''}">
   <span class="weekly-event-icon">${icon('calendar-clock')}</span>
   <div><span>${formatEventWeekday(occurrence, mode, locale)}</span><h3>${translate(event.nameKey)}</h3><small>${date}</small></div>
   <time datetime="${occurrence.toISOString()}">${time}<small>${translate(mode === 'server' ? 'server_time' : 'local_time')}</small></time>
  </article>`;
}

function renderCatalogCard(event) {
  return `<article class="event-catalog-card">
   <div class="event-catalog-head"><span class="event-confidence ${event.confidence}">${translate(`event_confidence_${event.confidence}`)}</span><a href="${event.sourceUrl}" target="_blank" rel="noopener noreferrer" aria-label="${translate('event_open_source')}">${icon('external-link')}</a></div>
   <h3>${translate(event.nameKey)}</h3>
   <p>${translate(event.summaryKey)}</p>
   <div class="event-schedule"><span>${icon('repeat-2')} ${translate('event_recurrence')}</span><strong>${translate(event.scheduleKey)}</strong></div>
  </article>`;
}

/** Renders recurring events using the application-wide server/local clock mode. */
export async function renderEventsPage(tool) {
  $('#view').innerHTML = renderPageHeader(tool) + `<section class="panel events-loading">${icon('loader-circle')} ${translate('events_loading')}</section>`;

  try {
    const [events, catalog] = await Promise.all([
      loadDataset('../../data/events/weekly-events.json'),
      loadDataset('../../data/events/event-catalog.json')
    ]);
    const now = new Date();
    const locale = getLanguage() === 'fr' ? 'fr-FR' : 'en-GB';
    const clockMode = getClockMode();
    const scheduledEvents = events
      .map(event => ({ event, occurrence: getNextOccurrence(event, now) }))
      .sort((first, second) => first.occurrence - second.occurrence);
    const nextTimestamp = scheduledEvents[0]?.occurrence.getTime();
    if (location.hash !== '#/events') return;

    $('#view').innerHTML = renderPageHeader(tool) + `
     <section class="panel events-intro"><span class="kicker">${translate('events_weekly')}</span><h3>${translate('events_schedule_title')}</h3><p>${translate('events_schedule_intro')}</p></section>
     <section class="weekly-events">${scheduledEvents.map(item => renderEventCard(item, clockMode, locale, nextTimestamp)).join('')}</section>
     <p class="form-note events-note">${translate('events_clock_note')}</p>
     <section class="events-catalog-section"><div class="events-section-head"><span class="kicker">${translate('events_catalog_kicker')}</span><h3>${translate('events_catalog_title')}</h3><p>${translate('events_catalog_intro')}</p></div><div class="event-catalog-grid">${catalog.map(renderCatalogCard).join('')}</div></section>`;
    lucide.createIcons();
  } catch (error) {
    if (location.hash !== '#/events') return;
    $('#view').innerHTML = renderPageHeader(tool) + `<section class="empty-state"><span class="tool-icon">${icon('triangle-alert')}</span><h2>${translate('events_load_error')}</h2></section>`;
    lucide.createIcons();
  }
}
