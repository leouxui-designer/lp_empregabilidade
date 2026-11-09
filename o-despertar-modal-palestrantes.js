(function () {
    'use strict';

    var modalEl = document.getElementById('modal-palestrantes-despertar');
    var cursoEl = document.getElementById('modal-palestrantes-curso');
    var temaEl = document.getElementById('modal-palestrantes-title');
    var dataTextEl = document.querySelector('.modal-palestrantes__data-text');
    var horaTextEl = document.querySelector('.modal-palestrantes__hora-text');
    var gridEl = document.getElementById('modal-palestrantes-grid');

    if (!modalEl || !cursoEl || !temaEl || !gridEl || typeof window.oDespertarModalPalestrantes === 'undefined') {
        return;
    }

    var data = window.oDespertarModalPalestrantes;

    function buildCardHtml(p) {
        var img = p.imagem_url
            ? '<img class="modal-palestrantes-card__img" src="' + escapeHtml(p.imagem_url) + '" alt="">'
            : '<div class="modal-palestrantes-card__iniciais">' + escapeHtml((p.nome || '').split(' ').map(function (s) { return s.charAt(0); }).join('').slice(0, 2).toUpperCase()) + '</div>';
        return (
            '<div class="modal-palestrantes-card">' +
            '  <div class="modal-palestrantes-card__header">' +
            img +
            '    <div class="modal-palestrantes-card__overlay">' +
            '      <p class="modal-palestrantes-card__nome">' + escapeHtml(p.nome) + '</p>' +
            '      <p class="modal-palestrantes-card__cargo">' + escapeHtml(p.cargo) + '</p>' +
            '    </div>' +
            '  </div>' +
            '  <div class="modal-palestrantes-card__body">' +
            '    <span class="modal-palestrantes-card__tag">' + escapeHtml(p.tag) + '</span>' +
            '    <h4 class="modal-palestrantes-card__titulo">' + escapeHtml(p.titulo) + '</h4>' +
            '  </div>' +
            '</div>'
        );
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function openModal(eventoKey) {
        var eventData = data[eventoKey];
        if (!eventData) {
            return;
        }

        cursoEl.textContent = eventData.label;
        cursoEl.style.color = eventData.cor || '';
        temaEl.textContent = eventData.tema;
        if (dataTextEl) {
            dataTextEl.textContent = eventData.data_evento || '';
        }
        if (horaTextEl) {
            horaTextEl.textContent = eventData.horario || '';
        }

        gridEl.innerHTML = '';
        (eventData.palestrantes || []).forEach(function (p) {
            gridEl.insertAdjacentHTML('beforeend', buildCardHtml(p));
        });

        modalEl.classList.add('modal-palestrantes--open');
        modalEl.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalEl.classList.remove('modal-palestrantes--open');
        modalEl.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    document.addEventListener('click', function (e) {
        var trigger = e.target.closest('.js-modal-palestrantes-trigger');
        if (trigger) {
            e.preventDefault();
            e.stopPropagation();
            var evento = trigger.getAttribute('data-evento');
            if (evento) {
                openModal(evento);
            }
            return;
        }
        var closeBtn = e.target.closest('[data-modal-close]');
        if (closeBtn && modalEl.contains(closeBtn)) {
            e.stopPropagation();
            closeModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalEl.classList.contains('modal-palestrantes--open')) {
            closeModal();
        }
    });
})();
