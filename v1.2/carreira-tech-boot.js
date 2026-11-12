/* Carreira Tech: carrega os scripts da página em produção (cópias nesta pasta) dentro da casca do protótipo.
   A casca insere a tela depois do carregamento da página, então:
   - DOMContentLoaded não dispara: o atalho abaixo executa na hora o que for registrado depois do load;
   - bootstrap e jQuery são carregados uma vez só (se repetissem, cada clique abriria/fecharia o modal duas vezes);
   - os scripts da página são carregados de novo a cada visita, porque os elementos da tela são recriados. */
(function () {
  if (!window.__ctDomReady) {
    window.__ctDomReady = true;
    var add = document.addEventListener;
    document.addEventListener = function (type, fn, opts) {
      if (type === 'DOMContentLoaded' && document.readyState !== 'loading') { setTimeout(fn, 0); return; }
      return add.call(document, type, fn, opts);
    };
  }

  function load(src, onload) {
    var s = document.createElement('script');
    s.src = src; s.async = false;
    s.onload = s.onerror = onload;
    document.head.appendChild(s);
    return s;
  }
  function sequence(list, done) {
    var i = 0;
    (function next() { if (i >= list.length) return done && done(); load(list[i++], next); })();
  }

  // jQuery antes do bootstrap: assim o bootstrap registra o plugin $.fn.modal, que o diagnóstico usa
  var libs = [];
  if (!window.jQuery && !window.__ctJquery) { window.__ctJquery = true; libs.push('jquery.min.js'); }
  if (!window.__ctBootstrap) { window.__ctBootstrap = true; libs.push('bootstrap.bundle.min.js'); }

  var page = [
    'scroll-to-form.js',
    'carreira-tech-2026-hero-modal.js',
    'carreira-tech-2026-video-carousel.js',
    'o-despertar-modal-palestrantes.js',
    'etapas-abas.js',
    'acervo-modal.js',
    'nosso-impacto-acervo.js',
    'diagnostico-de-carreira.js',
    'carreira-tech.js'
  ];

  var anteriores = window.__ctPageScripts || [];
  anteriores.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });

  function waitLibs(cb) {
    // se as libs ainda estão carregando (outra visita acabou de começar), espera
    (function check() { if (window.bootstrap && window.jQuery) return cb(); setTimeout(check, 30); })();
  }
  sequence(libs, function () {
    waitLibs(function () {
      var nodes = [];
      var i = 0;
      (function next() {
        if (i >= page.length) { window.__ctPageScripts = nodes; return; }
        nodes.push(load(page[i++], next));
      })();
    });
  });
})();
