var e=`(function (f) { document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', f) : f() })(function () {
  const video = document.querySelector(".video-banner");
  if (video) {
    video.muted = true;
    video.controls = true;
    video.play().catch((err) => console.log("Autoplay bloqueado:", err));
  }

  const navbarCollapse = document.querySelector(".navbar-collapse");

  if (navbarCollapse) {
    const mobileMenu = document.querySelector("#navbarNavDropdown .nav-links");
    if (mobileMenu) {
      mobileMenu
        .querySelectorAll(":scope > .menu-item:not(.menu-item-has-children)")
        .forEach((item) => {
          item.addEventListener("click", function () {
            navbarCollapse.classList.remove("show");
            navbarCollapse.style.display = "";
            document.body.classList.remove("menu-mobile-open");
          });
        });
    }
  }
});

jQuery(document).ready(function () {
  const video = document.querySelector(".video-banner");
  if (video) {
    video.addEventListener("click", function () {
      video.muted = true;
      video.controls = true;
      video.play().catch((err) => console.log("Autoplay bloqueado:", err));
    });
  }

  const $navbarCollapse = jQuery(".navbar-collapse");

  if ($navbarCollapse.length) {
    $navbarCollapse.on("shown.bs.collapse", function () {
      document.body.classList.add("menu-mobile-open");
    });
    $navbarCollapse.on("hidden.bs.collapse", function () {
      document.body.classList.remove("menu-mobile-open");
    });

    const target = $navbarCollapse.get(0);
    const mo = new MutationObserver(() => {
      if ($navbarCollapse.hasClass("show"))
        document.body.classList.add("menu-mobile-open");
      else document.body.classList.remove("menu-mobile-open");
    });
    mo.observe(target, { attributes: true, attributeFilter: ["class"] });
  }

  function findMenuItemByTitle($menu, title) {
    return $menu.find("> .menu-item").filter(function () {
      return jQuery(this).find("> a").first().text().trim() === title;
    });
  }

  const $menuDesktop = jQuery(".menu-principal .nav-links");
  const $menuMobile = jQuery("#navbarNavDropdown .nav-links");

  const $menuCarreiraTech = findMenuItemByTitle($menuDesktop, "Carreira Tech");
  const $menuCronogramas = findMenuItemByTitle($menuDesktop, "Cronogramas");

  $menuCarreiraTech.on("click", function () {
    let submenu = jQuery(this).find(".sub-menu").first();
    submenu.toggleClass("active");
  });

  $menuCronogramas.on("click", function () {
    let submenu = jQuery(this).find(".sub-menu").first();
    submenu.toggleClass("active");
  });

  const $menuCarreiraTechMobile = findMenuItemByTitle(
    $menuMobile,
    "Carreira Tech",
  );
  const cronMobile = findMenuItemByTitle($menuMobile, "Cronogramas");

  $menuCarreiraTechMobile.on("click", function (e) {
    let submenu = jQuery(this).find(".sub-menu").first();
    submenu.toggleClass("active");
  });

  let $cronSubMobile = cronMobile.find("> .sub-menu").first();

  if (cronMobile.length && $cronSubMobile.length) {
    cronMobile.addClass("has-sub");

    cronMobile.on("click", function (e) {
      if (jQuery(e.target).closest("> .sub-menu").length) return;

      e.preventDefault();
      e.stopPropagation();

      $menuMobile
        .find("> li.menu-item > .sub-menu.active")
        .not($cronSubMobile)
        .removeClass("active");
      $cronSubMobile.toggleClass("active");
    });

    $cronSubMobile.find("> li").each(function () {
      const $li = jQuery(this);
      const $child = $li.find("> .sub-menu").first();
      if ($child.length) $li.addClass("has-sub");
    });

    $cronSubMobile.on("click", "> li.has-sub", function (e) {
      if (jQuery(e.target).closest("> .sub-menu").length) return;

      e.preventDefault();
      e.stopPropagation();

      const $li = jQuery(this);
      const $child = $li.find("> .sub-menu").first();

      $li.siblings(".has-sub").find("> .sub-menu").removeClass("active");
      $child.toggleClass("active");
    });

    $cronSubMobile.on("click", "> li:not(.has-sub) > a", function (e) {
      e.preventDefault();
      e.stopPropagation();

      let href = jQuery(this).attr("href");
      if (!href) return;

      href = href.split("#")[0];
      window.location.href = href + "#cronograma";

      $navbarCollapse.removeClass("show").css("display", "");
      document.body.classList.remove("menu-mobile-open");
    });

    $cronSubMobile.on("click", "> li.has-sub > .sub-menu a", function (e) {
      e.preventDefault();
      e.stopPropagation();

      let href = jQuery(this).attr("href");
      if (!href) return;

      href = href.split("#")[0];
      window.location.href = href + "#cronograma";

      $navbarCollapse.removeClass("show").css("display", "");
      document.body.classList.remove("menu-mobile-open");
    });
  }

  const $cronogramasSubmenu = $menuCronogramas.find("> .sub-menu").first();
  const $firstCronItem = $cronogramasSubmenu.find("> li:first-child").first();

  if ($firstCronItem.length) {
    $firstCronItem.addClass("has-sub");

    const $lateral = $firstCronItem.find("> .sub-menu").first();
    if ($lateral.length) {
      $lateral.addClass("lateral");

      $firstCronItem.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        jQuery(".menu-principal .sub-menu.lateral")
          .not($lateral)
          .removeClass("active");
        $lateral.toggleClass("active");
      });

      $cronogramasSubmenu.on("click", "> li:not(:first-child)", function () {
        $lateral.removeClass("active");
      });

      $menuCronogramas.on("click", function () {
        const $main = jQuery(this).find(".sub-menu").first();
        if (!$main.hasClass("active")) {
          $lateral.removeClass("active");
        }
      });
    }
  }

  jQuery(".menu-principal .sub-menu.lateral a").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    let href = jQuery(this).attr("href");
    if (!href) return;

    href = href.split("#")[0];
    window.location.href = href + "#cronograma";
  });

  $menuCronogramas
    .find("> .sub-menu > li:not(.has-sub) a")
    .on("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      let href = jQuery(this).attr("href");
      if (!href) return;

      href = href.split("#")[0];
      window.location.href = href + "#cronograma";
    });

  jQuery(function ($) {
    $("[data-tab]").on("click", function (e) {
      e.preventDefault();
      const $item = $(this);
      const target = $item.data("tab");
      const $container = $item.closest(".carreira-tec");

      $container.find(".nav-link").removeClass("active");
      $item.find(".nav-link").addClass("active");

      const $cards = $container.find(".card-trilha");
      const $targetCard = $cards.filter('[data-content="' + target + '"]');

      $cards.removeClass("active").stop(true, true).hide();

      $targetCard.addClass("active").stop(true, true).fadeIn("fast");
    });
  });

  jQuery("[data-tab]").click(function () {
    jQuery(this)
      .closest(".card-curso")
      .find("[data-tab]")
      .removeClass("active");
    jQuery(this).addClass("active");
    jQuery(this).closest(".card-curso").find("[data-content]").hide();
    jQuery('[data-content="' + jQuery(this).data("tab") + '"]').fadeIn("fast");
  });

  jQuery(".card-video").on("click", "img, .video-thumbnail, .btn-play", function (e) {
    if (jQuery(this).closest(".ctn-acervo").length) return;
    const $card = jQuery(this).closest(".card-video");
    const $iframe = $card.find("iframe");

    if ($iframe.length) {
      $card.find("img, .video-thumbnail, .btn-play").hide();
      let src = $iframe.attr("data-src") || "";
      if (src) {
        try {
          const url = new URL(src);
          if (!url.searchParams.has("autoplay")) {
            url.searchParams.set("autoplay", "1");
          }
          src = url.toString();
        } catch (err) {
          if (src.indexOf("autoplay=1") === -1) {
            src += (src.indexOf("?") === -1 ? "?" : "&") + "autoplay=1";
          }
        }
        $iframe.attr("src", src);
      }
      $iframe.show();
      return;
    }

    $card.find("img, .video-thumbnail, .btn-play").hide();
    const $video = $card.find(".video");
    const video = $video[0];
    $video.show();
    if (video) video.play();

    if (video && !video.dataset.endedBound) {
      video.dataset.endedBound = "1";
      video.addEventListener("ended", function () {
        $video.hide();
        $card.find("img, .video-thumbnail, .btn-play").fadeIn();
      });
    }
  });

  const larguraMinima = 1024;
  if (jQuery(window).width() < larguraMinima) {
    setInterval(() => {
      jQuery(this).find(".ctn-zoom").removeClass("active zoom");
      jQuery(this).find(".ctn-zoom").fadeIn("fast");
      jQuery(this).find(".ctn-zoom").addClass("active");

      setTimeout(() => {
        jQuery(this).find(".ctn-zoom").addClass("zoom");
        jQuery(this)
          .find(".ctn-zoom")
          .fadeOut("1000", function () {
            jQuery(this).find(".ctn-zoom").removeClass("active");
          });
      }, 1000);
    }, 1500);

    jQuery(".diagrama").click(function () {
      jQuery(".ctn-zoom").remove();
    });
  }
});


`;export{e as default};