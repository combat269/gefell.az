/* ===============================
   DOWNLOADS PAGE JS
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  secureExternalLinks();
});

function secureExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
  });
}
