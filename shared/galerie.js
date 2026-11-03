/* Pełne galerie autorów (dane: shared/galerie-dane.js, generuje _galerie.py).
   Przycisk [data-galeria] → okno z siatką wszystkich zdjęć → klik → podgląd pełnoekranowy (←/→, swipe, Esc).
   Kafle podglądu w .galeria[data-galeria] otwierają ten sam podgląd. Link #galeria-<klucz> otwiera galerię od razu. Bez bibliotek. */
(function(){
  var G=window.GALERIE;if(!G)return;
  var BAZA='assets/foto/2026/galeria/';
  var okno,siatka,tyt,aut,pod,pImg,pLicz,pP,pN,klucz=null,idx=0,opener=null,wHistorii=false;

  function zdj(n){var r=n%100,j=n%10;if(n===1)return 'zdjęcie';if(j>=2&&j<=4&&(r<12||r>14))return 'zdjęcia';return 'zdjęć';}
  function src(k,nr,b){return BAZA+k+'/'+nr+'-'+b+'.webp';}

  function zbuduj(){
    var st=document.createElement('style');
    st.textContent=
      '.gal{position:fixed;inset:0;z-index:190;background:#0b0d1c;overflow-y:auto;overscroll-behavior:contain}'+
      '.gal[hidden],.galp[hidden]{display:none}'+
      '.gal-head{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:16px;padding:calc(14px + env(safe-area-inset-top,0px)) clamp(16px,4vw,48px) 14px;background:rgba(11,13,28,.94);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid rgba(234,228,246,.12)}'+
      '.gal-head h2{margin:0;font-size:clamp(18px,2.2vw,24px);line-height:1.2}'+
      '.gal-head p{margin:4px 0 0;font:11px/1.4 var(--mono,ui-monospace,monospace);letter-spacing:.14em;text-transform:uppercase;color:#B8A3C3}'+
      '.gal-head .gal-x{margin-left:auto;flex:none}'+
      '.gal-x,.galp button{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;border:1px solid rgba(252,249,255,.45);background:rgba(13,15,29,.9);color:#FCF9FF;cursor:pointer;padding:0;font:300 30px/1 system-ui,sans-serif}'+
      '.gal-x:hover,.galp button:hover{border-color:#CCFF00;color:#CCFF00}'+
      '.gal-siatka{list-style:none;margin:0;padding:clamp(14px,3vw,40px) clamp(16px,4vw,48px) 60px;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:clamp(8px,1.2vw,14px)}'+
      '@media (max-width:640px){.gal-siatka{grid-template-columns:repeat(2,1fr)}}'+
      '.gal-siatka li{margin:0}.gal-siatka button{display:block;width:100%;aspect-ratio:3/2;padding:0;border:0;border-radius:10px;overflow:hidden;background:#1a1d36;cursor:zoom-in}'+
      '.gal-siatka img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease}'+
      '.gal-siatka button:hover img{transform:scale(1.04)}.gal-siatka button:focus-visible{outline:2px solid #CCFF00;outline-offset:2px}'+
      '.galp{position:fixed;inset:0;z-index:210;display:flex;align-items:center;justify-content:center;background:rgba(6,7,16,.96);padding:clamp(12px,4vw,56px);touch-action:pan-y}'+
      '.galp img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;border-radius:8px;box-shadow:0 20px 80px rgba(0,0,0,.6)}'+
      '.galp button{position:absolute}.galp .galp-x{top:calc(16px + env(safe-area-inset-top,0px));right:16px}'+
      '.galp-p,.galp-n{top:50%;margin-top:-24px;width:48px!important;height:48px!important}.galp-p{left:14px}.galp-n{right:14px}'+
      '.galp-licz{position:absolute;bottom:calc(14px + env(safe-area-inset-bottom,0px));left:0;right:0;text-align:center;margin:0;font:11px/1 ui-monospace,monospace;letter-spacing:.2em;color:#B8A3C3}'+
      '.galeria-otworz{margin-top:4px}';
    document.head.appendChild(st);
    var X='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    okno=document.createElement('div');okno.className='gal';okno.hidden=true;
    okno.setAttribute('role','dialog');okno.setAttribute('aria-modal','true');okno.setAttribute('aria-labelledby','gal-tyt');
    okno.innerHTML='<div class="gal-head"><div><h2 id="gal-tyt"></h2><p class="gal-aut"></p></div><button type="button" class="gal-x" aria-label="Zamknij galerię">'+X+'</button></div><ul class="gal-siatka"></ul>';
    pod=document.createElement('div');pod.className='galp';pod.hidden=true;
    pod.setAttribute('role','dialog');pod.setAttribute('aria-modal','true');pod.setAttribute('aria-label','Powiększone zdjęcie');
    pod.innerHTML='<button type="button" class="galp-x" aria-label="Zamknij zdjęcie">'+X+'</button><button type="button" class="galp-p" aria-label="Poprzednie zdjęcie">‹</button><img alt=""><button type="button" class="galp-n" aria-label="Następne zdjęcie">›</button><p class="galp-licz" aria-live="polite"></p>';
    document.body.appendChild(okno);document.body.appendChild(pod);
    siatka=okno.querySelector('.gal-siatka');tyt=okno.querySelector('h2');aut=okno.querySelector('.gal-aut');
    pImg=pod.querySelector('img');pLicz=pod.querySelector('.galp-licz');pP=pod.querySelector('.galp-p');pN=pod.querySelector('.galp-n');
    okno.querySelector('.gal-x').onclick=function(){zamknijOkno(true);};
    pod.querySelector('.galp-x').onclick=zamknijPod;
    pP.onclick=function(e){e.stopPropagation();idz(-1);};pN.onclick=function(e){e.stopPropagation();idz(1);};
    pod.addEventListener('click',function(e){if(e.target===pod)zamknijPod();});
    siatka.addEventListener('click',function(e){var b=e.target.closest('button[data-i]');if(b)otworzPod(klucz,+b.dataset.i,b);});
    var x0=null;
    pod.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
    pod.addEventListener('touchend',function(e){if(x0===null)return;var d=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(d)>50)idz(d<0?1:-1);});
    document.addEventListener('keydown',function(e){
      if(!pod.hidden){
        if(e.key==='Escape')zamknijPod();else if(e.key==='ArrowLeft')idz(-1);else if(e.key==='ArrowRight')idz(1);
        else if(e.key==='Tab'){var f=[pod.querySelector('.galp-x'),pP,pN],i=f.indexOf(document.activeElement);e.preventDefault();f[(i+(e.shiftKey?-1:1)+3)%3].focus();}
      }else if(!okno.hidden&&e.key==='Escape')zamknijOkno(true);
    });
    window.addEventListener('popstate',function(){if(!okno.hidden&&wHistorii){wHistorii=false;zamknijOkno(false);}});
  }

  function wypelnij(k){
    var g=G[k];klucz=k;tyt.textContent=g.tytul;
    aut.textContent='fot. '+g.autor+' · '+g.zdjecia.length+' '+zdj(g.zdjecia.length);
    var h='';g.zdjecia.forEach(function(z,i){
      h+='<li><button type="button" data-i="'+i+'" aria-label="Zdjęcie '+(i+1)+' z '+g.zdjecia.length+'"><img src="'+src(k,z[0],400)+'" alt="" loading="lazy" decoding="async" width="'+z[1]+'" height="'+z[2]+'"></button></li>';
    });
    siatka.innerHTML=h;
  }
  function otworzOkno(k,el,bezHistorii){
    if(!G[k])return;if(!okno)zbuduj();
    if(klucz!==k||!siatka.children.length)wypelnij(k);
    opener=el||null;okno.hidden=false;okno.scrollTop=0;document.documentElement.style.overflow='hidden';
    if(!bezHistorii&&!wHistorii){history.pushState({gal:k},'','#galeria-'+k);wHistorii=true;}
    okno.querySelector('.gal-x').focus();
  }
  function zamknijOkno(cofnij){
    okno.hidden=true;document.documentElement.style.overflow='';
    if(cofnij&&wHistorii){wHistorii=false;history.back();}
    else if(location.hash.indexOf('#galeria-')===0&&G[location.hash.slice(9)])history.replaceState(null,'',location.pathname+location.search+'#galeria-2026');
    if(opener)opener.focus();
  }
  var podOpener=null;
  function pokaz(){
    var z=G[klucz].zdjecia,n=z.length;pImg.src=src(klucz,z[idx][0],1600);pImg.alt='fot. '+G[klucz].autor+', zdjęcie '+(idx+1)+' z '+n;
    pLicz.textContent=(idx+1)+' / '+n;
    [idx+1,idx-1].forEach(function(j){var q=z[(j+n)%n];(new Image()).src=src(klucz,q[0],1600);});
  }
  function idz(d){var n=G[klucz].zdjecia.length;idx=(idx+d+n)%n;pokaz();}
  function otworzPod(k,i,el){
    if(!okno)zbuduj();if(klucz!==k)wypelnij(k);
    idx=i;podOpener=el||null;pokaz();pod.hidden=false;document.documentElement.style.overflow='hidden';pod.querySelector('.galp-x').focus();
  }
  function zamknijPod(){
    pod.hidden=true;pImg.removeAttribute('src');
    if(okno.hidden)document.documentElement.style.overflow='';
    if(podOpener)podOpener.focus();
  }

  /* przyciski „Otwórz galerię” */
  [].forEach.call(document.querySelectorAll('[data-galeria-otworz]'),function(b){
    var k=b.getAttribute('data-galeria-otworz');if(!G[k]){b.hidden=true;return;}
    var n=G[k].zdjecia.length,l=b.querySelector('.ile');if(l)l.textContent=n+' '+zdj(n);
    b.addEventListener('click',function(){otworzOkno(k,b);});
  });
  /* kafle podglądu → ten sam podgląd pełnoekranowy, od klikniętego zdjęcia (przejmuje klik przed shared/lightbox.js) */
  [].forEach.call(document.querySelectorAll('.galeria[data-galeria]'),function(ul){
    var k=ul.getAttribute('data-galeria');if(!G[k])return;
    function start(e){
      var im=e.target.closest('img');if(!im)return;
      if(e.type==='keydown'&&e.key!=='Enter'&&e.key!==' ')return;
      e.preventDefault();e.stopPropagation();
      var nr=im.getAttribute('data-nr'),i=0;
      G[k].zdjecia.forEach(function(z,j){if(z[0]===nr)i=j;});
      otworzPod(k,i,im);
    }
    ul.addEventListener('click',start,true);ul.addEventListener('keydown',start,true);
  });
  /* wejście z linku #galeria-mw / #galeria-og / #galeria-lb */
  var h=location.hash.slice(1);
  if(h.indexOf('galeria-')===0&&G[h.slice(8)]){var k0=h.slice(8);history.replaceState(null,'',location.pathname+location.search+'#galeria-2026');history.pushState({gal:k0},'','#galeria-'+k0);wHistorii=true;otworzOkno(k0,null,true);}
})();
