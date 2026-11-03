var e=`/* Acesso ao Portal de Talentos: único lugar para ligar o acesso.\r
   Para liberar tudo: PORTAL_ENABLED = true e preencher PORTAL_URL. */\r
(function(){\r
  var PORTAL_ENABLED=false;\r
  var PORTAL_URL='#';\r
\r
  function apply(){\r
    Array.prototype.forEach.call(document.querySelectorAll('[data-portal]'),function(el){\r
      var soon=el.querySelector('.badge');\r
      if(PORTAL_ENABLED){\r
        el.setAttribute('href',PORTAL_URL);\r
        el.removeAttribute('role');el.removeAttribute('aria-disabled');el.removeAttribute('tabindex');\r
        el.classList.remove('is-soon');\r
        if(soon)soon.hidden=true;\r
      }else{\r
        el.removeAttribute('href');\r
        el.setAttribute('role','link');el.setAttribute('aria-disabled','true');el.tabIndex=0;\r
        el.classList.add('is-soon');\r
        if(soon)soon.hidden=false;\r
        el.addEventListener('click',function(e){e.preventDefault()});\r
        el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')e.preventDefault()});\r
      }\r
    });\r
  }\r
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();\r
  window.SCTEC_PORTAL={enabled:PORTAL_ENABLED,url:PORTAL_URL};\r
})();\r
`;export{e as default};