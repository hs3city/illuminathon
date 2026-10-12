/* Poświata kursora + „światło” odsłaniające mapę.
   Mysz: poświata podąża za kursorem z lekkim opóźnieniem.
   Dotyk / brak kursora: wolny dryf po ekranie (latarnia), ok. 30 kl/s, start po załadowaniu strony.
   prefers-reduced-motion: jedno stałe miejsce, bez animacji.

   Wydajność: wszystko, co się rusza, rusza się TYLKO transformem (kompozytor).
   Mapa: .okno (okrągłe okienko z maską) przesuwa się za światłem, a kopia mapy w środku
   przesuwa się odwrotnie, więc rysunek stoi w miejscu, a odsłania się tylko jego fragment. */
(function(){
  var root=document.documentElement;
  var precyzyjny=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var spokoj=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var okno=document.querySelector('.okno');          /* opcjonalne: tylko strona główna */
  var dim=okno&&okno.parentNode.querySelector('.dim');
  var lit=okno&&okno.querySelector('.lit');
  var R=okno?parseFloat(getComputedStyle(okno).width)/2:0;
  var W=innerWidth,H=innerHeight;
  var tx=W*0.62,ty=H*0.38,x=tx,y=ty,raf=0,t0=performance.now(),ostatni=0;
  var box={l:0,t:0};                                  /* pozycja .miasto w viewporcie (cache) */

  function zmierz(){
    W=innerWidth;H=innerHeight;
    if(!okno)return;
    var m=okno.parentNode.getBoundingClientRect(),d=dim.getBoundingClientRect();
    box.l=m.left;box.t=m.top;
    /* kopia mapy w oknie dostaje dokładnie geometrię kopii przygaszonej */
    lit.style.left=(d.left-m.left)+'px';lit.style.top=(d.top-m.top)+'px';
    lit.style.width=d.width+'px';lit.style.height=d.height+'px';
  }
  function ustaw(){
    root.style.setProperty('--mx',x.toFixed(1)+'px');
    root.style.setProperty('--my',y.toFixed(1)+'px');
    if(!okno)return;
    var sx=x-box.l,sy=y-box.t;
    okno.style.transform='translate('+(sx-R).toFixed(1)+'px,'+(sy-R).toFixed(1)+'px)';
    lit.style.transform='translate('+(R-sx).toFixed(1)+'px,'+(R-sy).toFixed(1)+'px)';
  }
  function krok(){
    x+=(tx-x)*0.16;y+=(ty-y)*0.16;ustaw();
    if(Math.abs(tx-x)>0.4||Math.abs(ty-y)>0.4){raf=requestAnimationFrame(krok);}else{raf=0;}
  }
  function dryf(now){
    raf=requestAnimationFrame(dryf);
    if(now-ostatni<33)return;                         /* ~30 kl/s wystarczy dla mgły */
    ostatni=now;
    var t=(now-t0)/1000;
    x=W*(0.55+0.28*Math.sin(t*0.21));
    y=H*(0.40+0.18*Math.sin(t*0.33+1.3));
    ustaw();
  }
  function stop(){if(raf){cancelAnimationFrame(raf);raf=0;}}

  zmierz();
  addEventListener('resize',function(){zmierz();ustaw();},{passive:true});
  addEventListener('scroll',function(){zmierz();if(precyzyjny&&!raf)raf=requestAnimationFrame(krok);},{passive:true});

  if(spokoj){x=W*0.5;y=H*0.3;ustaw();return;}

  if(precyzyjny){
    addEventListener('pointermove',function(e){
      tx=e.clientX;ty=e.clientY;
      if(!raf)raf=requestAnimationFrame(krok);
    },{passive:true});
    ustaw();
  }else{
    ustaw();
    /* dryf dopiero gdy strona załadowana i karta widoczna — nie konkuruje z pierwszym renderem */
    function start(){if(!raf&&!document.hidden)raf=requestAnimationFrame(dryf);}
    document.addEventListener('visibilitychange',function(){document.hidden?stop():start();});
    if(document.readyState==='complete')setTimeout(start,1500);
    else addEventListener('load',function(){setTimeout(start,1500);});
  }
})();
