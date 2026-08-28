"use strict";
(() => {
const $=id=>document.getElementById(id);
const FACTOR={def:1,sure:.72,maybe:.38};
const CATS=[
 {id:"huntSpeed",label:"👣 Hunt speed",items:[
  ["rev","Slow searching → suddenly much faster than your sprint"],
  ["deo","Rushes in fast → slower than your walk when close"],
  ["hantu","Footstep pace changes a lot between cold/warm rooms"],
  ["raiju","Near electronics, footsteps become clearly faster than running pace"],
  ["jinn","Breaker on + far LOS: sudden speed burst, slows when close"],
  ["moroi","Footsteps get noticeably faster as sanity gets lower"],
  ["thaye","Very fast early; much slower later in the contract"],
  ["dayan","Nearby player moving = faster; standing still = slower"],
  ["aswang","Footstep pace ramps up unusually quickly in LOS"],
  ["twins","Different hunts had clearly different normal footstep pace"],
  ["deilde","Each hunt got much slower after many unique interactions"],
  ["gallu","Speed/state changed after salt, incense, or crucifix"],
  ["obambo","Clear calm/aggressive speed-state change"]]},
 {id:"huntLook",label:"👻 Hunt appearance",items:[
  ["obake","Shapeshifted into another ghost model"],
  ["phantom","Invisible for unusually long gaps between blinks"],
  ["oni","Very visible during blinks"]]},
 {id:"huntDetect",label:"📡 Hunt detection",items:[
  ["myling","Electronics reacted before footsteps were clearly audible"],
  ["kormos","Detected movement at strange distances / seemed nearly blind"],
  ["yokai","Poor voice/electronics detection from farther away"],
  ["raiju","Electronics clearly changed its hunt behavior"]]},
 {id:"interact",label:"🖐️ Interactions",items:[
  ["polty","Threw several objects at once"],
  ["wraith","Crossed salt without disturbing it"],
  ["yurei","Fully slammed a door shut outside an event"],
  ["mare","Turned a light off immediately after we turned it on"],
  ["shade","Very inactive while players were nearby"]]},
 {id:"special",label:"🧪 Special test",items:[
  ["banshee","Banshee scream on parabolic mic"],
  ["onryo","Firelight / third-flame behavior"],
  ["goryo","DOTS only seen through camera with nobody nearby"],
  ["spirit","Could not hunt for about 3 minutes after incense"],
  ["demon","Hunted again unusually soon after incense"],
  ["mimic","Orbs plus behavior/evidence that did not fit one normal ghost"]]}
];
const style=document.createElement("style");style.textContent=`.v13cats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.v13cats button,.v13items button{margin:0;min-height:52px;text-align:left;padding:11px;font-size:14px}.v13items{display:grid;gap:7px;margin:12px 0}.v13back{width:auto!important;min-height:40px!important;padding:8px 11px!important;font-size:13px!important}.v13toast{position:fixed;left:50%;bottom:105px;transform:translateX(-50%);z-index:200;background:#1b2b20;border:1px solid #4b8a5c;color:#e1ffe8;border-radius:999px;padding:9px 14px;font-size:12px;font-weight:800;box-shadow:0 8px 30px rgba(0,0,0,.35);white-space:nowrap}`;document.head.appendChild(style);
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function open(html){const ov=$("v8ov"),c=$("v8content");if(!ov||!c)return;c.innerHTML=html;ov.classList.remove("hidden8");}
function close(){const ov=$("v8ov"),c=$("v8content");if(ov)ov.classList.add("hidden8");if(c)c.innerHTML="";}
function toast(msg){document.querySelector(".v13toast")?.remove();const t=document.createElement("div");t.className="v13toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1500);}
function ensure(){if(!state.v8)state.v8={};state.v8.deferredTests=state.v8.deferredTests||[];state.v8.tellLog=state.v8.tellLog||[];return state.v8;}
function record(q,cert){const f=FACTOR[cert]||1;state.history.push({scores:{...state.scores},asked:[...state.asked],answered:state.answered,current:state.current,huntMode:state.huntMode||false,kind:"yes",qid:q.id,certainty:cert});for(const [g,v] of Object.entries(q.yes||{}))state.scores[g]=(state.scores[g]||0)+v*f;state.answered++;if(!state.asked.includes(q.id))state.asked.push(q.id);state.current=null;if(q.targets?.length===1&&q.tier!=="soft")ensure().tellLog.push({ghost:q.targets[0],qid:q.id,factor:f,source:"observe-v13",at:Date.now(),historyLen:state.history.length});save();try{render();}catch(e){}close();toast("Observation recorded");}
function certainty(q){open(`<div class="v8head"><div><div class="pill">Observation</div><h2>${esc(shortLabel(q.id))}</h2></div><button id="v13Cancel" class="secondary v13back">Cancel</button></div><p class="muted">How sure are you?</p><button data-v13cert="def">Definitely</button><button data-v13cert="sure" class="secondary">Pretty sure</button><button data-v13cert="maybe" class="secondary">Maybe</button>`);$("v13Cancel").onclick=close;document.querySelectorAll("[data-v13cert]").forEach(b=>b.onclick=()=>record(q,b.dataset.v13cert));}
function shortLabel(id){for(const c of CATS){const x=c.items.find(i=>i[0]===id);if(x)return x[1];}return Q.find(q=>q.id===id)?.q||id;}
function category(id){const c=CATS.find(x=>x.id===id);if(!c)return observeHome();const items=c.items.filter(([qid])=>Q.some(q=>q.id===qid)&&!state.asked.includes(qid));open(`<div class="v8head"><div><div class="pill">👻 Observe</div><h2>${esc(c.label.replace(/^\S+\s/,""))}</h2></div><button id="v13Back" class="secondary v13back">Back</button></div><p class="small muted">Tap the closest match. Short labels only so you can log it while playing.</p><div class="v13items">${items.length?items.map(([id,l])=>`<button class="secondary" data-v13obs="${id}">${esc(l)}</button>`).join(""):'<div class="v11impact">Nothing unlogged in this category.</div>'}</div>`);$("v13Back").onclick=observeHome;document.querySelectorAll("[data-v13obs]").forEach(b=>b.onclick=()=>{const q=Q.find(x=>x.id===b.dataset.v13obs);if(!q)return;if(q.tier==="soft")record(q,"def");else certainty(q);});}
function observeHome(){open(`<div class="v8head"><div><div class="pill">👻 Observe</div><h2>What did you notice?</h2></div><button id="v13Close" class="secondary v13back">Close</button></div><p class="small muted">Pick a category first.</p><div class="v13cats">${CATS.map(c=>`<button class="secondary" data-v13cat="${c.id}">${c.label}</button>`).join("")}</div>`);$("v13Close").onclick=close;document.querySelectorAll("[data-v13cat]").forEach(b=>b.onclick=()=>category(b.dataset.v13cat));}
function replaceObserve(){const old=$("v8Observe");if(!old||old.dataset.v13)return;const n=old.cloneNode(true);n.dataset.v13="1";old.replaceWith(n);n.onclick=observeHome;}
// Fix every current/future Cannot Test Now button, including older confirmation screens.
document.addEventListener("click",e=>{const b=e.target.closest?.("button");if(!b)return;const txt=(b.textContent||"").trim().toLowerCase();if(!(b.id==="cfLater"||txt.includes("cannot test now")))return;e.preventDefault();e.stopImmediatePropagation();const v=ensure();const top=typeof ranked==="function"?ranked()[0]?.[0]:null;if(top&&!v.deferredTests.includes(top))v.deferredTests.push(top);save();const overlay=$("v8ov");if(overlay&&!overlay.classList.contains("hidden8"))close();["confirm","confirm2"].forEach(id=>$(id)?.classList.add("hidden"));$("quiz")?.classList.remove("hidden");$("topbar")?.classList.remove("hidden");try{if(!state.current||state.asked.includes(state.current))state.current=chooseNext()?.id||null;render();}catch(err){}toast("Test deferred — continuing investigation");},true);
// Replace hard-to-judge numeric speed language at runtime with practical relative cues.
const wording={
 rev:["Was it very slow while searching, then suddenly much faster than a player's sprint after detecting someone?","Listen for a dramatic footstep jump: slow searching pace → clearly faster than running pace."],
 deo:["Did it rush toward a player from far away, then become slower than normal walking pace when very close?","Deogen closes distance quickly, then its footsteps slow to a crawl near the target."],
 raiju:["Near active electronics, did its footsteps jump to clearly faster than player running pace, then slow again after leaving the electronics?","Compare footstep rhythm near active electronics versus farther away."],
 jinn:["With the breaker ON, did it suddenly become much faster than player running pace while seeing someone from far away, then slow again when close?","Use the obvious change in footstep rhythm rather than estimating an exact speed."],
 aswang:["Did it start slightly slow, then accelerate in line of sight noticeably faster than a normal ghost?","Listen for how quickly the footstep rhythm ramps up while it can see someone."],
 twins:["Across hunts, did you hear two clearly different normal footstep speeds?","Compare the basic footstep rhythm across separate hunts before line-of-sight acceleration."],
 obambo:["Across hunts, did it show a clear calm/aggressive speed-state change or an obviously shorter aggressive hunt?","Look for a clear state change; do not try to judge tiny speed differences."]
};for(const [id,[q,h]] of Object.entries(wording)){const x=Q.find(z=>z.id===id);if(x){x.q=q;x.hint=h;}}
replaceObserve();
setTimeout(replaceObserve,300);
})();