var e=`/* Carreira Tech: carrega os scripts da página em produção (cópias nesta pasta) dentro da casca do protótipo.\r
   A casca insere a tela depois do carregamento da página, então:\r
   - DOMContentLoaded não dispara: o atalho abaixo executa na hora o que for registrado depois do load;\r
   - bootstrap e jQuery são carregados uma vez só (se repetissem, cada clique abriria/fecharia o modal duas vezes);\r
   - os scripts da página são carregados de novo a cada visita, porque os elementos da tela são recriados. */\r
(function () {\r
  if (!window.__ctDomReady) {\r
    window.__ctDomReady = true;\r
    var add = document.addEventListener;\r
    document.addEventListener = function (type, fn, opts) {\r
      if (type === 'DOMContentLoaded' && document.readyState !== 'loading') { setTimeout(fn, 0); return; }\r
      return add.call(document, type, fn, opts);\r
    };\r
  }\r
\r
  function load(src, onload) {\r
    var s = document.createElement('script');\r
    s.src = src; s.async = false;\r
    s.onload = s.onerror = onload;\r
    document.head.appendChild(s);\r
    return s;\r
  }\r
  function sequence(list, done) {\r
    var i = 0;\r
    (function next() { if (i >= list.length) return done && done(); load(list[i++], next); })();\r
  }\r
\r
  // jQuery antes do bootstrap: assim o bootstrap registra o plugin $.fn.modal, que o diagnóstico usa\r
  var libs = [];\r
  if (!window.jQuery && !window.__ctJquery) { window.__ctJquery = true; libs.push('jquery.min.js'); }\r
  if (!window.__ctBootstrap) { window.__ctBootstrap = true; libs.push('bootstrap.bundle.min.js'); }\r
\r
  var page = [\r
    'scroll-to-form.js',\r
    'carreira-tech-2026-hero-modal.js',\r
    'carreira-tech-2026-video-carousel.js',\r
    'o-despertar-modal-palestrantes.js',\r
    'etapas-abas.js',\r
    'acervo-modal.js',\r
    'nosso-impacto-acervo.js',\r
    'diagnostico-de-carreira.js',\r
    'carreira-tech.js'\r
  ];\r
\r
  var anteriores = window.__ctPageScripts || [];\r
  anteriores.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });\r
\r
  function waitLibs(cb) {\r
    // se as libs ainda estão carregando (outra visita acabou de começar), espera\r
    (function check() { if (window.bootstrap && window.jQuery) return cb(); setTimeout(check, 30); })();\r
  }\r
  sequence(libs, function () {\r
    waitLibs(function () {\r
      var nodes = [];\r
      var i = 0;\r
      (function next() {\r
        if (i >= page.length) { window.__ctPageScripts = nodes; return; }\r
        nodes.push(load(page[i++], next));\r
      })();\r
    });\r
  });\r
})();\r
`;export{e as default};