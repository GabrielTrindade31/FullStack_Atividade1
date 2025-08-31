export function formatHandle(value) {
  const v = (value || "").trim();
  if (!v) return "@github";
  return v.startsWith("@") ? v : "@" + v;
}
