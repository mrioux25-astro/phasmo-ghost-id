"use strict";
(() => {
  const C=window.GhostV21Core;
  if(!C)return;
  const DATA_URL="https://zero-network.net/phasmophobia/data/maps";
  let mapDataPromise=null;
  const isMobile=()=>window.matchMedia?.("(max-width: 700px), (pointer: coarse)")?.matches;
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function currentMapId(){try{if(window.state?.v21?.map)return window.state.v21.map;const p=JSON.parse(localStorage.getItem("ghostV21Prefs")||"{}");return p.lastMap||"tanglewood";}catch(e){return "tanglewood";}}
  function currentRoom(){return window.state?.v21?.ghostRoom||"";}
  function currentDifficulty(){return window.state?.v8?.difficulty||"";}
  function baseMap(m){return m?.variantOf?C.mapById(m.variantOf):m;}
  function norm(s){return String(s||"").toLowerCase().replace(/[’']/g,"").replace(/\b(the|road|street|drive|court)\b/g,"").replace(/[^a-z0-9]+/g,"").trim();}
  function loadMapData(){
    if(mapDataPromise)return mapDataPromise;
    mapDataPromise=fetch(DATA_URL,{cache:"default"}).then(r=>{if(!r.ok)throw new Error(`Map data ${r.status}`);return r.json();}).then(x=>Array.isArray(x)?x:[]).catch(e=>{mapDataPromise=null;throw e;});
    return mapDataPromise;
  }
  function resolveImage(m,rows){
    const b=baseMap(m),target=norm(b.name);
    let row=rows.find(x=>norm(x.name)===target);
    if(!row)row=rows.find(x=>norm(x.name).includes(target)||target.includes(norm(x.name)));
    if(!row){const aliases={"nells":"nellsdiner","maple":"maplelodgecampsite","point-hope":"pointhope","brownstone":"brownstonehighschool","sunny":"sunnymeadows","sunny-restricted":"sunnymeadowsrestricted"};const a=aliases[b.id];if(a)row=rows.find(x=>norm(x.name)===a||norm(x.div_id)===a);}
    return row?.file_url||null;
  }
  function close(){document.getElementById("v212MapFullscreen")?.remove();document.documentElement.style.overflow="";document.body.style.overflow="";}
  function shell(map,url){
    const wrap=document.createElement("div");wrap.id="v212MapFullscreen";
    const room=currentRoom(),diff=currentDifficulty();
    wrap.innerHTML=`<div class="v212MapHead"><button id="v212MapBack" type="button">‹ Back</button><div class="v212MapTitle"><b>🗺️ ${esc(map.name)}</b><small>${esc([diff,room&&`👻 ${room}`].filter(Boolean).join(" • ")||"Current contract")}</small></div><button id="v212MapExternal" type="button" aria-label="Open interactive map explorer">↗</button></div><div class="v212MapStage"><div id="v212MapLoading" class="v212MapLoading">Loading clean map…</div></div>`;
    document.body.appendChild(wrap);document.documentElement.style.overflow="hidden";document.body.style.overflow="hidden";
    document.getElementById("v212MapBack").onclick=close;document.getElementById("v212MapExternal").onclick=()=>window.open(url,"_blank","noopener,noreferrer");
    return wrap;
  }
  async function open(){
    close();const id=currentMapId(),map=C.mapById(id),url=C.explorerUrl(id),wrap=shell(map,url),stage=wrap.querySelector(".v212MapStage");
    try{
      const rows=await loadMapData();if(!document.body.contains(wrap))return;
      const src=resolveImage(map,rows);if(!src)throw new Error("No direct map image found");
      stage.innerHTML=`<div class="v212Scroller"><img id="v212MapImg" class="v212MapImg" src="${esc(src)}" alt="${esc(map.name)} map"><div class="v212Hint">Pinch to zoom • drag to inspect</div></div>`;
      const img=stage.querySelector("#v212MapImg");img.onerror=()=>{stage.innerHTML=`<div class="v212MapError"><b>Clean map could not load.</b><br>Use ↗ to open the interactive Zero-Network explorer.</div>`;};
    }catch(e){if(document.body.contains(wrap))stage.innerHTML=`<div class="v212MapError"><b>Clean map could not load.</b><br>Use ↗ to open the interactive Zero-Network explorer.</div>`;}
  }
  const style=document.createElement("style");style.textContent=`#v212MapFullscreen{position:fixed;inset:0;z-index:2147483001;background:#05070a;display:flex;flex-direction:column;width:100vw;height:100vh;height:100dvh}.v212MapHead{min-height:58px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;padding:max(6px,env(safe-area-inset-top)) 8px 6px;background:#111720;border-bottom:1px solid #303a49}.v212MapHead button{width:auto;min-width:58px;height:40px;margin:0;padding:0 10px;border:1px solid #3a4658;border-radius:10px;background:#202a38;color:#fff;font-size:15px;font-weight:700}.v212MapTitle{min-width:0;text-align:center;line-height:1.12;color:#f5f7fa}.v212MapTitle b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px}.v212MapTitle small{display:block;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#aab5c5;font-size:10px}.v212MapStage{flex:1;min-height:0;overflow:hidden;background:#000;display:flex}.v212Scroller{position:relative;flex:1;overflow:auto;-webkit-overflow-scrolling:touch;display:flex;align-items:flex-start;justify-content:flex-start;touch-action:pan-x pan-y pinch-zoom}.v212MapImg{display:block;width:auto;height:auto;min-width:100%;max-width:none;min-height:100%;object-fit:contain;object-position:center top;background:#000}.v212Hint{position:fixed;left:50%;bottom:max(12px,env(safe-area-inset-bottom));transform:translateX(-50%);padding:6px 10px;border-radius:999px;background:rgba(15,21,29,.8);color:#c9d2df;font-size:10px;pointer-events:none}.v212MapLoading,.v212MapError{margin:auto;padding:20px;text-align:center;color:#c7d0dc;font-size:13px;line-height:1.5}`;document.head.appendChild(style);
  document.addEventListener("click",e=>{if(!isMobile())return;const b=e.target.closest?.(".v8bar button");if(!b)return;const text=(b.textContent||"").trim().toLowerCase();if(!text.includes("map"))return;e.preventDefault();e.stopImmediatePropagation();open();},true);
  window.addEventListener("pagehide",close);
  window.GhostMapDisplayV212={open,close,loadMapData,resolveImage};
})();
