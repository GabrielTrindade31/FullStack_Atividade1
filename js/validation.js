import { Config } from "./config.js";
import { setError } from "./errors.js";

function onlyFirstNameOK(full) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  return parts.length === 1;
}
function fullNameOK(full) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  return parts.length >= 2;
}
function capitalizeWords(s) {
  return s.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function normHandle(raw) {
  let v = (raw || "").trim();
  if (!v) return "";
  if (Config.githubMode === "requireAt") {
    return v; 
  }
  if (Config.githubMode === "autoAdd") {
    return v.startsWith("@") ? v : "@" + v;
  }
  return v.startsWith("@") ? v : "@" + v;
}

function validateName() {
  const el = document.getElementById("fullName");
  let v = el.value;

  if (Config.autoCapitalize && v.trim()) {
    v = capitalizeWords(v);
    el.value = v;
  }

  const ok =
    (Config.nameRule === "first" && onlyFirstNameOK(v)) ||
    (Config.nameRule === "full" && fullNameOK(v));

  if (!ok) {
    const msg =
      Config.nameRule === "first"
        ? "Informe apenas o primeiro nome."
        : "Informe nome e sobrenome.";
    setError("fullName", msg);
    return false;
  }

  setError("fullName", "");
  return true;
}

function validateEmail() {
  const email = document.getElementById("email").value.trim();
  const ok = email.includes("@") && email.includes(".");
  if (!ok) {
    setError("email", "Informe um e-mail válido (ex.: voce@exemplo.com).");
    return false;
  }
  setError("email", "");
  return true;
}

function validateGithub() {
  const input = document.getElementById("github");
  let raw = input.value.trim();

  // políticas de @
  if (Config.githubMode === "requireAt") {
    const ok = raw.startsWith("@") && raw.length > 1 && !raw.includes(" ");
    if (!ok || raw.length - 1 < Config.githubMinLen) {
      setError("github", "Inclua @ e um usuário válido (ex.: @seuusuario).");
      return false;
    }
    setError("github", "");
    return true;
  }

  if (Config.githubMode === "autoAdd") {
    const withAt = raw.startsWith("@") ? raw : "@" + raw;
    const username = withAt.slice(1);
    const ok = username.length >= Config.githubMinLen && !username.includes(" ") && !username.includes("@");
    if (!ok) {
      setError("github", "Usuário do GitHub inválido (ex.: @seuusuario).");
      return false;
    }
    input.value = withAt;
    setError("github", "");
    return true;
  }


  const username = raw.startsWith("@") ? raw.slice(1) : raw;
  const ok = username.length >= Config.githubMinLen && !username.includes(" ") && !username.includes("@");
  if (!ok) {
    setError("github", "Usuário do GitHub inválido (ex.: @seuusuario).");
    return false;
  }
  input.value = "@" + username;
  setError("github", "");
  return true;
}

function validateAgree() {
  const agree = document.getElementById("agree")?.checked;
  if (!agree) {
    setError("agree", "Confirme que os dados estão corretos.");
    return false;
  }
  setError("agree", "");
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
  agree: validateAgree
};
