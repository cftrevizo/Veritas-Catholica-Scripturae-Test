(()=>{
  'use strict';
  const $=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const CATEGORY_LABELS={miracles:'Miracles',apparitions_devotions:'Marian apparitions & devotions',eucharistic_signs:'Eucharistic signs & reported miracles',relics_sacred_images:'Relics & sacred images',saints_causes:'Saints & causes',discernment:'Discernment & governance'};
  const TIMELINE_CATEGORIES={miracles:'miracles',apparitions_devotions:'apparitions',eucharistic_signs:'eucharistic',relics_sacred_images:'relics',saints_causes:'saints',discernment:'discernment'};
  let data=null;
  const label=id=>data.recognition_levels.find(x=>x.id===id)?.label||id;
  const source=id=>data.source_documents.find(x=>x.id===id);
  const category=r=>r.registry_category||'discernment';
  const title=r=>r.title||r.person||'Registry record';
  function meta(r){const s=source(r.source_document_id),date=r.recognition_date||r.notice_date||s?.published_date||'';return [r.record_type?.replaceAll('_',' '),date,s?.authority].filter(Boolean).map(esc).join(' · ')}
  function timelineLink(r){const targets={
    'registry-lourdes-recognized-cures':['registry-lourdes-catherine-latapie-1862',1862,'Lourdes recognized cures'],
    'lourdes-cure-catherine-latapie-1862':['registry-lourdes-catherine-latapie-1862',1862,'Catherine Latapie'],
    'lourdes-cure-pierre-de-rudder-1908':['registry-lourdes-pierre-de-rudder-1908',1908,'Pierre De Rudder'],
    'lourdes-cure-jean-pierre-bely-1999':['registry-lourdes-jean-pierre-bely-1999',1999,'Jean-Pierre Bély'],
    'lourdes-cure-bernadette-moriau-2018':['registry-lourdes-bernadette-moriau-2018',2018,'Bernadette Moriau'],
    'vatican-decree-allamano-2024-05-23':['registry-vatican-decrees-2024-05-23',2024,'Vatican miracle decrees'],
    'vatican-decree-carlo-acutis-2024-05-23':['registry-vatican-decrees-2024-05-23',2024,'Vatican miracle decrees'],
    'vatican-decree-giovanni-merlini-2024-05-23':['registry-vatican-decrees-2024-05-23',2024,'Vatican miracle decrees'],
    'ddf-discernment-norms-2024-05-17':['registry-ddf-norms-2024-05-17',2024,'DDF discernment norms'],
    'guadalupe-liturgical-recognition-1999':['registry-guadalupe-1999',1999,'Our Lady of Guadalupe'],
    'fatima-vatican-reference-2000':['registry-fatima-2000',2000,'Fatima'],
    'shroud-turin-veneration-1998':['registry-shroud-turin-1998',1998,'Shroud of Turin'],
    'padre-pio-canonization-2002':['registry-padre-pio-2002',2002,'St Pio of Pietrelcina'],
    'lanciano-holy-see-reference-1999':['registry-lanciano-1999',1999,'Lanciano']
  }[r.id];if(!targets)return '';const [event,year,linkLabel]=targets;const p=new URLSearchParams({timelineYear:String(year),timelineEvent:event,timelineScope:'church',timelineImportance:r.recognition_level==='discernment_norms_reference'||r.recognition_level==='official_historical_reference'?'source':'significant',timelineCategory:TIMELINE_CATEGORIES[category(r)],timelineLabel:linkLabel});return `<a class="mini-link" href="./?${p}">Open in Timeline →</a>`}
  function render(){const q=$('#miracleSearch').value.trim().toLowerCase(),cat=$('#miracleCategory').value,level=$('#miracleLevel').value,type=$('#miracleType').value;const all=data.records.filter(r=>{const text=JSON.stringify(r).toLowerCase();return(!q||text.includes(q))&&(cat==='all'||category(r)===cat)&&(level==='all'||r.recognition_level===level)&&(type==='all'||r.record_type===type)});$('#miracleStatus').textContent=`${all.length} source-linked ${all.length===1?'record':'records'} shown.`;$('#miracleResults').innerHTML=all.map(r=>{const s=source(r.source_document_id);return `<article class="registry-card"><div class="registry-card-top"><span class="registry-category">${esc(CATEGORY_LABELS[category(r)]||category(r))}</span><span class="registry-level ${esc(r.recognition_level)}">${esc(label(r.recognition_level))}</span><span class="registry-meta">${meta(r)}</span></div><h3>${esc(title(r))}</h3>${r.place?`<p><b>Place:</b> ${esc(r.place)}</p>`:''}${r.recognition_summary?`<p>${esc(r.recognition_summary)}</p>`:''}<p class="registry-boundary">${esc(r.vcs_boundary_note||data.scope_note)}</p><div class="registry-links">${s?`<a class="mini-link" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)} ↗</a>`:''}${timelineLink(r)}</div></article>`}).join('')||'<p class="empty">No registry records match those filters.</p>'}
  async function init(){try{data=await fetch('data/miracle_recognition_registry.json?v=1.8.1c1.3',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()});$('#miracleLevelKey').innerHTML=data.recognition_levels.map(x=>`<article><b>${esc(x.label)}</b><span>${esc(x.meaning)}</span></article>`).join('');$('#miracleCategory').innerHTML+=Object.keys(CATEGORY_LABELS).filter(id=>data.records.some(r=>category(r)===id)).map(id=>`<option value="${id}">${esc(CATEGORY_LABELS[id])}</option>`).join('');$('#miracleLevel').innerHTML+=data.recognition_levels.map(x=>`<option value="${esc(x.id)}">${esc(x.label)}</option>`).join('');const types=[...new Set(data.records.map(r=>r.record_type))];$('#miracleType').innerHTML+=types.map(x=>`<option value="${esc(x)}">${esc(x.replaceAll('_',' '))}</option>`).join('');['#miracleSearch','#miracleCategory','#miracleLevel','#miracleType'].forEach(s=>$(s).addEventListener(s==='#miracleSearch'?'input':'change',render));const q=new URLSearchParams(location.search).get('q');if(q)$('#miracleSearch').value=q;render()}catch(e){console.error('Miracle Registry',e);$('#miracleStatus').textContent='Registry data could not be loaded.'}}
  document.addEventListener('DOMContentLoaded',init);
})();
