(()=>{'use strict';
const citations={
 'The Eucharist: “Jesus Was Only Speaking Symbolically”':[
  {label:'Ignatius of Antioch, Letter to the Smyrnaeans 7',note:'Eucharist and the flesh of Christ',url:'https://www.newadvent.org/fathers/0109.htm'},
  {label:'Justin Martyr, First Apology 66',note:'Second-century Eucharistic witness',url:'https://www.newadvent.org/fathers/0126.htm'}],
 'Apostolic Succession: “Authority Ended With the Apostles”':[
  {label:'Irenaeus, Against Heresies III.3.3',note:'Succession and the Church of Rome',url:'https://www.newadvent.org/fathers/0103303.htm'},
  {label:'Clement of Rome, 1 Clement 42–44',note:'Apostolic ministry and succession',url:'https://www.newadvent.org/fathers/1010.htm'}],
 'Constantine / Nicaea: “Constantine Created the Catholic Church”':[
  {label:'Ignatius of Antioch, Letter to the Smyrnaeans 8',note:'Bishop, Eucharist, and the Catholic Church before Nicaea',url:'https://www.newadvent.org/fathers/0109.htm'},
  {label:'Justin Martyr, First Apology 65–67',note:'Second-century Christian worship',url:'https://www.newadvent.org/fathers/0126.htm'}],
 'Historical Myth: “Nicaea Invented the Divinity of Jesus”':[
  {label:'Ignatius of Antioch, Letter to the Ephesians 7',note:'Early Christological witness',url:'https://www.newadvent.org/fathers/0104.htm'},
  {label:'Ignatius of Antioch, Letter to the Smyrnaeans 1',note:'Christological witness before Nicaea',url:'https://www.newadvent.org/fathers/0109.htm'}],
 'The Papacy: “Peter Had No Unique Office”':[
  {label:'Irenaeus, Against Heresies III.3.3',note:'Roman succession witness',url:'https://www.newadvent.org/fathers/0103303.htm'}]
 , 'The Deuterocanon: “Catholics Added Books to the Bible”':[
  {label:'Council of Rome (AD 382), canon list',note:'Early Western canon witness',url:'https://www.newadvent.org/cathen/03274a.htm'},
  {label:'Augustine, On Christian Doctrine II.8',note:'Catholic Old Testament canon witness',url:'https://www.newadvent.org/fathers/12022.htm'}]
 , 'Infant Baptism: “Only Believers Who Can Personally Profess Faith May Be Baptized”':[
  {label:'Irenaeus, Against Heresies II.22.4',note:'Regeneration language including infants',url:'https://www.newadvent.org/fathers/0103222.htm'},
  {label:'Origen, Homilies on Leviticus 8.3',note:'Early witness to infant baptism',url:'https://www.newadvent.org/fathers/071508.htm'}]
 , 'Sacred Images: “Catholic Statues Violate the Commandment Against Idols”':[
  {label:'Second Council of Nicaea (AD 787)',note:'Distinguishes veneration from worship',url:'https://www.newadvent.org/cathen/11044a.htm'}]
 , 'The Mass as Sacrifice: “Christ Was Sacrificed Once, So the Mass Cannot Be Sacrificial”':[
  {label:'Didache 14',note:'Early Eucharistic offering witness',url:'https://www.newadvent.org/fathers/0714.htm'},
  {label:'Justin Martyr, Dialogue with Trypho 117',note:'Eucharistic sacrifice witness',url:'https://www.newadvent.org/fathers/01286.htm'}]
 };
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function apply(){if(!Array.isArray(topics))return;document.querySelectorAll('.topicrow').forEach(row=>{const t=topics[Number(row.dataset.i)],chain=row.querySelector('.apologetics-chain');if(!t||!chain||chain.dataset.citationDepth==='true'||!citations[t.topic])return;const items=citations[t.topic].map(c=>`<a href="${c.url}" target="_blank" rel="noopener"><b>${esc(c.label)}</b><small>${esc(c.note)} ↗</small></a>`).join('');chain.querySelector('.chain-grid')?.insertAdjacentHTML('beforeend',`<div class="chain-stage chain-citations"><span>Precise patristic citations</span><div>${items}</div></div>`);chain.dataset.citationDepth='true'});}
 document.addEventListener('DOMContentLoaded',()=>{const grid=document.querySelector('#topicGrid');if(!grid)return;new MutationObserver(apply).observe(grid,{childList:true,subtree:true});apply()});
})();
