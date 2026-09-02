<script>
  import { onMount } from 'svelte';
  import { TOOLS } from './lib/config/tools.js';
  import { pages } from './lib/config/pages.ts';
  import { initializeGameData } from './lib/data.js';
  import { t, language, clockMode, locale } from './lib/state/preferences.ts';
  import { formatClockTime } from './lib/core/time.js';
  import { checkDueReminders } from './lib/core/reminders.js';
  import { notifyReminder } from './lib/platform/notifications.ts';
  import { openExternalLink } from './lib/platform/links.ts';
  import PageHeader from './lib/components/PageHeader.svelte';
  import Icon from './lib/components/Icon.svelte';
  const categories = ['personal', 'development', 'heroes', 'alliance', 'information'];
  const sections = ['tools', 'guides'];
  let hash = $state(location.hash),
    sidebarOpen = $state(false),
    clockOpen = $state(false),
    languageOpen = $state(false),
    now = $state(new Date()),
    ready = $state(false),
    failed = $state(false);
  let route = $derived((hash.replace(/^#\//, '') || 'tools').split('/')[0]);
  let tool = $derived(TOOLS.find((candidate) => candidate.id === route));
  let section = $derived(sections.includes(route) ? route : tool?.section || 'tools');
  let navigation = $derived(
    categories.flatMap((category) =>
      TOOLS.filter((tool) => tool.ready && tool.section === section && tool.category === category)
    )
  );
  let page = $derived(ready && tool?.ready && pages[route] ? pages[route]() : null);
  $effect(() => {
    document.body.dataset.section = section;
    document.documentElement.lang = $language;
  });
  function chooseLanguage(value) {
    if (matchMedia('(max-width: 520px)').matches && value === $language) {
      languageOpen = !languageOpen;
      return;
    }
    $language = value;
    languageOpen = false;
  }
  async function load() {
    failed = false;
    try {
      await initializeGameData();
      ready = true;
    } catch (error) {
      console.error(error);
      failed = true;
    }
  }
  function dismissPopovers(event) {
    if (!event.target.closest('.clock-switch')) clockOpen = false;
    if (!event.target.closest('.lang-switch')) languageOpen = false;
  }
  onMount(() => {
    load();
    const navigate = () => {
      hash = location.hash;
      sidebarOpen = false;
    };
    const notify = (reminder) => notifyReminder($t('timer_notification_title'), reminder.title);
    const tick = () => {
      now = new Date();
      checkDueReminders(notify);
    };
    tick();
    const interval = setInterval(tick, 1000);
    window.addEventListener('hashchange', navigate);
    document.addEventListener('click', dismissPopovers);
    document.addEventListener('click', openExternalLink);
    return () => {
      clearInterval(interval);
      window.removeEventListener('hashchange', navigate);
      document.removeEventListener('click', dismissPopovers);
      document.removeEventListener('click', openExternalLink);
    };
  });
</script>

<div class="app-shell">
  <aside class="sidebar" class:open={sidebarOpen}>
    <a href="#/" class="brand"
      ><span class="brand-icon"><Icon name="biohazard" /></span><span
        ><strong>Last Asylum</strong><small>Toolkit</small></span
      ></a
    >
    <nav id="main-nav" class="main-nav">
      <a class="nav-link" class:active={!tool} href={'#/' + section}
        ><Icon name="house" /><span>{$t('section_' + section)}</span></a
      >{#each categories as category}{@const tools = navigation.filter(
          (tool) => tool.category === category
        )}{#if tools.length}<div class="nav-group-title">{$t('category_' + category)}</div>
          {#each tools as candidate}<a
              class="nav-link"
              class:active={route === candidate.id}
              href={'#/' + candidate.id}><Icon name={candidate.icon} /><span>{$t(candidate.title)}</span></a
            >{/each}{/if}{/each}
    </nav>
    <div class="sidebar-footer"><span>{$t('unofficial')}</span></div>
  </aside>
  <div class="main-area">
    <header class="topbar">
      <button
        class="mobile-menu"
        id="mobile-menu"
        aria-label={$t('menu')}
        aria-expanded={sidebarOpen}
        onclick={() => (sidebarOpen = !sidebarOpen)}><Icon name="menu" /></button
      >
      <div class="breadcrumb" id="breadcrumb">{$t(tool?.title || 'section_' + section)}</div>
      <nav class="section-tabs" aria-label={$t('section_navigation')}>
        {#each sections as candidate}<a
            href={'#/' + candidate}
            class="section-tab"
            class:active={section === candidate}
            aria-current={section === candidate ? 'page' : undefined}
            ><Icon name={candidate === 'tools' ? 'wrench' : 'book-open-text'} /><span
              >{$t('section_' + candidate)}</span
            ></a
          >{/each}
      </nav>
      <div class="topbar-actions">
        <div class="clock-switch" class:open={clockOpen} role="group" aria-label={$t('clock_switch_label')}>
          <button
            class="clock-value"
            aria-label={$t('clock_switch_label')}
            aria-expanded={clockOpen}
            onclick={() => {
              if (matchMedia('(max-width: 520px)').matches) clockOpen = !clockOpen;
            }}
            ><span id="clock-label">{$t($clockMode === 'server' ? 'server_time' : 'local_time')}</span><time
              id="clock-time">{formatClockTime(now, $clockMode, $locale)}</time
            ><small id="clock-zone"
              >{$clockMode === 'server'
                ? 'UTC−02:00'
                : Intl.DateTimeFormat().resolvedOptions().timeZone}</small
            ></button
          >
          <div class="clock-modes">
            {#each ['server', 'local'] as mode}<button
                type="button"
                data-clock-mode={mode}
                class:active={$clockMode === mode}
                aria-pressed={$clockMode === mode}
                title={$t(mode === 'server' ? 'server_time' : 'local_time')}
                onclick={() => {
                  $clockMode = mode;
                  clockOpen = false;
                }}>{$t('clock_' + mode + '_short')}</button
              >{/each}
          </div>
        </div>
        <div class="lang-switch" class:open={languageOpen} role="group" aria-label={$t('language')}>
          <button
            class="flag-btn"
            class:active={$language === 'fr'}
            data-lang="fr"
            title="Français"
            aria-label="Français"
            onclick={() => chooseLanguage('fr')}
            ><svg viewBox="0 0 3 2" aria-hidden="true"
              ><rect width="1" height="2" x="0" fill="#0055A4" /><rect
                width="1"
                height="2"
                x="1"
                fill="#fff"
              /><rect width="1" height="2" x="2" fill="#EF4135" /></svg
            ></button
          >
          <button
            class="flag-btn"
            class:active={$language === 'en'}
            data-lang="en"
            title="English"
            aria-label="English"
            onclick={() => chooseLanguage('en')}
            ><svg viewBox="0 0 60 30" aria-hidden="true"
              ><clipPath id="ukclip"><path d="M0 0v30h60V0z" /></clipPath><g clip-path="url(#ukclip)"
                ><path d="M0 0v30h60V0z" fill="#012169" /><path
                  d="M0 0l60 30m0-30L0 30"
                  stroke="#fff"
                  stroke-width="6"
                /><path d="M0 0l60 30m0-30L0 30" stroke="#C8102E" stroke-width="3.6" /><path
                  d="M30 0v30M0 15h60"
                  stroke="#fff"
                  stroke-width="10"
                /><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6" /></g
              ></svg
            ></button
          >
        </div>
      </div>
    </header>
    <main id="view" class="view">
      {#if failed}<section class="panel" role="alert">
          <p>{$t('app_load_error')}</p>
          <button onclick={load}>{$t('retry')}</button>
        </section>
      {:else if !ready}<section class="panel" aria-busy="true">{$t('app_loading')}</section>
      {:else if tool}<PageHeader {tool} />{#if !tool.ready}<section class="empty-state">
            <Icon name={tool.icon} />
            <h2>{$t('soon')}</h2>
            <p>{$t(tool.desc)}</p>
            <a class="primary-btn" href="#/">{$t('back')}</a>
          </section>{:else}{#key route}{#await page}<section class="panel" aria-busy="true">
                {$t('app_loading')}
              </section>{:then module}{#if module}<module.default
                  heroId={hash.split('/')[2] || ''}
                />{/if}{:catch}<section class="panel" role="alert">
                {$t('app_load_error')}
              </section>{/await}{/key}{/if}
      {:else}<section class="hero-panel">
          <span class="kicker">{$t('section_' + section)}</span>
          <h1>{$t('section_' + section + '_title')}</h1>
          <p>{$t('section_' + section + '_subtitle')}</p>
        </section>
        <section class="tools-grid">
          {#each navigation as candidate}<a class="tool-card" href={'#/' + candidate.id}
              ><span class="tool-icon"><Icon name={candidate.icon} /></span>
              <h3>{$t(candidate.title)}</h3>
              <p>{$t(candidate.desc)}</p>
              <span class="tool-open">{$t('open')} <Icon name="arrow-right" /></span></a
            >{/each}
        </section>{/if}
    </main>
  </div>
</div>
