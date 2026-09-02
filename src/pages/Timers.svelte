<script>
  import { onMount } from 'svelte';
  import { addReminder, getReminders, removeReminder, snoozeReminder } from '../lib/core/reminders.js';
  import { formatDateTime, fromDateTimeInput, toDateTimeInput } from '../lib/core/time.js';
  import { requestNotifications } from '../lib/platform/notifications.ts';
  import { t, duration, clockMode, locale } from '../lib/state/preferences.ts';
  import Icon from '../lib/components/Icon.svelte';
  const types = [
    ['other', 'bell'],
    ['research', 'flask-conical'],
    ['construction', 'hammer'],
    ['training', 'shield'],
    ['builder', 'crown']
  ];
  const presets = [
    [1, 'timer_preset_1m'],
    [15, 'timer_preset_15m'],
    [60, 'timer_preset_1h'],
    [240, 'timer_preset_4h'],
    [1440, 'timer_preset_1d']
  ];
  let title = $state(''),
    selectedType = $state('other'),
    endAt = $state(null),
    now = $state(Date.now()),
    reminders = $state(getReminders()),
    endInput;
  let endValue = $derived(endAt !== null ? toDateTimeInput(new Date(endAt), $clockMode) : '');
  function refresh() {
    reminders = getReminders();
  }
  function preset(minutes) {
    const base = Math.max(endAt || 0, Math.ceil(Date.now() / 60000) * 60000);
    endAt = base + minutes * 60000;
    endInput.setCustomValidity('');
  }
  function submit(event) {
    event.preventDefault();
    if (!title.trim() || !Number.isFinite(endAt) || endAt <= Date.now()) {
      endInput.setCustomValidity($t('timer_future_required'));
      endInput.reportValidity();
      return;
    }
    addReminder({ id: crypto.randomUUID(), title: title.trim(), type: selectedType, endAt, notified: false });
    title = '';
    endAt = null;
  }
  onMount(() => {
    document.addEventListener('lat-reminders-change', refresh);
    const interval = setInterval(() => (now = Date.now()), 1000);
    return () => {
      clearInterval(interval);
      document.removeEventListener('lat-reminders-change', refresh);
    };
  });
</script>

<section class="panel timers-layout">
  <form id="timer-form" onsubmit={submit}>
    <div class="form-grid">
      <label class="full"
        ><span>{$t('timer_name')}</span><input
          id="timer-name"
          maxlength="80"
          required
          bind:value={title}
          placeholder={$t('timer_name_placeholder')}
        /></label
      >
      <div class="full timer-type-field">
        <span>{$t('timer_type')}</span>
        <div class="timer-type-buttons" role="group" aria-label={$t('timer_type')}>
          {#each types as [id, icon]}<button
              class="timer-type-button"
              class:selected={id === selectedType}
              type="button"
              aria-pressed={id === selectedType}
              onclick={() => (selectedType = id)}
              ><Icon name={icon} /><span>{$t('timer_type_' + id)}</span></button
            >{/each}
        </div>
      </div>
      <label class="full"
        ><span
          >{$t('timer_end')} ({$t(
            $clockMode === 'server' ? 'clock_server_short' : 'clock_local_short'
          )})</span
        ><input
          id="timer-end"
          type="datetime-local"
          required
          bind:this={endInput}
          value={endValue}
          oninput={(event) => {
            const time = fromDateTimeInput(event.currentTarget.value, $clockMode).getTime();
            endAt = Number.isFinite(time) ? time : null;
            endInput.setCustomValidity('');
          }}
        /></label
      >
    </div>
    <div class="timer-presets">
      <span>{$t('timer_quick_add')}</span>{#each presets as [minutes, label]}<button
          type="button"
          onclick={() => preset(minutes)}>{$t(label)}</button
        >{/each}
    </div>
    <button class="primary-btn timer-submit" type="submit"
      ><Icon name="bell-plus" /> {$t('timer_create')}</button
    >
  </form>
</section>
<section class="timers-list" id="timers-list">
  {#each [...reminders].sort((a, b) => a.endAt - b.endAt) as reminder (reminder.id)}<article
      class="timer-card"
      class:finished={reminder.endAt <= now}
      data-reminder-id={reminder.id}
    >
      <div class="timer-card-icon">
        <Icon name={types.find((type) => type[0] === reminder.type)?.[1] || 'bell'} />
      </div>
      <div class="timer-card-content">
        <span>{$t('timer_type_' + reminder.type)}</span><strong>{reminder.title}</strong><small
          >{$t('timer_ends_at')} {formatDateTime(new Date(reminder.endAt), $clockMode, $locale)}</small
        >
      </div>
      <time
        >{reminder.endAt <= now
          ? $t('timer_finished')
          : $duration(Math.ceil((reminder.endAt - now) / 1000))}</time
      >
      <div class="timer-actions">
        {#if reminder.endAt <= now}{#each [5, 15] as minutes}<button
              onclick={() => snoozeReminder(reminder.id, minutes)}>{$t('timer_snooze_' + minutes)}</button
            >{/each}{/if}<button aria-label={$t('timer_delete')} onclick={() => removeReminder(reminder.id)}
          ><Icon name="trash-2" /></button
        >
      </div>
    </article>{:else}<div class="timers-empty">
      <Icon name="timer-off" /><strong>{$t('timers_empty')}</strong><span>{$t('timers_empty_hint')}</span>
    </div>{/each}
</section>
<section class="panel timer-notification-panel">
  <span class="tool-icon"><Icon name="bell-ring" /></span>
  <h3>{$t('timer_notifications')}</h3>
  <p>{$t('timer_notification_help')}</p>
  <button class="primary-btn" onclick={requestNotifications}>{$t('timer_enable_notifications')}</button>
  <p class="form-note">{$t('timer_browser_limit')}</p>
</section>
