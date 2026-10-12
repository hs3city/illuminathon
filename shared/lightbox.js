/* Lightbox: klik w zdjęcie z .foto-pas / .galeria → pełny ekran (wersja -1600), ←/→, Esc lub klik w tło zamyka. Bez bibliotek. */
(function(){
  var grupy=document.querySelectorAll('.foto-pas,.galeria');
  if(!grupy.length)return;
  var box,img,btnX,btnP,btnN,licz,lista=[],idx=0,opener=null;

  function duze(src){return src.replace(/-800(\.\w+)$/,'-1600$1');}
  function zbuduj(){
    box=document.createElement('div');
    box.className='lb';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Powiększone zdjęcie');box.hidden=true;
    box.innerHTML='<button type="button" class="lb-x" aria-label="Zamknij"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
      '<button type="button" class="lb-p" aria-label="Poprzednie zdjęcie">‹</button>'+
      '<img class="lb-img" alt="">'+
      '<button type="button" class="lb-n" aria-label="Następne zdjęcie">›</button>'+
      '<p class="lb-licz" aria-live="polite"></p>';
    var st=document.createElement('style');
    st.textContent='.lb{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;background:rgba(6,7,16,.94);padding:clamp(12px,4vw,56px)}'+
      '.lb[hidden]{display:none}.lb-img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;border-radius:10px;box-shadow:0 20px 80px rgba(0,0,0,.6)}'+
      '.lb button{position:absolute;display:grid;place-items:center;width:48px;height:48px;border-radius:50%;border:1px solid rgba(234,228,246,.3);background:rgba(13,15,29,.7);color:#FCF9FF;font:300 30px/1 system-ui,sans-serif;cursor:pointer}'+
      '.lb button:hover{border-color:#CCFF00;color:#CCFF00}.lb .lb-x{top:16px;right:16px;width:44px;height:44px;padding:0;line-height:1;display:flex;align-items:center;justify-content:center;background:rgba(13,15,29,.9);border-color:rgba(252,249,255,.55)}.lb-x svg{display:block}.lb-p{left:14px;top:50%;margin-top:-24px}.lb-n{right:14px;top:50%;margin-top:-24px}'+
      '.lb-licz{position:absolute;bottom:14px;left:0;right:0;text-align:center;margin:0;font:11px/1 ui-monospace,monospace;letter-spacing:.2em;color:#B8A3C3}';
    document.head.appendChild(st);document.body.appendChild(box);
    img=box.querySelector('.lb-img');btnX=box.querySelector('.lb-x');btnP=box.querySelector('.lb-p');btnN=box.querySelector('.lb-n');licz=box.querySelector('.lb-licz');
    btnX.onclick=zamknij;btnP.onclick=function(e){e.stopPropagation();idz(-1);};btnN.onclick=function(e){e.stopPropagation();idz(1);};
    box.addEventListener('click',function(e){if(e.target===box)zamknij();});
    document.addEventListener('keydown',function(e){
      if(box.hidden)return;
      if(e.key==='Escape')zamknij();
      else if(e.key==='ArrowLeft')idz(-1);
      else if(e.key==='ArrowRight')idz(1);
      else if(e.key==='Tab'){var f=[btnX,btnP,btnN],i=f.indexOf(document.activeElement);e.preventDefault();f[(i+(e.shiftKey?-1:1)+3)%3].focus();}
    });
  }
  function pokaz(){
    var el=lista[idx];img.src=duze(el.currentSrc&&/-800\./.test(el.src)?el.src:el.src);img.alt=el.alt||'';
    licz.textContent=(idx+1)+' / '+lista.length;
    var wiele=lista.length>1;btnP.hidden=btnN.hidden=!wiele;
  }
  function idz(d){idx=(idx+d+lista.length)%lista.length;pokaz();}
  function otworz(grupa,el){
    if(!box)zbuduj();
    lista=[].slice.call(document.querySelectorAll('.foto-pas img,.galeria img'));idx=lista.indexOf(el);opener=el;
    pokaz();box.hidden=false;document.documentElement.style.overflow='hidden';btnX.focus();
  }
  function zamknij(){box.hidden=true;img.removeAttribute('src');document.documentElement.style.overflow='';if(opener)opener.focus();}

  [].forEach.call(grupy,function(g){
    [].forEach.call(g.querySelectorAll('img'),function(el){
      el.setAttribute('tabindex','0');el.setAttribute('role','button');
      el.setAttribute('aria-label','Powiększ: '+(el.alt||'zdjęcie'));
      el.addEventListener('click',function(){otworz(g,el);});
      el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();otworz(g,el);}});
    });
  });
})();
