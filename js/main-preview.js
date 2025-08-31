import { loadFormData } from "./storage.js";
import { downloadTicketPNG } from "./download.js";

document.addEventListener("DOMContentLoaded", () => {
  const data = loadFormData();
  if (!data || !data.fullName) {
    window.location.replace("./form.html");
    return;
  }

  document.getElementById("previewName").textContent =
    data.fullName || "Seu Nome";
  document.getElementById("previewHandle").textContent =
    data.github || "@github";
  document.getElementById("previewTicketType").textContent =
    (data.ticketType || "standard").toUpperCase();
  document.getElementById("previewAvatar").src =
    data.avatarDataUrl || "./assets/placeholder-avatar.png";

  const id =
    "#TicketID-" + String(Math.floor(Math.random() * 9999)).padStart(4, "0");
  document.getElementById("ticketId").textContent = id;

  const qrContainer = document.getElementById("ticketQr");
  if (qrContainer) {
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
      text: JSON.stringify({
        name: data.fullName,
        handle: data.github,
        type: data.ticketType,
        id: id,
      }),
      width: 140,
      height: 140,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  }

  document
    .getElementById("btnDownloadPNG")
    .addEventListener("click", async () => {
      await downloadTicketPNG();
    });
});
