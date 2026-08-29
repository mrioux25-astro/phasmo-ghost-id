"use strict";
(() => {
  const C=window.GhostV21Core;
  if(!C)return;
  const isMobile=()=>window.matchMedia?.("(max-width: 700px), (pointer: coarse)")?.matches;
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function currentMapId(){
    try{
      if(window.state?.v21?.map)return window.state.v21.map;
      const p=JSON.parse(localStorage.getItem("ghostV21Prefs")||"{}");
      return p.lastMap||"tanglewood";
    }catch(e){return "tanglewood";}
  }
  function currentRoom(){return window.state?.v21?.ghostRoom||"";}
  function currentDifficulty(){return window.state?.v8?.difficulty||"";}
  function close(){document.getElementById("v211MapFullscreen")?.remove();document.documentElement.style.overflow="";document.body.style.overflow="";}
  function open(){
    close();
    const id=currentMapId(),map=C.mapById(id),url=C.explorerUrl(id);
    const room=currentRoom(),diff=currentDifficulty();
    const wrap=document.createElement("div");
    wrap.id="v211MapFullscreen";
    wrap.innerHTML=`<div class="v211MapHead"><button id="v211MapBack" type="button">‹ Back</button><div class="v211MapTitle"><b>🗺️ ${esc(map.name)}</b><small>${esc([diff,room&&`👻 ${room}`].filter(Boolean).join(" • ")||"Current contract")}</small></div><button id="v211MapExternal" type="button" aria-label="Open map in browser">↗</button></div><iframe class="v211MapFrame" src="${esc(url)}" title="${esc(map.name)} map" loading="eager" referrerpolicy="no-referrer"></iframe>`;
    document.body.appendChild(wrap);
    document.documentElement.style.overflow="hidden";
    document.body.style.overflow="hidden";
    document.getElementById("v211MapBack").onclick=close;
    document.getElementById("v211MapExternal").onclick=()=>window.open(url,"_blank","noopener,noreferrer");
  }
  const style=document.createElement("style");
  style.textContent=`#v211MapFullscreen{position:fixed;inset:0;z-index:2147483000;background:#090c11;display:flex;flex-direction:column;width:100vw;height:100vh;height:100dvh}.v211MapHead{height:58px;min-height:58px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;padding:max(6px,env(safe-area-inset-top)) 8px 6px;background:#111720;border-bottom:1px solid #303a49}.v211MapHead button{width:auto;min-width:58px;height:40px;margin:0;padding:0 10px;border:1px solid #3a4658;border-radius:10px;background:#202a38;color:#fff;font-size:15px;font-weight:700}.v211MapTitle{min-width:0;text-align:center;line-height:1.12;color:#f5f7fa}.v211MapTitle b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px}.v211MapTitle small{display:block;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#aab5c5;font-size:10px}.v211MapFrame{display:block;flex:1;width:100%;min-height:0;border:0;background:#000}`;
  document.head.appendChild(style);
  document.addEventListener("click",e=>{
    if(!isMobile())return;
    const b=e.target.closest?.(".v8bar button");
    if(!b)return;
    const text=(b.textContent||"").trim().toLowerCase();
    if(!text.includes("map"))return;
    e.preventDefault();
    e.stopImmediatePropagation();
    open();
  },true);
  window.addEventListener("pagehide",close);
  window.GhostMapDisplayV211={open,close};
})();
