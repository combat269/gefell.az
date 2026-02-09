/* ===============================
   FILE: contact.js
   CONTACT PAGE LOGIC (page-only)
   
=============================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const btn = form?.querySelector('button[type="submit"]');

  if (!form || !status) return;
  if (!form.action) {
    console.error("Form action is missing");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.textContent = "Göndərilir...";
    status.classList.remove("success", "error");
    status.classList.add("muted");
    if (btn) btn.disabled = true;

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.textContent = "Mesajınız uğurla göndərildi. Təşəkkür edirik!";
        status.classList.remove("muted");
        status.classList.add("success");
        form.reset();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          status.classList.add("hide");
          setTimeout(() => {
            status.textContent = "";
            status.classList.remove("success", "hide");
            status.classList.add("muted");
          }, 400);
        }, 5000);
      } else {
        const data = await response.json();
        status.textContent =
          data?.error || "Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.";
        status.classList.remove("muted");
        status.classList.add("error");
      }
    } catch {
      status.textContent =
        "Serverlə əlaqə qurulmadı. Zəhmət olmasa bir az sonra yenidən yoxlayın.";
      status.classList.remove("muted");
      status.classList.add("error");
    } finally {
      if (btn) btn.disabled = false;
    }
  });
});
