/* Acesso ao Portal de Talentos: único lugar para ligar o acesso.
   Para liberar tudo: PORTAL_ENABLED = true e preencher PORTAL_URL. */
(function(){
  var PORTAL_ENABLED=false;
  var PORTAL_URL='#';

  function apply(){
    Array.prototype.forEach.call(document.querySelectorAll('[data-portal]'),function(el){
      var soon=el.querySelector('.badge');
      if(PORTAL_ENABLED){
        el.setAttribute('href',PORTAL_URL);
        el.removeAttribute('role');el.removeAttribute('aria-disabled');el.removeAttribute('tabindex');
        el.classList.remove('is-soon');
        if(soon)soon.hidden=true;
      }else{
        el.removeAttribute('href');
        el.setAttribute('role','link');el.setAttribute('aria-disabled','true');el.tabIndex=0;
        el.classList.add('is-soon');
        if(soon)soon.hidden=false;
        el.addEventListener('click',function(e){e.preventDefault()});
        el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')e.preventDefault()});
      }
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  window.SCTEC_PORTAL={enabled:PORTAL_ENABLED,url:PORTAL_URL};
})();
