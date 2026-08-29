"use strict";
(() => {
  const VERSION="v21.1",BUILD="Full-Screen Mobile Maps";
  function addVersion(){const home=document.getElementById("home");if(!home)return;let badge=document.getElementById("appVersionBadge");if(!badge){badge=document.createElement("div");badge.id="appVersionBadge";badge.style.cssText="display:flex;justify-content:space-between;align-items:center;gap:8px;margin:10px 0 2px;padding:8px 10px;border:1px solid #303947;border-radius:11px;background:#10151d;color:#aeb8c8;font-size:12px";const first=document.getElementById("start");if(first)first.insertAdjacentElement("beforebegin",badge);else home.appendChild(badge);}badge.innerHTML=`<span><b style="color:#f5f7fa">Ghost ID ${VERSION}</b><br>${BUILD}</span><span style="font-size:11px">Current build</span>`;}
  function load(src,key){if(document.querySelector(`script[data-${key}]`))return;const s=document.createElement("script");s.async=false;s.src=src;s.dataset[key]="1";document.body.appendChild(s);}
  addVersion();
  load("./gameplay-v11.js?v=21.1","gameplayV11");
  load("./gameplay-v13.js?v=21.1","gameplayV13");
  load("./speed-language-v14.js?v=21.1","speedV14");
  load("./investigation-v15.js?v=21.1","investigationV15");
  load("./top-ghosts-v16.js?v=21.1","topGhostsV16");
  load("./remaining-ghosts-v18.js?v=21.1","remainingGhostsV18");
  load("./evidence-aware-v19.js?v=21.1","evidenceAwareV19");
  load("./gameplay-qol-v20.js?v=21.1","gameplayQolV20");
  load("./v21-core.js?v=21.1","v21Core");
  load("./gameplay-minor-v21.js?v=21.1","gameplayMinorV21");
  load("./map-display-v21-1.js?v=21.1","mapDisplayV211");
  document.documentElement.dataset.ghostBuild=VERSION;
  if("serviceWorker" in navigator){navigator.serviceWorker.register("./sw.js?v=21.1",{updateViaCache:"none"}).then(r=>r.update()).catch(()=>{});let reloaded=false;navigator.serviceWorker.addEventListener("controllerchange",()=>{if(reloaded||sessionStorage.getItem("ghost-v21-1-reload"))return;reloaded=true;sessionStorage.setItem("ghost-v21-1-reload","1");location.reload();});}
})();
