(function(){
  var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  // header do SCTEC: menu mobile e posição sob a barra gov
  var tg=$('.navbar-toggler'), col=$('#navbarNavDropdown'), topo=$('header.topo');
  if(tg&&col) tg.addEventListener('click',function(){var o=col.classList.toggle('show');tg.setAttribute('aria-expanded',o);document.body.classList.toggle('menu-mobile-open',o)});
  function pos(){if(topo) topo.style.top=Math.max(0,60-window.scrollY)+'px'}
  window.addEventListener('scroll',pos,{passive:true});pos();
  var nl=$('#_form_6AE1BDD309B06_'); if(nl) nl.addEventListener('submit',function(e){e.preventDefault()});

  // roving tabs helper
  function tabs(list,onSel){
    var t=$$('[role=tab]',list);
    function sel(tab,focus){
      t.forEach(function(x){var on=x===tab;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;var p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=!on});
      if(focus)tab.focus(); if(onSel)onSel(tab);
    }
    t.forEach(function(x,i){
      x.addEventListener('click',function(){sel(x)});
      x.addEventListener('keydown',function(e){
        var k=e.key,n=null;
        if(k==='ArrowRight'||k==='ArrowDown')n=t[(i+1)%t.length];
        else if(k==='ArrowLeft'||k==='ArrowUp')n=t[(i-1+t.length)%t.length];
        else if(k==='Home')n=t[0]; else if(k==='End')n=t[t.length-1];
        if(n){e.preventDefault();sel(n,true)}
      });
    });
  }
  var seg=$('#seg');
  if(seg){
    tabs(seg);
    $('#t1').tabIndex=0;
  }

  // accordion
  $$('[data-acc]').forEach(function(acc){
    $$('button[aria-expanded]',acc).forEach(function(b){
      b.addEventListener('click',function(){
        var o=b.getAttribute('aria-expanded')==='true';
        b.setAttribute('aria-expanded',!o);
        document.getElementById(b.getAttribute('aria-controls')).hidden=o;
      });
    });
  });

  // vídeo do hero: troca a thumb pelo player no mesmo tamanho
  var hv=$('#heroVideo');
  if(hv){var vt=$('.video-thumb',hv);vt.addEventListener('click',function(){
    var v=document.createElement('video');v.src='video-empresas.webm';v.controls=true;v.autoplay=true;v.playsInline=true;
    v.setAttribute('aria-label','Vídeo de apresentação para empresas');
    hv.replaceChild(v,vt);v.play().catch(function(){});v.focus();
  })}

  // portal disabled
  var pb=$('#portalBtn'); if(pb) pb.addEventListener('click',function(e){e.preventDefault()});

  // form
  var f=$('#fEmp'); if(!f) return;
  var box=$('#formbox');
  function bad(el,isBad){var w=el.closest('.fld');w.classList.toggle('bad',isBad);if(el.setAttribute)el.setAttribute('aria-invalid',isBad)}
  function cnpjOk(v){return v.replace(/\D/g,'').length===14}
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var first=null,ok=true;
    ['nome','resp','cargo'].forEach(function(i){var el=$('#'+i);var b=!el.value.trim();bad(el,b);if(b){ok=false;first=first||el}});
    var c=$('#cnpj');var bc=!cnpjOk(c.value);bad(c,bc);if(bc){ok=false;first=first||c}
    ["segmento","porte"].forEach(function(i){var el=$('#'+i);var b=!el.value;bad(el,b);if(b){ok=false;first=first||el}});
    var m=$('#mail'),m2=$('#mail2');
    var bm=!/^\S+@\S+\.\S+$/.test(m.value);bad(m,bm);if(bm){ok=false;first=first||m}
    var bm2=m2.value.trim().toLowerCase()!==m.value.trim().toLowerCase()||!m2.value;bad(m2,bm2);if(bm2){ok=false;first=first||m2}
    var t=$('#tel');var bt=t.value.replace(/\D/g,'').length<10;bad(t,bt);if(bt){ok=false;first=first||t}
    var any=$$('[name=perfil]:checked').length>0, fs=$('#perfis');
    fs.classList.toggle('bad',!any);if(!any){ok=false;first=first||$('[name=perfil]')}
    if(!ok){first.focus();return}
    box.classList.add('sent');var s=$('#okEmp');s.focus();
  });
  $('#again').addEventListener('click',function(){f.reset();box.classList.remove('sent');$('#nome').focus()});
  $$('input,select',f).forEach(function(el){el.addEventListener('input',function(){var w=el.closest('.fld');if(w)w.classList.remove('bad')})});
})();
