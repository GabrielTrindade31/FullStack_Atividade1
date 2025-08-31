import { initPreview, resetPreview } from "./preview.js";
import { validateForm, validateField } from "./validation.js";
import { downloadTicketPNG } from "./download.js";

function initLayoutButtons() {
  const root = document.getElementById("app");
  const normal = document.querySelector('[data-layout="normal"]');
  const compact = document.querySelector('[data-layout="compact"]');
  if (normal) normal.addEventListener("click", () => root.classList.remove("u-dense"));
  if (compact) compact.addEventListener("click", () => root.classList.add("u-dense"));
}

document.addEventListener("DOMContentLoaded", () => {
  initPreview();
  initLayoutButtons();

  const form = document.getElementById("ticket-form");
  const btnReset = document.getElementById("btnReset");
  const btnDownload = document.getElementById("btnDownloadPNG");

  ["fullName", "email", "github"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("blur", () => validateField[id]?.());
  });
  const agree = document.getElementById("agree");
  if (agree) agree.addEventListener("change", () => validateField.agree?.());

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = validateForm();
    if (ok) {
      const id = "#TicketID-" + String(Math.floor(Math.random() * 9999)).padStart(4, "0");
      document.getElementById("ticketId").textContent = id;
      alert("Ingresso gerado com sucesso!");
    }
  });

  btnReset.addEventListener("click", () => {
    form.reset();
    resetPreview();
    ["fullName", "email", "github", "agree"].forEach((k) => {
      const el = document.getElementById(`err-${k}-above`);
      if (el) el.textContent = "";
    });
  });

  btnDownload.addEventListener("click", async () => {
    await downloadTicketPNG();
  });
});
