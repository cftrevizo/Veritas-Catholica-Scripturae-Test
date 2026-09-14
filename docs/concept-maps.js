/* VCS 1.8.1 C1.5.6 — exploratory concept maps.  These are guided study maps,
   not independent theological determinations or comprehensive historical diagrams. */
(function(){
  const NS='http://www.w3.org/2000/svg';
  const node=(g,x,y,title,sub,topic,kind='concept')=>{
    const group=document.createElementNS(NS,'g');group.setAttribute('class',`concept-node ${kind}`);group.setAttribute('tabindex','0');group.setAttribute('role','link');
    const c=document.createElementNS(NS,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',kind==='center'?52:44);group.appendChild(c);
    const label=document.createElementNS(NS,'text');label.setAttribute('x',x);label.setAttribute('y',y-4);label.setAttribute('class','concept-label');label.textContent=title;group.appendChild(label);
    const small=document.createElementNS(NS,'text');small.setAttribute('x',x);small.setAttribute('y',y+15);small.setAttribute('class','concept-sub');small.textContent=sub;group.appendChild(small);
    const select=()=>showConceptMapDetail(title,sub,topic,group);
    group.addEventListener('click',select);group.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select()}});
    group.addEventListener('pointerenter',e=>tipV(e,`<b>${title}</b><br>${sub}<br><span class="tip-note">Select to reveal the Study Topics link below.</span>`));group.addEventListener('pointerleave',hideTip);g.appendChild(group);
  };
  const showConceptMapDetail=(title,sub,topic,selected)=>{const box=document.getElementById('conceptMapDetail');if(!box)return;document.querySelectorAll('.concept-node').forEach(n=>n.classList.toggle('concept-selected',n===selected));box.innerHTML=`<b>${title}</b><span>${sub}</span><div class="concept-map-study-link"><b>Study Topics</b><a class="timeline-miracle-link" href="topics.html?topic=${encodeURIComponent(topic)}">Open ${topic} →</a></div>`;box.classList.remove('hidden');box.scrollIntoView({behavior:'smooth',block:'nearest'});};
  const line=(g,x1,y1,x2,y2,label)=>{const p=document.createElementNS(NS,'line');p.setAttribute('x1',x1);p.setAttribute('y1',y1);p.setAttribute('x2',x2);p.setAttribute('y2',y2);p.setAttribute('class','concept-line');g.appendChild(p);if(label){const t=document.createElementNS(NS,'text');t.setAttribute('x',(x1+x2)/2);t.setAttribute('y',(y1+y2)/2-7);t.setAttribute('class','concept-line-label');t.textContent=label;g.appendChild(t)}};
  window.renderRuleFaith=function(){const {svg,g}=clearV();svg.setAttribute('viewBox','0 0 1400 760');svg.style.height='auto';
    line(g,700,130,330,400,'received in');line(g,700,130,1070,400,'handed on');line(g,330,400,700,620,'read within');line(g,1070,400,700,620,'authentically interprets');
    node(g,700,130,'Christ','Divine Revelation','Divine Revelation: How God Makes Himself Known','center');node(g,330,400,'Sacred Scripture','73-book canon','The Bible: God’s Word and the Church','scripture');node(g,1070,400,'Sacred Tradition','apostolic handing-on','Sacred Tradition');node(g,700,620,'Magisterium','servant of the Word','The Church, Papacy and Authority','magisterium');
    document.getElementById('conceptMapDetail')?.classList.add('hidden');const q=document.createElementNS(NS,'text');q.setAttribute('x',700);q.setAttribute('y',730);q.setAttribute('class','concept-caption');q.textContent='Prototype map · select a pillar to reveal its related Study Topics link below';g.appendChild(q);document.getElementById('visualMeta').innerHTML='<b>Rule of Faith · concept prototype</b> · Scripture, Tradition, and Magisterium in service of the revelation of Christ';
  };
  window.renderSalvationHistory=function(){const {svg,g}=clearV();svg.setAttribute('viewBox','0 0 1400 760');svg.style.height='auto';
    const stages=[['Creation','origin','Creation and the Fall'],['Covenant','promise','The Covenants and God’s Promise'],['Exodus','deliverance','The Exodus and Passover'],['Kingdom','worship','The Kingdom, Temple and David'],['Prophets','hope','The Prophets and the Messiah'],['Christ','fulfillment','Jesus Christ: True God and True Man'],['Church','mission','The Church'],['Sacraments','grace','The Seven Sacraments'],['New Creation','hope','Resurrection, Judgment and Eternal Life']];const xs=stages.map((_,i)=>90+i*152);for(let i=0;i<xs.length-1;i++)line(g,xs[i]+40,360,xs[i+1]-40,360,'');
    stages.forEach(([t,s,topic],i)=>node(g,xs[i],360,t,s,topic,i===5?'center':i===7?'sacrament':'history'));
    const a=document.createElementNS(NS,'text');a.setAttribute('x',700);a.setAttribute('y',164);a.setAttribute('class','concept-caption');a.textContent='One unfolding history: promise → fulfillment → participation → consummation';g.appendChild(a);
    document.getElementById('conceptMapDetail')?.classList.add('hidden');const b=document.createElementNS(NS,'text');b.setAttribute('x',700);b.setAttribute('y',600);b.setAttribute('class','concept-caption');b.textContent='Prototype map · select a stage to reveal its related Study Topics link below';g.appendChild(b);document.getElementById('visualMeta').innerHTML='<b>Salvation History · concept prototype</b> · the Catholic 73-book canon read as one unfolding account of God’s saving work';
  };
  const priorLegend=window.renderLegend;window.renderLegend=function(){if(!['rulefaith','salvation'].includes(VTYPE))return priorLegend();const host=document.getElementById('visualLegendHost');host.innerHTML='<div class="visual-legend concept-legend"><span><i></i> Clickable study pathway</span><span><i></i> Prototype: connections will expand after review</span></div>'};
})();
