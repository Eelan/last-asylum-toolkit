const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const TOOLS = [{
  id: 'antitoxin',
  icon: 'biohazard',
  title: 'anti_title',
  desc: 'anti_desc',
  ready: true
}, {
  id: 'shards',
  icon: 'gem',
  title: 'shard_title',
  desc: 'shard_desc',
  ready: true
}, {
  id: 'skills',
  icon: 'zap',
  title: 'skill_title',
  desc: 'skill_desc',
  ready: true
}, {
  id: 'duel',
  icon: 'swords',
  title: 'duel_title',
  desc: 'duel_desc',
  ready: true
}, {
  id: 'week',
  icon: 'calendar-days',
  title: 'week_title',
  desc: 'week_desc',
  ready: true
}, {
  id: 'sanctuary',
  icon: 'castle',
  title: 'sanctuary_title',
  desc: 'sanctuary_desc',
  ready: false
}, {
  id: 'gear',
  icon: 'shield-check',
  title: 'gear_title',
  desc: 'gear_desc',
  ready: false
}, {
  id: 'raven',
  icon: 'bird',
  title: 'raven_title',
  desc: 'raven_desc',
  ready: true
}, {
  id: 'team',
  icon: 'users',
  title: 'team_title',
  desc: 'team_desc',
  ready: false
}];
let currentLanguage = localStorage.getItem('lat-lang') || (navigator.language?.startsWith('fr') ? 'fr' : 'en');

function translate(k) {
  return TRANSLATIONS[currentLanguage]?.[k] ?? TRANSLATIONS.fr[k] ?? k;
}

function formatNumber(v) {
  return new Intl.NumberFormat(currentLanguage === 'fr' ? 'fr-FR' : 'en-GB').format(Math.round(v));
}

function parseNumber(v) {
  return Number(String(v ?? '').replace(/[^\d]/g, '')) || 0;
}

function icon(name) {
  return `<i data-lucide="${name}"></i>`;
}

function applyStaticI18n() {
  document.documentElement.lang = currentLanguage;
  $$('[data-i18n]').forEach(el => el.textContent = translate(el.dataset.i18n));
  $$('.flag-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === currentLanguage));
}

function renderNav() {
  $('#main-nav').innerHTML = `
  <a class="nav-link" data-route="home" href="#/">${icon('house')}<span>${translate('home')}</span></a>
  <div class="nav-group-title">${translate('tools')}</div>
  ${TOOLS.filter(x=>x.ready).map(x=>`<a class="nav-link" data-route="${x.id}" href="#/${x.id}">${icon(x.icon)}<span>${translate(x.title)}</span></a>`).join('')}
 `;
}

function renderToolCard(t) {
  return `<a class="tool-card" href="#/${t.id}">
   ${!t.ready?`<span class="badge-soon">${translate('soon')}</span>`:''}
   <span class="tool-icon">${icon(t.icon)}</span>
   <h3>${translate(t.title)}</h3><p>${translate(t.desc)}</p>
   <span class="tool-open">${translate('open')} ${icon('arrow-right')}</span>
 </a>`;
}

function renderHome() {
  $('#view').innerHTML = `<section class="hero-panel">
  <span class="kicker">${translate('tools')}</span>
  <h1>${translate('tagline')}</h1>
  <p>${translate('subtitle')}</p>
 </section>
 <section class="tools-grid">${TOOLS.filter(tool => tool.ready).map(renderToolCard).join('')}</section>`;
  $('#breadcrumb').textContent = translate('home');
}

function renderPageHeader(t) {
  return `<div class="page-head">
  <div class="page-title"><span class="tool-icon">${icon(t.icon)}</span><div><h2>${translate(t.title)}</h2><p>${translate(t.desc)}</p></div></div>
  <a class="back-link" href="#/">${icon('arrow-left')} ${translate('back')}</a>
 </div>`;
}

function createLevelOptions(min, max, val) {
  let o = '';
  for (let i = min; i <= max; i++) o += `<option value="${i}" ${i===val?'selected':''}>${i}</option>`;
  return o;
}

function renderAntitoxinPage(t) {
  const max = Math.max(...Object.keys(GAME_DATA.antitoxin).map(Number));
  $('#view').innerHTML = renderPageHeader(t) + `
 <div class="calc-grid">
  <section class="panel">
   <div class="form-grid">
    <label><span>${translate('current')}</span><select id="anti-current">${createLevelOptions(1,max,85)}</select></label>
    <label><span>${translate('target')}</span><select id="anti-target">${createLevelOptions(1,max,90)}</select></label>
    <label class="full"><span>${translate('stock')}</span><input id="anti-stock" inputmode="numeric" value="0"></label>
   </div>
   <div class="quick-actions"><button data-range="80,85">80 → 85</button><button data-range="85,90">85 → 90</button><button data-range="90,95">90 → 95</button><button data-range="95,100">95 → 100</button></div>
  </section>
  <section class="panel result-panel">
   <span class="result-label">${translate('required')}</span><strong class="result-main" id="anti-total">—</strong><span class="result-unit">${translate('antitoxin')}</span>
   <div class="stat-row"><div class="stat"><span>${translate('missing')}</span><strong id="anti-missing">—</strong></div><div class="stat"><span>${translate('duel_points')}</span><strong id="anti-points">—</strong></div></div>
  </section>
 </div>
 <section class="panel table-panel"><h3>${translate('level_breakdown')}</h3><div class="table-wrap"><table><thead><tr><th>${translate('level')}</th><th>${translate('sanctuary_required')}</th><th>${translate('cost')}</th><th>${translate('cumulative')}</th></tr></thead><tbody id="anti-body"></tbody></table></div></section>`;
  const calculate = () => {
    const a = +$('#anti-current').value,
      b = +$('#anti-target').value,
      stock = parseNumber($('#anti-stock').value);
    let total = 0,
      rows = '';
    if (b <= a) {
      $('#anti-total').textContent = '—';
      $('#anti-missing').textContent = '—';
      $('#anti-points').textContent = '—';
      $('#anti-body').innerHTML = '';
      return
    }
    for (let l = a + 1; l <= b; l++) {
      const c = GAME_DATA.antitoxin[l] || 0;
      total += c;
      rows += `<tr><td>${l}</td><td>${Math.ceil(l / 5)}</td><td>${formatNumber(c)}</td><td>${formatNumber(total)}</td></tr>`
    }
    $('#anti-total').textContent = formatNumber(total);
    $('#anti-missing').textContent = formatNumber(Math.max(0, total - stock));
    $('#anti-points').textContent = formatNumber(Math.floor(total / GAME_DATA.duel.antitoxinUnit));
    $('#anti-body').innerHTML = rows;
  };
  ['anti-current', 'anti-target', 'anti-stock'].forEach(id => $('#' + id).addEventListener('input', calculate));
  $$('[data-range]').forEach(b => b.addEventListener('click', () => {
    const [a, z] = b.dataset.range.split(',');
    $('#anti-current').value = a;
    $('#anti-target').value = z;
    calculate()
  }));
  calculate();
}

function createStarOptions(selected) {
  return GAME_DATA.stars.map(s => `<option value="${s.value}" ${s.value===selected?'selected':''}>${s.value.toFixed(1).replace('.0','')} ★</option>`).join('');
}

function getRavenUpgradeCost(level) {
  const band = GAME_DATA.raven.find(([from, to]) => level >= from && level <= to);
  return band ? { fruit: band[2], essence: band[3] } : { fruit: 0, essence: 0 };
}

function renderRavenPage(t) {
  const max = 250;
  $('#view').innerHTML = renderPageHeader(t) + `
 <div class="calc-grid">
  <section class="panel">
   <div class="form-grid">
    <label><span>${translate('current')}</span><select id="raven-current">${createLevelOptions(1,max,1)}</select></label>
    <label><span>${translate('target')}</span><select id="raven-target">${createLevelOptions(1,max,30)}</select></label>
    <label><span>${translate('raven_fruit_stock')}</span><input id="raven-fruit-stock" inputmode="numeric" value="0"></label>
    <label><span>${translate('raven_essence_stock')}</span><input id="raven-essence-stock" inputmode="numeric" value="0"></label>
   </div>
   <div class="quick-actions"><button data-raven-range="1,30">1 → 30</button><button data-raven-range="30,50">30 → 50</button><button data-raven-range="50,90">50 → 90</button><button data-raven-range="90,110">90 → 110</button></div>
  </section>
  <section class="panel result-panel">
   <span class="result-label">${translate('required')}</span>
   <div class="stat-row"><div class="stat"><span>${translate('raven_fruit')}</span><strong id="raven-fruit-total">—</strong></div><div class="stat"><span>${translate('raven_essence')}</span><strong id="raven-essence-total">—</strong></div></div>
   <div class="stat-row"><div class="stat"><span>${translate('raven_fruit_missing')}</span><strong id="raven-fruit-missing">—</strong></div><div class="stat"><span>${translate('raven_essence_missing')}</span><strong id="raven-essence-missing">—</strong></div></div>
  </section>
 </div>
 <section class="panel table-panel"><h3>${translate('level_breakdown')}</h3><div class="table-wrap"><table><thead><tr><th>${translate('level')}</th><th>${translate('raven_fruit')}</th><th>${translate('raven_essence')}</th><th>${translate('fruit_cumulative')}</th><th>${translate('essence_cumulative')}</th></tr></thead><tbody id="raven-body"></tbody></table></div></section>`;

  const calculate = () => {
    const current = +$('#raven-current').value;
    const target = +$('#raven-target').value;
    const fruitStock = parseNumber($('#raven-fruit-stock').value);
    const essenceStock = parseNumber($('#raven-essence-stock').value);
    let fruitTotal = 0;
    let essenceTotal = 0;
    let rows = '';
    if (target <= current) {
      ['raven-fruit-total', 'raven-essence-total', 'raven-fruit-missing', 'raven-essence-missing'].forEach(id => $('#' + id).textContent = '—');
      $('#raven-body').innerHTML = '';
      return;
    }
    for (let level = current + 1; level <= target; level++) {
      const cost = getRavenUpgradeCost(level - 1);
      fruitTotal += cost.fruit;
      essenceTotal += cost.essence;
      rows += `<tr><td>${level}</td><td>${formatNumber(cost.fruit)}</td><td>${formatNumber(cost.essence)}</td><td>${formatNumber(fruitTotal)}</td><td>${formatNumber(essenceTotal)}</td></tr>`;
    }
    $('#raven-fruit-total').textContent = formatNumber(fruitTotal);
    $('#raven-essence-total').textContent = formatNumber(essenceTotal);
    $('#raven-fruit-missing').textContent = formatNumber(Math.max(0, fruitTotal - fruitStock));
    $('#raven-essence-missing').textContent = formatNumber(Math.max(0, essenceTotal - essenceStock));
    $('#raven-body').innerHTML = rows;
  };
  ['raven-current', 'raven-target', 'raven-fruit-stock', 'raven-essence-stock'].forEach(id => $('#' + id).addEventListener('input', calculate));
  $$('[data-raven-range]').forEach(button => button.addEventListener('click', () => {
    const [current, target] = button.dataset.ravenRange.split(',');
    $('#raven-current').value = current;
    $('#raven-target').value = target;
    calculate();
  }));
  calculate();
}

function renderShardsPage(t) {
  $('#view').innerHTML = renderPageHeader(t) + `
 <div class="calc-grid"><section class="panel"><div class="form-grid">
 <label><span>${translate('stars_current')}</span><select id="star-current">${createStarOptions(0)}</select></label>
 <label><span>${translate('stars_target')}</span><select id="star-target">${createStarOptions(5)}</select></label>
 <label class="full"><span>${translate('stock')}</span><input id="star-stock" inputmode="numeric" value="0"></label>
 </div></section>
 <section class="panel result-panel"><span class="result-label">${translate('shards_required')}</span><strong id="star-total" class="result-main">—</strong><span class="result-unit">${translate('hero_omni')}</span>
 <div class="stat-row"><div class="stat"><span>${translate('missing')}</span><strong id="star-missing">—</strong></div><div class="stat"><span>${translate('duel_points')}</span><strong id="star-points">—</strong></div></div></section></div>`;
  const calculate = () => {
    const a = +$('#star-current').value,
      b = +$('#star-target').value,
      stock = parseNumber($('#star-stock').value);
    const total = b > a ? GAME_DATA.stars.filter(s => s.value > a && s.value <= b).reduce((x, s) => x + s.cost, 0) : 0;
    $('#star-total').textContent = b > a ? formatNumber(total) : '—';
    $('#star-missing').textContent = b > a ? formatNumber(Math.max(0, total - stock)) : '—';
    $('#star-points').textContent = b > a ? formatNumber(total * GAME_DATA.duel.urShardPoints) : '—'
  };
  ['star-current', 'star-target', 'star-stock'].forEach(id => $('#' + id).addEventListener('input', calculate));
  calculate();
}

function renderSkillsPage(t) {
  const max = Math.max(...Object.keys(GAME_DATA.skills).map(Number));
  $('#view').innerHTML = renderPageHeader(t) + `
 <div class="calc-grid"><section class="panel"><div class="form-grid">
 <label><span>${translate('skill_current')}</span><select id="skill-current">${createLevelOptions(1,max,1)}</select></label>
 <label><span>${translate('skill_target')}</span><select id="skill-target">${createLevelOptions(1,max,10)}</select></label>
 <label class="full"><span>${translate('stock')}</span><input id="skill-stock" inputmode="numeric" value="0"></label></div></section>
 <section class="panel result-panel"><span class="result-label">${translate('badges_required')}</span><strong id="skill-total" class="result-main">—</strong><span class="result-unit">Skill Badges</span>
 <div class="stat-row"><div class="stat"><span>${translate('missing')}</span><strong id="skill-missing">—</strong></div><div class="stat"><span>${translate('duel_points')}</span><strong id="skill-points">—</strong></div></div></section></div>`;
  const calculate = () => {
    const a = +$('#skill-current').value,
      b = +$('#skill-target').value,
      stock = parseNumber($('#skill-stock').value);
    let total = 0;
    if (b > a)
      for (let i = a + 1; i <= b; i++) total += GAME_DATA.skills[i] || 0;
    $('#skill-total').textContent = b > a ? formatNumber(total) : '—';
    $('#skill-missing').textContent = b > a ? formatNumber(Math.max(0, total - stock)) : '—';
    $('#skill-points').textContent = b > a ? formatNumber(total * GAME_DATA.duel.skillBadgePoints) : '—'
  };
  ['skill-current', 'skill-target', 'skill-stock'].forEach(id => $('#' + id).addEventListener('input', calculate));
  calculate();
}

function renderDuelPage(t) {
  $('#view').innerHTML = renderPageHeader(t) + `
 <div class="calc-grid"><section class="panel duel-inputs">
  <label><span>${translate('antitoxin')}</span><input id="d-a" inputmode="numeric" value="0"></label>
  <label><span>${translate('recruits')}</span><input id="d-r" inputmode="numeric" value="0"></label>
  <label><span>UR Shards</span><input id="d-u" inputmode="numeric" value="0"></label>
  <label><span>SSR Shards</span><input id="d-s" inputmode="numeric" value="0"></label>
  <label><span>SR Shards</span><input id="d-sr" inputmode="numeric" value="0"></label>
  <label><span>Skill Badges</span><input id="d-b" inputmode="numeric" value="0"></label>
 </section>
 <section class="panel result-panel"><span class="result-label">${translate('duel_points')}</span><strong class="result-main" id="d-total">0</strong><span class="result-unit">${translate('hero_phase')}</span><div class="stat-row"><div class="stat full"><span>${translate('note_duel')}</span></div></div></section></div>`;
  const calculate = () => {
    const d = GAME_DATA.duel;
    const x = Math.floor(parseNumber($('#d-a').value) / d.antitoxinUnit) + parseNumber($('#d-r').value) * d.recruitPoints + parseNumber($('#d-u').value) * d.urShardPoints + parseNumber($('#d-s').value) * d.ssrShardPoints + parseNumber($('#d-sr').value) * d.srShardPoints + parseNumber($('#d-b').value) * d.skillBadgePoints;
    $('#d-total').textContent = formatNumber(x)
  };
  ['d-a', 'd-r', 'd-u', 'd-s', 'd-sr', 'd-b'].forEach(id => $('#' + id).addEventListener('input', calculate));
  calculate();
}

function renderWeekPage(t) {
  const days = translate('days');
  const js = new Date().getDay(),
    today = (js + 6) % 7;
  $('#view').innerHTML = renderPageHeader(t) + `<div class="week-list">${days.map((d,i)=>`
 <article class="day-row ${i===today?'today':''}">
  <div class="day-name"><strong>${d[0]}</strong><span>${d[1]} ${i===today?'• '+translate('today'):''}</span></div>
  <div class="day-col"><b>${translate('use')}</b><span>${d[2]}</span></div>
  <div class="day-col"><b>${translate('keep')}</b><span>${d[3]}</span></div>
  <div class="day-col"><b>${translate('focus')}</b><span>${d[4]}</span></div>
 </article>`).join('')}</div>`;
}

function renderComingSoonPage(t) {
  $('#view').innerHTML = renderPageHeader(t) + `<section class="empty-state"><span class="tool-icon">${icon(t.icon)}</span><h2>${translate('soon')}</h2><p>${translate(t.desc)}</p><a href="#/" class="primary-btn">${icon('arrow-left')} ${translate('back')}</a></section>`;
}

function renderRoute() {
  const id = (location.hash.replace(/^#\//, '') || 'home').split('/')[0];
  renderNav();
  applyStaticI18n();
  if (id === 'home') renderHome();
  else {
    const t = TOOLS.find(x => x.id === id) || TOOLS[0];
    $('#breadcrumb').textContent = translate(t.title);
    if (!t.ready) renderComingSoonPage(t);
    else if (id === 'antitoxin') renderAntitoxinPage(t);
    else if (id === 'shards') renderShardsPage(t);
    else if (id === 'skills') renderSkillsPage(t);
    else if (id === 'duel') renderDuelPage(t);
    else if (id === 'week') renderWeekPage(t);
    else if (id === 'raven') renderRavenPage(t);
  }
  $$('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.route === id));
  lucide.createIcons();
  $('.sidebar').classList.remove('open');
}
$$('.flag-btn').forEach(b => b.addEventListener('click', () => {
  currentLanguage = b.dataset.lang;
  localStorage.setItem('lat-lang', currentLanguage);
  renderRoute()
}));
$('#mobile-menu').addEventListener('click', () => $('.sidebar').classList.toggle('open'));
window.addEventListener('hashchange', renderRoute);
renderRoute();
