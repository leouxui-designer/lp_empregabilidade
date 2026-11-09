/* Carreira Tech: jornada em acordeão, controlada pelo seletor "Escolha sua trilha", com uma etapa aberta por vez.
   Etapas com mais de um curso mostram cada curso como uma aba, com teclado.
   Os ouvintes ficam no documento e valem para as telas recriadas pela casca: registra uma vez só. */
(function () {
    'use strict';
    if (window.__ctJornadaProgressiva) return;
    window.__ctJornadaProgressiva = true;

    function definirEtapa(gatilho, aberta) {
        var corpo = document.getElementById(gatilho.getAttribute('aria-controls'));
        if (!corpo) return;
        corpo.hidden = !aberta;
        gatilho.setAttribute('aria-expanded', aberta ? 'true' : 'false');
    }

    function alternarEtapa(gatilho) {
        var topoAntes = gatilho.getBoundingClientRect().top;
        var abrir = gatilho.getAttribute('aria-expanded') !== 'true';
        document.querySelectorAll('.etapa-gatilho').forEach(function (g) {
            definirEtapa(g, abrir && g === gatilho);
        });
        // a etapa anterior pode ter fechado acima: mantém o título clicado no mesmo lugar da tela
        window.scrollBy({ top: gatilho.getBoundingClientRect().top - topoAntes, behavior: 'instant' });
    }

    // botão "Ver etapas da trilha": mostra ou oculta as etapas (começam ocultas); os três botões acompanham o mesmo estado
    function alternarEtapas(botao) {
        var area = document.getElementById(botao.getAttribute('aria-controls'));
        if (!area) return;
        var abrir = area.hidden;
        area.hidden = !abrir;
        document.querySelectorAll('.js-toggle-etapas').forEach(function (b) {
            b.setAttribute('aria-expanded', abrir ? 'true' : 'false');
            var t = b.querySelector('.js-toggle-etapas__texto');
            if (t) t.textContent = abrir ? 'Ocultar etapas' : 'Ver etapas da trilha';
        });
    }

    // botão "Ver etapas da trilha": abre o modal com a imagem da jornada da trilha do botão
    function abrirJornada(botao) {
        var img = document.getElementById('modal-ver-caminho-completo-img');
        if (img) img.src = botao.getAttribute('data-journey-img');
    }

    function definirTrilha(trilha) {
        document.querySelectorAll('.etapa-painel[data-trilha]').forEach(function (p) {
            p.classList.toggle('active', p.dataset.trilha === trilha);
        });
    }

    function ativarSubaba(aba) {
        aba.closest('[role="tablist"]').querySelectorAll('[role="tab"]').forEach(function (t) {
            var ligada = t === aba;
            t.classList.toggle('active', ligada);
            t.setAttribute('aria-selected', ligada ? 'true' : 'false');
            t.tabIndex = ligada ? 0 : -1;
            var painel = document.getElementById(t.getAttribute('aria-controls'));
            if (painel) painel.classList.toggle('active', ligada);
        });
    }

    document.addEventListener('click', function (e) {
        var alvo;
        if ((alvo = e.target.closest('.js-abrir-jornada'))) abrirJornada(alvo);
        else if ((alvo = e.target.closest('.etapa-gatilho'))) alternarEtapa(alvo);
        else if ((alvo = e.target.closest('.etapa-subaba'))) ativarSubaba(alvo);
    });

    document.addEventListener('keydown', function (e) {
        var aba = e.target.closest('.etapa-subaba');
        if (!aba) return;
        var abas = Array.prototype.slice.call(aba.closest('[role="tablist"]').querySelectorAll('[role="tab"]'));
        var i = abas.indexOf(aba);
        var destino = { ArrowRight: abas[(i + 1) % abas.length], ArrowLeft: abas[(i - 1 + abas.length) % abas.length], Home: abas[0], End: abas[abas.length - 1] }[e.key];
        if (!destino) return;
        e.preventDefault();
        ativarSubaba(destino);
        destino.focus();
    });

    // "Escolha sua trilha" é o único seletor: a aba escolhida define as etapas e o título delas
    document.addEventListener('show.bs.tab', function (e) {
        var m = e.target && e.target.id && e.target.id.match(/^hero-tab-(dev|dados|ia)$/);
        if (!m) return;
        definirTrilha(m[1]);
        var nome = document.getElementById('etapa-trilha-nome');
        if (nome) nome.textContent = e.target.textContent.trim();
    });
})();
