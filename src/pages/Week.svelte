<script>
  import { onMount } from 'svelte';
  import { GAME_DATA } from '../lib/data.js';
  import { getCurrentSurvivalWindow, getThemeWindowsForWeekday } from '../lib/domain/survival-battle.js';
  import {
    getServerDate,
    getAbsoluteDateFromServerDate,
    getNextServerReset,
    getServerWeekdayDate,
    formatClockTime,
    formatTimeWindow
  } from '../lib/core/time.js';
  import { t, number, clockMode, locale } from '../lib/state/preferences.ts';
  import KeyList from '../lib/components/KeyList.svelte';
  import LevelTable from '../lib/components/LevelTable.svelte';
  const duel = GAME_DATA.duel;
  let now = $state(new Date());
  let serverNow = $derived(getServerDate(now));
  let today = $derived(serverNow.getUTCDay());
  let currentWindow = $derived(getCurrentSurvivalWindow(duel.survivalBattleSchedule, serverNow));
  let currentStart = $derived.by(() => {
    const date = new Date(serverNow);
    date.setUTCHours(currentWindow.startHour, 0, 0, 0);
    return getAbsoluteDateFromServerDate(date);
  });
  let zone = $derived(
    $clockMode === 'server' ? $t('clock_server_short') : Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  onMount(() => {
    const timer = setInterval(() => (now = new Date()), 60_000);
    return () => clearInterval(timer);
  });
  function openPhase(id) {
    const element = document.getElementById('duel-' + id);
    if (element) {
      element.open = true;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  function windowLabel(phase) {
    const windows = getThemeWindowsForWeekday(
      duel.survivalBattleSchedule,
      phase.weekday,
      phase.survivalBattle.themeId
    );
    return windows.length
      ? windows
          .map((window) =>
            formatTimeWindow(
              getServerWeekdayDate(phase.weekday, window.startHour, now),
              getServerWeekdayDate(phase.weekday, window.endHour, now),
              $clockMode,
              $locale
            )
          )
          .join(', ')
      : $t('survival_no_fixed_window');
  }
</script>

<section class="panel duel-week-intro">
  <div>
    <span class="kicker">{$t('duel_six_day_event')}</span>
    <h3>{$t('duel_week_intro_title')}</h3>
    <p>{$t('duel_week_intro')}</p>
    <p class="survival-calendar-note">{$t('survival_calendar_note')}</p>
    <div class="survival-current">
      <span>{$t('survival_current_window')}</span><strong
        >{$t('survival_theme_' + currentWindow.themeId)}</strong
      ><time
        >{formatTimeWindow(
          currentStart,
          new Date(currentStart.getTime() + duel.survivalBattleSchedule.windowDurationHours * 3600000),
          $clockMode,
          $locale
        )}</time
      ><small>{zone}</small>
    </div>
  </div>
  <div class="duel-reset">
    <span>{$t('duel_daily_reset')}</span><strong
      >{formatClockTime(getNextServerReset(duel.resetServerHour, now), $clockMode, $locale, false)}</strong
    ><small>{zone}</small>
  </div>
</section>
<section class="duel-week-strip" aria-label={$t('duel_week_overview')}>
  {#each duel.phases as phase}<button
      class="duel-week-card"
      class:today={phase.weekday === today}
      onclick={() => openPhase(phase.id)}
      ><span>{$t('weekday_' + phase.weekday)}</span><strong>{$t(phase.titleKey)}</strong></button
    >{/each}<button
    class="duel-week-card preparation"
    class:today={today === 0}
    onclick={() => openPhase('sunday')}
    ><span>{$t('weekday_0')}</span><strong>{$t('duel_sunday_preparation')}</strong></button
  >
</section>
<section class="duel-guide">
  {#each duel.phases as phase}<details
      id={'duel-' + phase.id}
      class="duel-day"
      class:today={phase.weekday === today}
      open={phase.weekday === today}
    >
      <summary
        ><span class="duel-day-number">{$t('day')} {phase.weekday}</span><span class="duel-day-title"
          ><strong>{$t('weekday_' + phase.weekday)} — {$t(phase.titleKey)}</strong><small
            >{$t(phase.summaryKey)}</small
          ></span
        >{#if phase.weekday === today}<span class="duel-today-badge">{$t('today')}</span>{/if}</summary
      >
      <div class="duel-day-content">
        <div class="duel-guidance-grid">
          {#each [['prepare', phase.prepareKeys], ['use', phase.useKeys], ['keep', phase.saveKeys]] as [label, keys]}<section
            >
              <h4>{$t(label)}</h4>
              <KeyList {keys} />
            </section>{/each}
        </div>
        <section class="survival-synergy">
          <div class="survival-synergy-head">
            <span>{$t('survival_battle')}</span><strong>{$t(phase.survivalBattle.themeKey)}</strong><time
              >{windowLabel(phase)}</time
            >
          </div>
          <div class="survival-synergy-grid">
            <div>
              <h4>{$t('survival_shared_actions')}</h4>
              <KeyList keys={phase.survivalBattle.overlapKeys} />
            </div>
            <div>
              <h4>{$t('survival_best_strategy')}</h4>
              <KeyList keys={phase.survivalBattle.strategyKeys} />
            </div>
          </div>
        </section>
        <section class="duel-tips">
          <h4>{$t('duel_tips')}</h4>
          <KeyList keys={phase.tipKeys} />
        </section>
        {#each phase.noticeKeys || [] as key}<p class="duel-notice">{$t(key)}</p>{/each}
        <section class="duel-scoring">
          <h4>{$t('duel_scoring')}</h4>
          <div class="table-wrap">
            <table>
              <thead
                ><tr
                  >{#each ['activity', 'quantity', 'duel_points'] as key}<th>{$t(key)}</th>{/each}</tr
                ></thead
              ><tbody
                >{#each phase.activities as activity}<tr
                    ><td>{$t(activity.labelKey)}</td><td>{$number(activity.quantity)}</td><td
                      >{$number(activity.points)}</td
                    ></tr
                  >{/each}</tbody
              >
            </table>
          </div>
          <LevelTable table={phase.levelTable} />{#each phase.combatTables || [] as table}<LevelTable
              {table}
            />{/each}
        </section>
      </div>
    </details>{/each}
  <details id="duel-sunday" class="duel-day preparation" class:today={today === 0} open={today === 0}>
    <summary
      ><span class="duel-day-number">{$t('duel_before_event')}</span><span class="duel-day-title"
        ><strong>{$t('weekday_0')} — {$t('duel_sunday_preparation')}</strong><small
          >{$t('duel_sunday_summary')}</small
        ></span
      >{#if today === 0}<span class="duel-today-badge">{$t('today')}</span>{/if}</summary
    >
    <div class="duel-day-content">
      <div class="duel-guidance-grid">
        <section>
          <h4>{$t('prepare')}</h4>
          <KeyList keys={['duel_sunday_falcon', 'duel_sunday_gathering', 'duel_sunday_building']} />
        </section>
        <section>
          <h4>{$t('keep')}</h4>
          <KeyList keys={['duel_sunday_save_resources', 'duel_sunday_save_chests']} />
        </section>
        <section>
          <h4>{$t('focus')}</h4>
          <KeyList keys={['duel_sunday_check_reset', 'duel_sunday_check_timers']} />
        </section>
      </div>
      <p class="duel-notice">{$t('duel_sunday_not_phase')}</p>
    </div>
  </details>
</section>
<p class="form-note duel-source-note">
  {$t('duel_community_disclaimer')} <a href="#/sources">{$t('sources_title')}</a>
</p>
