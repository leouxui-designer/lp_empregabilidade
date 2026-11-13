var e=`(function(){\r
  var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};\r
\r
  // Âncoras da página (#interesse, #conteudo): na casca o hash do endereço é a rota do protótipo, então em vez de trocar o hash rola até o elemento.\r
  if(!window.SCTEC_ANCORAS){window.SCTEC_ANCORAS=true;document.addEventListener('click',function(e){\r
    var a=e.target.closest&&e.target.closest('a[href^="#"]'); if(!a) return;\r
    var id=a.getAttribute('href').slice(1); if(!id||id.charAt(0)==='/') return;\r
    var alvo=document.getElementById(id); if(!alvo) return;\r
    e.preventDefault(); alvo.style.scrollMarginTop='96px';\r
    alvo.scrollIntoView({behavior:'instant',block:'start'}); alvo.setAttribute('tabindex','-1'); alvo.focus({preventScroll:true});\r
  })}\r
\r
  // Links que ainda não existem no protótipo (href="#") ficam parados: só navegam os links das telas do protótipo (#/rota).\r
  if(!window.SCTEC_LINKS_VAZIOS){window.SCTEC_LINKS_VAZIOS=true;document.addEventListener('click',function(e){\r
    var a=e.target.closest&&e.target.closest('a[href="#"]'); if(a) e.preventDefault();\r
  })}\r
\r
  // header do SCTEC: menu mobile e posição sob a barra gov\r
  // Delegado no document: na casca a tela é injetada depois deste script, então o botão ainda não existe aqui.\r
  function fechaMenu(){var c=$('#navbarNavDropdown'),b=$('.navbar-toggler');if(c)c.classList.remove('show');if(b)b.setAttribute('aria-expanded','false');document.body.classList.remove('menu-mobile-open')}\r
  if(!window.SCTEC_MENU_MOBILE){window.SCTEC_MENU_MOBILE=true;document.addEventListener('click',function(e){\r
    var t=e.target.closest&&e.target.closest('.navbar-toggler');\r
    if(t){var col=$('#navbarNavDropdown'); if(!col) return; var o=col.classList.toggle('show');t.setAttribute('aria-expanded',o);document.body.classList.toggle('menu-mobile-open',o);return}\r
    if(e.target.closest&&e.target.closest('#navbarNavDropdown a:not([data-portal])')) fechaMenu();\r
  })}\r
  function pos(){var topo=$('header.topo'); if(topo) topo.style.top=Math.max(0,60-window.scrollY)+'px'}\r
  window.addEventListener('scroll',pos,{passive:true});pos();\r
  var nl=$('#_form_6AE1BDD309B06_'); if(nl) nl.addEventListener('submit',function(e){e.preventDefault()});\r
\r
  // roving tabs helper\r
  function tabs(list,onSel){\r
    var t=$$('[role=tab]',list);\r
    function sel(tab,focus){\r
      t.forEach(function(x){var on=x===tab;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;var p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=!on});\r
      if(focus)tab.focus(); if(onSel)onSel(tab);\r
    }\r
    t.forEach(function(x,i){\r
      x.addEventListener('click',function(){sel(x)});\r
      x.addEventListener('keydown',function(e){\r
        var k=e.key,n=null;\r
        if(k==='ArrowRight'||k==='ArrowDown')n=t[(i+1)%t.length];\r
        else if(k==='ArrowLeft'||k==='ArrowUp')n=t[(i-1+t.length)%t.length];\r
        else if(k==='Home')n=t[0]; else if(k==='End')n=t[t.length-1];\r
        if(n){e.preventDefault();sel(n,true)}\r
      });\r
    });\r
  }\r
  var seg=$('#seg');\r
  if(seg){\r
    tabs(seg,function(t){t.scrollIntoView({block:'nearest'})});\r
    $('#t1').tabIndex=0;\r
  }\r
\r
  // accordion\r
  $$('[data-acc]').forEach(function(acc){\r
    $$('button[aria-expanded]',acc).forEach(function(b){\r
      b.addEventListener('click',function(){\r
        var o=b.getAttribute('aria-expanded')==='true';\r
        b.setAttribute('aria-expanded',!o);\r
        document.getElementById(b.getAttribute('aria-controls')).hidden=o;\r
      });\r
    });\r
  });\r
\r
  // vídeo do hero: troca a thumb pelo player no mesmo tamanho\r
  var hv=$('#heroVideo');\r
  if(hv){var vt=$('.video-thumb',hv);vt.addEventListener('click',function(){\r
    var v=document.createElement('video');v.src='video-empresas.webm';v.controls=true;v.autoplay=true;v.playsInline=true;\r
    v.setAttribute('aria-label','Vídeo de apresentação para empresas');\r
    hv.replaceChild(v,vt);v.play().catch(function(){});v.focus();\r
  })}\r
\r
  // portal disabled\r
  var pb=$('#portalBtn'); if(pb) pb.addEventListener('click',function(e){e.preventDefault()});\r
\r
  // form\r
  var f=$('#fEmp'); if(!f) return;\r
  var box=$('#formbox');\r
  function bad(el,isBad){var w=el.closest('.fld');w.classList.toggle('bad',isBad);if(el.setAttribute)el.setAttribute('aria-invalid',isBad)}\r
  function cnpjOk(v){return v.replace(/\\D/g,'').length===14}\r
  f.addEventListener('submit',function(e){\r
    e.preventDefault();\r
    var first=null,ok=true;\r
    ['nome','resp','cargo'].forEach(function(i){var el=$('#'+i);var b=!el.value.trim();bad(el,b);if(b){ok=false;first=first||el}});\r
    var c=$('#cnpj');var bc=!cnpjOk(c.value);bad(c,bc);if(bc){ok=false;first=first||c}\r
    ["segmento","porte"].forEach(function(i){var el=$('#'+i);var b=!el.value;bad(el,b);if(b){ok=false;first=first||el}});\r
    var m=$('#mail'),m2=$('#mail2');\r
    var bm=!/^\\S+@\\S+\\.\\S+$/.test(m.value);bad(m,bm);if(bm){ok=false;first=first||m}\r
    var bm2=m2.value.trim().toLowerCase()!==m.value.trim().toLowerCase()||!m2.value;bad(m2,bm2);if(bm2){ok=false;first=first||m2}\r
    var t=$('#tel');var bt=t.value.replace(/\\D/g,'').length<10;bad(t,bt);if(bt){ok=false;first=first||t}\r
    var any=$$('[name=perfil]:checked').length>0, fs=$('#perfis');\r
    fs.classList.toggle('bad',!any);if(!any){ok=false;first=first||$('[name=perfil]')}\r
    if(!ok){first.focus();return}\r
    box.classList.add('sent');var s=$('#okEmp');s.focus();\r
  });\r
  $('#again').addEventListener('click',function(){f.reset();box.classList.remove('sent');$('#nome').focus()});\r
  $$('input,select',f).forEach(function(el){el.addEventListener('input',function(){var w=el.closest('.fld');if(w)w.classList.remove('bad')})});\r
})();\r
`;export{e as default};