const CACHE='ghost-id-v15b';
const ASSETS=['./','./index.html','./manifest.webmanifest','./gameplay-v7.js','./companion-v8.js','./howto-v9.js','./gameplay-v11.js','./gameplay-v13.js','./bootstrap-v15.js','./speed-language-v14.js','./investigation-v15.js'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',e=>{
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(async r=>{
      let t=await r.text();
      t=t.replace(/<script src="\.\/bootstrap-v12\.js[^\"]*"><\/script>/g,'');
      if(!t.includes('bootstrap-v15.js')) t=t.replace('</body>','<script src="./bootstrap-v15.js?v=15b"></script></body>');
      const out=new Response(t,{status:r.status,statusText:r.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
      const copy=out.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return out;
    }).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)));
});