(function () {
  "use strict";

  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = qs("body");
    const selectHeader = qs("#header");

    // ✅ Guard: páginas como register.html não têm header
    if (!selectBody || !selectHeader) return;

    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;

    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = qs(".mobile-nav-toggle");

  function mobileNavToogle() {
    const body = qs("body");
    if (!body || !mobileNavToggleBtn) return;

    body.classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }

  // ✅ Guard
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  const navmenu = qs("#navmenu");
  if (navmenu) {
    qsa("a", navmenu).forEach((link) => {
      link.addEventListener("click", () => {
        if (qs(".mobile-nav-active")) mobileNavToogle();
      });
    });
  }

  /**
   * Toggle mobile nav dropdowns
   */
  qsa(".navmenu .toggle-dropdown").forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      if (!this.parentNode || !this.parentNode.nextElementSibling) return;

      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = qs("#preloader");
  if (preloader) {
    window.addEventListener("load", () => preloader.remove());
  }

  /**
   * Scroll top button
   */
  const scrollTop = qs(".scroll-top");

  function toggleScrollTop() {
    if (!scrollTop) return;
    window.scrollY > 100
      ? scrollTop.classList.add("active")
      : scrollTop.classList.remove("active");
  }

  // ✅ Guard
  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("load", toggleScrollTop);
    document.addEventListener("scroll", toggleScrollTop);
  }

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    // ✅ Guard: se AOS não foi carregado
    if (!window.AOS) return;

    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Initiate glightbox
   */
  if (window.GLightbox) {
    GLightbox({ selector: ".glightbox" });
  }

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    // ✅ Guard: se Swiper não foi carregado
    if (!window.Swiper) return;

    qsa(".init-swiper").forEach((swiperElement) => {
      const cfgEl = qs(".swiper-config", swiperElement);
      if (!cfgEl) return;

      let config;
      try {
        config = JSON.parse(cfgEl.innerHTML.trim());
      } catch {
        return;
      }

      // Se você tiver initSwiperWithCustomPagination em outro arquivo, mantém.
      if (swiperElement.classList.contains("swiper-tab") && window.initSwiperWithCustomPagination) {
        window.initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }
  window.addEventListener("load", initSwiper);

  /**
   * Init isotope layout and filters (somente se libs existirem)
   */
  if (window.Isotope && window.imagesLoaded) {
    qsa(".isotope-layout").forEach((isotopeItem) => {
      const container = qs(".isotope-container", isotopeItem);
      if (!container) return;

      const layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
      const filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
      const sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

      let initIsotope;

      imagesLoaded(container, function () {
        initIsotope = new Isotope(container, {
          itemSelector: ".isotope-item",
          layoutMode: layout,
          filter: filter,
          sortBy: sort,
        });
      });

      qsa(".isotope-filters li", isotopeItem).forEach((li) => {
        li.addEventListener("click", function () {
          const active = qs(".isotope-filters .filter-active", isotopeItem);
          if (active) active.classList.remove("filter-active");

          this.classList.add("filter-active");

          if (initIsotope) {
            initIsotope.arrange({ filter: this.getAttribute("data-filter") });
          }

          aosInit();
        });
      });
    });
  }

  /**
   * Initiate Pure Counter
   */
  if (window.PureCounter) {
    new PureCounter();
  }

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener("load", function () {
    if (!window.location.hash) return;

    const section = qs(window.location.hash);
    if (!section) return;

    setTimeout(() => {
      const scrollMarginTop = getComputedStyle(section).scrollMarginTop;
      window.scrollTo({
        top: section.offsetTop - parseInt(scrollMarginTop || "0", 10),
        behavior: "smooth",
      });
    }, 100);
  });

  /**
   * Navmenu Scrollspy
   */
  const navmenulinks = qsa(".navmenu a");

  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      const section = qs(navmenulink.hash);
      if (!section) return;

      const position = window.scrollY + 200;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        qsa(".navmenu a.active").forEach((link) => link.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }

  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);
})();
