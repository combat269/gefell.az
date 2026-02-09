/* ===============================
FILE: news.js
Purpose: News page interactions
- Search + category filter (no backend needed)
- Keeps UI responsive and simple
=============================== */

(function () {
  const list = document.getElementById("newsList");
  const empty = document.getElementById("newsEmpty");
  const search = document.getElementById("newsSearch");
  const filter = document.getElementById("newsFilter");

  if (!list || !search || !filter || !empty) return;

  const cards = Array.from(list.querySelectorAll(".news-card"));

  function normalize(s) {
    return (s || "").toLowerCase().trim();
  }

  function applyFilters() {
    const q = normalize(search.value);
    const cat = filter.value; // "all" | "partner" | "product" | "docs" | "company"

    let visibleCount = 0;

    cards.forEach((card) => {
      const text = normalize(card.textContent);
      const cardCat = card.dataset.cat || "all";

      const matchesText = q === "" || text.includes(q);
      const matchesCat = cat === "all" || cardCat === cat;

      const show = matchesText && matchesCat;
      card.hidden = !show;

      if (show) visibleCount++;
    });

    empty.hidden = visibleCount !== 0;
  }

  search.addEventListener("input", applyFilters);
  filter.addEventListener("change", applyFilters);

  // Initial render
  applyFilters();
})();
