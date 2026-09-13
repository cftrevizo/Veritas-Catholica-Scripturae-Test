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
function timelineVisibleRange(){
  if(!TLAYOUT)return {min:0,max:1};
  const z=Math.max(.35,VZOOM||1);
  const worldPerYear=1220/Math.max(1,TLAYOUT.max-TLAYOUT.min);
  const leftWorld=(0-VPANX)/z;
  const rightWorld=(1400-VPANX)/z;
  let min=TLAYOUT.min+((leftWorld-90)/1220)*(TLAYOUT.max-TLAYOUT.min);
  let max=TLAYOUT.min+((rightWorld-90)/1220)*(TLAYOUT.max-TLAYOUT.min);
  if(min>max)[min,max]=[max,min];
  return {min,max,years:Math.max(1,Math.abs(rightWorld-leftWorld)/worldPerYear)};
}
function timelineMeasureYearLabel(text){
  try{
    const c=timelineMeasureYearLabel.canvas||(timelineMeasureYearLabel.canvas=document.createElement('canvas'));
    const ctx=c.getContext('2d');ctx.font='800 18px system-ui, sans-serif';
    return ctx.measureText(text).width;
  }catch(_){return Math.max(58,String(text).length*10)}
}
function timelineGridInterval(){
  // Choose only from the approved resolutions. The deciding constraint is
  // rendered pixel spacing: date labels must not overlap at the current zoom.
  if(!TLAYOUT)return 100;
  const candidates=[1000,750,500,250,100,50,25,10,1];
  const vr=timelineVisibleRange();
  const stage=document.querySelector('.visual-stage.timeline-scroll-mode');
  const width=Math.max(420,stage?.clientWidth||1000);
  const target=24,minLines=10,maxLines=40;
  let best=candidates[0],bestScore=Infinity;
  for(const step of candidates){
    const lines=Math.max(1,vr.years/step);
    const sample=[Math.floor(vr.min/step)*step,Math.round((vr.min+vr.max)/2/step)*step,Math.ceil(vr.max/step)*step]
      .filter(y=>y!==0).map(tYear);
    const labelW=Math.max(54,...sample.map(timelineMeasureYearLabel));
    const px=width/lines;
    const overlapPenalty=px<labelW+18 ? (labelW+18-px)*8 : 0;
    const countPenalty=lines<minLines ? (minLines-lines)*7 : lines>maxLines ? (lines-maxLines)*7 : 0;
    const score=overlapPenalty+countPenalty+Math.abs(lines-target);
    if(score<bestScore){bestScore=score;best=step;}
  }
  return best;
}
function ensureTimelineStickyAxis(){
  const stage=document.querySelector('.visual-stage');if(!stage)return null;
  let axis=stage.querySelector('#timelineStickyDateAxis');
  if(!axis){axis=document.createElement('div');axis.id='timelineStickyDateAxis';axis.className='timeline-sticky-date-axis';stage.prepend(axis)}
  return axis;
}
function renderTimelineStickyAxis(step,visibleMin,visibleMax,xScreen){
  const axis=ensureTimelineStickyAxis();if(!axis)return;
  axis.innerHTML='';
  const stage=document.querySelector('.visual-stage.timeline-scroll-mode');
  const width=Math.max(1,stage?.clientWidth||1);
  let first=Math.floor(visibleMin/step)*step;
  for(let yr=first;yr<=visibleMax+step;yr+=step){
    if(yr===0)continue;
    const xx=xScreen(yr);if(xx<0||xx>1400)continue;
    const label=document.createElement('span');label.className='timeline-sticky-date-label';
    label.style.left=`${(xx/1400)*100}%`;label.textContent=tYear(yr);axis.appendChild(label);
  }
  if(TLAYOUT.min<0&&TLAYOUT.max>0){
    const zx=xScreen(0);if(zx>=0&&zx<=1400){
      const era=document.createElement('span');era.className='timeline-sticky-era-label';era.style.left=`${(zx/1400)*100}%`;era.textContent='BC | AD';axis.appendChild(era);
    }
  }
  const badge=document.createElement('span');badge.className='timeline-sticky-resolution';badge.textContent=`${step}-year grid`;axis.appendChild(badge);
}
function renderTimelineGuides(){
  const svg=document.getElementById('visualSvg'); if(!svg)return;
  svg.querySelector('#timelineFixedGuides')?.remove();
  if(VTYPE!=='timeline'||!TLAYOUT){document.getElementById('timelineStickyDateAxis')?.remove();return;}
  const og=S('g',{id:'timelineFixedGuides',class:'timeline-fixed-guides'}); svg.appendChild(og);
  const top=TLAYOUT.top,bottom=TLAYOUT.bottom,step=timelineGridInterval();
  const xWorld=yr=>90+(yr-TLAYOUT.min)/(TLAYOUT.max-TLAYOUT.min)*1220;
  const xScreen=yr=>VPANX+VZOOM*xWorld(yr);
  const vr=timelineVisibleRange(),visibleMin=vr.min,visibleMax=vr.max;
  let first=Math.floor(visibleMin/step)*step;
  for(let yr=first;yr<=visibleMax+step;yr+=step){
    if(yr===0)continue;
    const xx=xScreen(yr); if(xx<-20||xx>1420)continue;
    const major=(Math.abs(yr)%100===0);
    og.appendChild(S('line',{x1:xx,y1:top,x2:xx,y2:bottom,class:major?'timeline-grid major':'timeline-grid'}));
  }
  if(TLAYOUT.min<0&&TLAYOUT.max>0){
    const zx=xScreen(0); if(zx>=0&&zx<=1400) og.appendChild(S('line',{x1:zx,y1:top,x2:zx,y2:bottom,class:'timeline-era-divider'}));
  }
  // Full-width horizontal lane boundaries are rendered in the fixed guide layer,
  // so they always span the visible plotting area regardless of horizontal zoom/pan.
  for(const [c,b] of TLAYOUT.bands.entries()){
    og.appendChild(S('line',{x1:0,y1:b.top,x2:1400,y2:b.top,class:'timeline-lane-full'}));
    og.appendChild(S('line',{x1:0,y1:b.bottom,x2:1400,y2:b.bottom,class:'timeline-lane-full'}));
    const lab=S('text',{x:6,y:b.top+24,class:'timeline-lane-label sticky'});lab.textContent=TCAT_LABEL[c]||c;og.appendChild(lab);
  }
  renderTimelineStickyAxis(step,visibleMin,visibleMax,xScreen);
}
function updateTimelineEventScale(){
  if(VTYPE!=='timeline')return;
  const z=Math.max(.35,VZOOM||1);
  // Timeline zoom is chronological only. Counter-scale each marker and label on X
  // around its own anchor so circles/text never stretch as the year scale expands.
  document.querySelectorAll('#visualViewport .timeline-event').forEach(n=>{
    const cx=Number(n.dataset.cx),cy=Number(n.dataset.cy);
    if(Number.isFinite(cx)&&Number.isFinite(cy)) n.setAttribute('transform',`translate(${cx} ${cy}) scale(${1/z} 1) translate(${-cx} ${-cy})`);
    n.setAttribute('stroke-width','1.35');
  });
  document.querySelectorAll('#visualViewport .timeline-event-label').forEach(t=>{
    const x=Number(t.dataset.baseX),y=Number(t.dataset.baseY);
    if(Number.isFinite(x)&&Number.isFinite(y)){
      t.setAttribute('x',x+10/z); t.setAttribute('y',y-8);
      t.setAttribute('transform',`translate(${x} ${y}) scale(${1/z} 1) translate(${-x} ${-y})`);
    }
    t.style.fontSize='12px'; t.style.strokeWidth='2.4px';
  });
}

function renderTimeline(){
  const {svg,g}=clearV(),ev=timelineFiltered();
  document.querySelector('.visual-stage')?.classList.add('timeline-scroll-mode');
  if(!ev.length){TLAYOUT=null;document.getElementById('visualMeta').innerHTML='<b>Semantic Timeline</b> · No events match the current filters.';return}
  let min=Math.min(...ev.map(e=>e.year)),max=Math.max(...ev.map(e=>e.year));if(min===max)max=min+1;
  const x=y=>90+(y-min)/(max-min)*1220;
  const cats=activeTimelineCats();
  const present=new Set(ev.map(e=>e.category));
  const lanes=cats.filter(c=>present.has(c));
  // Unlimited collision packing. Each lane gets as many sub-rows as its visible
  // events need. Lane height follows data density; it never caps the event count.
  const laneEvents=new Map(lanes.map(c=>[c,ev.filter(e=>e.category===c).sort((a,b)=>a.year-b.year)]));
  const laneRows=new Map();
  const z=Math.max(.35,VZOOM||1);
  for(const c of lanes){
    const rowEnds=[];
    for(const e of laneEvents.get(c)){
      const xx=x(e.year), showLabel=true;
      const screenW=Math.max(54,Math.min(210,24+(e.title||'').length*6.2));
      const est=screenW/z, gap=14/z;
      let row=0; while(row<rowEnds.length && xx < rowEnds[row]+gap) row++;
      if(row===rowEnds.length)rowEnds.push(-Infinity);
      rowEnds[row]=xx+est;
      e.__trow=row;e.__tshow=showLabel;
    }
    laneRows.set(c,Math.max(1,rowEnds.length));
  }
  const top=72,rowH=34,lanePadTop=34,lanePadBottom=20,laneGap=10;
  let cursor=top;const bands=new Map();
  for(const c of lanes){
    const rows=laneRows.get(c),height=lanePadTop+rows*rowH+lanePadBottom;
    bands.set(c,{top:cursor,bottom:cursor+height,rows});cursor+=height+laneGap;
  }
  const bottom=cursor+10,axisY=bottom+38,contentH=axisY+30;
  svg.setAttribute('viewBox',`0 0 1400 ${contentH}`);
  svg.style.height=`${contentH}px`;
  TLAYOUT={min,max,bands,top,bottom,axisY,contentH};
  // Draw lane boundaries so all events are visibly contained between topics.
  for(const [c,b] of bands){
    g.appendChild(S('line',{x1:0,y1:b.top,x2:1400,y2:b.top,class:'timeline-band-boundary'}));
    g.appendChild(S('line',{x1:0,y1:b.bottom,x2:1400,y2:b.bottom,class:'timeline-band-boundary'}));
  }
  ev.sort((a,b)=>a.year-b.year).forEach(e=>{
    const b=bands.get(e.category);if(!b)return;
    const xx=x(e.year),yy=b.top+lanePadTop+e.__trow*rowH+rowH*.5;
    const r=e.importance==='foundational'?7:e.importance==='major'?6:e.importance==='significant'?5:4;
    const node=S('circle',{cx:xx,cy:yy,r,class:`timeline-event ${e.importance}`});
    node.dataset.baseR=String(r);node.dataset.cx=String(xx);node.dataset.cy=String(yy);node.dataset.eventId=e.id;node.dataset.year=String(e.year);node.tabIndex=0;
    const summary=(e.summary||e.description||'').trim();
    const summaryHtml=summary?`<br>${summary}`:'';
    const eventSummary=q=>tipV(q,`<b>${e.label} · ${e.title}</b>${summaryHtml}<br><span class="tip-note">Category: ${e.category} · Importance: ${e.importance}</span>${e.source?`<br><span class="tip-note">Source: ${e.source}</span>`:''}${e.date_quality!=='anchored'?`<br><span class="tip-note">Date quality: ${e.date_quality}</span>`:''}`);
    const openDetail=q=>{TFOCUS=e.id;document.getElementById('timelineDetail').innerHTML=`<b>${e.label} · ${e.title}</b><span>${summary||'No extended summary is currently available for this event.'}</span>${e.source?`<small>Source / discovery layer: ${e.source}</small>`:''}`; if(q.pointerType==='touch')eventSummary(q)};
    // A transparent hit target makes every event easy to hover even when stacked labels
    // visually cross the dot. The visible marker remains compact.
    const hit=S('circle',{cx:xx,cy:yy,r:Math.max(13,r+7),class:'timeline-event-hit'});
    hit.dataset.cx=String(xx);hit.dataset.cy=String(yy);
    for(const target of [hit,node]){
      target.addEventListener('pointerenter',eventSummary);
      target.addEventListener('pointermove',eventSummary);
      target.addEventListener('pointerleave',hideTip);
      target.addEventListener('click',openDetail);
    }
    node.addEventListener('focus',eventSummary);
    node.addEventListener('blur',hideTip);
    g.appendChild(hit);g.appendChild(node);
    const t=S('text',{x:xx+8,y:yy-8,class:'timeline-event-label stacked'});t.dataset.baseX=String(xx);t.dataset.baseY=String(yy);t.dataset.side='right';t.textContent=e.title;g.appendChild(t);
  });
  updateTimelineEventScale();
  const scopeLabel=TSCOPES.size===3?'All History':[...TSCOPES].map(s=>s==='ot'?'OT':s==='apostolic'?'NT & Apostolic':'Church').join(' + ');
  document.getElementById('visualMeta').innerHTML=`<b>Semantic Timeline · ${scopeLabel}</b> · ${ev.length} visible events · ${[...TIMPORTS].map(x=>x.replace(/^./,c=>c.toUpperCase())).join(' + ')}`;
  requestAnimationFrame(renderTimelineGuides);
}
function initTimelineControls(){document.querySelectorAll('[data-timeline-scope]').forEach(b=>b.onclick=()=>{let s=b.dataset.timelineScope;if(s==='all'){TSCOPES=new Set(['ot','apostolic','church'])}else if(TSCOPES.has(s)){if(TSCOPES.size>1)TSCOPES.delete(s)}else TSCOPES.add(s);TCATS.clear();timelineControls();renderVisual();scheduleFitVisual()});document.querySelectorAll('[data-timeline-importance]').forEach(b=>b.onclick=()=>{let v=b.dataset.timelineImportance;if(TIMPORTS.has(v)){if(TIMPORTS.size>1)TIMPORTS.delete(v)}else TIMPORTS.add(v);syncImportanceButtons();renderVisual();scheduleFitVisual()});document.getElementById('timelineClearCats')?.addEventListener('click',()=>{TCATS.clear();timelineControls();renderVisual();scheduleFitVisual()});timelineControls()}
