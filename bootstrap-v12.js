"use strict";
(() => {
  const VERSION="v17";
  const BUILD="Remaining Ghosts + Nightmare Reference";
  function addVersion(){const home=document.getElementById("home");if(!home)return;let badge=document.getElementById("appVersionBadge");if(!badge){badge=document.createElement("div");badge.id="appVersionBadge";badge.style.cssText="display:flex;justify-content:space-between;align-items:center;gap:8px;margin:10px 0 2px;padding:8px 10px;border:1px solid #303947;border-radius:11px;background:#10151d;color:#aeb8c8;font-size:12px";const firstButton=document.getElementById("start");if(firstButton)firstButton.insertAdjacentElement("beforebegin",badge);else home.appendChild(badge);}badge.innerHTML=`<span><b style="color:#f5f7fa">Ghost ID ${VERSION}</b><br>${BUILD}</span><span style="font-size:11px">Current build</span>`;}
  function load(src,key){if(document.querySelector(`script[data-${key}]`))return;const s=document.createElement("script");s.src=src;s.dataset[key]="1";document.body.appendChild(s);}
  addVersion();
  load("./gameplay-v11.js?v=17","gameplayV11");load("./gameplay-v13.js?v=17","gameplayV13");load("./speed-language-v14.js?v=17","speedV14");load("./investigation-v15.js?v=17","investigationV15");load("./top-ghosts-v16.js?v=17","topGhostsV16");load("./remaining-ghosts-v17.js?v=17","remainingGhostsV17");
  document.documentElement.dataset.ghostBuild=VERSION;
  if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js?v=17",{updateViaCache:"none"}).then(r=>r.update()).catch(()=>{});
})();