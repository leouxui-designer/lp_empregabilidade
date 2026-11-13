var e=`(function () {\r
    'use strict';\r
\r
    const setModalImage = (modalEl, buttonEl) => {\r
        const img = modalEl?.querySelector('#modal-ver-caminho-completo-img');\r
        const journeyImg = buttonEl?.dataset?.journeyImg;\r
        if (img && journeyImg) img.src = journeyImg;\r
    };\r
\r
    const getAreaFromPill = (pill) => {\r
        if (!pill) return 'dev';\r
        if (pill.classList.contains('hero-pill--dados')) return 'dados';\r
        if (pill.classList.contains('hero-pill--ia')) return 'ia';\r
        return 'dev';\r
    };\r
\r
    document.addEventListener('DOMContentLoaded', () => {\r
        const modal = document.getElementById('modal-ver-caminho-completo');\r
        if (modal) {\r
            modal.addEventListener('show.bs.modal', (event) => {\r
                const trigger = event?.relatedTarget;\r
                const button = trigger?.closest?.('button[data-journey-img]') || trigger;\r
                setModalImage(modal, button);\r
            });\r
\r
            document\r
                .querySelectorAll('button[data-bs-target="#modal-ver-caminho-completo"][data-journey-img]')\r
                .forEach((btn) => {\r
                    btn.addEventListener('click', () => setModalImage(modal, btn));\r
                });\r
        }\r
\r
        const heroSection = document.querySelector('.carreira-tech-2026 .hero-section');\r
        if (!heroSection) return;\r
\r
        const showVariant = (area) => {\r
            heroSection.querySelectorAll('.hero-cards-row__variant').forEach((v) => {\r
                const vArea = v.dataset?.heroArea;\r
                v.classList.toggle('is-active', vArea === area);\r
            });\r
        };\r
\r
        const activePill = heroSection.querySelector('.hero-pill.active');\r
        showVariant(getAreaFromPill(activePill));\r
\r
        heroSection.querySelectorAll('.hero-pill').forEach((pill) => {\r
            pill.addEventListener('shown.bs.tab', (e) => {\r
                showVariant(getAreaFromPill(e?.target));\r
            });\r
        });\r
    });\r
})();\r
\r
`;export{e as default};