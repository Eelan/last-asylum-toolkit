<script>
  import { onMount } from 'svelte';
  import { loadDataset } from '../lib/core/datasets.js';
  import { getNextOccurrence, formatEventDate, formatEventWeekday } from '../lib/core/events.js';
  import { formatClockTime } from '../lib/core/time.js';
  import { t, clockMode, locale } from '../lib/state/preferences.ts';
  import Icon from '../lib/components/Icon.svelte';
  const data = Promise.all([
    loadDataset('data/events/weekly-events.json'),
    loadDataset('data/events/event-catalog.json')
  ]);
  let now = $state(new Date());
  onMount(() => {
    const timer = setInterval(() => (now = new Date()), 60_000);
    return () => clearInterval(timer);
  });
  function schedule(events, instant) {
    return events
      .map((event) => ({ event, occurrence: getNextOccurrence(event, instant) }))
      .sort((a, b) => a.occurrence - b.occurrence);
  }
</script>

{#await data}<section class="panel events-loading">
    <Icon name="loader-circle" />
    {$t('events_loading')}
  </section>
{:then [events, catalog]}
  {@const scheduled = schedule(events, now)}
  <section class="panel events-intro">
    <span class="kicker">{$t('events_weekly')}</span>
    <h3>{$t('events_schedule_title')}</h3>
    <p>{$t('events_schedule_intro')}</p>
  </section>
  <section class="weekly-events">
    {#each scheduled as { event, occurrence }}<article
        class="weekly-event-card"
        class:next={occurrence.getTime() === scheduled[0]?.occurrence.getTime()}
      >
        <span class="weekly-event-icon"><Icon name="calendar-clock" /></span>
        <div>
          <span>{formatEventWeekday(occurrence, $clockMode, $locale)}</span>
          <h3>{$t(event.nameKey)}</h3>
          <small>{formatEventDate(occurrence, $clockMode, $locale)}</small>
        </div>
        <time datetime={occurrence.toISOString()}
          >{formatClockTime(
            occurrence,
            $clockMode,
            $locale,
            false
          )}{#if event.durationMinutes}–{formatClockTime(
              new Date(occurrence.getTime() + event.durationMinutes * 60000),
              $clockMode,
              $locale,
              false
            )}{/if}<small>{$t($clockMode === 'server' ? 'server_time' : 'local_time')}</small></time
        >
      </article>{/each}
  </section>
  <p class="form-note events-note">{$t('events_clock_note')}</p>
  <section class="events-catalog-section">
    <div class="events-section-head">
      <span class="kicker">{$t('events_catalog_kicker')}</span>
      <h3>{$t('events_catalog_title')}</h3>
      <p>{$t('events_catalog_intro')}</p>
    </div>
    <div class="event-catalog-grid">
      {#each catalog as event}<article class="event-catalog-card">
          <div class="event-catalog-head">
            <span class={'event-confidence ' + event.confidence}
              >{$t('event_confidence_' + event.confidence)}</span
            ><a
              href={event.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={$t('event_open_source')}><Icon name="external-link" /></a
            >
          </div>
          <h3>{$t(event.nameKey)}</h3>
          <p>{$t(event.summaryKey)}</p>
          <div class="event-schedule">
            <span><Icon name="repeat-2" /> {$t('event_recurrence')}</span><strong
              >{$t(event.scheduleKey)}</strong
            >
          </div>
        </article>{/each}
    </div>
  </section>
{:catch}<section class="empty-state">
    <Icon name="triangle-alert" />
    <h2>{$t('events_load_error')}</h2>
  </section>{/await}
