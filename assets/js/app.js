
const $ = (s,ctx=document)=>ctx.querySelector(s);
const $$ = (s,ctx=document)=>[...ctx.querySelectorAll(s)];
const TOOLS = [
 {id:'antitoxin',icon:'biohazard',title:'anti_title',desc:'anti_desc',ready:true},
 {id:'shards',icon:'gem',title:'shard_title',desc:'shard_desc',ready:true},
 {id:'skills',icon:'zap',title:'skill_title',desc:'skill_desc',ready:true},
 {id:'duel',icon:'swords',title:'duel_title',desc:'duel_desc',ready:true},
 {id:'week',icon:'calendar-days',title:'week_title',desc:'week_desc',ready:true},
 {id:'sanctuary',icon:'castle',title:'sanctuary_title',desc:'sanctuary_desc',ready:false},
 {id:'gear',icon:'shield-check',title:'gear_title',desc:'gear_desc',ready:false},
 {id:'raven',icon:'bird',title:'raven_title',desc:'raven_desc',ready:false},
 {id:'team',icon:'users',title:'team_title',desc:'team_desc',ready:false}
];
let lang = localStorage.getItem('lat-lang') || (navigator.language?.startsWith('fr')?'fr':'en');

function tr(k){ return TRANSLATIONS[lang]?.[k] ?? TRANSLATIONS.fr[k] ?? k; }
function fmt(v){ return new Intl.NumberFormat(lang==='fr'?'fr-FR':'en-GB').format(Math.round(v)); }
function number(v){ return Number(String(v ?? '').replace(/[^\d]/g,''))||0; }
function icon(name){ return `<i data-lucide="${name}"></i>`; }

function applyStaticI18n(){
 document.documentElement.lang=lang;
 $$('[data-i18n]').forEach(el=>el.textContent=tr(el.dataset.i18n));
 $$('.flag-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
}
function renderNav(){
 $('#main-nav').innerHTML = `
  <a class="nav-link" data-route="home" href="#/">${icon('house')}<span>${tr('home')}</span></a>
  <div class="nav-group-title">${tr('tools')}</div>
  ${TOOLS.filter(x=>x.ready).map(x=>`<a class="nav-link" data-route="${x.id}" href="#/${x.id}">${icon(x.icon)}<span>${tr(x.title)}</span></a>`).join('')}
  <div class="nav-group-title">${tr('coming')}</div>
  ${TOOLS.filter(x=>!x.ready).map(x=>`<a class="nav-link" data-route="${x.id}" href="#/${x.id}">${icon(x.icon)}<span>${tr(x.title)}</span></a>`).join('')}
 `;
}
function toolCard(t){
 return `<a class="tool-card" href="#/${t.id}">
   ${!t.ready?`<span class="badge-soon">${tr('soon')}</span>`:''}
   <span class="tool-icon">${icon(t.icon)}</span>
   <h3>${tr(t.title)}</h3><p>${tr(t.desc)}</p>
   <span class="tool-open">${tr('open')} ${icon('arrow-right')}</span>
 </a>`;
}
function renderHome(){
 $('#view').innerHTML=`<section class="hero-panel">
  <span class="kicker">${tr('tools')}</span>
  <h1>${tr('tagline')}</h1>
  <p>${tr('subtitle')}</p>
 </section>
 <section class="tools-grid">${TOOLS.map(toolCard).join('')}</section>`;
 $('#breadcrumb').textContent=tr('home');
}
function pageHead(t){
 return `<div class="page-head">
  <div class="page-title"><span class="tool-icon">${icon(t.icon)}</span><div><h2>${tr(t.title)}</h2><p>${tr(t.desc)}</p></div></div>
  <a class="back-link" href="#/">${icon('arrow-left')} ${tr('back')}</a>
 </div>`;
}
function fillSelect(min,max,val){
 let o='';for(let i=min;i<=max;i++)o+=`<option value="${i}" ${i===val?'selected':''}>${i}</option>`;return o;
}
function routeAntitoxin(t){
 const max=Math.max(...Object.keys(GAME_DATA.antitoxin).map(Number));
 $('#view').innerHTML=pageHead(t)+`
 <div class="calc-grid">
  <section class="panel">
   <div class="form-grid">
    <label><span>${tr('current')}</span><select id="anti-current">${fillSelect(1,max,85)}</select></label>
    <label><span>${tr('target')}</span><select id="anti-target">${fillSelect(1,max,90)}</select></label>
    <label class="full"><span>${tr('stock')}</span><input id="anti-stock" inputmode="numeric" value="0"></label>
   </div>
   <div class="quick-actions"><button data-range="80,85">80 → 85</button><button data-range="85,90">85 → 90</button><button data-range="90,95">90 → 95</button><button data-range="95,100">95 → 100</button></div>
  </section>
  <section class="panel result-panel">
   <span class="result-label">${tr('required')}</span><strong class="result-main" id="anti-total">—</strong><span class="result-unit">Antitoxin</span>
   <div class="stat-row"><div class="stat"><span>${tr('missing')}</span><strong id="anti-missing">—</strong></div><div class="stat"><span>${tr('duel_points')}</span><strong id="anti-points">—</strong></div></div>
  </section>
 </div>
 <section class="panel table-panel"><h3>${tr('level_breakdown')}</h3><div class="table-wrap"><table><thead><tr><th>${tr('level')}</th><th>${tr('cost')}</th><th>${tr('cumulative')}</th></tr></thead><tbody id="anti-body"></tbody></table></div></section>`;
 const calc=()=>{
  const a=+$('#anti-current').value,b=+$('#anti-target').value,stock=number($('#anti-stock').value);let total=0,rows='';
  if(b<=a){$('#anti-total').textContent='—';$('#anti-missing').textContent='—';$('#anti-points').textContent='—';$('#anti-body').innerHTML='';return}
  for(let l=a+1;l<=b;l++){const c=GAME_DATA.antitoxin[l]||0;total+=c;rows+=`<tr><td>${l}</td><td>${fmt(c)}</td><td>${fmt(total)}</td></tr>`}
  $('#anti-total').textContent=fmt(total);$('#anti-missing').textContent=fmt(Math.max(0,total-stock));$('#anti-points').textContent=fmt(Math.floor(total/GAME_DATA.duel.antitoxinUnit));$('#anti-body').innerHTML=rows;
 };
 ['anti-current','anti-target','anti-stock'].forEach(id=>$('#'+id).addEventListener('input',calc));
 $$('[data-range]').forEach(b=>b.addEventListener('click',()=>{const [a,z]=b.dataset.range.split(',');$('#anti-current').value=a;$('#anti-target').value=z;calc()}));calc();
}
function starOptions(selected){
 return GAME_DATA.stars.map(s=>`<option value="${s.value}" ${s.value===selected?'selected':''}>${s.value.toFixed(1).replace('.0','')} ★</option>`).join('');
}
function routeShards(t){
 $('#view').innerHTML=pageHead(t)+`
 <div class="calc-grid"><section class="panel"><div class="form-grid">
 <label><span>${tr('stars_current')}</span><select id="star-current">${starOptions(0)}</select></label>
 <label><span>${tr('stars_target')}</span><select id="star-target">${starOptions(5)}</select></label>
 <label class="full"><span>${tr('stock')}</span><input id="star-stock" inputmode="numeric" value="0"></label>
 </div></section>
 <section class="panel result-panel"><span class="result-label">${tr('shards_required')}</span><strong id="star-total" class="result-main">—</strong><span class="result-unit">${tr('hero_omni')}</span>
 <div class="stat-row"><div class="stat"><span>${tr('missing')}</span><strong id="star-missing">—</strong></div><div class="stat"><span>${tr('duel_points')}</span><strong id="star-points">—</strong></div></div></section></div>`;
 const calc=()=>{const a=+$('#star-current').value,b=+$('#star-target').value,stock=number($('#star-stock').value);const total=b>a?GAME_DATA.stars.filter(s=>s.value>a&&s.value<=b).reduce((x,s)=>x+s.cost,0):0;
 $('#star-total').textContent=b>a?fmt(total):'—';$('#star-missing').textContent=b>a?fmt(Math.max(0,total-stock)):'—';$('#star-points').textContent=b>a?fmt(total*GAME_DATA.duel.urShardPoints):'—'};
 ['star-current','star-target','star-stock'].forEach(id=>$('#'+id).addEventListener('input',calc));calc();
}
function routeSkills(t){
 const max=Math.max(...Object.keys(GAME_DATA.skills).map(Number));
 $('#view').innerHTML=pageHead(t)+`
 <div class="calc-grid"><section class="panel"><div class="form-grid">
 <label><span>${tr('skill_current')}</span><select id="skill-current">${fillSelect(1,max,1)}</select></label>
 <label><span>${tr('skill_target')}</span><select id="skill-target">${fillSelect(1,max,10)}</select></label>
 <label class="full"><span>${tr('stock')}</span><input id="skill-stock" inputmode="numeric" value="0"></label></div></section>
 <section class="panel result-panel"><span class="result-label">${tr('badges_required')}</span><strong id="skill-total" class="result-main">—</strong><span class="result-unit">Skill Badges</span>
 <div class="stat-row"><div class="stat"><span>${tr('missing')}</span><strong id="skill-missing">—</strong></div><div class="stat"><span>${tr('duel_points')}</span><strong id="skill-points">—</strong></div></div></section></div>`;
 const calc=()=>{const a=+$('#skill-current').value,b=+$('#skill-target').value,stock=number($('#skill-stock').value);let total=0;if(b>a)for(let i=a+1;i<=b;i++)total+=GAME_DATA.skills[i]||0;
 $('#skill-total').textContent=b>a?fmt(total):'—';$('#skill-missing').textContent=b>a?fmt(Math.max(0,total-stock)):'—';$('#skill-points').textContent=b>a?fmt(total*GAME_DATA.duel.skillBadgePoints):'—'};
 ['skill-current','skill-target','skill-stock'].forEach(id=>$('#'+id).addEventListener('input',calc));calc();
}
function routeDuel(t){
 $('#view').innerHTML=pageHead(t)+`
 <div class="calc-grid"><section class="panel duel-inputs">
  <label><span>Antitoxin</span><input id="d-a" inputmode="numeric" value="0"></label>
  <label><span>${tr('recruits')}</span><input id="d-r" inputmode="numeric" value="0"></label>
  <label><span>UR Shards</span><input id="d-u" inputmode="numeric" value="0"></label>
  <label><span>SSR Shards</span><input id="d-s" inputmode="numeric" value="0"></label>
  <label><span>SR Shards</span><input id="d-sr" inputmode="numeric" value="0"></label>
  <label><span>Skill Badges</span><input id="d-b" inputmode="numeric" value="0"></label>
 </section>
 <section class="panel result-panel"><span class="result-label">${tr('duel_points')}</span><strong class="result-main" id="d-total">0</strong><span class="result-unit">${tr('hero_phase')}</span><div class="stat-row"><div class="stat full"><span>${tr('note_duel')}</span></div></div></section></div>`;
 const calc=()=>{const d=GAME_DATA.duel;const x=Math.floor(number($('#d-a').value)/d.antitoxinUnit)+number($('#d-r').value)*d.recruitPoints+number($('#d-u').value)*d.urShardPoints+number($('#d-s').value)*d.ssrShardPoints+number($('#d-sr').value)*d.srShardPoints+number($('#d-b').value)*d.skillBadgePoints;$('#d-total').textContent=fmt(x)};
 ['d-a','d-r','d-u','d-s','d-sr','d-b'].forEach(id=>$('#'+id).addEventListener('input',calc));calc();
}
function routeWeek(t){
 const days=tr('days');const js=new Date().getDay(),today=(js+6)%7;
 $('#view').innerHTML=pageHead(t)+`<div class="week-list">${days.map((d,i)=>`
 <article class="day-row ${i===today?'today':''}">
  <div class="day-name"><strong>${d[0]}</strong><span>${d[1]} ${i===today?'• '+tr('today'):''}</span></div>
  <div class="day-col"><b>${tr('use')}</b><span>${d[2]}</span></div>
  <div class="day-col"><b>${tr('keep')}</b><span>${d[3]}</span></div>
  <div class="day-col"><b>${tr('focus')}</b><span>${d[4]}</span></div>
 </article>`).join('')}</div>`;
}
function routeSoon(t){
 $('#view').innerHTML=pageHead(t)+`<section class="empty-state"><span class="tool-icon">${icon(t.icon)}</span><h2>${tr('soon')}</h2><p>${tr(t.desc)}</p><a href="#/" class="primary-btn">${icon('arrow-left')} ${tr('back')}</a></section>`;
}
function route(){
 const id=(location.hash.replace(/^#\//,'')||'home').split('/')[0];
 renderNav();applyStaticI18n();
 if(id==='home')renderHome();
 else{
  const t=TOOLS.find(x=>x.id===id)||TOOLS[0];$('#breadcrumb').textContent=tr(t.title);
  if(!t.ready)routeSoon(t);else if(id==='antitoxin')routeAntitoxin(t);else if(id==='shards')routeShards(t);else if(id==='skills')routeSkills(t);else if(id==='duel')routeDuel(t);else if(id==='week')routeWeek(t);
 }
 $$('.nav-link').forEach(a=>a.classList.toggle('active',a.dataset.route===id));
 lucide.createIcons();
 $('.sidebar').classList.remove('open');
}
$$('.flag-btn').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.lang;localStorage.setItem('lat-lang',lang);route()}));
$('#mobile-menu').addEventListener('click',()=>$('.sidebar').classList.toggle('open'));
window.addEventListener('hashchange',route);
route();
