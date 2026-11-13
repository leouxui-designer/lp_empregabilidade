/* Carreira Tech (protótipo): comportamentos que a produção resolve no servidor.
   - Lista de interesse: valida os campos e mostra a confirmação (sem enviar nada para o ActiveCampaign).
   - Links que não existem no protótipo ficam parados (regra geral em app.js). */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };

  var form = $('#fInteresse');
  var box = $('#form-container-o-despertar');
  var ok = $('#form-sucesso-o-despertar');
  if (form && box && ok) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      box.style.display = 'none';
      ok.style.display = 'block';
      ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
})();

/* mobile: mantém a aba ativa visível no carrossel de trilhas */
document.addEventListener('shown.bs.tab', function (e) {
  var t = e.target;
  if (t && t.classList && t.classList.contains('hero-pill') && t.scrollIntoView) {
    t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
});

/* abas das trilhas: no desktop, arrastar com o mouse rola na horizontal (no toque o navegador já rola) */
(function () {
  var p = document.querySelector('.hero-pills');
  if (!p || p.dataset.arrastar) return;
  p.dataset.arrastar = '1';
  var baixo = false, moveu = false, x0 = 0, l0 = 0;
  p.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    baixo = true; moveu = false; x0 = e.clientX; l0 = p.scrollLeft;
  });
  p.addEventListener('pointermove', function (e) {
    if (!baixo) return;
    var dx = e.clientX - x0;
    if (!moveu && Math.abs(dx) > 5) { moveu = true; p.classList.add('is-arrastando'); p.setPointerCapture(e.pointerId); }
    if (moveu) p.scrollLeft = l0 - dx;
  });
  function soltar() { baixo = false; p.classList.remove('is-arrastando'); }
  p.addEventListener('pointerup', soltar);
  p.addEventListener('pointercancel', soltar);
  // depois de arrastar, o clique não troca de trilha
  p.addEventListener('click', function (e) { if (moveu) { e.preventDefault(); e.stopPropagation(); moveu = false; } }, true);
})();
