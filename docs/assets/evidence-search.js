(()=>{'use strict';
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cache=null;
async function load(){if(cache)return cache;const [topics,sources,timeline,ignatius]=await Promise.all([
 fetch('data/faith_topics.json').then(r=>r.json()).catch(()=>[]),fetch('data/source_library.json').then(r=>r.json()).catch(()=>[]),fetch('data/timeline.json').then(r=>r.json()).catch(()=>[]),fetch('data/ignatius_study_resources.json?v=1.7.0c1a').then(r=>r.json()).catch(()=>({records:[]}))]);
cache={topics:Array.isArray(topics)?topics:(topics.topics||[]),sources:Array.isArray(sources)?sources:(sources.records||sources.sources||[]),timeline:Array.isArray(timeline)?timeline:(timeline.events||[]),ignatius:ignatius.records||[]};return cache}
const text=o=>JSON.stringify(o).toLowerCase();
function top(arr,q,n=8){return arr.filter(x=>text(x).includes(q)).slice(0,n)}
function group(title,items,render){if(!items.length)return `<section class="evidence-group"><h3>${title}</h3><div class="evidence-empty">No matching records.</div></section>`;return `<section class="evidence-group"><h3>${title} <span class="evidence-badge">${items.length}</span></h3><div class="evidence-items">${items.map(render).join('')}</div></section>`}
function topicName(x){return x.title||x.topic||x.name||x.label||'Study Topic'}
function sourceName(x){return [x.author,x.work||x.title].filter(Boolean).join(' — ')||x.label||'Historical source'}
function eventName(x){return x.title||x.label||x.event||'Timeline event'}
function renderResults(q,d){const t=top(d.topics,q),s=top(d.sources,q),e=top(d.timeline,q),i=top(d.ignatius,q);const total=t.length+s.length+e.length+i.length;$('#evidenceSearchStatus').innerHTML=`<b>${total}</b> grouped matches for <b>${esc(q)}</b> · showing up to 8 per evidence layer.`;$('#evidenceSearchResults').innerHTML=
 group('Study Topics',t,x=>`<a class="evidence-item" href="topics.html?topic=${encodeURIComponent(topicName(x))}"><strong>${esc(topicName(x))}</strong><small>Open the VCS Study Topic and its Scripture, Catechism, and historical evidence.</small></a>`)+
 group('Historical Source Library',s,x=>`<a class="evidence-item" href="source-library.html?source=${encodeURIComponent(x.id||'')}"><strong>${esc(sourceName(x))}</strong><small>${esc(x.era||x.date_label||x.date||'Source Library record')} · VCS historical source</small></a>`)+
 group('Timeline',e,x=>`<a class="evidence-item" href="./?timelineYear=${encodeURIComponent(x.year??x.start_year??'')}&timelineLabel=${encodeURIComponent(eventName(x))}#visual-experience"><strong>${esc(eventName(x))}</strong><small>${esc(x.date_label||x.year||x.category||'Historical event')} · Open in Visual Experience</small></a>`)+
 group('Ignatius Catholic Study Bible — Official Free Study Resources',i,x=>`<a class="evidence-item" href="${esc(x.url)}" target="_blank" rel="noopener"><strong>${esc((x.books||[]).join(', ')||x.id)}</strong><small>Ignatius Press official free study guide ↗ · external resource</small></a>`)}
async function run(e){e?.preventDefault();const q=$('#evidenceSearchInput')?.value.trim().toLowerCase();if(!q)return;$('#evidenceSearchStatus').textContent='Searching evidence layers…';renderResults(q,await load())}
document.addEventListener('DOMContentLoaded',()=>{$('#evidenceSearchForm')?.addEventListener('submit',run);const p=new URLSearchParams(location.search).get('evidence');if(p&&$('#evidenceSearchInput')){$('#evidenceSearchInput').value=p;run()}})})();
