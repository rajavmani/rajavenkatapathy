/* Builds the sliders from content.js. You don't need to edit this file. */
(function(){
  var S = window.SITE || {};
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function img(src){
    return '<img src="'+esc(src)+'" alt="" loading="lazy" onerror="this.parentNode.classList.add(\'empty\')">'+
           '<span class="miss">Add image<br>'+esc(src)+'</span>';
  }
  function fill(el,src){ if(el&&src) el.insertAdjacentHTML('afterbegin','<img src="'+esc(src)+'" alt="" loading="lazy" onerror="this.parentNode.classList.add(\'empty\')">'); }

  // ---------- video cards ----------
  var all=[];
  function cover(v){ return v.thumb || (v.youtube ? 'https://i.ytimg.com/vi/'+encodeURIComponent(v.youtube)+'/hqdefault.jpg' : ''); }
  function vimg(v){
    var src=cover(v);
    return (src?'<img src="'+esc(src)+'" alt="" loading="lazy" onerror="this.parentNode.classList.add(\'empty\')">':'')+
           '<span class="miss">Video coming soon</span>';
  }
  function card(v,kind){
    var k=all.push(v)-1;
    var prev=v.preview?'<video class="preview" src="'+esc(v.preview)+'" muted loop playsinline preload="none"></video>':'';
    if(kind==='latest'){
      var tags=(v.tags||[]).map(function(t){return '<span class="label">'+esc(t)+'</span>';}).join('');
      return '<button type="button" class="card" data-v="'+k+'" data-kind="wide">'+
        '<div class="ph'+(cover(v)?'':' empty')+'">'+vimg(v)+prev+'<span class="play" aria-hidden="true"></span></div>'+
        '<span class="label accent">'+esc(v.date)+'</span><h3>'+esc(v.title)+'</h3>'+
        '<div class="tags">'+tags+'</div>'+
        (v.role?'<p class="role">'+esc(v.role)+'</p>':'')+
        (v.result?'<span class="res">'+esc(v.result)+'</span>':'')+'</button>';
    }
    return '<button type="button" class="card" data-v="'+k+'" data-kind="vertical">'+
      '<div class="ph'+(cover(v)?'':' empty')+'">'+vimg(v)+prev+(v.tag?'<span class="badge">'+esc(v.tag)+'</span>':'')+'<span class="play" aria-hidden="true"></span></div>'+
      '<h3>'+esc(v.title)+'</h3></button>';
  }
  function slider(id,items,kind){
    var root=document.getElementById(id); if(!root) return;
    var track=root.querySelector('.track'), count=root.querySelector('.count');
    track.innerHTML=(items||[]).map(function(v){return card(v,kind);}).join('');
    function step(){var c=track.firstElementChild; return c?c.getBoundingClientRect().width+18:300;}
    function upd(){ var n=track.children.length; if(!n||!count) return;
      var idx=Math.round(track.scrollLeft/step())+1; count.textContent=Math.min(idx,n)+' / '+n; }
    root.querySelector('.prev').addEventListener('click',function(){track.scrollBy({left:-step(),behavior:reduce?'auto':'smooth'});});
    root.querySelector('.next').addEventListener('click',function(){track.scrollBy({left:step(),behavior:reduce?'auto':'smooth'});});
    track.addEventListener('scroll',function(){window.requestAnimationFrame(upd);});
    upd();
  }
  slider('latest-slider',S.latest,'latest');
  slider('reels-slider',S.reels,'reel');

  // hover previews
  Array.prototype.forEach.call(document.querySelectorAll('.card'),function(c){
    var v=c.querySelector('video.preview'); if(!v) return;
    c.addEventListener('mouseenter',function(){v.play().catch(function(){});});
    c.addEventListener('mouseleave',function(){v.pause();});
  });

  // ---------- player pop-up ----------
  var player=document.getElementById('player'), frame=player.querySelector('.frame');
  function open(v,kind){
    if(v.youtube){ frame.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(v.youtube)+'?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="'+esc(v.title)+'"></iframe>'; }
    else if(v.mp4){ frame.innerHTML='<video src="'+esc(v.mp4)+'" controls autoplay playsinline></video>'; }
    else if(v.link){ window.open(v.link,'_blank','noopener'); return; }
    else { return; }
    player.classList.toggle('vertical',kind==='vertical');
    player.hidden=false; player.querySelector('.close').focus();
  }
  function close(){ player.hidden=true; frame.innerHTML=''; }
  document.addEventListener('click',function(e){
    var c=e.target.closest&&e.target.closest('.card[data-v]'); if(c) open(all[+c.getAttribute('data-v')],c.getAttribute('data-kind'));
  });
  player.querySelector('.close').addEventListener('click',close);
  player.addEventListener('click',function(e){ if(e.target===player) close(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&!player.hidden) close(); });

  // ---------- field photo slider ----------
  var P=S.photos||[], box=document.getElementById('field');
  if(box&&P.length){
    var slides=box.querySelector('.slides'), bars=box.querySelector('.bars'), cap=box.querySelector('.cap'), i=0, t=null;
    P.forEach(function(p,k){
      slides.insertAdjacentHTML('beforeend','<div class="slide ph'+(k?'':' on')+'">'+img(p.src)+'</div>');
      bars.insertAdjacentHTML('beforeend','<button type="button" aria-label="Photo '+(k+1)+'"'+(k?'':' class="on"')+'><i></i></button>');
    });
    cap.textContent=P[0].caption||'';
    function show(n){ var s=slides.children,b=bars.children;
      s[i].classList.remove('on'); b[i].classList.remove('on'); i=(n+s.length)%s.length;
      s[i].classList.add('on'); void b[i].offsetWidth; b[i].classList.add('on'); cap.textContent=P[i].caption||''; }
    function run(){ if(reduce||P.length<2) return; clearInterval(t); t=setInterval(function(){show(i+1);},5500); }
    Array.prototype.forEach.call(bars.children,function(b,k){b.addEventListener('click',function(){show(k);run();});});
    run();
  }

  // ---------- other images and links ----------
  fill(document.getElementById('travel'),S.travel);
  fill(document.getElementById('portrait'),S.portrait);
  Array.prototype.forEach.call(document.querySelectorAll('[data-case]'),function(el){fill(el,(S.caseImages||{})[el.getAttribute('data-case')]);});
  var wk=document.getElementById('wakelet'); if(wk&&S.wakelet) wk.href=S.wakelet;
  var li=document.getElementById('linkedin'); if(li){ if(S.linkedin) li.href=S.linkedin; else li.hidden=true; }
  var cv=document.getElementById('cv'); if(cv){ if(S.cv) cv.href=S.cv; else cv.hidden=true; }

  // ---------- copy email ----------
  var btn=document.getElementById('copy'), toast=document.getElementById('toast');
  if(btn) btn.addEventListener('click',function(){
    var email=document.getElementById('email');
    function fallback(){ var r=document.createRange(); r.selectNodeContents(email); var s=window.getSelection(); s.removeAllRanges(); s.addRange(r); toast.textContent='Selected. Press Ctrl/Cmd + C'; }
    try{ navigator.clipboard.writeText(email.textContent.trim()).then(function(){toast.textContent='Copied';},fallback); }catch(e){fallback();}
  });
})();
