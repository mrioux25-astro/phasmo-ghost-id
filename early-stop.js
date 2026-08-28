"use strict";
(() => {
  const CONFIRM_TESTS={
    "Revenant":"Repeat a controlled hunt: while it has not detected anyone it should stay very slow (~1.0 m/s), then jump almost instantly to ~3.0 m/s when it detects a player.",
    "Deogen":"Loop it in open space. It should always know where its target is, rush in from distance, and become extremely slow (~0.4 m/s) at close range.",
    "Hantu":"Repeat a hunt across rooms with clearly different temperatures. Its speed should follow temperature and it should not gain normal continuous-LOS acceleration.",
    "Raiju":"Repeat a hunt with active player electronics concentrated in one area. Look for the speed snapping to a flat ~2.5 m/s inside electronic range and changing outside it.",
    "Jinn":"Keep the breaker on and repeat a safe LOS test. At more than ~3 m it should jump to ~2.5 m/s, then return to normal hunt behavior when close.",
    "Moroi":"Compare base speed at noticeably different team sanity levels. Moroi should become faster as average sanity falls and still accelerate in LOS.",
    "Thaye":"Compare another hunt after players spend more time near the ghost. It should age and slow, and it should never gain normal LOS acceleration.",
    "Dayan":"During a controlled hunt, test within about 10 m: have a player walk, then stand still. Its speed should change strongly between the two states.",
    "Aswang":"Repeat a long LOS test. Confirm a slightly slow base speed with faster-than-normal LOS acceleration to its maximum.",
    "Kormos":"During a safe hunt test, compare standing perfectly still with crouching/walking/sprinting. Movement detection should change dramatically while visual detection remains very limited.",
    "Deildegast":"After its speed resets from a hunt/hunt attempt, interact with many unique qualifying objects/switches/taps/breaker controls before the next hunt and compare the new hunt speed.",
    "The Twins":"Compare another hunt's base footstep speed before LOS acceleration. Look for the alternate slow/fast base speed across hunts.",
    "Obake":"Watch another sufficiently long hunt for a model change on a blink. One missed hunt does not disprove Obake because short hunts can end before a scheduled shapeshift.",
    "Phantom":"Watch another hunt carefully. Confirm unusually long invisible periods between blinks rather than judging from a single blink sequence.",
    "Oni":"Watch another hunt carefully. Confirm that it stays visible for unusually large portions of its blink cycle.",
    "Myling":"During another hunt, compare when electronics begin interfering with when footsteps become clearly audible; Myling footsteps should become audible unusually late.",
    "Gallu":"Use salt, incense, or a crucifix to force a state transition, then compare the next hunt's speed/behavior to the previous state.",
    "Wraith":"Place fresh salt directly in its path and watch carefully. A Wraith should pass through without disturbing the salt.",
    "Poltergeist":"Make a tight pile of throwable objects and watch for another multi-throw where several move essentially together.",
    "Banshee":"Keep using a parabolic microphone near the ghost and listen for the distinctive Banshee scream. Any player can hear it.",
    "Mare":"Keep testing the same light-switch setup. A repeated immediate switch-off after a player turns the light on strongly supports Mare, though the ability is chance-based.",
    "Onryo":"Run a controlled firelight test: track extinguished flames and watch for the hunt attempt tied to the third extinguished flame while lit flames prevent hunts.",
    "Yokai":"Repeat a controlled talking/detection test: nearby talking should affect hunt behavior while voice/electronic detection during hunts remains unusually short-ranged.",
    "Spirit":"After incense successfully prevents a hunt, time the no-hunt window. Spirit should stay unable to hunt for about 180 seconds.",
    "Demon":"After incense successfully prevents a hunt, time the no-hunt window. Demon can hunt again after about 60 seconds.",
    "Yurei":"Look for another full door-close ability outside a ghost event together with the associated sanity effect; one missed attempt does not rule it out.",
    "Goryo":"With DOTS available, verify that DOTS is seen through the video camera while no player is physically close to the ghost.",
    "The Mimic":"Verify Ghost Orbs plus the Mimic's actual evidence set, or observe it switch between distinct ghost-specific behaviors over time."
  };

  const css=document.createElement("style");
  css.textContent='.confirmCard{background:#111821;border:1px solid #53657e;border-radius:16px;padding:15px;margin:10px 0}.confirmGhost{font-size:30px;font-weight:900;margin:6px 0}.confirmTest{background:#0d1219;border-left:3px solid #c7d2fe;border-radius:10px;padding:12px;margin:12px 0;line-height:1.45}.confirmBadge{display:inline-block;background:#344052;padding:6px 9px;border-radius:999px;font-size:12px;font-weight:800}';
  document.head.appendChild(css);

  if(!document.getElementById("confirm")){
    const section=document.createElement("section");
    section.id="confirm";section.className="hidden";
    section.innerHTML='<div class="confirmCard"><div class="confirmBadge">Strong tell detected</div><div id="confirmGhost" class="confirmGhost"></div><p id="confirmReason" class="muted"></p><div class="confirmTest"><b>Verify it:</b><br><span id="confirmTest"></span></div><button id="confirmYes">Confirmed — Show Result</button><button id="confirmNo" class="secondary">Did Not Confirm — Keep Testing</button><button id="confirmSkip" class="secondary">Can\'t Test Right Now</button></div>';
    const results=document.getElementById("results");results.parentNode.insertBefore(section,results);
  }

  function decisive(q){return q&&q.tier!=="soft"&&Array.isArray(q.targets)&&q.targets.length===1?q.targets[0]:null;}
  function showConfirm(ghost,qid,reason){
    state.confirmCandidate={ghost,qid,reason};state.confirmedGhost=null;
    ["quiz","huntQuick","results"].forEach(id=>document.getElementById(id)?.classList.add("hidden"));
    document.getElementById("confirm").classList.remove("hidden");
    document.getElementById("topbar").classList.remove("hidden");
    renderTop3();
    document.getElementById("confirmGhost").textContent=ghost;
    document.getElementById("confirmReason").textContent=reason;
    document.getElementById("confirmTest").textContent=CONFIRM_TESTS[ghost]||"Repeat the distinctive observation under controlled conditions. If it repeats cleanly, treat it as a very strong identification.";
    save();
  }

  const baseAnswer=answer;
  answer=function(kind){
    const q=Q.find(x=>x.id===state.current);
    baseAnswer(kind);
    if(kind!=="yes"||!q)return;
    const ghost=decisive(q);
    if(ghost)showConfirm(ghost,q.id,`That answer directly points toward ${ghost}. Verify this ghost-specific behavior once instead of continuing through the full question list.`);
  };

  function confirmYes(){
    const c=state.confirmCandidate;if(!c)return;
    state.history.push({scores:{...state.scores},asked:[...state.asked],answered:state.answered,current:state.current,huntMode:false,kind:"confirmation",ghost:c.ghost,confirmed:true});
    state.scores[c.ghost]=(state.scores[c.ghost]||0)+22;
    if(c.ghost!=="The Mimic")state.scores["The Mimic"]=(state.scores["The Mimic"]||0)+2;
    state.answered++;state.confirmedGhost=c.ghost;state.confirmCandidate=null;
    document.getElementById("confirm").classList.add("hidden");
    showResults();
    const p=probabilities(),top=p[0];
    if(top&&top[0]===state.confirmedGhost){
      document.getElementById("whySummary").textContent=`Verified ghost-specific tell. ${top[0]} is now the strongest identification (${top[1].toFixed(1)}% relative match weight). You do not need to continue through all remaining questions unless you want extra confirmation.`;
      const box=document.getElementById("whyBox");
      box.innerHTML='<b>Why this is #1</b><div class="whyline plus">+22 • The focused verification test confirmed the ghost-specific tell.</div>'+box.innerHTML.replace('<b>Why this is #1</b>','');
    }
    save();
  }
  function confirmNo(){
    const c=state.confirmCandidate;if(!c)return;
    state.history.push({scores:{...state.scores},asked:[...state.asked],answered:state.answered,current:state.current,huntMode:false,kind:"confirmation",ghost:c.ghost,confirmed:false});
    state.scores[c.ghost]=(state.scores[c.ghost]||0)-10;state.answered++;state.confirmCandidate=null;state.confirmedGhost=null;
    document.getElementById("confirm").classList.add("hidden");document.getElementById("quiz").classList.remove("hidden");
    if(!state.current)state.current=chooseNext()?.id||null;render();save();
  }
  function confirmSkip(){
    state.confirmCandidate=null;state.confirmedGhost=null;
    document.getElementById("confirm").classList.add("hidden");document.getElementById("quiz").classList.remove("hidden");
    if(!state.current)state.current=chooseNext()?.id||null;render();save();
  }
  document.getElementById("confirmYes").addEventListener("click",confirmYes);
  document.getElementById("confirmNo").addEventListener("click",confirmNo);
  document.getElementById("confirmSkip").addEventListener("click",confirmSkip);

  const oldEnd=document.getElementById("endHunt");
  if(oldEnd){
    const newEnd=oldEnd.cloneNode(true);oldEnd.replaceWith(newEnd);
    newEnd.addEventListener("click",()=>{
      const observations=Object.values(state.huntDraft||{}).filter(qid=>qid&&qid!=="none");
      const unique=[...new Set(observations)].filter(qid=>Q.some(q=>q.id===qid));
      if(unique.length){
        state.history.push({scores:{...state.scores},asked:[...state.asked],answered:state.answered,current:state.current,huntMode:false,kind:"huntBatch",observations:[...unique]});
        unique.forEach(qid=>{const q=Q.find(x=>x.id===qid);apply(q.yes);if(!state.asked.includes(qid))state.asked.push(qid);});
        state.answered+=unique.length;
      }
      state.huntMode=false;state.huntDraft={};state.current=null;
      document.getElementById("huntQuick").classList.add("hidden");
      const hits=unique.map(qid=>Q.find(q=>q.id===qid)).filter(q=>decisive(q));
      if(hits.length){
        const order=ranked().map(x=>x[0]);hits.sort((a,b)=>order.indexOf(decisive(a))-order.indexOf(decisive(b)));
        const hit=hits[0],ghost=decisive(hit);save();showConfirm(ghost,hit.id,`Your hunt log contained a ghost-specific tell for ${ghost}. Verify that behavior once before ending the investigation.`);return;
      }
      document.getElementById("quiz").classList.remove("hidden");nextQuestion();save();
    });
  }

  const oldResume=document.getElementById("resume");
  if(oldResume){
    const newResume=oldResume.cloneNode(true);oldResume.replaceWith(newResume);
    newResume.addEventListener("click",()=>{
      const x=load();if(!x)return startNew();state=x;state.huntDraft=state.huntDraft||{};
      document.getElementById("home").classList.add("hidden");document.getElementById("results").classList.add("hidden");document.getElementById("topbar").classList.remove("hidden");
      if(state.confirmCandidate){showConfirm(state.confirmCandidate.ghost,state.confirmCandidate.qid,state.confirmCandidate.reason);return;}
      if(state.huntMode){showHuntQuick();return;}
      document.getElementById("quiz").classList.remove("hidden");if(!state.current||state.asked.includes(state.current))state.current=chooseNext()?.id||null;render();
    });
  }
})();