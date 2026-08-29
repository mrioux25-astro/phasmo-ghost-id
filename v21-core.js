"use strict";
(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(root)root.GhostV21Core=api;
})(typeof window!=="undefined"?window:null,function(){
  const MAPS=[
    {id:"tanglewood",name:"6 Tanglewood Drive",size:"S",share:"tanglewood"},
    {id:"ridgeview",name:"10 Ridgeview Court",size:"S",share:"ridgeview"},
    {id:"willow",name:"13 Willow Street",size:"S",share:"willow"},
    {id:"edgefield",name:"42 Edgefield Road",size:"S",share:"edgefield"},
    {id:"grafton",name:"Grafton Farmhouse",size:"S",share:"grafton"},
    {id:"nells",name:"Nell's Diner",size:"S",share:"nells"},
    {id:"woodwind",name:"Camp Woodwind",size:"S",share:"woodwind"},
    {id:"bleasdale",name:"Bleasdale Farmhouse",size:"M",share:"bleasdale"},
    {id:"maple",name:"Maple Lodge Campsite",size:"M",share:"maple"},
    {id:"point-hope",name:"Point Hope",size:"M",share:"point-hope"},
    {id:"prison",name:"Prison",size:"M",share:"prison"},
    {id:"sunny-restricted",name:"Sunny Meadows Restricted",size:"M",share:"sunny-meadows-restricted"},
    {id:"brownstone",name:"Brownstone High School",size:"L",share:"brownstone"},
    {id:"sunny",name:"Sunny Meadows",size:"L",share:"sunny-meadows"},
    {id:"point-hope-restricted",name:"Point Hope (Restricted)",size:"S",share:"point-hope",variantOf:"point-hope"},
    {id:"prison-restricted",name:"Prison (Restricted)",size:"S",share:"prison",variantOf:"prison"},
    {id:"brownstone-restricted",name:"Brownstone High School (Restricted)",size:"M",share:"brownstone",variantOf:"brownstone"}
  ];
  const MAP_BY_ID=Object.fromEntries(MAPS.map(x=>[x.id,x]));
  function mapById(id){return MAP_BY_ID[id]||MAP_BY_ID.tanglewood;}
  function explorerUrl(id){const m=mapById(id);return `https://zero-network.net/phasmo-cheat-sheet/map-explorer/?share=${encodeURIComponent(m.share)}`;}
  function evidenceCount(v8){if(!v8)return 3;if(v8.difficulty==="Custom")return Math.max(0,Math.min(3,Number(v8.customEvidence??3)));return ({Professional:3,Nightmare:2,Insanity:1})[v8.difficulty]??3;}
  function foundEvidence(v8){return Object.entries(v8?.evidence||{}).filter(([,s])=>s===1).map(([e])=>e);}
  function hiddenEvidenceForGhost(ghost,evMap,v8){
    if(v8?.difficulty!=="Nightmare")return null;
    const f=foundEvidence(v8);if(f.length!==2)return null;
    if(ghost==="The Mimic"&&f.includes("Orbs"))return null;
    const req=evMap[ghost]||[];if(!f.every(e=>req.includes(e)||(ghost==="The Mimic"&&e==="Orbs")))return null;
    const left=req.filter(e=>!f.includes(e));return left.length===1?left[0]:null;
  }
  function hiddenSummary(ghosts,evMap,v8){return ghosts.map(g=>[g,hiddenEvidenceForGhost(g,evMap,v8)]).filter(x=>x[1]);}
  function normalizeHunt(h,source){
    const d=h?.d||h?.draft||{};
    return {source,at:Number(h?.at||0),duration:Number(h?.duration||0),overall:d.overall||d.speed||"unknown",los:d.los||"unknown",blink:d.blink||"unknown",detect:d.detect||"unknown"};
  }
  function mergeHunts(v8){
    const raw=[...(v8?.huntsV15||[]).map(h=>normalizeHunt(h,"v15")),...(v8?.hunts||[]).map(h=>normalizeHunt(h,"v8"))].filter(h=>h.at||h.duration);
    raw.sort((a,b)=>a.at-b.at);
    const seen=new Set(),out=[];
    for(const h of raw){const key=`${Math.round(h.at/1500)}:${Math.round(h.duration)}`;if(seen.has(key))continue;seen.add(key);out.push(h);}return out;
  }
  function huntInsights(hunts){
    const x=[];if(!hunts.length)return x;
    if(hunts.length>=2){
      const bases=hunts.map(h=>h.overall).filter(v=>v&&v!=="unknown");
      const uniq=[...new Set(bases)];
      if(uniq.length>=2)x.push("Starting/overall pace changed across hunts. Compare pre-LOS footsteps; this can matter for Twins, Obambo, Thaye and other state-based ghosts.");
      const ds=hunts.map(h=>h.duration).filter(v=>v>0).sort((a,b)=>a-b);
      if(ds.length>=2){const med=ds[Math.floor(ds.length/2)],min=ds[0];if(med>0&&min/med<=.82)x.push("One recorded hunt was roughly 18%+ shorter than the typical recorded hunt. Treat this as a clue only; an aggressive Obambo state is one possibility when conditions were otherwise comparable.");}
    }
    if(hunts.some(h=>h.blink==="shape"))x.push("A hunt shapeshift was recorded: strongly re-check Obake while keeping Mimic compatible until evidence settles it.");
    return x;
  }
  function questionWhy(q,possibleGhosts,topGhosts){
    if(!q)return {targets:[],text:"No active question."};
    const targets=(q.targets||[]).filter(g=>possibleGhosts.includes(g));
    const topHit=targets.filter(g=>topGhosts.includes(g));
    let text;
    if(!targets.length)text="This question is no longer relevant to the evidence-compatible shortlist and should be replaced.";
    else if(topHit.length)text=`This test directly checks ${topHit.join(" / ")}, currently among the leading evidence-compatible suspects.`;
    else text=`This test checks ${targets.join(" / ")} while they remain evidence-compatible.`;
    return {targets,text};
  }
  return {MAPS,mapById,explorerUrl,evidenceCount,foundEvidence,hiddenEvidenceForGhost,hiddenSummary,normalizeHunt,mergeHunts,huntInsights,questionWhy};
});
