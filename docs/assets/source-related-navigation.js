(()=>{'use strict';
function addLinks(){if(!Array.isArray(SL))return;document.querySelectorAll('.source-lib-card').forEach(card=>{if(card.querySelector('.source-evidence-link'))return;const id=card.id.replace(/^source-/,'');const source=SL.find(x=>x.id===id);if(!source)return;const term=source.author||source.work;const actions=card.querySelector('.actions');if(actions)actions.insertAdjacentHTML('beforeend',`<a class="button secondary mini source-evidence-link" href="./?section=evidence-search&evidence=${encodeURIComponent(term)}#evidence-search">Related evidence →</a>`)});}
document.addEventListener('DOMContentLoaded',()=>{const host=document.querySelector('#slResults');if(!host)return;new MutationObserver(addLinks).observe(host,{childList:true,subtree:true});addLinks()});
})();
