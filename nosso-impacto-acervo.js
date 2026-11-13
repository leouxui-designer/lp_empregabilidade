(function ($) {
  "use strict";

  $(function () {
    // Scroll automático baseado na hash da URL
    const hashMap = {
      "#indicadores-de-impacto": ".ctn-indicadores",
      "#acervo-de-conteudos": ".ctn-acervo",
    };

    const hash = window.location.hash;
    if (hash && hashMap[hash]) {
      const $target = $(hashMap[hash]);
      if ($target.length) {
        setTimeout(function () {
          $("html, body").animate(
            { scrollTop: $target.offset().top - 100 },
            600,
          );
        }, 300);
      }
    }

    const $menu = $(".ctn-acervo .playlist-menu");
    if (!$menu.length) return;

    // Drag to slide na playlist-menu
    const menu = $menu[0];
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    function getMaxTranslate() {
      const containerWidth = menu.parentElement.offsetWidth;
      const menuWidth = menu.scrollWidth;
      return Math.min(0, containerWidth - menuWidth);
    }

    function setTranslate(value) {
      const max = getMaxTranslate();
      currentTranslate = Math.max(max, Math.min(0, value));
      menu.style.transform = "translateX(" + currentTranslate + "px)";
    }

    // Mouse events
    menu.addEventListener("mousedown", function (e) {
      isDragging = true;
      startX = e.clientX;
      prevTranslate = currentTranslate;
      menu.style.transition = "none";
    });

    document.addEventListener("mousemove", function (e) {
      if (!isDragging) return;
      const diff = e.clientX - startX;
      setTranslate(prevTranslate + diff);
    });

    document.addEventListener("mouseup", function () {
      if (!isDragging) return;
      isDragging = false;
      menu.style.transition = "transform 0.3s ease";
    });

    // Touch events
    menu.addEventListener("touchstart", function (e) {
      isDragging = true;
      startX = e.touches[0].clientX;
      prevTranslate = currentTranslate;
      menu.style.transition = "none";
    });

    menu.addEventListener("touchmove", function (e) {
      if (!isDragging) return;
      const diff = e.touches[0].clientX - startX;
      setTranslate(prevTranslate + diff);
    });

    menu.addEventListener("touchend", function () {
      isDragging = false;
      menu.style.transition = "transform 0.3s ease";
    });

    $menu.on("click", "button[data-tab]", function () {
      const $btn = $(this);
      const tab = $btn.data("tab");

      $menu.find("button").removeClass("active").attr("aria-pressed", "false");
      $btn.addClass("active").attr("aria-pressed", "true");

      const $items = $(".ctn-acervo .ctn-videos [data-content]");

      if (tab === "all") {
        $items.show();
      } else {
        $items.hide();
        $items.filter('[data-content="' + tab + '"]').show();
      }
    });
  });
})(jQuery);
