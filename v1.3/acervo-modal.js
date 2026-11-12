(function () {
    'use strict';

    function init() {
        var modalEl = document.getElementById('modal-acervo');
        if (!modalEl) return;

        var triggerEl = null;
        var focusableSelector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

        var TRILHA_FILTER_MAP = {
            'dev': 'development',
            'dados': 'data-analysis',
            'ia': 'ia'
        };

        function getFocusableElements() {
            return modalEl.querySelectorAll(focusableSelector);
        }

        function applyFilter(filterSlug) {
            var acervoSection = modalEl.querySelector('.ctn-acervo');
            if (!acervoSection) return;

            var menuButtons = acervoSection.querySelectorAll('.playlist-menu button[data-tab]');
            var items = acervoSection.querySelectorAll('.ctn-videos [data-content]');

            menuButtons.forEach(function (btn) {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });

            var targetTab = filterSlug || 'all';
            var targetButton = acervoSection.querySelector('.playlist-menu button[data-tab="' + targetTab + '"]');

            if (targetButton) {
                targetButton.classList.add('active');
                targetButton.setAttribute('aria-pressed', 'true');
            }

            items.forEach(function (item) {
                if (targetTab === 'all') {
                    item.style.display = '';
                } else {
                    item.style.display = item.getAttribute('data-content') === targetTab ? '' : 'none';
                }
            });
        }

        function open(trigger) {
            triggerEl = trigger;

            var filterSlug = null;
            if (trigger && trigger.hasAttribute('data-acervo-filter')) {
                var trilhaSlug = trigger.getAttribute('data-acervo-filter');
                filterSlug = TRILHA_FILTER_MAP[trilhaSlug] || trilhaSlug;
            }

            modalEl.classList.add('acervo-modal--open');
            modalEl.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            setTimeout(function () {
                applyFilter(filterSlug);

                var focusable = getFocusableElements();
                if (focusable.length) {
                    focusable[0].focus();
                }
            }, 50);
        }

        function openWithFilter(trilhaSlug) {
            var filterSlug = TRILHA_FILTER_MAP[trilhaSlug] || trilhaSlug || null;

            modalEl.classList.add('acervo-modal--open');
            modalEl.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            setTimeout(function () {
                applyFilter(filterSlug);

                var focusable = getFocusableElements();
                if (focusable.length) {
                    focusable[0].focus();
                }
            }, 50);
        }

        function close() {
            modalEl.classList.remove('acervo-modal--open');
            modalEl.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';

            if (triggerEl) {
                triggerEl.focus();
                triggerEl = null;
            }
        }

        function trapFocus(e) {
            if (e.key !== 'Tab') return;

            var focusable = getFocusableElements();
            if (!focusable.length) return;

            var first = focusable[0];
            var last = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }

        document.addEventListener('click', function (e) {
            var trigger = e.target.closest('.js-acervo-modal-trigger');
            if (trigger) {
                e.preventDefault();
                open(trigger);
                return;
            }

            if (e.target.closest('[data-acervo-modal-close]')) {
                close();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                var trigger = e.target.closest('.js-acervo-modal-trigger');
                if (trigger) {
                    e.preventDefault();
                    open(trigger);
                    return;
                }
            }

            if (!modalEl.classList.contains('acervo-modal--open')) return;

            if (e.key === 'Escape') {
                close();
                return;
            }

            trapFocus(e);
        });

        window.acervoModal = {
            open: openWithFilter
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
