var e=`/* Carreira Tech (protótipo): comportamentos que a produção resolve no servidor.\r
   - Lista de interesse: valida os campos e mostra a confirmação (sem enviar nada para o ActiveCampaign).\r
   - Links que não existem no protótipo ficam parados (regra geral em app.js). */\r
(function () {\r
  var $ = function (s, c) { return (c || document).querySelector(s); };\r
\r
  var form = $('#fInteresse');\r
  var box = $('#form-container-o-despertar');\r
  var ok = $('#form-sucesso-o-despertar');\r
  if (form && box && ok) {\r
    form.addEventListener('submit', function (e) {\r
      e.preventDefault();\r
      if (!form.checkValidity()) { form.reportValidity(); return; }\r
      box.style.display = 'none';\r
      ok.style.display = 'block';\r
      ok.scrollIntoView({ behavior: 'smooth', block: 'center' });\r
    });\r
  }\r
})();\r
\r
/* mobile: mantém a aba ativa visível no carrossel de trilhas */\r
document.addEventListener('shown.bs.tab', function (e) {\r
  var t = e.target;\r
  if (t && t.classList && t.classList.contains('hero-pill') && t.scrollIntoView) {\r
    t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });\r
  }\r
});\r
\r
/* abas das trilhas: no desktop, arrastar com o mouse rola na horizontal (no toque o navegador já rola) */\r
(function () {\r
  var p = document.querySelector('.hero-pills');\r
  if (!p || p.dataset.arrastar) return;\r
  p.dataset.arrastar = '1';\r
  var baixo = false, moveu = false, x0 = 0, l0 = 0;\r
  p.addEventListener('pointerdown', function (e) {\r
    if (e.pointerType !== 'mouse' || e.button !== 0) return;\r
    baixo = true; moveu = false; x0 = e.clientX; l0 = p.scrollLeft;\r
  });\r
  p.addEventListener('pointermove', function (e) {\r
    if (!baixo) return;\r
    var dx = e.clientX - x0;\r
    if (!moveu && Math.abs(dx) > 5) { moveu = true; p.classList.add('is-arrastando'); p.setPointerCapture(e.pointerId); }\r
    if (moveu) p.scrollLeft = l0 - dx;\r
  });\r
  function soltar() { baixo = false; p.classList.remove('is-arrastando'); }\r
  p.addEventListener('pointerup', soltar);\r
  p.addEventListener('pointercancel', soltar);\r
  // depois de arrastar, o clique não troca de trilha\r
  p.addEventListener('click', function (e) { if (moveu) { e.preventDefault(); e.stopPropagation(); moveu = false; } }, true);\r
})();\r
`;export{e as default};