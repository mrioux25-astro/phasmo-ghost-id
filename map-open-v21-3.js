"use strict";
(() => {
  const C=window.GhostV21Core;
  if(!C)return;
  function currentMapId(){
    try{
      if(window.state?.v21?.map)return window.state.v21.map;
      const p=JSON.parse(localStorage.getItem("ghostV21Prefs")||"{}");
      return p.lastMap||"tanglewood";
    }catch(e){return "tanglewood";}
  }
  function openMap(){
    const url=C.explorerUrl(currentMapId());
    window.open(url,"_blank","noopener,noreferrer");
  }
  document.addEventListener("click",e=>{
    const b=e.target.closest?.(".v8bar button");
    if(!b)return;
    const text=(b.textContent||"").trim().toLowerCase();
    if(!text.includes("map"))return;
    e.preventDefault();
    e.stopImmediatePropagation();
    openMap();
  },true);
  window.GhostMapOpenV213={open:openMap};
})();
