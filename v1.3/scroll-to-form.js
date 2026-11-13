/**
 * Scroll suave para o formulário sem alterar a URL.
 *
 * Preserva os parâmetros UTM na barra de endereço ao navegar
 * para a seção #garanta-acesso via JavaScript em vez de âncora HTML.
 */
(function () {
  'use strict';

  function handleClick(e) {
    var link = e.currentTarget;
    var targetId = (link.getAttribute('href') || '').replace('#', '');
    var target = targetId ? document.getElementById(targetId) : null;

    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function init() {
    var links = document.querySelectorAll('.js-scroll-to-form');

    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', handleClick);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
