"use strict";
(() => {
  const VERSION="v12";
  const BUILD="Hunt UX + Contract Setup";
  function addVersion(){
    const home=document.getElementById("home");
    if(!home||document.getElementById("appVersionBadge"))return;
    const badge=document.createElement("div");
    badge.id="appVersionBadge";
    badge.style.cssText="display:flex;justify-content:space-between;align-items:center;gap:8px;margin:10px 0 2px;padding:8px 10px;border:1px solid #303947;border-radius:11px;background:#10151d;color:#aeb8c8;font-size:12px";
    badge.innerHTML=`<span><b style="color:#f5f7fa">Ghost ID ${VERSION}</b><br>${BUILD}</span><span style="font-size:11px">Current build</span>`;
    const firstButton=document.getElementById("start");
    if(firstButton)firstButton.insertAdjacentElement("beforebegin",badge);else home.appendChild(badge);
  }
  function loadV11(){
    if(document.querySelector('script[data-gameplay-v11]'))return;
    const s=document.createElement("script");
    s.src="./gameplay-v11.js?v=12";
    s.dataset.gameplayV11="1";
    s.onload=()=>{document.documentElement.dataset.ghostBuild=VERSION;};
    document.body.appendChild(s);
  }
  addVersion();
  loadV11();
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js?v=12",{updateViaCache:"none"}).then(r=>r.update()).catch(()=>{});
    let reloaded=false;
    navigator.serviceWorker.addEventListener("controllerchange",()=>{
      if(reloaded||sessionStorage.getItem("ghost-v12-reload"))return;
      reloaded=true;sessionStorage.setItem("ghost-v12-reload","1");location.reload();
    });
  }
})();