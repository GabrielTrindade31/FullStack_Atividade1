import { validateForm, validateField } from "./validation.js";
import { saveFormData } from "./storage.js";
import { formatHandle } from "./handle.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ticket-form");
  const avatarInput = document.getElementById("avatar");
  const avatarPreview = document.getElementById("avatarPreview");

  ["fullName", "email", "github"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("blur", () => validateField[id]?.());
  });
  const agree = document.getElementById("agree");
  if (agree) agree.addEventListener("change", () => validateField.agree?.());

  avatarInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => {
      avatarPreview.src = fr.result;
    };
    fr.readAsDataURL(file);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      fullName: document.getElementById("fullName").value.trim(),
      email: document.getElementById("email").value.trim(),
      github: formatHandle(document.getElementById("github").value.trim()),
      ticketType: document.getElementById("ticketType").value,
      avatarDataUrl: avatarPreview.src
    };

    saveFormData(data);
    window.location.href = "./preview.html";
  });
});
