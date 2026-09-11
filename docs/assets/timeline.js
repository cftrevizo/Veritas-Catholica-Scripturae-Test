// VCS 1.6 C2 Semantic Timeline — multi-select filter hotfix
let TDATA=null, TSCOPES=new Set(['ot','apostolic','church']), TIMPORTS=new Set(['foundational','major']), TCATS=new Set(), TFOCUS=null, TLAYOUT=null;
const TLEVEL={foundational:0,major:1,significant:2,detailed:3,source:4};
const TCAT_LABEL={biblical_events:'Biblical Events',patriarchs:'Patriarchs',covenants:'Covenants',kings:'Kings / Israel & Judah',prophets:'Prophets',empires:'Empires / World Context',messianic:'Messianic',jesus:'Jesus Christ',apostles:'Apostles',fathers:'Fathers & Writings',councils:'Councils & Magisterium',doctrine:'Doctrine',schisms:'Schisms',reforms:'Reforms',martyrs:'Persecution / Martyrs',world:'World Context',scripture:'Scripture / Canon',missions:'Missions / Saints'};
const SCOPE_CATS={ot:['biblical_events','patriarchs','covenants','kings','prophets','empires','messianic','scripture'],apostolic:['jesus','apostles','fathers','councils','martyrs','world','scripture','messianic'],church:['fathers','councils','doctrine','schisms','reforms','martyrs','scripture','missions','world']};
function tYear(y){return y<0?`${Math.abs(y)} BC`:`AD ${y}`}
function activeTimelineCats(){let out=[];['ot','apostolic','church'].forEach(s=>{if(TSCOPES.has(s)) out.push(...SCOPE_CATS[s])});return [...new Set(out)]}
function syncScopeButtons(){const all=TSCOPES.size===3;document.querySelectorAll('[data-timeline-scope]').forEach(b=>{let s=b.dataset.timelineScope;b.classList.toggle('active',s==='all'?all:TSCOPES.has(s));b.setAttribute('aria-pressed',String(s==='all'?all:TSCOPES.has(s)))})}
function syncImportanceButtons(){document.querySelectorAll('[data-timeline-importance]').forEach(b=>{let on=TIMPORTS.has(b.dataset.timelineImportance);b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))})}
function timelineControls(){let cats=activeTimelineCats();TCATS=new Set([...TCATS].filter(c=>cats.includes(c)));document.getElementById('timelineCategories').innerHTML=cats.map(c=>`<button class="timeline-chip ${TCATS.size===0||TCATS.has(c)?'active':''}" data-timeline-category="${c}" aria-pressed="${TCATS.size===0||TCATS.has(c)}">${TCAT_LABEL[c]||c}</button>`).join('');document.querySelectorAll('[data-timeline-category]').forEach(b=>b.onclick=()=>{let allMode=TCATS.size===0;if(allMode)TCATS=new Set(cats);let c=b.dataset.timelineCategory;TCATS.has(c)?TCATS.delete(c):TCATS.add(c);if(TCATS.size===cats.length)TCATS.clear();timelineControls();renderVisual();scheduleFitVisual()});syncScopeButtons();syncImportanceButtons()}
function timelineFiltered(){if(!TDATA)return[];return TDATA.events.filter(e=>TSCOPES.has(e.scope)&&TIMPORTS.has(e.importance)&&(!TCATS.size||TCATS.has(e.category)||e.tags?.some(t=>TCATS.has(t))))}
function timelineGridInterval(){
  if(!TLAYOUT)return 100;
  const years=Math.max(1,TLAYOUT.max-TLAYOUT.min), unitsPerYear=1220/years;
  for(const step of [1,5,25,50,100]) if(step*unitsPerYear*VZOOM>=58)return step;
  return 100;
}
function renderTimelineGuides(){
  const svg=document.getElementById('visualSvg'); if(!svg)return;
  svg.querySelector('#timelineFixedGuides')?.remove();
  if(VTYPE!=='timeline'||!TLAYOUT)return;
  const og=S('g',{id:'timelineFixedGuides',class:'timeline-fixed-guides'}); svg.appendChild(og);
  const top=-575,bottom=665,axisY=708,step=timelineGridInterval();
  const xWorld=yr=>90+(yr-TLAYOUT.min)/(TLAYOUT.max-TLAYOUT.min)*1220;
  const xScreen=yr=>VPANX+VZOOM*xWorld(yr);
  let visibleMin=TLAYOUT.min+(((0-VPANX)/VZOOM)-90)/1220*(TLAYOUT.max-TLAYOUT.min);
  let visibleMax=TLAYOUT.min+(((1400-VPANX)/VZOOM)-90)/1220*(TLAYOUT.max-TLAYOUT.min);
  if(visibleMin>visibleMax)[visibleMin,visibleMax]=[visibleMax,visibleMin];
  let first=Math.floor(visibleMin/step)*step;
  for(let yr=first;yr<=visibleMax+step;yr+=step){
    if(yr===0)continue;
    const xx=xScreen(yr); if(xx<-20||xx>1420)continue;
    const major=(Math.abs(yr)%100===0);
    og.appendChild(S('line',{x1:xx,y1:top,x2:xx,y2:bottom,class:major?'timeline-grid major':'timeline-grid'}));
    const t=S('text',{x:xx,y:axisY,'text-anchor':'middle',class:'timeline-axis-label sticky'}); t.textContent=tYear(yr); og.appendChild(t);
  }
  if(TLAYOUT.min<0&&TLAYOUT.max>0){
    const zx=xScreen(0); if(zx>=0&&zx<=1400){
      og.appendChild(S('line',{x1:zx,y1:top,x2:zx,y2:bottom,class:'timeline-era-divider'}));
      const e=S('text',{x:zx+6,y:top+18,class:'timeline-era-label'});e.textContent='BC  |  AD';og.appendChild(e);
    }
  }
  og.appendChild(S('line',{x1:0,y1:axisY-12,x2:1400,y2:axisY-12,class:'timeline-axis sticky'}));
  for(const [c,y] of TLAYOUT.ymap.entries()){
    const sy=VPANY+VZOOM*y; if(sy<top+10||sy>bottom-10)continue;
    const lab=S('text',{x:10,y:sy+7,class:'timeline-lane-label sticky'});lab.textContent=TCAT_LABEL[c]||c;og.appendChild(lab);
  }
  const badge=S('text',{x:1385,y:top+18,'text-anchor':'end',class:'timeline-resolution-label'});badge.textContent=`Grid: ${step}-year intervals`;og.appendChild(badge);
}
function renderTimeline(){
  const {g}=clearV(),ev=timelineFiltered();
  if(!ev.length){TLAYOUT=null;document.getElementById('visualMeta').innerHTML='<b>Semantic Timeline</b> · No events match the current filters.';return}
  let min=Math.min(...ev.map(e=>e.year)),max=Math.max(...ev.map(e=>e.year));if(min===max)max=min+1;
  const x=y=>90+(y-min)/(max-min)*1220;
  const lanes=[...new Set(ev.map(e=>e.category))];
  // Collision-aware stacking: labels in a busy lane are assigned to the lowest
  // available sub-row whose previous label does not overlap horizontally.
  const laneEvents=new Map(lanes.map(c=>[c,ev.filter(e=>e.category===c).sort((a,b)=>a.year-b.year)]));
  const laneRows=new Map();
  for(const c of lanes){
    const rowEnds=[];
    for(const e of laneEvents.get(c)){
      const xx=x(e.year), showLabel=e.importance==='foundational'||e.importance==='major'||(e.importance==='significant'&&ev.length<55);
      const est=showLabel?Math.max(34,Math.min(150,18+(e.title||'').length*5.7)):18;
      let row=0; while(row<rowEnds.length && xx-est*.18 < rowEnds[row]+10) row++;
      if(row===rowEnds.length)rowEnds.push(-Infinity);
      rowEnds[row]=xx+est;
      e.__trow=row; e.__tshow=showLabel;
    }
    laneRows.set(c,Math.max(1,rowEnds.length));
  }
  const topY=88,bottomY=615,totalWeight=lanes.reduce((n,c)=>n+Math.max(1,laneRows.get(c)),0),unit=(bottomY-topY)/Math.max(totalWeight,1);
  let cursor=topY; const ymap=new Map(),rowStep=new Map();
  for(const c of lanes){const rows=Math.max(1,laneRows.get(c)),h=unit*rows;ymap.set(c,cursor+h/2);rowStep.set(c,Math.min(24,Math.max(12,h/rows)));cursor+=h}
  TLAYOUT={min,max,ymap};
  lanes.forEach(c=>{let y=ymap.get(c);g.appendChild(S('line',{x1:90,y1:y,x2:1310,y2:y,class:'timeline-lane'}))});
  ev.sort((a,b)=>a.year-b.year).forEach(e=>{let xx=x(e.year),base=ymap.get(e.category),rows=Math.max(1,laneRows.get(e.category)),step=rowStep.get(e.category),yy=base+(e.__trow-(rows-1)/2)*step,r=e.importance==='foundational'?9:e.importance==='major'?7:e.importance==='significant'?5:4,cl=`timeline-event ${e.importance}`;let node=S('circle',{cx:xx,cy:yy,r:r,class:cl});node.tabIndex=0;node.addEventListener('pointermove',z=>tipV(z,`<b>${e.label} · ${e.title}</b><br>${e.summary}${e.source?`<br><span class="tip-note">Source: ${e.source}</span>`:''}${e.date_quality!=='anchored'?`<br><span class="tip-note">Date: ${e.date_quality}</span>`:''}`));node.addEventListener('pointerleave',hideTip);node.addEventListener('click',()=>{TFOCUS=e.id;document.getElementById('timelineDetail').innerHTML=`<b>${e.label} · ${e.title}</b><span>${e.summary}</span>${e.source?`<small>Source / discovery layer: ${e.source}</small>`:''}`});g.appendChild(node);if(e.__tshow){let t=S('text',{x:xx+6,y:yy-10,class:'timeline-event-label stacked'});t.textContent=e.title;g.appendChild(t)}});
  let scopeLabel=TSCOPES.size===3?'All History':[...TSCOPES].map(s=>s==='ot'?'OT':s==='apostolic'?'NT & Apostolic':'Church').join(' + ');document.getElementById('visualMeta').innerHTML=`<b>Semantic Timeline · ${scopeLabel}</b> · ${ev.length} visible events · ${[...TIMPORTS].map(x=>x.replace(/^./,c=>c.toUpperCase())).join(' + ')}`;
  requestAnimationFrame(renderTimelineGuides);
}
function initTimelineControls(){document.querySelectorAll('[data-timeline-scope]').forEach(b=>b.onclick=()=>{let s=b.dataset.timelineScope;if(s==='all'){TSCOPES=new Set(['ot','apostolic','church'])}else if(TSCOPES.has(s)){if(TSCOPES.size>1)TSCOPES.delete(s)}else TSCOPES.add(s);TCATS.clear();timelineControls();renderVisual();scheduleFitVisual()});document.querySelectorAll('[data-timeline-importance]').forEach(b=>b.onclick=()=>{let v=b.dataset.timelineImportance;if(TIMPORTS.has(v)){if(TIMPORTS.size>1)TIMPORTS.delete(v)}else TIMPORTS.add(v);syncImportanceButtons();renderVisual();scheduleFitVisual()});document.getElementById('timelineClearCats')?.addEventListener('click',()=>{TCATS.clear();timelineControls();renderVisual();scheduleFitVisual()});timelineControls()}
