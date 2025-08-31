import { formatHandle } from "./handle.js";

function setErrorAbove(id, message) {
  const el = document.getElementById(`err-${id}-above`);
  if (!el) return;
  el.textContent = message || "";
}

function validateName() {
  const fullName = document.getElementById("fullName").value.trim();
  const parts = fullName.split(/\s+/).filter(Boolean);
  if (parts.length < 2) {
    setErrorAbove("fullName", "Informe nome e sobrenome.");
    return false;
  }
  setErrorAbove("fullName", "");
  return true;
}

function validateEmail() {
  const email = document.getElementById("email").value.trim();
  if (!email.includes("@") || !email.includes(".")) {
    setErrorAbove("email", "Informe um e-mail válido (ex.: voce@exemplo.com).");
    return false;
  }
  setErrorAbove("email", "");
  return true;
}

function validateGithub() {
  const ghInput = document.getElementById("github");
  let raw = ghInput.value.trim();
  let username = raw.startsWith("@") ? raw.slice(1) : raw;
  const basicValid =
    username.length >= 2 &&
    !username.includes(" ") &&
    !username.includes("@");
  if (!basicValid) {
    setErrorAbove("github", "Usuário do GitHub inválido (ex.: @seuusuario).");
    return false;
  }
  ghInput.value = "@" + username;
  setErrorAbove("github", "");
  return true;
}

function validateAgree() {
  const agree = document.getElementById("agree").checked;
  if (!agree) {
    setErrorAbove("agree", "Confirme que os dados estão corretos.");
    return false;
  }
  setErrorAbove("agree", "");
  return true;
}

export function validateForm() {
  const okName = validateName();
  const okEmail = validateEmail();
  const okGitHub = validateGithub();
  const okAgree = validateAgree();
  return okName && okEmail && okGitHub && okAgree;
}

export const validateField = {
  fullName: validateName,
  email: validateEmail,
  github: validateGithub,
  agree: validateAgree,
};
