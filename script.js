/* ===============================
FILE: script.js for HOMEPAGE
=============================== */

/* ===============================
 Auto-update year in footer
 =============================== */
// store the year in var yearlEL
const yearEl = document.getElementById("currentYear");
// if yearEL exists, set its text content to current year
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===============================
 Header scroll effect
 =============================== */
//  IIFE to avoid polluting global scope
(function () {
  // Get header element
  const header = document.querySelector(".header");
  // If no header found, exit
  if (!header) return;

  const THRESHOLD = 1; // px scrolled before changing header style

  // Update header style based on scroll position
  function update() {
    // Check if at top of page
    const atTop = window.scrollY <= THRESHOLD;
    // Toggle classes based on scroll position
    header.classList.toggle("header--transparent", atTop);
    header.classList.toggle("header--solid", !atTop);
  }

  update(); // Initial check
  // Update on scroll with passive listener for performance
  window.addEventListener("scroll", update, { passive: true });
})();

/* ===============================
 Dropdown menus (hover on desktop, click on mobile)
=============================== */

// ✅ On Desktop (wide screen)
// User hovers on any category in header → menu opens
// User moves mouse away → menu closes
// ✅ On Mobile (small screen)
// User clicks any category in header → menu opens/closes
// User clicks a dropdown link → menu closes
// User taps anywhere outside → menu closes
// User presses ESC → menu closes
// User rotates phone / resizes → menu closes

// CSS handles desktop hover
// JS handles mobile click + state

/* ===============================
   NAV DROPDOWN (Mobile click only)
   Desktop hover is handled by CSS
=============================== */

(function () {
  // Helper to detect desktop vs mobile
  const isDesktop = () => window.matchMedia("(min-width: 901px)").matches;

  // Setup dropdown logic for a given dropdown
  function setupDropdown(wrapId, btnId, menuId) {
    const wrap = document.getElementById(wrapId);
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);

    //If any element is missing, exit
    if (!wrap || !btn || !menu) return null;

    // Functions to open menu
    function openMenu() {
      wrap.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      menu.hidden = false;
    }

    // Functions to close menu
    function closeMenu() {
      wrap.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    }

    // Mobile: toggle on click
    btn.addEventListener("click", (e) => {
      if (isDesktop()) return; // desktop uses hover
      e.stopPropagation();

      const isOpen = btn.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    // Mobile: close when link clicked
    menu.addEventListener("click", (e) => {
      if (isDesktop()) return;
      if (e.target.closest("a")) closeMenu();
    });

    return { wrap, closeMenu };
  }

  const ddAbout = setupDropdown("aboutWrap", "aboutBtn", "aboutMenu");

  const ddCat = setupDropdown("catWrap", "catBtn", "catMenu");

  const ddDownloads = setupDropdown("dlWrap", "dlBtn", "dlMenu");

  // Close on outside click (mobile)
  document.addEventListener("click", (e) => {
    if (isDesktop()) return;

    if (ddAbout && !ddAbout.wrap.contains(e.target)) {
      ddAbout.closeMenu();
    }
    if (ddCat && !ddCat.wrap.contains(e.target)) {
      ddCat.closeMenu();
    }
    if (ddDownloads && !ddDownloads.wrap.contains(e.target)) {
      ddDownloads.closeMenu();
    }
  });

  // Close on ESC (all devices)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      ddAbout?.closeMenu();
      ddCat?.closeMenu();
      ddDownloads?.closeMenu();
    }
  });

  // Close on resize (safety reset)
  window.addEventListener("resize", () => {
    ddAbout?.closeMenu();
    ddCat?.closeMenu();
    ddDownloads?.closeMenu();
  });
})();

/* ===============================
   Language selector (toggle + a11y) 
   =============================== */

// Immediately Invoked Function Expression (IIFE) to avoid polluting global scope
(function () {
  // Get relevant elements
  const wrap = document.querySelector(".lang-wrap");
  const btn = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");

  // If any element is missing, exit
  if (!wrap || !btn || !menu) return;

  // Get flag and code elements inside button
  const flagEl = btn.querySelector(".lang__flag");
  const codeEl = btn.querySelector(".lang__code");

  // safety check for flag and code elements
  if (!flagEl || !codeEl) return;

  function open() {
    btn.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    menu.hidden = false;
  }
  function close() {
    btn.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    menu.hidden = true;
  }
  function toggle() {
    menu.hidden ? open() : close();
  }

  // button click toggles menu
  btn.addEventListener("click", toggle);

  // close on outside click
  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) close();
  });

  // close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // Handle menu item clicks
  menu.addEventListener("click", (e) => {
    // find closest menu item that was clicked
    const li = e.target.closest('li[role="menuitem"]');
    if (!li) return;

    // this is the selected item now which we highlight
    [...menu.querySelectorAll('li[role="menuitem"]')].forEach((x) =>
      x.removeAttribute("aria-current"),
    );
    // set aria-current on selected item
    li.setAttribute("aria-current", "true");

    // update button flag + code
    const lang = li.dataset.lang; // "az" | "en" | "ru"
    codeEl.textContent = lang.toUpperCase();

    const nextSrc = `/assets/flags/${lang}.svg`;

    // If load fails, fallback to AZ (prevents layout shift / broken icon)
    flagEl.onerror = () => {
      flagEl.src = `/assets/flags/az.svg`;
    };

    flagEl.src = nextSrc;

    close();
  });
})();

/*========================= 
Featured slider logic 
========================= */
// IIFE to avoid polluting global scope
(function () {
  // Get slider track element
  const track = document.getElementById("featTrack");
  // If no track found, exit
  if (!track) return;

  // Get slides, dots container, prev/next buttons, and wrapper
  const slides = Array.from(track.querySelectorAll(".featured__slide"));
  const dotsWrap = document.getElementById("featDots");
  const prevBtn = document.querySelector(".featured__ctrl.prev");
  const nextBtn = document.querySelector(".featured__ctrl.next");
  const wrap = document.querySelector(".featured__wrap");

  // if no slides, exit
  if (!slides.length) return;

  // autoplay interval in ms
  const AUTOPLAY_MS = 5000;
  // CSS transition for slide movement
  const TRANSITION_CSS = "transform .45s ease";
  // Current slide index, timer, and animation state
  let i = 0,
    timer = null,
    animating = false,
    animTO = null;

  // Create dot buttons for each slide
  slides.forEach((_, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Slayd ${idx + 1}`);
    b.addEventListener("click", () => {
      goTo(idx);
      restart();
    });
    dotsWrap.appendChild(b);
  });

  // Update dot buttons to reflect current slide
  function updateDots() {
    dotsWrap
      .querySelectorAll("button")
      .forEach((d, idx) =>
        d.setAttribute("aria-current", idx === i ? "true" : "false"),
      );
  }

  // Render the slider to show the current slide
  function render() {
    // Calculate next transform position
    const next = `translateX(-${i * 100}%)`;
    const changed = track.style.transform !== next;

    // If position changed, set animating state
    if (changed) {
      animating = true;
      clearTimeout(animTO);
      animTO = setTimeout(() => (animating = false), 700); // fallback
    }
    track.style.transform = next;
    // Update dots to reflect current slide
    updateDots();
  }

  // Listen for transition end to clear animating state
  track.addEventListener("transitionend", (e) => {
    if (e.propertyName === "transform") {
      animating = false;
      clearTimeout(animTO);
    }
  });

  // Navigate to a specific slide index
  function goTo(idx) {
    if (animating) return;
    const target = (idx + slides.length) % slides.length;
    if (target === i) return; // no-op
    i = target;
    render();
  }
  const next = () => goTo(i + 1);
  const prev = () => goTo(i - 1);

  // start autoplay
  function start() {
    if (!timer) timer = setInterval(next, AUTOPLAY_MS);
  }
  // Stop autoplay
  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  // Restart autoplay
  function restart() {
    stop();
    start();
  }

  // next/prev button handlers
  nextBtn?.addEventListener("click", () => {
    next();
    restart();
  });
  prevBtn?.addEventListener("click", () => {
    prev();
    restart();
  });

  // wrap event handlers to pause/resume on hover/focus/touch
  wrap?.addEventListener("mouseenter", stop);
  wrap?.addEventListener("mouseleave", start);
  wrap?.addEventListener("focusin", stop);
  wrap?.addEventListener("focusout", start);
  wrap?.addEventListener("touchstart", stop, { passive: true });
  wrap?.addEventListener("touchend", start, { passive: true });

  // Pause animation when tab is inactive, resume when active
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else {
      animating = false;
      start();
    }
  });

  // Initial setup: no transition, go to first slide, then enable transitions and start
  track.style.transition = "none";
  track.style.transform = "translateX(0)"; // i = 0
  updateDots();

  requestAnimationFrame(() => {
    // enable smooth transitions AFTER first paint
    track.style.transition = TRANSITION_CSS;
    start();
  });
})();

/* ===============================
   Contact dock: tap to expand on touch-only devices
   =============================== */
(function () {
  const items = document.querySelectorAll(".contact-dock .contact-item");
  const isTouchOnly = window.matchMedia("(hover: none)").matches;
  if (!items.length || !isTouchOnly) return;

  items.forEach((el) => {
    el.addEventListener("click", function (e) {
      if (!el.classList.contains("open")) {
        e.preventDefault(); // first tap just expands
        el.classList.add("open");
        clearTimeout(el._t);
        el._t = setTimeout(() => el.classList.remove("open"), 3000);
      }
    });
  });
})();

/* ===============================
   PAGE TRANSITION — FADE
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  // Fade in on load
  document.body.classList.remove("page-exit");

  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const url = new URL(link.href, window.location.href);

      // ✅ 1. Allow pure hash navigation
      if (url.pathname === window.location.pathname && url.hash) {
        return; // let browser scroll normally
      }

      // ✅ 2. Allow external links
      if (url.origin !== window.location.origin) {
        return;
      }

      // ✅ 3. Allow target="_blank"
      if (link.target === "_blank") {
        return;
      }

      if (
        link.href.startsWith("tel:") ||
        link.href.startsWith("mailto:") ||
        url.origin !== window.location.origin
      ) {
        return;
      }

      // Otherwise → page transition
      e.preventDefault();

      document.body.classList.add("page-exit");

      setTimeout(() => {
        window.location.href = link.href;
      }, 300);
    });
  });
});

/* ===============================
   SMOOTH IMAGE LOAD FADE-IN
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    // If image already loaded (from cache)
    if (img.complete) {
      img.classList.add("is-loaded");
      return;
    }

    // When image finishes loading
    img.addEventListener("load", () => {
      img.classList.add("is-loaded");
    });

    // Safety: if error occurs, still show image area
    img.addEventListener("error", () => {
      img.classList.add("is-loaded");
    });
  });
});
