"use strict";
(() => {
const EV={"Spirit":["EMF","SpiritBox","Writing"],"Wraith":["EMF","SpiritBox","DOTS"],"Phantom":["SpiritBox","UV","DOTS"],"Poltergeist":["SpiritBox","UV","Writing"],"Banshee":["UV","Orbs","DOTS"],"Jinn":["EMF","UV","Freezing"],"Mare":["SpiritBox","Orbs","Writing"],"Revenant":["Orbs","Writing","Freezing"],"Shade":["EMF","Writing","Freezing"],"Demon":["UV","Writing","Freezing"],"Yurei":["Orbs","Freezing","DOTS"],"Oni":["EMF","Freezing","DOTS"],"Yokai":["SpiritBox","Orbs","DOTS"],"Hantu":["UV","Orbs","Freezing"],"Goryo":["EMF","UV","DOTS"],"Myling":["EMF","UV","Writing"],"Onryo":["SpiritBox","Orbs","Freezing"],"The Twins":["EMF","SpiritBox","Freezing"],"Raiju":["EMF","Orbs","DOTS"],"Obake":["EMF","UV","Orbs"],"The Mimic":["SpiritBox","UV","Freezing"],"Moroi":["SpiritBox","Writing","Freezing"],"Deogen":["SpiritBox","Writing","DOTS"],"Thaye":["Orbs","Writing","DOTS"],"Dayan":["SpiritBox","EMF","Orbs"],"Gallu":["SpiritBox","EMF","UV"],"Obambo":["DOTS","UV","Writing"],"Kormos":["Orbs","SpiritBox","UV"],"Aswang":["DOTS","Freezing","Writing"],"Deildegast":["EMF","Writing","DOTS"]};
const DIFF={Professional:3,Nightmare:2,Insanity:1};
const REQ={jinn:"breaker",banshee:"para",onryo:"firelight",wraith:"salt",spirit:"incense",demon:"incense",goryo:"video"};
const NATURAL=["polty","mare","yurei","shade","yokai","banshee"];
const DELIBERATE=["wraith","onryo","goryo","spirit","demon","mimic"];
const HUNT=["rev","deo","hantu","raiju","jinn","moroi","thaye","dayan","aswang","kormos","deilde","twins","obake","phantom","oni","myling","gallu","obambo"];
function v(){return state?.v8||null;}
function evidenceCount(){const x=v();if(!x)return 3;if(x.difficulty==="Custom")return Math.max(0,Math.min(3,Number(x.customEvidence??3)));return DIFF[x.difficulty]??3;}
function found(){return Object.entries(v()?.evidence||{}).filter(([,s])=>s===1).map(([e])=>e);}
function negative(){return Object.entries(v()?.evidence||{}).filter(([,s])=>s===-1).map(([e])=>e);}
function ruled(g){const r=v()?.ruledOut;return Array.isArray(r)?r.includes(g):!!r?.[g];}
function foundCompatible(g,e){return EV[g]?.includes(e)||(g==="The Mimic"&&e==="Orbs");}
function possible(g){if(ruled(g))return false;const f=found();if(!f.every(e=>foundCompatible(g,e)))return false;const hidden=3-evidenceCount();const missingRequired=negative().filter(e=>EV[g]?.includes(e)).length;return missingRequired<=hidden;}
function possibleGhosts(){return ghosts.filter(possible);}
function available(q){const x=v();if(!x)return true;const r=REQ[q.id];if(r==="breaker")return x.setup?.breaker==="on";if(r)return x.setup?.[r]!==false;return true;}
function relevant(q){if(!q.targets?.length)return true;return q.targets.some(possible);}
function score(q){let stage=0;const ni=NATURAL.indexOf(q.id),di=DELIBERATE.indexOf(q.id),hi=HUNT.indexOf(q.id),recent=!!v()?.setup?.recentHunt;if(ni>=0)stage=500-ni*8;else if(q.cat==="evidence")stage=410;else if(di>=0)stage=recent?280-di*6:330-di*6;else if(hi>=0)stage=recent?430-hi*5:40-hi*2;else stage=220;const poss=new Set(possibleGhosts()),top=ranked().filter(([g])=>poss.has(g)).slice(0,3).map(x=>x[0]);if(q.targets?.some(g=>top.includes(g))&&state.answered>=3)stage+=70;try{stage+=Math.min(90,questionUtility(q)*.08);}catch(e){}return stage;}
function choose(){const pool=Q.filter(q=>!state.asked.includes(q.id)&&available(q)&&relevant(q));if(!pool.length)return null;return pool.sort((a,b)=>score(b)-score(a))[0];}
chooseNext=choose;
function currentRelevant(){const q=Q.find(x=>x.id===state?.current);return !q||relevant(q);}
function reconcile(){if(!state?.started)return;if(!currentRelevant()){state.current=choose()?.id||null;try{save();render();}catch(e){}}}
const oldRender=window.render;try{window.render=function(...args){if(state?.started&&!currentRelevant())state.current=choose()?.id||null;return oldRender?.apply(this,args);};}catch(e){}
document.addEventListener("click",e=>{if(e.target.closest?.("[data-ev],.v8ev,.eviState,#v8Evidence,[data-ghost]"))setTimeout(reconcile,40);},true);
window.addEventListener("pageshow",()=>setTimeout(reconcile,0));
window.__ghostEvidenceFilterV19={possible,possibleGhosts,reconcile};
})();