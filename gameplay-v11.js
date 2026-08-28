"use strict";
(() => {
const $=id=>document.getElementById(id);
const DIFF={Professional:3,Nightmare:2,Insanity:1,Custom:3};
const REQ={jinn:"breaker",banshee:"para",onryo:"firelight",wraith:"salt",spirit:"incense",demon:"incense",goryo:"video"};
const NO_LOS=new Set(["Revenant","Hantu","Deogen","Thaye","Deildegast","Kormos"]);
const FACTOR={def:1,sure:.72,maybe:.38};
const NATURAL_ORDER=["polty","mare","yurei","shade","yokai","banshee"];
const DELIBERATE_ORDER=["wraith","onryo","goryo","spirit","demon","mimic"];
const HUNT_ORDER=["rev","deo","hantu","raiju","jinn","moroi","thaye","dayan","aswang","kormos","deilde","twins","obake","phantom","oni","myling","gallu","obambo"];

const css=document.createElement("style");css.textContent=`
.v11selected{background:#1e5b3a!important;color:#e7fff0!important;border:2px solid #65c987!important;box-shadow:0 0 0 2px rgba(101,201,135,.14) inset}.v11selected::before{content:"✓ ";font-weight:900}.v11hint{background:#0f1712;border:1px solid #2f6743;border-radius:12px;padding:10px;margin:8px 0 14px;color:#c8f4d6;font-size:13px;line-height:1.4}.v11summary{display:grid;gap:8px;margin:12px 0}.v11sumrow{background:#10151d;border:1px solid #293140;border-radius:12px;padding:11px;line-height:1.4}.v11impact{background:#171d26;border-left:3px solid #c7d2fe;border-radius:10px;padding:11px;margin:9px 0;font-size:13px;line-height:1.45}.v11setupGrid{display:grid;gap:8px;margin:12px 0}.v11setupRow{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;background:#10151d;border:1px solid #293140;border-radius:12px;padding:11px}.v11setupRow select{font-size:15px;padding:8px;background:#202733;color:#fff;border:1px solid #394659;border-radius:8px}.v11equip{min-height:40px!important;width:auto!important;margin:0!important;padding:8px 11px!important;font-size:13px!important}.v11stage{display:inline-block;font-size:11px;background:#252d39;color:#aeb8c8;border-radius:999px;padding:5px 8px;margin-bottom:6px}`;document.head.appendChild(css);

function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function open(html){const ov=$("v8ov"),c=$("v8content");if(!ov||!c)return;c.innerHTML=html;ov.classList.remove("hidden8");}
function close(){const ov=$("v8ov"),c=$("v8content");if(ov)ov.classList.add("hidden8");if(c)c.innerHTML="";}
function ensureV8(){if(!state.v8)state.v8={difficulty:"Professional",customEvidence:3,evidence:{EMF:0,UV:0,Writing:0,Freezing:0,SpiritBox:0,DOTS:0,Orbs:0},setup:{breaker:"unknown",salt:true,incense:true,para:true,firelight:true,video:true,recentHunt:false},ruledOut:[],applied:{},tellLog:[],smudgeStart:null,hunts:[],autoStoppedGhost:null};state.v8.setup=Object.assign({breaker:"unknown",salt:true,incense:true,para:true,firelight:true,video:true,recentHunt:false},state.v8.setup||{});state.v8.hunts=state.v8.hunts||[];return state.v8;}
function available(q){const v=state.v8;if(!v)return true;const r=REQ[q.id];if(r==="breaker")return v.setup.breaker==="on";if(r)return v.setup[r]!==false;return true;}

// Gameplay-stage adaptive ordering: natural observations first, deliberate tests later, hunts only after one has been logged.
chooseNext=function(){const pool=Q.filter(q=>!state.asked.includes(q.id)&&available(q));if(!pool.length)return null;const v=state.v8;const recent=!!v?.setup?.recentHunt;const score=q=>{
 let stage=0;
 const ni=NATURAL_ORDER.indexOf(q.id),di=DELIBERATE_ORDER.indexOf(q.id),hi=HUNT_ORDER.indexOf(q.id);
 if(ni>=0)stage=500-ni*8;
 else if(q.cat==="evidence")stage=410;
 else if(di>=0)stage=recent?280-di*6:330-di*6;
 else if(hi>=0)stage=recent?430-hi*5:40-hi*2;
 else stage=220;
 // Once suspects narrow, allow high-value targeted questions to jump forward without making the opening feel random.
 const top=ranked().slice(0,3).map(x=>x[0]);if(q.targets?.some(g=>top.includes(g))&&state.answered>=3)stage+=70;
 try{stage+=Math.min(90,questionUtility(q)*.08);}catch(e){}
 return stage;
};return pool.sort((a,b)=>score(b)-score(a))[0];};

function contractSetup(){
 const draft={difficulty:"Professional",customEvidence:3,breaker:"unknown",salt:true,incense:true,para:true,firelight:true,video:true};
 open(`<div class="v8head"><div><div class="pill">⚙️ Contract Setup</div><h2>Set the game first</h2></div><button id="setupCancel" class="secondary">Cancel</button></div><p class="muted">This only asks for settings that change identification logic or which tests the app can suggest.</p><div class="v11setupGrid"><div class="v11setupRow"><div><b>Difficulty</b><div class="quality">Controls how many evidence types can be hidden.</div></div><select id="setupDiff"><option>Professional</option><option>Nightmare</option><option>Insanity</option><option>Custom</option></select></div><div id="customEvidenceWrap" class="v11setupRow hidden8"><div><b>Real evidence count</b><div class="quality">Use your Custom difficulty setting.</div></div><select id="setupCustom"><option>0</option><option>1</option><option>2</option><option selected>3</option></select></div><div class="v11setupRow"><div><b>Breaker at start</b><div class="quality">Jinn testing requires it to be ON.</div></div><select id="setupBreaker"><option value="unknown">Unknown</option><option value="on">On</option><option value="off">Off</option><option value="broken">Broken</option></select></div>${[["salt","Salt"],["incense","Incense"],["para","Parabolic mic"],["firelight","Firelight"],["video","Video / DOTS setup"]].map(([k,l])=>`<div class="v11setupRow"><div><b>${l}</b></div><button class="v11equip found" data-equip="${k}">Available</button></div>`).join("")}</div><div class="v11impact">You can change these later from <b>🧪 Evidence → Setup</b>. An unavailable item never rules out a ghost—it only prevents the app from suggesting that test.</div><button id="beginContract">Begin Investigation</button>`);
 $("setupCancel").onclick=close;
 $("setupDiff").onchange=e=>{$("customEvidenceWrap").classList.toggle("hidden8",e.target.value!=="Custom");};
 document.querySelectorAll("[data-equip]").forEach(b=>b.onclick=()=>{const k=b.dataset.equip;draft[k]=!draft[k];b.classList.toggle("found",draft[k]);b.classList.toggle("notfound",!draft[k]);b.textContent=draft[k]?"Available":"Not available";});
 $("beginContract").onclick=()=>{draft.difficulty=$("setupDiff").value;draft.customEvidence=Number($("setupCustom").value);draft.breaker=$("setupBreaker").value;close();startNew();const v=ensureV8();v.difficulty=draft.difficulty;v.customEvidence=draft.difficulty==="Custom"?draft.customEvidence:DIFF[draft.difficulty];v.setup.breaker=draft.breaker;["salt","incense","para","firelight","video"].forEach(k=>v.setup[k]=draft[k]);v.setup.recentHunt=false;state.current=chooseNext()?.id||null;save();$("v8bar")?.classList.remove("hidden8");render();};
}

function replaceStartButtons(){
 ["start","restart"].forEach(id=>{const old=$(id);if(!old||old.dataset.v11)return;const n=old.cloneNode(true);n.dataset.v11="1";old.replaceWith(n);n.onclick=contractSetup;});
}

let hs={start:0,tick:null,draft:{speed:"",los:"",blink:"",detect:"",certainty:"def",useSmudge:true}};
const HOPTS={speed:[["slow","Slow"],["normal","Normal"],["fast","Fast"],["changed","Changed / switched states"]],los:[["yes","Sped up in LOS"],["no","Did not speed up"],["unsure","Unsure"]],blink:[["normal","Normal"],["visible","Very visible"],["invisible","Very invisible"],["shape","Shapeshift"]],detect:[["normal","Normal"],["strange","Strange / unusual range"]]};
function group(field,title){return `<h3>${title}</h3><div class="seg">${HOPTS[field].map(([v,l])=>`<button data-v11field="${field}" data-v11val="${v}">${l}</button>`).join("")}</div>`;}
function huntScreen(){hs.start=Date.now();hs.draft={speed:"",los:"",blink:"",detect:"",certainty:"def",useSmudge:true};$("v8bar")?.classList.add("hidden8");open(`<div class="pill">🔴 HUNT ACTIVE</div><div id="huntClock11" class="huntClock">0:00</div><div class="v11hint"><b>Tap one option in each row if you noticed it.</b><br>Selected answers turn green and display a ✓. Leave a row blank if you did not notice it.</div><div class="huntOpts">${group("speed","SPEED")}${group("los","LINE OF SIGHT")}${group("blink","BLINKING")}${group("detect","DETECTION")}<h3>CONFIDENCE</h3><div class="seg"><button data-v11field="certainty" data-v11val="def" class="v11selected">Definitely</button><button data-v11field="certainty" data-v11val="sure">Pretty sure</button><button data-v11field="certainty" data-v11val="maybe">Maybe</button></div></div><button id="endHunt11" class="v8hunt">END HUNT & REVIEW</button>`);
 bindHunt();hs.tick=setInterval(()=>{if($("huntClock11"))$("huntClock11").textContent=fmt((Date.now()-hs.start)/1000)},250);
}
function bindHunt(){document.querySelectorAll("[data-v11field]").forEach(b=>b.onclick=()=>{const f=b.dataset.v11field;hs.draft[f]=b.dataset.v11val;document.querySelectorAll(`[data-v11field="${f}"]`).forEach(x=>x.classList.toggle("v11selected",x===b));});$("endHunt11").onclick=endHuntReview;}
function fmt(s){s=Math.max(0,Math.floor(s));return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;}
function add(m,g,x){m[g]=(m[g]||0)+x;}
function applyHuntScoring(draft,dur){const m={};const f=FACTOR[draft.certainty]||1;
 if(draft.speed==="slow"){add(m,"Revenant",5);add(m,"Hantu",3);add(m,"Thaye",3);}if(draft.speed==="fast"){add(m,"Raiju",3);add(m,"Moroi",3);add(m,"Thaye",3);}if(draft.speed==="changed"){add(m,"Obambo",12);add(m,"Gallu",7);add(m,"Revenant",4);add(m,"Deogen",4);}if(draft.los==="yes")for(const g of NO_LOS)add(m,g,-8);if(draft.los==="no")for(const g of NO_LOS)add(m,g,4);if(draft.blink==="visible"){add(m,"Oni",16);add(m,"The Mimic",3);}if(draft.blink==="invisible"){add(m,"Phantom",16);add(m,"The Mimic",3);}if(draft.blink==="shape"){add(m,"Obake",29);add(m,"The Mimic",4);}if(draft.detect==="strange"){add(m,"Kormos",10);add(m,"Yokai",4);add(m,"Myling",3);}for(const [g,x] of Object.entries(m))state.scores[g]=(state.scores[g]||0)+x*f;const v=ensureV8();v.hunts.push({duration:dur,draft:{...draft},at:Date.now()});v.setup.recentHunt=true;state.answered++;return m;}
function labels(d){const out=[];for(const f of ["speed","los","blink","detect"]){const val=d[f];if(!val)continue;const lab=HOPTS[f].find(x=>x[0]===val)?.[1];if(lab)out.push(lab);}return out;}
function impacts(d){const x=[];if(d.los==="yes")x.push("Normal LOS acceleration makes Hantu, Thaye, Deogen, Kormos and Deildegast less likely.");if(d.los==="no")x.push("No LOS acceleration keeps no-LOS ghosts such as Hantu and Thaye more plausible.");if(d.blink==="visible")x.push("Very visible blinking strongly supports Oni.");if(d.blink==="invisible")x.push("Long invisible periods strongly support Phantom.");if(d.blink==="shape")x.push("A hunt-model shapeshift is a very strong Obake tell; keep Mimic in mind until evidence agrees.");if(d.detect==="strange")x.push("Unusual detection raises Kormos most strongly, with Yokai/Myling still worth checking.");if(d.speed==="changed")x.push("A changing/state-based speed pattern raises Obambo and Gallu; compare another hunt before committing.");if(!x.length)x.push("No highly distinctive hunt tell was recorded. The hunt still establishes context, but broad evidence and natural behaviors should carry more weight.");return x;}
function endHuntReview(){clearInterval(hs.tick);const dur=(Date.now()-hs.start)/1000;const before=ranked().slice(0,3).map(x=>x[0]);const m=applyHuntScoring(hs.draft,dur);save();const after=ranked().slice(0,3);const obs=labels(hs.draft);open(`<div class="pill">✓ Hunt recorded</div><h2>Hunt #${ensureV8().hunts.length} Summary</h2><div class="huntClock">${fmt(dur)}</div><div class="v11summary"><div class="v11sumrow"><b>Observed</b><br>${obs.length?obs.map(x=>`✓ ${esc(x)}`).join("<br>"):"No specific hunt traits selected."}</div>${impacts(hs.draft).map(x=>`<div class="v11impact">${esc(x)}</div>`).join("")}<div class="v11sumrow"><b>Leading suspects after this hunt</b><br>${after.map(([g],i)=>`${i+1}. ${esc(g)}`).join("<br>")}</div></div><button id="applyHunt11">Apply & Continue</button><button id="editHunt11" class="secondary">Discard This Hunt</button>`);$("applyHunt11").onclick=()=>{close();$("v8bar")?.classList.remove("hidden8");state.current=chooseNext()?.id||null;save();$("quiz")?.classList.remove("hidden");render();};$("editHunt11").onclick=()=>{for(const [g,x] of Object.entries(m))state.scores[g]=(state.scores[g]||0)-x*(FACTOR[hs.draft.certainty]||1);const v=ensureV8();v.hunts.pop();v.setup.recentHunt=v.hunts.length>0;state.answered=Math.max(0,state.answered-1);save();close();$("v8bar")?.classList.remove("hidden8");render();};}

function replaceHuntButton(){const old=$("v8Hunt");if(!old||old.dataset.v11)return;const n=old.cloneNode(true);n.dataset.v11="1";old.replaceWith(n);n.onclick=huntScreen;}

function addStageLabel(){const q=$("question");if(!q||$("stageLabel11"))return;const s=document.createElement("div");s.id="stageLabel11";s.className="v11stage";s.textContent="Gameplay-priority question";q.insertAdjacentElement("beforebegin",s);}

replaceStartButtons();replaceHuntButton();addStageLabel();
})();