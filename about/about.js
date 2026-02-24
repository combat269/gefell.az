/* =========================================================
   about.js
   - Timeline "Daha ətraflı" expand/collapse
   - Optional: FAQ only one open at a time
   ========================================================= */

(function () {
  // ===== Timeline toggles =====
  const timeline = document.querySelector("[data-pt]");
  if (timeline) {
    const cards = Array.from(timeline.querySelectorAll(".pt-card"));

    cards.forEach((card) => {
      const btn = card.querySelector(".pt-card__toggle");
      const details = card.querySelector(".pt-card__details");
      if (!btn || !details) return;

      btn.addEventListener("click", () => {
        const isOpen = btn.getAttribute("aria-expanded") === "true";

        // Close all (clean UX)
        cards.forEach((c) => {
          const b = c.querySelector(".pt-card__toggle");
          const d = c.querySelector(".pt-card__details");
          if (!b || !d) return;
          c.classList.remove("is-open");
          b.setAttribute("aria-expanded", "false");
          d.hidden = true;
        });

        // Open clicked if it was closed
        if (!isOpen) {
          card.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          details.hidden = false;
        }
      });
    });
  }

  // ===== FAQ: allow multiple open at the same time =====
  const faqWrap = document.querySelector("[data-faq]");

  if (faqWrap) {
    const items = Array.from(faqWrap.querySelectorAll("details"));

    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        // No auto-closing behavior
        // Each question works independently
      });
    });
  }
})();

/* ===============================
   ABOUT PAGE JS
   - FAQ accordion (only one open)
   =============================== */
// (() => {
//   const faqWrap = document.querySelector("[data-faq]");
//   if (!faqWrap) return;

//   const items = Array.from(faqWrap.querySelectorAll("details.faq-item"));

//   items.forEach((d) => {
//     d.addEventListener("toggle", () => {
//       if (!d.open) return;
//       // close others
//       items.forEach((x) => {
//         if (x !== d) x.open = false;
//       });
//     });
//   });
// })();
