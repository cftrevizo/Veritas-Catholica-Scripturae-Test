(()=>{'use strict';
 let readiness;
 async function init(){
   try{const payload=await fetch('data/timeline_source_enrichment_candidates.json?v=1.10.0c1',{cache:'no-store'}).then(r=>r.json());readiness=new Map(payload.records.map(r=>[r.event_id,r]));const target=document.getElementById('timelineDetail');if(target)new MutationObserver(append).observe(target,{childList:true,subtree:true});append()}catch(e){console.warn('Timeline source readiness unavailable',e)}
 }
 function append(){
   const target=document.getElementById('timelineDetail'), id=[...document.querySelectorAll('.timeline-selected')].find(n=>n.dataset.eventId)?.dataset.eventId;if(!target||!id||target.querySelector('.timeline-readiness'))return;const record=readiness?.get(id);if(!record)return;
   const panel=document.createElement('div');panel.className='timeline-readiness';
   if(record.source_candidate?.status?.startsWith('Ready')){const s=record.source_candidate;panel.innerHTML=`<b>1.10 source cue</b><span>Historical date precision remains approximate where indicated.</span><a class="timeline-miracle-link" target="_blank" rel="noopener" href="${s.url}">${s.title} ↗</a>`}else{panel.innerHTML='<b>1.10 source cue</b><span>Source selection is still pending for this event; VCS does not infer a citation.</span>'}
   target.append(panel);
 }
 document.addEventListener('DOMContentLoaded',init);
})();
