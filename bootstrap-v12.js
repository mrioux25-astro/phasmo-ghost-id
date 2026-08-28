"use strict";
(() => {
  const VERSION="v13";
  const BUILD="Fast Observe + Deferred Test Fix";
  function addVersion(){
    const home=document.getElementById("home");
    if(!home)return;
    let badge=document.getElementById("appVersionBadge");
    if(!badge){badge=document.createElement("div");badge.id="appVersionBadge";badge.style.cssText="display:flex;justify-content:space-between;align-items:center;gap:8px;margin:10px 0 2px;padding:8px 10px;border:1px solid #303947;border-radius:11px;background:#10151d;color:#aeb8c8;font-size:12px";const firstButton=document.getElementById("start");if(firstButton)firstButton.insertAdjacentElement("beforebegin",badge);else home.appendChild(badge);}badge.innerHTML=`<span><b style="color:#f5f7fa">Ghost ID ${VERSION}</b><br>${BUILD}</span><span style="font-size:11px">Current build</span>`;
  }
  function load(src,key,onload){if(document.querySelector(`script[data-${key}]`)){onload?.();return;}const s=document.createElement("script");s.src=src;s.setAttribute(`data-${key}`,"1");s.onload=onload||null;document.body.appendChild(s);}
  addVersion();
  load("./gameplay-v11.js?v=13","gameplay-v11",()=>load("./gameplay-v13.js?v=13","gameplay-v13",()=>{document.documentElement.dataset.ghostBuild=VERSION;}));
  if("serviceWorker" in navigator){navigator.serviceWorker.register("./sw.js?v=13",{updateViaCache:"none"}).then(r=>r.update()).catch(()=>{});let reloaded=false;navigator.serviceWorker.addEventListener("controllerchange",()=>{if(reloaded||sessionStorage.getItem("ghost-v13-reload"))return;reloaded=true;sessionStorage.setItem("ghost-v13-reload","1");location.reload();});}
})();