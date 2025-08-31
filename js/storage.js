const KEY = "omc_form_data";

export function saveFormData(data) {
  sessionStorage.setItem(KEY, JSON.stringify(data || {}));
}

export function loadFormData() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function clearFormData() {
  sessionStorage.removeItem(KEY);
}
