(function () {
    const headerGoverno = document.getElementById("header-governo");
    const topo = document.querySelector(".topo");

    if (!headerGoverno || !topo) return;

    const adminBar = document.getElementById("wpadminbar");
    const adminBarHeight = adminBar ? adminBar.offsetHeight : 0;

    function ajustarTopo() {
        const headerHeight = headerGoverno.offsetHeight;

        if (window.scrollY > 0) {
            headerGoverno.style.transform = "translateY(-100%)";
            topo.style.top = adminBarHeight + "px";
        } else {
            headerGoverno.style.transform = "translateY(0)";
            topo.style.top = (headerHeight + adminBarHeight) + "px";
        }
    }

    ajustarTopo();
    window.addEventListener("scroll", ajustarTopo);
})();
