var e=`(function () {\r
    'use strict';\r
\r
    var modalEl = document.getElementById('modal-palestrantes-despertar');\r
    var cursoEl = document.getElementById('modal-palestrantes-curso');\r
    var temaEl = document.getElementById('modal-palestrantes-title');\r
    var dataTextEl = document.querySelector('.modal-palestrantes__data-text');\r
    var horaTextEl = document.querySelector('.modal-palestrantes__hora-text');\r
    var gridEl = document.getElementById('modal-palestrantes-grid');\r
\r
    if (!modalEl || !cursoEl || !temaEl || !gridEl || typeof window.oDespertarModalPalestrantes === 'undefined') {\r
        return;\r
    }\r
\r
    var data = window.oDespertarModalPalestrantes;\r
\r
    function buildCardHtml(p) {\r
        var img = p.imagem_url\r
            ? '<img class="modal-palestrantes-card__img" src="' + escapeHtml(p.imagem_url) + '" alt="">'\r
            : '<div class="modal-palestrantes-card__iniciais">' + escapeHtml((p.nome || '').split(' ').map(function (s) { return s.charAt(0); }).join('').slice(0, 2).toUpperCase()) + '</div>';\r
        return (\r
            '<div class="modal-palestrantes-card">' +\r
            '  <div class="modal-palestrantes-card__header">' +\r
            img +\r
            '    <div class="modal-palestrantes-card__overlay">' +\r
            '      <p class="modal-palestrantes-card__nome">' + escapeHtml(p.nome) + '</p>' +\r
            '      <p class="modal-palestrantes-card__cargo">' + escapeHtml(p.cargo) + '</p>' +\r
            '    </div>' +\r
            '  </div>' +\r
            '  <div class="modal-palestrantes-card__body">' +\r
            '    <span class="modal-palestrantes-card__tag">' + escapeHtml(p.tag) + '</span>' +\r
            '    <h4 class="modal-palestrantes-card__titulo">' + escapeHtml(p.titulo) + '</h4>' +\r
            '  </div>' +\r
            '</div>'\r
        );\r
    }\r
\r
    function escapeHtml(text) {\r
        var div = document.createElement('div');\r
        div.textContent = text;\r
        return div.innerHTML;\r
    }\r
\r
    function openModal(eventoKey) {\r
        var eventData = data[eventoKey];\r
        if (!eventData) {\r
            return;\r
        }\r
\r
        cursoEl.textContent = eventData.label;\r
        cursoEl.style.color = eventData.cor || '';\r
        temaEl.textContent = eventData.tema;\r
        if (dataTextEl) {\r
            dataTextEl.textContent = eventData.data_evento || '';\r
        }\r
        if (horaTextEl) {\r
            horaTextEl.textContent = eventData.horario || '';\r
        }\r
\r
        gridEl.innerHTML = '';\r
        (eventData.palestrantes || []).forEach(function (p) {\r
            gridEl.insertAdjacentHTML('beforeend', buildCardHtml(p));\r
        });\r
\r
        modalEl.classList.add('modal-palestrantes--open');\r
        modalEl.setAttribute('aria-hidden', 'false');\r
        document.body.style.overflow = 'hidden';\r
    }\r
\r
    function closeModal() {\r
        modalEl.classList.remove('modal-palestrantes--open');\r
        modalEl.setAttribute('aria-hidden', 'true');\r
        document.body.style.overflow = '';\r
    }\r
\r
    document.addEventListener('click', function (e) {\r
        var trigger = e.target.closest('.js-modal-palestrantes-trigger');\r
        if (trigger) {\r
            e.preventDefault();\r
            e.stopPropagation();\r
            var evento = trigger.getAttribute('data-evento');\r
            if (evento) {\r
                openModal(evento);\r
            }\r
            return;\r
        }\r
        var closeBtn = e.target.closest('[data-modal-close]');\r
        if (closeBtn && modalEl.contains(closeBtn)) {\r
            e.stopPropagation();\r
            closeModal();\r
        }\r
    });\r
\r
    document.addEventListener('keydown', function (e) {\r
        if (e.key === 'Escape' && modalEl.classList.contains('modal-palestrantes--open')) {\r
            closeModal();\r
        }\r
    });\r
})();\r
`;export{e as default};