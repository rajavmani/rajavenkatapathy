/* Fills the page from content.json (edited with Pages CMS). You don't need to edit this file. */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id){ return document.getElementById(id); }
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function setText(id,v){ var el=$(id); if(el&&v!=null&&v!=='') el.textContent=v; }
  // [words](https://link) in any text box becomes a link
  // [words](https://link) becomes a link; a bare https://link also becomes a link; new lines are kept
  function md(s){ var o=esc(s).replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)/g,function(_,a,u){return '<a href="'+u+'" target="_blank" rel="noopener">'+a+'</a>';}); o=o.replace(/(^|[\s(])(https?:\/\/[^\s<]+)/g,function(_,p,u){return p+'<a href="'+u+'" target="_blank" rel="noopener">'+u+'</a>';}); o=o.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>'); return o.trim().replace(/\n+/g,'<br>'); }
  function setRich(id,v){ var el=$(id); if(el&&v!=null&&v!=='') el.innerHTML=md(v); }
  function names(id,list,hl){ var el=$(id); if(!el||!list||!list.length) return; el.innerHTML=list.filter(function(x){return x&&x.name;}).map(function(x){ var c=(hl&&x.highlight)?' class="hl"':''; return x.link?'<a'+c+' href="'+esc(x.link)+'" target="_blank" rel="noopener">'+esc(x.name)+'</a>':'<b'+c+'>'+esc(x.name)+'</b>'; }).join(''); }
  function imgTag(src){ return '<img src="'+esc(src)+'" alt="" loading="lazy" onerror="this.parentNode.classList.add(\'empty\')">'; }
  function fill(el,src){ if(!el) return; var old=el.querySelector('img'); if(old) old.remove(); if(src){ el.classList.remove('empty'); el.insertAdjacentHTML('afterbegin',imgTag(src)); } else { el.classList.add('empty'); } }
  function ytId(v){ if(!v) return ''; var m=String(v).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/); return m?m[1]:(/^[\w-]{11}$/.test(v)?v:''); }

  fetch('content.json',{cache:'no-store'}).then(function(r){return r.json();}).then(render).catch(function(){ render({}); });

  function render(C){
    var H=C.hero||{};
    setText('eyebrow',H.eyebrow); setText('h1a',H.headline1); setText('h1b',H.headline2);
    setRich('intro1',H.intro1); setRich('intro2',H.intro2); setRich('years',H.years); setText('photoCaption',H.photoCaption);
    // "What I did": each line (or each sentence) becomes a bullet point
    function pts(s){ var p=String(s).split(/\n+/).map(function(x){return x.trim();}).filter(Boolean); if(p.length<2) p=String(s).trim().split(/(?<=[.!?])\s+(?=[A-Z0-9#])/); return p.length<2?md(s):'<ul class="did">'+p.map(function(x){return '<li>'+md(x)+'</li>';}).join('')+'</ul>'; }
    var WK=C.work||[];
    if(WK.length&&$('cases')) $('cases').innerHTML=WK.filter(function(c){return c&&c.title;}).map(function(c){ var dl=''; if(c.brief) dl+='<dt>The brief</dt><dd>'+md(c.brief)+'</dd>'; if(c.did) dl+='<dt>What I did</dt><dd>'+pts(c.did)+'</dd>'; if(c.result) dl+='<dt>Result</dt><dd class="win">'+md(c.result)+'</dd>'; if(c.showFeaturedIn) dl+='<dt>Featured in</dt><dd><div class="press" id="featured"></div></dd>'; return '<article class="case"><div class="ph'+(c.image?'':' empty')+'">'+(c.image?imgTag(c.image):'')+'<span class="miss">Photo coming soon</span></div><div>'+(c.meta?'<div class="meta label">'+esc(c.meta)+'</div>':'')+'<h3>'+esc(c.title)+'</h3><dl>'+dl+'</dl>'+(c.award?'<span class="award">'+esc(c.award)+'</span>':'')+'</div></article>'; }).join('');
    names('creds',C.highlights,true); names('featured',C.featuredIn); names('orgs',C.organisations);
    fill($('portrait'),H.photo||'images/portrait.jpg');

    if(C.numbers&&C.numbers.length){
      $('numbers').innerHTML=C.numbers.map(function(n){return '<div class="num"><div class="n">'+esc(n.value)+'</div><p>'+md(n.label)+'</p></div>';}).join('');
    }

    var A=C.about||{};
    setText('about-h',A.heading);
    if(A.paragraphs&&A.paragraphs.length) $('aboutCopy').innerHTML=A.paragraphs.map(function(p){return '<p>'+md(p)+'</p>';}).join('');
    photoSlider(A.photos||[]);

    var CI=C.caseImages||{};
    Array.prototype.forEach.call(document.querySelectorAll('[data-case]'),function(el){ fill(el,CI[el.getAttribute('data-case')]); });
    fill($('travel'),C.travelPhoto||'images/travel.jpg');

    var K=C.contact||{};
    setRich('contactLine',K.line);
    if(K.email){ $('email').textContent=K.email; $('email').href='mailto:'+K.email; }
    var li=$('linkedin'); if(K.linkedin){ li.href=K.linkedin; li.hidden=false; } else li.hidden=true;
    var cv=$('cv'); if(K.cv){ cv.href=K.cv; cv.hidden=false; } else cv.hidden=true;
    if(C.wakelet&&$('wakelet')) $('wakelet').href=C.wakelet;
    var gm=$('graphicsMore'); if(gm&&C.graphicsMore){ gm.href=C.graphicsMore; gm.hidden=false; }

    slider('latest-slider',C.latest||[],'latest');
    slider('lreels-slider',C.latestReels||[],'reel');
    slider('reels-slider',C.reels||[],'reel');
    var Wr=C.writing||{}; setRich('writingIntro',Wr.intro);
    if(Wr.items&&Wr.items.length&&$('writingList')) $('writingList').innerHTML=Wr.items.filter(function(w){return w&&w.title;}).map(function(w){return '<a class="wpost" href="'+esc(w.link||'#')+'" target="_blank" rel="noopener"><div class="ph'+(w.image?'':' empty')+'">'+(w.image?imgTag(w.image):'')+'<span class="miss">Image coming soon</span></div><span class="label">'+esc(w.label)+'</span><h3>'+esc(w.title)+'</h3><span class="go">Read ↗</span></a>';}).join('');
    if(Wr.authorPage&&$('authorPage')) $('authorPage').href=Wr.authorPage;
    slider('graphics-slider',C.graphics||[],'graphic');
    var Wr0=Wr;
    // ---------- sections added to the CMS (14 Oct 2026) ----------
    function list(id,arr,fn){ var el=$(id); if(el&&arr&&arr.length) el.innerHTML=arr.filter(Boolean).map(fn).join(''); }
    function btn(id,text,link){ var el=$(id); if(!el) return; if(text) el.textContent=text; if(link) el.href=link; }
    function paras(id,arr){ list(id,arr,function(x){return '<p>'+md(x)+'</p>';}); }
    var S=C.sections||{};
    setText('featured-h',S.featured); setText('videosLabel',S.videosLabel); setText('videos-h',S.videos);
    setText('graphicsLabel',S.graphicsLabel); setText('graphics-h',S.graphics);
    setText('work-h',S.work); setRich('workIntro',S.workIntro); setText('writing-h',S.writing);
    setText('aboutLabel',S.aboutLabel); setText('fieldTag',S.photoTag);
    btn('btnWork',H.button1); btn('btnContact',H.button2); if(Wr0.authorButton) btn('authorPage',Wr0.authorButton);
    btn('wakelet',S.videosButton); if(S.graphicsMoreText) btn('graphicsMore',S.graphicsMoreText);
    var WD=C.whatIDo||{}; setText('what-h',WD.heading); setRich('whatIntro',WD.intro);
    list('tiles',WD.tiles,function(t){return '<div class="tile"><span class="label">'+esc(t.label)+'</span><h3>'+esc(t.title)+'</h3><p>'+md(t.text)+'</p>'+(t.proof?'<span class="proof">'+md(t.proof)+'</span>':'')+'</div>';});
    var R=C.recognition||{}; setText('rec-h',R.heading); setRich('recIntro',R.intro); setText('orgsLabel',R.orgsLabel);
    list('awards',R.awards,function(a){return '<li'+(a.highlight?' class="top"':'')+'><span class="yr">'+esc(a.year)+'</span><strong>'+esc(a.title)+'</strong><span>'+md(a.detail)+'</span></li>';});
    var L=C.lab||{}; setText('labLabel',L.label); setText('lab-h',L.heading); setRich('labIntro',L.intro);
    list('labItems',L.items,function(t){return '<div class="item"><h3>'+esc(t.title)+'</h3><p>'+md(t.text)+'</p>'+(t.proof?'<span class="proof">'+md(t.proof)+'</span>':'')+'</div>';});
    var SK=C.skills||{}; setText('kit-h',SK.heading); setRich('kitIntro',SK.intro);
    list('kit',SK.groups,function(g){return '<div'+(g.wide?' class="edu"':'')+'><span class="label">'+esc(g.label)+'</span><p>'+md(g.text)+'</p></div>';});
    var O=C.offTheClock||{}; setText('otcLabel',O.label); setText('otc-h',O.heading); paras('otcText',O.paragraphs); btn('otcBtn',O.buttonText,O.buttonLink);
    setText('contactLabel',K.label); if(K.heading1||K.heading2){ var h2=String(K.heading2||'').trim(), cut=h2.lastIndexOf(' '); $('contact-h').innerHTML=esc(K.heading1||'')+'<br>'+(cut>0?esc(h2.slice(0,cut))+' <span>'+esc(h2.slice(cut+1))+'</span>':'<span>'+esc(h2)+'</span>'); }
    btn('cv',K.cvButton); btn('linkedin',K.linkedinButton); setText('footer',C.footer);
  }

  // ---------- video sliders ----------
  var all=[];
  function cover(v){ if(v.image) return v.image; var id=ytId(v.youtube); return v.thumb || (id ? 'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg' : ''); }
  function card(v,kind){
    var k=all.push(v)-1, src=cover(v);
    var media='<div class="ph'+(src?'':' empty')+'">'+(src?imgTag(src):'')+'<span class="miss">'+(kind==='graphic'?'Graphic coming soon':'Video coming soon')+'</span>';
    if(kind==='graphic' && v.live && v.embed && /instagram\.com\/(?:[\w.]+\/)?p\//.test(v.link||'')){ var lid=v.link.match(/\/p\/([\w-]+)/)[1]; return '<button type="button" class="card" data-v="'+k+'" data-kind="graphic"><div class="ph" style="overflow:hidden;aspect-ratio:5/9"><iframe src="https://www.instagram.com/p/'+lid+'/embed/" scrolling="no" tabindex="-1" loading="lazy" style="pointer-events:none;border:0;position:absolute;inset:0;width:100%;height:100%"></iframe></div>'+(v.account?'<span class="label" style="color:#0095f6;text-transform:none;letter-spacing:0">@'+esc(v.account)+' &#10003;</span>':'')+(v.caption?'<h3>'+esc(v.caption)+'</h3>':'')+'</button>'; } if(kind==='graphic') return '<button type="button" class="card" data-v="'+k+'" data-kind="graphic">'+media+'</div>'+(v.account?'<span class="label" style="color:#0095f6;text-transform:none;letter-spacing:0">@'+esc(v.account)+' &#10003;</span>':'')+(v.caption?'<h3>'+esc(v.caption)+'</h3>':'')+'</button>';
    if(kind==='latest'){
      var tags=(v.tags||[]).filter(Boolean).map(function(t){return '<span class="label">'+esc(t)+'</span>';}).join('');
      return '<button type="button" class="card" data-v="'+k+'" data-kind="wide">'+media+'<span class="play" aria-hidden="true"></span></div>'+
        '<span class="label accent">'+esc(v.date)+'</span><h3>'+esc(v.title)+'</h3><div class="tags">'+tags+'</div>'+
        (v.role?'<p class="role">'+md(v.role)+'</p>':'')+(v.result?'<span class="res">'+esc(v.result)+'</span>':'')+'</button>';
    }
    return '<button type="button" class="card" data-v="'+k+'" data-kind="vertical">'+media+(v.tag?'<span class="badge">'+esc(v.tag)+'</span>':'')+'<span class="play" aria-hidden="true"></span></div>'+
      '<h3>'+esc(v.title)+'</h3></button>';
  }
  function slider(id,items,kind){
    var root=$(id); if(!root) return;
    var track=root.querySelector('.track'), count=root.querySelector('.count');
    track.innerHTML=items.map(function(v){return card(v,kind);}).join('');
    function step(){var c=track.firstElementChild; return c?c.getBoundingClientRect().width+18:300;}
    function upd(){ var n=track.children.length; if(!n||!count) return; count.textContent=Math.min(Math.round(track.scrollLeft/step())+1,n)+' / '+n; }
    root.querySelector('.prev').onclick=function(){track.scrollBy({left:-step(),behavior:reduce?'auto':'smooth'});};
    root.querySelector('.next').onclick=function(){track.scrollBy({left:step(),behavior:reduce?'auto':'smooth'});};
    track.addEventListener('scroll',function(){window.requestAnimationFrame(upd);});
    upd();
  }

  // ---------- video pop-up ----------
  var player=$('player'), frame=player.querySelector('.frame');
  function open(v,kind){
    var id=ytId(v.youtube), ig=String(v.link||'').match(/instagram\.com\/(?:p|reels?|tv)\/([\w-]+)/);
    if(kind==='graphic' && v.embed && /instagram\.com\/([\w.]+\/)?p\//.test(v.link||'')){ var ig=v.link.match(/\/p\/([\w-]+)/); frame.innerHTML='<iframe src="https://www.instagram.com/p/'+ig[1]+'/embed/" allow="autoplay; encrypted-media; fullscreen" allowfullscreen scrolling="no" title="'+esc(v.caption||v.account||'')+'"></iframe><a href="'+esc(v.link)+'" target="_blank" rel="noopener" style="display:block;text-align:center;margin-top:12px;color:#0095f6;font-weight:600;text-decoration:none">View on Instagram &#8599;</a>'; kind='insta'; } else if(kind==='graphic'){ if(v.image){ frame.innerHTML='<img src="'+esc(v.image)+'" alt="'+esc(v.caption)+'">'; } else if(v.link){ window.open(v.link,'_blank','noopener'); return; } else return; }
    else if(id){ frame.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="'+esc(v.title)+'"></iframe>'; }
    else if(v.video){ frame.innerHTML='<video src="'+esc(v.video)+'" controls autoplay playsinline></video>'; }
    else if(ig){ frame.innerHTML='<iframe src="https://www.instagram.com/p/'+ig[1]+'/embed/" allow="autoplay; encrypted-media; fullscreen" allowfullscreen scrolling="no" title="'+esc(v.title)+'"></iframe><a href="'+esc(v.link)+'" target="_blank" rel="noopener" style="display:block;text-align:center;margin-top:12px;color:#0095f6;font-weight:600;text-decoration:none">View on Instagram &#8599;</a>'; kind='insta'; }
    else if(v.link){ window.open(v.link,'_blank','noopener'); return; }
    else return;
    player.classList.toggle('vertical',kind==='vertical'); player.classList.toggle('graphic',kind==='graphic'); player.classList.toggle('insta',kind==='insta');
    player.hidden=false; player.querySelector('.close').focus();
  }
  function close(){ player.hidden=true; frame.innerHTML=''; }
  document.addEventListener('click',function(e){ var c=e.target.closest&&e.target.closest('.card[data-v]'); if(c) open(all[+c.getAttribute('data-v')],c.getAttribute('data-kind')); });
  player.querySelector('.close').addEventListener('click',close);
  player.addEventListener('click',function(e){ if(e.target===player) close(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&!player.hidden) close(); });

  // ---------- About photo slider ----------
  function photoSlider(P){
    var box=$('field'); if(!box||!P.length) return;
    var slides=box.querySelector('.slides'), bars=box.querySelector('.bars'), cap=box.querySelector('.cap'), i=0, t=null;
    slides.innerHTML=''; bars.innerHTML='';
    P.forEach(function(p,k){
      slides.insertAdjacentHTML('beforeend','<div class="slide ph'+(k?'':' on')+'">'+imgTag(p.src)+'</div>');
      bars.insertAdjacentHTML('beforeend','<button type="button" aria-label="Photo '+(k+1)+'"'+(k?'':' class="on"')+'><i></i></button>');
    });
    cap.textContent=P[0].caption||'';
    function show(n){ var s=slides.children,b=bars.children; s[i].classList.remove('on'); b[i].classList.remove('on'); i=(n+s.length)%s.length;
      s[i].classList.add('on'); void b[i].offsetWidth; b[i].classList.add('on'); cap.textContent=P[i].caption||''; }
    function run(){ if(reduce||P.length<2) return; clearInterval(t); t=setInterval(function(){show(i+1);},5500); }
    Array.prototype.forEach.call(bars.children,function(b,k){b.onclick=function(){show(k);run();};});
    run();
  }

  // ---------- copy email ----------
  var btn=$('copy'), toast=$('toast');
  if(btn) btn.addEventListener('click',function(){
    var email=$('email');
    function fallback(){ var r=document.createRange(); r.selectNodeContents(email); var s=window.getSelection(); s.removeAllRanges(); s.addRange(r); toast.textContent='Selected. Press Ctrl/Cmd + C'; }
    try{ navigator.clipboard.writeText(email.textContent.trim()).then(function(){toast.textContent='Copied';},fallback); }catch(e){fallback();}
  });
})();
