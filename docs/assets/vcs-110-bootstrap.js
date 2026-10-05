(()=>{'use strict';
 function init(){
  document.querySelectorAll('nav').forEach(nav=>{if([...nav.querySelectorAll('a')].some(a=>a.getAttribute('href')==='community-review.html'))return;const link=document.createElement('a');link.href='community-review.html';link.textContent='Community Review';const library=[...nav.querySelectorAll('a')].find(a=>a.textContent.trim()==='Source Library');library?.insertAdjacentElement('afterend',link)});
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let textNode;while(textNode=walker.nextNode()){textNode.nodeValue=textNode.nodeValue.replaceAll('Website Edition 1.9.0','Website Edition 1.10.0 C1').replaceAll('Edition 1.9.0','Edition 1.10.0 C1')}
  if(location.pathname.endsWith('/sources.html'))addSourcesReadiness();
 }
 function addSourcesReadiness(){
  const host=document.querySelector('.resource-main');if(!host||document.getElementById('c1Readiness'))return;
  const section=document.createElement('section');section.id='c1Readiness';section.className='resource-section';section.innerHTML='<p class="eyebrow">1.10 C1 test scope</p><h2>New review and study foundations</h2><p><b>Catechism Essentials</b> provides twelve guided orientation modules with official Catechism entry points; exact paragraph-level mapping remains under editorial review.</p><p><b>Community Relationship Review</b> exposes 673 inherited dataset candidates as a read-only catalog. It preserves a source-dataset label but does not claim direct quotation, literary dependence, peer review, doctrine, or a verified theological conclusion.</p><p><b>Timeline source cues</b> surface only candidate links ready for contextual use and identify remaining source gaps rather than silently filling them.</p><div class="actions"><a class="button secondary" href="community-review.html">Open Community Review</a><a class="button secondary" href="topics.html">Open Study Topics</a></div>';
  host.insertBefore(section,host.firstElementChild);
 }
 document.addEventListener('DOMContentLoaded',init);
})();
