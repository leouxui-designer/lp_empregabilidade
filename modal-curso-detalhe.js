(function () {
    'use strict';

    var modalEl = document.getElementById('modal-curso-detalhe');
    if (!modalEl) return;

    var panels = modalEl.querySelectorAll('.modal-curso-detalhe__panel');
    var despertarTabMap = { dev: '1', dados: '2', ia: '3' };

    function activateTab(panel, tabId) {
        panel.querySelectorAll('.tabs span[data-tab]').forEach(function (s) {
            s.classList.toggle('active', s.getAttribute('data-tab') === tabId);
        });
        panel.querySelectorAll('.curso[data-content]').forEach(function (c) {
            c.classList.toggle('active', c.getAttribute('data-content') === tabId);
        });
    }

    function openModal(etapa, trilha) {
        panels.forEach(function (p) { p.style.display = 'none'; });

        var panel;
        if (etapa === 'despertar') {
            panel = modalEl.querySelector('[data-modal-etapa="despertar"]');
            if (panel) activateTab(panel, despertarTabMap[trilha]);
        } else {
            panel = modalEl.querySelector('[data-modal-etapa="' + etapa + '"][data-modal-trilha="' + trilha + '"]');
        }

        if (!panel) return;
        panel.style.display = '';
        modalEl.classList.add('modal-curso-detalhe--open');
        modalEl.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalEl.classList.remove('modal-curso-detalhe--open');
        modalEl.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function handleTriggerClick(trigger) {
        if (!trigger) return;
        openModal(trigger.getAttribute('data-etapa'), trigger.getAttribute('data-trilha'));
    }

    document.addEventListener('click', function (e) {
        var trigger = e.target.closest('.js-modal-curso-trigger');
        if (trigger) {
            e.preventDefault();
            e.stopPropagation();
            handleTriggerClick(trigger);
            return;
        }

        if (e.target.closest('[data-modal-curso-close]')) {
            e.stopPropagation();
            closeModal();
            return;
        }

        var tab = e.target.closest('.modal-curso-detalhe__content .tabs span[data-tab]');
        if (tab) {
            var cardCurso = tab.closest('.card-curso');
            if (cardCurso) activateTab(cardCurso, tab.getAttribute('data-tab'));
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalEl.classList.contains('modal-curso-detalhe--open')) {
            closeModal();
            return;
        }
        if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.js-modal-curso-trigger[role="button"]')) {
            e.preventDefault();
            handleTriggerClick(e.target.closest('.js-modal-curso-trigger'));
        }
    });
})();
