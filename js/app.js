/* The New Academy — v2: progress, quizzes, flashcards, notes, exams, dashboard. Pure localStorage, no network. */
(function(){
"use strict";
var D = window.ACADEMY_DATA || {quizzes:{}, flashcards:{}, exams:{}};

var COURSES = {
  grammar:{t:"Grammar",n:6}, logic:{t:"Logic",n:6}, rhetoric:{t:"Rhetoric",n:7},
  latin:{t:"Latin I",n:6}, greek:{t:"Greek I",n:6},
  arithmetic:{t:"Arithmetic",n:6}, geometry:{t:"Geometry",n:6}, music:{t:"Music",n:6},
  astronomy:{t:"Astronomy",n:6}, philosophy:{t:"Philosophy",n:6}, gymnastics:{t:"Gymnastics",n:6}
};
function courseFile(slug){ return "courses/"+slug+".html"; }

function load(k){ try{ return JSON.parse(localStorage.getItem(k)||"{}"); }catch(e){ return {}; } }
function save(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

var progress = load("new-academy-progress-v1");
var quizBest = load("new-academy-quiz-v1");
var examRes  = load("new-academy-exams-v1");
var notes    = load("new-academy-notes-v1");

function todayStr(){ var d=new Date(); return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2); }
function recordDay(){ var s=load("new-academy-streak-v1"); s.days=s.days||{}; s.days[todayStr()]=1; save("new-academy-streak-v1",s); }
function streak(){
  var s=load("new-academy-streak-v1"), days=s.days||{}, n=0, d=new Date();
  if(!days[todayStr()]) d.setDate(d.getDate()-1);
  for(var i=0;i<370;i++){
    var k=d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);
    if(days[k]){ n++; d.setDate(d.getDate()-1); } else break;
  }
  return n;
}
function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }

/* ---- lesson open/close ---- */
document.querySelectorAll(".lesson-head").forEach(function(h){
  h.addEventListener("click",function(e){
    if(e.target.tagName==="INPUT"||e.target.closest(".markdone")||e.target.closest("button")||e.target.closest("a")) return;
    h.parentElement.classList.toggle("open");
  });
});

/* ---- self-check reveal buttons ---- */
document.querySelectorAll(".check button").forEach(function(b){
  b.addEventListener("click",function(){
    var c=b.closest(".check"); c.classList.toggle("reveal");
    b.textContent=c.classList.contains("reveal")?"Hide answer":"Show answer";
  });
});

/* ---- mark-done checkboxes ---- */
document.querySelectorAll(".markdone input[type=checkbox]").forEach(function(cb){
  var id=cb.getAttribute("data-lesson");
  if(progress[id]){ cb.checked=true; cb.closest(".lesson").classList.add("done"); }
  cb.addEventListener("change",function(){
    if(cb.checked){ progress[id]=1; recordDay(); } else delete progress[id];
    save("new-academy-progress-v1",progress);
    cb.closest(".lesson").classList.toggle("done",cb.checked);
    renderBars(); renderDashCounts();
  });
});

/* ---- progress bars + exam badges on course cards ---- */
function renderBars(){
  document.querySelectorAll("[data-course]").forEach(function(card){
    var slug=card.getAttribute("data-course");
    var boxes=document.querySelectorAll('input[data-lesson^="'+slug+':"]');
    var total=parseInt(card.getAttribute("data-total")||"0",10), done=0;
    if(boxes.length){ total=boxes.length; boxes.forEach(function(b){ if(b.checked) done++; }); }
    else { Object.keys(progress).forEach(function(k){ if(k.indexOf(slug+":")===0) done++; }); }
    var pct=total?Math.round(done/total*100):0;
    var bar=card.querySelector(".pbar i"), label=card.querySelector(".pct");
    if(bar) bar.style.width=pct+"%";
    if(label) label.textContent=done+" of "+total+" lessons · "+pct+"%";
    var r=examRes[slug], badge=card.querySelector(".exambadge");
    if(r&&r.passed){
      if(!badge){ badge=document.createElement("span"); badge.className="exambadge"; card.appendChild(badge); }
      badge.textContent="✓ Exam passed "+r.score+"/"+r.total;
    } else if(badge){ badge.remove(); }
  });
}

/* ---- dashboard counts (index) ---- */
function renderDashCounts(){
  var el=document.getElementById("overall-num");
  if(el) el.textContent=Object.keys(progress).length;
  var st=document.getElementById("streak-num");
  if(st) st.textContent=streak();
  var tl=document.querySelectorAll(".total-lessons");
  if(tl.length){ var t=0; Object.keys(COURSES).forEach(function(s){ t+=COURSES[s].n; }); tl.forEach(function(el){ el.textContent=t; }); }
}

/* ---- remember last page for "continue" ---- */
try{
  var fn=location.pathname.split("/").pop()||"index.html";
  var dir=location.pathname.indexOf("/courses/")>-1?"courses/":"";
  /* don't save on the homepage itself, or the button would vanish */
  if(fn&&fn!=="index.html") save("new-academy-last-v1",{url:fn,dir:dir,title:document.title});
}catch(e){}
function renderContinue(){
  var btn=document.getElementById("continue-btn"); if(!btn) return;
  var last=load("new-academy-last-v1");
  if(last&&last.url&&last.url!=="index.html"){
    btn.hidden=false;
    btn.href=last.dir+last.url;
    btn.textContent="Continue: "+last.title.replace(" — The New Academy","");
  }
}

renderBars(); renderDashCounts(); renderContinue();

/* ================= part 2: quiz engine, overlay, injections ================= */

/* Generic one-question-at-a-time quiz runner. mount: element. questions: [{q,choices,answer,explain}]. */
function quizRunner(mount, questions, opts){
  opts=opts||{};
  mount.innerHTML="";
  var idx=0, score=0, total=questions.length;
  var wrap=document.createElement("div"); wrap.className="qrun"; mount.appendChild(wrap);
  function render(){
    var q=questions[idx], answered=false;
    wrap.innerHTML="";
    var prog=document.createElement("div"); prog.className="qprog";
    var fill=document.createElement("i"); fill.style.width=(idx/total*100)+"%"; prog.appendChild(fill);
    var kick=document.createElement("div"); kick.className="qkicker"; kick.textContent="Question "+(idx+1)+" of "+total;
    var qp=document.createElement("p"); qp.className="qq"; qp.textContent=q.q;
    var ch=document.createElement("div"); ch.className="qchoices";
    q.choices.forEach(function(c,i){
      var b=document.createElement("button"); b.className="qchoice"; b.textContent=c;
      b.addEventListener("click",function(){ answer(i,b); });
      ch.appendChild(b);
    });
    var ex=document.createElement("div"); ex.className="qexplain"; ex.hidden=true;
    var nav=document.createElement("div"); nav.className="qnav";
    var nb=document.createElement("button"); nb.className="btn"; nb.hidden=true;
    nb.textContent=idx<total-1?"Next →":"See results";
    nb.addEventListener("click",function(){ idx++; if(idx<total) render(); else done(); });
    nav.appendChild(nb);
    wrap.appendChild(prog); wrap.appendChild(kick); wrap.appendChild(qp);
    wrap.appendChild(ch); wrap.appendChild(ex); wrap.appendChild(nav);
    function answer(i,btn){
      if(answered) return; answered=true;
      var btns=ch.querySelectorAll(".qchoice");
      btns.forEach(function(x){ x.disabled=true; });
      if(q.answer>=0&&q.answer<btns.length) btns[q.answer].classList.add("correct");
      var ok=(i===q.answer);
      if(ok) score++; else btn.classList.add("wrong");
      ex.innerHTML="";
      var strong=document.createElement("strong"); strong.textContent=ok?"Correct. ":"Not quite. ";
      var span=document.createElement("span"); span.textContent=q.explain||"";
      ex.appendChild(strong); ex.appendChild(span); ex.hidden=false;
      nb.hidden=false;
    }
  }
  function done(){
    wrap.innerHTML="";
    var res=document.createElement("div"); res.className="qresult";
    var big=document.createElement("div"); big.className="big"; big.textContent=score+" / "+total;
    var v=document.createElement("p"); v.className="verdict";
    var pct=total?score/total:0;
    v.textContent = pct===1 ? "Perfect — the ancients nod approvingly."
      : pct>=0.7 ? "Solid. Review the ones you missed and it will stick."
      : "A good first pass — reread the lesson, then try again.";
    res.appendChild(big); res.appendChild(v);
    var nav=document.createElement("div"); nav.className="qnav"; nav.style.textAlign="center";
    var again=document.createElement("button"); again.className="btn"; again.textContent="Try again"; again.style.marginRight=".6rem";
    again.addEventListener("click",function(){ idx=0; score=0; render(); });
    nav.appendChild(again);
    if(opts.doneLabel){
      var back=document.createElement("a"); back.className="btn"; back.textContent=opts.doneLabel;
      back.href=opts.doneHref||"#"; nav.appendChild(back);
    }
    res.appendChild(nav); wrap.appendChild(res);
    if(opts.onDone) opts.onDone(score,total);
  }
  if(total) render();
  else { wrap.innerHTML="<p>No questions here yet.</p>"; }
}

/* ---- quiz overlay ---- */
var qoverlay=document.createElement("div");
qoverlay.className="qoverlay"; qoverlay.hidden=true;
qoverlay.innerHTML='<div class="qcard"><div class="qtop"><span class="qkicker" id="qoverlay-title"></span><button class="qclose" aria-label="Close quiz">✕</button></div><div class="qmount"></div></div>';
document.body.appendChild(qoverlay);
qoverlay.querySelector(".qclose").addEventListener("click",function(){ qoverlay.hidden=true; document.body.style.overflow=""; });

function openQuiz(key,title){
  var qs=D.quizzes[key]; if(!qs||!qs.length) return;
  qoverlay.querySelector("#qoverlay-title").textContent=title;
  qoverlay.hidden=false; document.body.style.overflow="hidden";
  quizRunner(qoverlay.querySelector(".qmount"), shuffle(qs), {onDone:function(s,t){
    if(s>(quizBest[key]||0)){ quizBest[key]=s; save("new-academy-quiz-v1",quizBest); }
    recordDay(); refreshQuizButtons();
  }});
}

var quizBtns={};
function paintQuizBtn(b,key){
  var qs=D.quizzes[key]; if(!qs) return;
  var best=quizBest[key];
  b.textContent="Quiz me · "+qs.length+" questions"+(best!=null?" · best "+best+"/"+qs.length:"");
}
function refreshQuizButtons(){
  Object.keys(quizBtns).forEach(function(k){ quizBtns[k].forEach(function(b){ paintQuizBtn(b,k); }); });
}
function makeQuizBtn(key,title){
  var qs=D.quizzes[key]; if(!qs||!qs.length) return null;
  var b=document.createElement("button"); b.className="quizbtn";
  quizBtns[key]=quizBtns[key]||[]; quizBtns[key].push(b);
  paintQuizBtn(b,key);
  b.addEventListener("click",function(){ openQuiz(key,title); });
  return b;
}

/* ---- inject quiz buttons + notes into every lesson ---- */
document.querySelectorAll(".lesson[data-course]").forEach(function(lesson){
  var cb=lesson.querySelector("input[data-lesson]"); if(!cb) return;
  var lid=cb.getAttribute("data-lesson");
  var parts=lid.split(":"), slug=parts[0];
  var cname=(COURSES[slug]&&COURSES[slug].t)||slug;
  var body=lesson.querySelector(".lesson-body"); if(!body) return;
  var qb=makeQuizBtn(lid, cname+" · quiz");
  if(qb){ var qr=document.createElement("div"); qr.className="quizrow"; qr.appendChild(qb); body.appendChild(qr); }
  var det=document.createElement("details"); det.className="notes";
  var sum=document.createElement("summary"); sum.textContent="My notes"; det.appendChild(sum);
  var ta=document.createElement("textarea"); ta.rows=3;
  ta.placeholder="Your thoughts, questions, connections…";
  ta.value=notes[lid]||"";
  var deb=null;
  ta.addEventListener("input",function(){
    clearTimeout(deb);
    deb=setTimeout(function(){
      if(ta.value) notes[lid]=ta.value; else delete notes[lid];
      save("new-academy-notes-v1",notes);
    },400);
  });
  det.appendChild(ta); body.appendChild(det);
});

/* ---- inject quiz buttons into library sources ---- */
document.querySelectorAll(".source[id]").forEach(function(sec){
  var key="src:"+sec.id, qs=D.quizzes[key]; if(!qs||!qs.length) return;
  var b=makeQuizBtn(key, sec.querySelector("h3")?sec.querySelector("h3").textContent:"Source quiz");
  if(b){ var qr=document.createElement("div"); qr.className="quizrow"; qr.appendChild(b); sec.appendChild(qr); }
});

/* ---- exam banner on course pages ---- */
(function(){
  var first=document.querySelector(".lesson[data-course]");
  if(!first) return;
  var slug=first.getAttribute("data-course");
  if(!COURSES[slug]) return;
  var pager=document.querySelector(".pager"); if(!pager) return;
  var banner=document.createElement("div"); banner.className="exam-banner card";
  var r=examRes[slug];
  var h=document.createElement("strong"); h.textContent=COURSES[slug].t+" final exam"; banner.appendChild(h);
  var p=document.createElement("p"); p.textContent="10 questions · 7 to pass · everything from the course, nothing else."; banner.appendChild(p);
  var a=document.createElement("a"); a.className="btn"; a.href="../exam.html?course="+slug;
  a.textContent=(r&&r.passed)?"Retake the exam":"Take the exam"; banner.appendChild(a);
  if(r){ var s=document.createElement("span"); s.className="examscore";
    s.textContent=(r.passed?"Passed ":"Last attempt ")+r.score+"/"+r.total; banner.appendChild(s); }
  pager.parentNode.insertBefore(banner,pager);
})();

/* ================= part 3: dashboard drill, exam page, review page, search ================= */

/* ---- drill of the day (index) ---- */
(function(){
  var mount=document.getElementById("drill"); if(!mount) return;
  var keys=Object.keys(D.quizzes);
  var doneKeys=keys.filter(function(k){ return quizBest[k]!=null; });
  var pool=[];
  (doneKeys.length?doneKeys:keys).forEach(function(k){ D.quizzes[k].forEach(function(q){ pool.push(q); }); });
  if(!pool.length){ mount.innerHTML="<p>Quizzes are on their way.</p>"; return; }
  var seed=parseInt(todayStr().replace(/-/g,""),10);
  quizRunner(mount,[pool[seed%pool.length]],{});
})();

/* ---- exam page ---- */
(function(){
  var mount=document.getElementById("exam-mount"); if(!mount) return;
  var m=/[?&]course=([a-z]+)/.exec(location.search);
  var slug=m&&COURSES[m[1]]?m[1]:null;
  var titleEl=document.getElementById("exam-title");
  if(!slug){ mount.innerHTML="<p>Choose a course, then take its final exam from the banner at the bottom of the course page.</p>"; return; }
  var qs=D.exams[slug]||[];
  if(titleEl) titleEl.textContent=COURSES[slug].t+" — final exam";
  var prev=examRes[slug];
  mount.innerHTML="";
  var intro=document.createElement("div"); intro.className="card"; intro.style.textAlign="center";
  if(prev){ var pp=document.createElement("p"); pp.className="meta";
    pp.textContent=(prev.passed?"Passed ":"Last attempt ")+prev.score+"/"+prev.total+" · "+prev.date;
    intro.appendChild(pp); }
  var p=document.createElement("p");
  p.textContent=qs.length+" questions · 7 correct to pass · drawn from every lesson in "+COURSES[slug].t+".";
  var start=document.createElement("button"); start.className="btn"; start.textContent="Begin the exam";
  intro.appendChild(p); intro.appendChild(start); mount.appendChild(intro);
  start.addEventListener("click",function(){
    quizRunner(mount, shuffle(qs), {
      doneLabel:"Back to "+COURSES[slug].t, doneHref:courseFile(slug),
      onDone:function(s,t){
        var passed=s>=7;
        examRes[slug]={score:s,total:t,passed:passed,date:todayStr()};
        save("new-academy-exams-v1",examRes); recordDay(); renderBars();
        var res=mount.querySelector(".qresult"), v=res&&res.querySelector(".verdict");
        if(res&&v){ var msg=document.createElement("p"); msg.className="verdict"; msg.style.fontWeight="700";
          msg.textContent=passed?"You pass. The course is yours — wear it lightly.":"Not yet — 7 to pass. Revisit the lessons, then return.";
          res.insertBefore(msg,v); }
      }
    });
  });
})();

/* ---- review page: flashcards / drill / notes ---- */
(function(){
  var tabs=document.querySelector(".tabs"); if(!tabs) return;
  var panes={flash:document.getElementById("tab-flash"),drill:document.getElementById("tab-drill"),notes:document.getElementById("tab-notes")};
  tabs.querySelectorAll("button").forEach(function(b){
    b.addEventListener("click",function(){
      tabs.querySelectorAll("button").forEach(function(x){ x.classList.remove("on"); });
      b.classList.add("on");
      Object.keys(panes).forEach(function(k){ if(panes[k]) panes[k].hidden=(k!==b.getAttribute("data-tab")); });
    });
  });

  var deckTitle=function(id){ return COURSES[id]?COURSES[id].t:(id==="sources"?"Library sources":id); };
  var flashState=load("new-academy-flash-v1");
  var picker=document.getElementById("deck-picker"), fmount=document.getElementById("flash-mount");
  var deckIds=Object.keys(D.flashcards).filter(function(id){ return D.flashcards[id]&&D.flashcards[id].length; });
  var curDeck=deckIds[0]||null;
  function boxOf(deck,front){ return flashState[deck+"::"+front]||0; }
  function deckCards(){
    if(curDeck==="__all"){
      var out=[];
      deckIds.forEach(function(id){ D.flashcards[id].forEach(function(c){ out.push({deck:id,front:c.front,back:c.back}); }); });
      return out;
    }
    return (D.flashcards[curDeck]||[]).map(function(c){ return {deck:curDeck,front:c.front,back:c.back}; });
  }
  function renderPicker(){
    picker.innerHTML="";
    deckIds.forEach(function(id){
      (function(id){
        var b=document.createElement("button"); b.className="deckbtn"+(id===curDeck?" on":"");
        var cards=D.flashcards[id];
        var known=cards.filter(function(c){ return boxOf(id,c.front)>=2; }).length;
        b.textContent=deckTitle(id)+" · "+known+"/"+cards.length;
        b.addEventListener("click",function(){ curDeck=id; renderPicker(); startDeck(); });
        picker.appendChild(b);
      })(id);
    });
    var all=document.createElement("button"); all.className="deckbtn"+(curDeck==="__all"?" on":"");
    all.textContent="Everything";
    all.addEventListener("click",function(){ curDeck="__all"; renderPicker(); startDeck(); });
    picker.appendChild(all);
  }
  function startDeck(){
    fmount.innerHTML="";
    var cards=deckCards().filter(function(c){ return boxOf(c.deck,c.front)<2; });
    if(!cards.length){
      fmount.innerHTML='<p class="fhint">Deck mastered — every card recalled twice. Pick another deck above.</p>';
      return;
    }
    var queue=shuffle(cards), i=0, total=cards.length;
    var count=document.createElement("p"); count.className="fcount";
    var card=document.createElement("div"); card.className="fcard";
    var front=document.createElement("div"); front.className="front";
    var back=document.createElement("div"); back.className="back";
    card.appendChild(front); card.appendChild(back);
    card.addEventListener("click",function(){ card.classList.toggle("flipped"); });
    var hint=document.createElement("p"); hint.className="fhint"; hint.textContent="Tap the card to flip it, then grade yourself honestly.";
    var know=document.createElement("div"); know.className="fknow";
    var knew=document.createElement("button"); knew.className="btn"; knew.textContent="I knew it";
    var missed=document.createElement("button"); missed.className="btn"; missed.textContent="Missed it";
    missed.style.background="var(--muted)";
    know.appendChild(knew); know.appendChild(missed);
    fmount.appendChild(count); fmount.appendChild(card); fmount.appendChild(hint); fmount.appendChild(know);
    function show(){
      if(i>=queue.length){ finish(); return; }
      var c=queue[i];
      card.classList.remove("flipped");
      front.textContent=c.front; back.textContent=c.back;
      count.textContent="Card "+(i+1)+" of "+total+(curDeck==="__all"?" · "+deckTitle(c.deck):"");
    }
    knew.addEventListener("click",function(){
      var c=queue[i], k=c.deck+"::"+c.front;
      flashState[k]=Math.min(2,(flashState[k]||0)+1);
      save("new-academy-flash-v1",flashState); i++; show();
    });
    missed.addEventListener("click",function(){
      var c=queue[i];
      flashState[c.deck+"::"+c.front]=0;
      save("new-academy-flash-v1",flashState);
      queue.push(c); i++; show();
    });
    function finish(){
      fmount.innerHTML="";
      var res=document.createElement("div"); res.className="qresult";
      var big=document.createElement("div"); big.className="big"; big.textContent="✓";
      var v=document.createElement("p"); v.className="verdict"; v.textContent="Session complete — missed cards will come back sooner.";
      var again=document.createElement("button"); again.className="btn"; again.textContent="Again";
      again.addEventListener("click",startDeck);
      res.appendChild(big); res.appendChild(v); res.appendChild(again);
      fmount.appendChild(res); renderPicker();
    }
    show();
  }
  renderPicker(); startDeck();

  /* drill tab: 10 random questions from everything */
  var dmount=document.getElementById("drill-mount"), dnew=document.getElementById("drill-new");
  function allQs(){
    var out=[];
    Object.keys(D.quizzes).forEach(function(k){ D.quizzes[k].forEach(function(q){ out.push(q); }); });
    return out;
  }
  function newDrill(){
    var qs=shuffle(allQs()).slice(0,10);
    if(qs.length) quizRunner(dmount,qs,{onDone:function(){ recordDay(); }});
    else dmount.innerHTML="<p>No questions yet.</p>";
  }
  if(dnew) dnew.addEventListener("click",newDrill);
  newDrill();

  /* notes tab */
  var nlist=document.getElementById("notes-list");
  function lessonLabel(lid){
    var parts=lid.split(":"), slug=parts[0], num=parts[1];
    if(slug==="src") return "Library";
    return ((COURSES[slug]&&COURSES[slug].t)||slug)+" · Lesson "+num;
  }
  function lessonHref(lid){
    var slug=lid.split(":")[0];
    if(slug==="src") return "library.html";
    return courseFile(slug);
  }
  var nkeys=Object.keys(notes);
  if(!nkeys.length){
    nlist.innerHTML="<p>You have not written any notes yet. Open any lesson and use the <em>My notes</em> box at the bottom — they will collect here.</p>";
  } else {
    nkeys.sort().forEach(function(lid){
      var d=document.createElement("div"); d.className="card";
      var h=document.createElement("h4"); h.style.margin="0 0 .3rem";
      var a=document.createElement("a"); a.href=lessonHref(lid); a.textContent=lessonLabel(lid);
      h.appendChild(a);
      var p=document.createElement("p"); p.style.whiteSpace="pre-wrap"; p.textContent=notes[lid];
      d.appendChild(h); d.appendChild(p); nlist.appendChild(d);
    });
  }
})();

/* ---- search page ---- */
(function(){
  var input=document.getElementById("search-input"); if(!input) return;
  var res=document.getElementById("search-results");
  var idx=window.ACADEMY_SEARCH||[];
  input.addEventListener("input",function(){
    var q=input.value.trim().toLowerCase();
    if(q.length<2){ res.innerHTML=""; return; }
    var hits=idx.filter(function(e){ return (e.t+" "+e.s).toLowerCase().indexOf(q)>-1; }).slice(0,30);
    if(!hits.length){ res.innerHTML="<p>No matches. Try a broader term.</p>"; return; }
    res.innerHTML=hits.map(function(e){
      return '<a class="sr" href="'+esc(e.u)+'"><h4>'+esc(e.t)+'</h4><p>'+esc(e.s)+'</p></a>';
    }).join("");
  });
})();

})();
