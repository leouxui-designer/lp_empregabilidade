var e=`/* Carreira Tech: jornada em acordeão, controlada pelo seletor "Escolha sua trilha", com uma etapa aberta por vez.\r
   Etapas com mais de um curso mostram cada curso como uma aba, com teclado.\r
   Os ouvintes ficam no documento e valem para as telas recriadas pela casca: registra uma vez só. */\r
(function () {\r
    'use strict';\r
    if (window.__ctJornadaProgressiva) return;\r
    window.__ctJornadaProgressiva = true;\r
\r
    function definirEtapa(gatilho, aberta) {\r
        var corpo = document.getElementById(gatilho.getAttribute('aria-controls'));\r
        if (!corpo) return;\r
        corpo.hidden = !aberta;\r
        gatilho.setAttribute('aria-expanded', aberta ? 'true' : 'false');\r
    }\r
\r
    function alternarEtapa(gatilho) {\r
        var topoAntes = gatilho.getBoundingClientRect().top;\r
        var abrir = gatilho.getAttribute('aria-expanded') !== 'true';\r
        document.querySelectorAll('.etapa-gatilho').forEach(function (g) {\r
            definirEtapa(g, abrir && g === gatilho);\r
        });\r
        // a etapa anterior pode ter fechado acima: mantém o título clicado no mesmo lugar da tela\r
        window.scrollBy({ top: gatilho.getBoundingClientRect().top - topoAntes, behavior: 'instant' });\r
    }\r
\r
    // botão "Ver etapas da trilha": mostra ou oculta as etapas (começam ocultas); os três botões acompanham o mesmo estado\r
    function alternarEtapas(botao) {\r
        var area = document.getElementById(botao.getAttribute('aria-controls'));\r
        if (!area) return;\r
        var abrir = area.hidden;\r
        area.hidden = !abrir;\r
        document.querySelectorAll('.js-toggle-etapas').forEach(function (b) {\r
            b.setAttribute('aria-expanded', abrir ? 'true' : 'false');\r
            var t = b.querySelector('.js-toggle-etapas__texto');\r
            if (t) t.textContent = abrir ? 'Ocultar etapas' : 'Ver etapas da trilha';\r
        });\r
    }\r
\r
    function definirTrilha(trilha) {\r
        document.querySelectorAll('.etapa-painel[data-trilha]').forEach(function (p) {\r
            p.classList.toggle('active', p.dataset.trilha === trilha);\r
        });\r
    }\r
\r
    function ativarSubaba(aba) {\r
        aba.closest('[role="tablist"]').querySelectorAll('[role="tab"]').forEach(function (t) {\r
            var ligada = t === aba;\r
            t.classList.toggle('active', ligada);\r
            t.setAttribute('aria-selected', ligada ? 'true' : 'false');\r
            t.tabIndex = ligada ? 0 : -1;\r
            var painel = document.getElementById(t.getAttribute('aria-controls'));\r
            if (painel) painel.classList.toggle('active', ligada);\r
        });\r
    }\r
\r
    document.addEventListener('click', function (e) {\r
        var alvo;\r
        if ((alvo = e.target.closest('.js-toggle-etapas'))) alternarEtapas(alvo);\r
        else if ((alvo = e.target.closest('.etapa-gatilho'))) alternarEtapa(alvo);\r
        else if ((alvo = e.target.closest('.etapa-subaba'))) ativarSubaba(alvo);\r
    });\r
\r
    document.addEventListener('keydown', function (e) {\r
        var aba = e.target.closest('.etapa-subaba');\r
        if (!aba) return;\r
        var abas = Array.prototype.slice.call(aba.closest('[role="tablist"]').querySelectorAll('[role="tab"]'));\r
        var i = abas.indexOf(aba);\r
        var destino = { ArrowRight: abas[(i + 1) % abas.length], ArrowLeft: abas[(i - 1 + abas.length) % abas.length], Home: abas[0], End: abas[abas.length - 1] }[e.key];\r
        if (!destino) return;\r
        e.preventDefault();\r
        ativarSubaba(destino);\r
        destino.focus();\r
    });\r
\r
    // "Escolha sua trilha" é o único seletor: a aba escolhida define as etapas e o título delas\r
    document.addEventListener('show.bs.tab', function (e) {\r
        var m = e.target && e.target.id && e.target.id.match(/^hero-tab-(dev|dados|ia)$/);\r
        if (!m) return;\r
        definirTrilha(m[1]);\r
        var nome = document.getElementById('etapa-trilha-nome');\r
        if (nome) nome.textContent = e.target.textContent.trim();\r
    });\r
})();\r
`;export{e as default};