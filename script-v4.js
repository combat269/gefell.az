/* GEFELL v4 — interactions */

document.addEventListener("DOMContentLoaded", () => {
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
});

/* Header scroll */
(function () {
  const h = document.getElementById("hdr");
  if (!h) return;
  const u = () => h.classList.toggle("is-scrolled", window.scrollY > 4);
  u();
  window.addEventListener("scroll", u, { passive: true });
})();

/* Mobile menu */
(function () {
  const b = document.getElementById("burger"),
    m = document.getElementById("mmenu");
  if (!b || !m) return;
  b.addEventListener("click", () => {
    const open = m.classList.toggle("is-open");
    b.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  });
  m.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      m.classList.remove("is-open");
      b.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }),
  );
})();

/* Language switcher (AZ live, RU/EN coming soon) */
(function () {
  const wrap = document.getElementById("langWrap");
  const btn = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");
  if (!wrap || !btn || !menu) return;
  const close = () => {
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  };
  btn.addEventListener("click", () => (menu.hidden ? open() : close()));
  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

/* Ticker — auto-fill so there's never a gap, on any screen width */
(function () {
  const row = document.getElementById("tickerRow");
  if (!row) return;

  const baseSrcs = Array.from(row.children).map((img) => ({
    src: img.src,
    alt: img.alt,
  }));
  if (!baseSrcs.length) return;

  function addSet() {
    baseSrcs.forEach(({ src, alt }) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = alt;
      row.appendChild(img);
    });
  }

  function build() {
    row.style.animation = "none";
    row.innerHTML = "";
    addSet(); // first copy of the base set

    // keep adding sets until one "half" is wider than the viewport,
    // so there's always more than enough content to fill the screen
    const target = window.innerWidth * 1.15;
    let guard = 0;
    while (row.scrollWidth < target && guard < 40) {
      addSet();
      guard++;
    }

    // duplicate everything once more so translateX(-50%) loops seamlessly
    const half = Array.from(row.children);
    half.forEach((img) => row.appendChild(img.cloneNode(true)));

    // speed scales with content length so it never feels rushed or crawling
    const halfWidth =
      half.reduce((w, img) => w + img.getBoundingClientRect().width, 0) +
      half.length * 64;
    const duration = Math.max(18, Math.round(halfWidth / 60));
    row.style.animation = `tick ${duration}s linear infinite`;
  }

  // build once images can report real widths
  const imgs = Array.from(row.querySelectorAll("img"));
  Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((res) => (img.onload = img.onerror = res)),
    ),
  ).then(build);

  let resizeT;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(build, 200);
  });
})();

/* Hero slider with syncing tag */
(function () {
  const stage = document.getElementById("heroStage");
  const dots = document.getElementById("heroDots");
  const tag = document.getElementById("heroTag");
  if (!stage || !dots) return;
  const slides = Array.from(stage.querySelectorAll(".hero__slide"));
  if (!slides.length) return;

  const tags = [
    { b: "KNG · Alüminium", n: "Qaldır-Sür HBSB Sistemi" },
    { b: "KNG · Alüminium", n: "Gizli Pəncərə Sistemi" },
    { b: "GEALAN · PVC", n: "S8000 Profil Sistemi" },
    { b: "SIEGENIA · PVC", n: "TITAN Pəncərə Sistemi" },
    { b: "AXOR · PVC", n: "Pəncərə Sistemi" },
    { b: "AXOR · PVC", n: "Qaldır-Sür (HBSB) Sistemi" },
  ];

  // per-slide data-tag-b / data-tag-n attributes take priority (lets each
  // language page supply its own caption text); falls back to the AZ array above
  function tagFor(idx) {
    const slide = slides[idx];
    const b = slide && slide.dataset.tagB;
    const n = slide && slide.dataset.tagN;
    if (b && n) return { b: b, n: n };
    return tags[idx];
  }

  let i = 0;
  slides.forEach((_, idx) => {
    const d = document.createElement("button");
    d.type = "button";
    d.setAttribute("aria-label", `Slayd ${idx + 1}`);
    d.setAttribute("aria-current", idx === 0 ? "true" : "false");
    d.addEventListener("click", () => go(idx));
    dots.appendChild(d);
  });

  function go(idx) {
    slides[i].classList.remove("is-active");
    dots.children[i].setAttribute("aria-current", "false");
    i = idx;
    slides[i].classList.add("is-active");
    dots.children[i].setAttribute("aria-current", "true");
    const t = tagFor(i);
    if (tag && t) {
      tag.querySelector(".b").textContent = t.b;
      tag.querySelector(".n").textContent = t.n;
    }
  }

  // set initial tag text from slide 0's data attributes (if present) on load
  const t0 = tagFor(0);
  if (tag && t0) {
    tag.querySelector(".b").textContent = t0.b;
    tag.querySelector(".n").textContent = t0.n;
  }

  let t = setInterval(() => go((i + 1) % slides.length), 4500);
  stage.addEventListener("mouseenter", () => clearInterval(t));
  stage.addEventListener("mouseleave", () => {
    t = setInterval(() => go((i + 1) % slides.length), 4500);
  });
})();

/* Count-up on hero specs */
(function () {
  const nums = document.querySelectorAll("[data-count]");
  if (!nums.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        let cur = 0;
        const step = Math.max(1, Math.round(target / 30));
        const tick = () => {
          cur += step;
          if (cur >= target) {
            el.textContent = target + suffix;
          } else {
            el.textContent = cur + suffix;
            requestAnimationFrame(tick);
          }
        };
        tick();
        io.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );
  nums.forEach((n) => io.observe(n));
})();

/* Reveal */
(function () {
  const els = document.querySelectorAll("[data-r]");
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );
  els.forEach((el) => io.observe(el));
})();

/* Certificate lightbox */
(function () {
  const lightbox = document.getElementById("certLightbox");
  const lbImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");
  const cards = document.querySelectorAll(".cert-card");
  if (!lightbox || !lbImg || !closeBtn || !cards.length) return;

  let lastFocused = null;

  function openLightbox(card) {
    if (card.classList.contains("ph-missing")) return; // no image uploaded yet
    const img = card.querySelector(".cert-card__media img");
    if (!img) return;
    lastFocused = document.activeElement;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    closeBtn.focus();
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => openLightbox(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(card);
      }
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open"))
      closeLightbox();
  });
})();

/* Persistent language preference
   - Remembers the language a person explicitly switches to (via the AZ/RU/EN menu)
   - On later page loads, if a saved preference exists and differs from the
     current page's language, jumps to that page's translated equivalent
     using the <link rel="alternate" hreflang="..."> tags already present
     on every page. If no translated equivalent exists yet, it simply does
     nothing and stays on the current (untranslated) page. */
(function () {
  const STORAGE_KEY = "gefell_lang";
  const currentLang = document.documentElement.lang; // "az" | "ru" | "en"

  // Remember explicit choices made via the language switcher
  document.querySelectorAll(".lang-v4__menu a[href]").forEach((a) => {
    a.addEventListener("click", () => {
      const href = a.getAttribute("href") || "";
      let lang = "az";
      if (href.startsWith("/ru/")) lang = "ru";
      else if (href.startsWith("/en/")) lang = "en";
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {
        /* localStorage unavailable (private mode etc.) — fail silently */
      }
    });
  });

  // Auto-redirect on load if a saved preference differs from this page
  let saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    saved = null;
  }
  if (saved && saved !== currentLang) {
    const alt = document.querySelector(
      `link[rel="alternate"][hreflang="${saved}"]`,
    );
    if (alt) {
      try {
        const targetUrl = new URL(alt.getAttribute("href"), location.href);
        if (targetUrl.pathname !== location.pathname) {
          window.location.replace(targetUrl.href);
        }
      } catch (e) {
        /* malformed hreflang URL — ignore */
      }
    }
    // if no matching hreflang tag exists, this page has no translation yet —
    // stay put rather than sending the person somewhere unexpected
  }
})();

/* Contact form — AJAX submit to Formspree, no page reload */
(function () {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const btn = document.getElementById("submitBtn");
  if (!form || !status || !btn) return;

  const MESSAGES = {
    az: {
      sending: "Göndərilir...",
      ok: "Mesajınız uğurla göndərildi. Ən qısa zamanda sizinlə əlaqə saxlayacağıq.",
      err: "Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin və ya birbaşa əlaqə saxlayın.",
    },
    ru: {
      sending: "Отправка...",
      ok: "Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.",
      err: "Произошла ошибка. Пожалуйста, попробуйте снова или свяжитесь с нами напрямую.",
    },
    en: {
      sending: "Sending...",
      ok: "Your message has been sent successfully. We'll get back to you shortly.",
      err: "Something went wrong. Please try again or contact us directly.",
    },
  };
  const lang = document.documentElement.lang;
  const t = MESSAGES[lang] || MESSAGES.az;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    btn.disabled = true;
    status.className = "form-status";
    status.textContent = t.sending;

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        status.textContent = t.ok;
        status.classList.add("ok");
        form.reset();
      } else {
        status.textContent = t.err;
        status.classList.add("err");
      }
    } catch (err) {
      status.textContent = t.err;
      status.classList.add("err");
    } finally {
      btn.disabled = false;
    }
  });
})();
