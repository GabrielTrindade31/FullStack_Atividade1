import { validateForm, validateField } from "./validation.js";
import { saveFormData } from "./storage.js";
import { Config } from "./config.js";

function exposeDemoAPI() {
  const Demo = {
    setNameRule(v) { Config.nameRule = v; console.info("nameRule =", v); },
    setErrorMode(v) { Config.errorMode = v; console.info("errorMode =", v); },
    setGithubMode(v) { Config.githubMode = v; console.info("githubMode =", v); },
    setAutoCapitalize(v) { Config.autoCapitalize = !!v; console.info("autoCapitalize =", !!v); },
    setGithubMin(n) { const m = Math.max(1, parseInt(n || 1, 10)); Config.githubMinLen = m; console.info("githubMinLen =", m); },
    getConfig() { return { ...Config }; }
  };
  window.Demo = Demo;
  console.log("%cDemo API disponível", "background:#0b1128;color:#6ea8ff;padding:2px 6px;border-radius:4px", Demo.getConfig());
}

document.addEventListener("DOMContentLoaded", () => {
  exposeDemoAPI();

  const form = document.getElementById("ticket-form");
  const avatarInput = document.getElementById("avatar");
  const avatarPreview = document.getElementById("avatarPreview");

  ["fullName", "email", "github"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("blur", () => validateField[id]?.());
  });
  const agree = document.getElementById("agree");
  if (agree) agree.addEventListener("change", () => validateField.agree?.());

  avatarInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => { avatarPreview.src = fr.result; };
    fr.readAsDataURL(file);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      fullName: document.getElementById("fullName").value.trim(),
      email: document.getElementById("email").value.trim(),
      github: document.getElementById("github").value.trim(),
      ticketType: document.getElementById("ticketType").value,
      avatarDataUrl: avatarPreview?.src
    };
    saveFormData(data);
    window.location.href = "./preview.html";
  });
});
