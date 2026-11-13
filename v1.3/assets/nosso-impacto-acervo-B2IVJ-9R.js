var e=`(function ($) {\r
  "use strict";\r
\r
  $(function () {\r
    // Scroll automático baseado na hash da URL\r
    const hashMap = {\r
      "#indicadores-de-impacto": ".ctn-indicadores",\r
      "#acervo-de-conteudos": ".ctn-acervo",\r
    };\r
\r
    const hash = window.location.hash;\r
    if (hash && hashMap[hash]) {\r
      const $target = $(hashMap[hash]);\r
      if ($target.length) {\r
        setTimeout(function () {\r
          $("html, body").animate(\r
            { scrollTop: $target.offset().top - 100 },\r
            600,\r
          );\r
        }, 300);\r
      }\r
    }\r
\r
    const $menu = $(".ctn-acervo .playlist-menu");\r
    if (!$menu.length) return;\r
\r
    // Drag to slide na playlist-menu\r
    const menu = $menu[0];\r
    let isDragging = false;\r
    let startX = 0;\r
    let currentTranslate = 0;\r
    let prevTranslate = 0;\r
\r
    function getMaxTranslate() {\r
      const containerWidth = menu.parentElement.offsetWidth;\r
      const menuWidth = menu.scrollWidth;\r
      return Math.min(0, containerWidth - menuWidth);\r
    }\r
\r
    function setTranslate(value) {\r
      const max = getMaxTranslate();\r
      currentTranslate = Math.max(max, Math.min(0, value));\r
      menu.style.transform = "translateX(" + currentTranslate + "px)";\r
    }\r
\r
    // Mouse events\r
    menu.addEventListener("mousedown", function (e) {\r
      isDragging = true;\r
      startX = e.clientX;\r
      prevTranslate = currentTranslate;\r
      menu.style.transition = "none";\r
    });\r
\r
    document.addEventListener("mousemove", function (e) {\r
      if (!isDragging) return;\r
      const diff = e.clientX - startX;\r
      setTranslate(prevTranslate + diff);\r
    });\r
\r
    document.addEventListener("mouseup", function () {\r
      if (!isDragging) return;\r
      isDragging = false;\r
      menu.style.transition = "transform 0.3s ease";\r
    });\r
\r
    // Touch events\r
    menu.addEventListener("touchstart", function (e) {\r
      isDragging = true;\r
      startX = e.touches[0].clientX;\r
      prevTranslate = currentTranslate;\r
      menu.style.transition = "none";\r
    });\r
\r
    menu.addEventListener("touchmove", function (e) {\r
      if (!isDragging) return;\r
      const diff = e.touches[0].clientX - startX;\r
      setTranslate(prevTranslate + diff);\r
    });\r
\r
    menu.addEventListener("touchend", function () {\r
      isDragging = false;\r
      menu.style.transition = "transform 0.3s ease";\r
    });\r
\r
    $menu.on("click", "button[data-tab]", function () {\r
      const $btn = $(this);\r
      const tab = $btn.data("tab");\r
\r
      $menu.find("button").removeClass("active").attr("aria-pressed", "false");\r
      $btn.addClass("active").attr("aria-pressed", "true");\r
\r
      const $items = $(".ctn-acervo .ctn-videos [data-content]");\r
\r
      if (tab === "all") {\r
        $items.show();\r
      } else {\r
        $items.hide();\r
        $items.filter('[data-content="' + tab + '"]').show();\r
      }\r
    });\r
  });\r
})(jQuery);\r
`;export{e as default};