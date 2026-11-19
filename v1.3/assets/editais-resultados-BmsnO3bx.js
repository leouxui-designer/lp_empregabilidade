var e=`(function () {
    function scrollTabIntoView(tab, animate) {
        var tablist = tab.closest('.editais-tabs');
        if (!tablist || tablist.scrollWidth <= tablist.clientWidth) return;
        var tabLeft = tab.offsetLeft;
        var tabWidth = tab.offsetWidth;
        var containerWidth = tablist.clientWidth;
        var scrollPos = tabLeft - (containerWidth / 2) + (tabWidth / 2);
        var maxScroll = tablist.scrollWidth - tablist.clientWidth;
        scrollPos = Math.max(0, Math.min(scrollPos, maxScroll));
        tablist.scrollTo({ left: scrollPos, behavior: animate ? 'smooth' : 'instant' });
    }

    document.querySelectorAll('.editais-secao').forEach(function (secao) {
        var tabs = secao.querySelectorAll('.editais-tabs__tab');
        if (!tabs.length) return;

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                var ciclo = this.getAttribute('data-ciclo');
                var secaoId = secao.getAttribute('id');

                tabs.forEach(function (t) {
                    t.classList.remove('editais-tabs__tab--active');
                    t.setAttribute('aria-selected', 'false');
                });
                this.classList.add('editais-tabs__tab--active');
                this.setAttribute('aria-selected', 'true');

                secao.querySelectorAll('.editais-painel').forEach(function (p) {
                    if (p.id === secaoId + '-ciclo-' + ciclo) {
                        p.classList.remove('editais-painel--hidden');
                    } else {
                        p.classList.add('editais-painel--hidden');
                    }
                });

                scrollTabIntoView(this, true);
            });
        });
    });

    document.querySelectorAll('.editais-tabs__tab--active').forEach(function (activeTab) {
        scrollTabIntoView(activeTab, false);
    });

    var hash = window.location.hash;
    if (hash && hash.charAt(1) !== '/') {
        var target = document.querySelector(hash);
        if (target) {
            setTimeout(function () {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
})();
`;export{e as default};