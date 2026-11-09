(function () {
    'use strict';

    const setModalImage = (modalEl, buttonEl) => {
        const img = modalEl?.querySelector('#modal-ver-caminho-completo-img');
        const journeyImg = buttonEl?.dataset?.journeyImg;
        if (img && journeyImg) img.src = journeyImg;
    };

    const getAreaFromPill = (pill) => {
        if (!pill) return 'dev';
        if (pill.classList.contains('hero-pill--dados')) return 'dados';
        if (pill.classList.contains('hero-pill--ia')) return 'ia';
        return 'dev';
    };

    document.addEventListener('DOMContentLoaded', () => {
        const modal = document.getElementById('modal-ver-caminho-completo');
        if (modal) {
            modal.addEventListener('show.bs.modal', (event) => {
                const trigger = event?.relatedTarget;
                const button = trigger?.closest?.('button[data-journey-img]') || trigger;
                setModalImage(modal, button);
            });

            document
                .querySelectorAll('button[data-bs-target="#modal-ver-caminho-completo"][data-journey-img]')
                .forEach((btn) => {
                    btn.addEventListener('click', () => setModalImage(modal, btn));
                });
        }

        const heroSection = document.querySelector('.carreira-tech-2026 .hero-section');
        if (!heroSection) return;

        const showVariant = (area) => {
            heroSection.querySelectorAll('.hero-cards-row__variant').forEach((v) => {
                const vArea = v.dataset?.heroArea;
                v.classList.toggle('is-active', vArea === area);
            });
        };

        const activePill = heroSection.querySelector('.hero-pill.active');
        showVariant(getAreaFromPill(activePill));

        heroSection.querySelectorAll('.hero-pill').forEach((pill) => {
            pill.addEventListener('shown.bs.tab', (e) => {
                showVariant(getAreaFromPill(e?.target));
            });
        });
    });
})();

