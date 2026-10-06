let researchIndex=[];
const researchEsc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function addResearchAccess(){
  try{
    document.querySelectorAll('.topicrow').forEach(row=>{
      if(row.querySelector('.topic-research'))return;
      const title=row.querySelector('.topicrow-title')?.textContent.trim();
      const hits=researchIndex.filter(s=>(s.study_topics||[]).includes(title));
      if(!hits.length)return;
      const links=hits.slice(0,4).map(s=>`<a class="research-source-link" href="research-library.html?source=${encodeURIComponent(s.id)}"><b>${researchEsc(s.id)}</b> · ${researchEsc(s.title)}</a>`).join('');
      const more=hits.length>4?`<a class="mini-link" href="research-library.html?q=${encodeURIComponent(title)}">View ${hits.length-4} more research sources →</a>`:'';
      row.querySelector('.topicrow-body')?.insertAdjacentHTML('beforeend',`<div class="topic-research"><span class="topic-source-label">Catholic scholarly & apologetics research</span><p class="small">Supporting research leads for this Study Topic; verify claims in Scripture, the Catechism, and primary sources before publication.</p><div class="research-source-list">${links}</div>${more}</div>`);
    });
  }catch(e){console.warn('Research access unavailable',e)}
}
fetch('data/catholic_research_index.json?v=1.10.1',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(data=>{researchIndex=data.records||[];const grid=document.querySelector('#topicGrid');if(!grid)return;new MutationObserver(addResearchAccess).observe(grid,{childList:true,subtree:true});addResearchAccess()}).catch(e=>console.warn('Research index unavailable',e));
