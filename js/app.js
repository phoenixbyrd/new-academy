/* The New Academy — progress + lesson UI. Pure localStorage, no network. */
(function(){
  var KEY='new-academy-progress-v1';
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY)||'{}'); }catch(e){ return {}; } }
  function save(p){ try{ localStorage.setItem(KEY,JSON.stringify(p)); }catch(e){} }
  var progress=load();

  // Lesson open/close
  document.querySelectorAll('.lesson-head').forEach(function(h){
    h.addEventListener('click',function(e){
      if(e.target.tagName==='INPUT'||e.target.closest('.markdone')) return;
      h.parentElement.classList.toggle('open');
    });
  });

  // Self-check reveal buttons
  document.querySelectorAll('.check button').forEach(function(b){
    b.addEventListener('click',function(){
      var c=b.closest('.check'); c.classList.toggle('reveal');
      b.textContent=c.classList.contains('reveal')?'Hide answer':'Show answer';
    });
  });

  // Mark-done checkboxes
  document.querySelectorAll('.markdone input[type=checkbox]').forEach(function(cb){
    var id=cb.getAttribute('data-lesson');
    if(progress[id]){ cb.checked=true; cb.closest('.lesson').classList.add('done'); }
    cb.addEventListener('change',function(){
      if(cb.checked) progress[id]=1; else delete progress[id];
      save(progress);
      cb.closest('.lesson').classList.toggle('done',cb.checked);
      renderBars();
    });
  });

  // Progress bars (course cards carry data-course="slug")
  function renderBars(){
    document.querySelectorAll('[data-course]').forEach(function(card){
      var slug=card.getAttribute('data-course');
      var boxes=document.querySelectorAll('input[data-lesson^="'+slug+':"]');
      // On index page there are no checkboxes; use stored counts via data-total
      var total=parseInt(card.getAttribute('data-total')||'0',10);
      var done=0;
      if(boxes.length){ total=boxes.length; boxes.forEach(function(b){ if(b.checked) done++; }); }
      else{
        Object.keys(progress).forEach(function(k){ if(k.indexOf(slug+':')===0) done++; });
      }
      var pct=total?Math.round(done/total*100):0;
      var bar=card.querySelector('.pbar i'), label=card.querySelector('.pct');
      if(bar) bar.style.width=pct+'%';
      if(label) label.textContent=done+' of '+total+' lessons · '+pct+'%';
    });
    // overall
    var all=Object.keys(progress).length;
    var overall=document.getElementById('overall-pct');
    if(overall) overall.textContent=all+' lessons completed';
  }
  renderBars();
})();
