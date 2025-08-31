import { Config } from "./config.js";


function ensureErrorEl(id, position) {
  const input = document.getElementById(id);
  if (!input) return null;

  const aboveId = `err-${id}-above`;
  const belowId = `err-${id}-below`;

  if (position === "above") {
    let el = document.getElementById(aboveId);
    if (!el) {
      el = document.createElement("div");
      el.id = aboveId;
      el.className = "error error--above";
      input.parentElement?.insertBefore(el, input);
    }
    return el;
  }

  if (position === "below") {
    let el = document.getElementById(belowId);
    if (!el) {
      el = document.createElement("div");
      el.id = belowId;
      el.className = "error error--below";
      input.parentElement?.insertBefore(el, input.nextSibling);
    }
    return el;
  }
  return null;
}

function showToast(message) {
  let root = document.getElementById("toast-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "toast-root";
    document.body.appendChild(root);
  }
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  root.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity .25s ease";
    setTimeout(() => el.remove(), 250);
  }, 2200);
}

export function setError(id, message) {
  const mode = Config.errorMode;

  const above = document.getElementById(`err-${id}-above`);
  const below = document.getElementById(`err-${id}-below`);
  if (above) above.textContent = "";
  if (below) below.textContent = "";

  if (!message) return;

  if (mode === "above") {
    const el = ensureErrorEl(id, "above");
    if (el) el.textContent = message;
    return;
  }
  if (mode === "below") {
    const el = ensureErrorEl(id, "below");
    if (el) el.textContent = message;
    return;
  }
  if (mode === "alert") {
    alert(message);
    return;
  }
  if (mode === "toast") {
    showToast(message);
    return;
  }
}

export function clearAllErrors(ids) {
  (ids || []).forEach((id) => setError(id, ""));
}
