var e=`(function () {\r
    'use strict';\r
\r
    function init() {\r
        var modalEl = document.getElementById('modal-acervo');\r
        if (!modalEl) return;\r
\r
        var triggerEl = null;\r
        var focusableSelector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';\r
\r
        var TRILHA_FILTER_MAP = {\r
            'dev': 'development',\r
            'dados': 'data-analysis',\r
            'ia': 'ia'\r
        };\r
\r
        function getFocusableElements() {\r
            return modalEl.querySelectorAll(focusableSelector);\r
        }\r
\r
        function applyFilter(filterSlug) {\r
            var acervoSection = modalEl.querySelector('.ctn-acervo');\r
            if (!acervoSection) return;\r
\r
            var menuButtons = acervoSection.querySelectorAll('.playlist-menu button[data-tab]');\r
            var items = acervoSection.querySelectorAll('.ctn-videos [data-content]');\r
\r
            menuButtons.forEach(function (btn) {\r
                btn.classList.remove('active');\r
                btn.setAttribute('aria-pressed', 'false');\r
            });\r
\r
            var targetTab = filterSlug || 'all';\r
            var targetButton = acervoSection.querySelector('.playlist-menu button[data-tab="' + targetTab + '"]');\r
\r
            if (targetButton) {\r
                targetButton.classList.add('active');\r
                targetButton.setAttribute('aria-pressed', 'true');\r
            }\r
\r
            items.forEach(function (item) {\r
                if (targetTab === 'all') {\r
                    item.style.display = '';\r
                } else {\r
                    item.style.display = item.getAttribute('data-content') === targetTab ? '' : 'none';\r
                }\r
            });\r
        }\r
\r
        function open(trigger) {\r
            triggerEl = trigger;\r
\r
            var filterSlug = null;\r
            if (trigger && trigger.hasAttribute('data-acervo-filter')) {\r
                var trilhaSlug = trigger.getAttribute('data-acervo-filter');\r
                filterSlug = TRILHA_FILTER_MAP[trilhaSlug] || trilhaSlug;\r
            }\r
\r
            modalEl.classList.add('acervo-modal--open');\r
            modalEl.setAttribute('aria-hidden', 'false');\r
            document.body.style.overflow = 'hidden';\r
\r
            setTimeout(function () {\r
                applyFilter(filterSlug);\r
\r
                var focusable = getFocusableElements();\r
                if (focusable.length) {\r
                    focusable[0].focus();\r
                }\r
            }, 50);\r
        }\r
\r
        function openWithFilter(trilhaSlug) {\r
            var filterSlug = TRILHA_FILTER_MAP[trilhaSlug] || trilhaSlug || null;\r
\r
            modalEl.classList.add('acervo-modal--open');\r
            modalEl.setAttribute('aria-hidden', 'false');\r
            document.body.style.overflow = 'hidden';\r
\r
            setTimeout(function () {\r
                applyFilter(filterSlug);\r
\r
                var focusable = getFocusableElements();\r
                if (focusable.length) {\r
                    focusable[0].focus();\r
                }\r
            }, 50);\r
        }\r
\r
        function close() {\r
            modalEl.classList.remove('acervo-modal--open');\r
            modalEl.setAttribute('aria-hidden', 'true');\r
            document.body.style.overflow = '';\r
\r
            if (triggerEl) {\r
                triggerEl.focus();\r
                triggerEl = null;\r
            }\r
        }\r
\r
        function trapFocus(e) {\r
            if (e.key !== 'Tab') return;\r
\r
            var focusable = getFocusableElements();\r
            if (!focusable.length) return;\r
\r
            var first = focusable[0];\r
            var last = focusable[focusable.length - 1];\r
\r
            if (e.shiftKey) {\r
                if (document.activeElement === first) {\r
                    e.preventDefault();\r
                    last.focus();\r
                }\r
            } else {\r
                if (document.activeElement === last) {\r
                    e.preventDefault();\r
                    first.focus();\r
                }\r
            }\r
        }\r
\r
        document.addEventListener('click', function (e) {\r
            var trigger = e.target.closest('.js-acervo-modal-trigger');\r
            if (trigger) {\r
                e.preventDefault();\r
                open(trigger);\r
                return;\r
            }\r
\r
            if (e.target.closest('[data-acervo-modal-close]')) {\r
                close();\r
            }\r
        });\r
\r
        document.addEventListener('keydown', function (e) {\r
            if (e.key === 'Enter' || e.key === ' ') {\r
                var trigger = e.target.closest('.js-acervo-modal-trigger');\r
                if (trigger) {\r
                    e.preventDefault();\r
                    open(trigger);\r
                    return;\r
                }\r
            }\r
\r
            if (!modalEl.classList.contains('acervo-modal--open')) return;\r
\r
            if (e.key === 'Escape') {\r
                close();\r
                return;\r
            }\r
\r
            trapFocus(e);\r
        });\r
\r
        window.acervoModal = {\r
            open: openWithFilter\r
        };\r
    }\r
\r
    if (document.readyState === 'loading') {\r
        document.addEventListener('DOMContentLoaded', init);\r
    } else {\r
        init();\r
    }\r
})();\r
`;export{e as default};