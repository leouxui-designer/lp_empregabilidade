var e=`(function () {\r
    'use strict';\r
\r
    var modalEl = document.getElementById('modal-curso-detalhe');\r
    if (!modalEl) return;\r
\r
    var panels = modalEl.querySelectorAll('.modal-curso-detalhe__panel');\r
    var despertarTabMap = { dev: '1', dados: '2', ia: '3' };\r
\r
    function activateTab(panel, tabId) {\r
        panel.querySelectorAll('.tabs span[data-tab]').forEach(function (s) {\r
            s.classList.toggle('active', s.getAttribute('data-tab') === tabId);\r
        });\r
        panel.querySelectorAll('.curso[data-content]').forEach(function (c) {\r
            c.classList.toggle('active', c.getAttribute('data-content') === tabId);\r
        });\r
    }\r
\r
    function openModal(etapa, trilha) {\r
        panels.forEach(function (p) { p.style.display = 'none'; });\r
\r
        var panel;\r
        if (etapa === 'despertar') {\r
            panel = modalEl.querySelector('[data-modal-etapa="despertar"]');\r
            if (panel) activateTab(panel, despertarTabMap[trilha]);\r
        } else {\r
            panel = modalEl.querySelector('[data-modal-etapa="' + etapa + '"][data-modal-trilha="' + trilha + '"]');\r
        }\r
\r
        if (!panel) return;\r
        panel.style.display = '';\r
        modalEl.classList.add('modal-curso-detalhe--open');\r
        modalEl.setAttribute('aria-hidden', 'false');\r
        document.body.style.overflow = 'hidden';\r
    }\r
\r
    function closeModal() {\r
        modalEl.classList.remove('modal-curso-detalhe--open');\r
        modalEl.setAttribute('aria-hidden', 'true');\r
        document.body.style.overflow = '';\r
    }\r
\r
    function handleTriggerClick(trigger) {\r
        if (!trigger) return;\r
        openModal(trigger.getAttribute('data-etapa'), trigger.getAttribute('data-trilha'));\r
    }\r
\r
    document.addEventListener('click', function (e) {\r
        var trigger = e.target.closest('.js-modal-curso-trigger');\r
        if (trigger) {\r
            e.preventDefault();\r
            e.stopPropagation();\r
            handleTriggerClick(trigger);\r
            return;\r
        }\r
\r
        if (e.target.closest('[data-modal-curso-close]')) {\r
            e.stopPropagation();\r
            closeModal();\r
            return;\r
        }\r
\r
        var tab = e.target.closest('.modal-curso-detalhe__content .tabs span[data-tab]');\r
        if (tab) {\r
            var cardCurso = tab.closest('.card-curso');\r
            if (cardCurso) activateTab(cardCurso, tab.getAttribute('data-tab'));\r
        }\r
    });\r
\r
    document.addEventListener('keydown', function (e) {\r
        if (e.key === 'Escape' && modalEl.classList.contains('modal-curso-detalhe--open')) {\r
            closeModal();\r
            return;\r
        }\r
        if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.js-modal-curso-trigger[role="button"]')) {\r
            e.preventDefault();\r
            handleTriggerClick(e.target.closest('.js-modal-curso-trigger'));\r
        }\r
    });\r
})();\r
`;export{e as default};