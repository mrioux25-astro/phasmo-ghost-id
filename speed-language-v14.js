"use strict";
(() => {
const $=id=>document.getElementById(id);
const REPLACEMENTS=[
 [/~?\s*1\.0\s*m\/s/gi,"much slower than player walking pace"],
 [/~?\s*3\.0\s*m\/s/gi,"near or above player sprinting pace"],
 [/~?\s*0\.4\s*m\/s/gi,"a crawling pace, far slower than walking"],
 [/~?\s*2\.5\s*m\/s/gi,"clearly faster than walking, but not a full sprint"],
 [/~?\s*2\.25\s*m\/s/gi,"between player walking and sprinting pace"],
 [/~?\s*1\.2\s*m\/s/gi,"noticeably slower than player walking pace"],
 [/~?\s*1\.53\s*m\/s/gi,"slightly slower than player walking pace"],
 [/~?\s*1\.7\s*m\/s/gi,"about player walking pace"],
 [/~?\s*1\.96\s*m\/s/gi,"a little faster than player walking pace"],
 [/~?\s*1\.45\s*m\/s/gi,"a little slower than player walking pace"],
 [/\b\d+(?:\.\d+)?\s*m\/s\b/gi,"a distinct footstep pace"]
];
function humanize(s){let out=String(s);for(const [re,r] of REPLACEMENTS)out=out.replace(re,r);return out;}

// Rewrite the actual question database so any flow using Q gets qualitative speed wording.
const wording={
 rev:{q:"Was it much slower than player walking pace while searching, then suddenly near or above sprinting pace after detecting someone?",hint:"Listen for a dramatic footstep change: very slow searching → suddenly extremely fast after detection."},
 deo:{q:"Did it rush in near sprinting pace from far away, then slow to a crawl when very close?",hint:"A Deogen closes distance quickly, then becomes dramatically slower than player walking pace near its target."},
 raiju:{q:"Near active electronics, did the footstep rhythm jump clearly above walking pace, then slow again outside that area?",hint:"Compare the ghost's footstep rhythm near active electronics with its rhythm farther away. Look for an obvious change, not a precise speed."},
 jinn:{q:"With the breaker ON, did it get an obvious distance speed burst while seeing a player, then slow again when it got close?",hint:"Listen for a clear distance-based burst. Do not try to estimate an exact speed."},
 dayan:{q:"When a player was nearby, did the ghost move faster while that player was walking and slower while they stood still?",hint:"Use the change in footstep rhythm caused by nearby player movement rather than trying to judge a number."},
 aswang:{q:"Did it start around or slightly below normal walking-like ghost pace, then ramp its footsteps up unusually quickly in line of sight?",hint:"The useful tell is how quickly the footstep rhythm accelerates in LOS, not the exact starting speed."}
};
try{for(const [id,v] of Object.entries(wording)){const q=Q.find(x=>x.id===id);if(q){q.q=v.q;q.hint=v.hint;}}}catch(e){}

// Rewrite the legacy Hunt Quick Entry labels that were still showing exact speeds.
try{
 const labels={
  raiju:"Near active electronics: clear jump to faster-than-walking footstep pace",
  jinn:"Breaker ON + distant LOS: obvious speed burst, slows again when close",
  aswang:"Starts slightly slow, then footstep rhythm accelerates unusually fast in LOS",
  dayan:"Nearby player: faster while walking, slower while standing still",
  rev:"Very slow searching → suddenly near sprinting pace after detection",
  deo:"Rushes in fast → crawls when very close"
 };
 for(const g of HUNT_GROUPS||[])for(const o of g.options||[])if(labels[o.qid])o.label=labels[o.qid];
}catch(e){}

// If the older Log a Hunt button is used, keep the same data path but ensure all rendered text is qualitative.
function scrub(root=document.body){
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode())nodes.push(w.currentNode);
 for(const n of nodes){const t=humanize(n.nodeValue);if(t!==n.nodeValue)n.nodeValue=t;}
}
scrub();
const mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType===Node.TEXT_NODE){n.nodeValue=humanize(n.nodeValue);}else if(n.nodeType===Node.ELEMENT_NODE)scrub(n);}});mo.observe(document.body,{childList:true,subtree:true,characterData:true});

// Clarify the old hunt page itself so the intended comparison is obvious.
document.addEventListener("click",e=>{
 const b=e.target.closest?.("#huntToggle");if(!b)return;
 setTimeout(()=>{
  const h=$("huntQuick");if(!h||h.classList.contains("hidden"))return;
  const intro=h.querySelector(".huntIntro .small");if(intro)intro.textContent="Tap only clear differences you can hear or see. Compare footsteps to player walking/running pace; do not estimate exact ghost speed.";
  scrub(h);
 },0);
},true);

// Compatibility layer only: do not overwrite the current app version badge/build marker.
})();