(()=>{'use strict';
  const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const topicButton=t=>`<button type="button" class="study-topic-link" data-vcs-topic="${esc(t)}">${esc(t)}</button>`;
  async function openEssentials(){
    const host=$('#studyFeature'); if(!host)return;
    host.classList.remove('hidden');
    host.innerHTML='<p class="collection-status">Loading Catechism Essentials…</p>';
    try{
      const data=await fetch('data/catechism_essentials_blueprint.json?v=1.10.0c1',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()});
      const parts=[...new Set(data.modules.map(m=>m.part))];
      host.innerHTML=`<div class="study-feature-head"><div><p class="eyebrow">1.10 C1 test path</p><h3>${esc(data.title)}</h3><p>Start with twelve orientation modules, then open the existing VCS topics and official Catechism entry points for fuller study.</p></div><a class="button secondary" target="_blank" rel="noopener" href="https://www.vatican.va/content/catechism/en.html">Official Catechism ↗</a></div><p class="review-boundary">${esc(data.source_boundary)} Exact paragraph-level mappings remain an editorial-review task; the links here lead to official part-level entry points.</p><div class="catechism-parts essentials-parts">${parts.map(part=>`<article class="catechism-part"><div class="catechism-part-head"><div><span class="eyebrow">${esc(part)}</span><h4>Core modules</h4><p>Use the questions and linked VCS topics as a structured starting point.</p></div></div><ol>${data.modules.filter(m=>m.part===part).map(m=>`<li><b>${m.order}. ${esc(m.title)}</b><span>${esc(m.ccc_range)}</span><p class="essentials-question">${esc(m.common_question_prompts.join(' · '))}</p><div class="study-topic-links">${m.vcs_topic_links.map(topicButton).join('')}</div><a class="mini-link" target="_blank" rel="noopener" href="${esc(m.official_catechism_url)}">Official Catechism entry ↗</a></li>`).join('')}</ol></article>`).join('')}</div>`;
      host.querySelectorAll('[data-vcs-topic]').forEach(b=>b.addEventListener('click',()=>openTopic(b.dataset.vcsTopic)));
      host.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(error){console.error('Catechism Essentials',error);host.innerHTML='<p class="empty">Catechism Essentials could not be loaded.</p>'}
  }
  function openTopic(title){
    const host=$('#studyFeature');host?.classList.add('hidden');
    const query=$('#topicSearch');if(!query)return;
    query.value=title;query.dispatchEvent(new Event('input'));
    $('#topicGrid')?.scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(()=>$('.topicrow-head')?.click(),100);
  }
  function install(){
    const list=$('#studyTools .study-path-buttons');if(!list||$('#catechismEssentials'))return;
    const button=document.createElement('button');button.type='button';button.id='catechismEssentials';button.className='study-path-feature study-path-c1';
    button.innerHTML='<b>Catechism Essentials</b><span>12 guided modules · official Catholic sources</span>';
    const before=list.querySelector('[data-study-view="catechism"]');list.insertBefore(button,before);
    button.addEventListener('click',openEssentials);
  }
  document.addEventListener('DOMContentLoaded',()=>{install();new MutationObserver(install).observe(document.body,{childList:true,subtree:true})});
})();
