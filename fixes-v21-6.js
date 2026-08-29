"use strict";
(() => {
  const $=id=>document.getElementById(id);
  const GHOST_EVIDENCE={
    "Spirit":["EMF","SpiritBox","Writing"],"Wraith":["EMF","SpiritBox","DOTS"],"Phantom":["SpiritBox","UV","DOTS"],"Poltergeist":["SpiritBox","UV","Writing"],"Banshee":["UV","Orbs","DOTS"],"Jinn":["EMF","UV","Freezing"],"Mare":["SpiritBox","Orbs","Writing"],"Revenant":["Orbs","Writing","Freezing"],"Shade":["EMF","Writing","Freezing"],"Demon":["UV","Writing","Freezing"],"Yurei":["Orbs","Freezing","DOTS"],"Oni":["EMF","Freezing","DOTS"],"Yokai":["SpiritBox","Orbs","DOTS"],"Hantu":["UV","Orbs","Freezing"],"Goryo":["EMF","UV","DOTS"],"Myling":["EMF","UV","Writing"],"Onryo":["SpiritBox","Orbs","Freezing"],"The Twins":["EMF","SpiritBox","Freezing"],"Raiju":["EMF","Orbs","DOTS"],"Obake":["EMF","UV","Orbs"],"The Mimic":["SpiritBox","UV","Freezing"],"Moroi":["SpiritBox","Writing","Freezing"],"Deogen":["SpiritBox","Writing","DOTS"],"Thaye":["Orbs","Writing","DOTS"],"Dayan":["SpiritBox","EMF","Orbs"],"Gallu":["SpiritBox","EMF","UV"],"Obambo":["DOTS","UV","Writing"],"Kormos":["Orbs","SpiritBox","UV"],"Aswang":["DOTS","Freezing","Writing"],"Deildegast":["EMF","Writing","DOTS"]
  };
  const LABEL_TO_KEY={"emf 5":"EMF","spirit box":"SpiritBox","writing":"Writing","ghost writing":"Writing","uv":"UV","ultraviolet":"UV","orbs":"Orbs","ghost orbs":"Orbs","freezing":"Freezing","dots":"DOTS"};
  const css=document.createElement("style");
  css.textContent=`
    .h215actions{position:static!important;bottom:auto!important;margin-top:16px!important;padding:8px 0 0!important;background:transparent!important;}
    .h215actions button{position:static!important;}
  `;
  document.head.appendChild(css);

  function evidenceCount(){
    const v=window.state?.v8||{};
    if(v.difficulty==="Custom")return Number(v.customEvidence??3);
    return v.difficulty==="Nightmare"?2:v.difficulty==="Insanity"?1:3;
  }
  function allGhosts(){try{return typeof ghosts!=="undefined"?[...ghosts]:Object.keys(GHOST_EVIDENCE);}catch(e){return Object.keys(GHOST_EVIDENCE);}}
  function recomputeEvidence(){
    const v=window.state?.v8;if(!v)return;
    const gs=allGhosts(),old=v.applied||{};
    for(const g of gs)state.scores[g]=(state.scores[g]||0)-(old[g]||0);
    const out=Object.fromEntries(gs.map(g=>[g,0]));
    const hidden=3-evidenceCount();
    const found=Object.entries(v.evidence||{}).filter(([,s])=>s===1).map(([e])=>e);
    const neg=Object.entries(v.evidence||{}).filter(([,s])=>s===-1).map(([e])=>e);
    for(const g of gs){
      for(const e of found)out[g]+=(GHOST_EVIDENCE[g]?.includes(e)||(g==="The Mimic"&&e==="Orbs"))?10:-55;
      const miss=neg.filter(e=>GHOST_EVIDENCE[g]?.includes(e)).length;
      if(miss>hidden)out[g]-=45+(miss-hidden-1)*12;else out[g]-=miss*1.5;
      if(v.ruledOut?.includes(g))out[g]-=1000;
    }
    for(const g of gs)state.scores[g]=(state.scores[g]||0)+out[g];
    v.applied=out;
    try{window.__ghostEvidenceFilterV19?.reconcile?.();}catch(e){}
    try{save();}catch(e){}
    try{render();}catch(e){}
  }
  function evidenceKey(button){
    const ds=button.dataset||{};
    for(const k of [ds.e,ds.ev,ds.evidence,ds.key])if(k&&["EMF","SpiritBox","Writing","UV","Orbs","Freezing","DOTS"].includes(k))return k;
    const txt=(button.textContent||"").replace(/[📟📻📖🖐️🔵❄️🟢✓✕]/g,"").replace(/\s+/g," ").trim().toLowerCase();
    return LABEL_TO_KEY[txt]||Object.entries(LABEL_TO_KEY).find(([label])=>txt.includes(label))?.[1]||null;
  }
  document.addEventListener("click",e=>{
    const b=e.target.closest?.(".v20chip");if(!b)return;
    const key=evidenceKey(b);if(!key||!window.state?.v8?.evidence)return;
    e.preventDefault();e.stopImmediatePropagation();
    try{state.history?.push?.({scores:{...state.scores},asked:[...(state.asked||[])],answered:state.answered,current:state.current,huntMode:state.huntMode||false,kind:"v216Evidence",v8Evidence:{...state.v8.evidence},v8Applied:{...(state.v8.applied||{})}});}catch(err){}
    const cur=Number(state.v8.evidence[key]||0);
    state.v8.evidence[key]=cur===0?1:cur===1?-1:0;
    recomputeEvidence();
  },true);

  function isMapButton(b){return b?.tagName==="BUTTON"&&/\bmap\b/i.test((b.textContent||"").replace(/\s+/g," "));}
  function dedupeMaps(){
    const bar=$("v8bar");if(!bar)return;
    const maps=[...bar.children].filter(isMapButton);if(maps.length<=1)return;
    const keep=maps.find(b=>b.id==="v214Map")||maps[0];
    maps.forEach(b=>{if(b!==keep)b.remove();});
  }
  function watchBar(){
    const bar=$("v8bar");if(!bar)return false;
    dedupeMaps();
    if(bar.dataset.v216MapWatch)return true;
    bar.dataset.v216MapWatch="1";
    const mo=new MutationObserver(()=>dedupeMaps());
    mo.observe(bar,{childList:true});
    return true;
  }
  let tries=0;const wait=setInterval(()=>{tries++;if(watchBar()||tries>40)clearInterval(wait);},100);
  document.addEventListener("click",()=>setTimeout(dedupeMaps,0));
  window.addEventListener("pageshow",()=>setTimeout(dedupeMaps,0));
  window.GhostFixesV216={dedupeMaps,recomputeEvidence};
})();
