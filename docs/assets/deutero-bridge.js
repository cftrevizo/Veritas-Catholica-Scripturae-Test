(()=>{'use strict';
function focusInPageLink(){const targets={'#deutero':'deutero','#evidence-search':'evidence-search'};const section=document.getElementById(targets[location.hash]||'');if(!section)return;requestAnimationFrame(()=>section.scrollIntoView({behavior:'auto',block:'start'}))}
window.addEventListener('hashchange',focusInPageLink);
})();
