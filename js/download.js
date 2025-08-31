export async function downloadTicketPNG() {
  const name =
    document.getElementById("previewName").textContent.trim() || "Seu Nome";
  const handle =
    document.getElementById("previewHandle").textContent.trim() || "@github";
  const type =
    document
      .getElementById("previewTicketType")
      .textContent.trim() || "STANDARD";
  const avatar = document.getElementById("previewAvatar");

  const width = 900;
  const height = 400;
  const pad = 24;
  const avatarSize = 120;
  const qrSize = 140;
  const gap = 16;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const g = ctx.createLinearGradient(0, 0, width, height);
  g.addColorStop(0, "#0e132a");
  g.addColorStop(1, "#0f1d46");
  ctx.fillStyle = g;
  roundRect(ctx, 0, 0, width, height, 16);
  ctx.fill();

  ctx.fillStyle = "rgba(0,0,0,0.25)";
  roundRect(ctx, 0, 0, width, 64, { tl: 16, tr: 16, br: 0, bl: 0 });
  ctx.fill();

  ctx.fillStyle = "#6ea8ff";
  ctx.font = "bold 20px Arial";
  ctx.fillText("OneMoreConf", pad, 40);

  const badge = ` ${type} `;
  const badgeWidth = ctx.measureText(badge).width + 24;
  ctx.fillStyle = "#36c2ff";
  roundRect(ctx, width - pad - badgeWidth, 16, badgeWidth, 32, 16);
  ctx.fill();
  ctx.fillStyle = "#0b1020";
  ctx.font = "bold 12px Arial";
  ctx.fillText(type, width - pad - badgeWidth + 12, 36);

  const avatarX = pad;
  const avatarY = 64 + pad;
  await drawImageCover(ctx, avatar, avatarX, avatarY, avatarSize, avatarSize, 12);

  // QR Code: usa o canvas já gerado na página para preservar a mesma codificação
  const qrCanvas = document.querySelector("#ticketQr canvas");
  const qrX = avatarX + avatarSize + gap;
  const qrY = avatarY;
  if (qrCanvas) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    drawRoundedImage(ctx, qrCanvas, qrX, qrY, qrSize, qrSize, 12);
    ctx.restore();
  } else {
    // fallback visual (caso não encontre o canvas do QR)
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, qrX, qrY, qrSize, qrSize, 12);
    ctx.fill();
  }

  const textX = qrX + qrSize + gap;
  ctx.fillStyle = "#e9eef7";
  ctx.font = "bold 28px Arial";
  ctx.fillText(name, textX, avatarY + 34);

  ctx.fillStyle = "#a7b1c6";
  ctx.font = "16px Arial";
  ctx.fillText(handle, textX, avatarY + 62);

  const metaX = textX;
  const metaY = avatarY + 90;
  const metaW = width - metaX - pad;
  const metaH = 28;
  const rows = [
    ["Evento", "OneMoreConf 2025"],
    ["Data", "30 Ago 2025"],
    ["Local", "Online"],
  ];
  let y = metaY;
  rows.forEach(([k, v]) => {
    ctx.fillStyle = "rgba(255,255,255,.06)";
    roundRect(ctx, metaX, y, metaW, metaH, 10);
    ctx.fill();
    ctx.fillStyle = "#a7b1c6";
    ctx.font = "12px Arial";
    ctx.fillText(k, metaX + 10, y + 19);
    ctx.fillStyle = "#e9eef7";
    ctx.font = "bold 13px Arial";
    ctx.fillText(v, metaX + metaW - 10 - ctx.measureText(v).width, y + 19);
    y += metaH + 10;
  });

  ctx.fillStyle = "rgba(0,0,0,0.25)";
  roundRect(ctx, 0, height - 48, width, 48, { tl: 0, tr: 0, br: 16, bl: 16 });
  ctx.fill();

  ctx.fillStyle = "#a7b1c6";
  ctx.font = "12px Arial";
  ctx.fillText("onemoretry.net", pad, height - 18);

  const idText =
    document.getElementById("ticketId")?.textContent || "#TicketID-0001";
  ctx.fillText(
    idText,
    width - pad - ctx.measureText(idText).width,
    height - 18
  );

  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = "ticket.png";
  a.click();
}

function roundRect(ctx, x, y, w, h, r) {
  let radii =
    typeof r === "number" ? { tl: r, tr: r, br: r, bl: r } : r || { tl: 0, tr: 0, br: 0, bl: 0 };
  ctx.beginPath();
  ctx.moveTo(x + radii.tl, y);
  ctx.lineTo(x + w - radii.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radii.tr);
  ctx.lineTo(x + w, y + h - radii.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radii.br, y + h);
  ctx.lineTo(x + radii.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radii.bl);
  ctx.lineTo(x, y + radii.tl);
  ctx.quadraticCurveTo(x, y, x + radii.tl, y);
  ctx.closePath();
}

async function drawImageCover(ctx, imgEl, x, y, w, h, radius = 0) {
  if (!imgEl || !imgEl.src) return;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imgEl.src;
  await new Promise((res) => {
    img.onload = res;
    img.onerror = res;
  });
  const ratio = img.width / img.height;
  const targetRatio = w / h;
  let sx, sy, sw, sh;
  if (ratio > targetRatio) {
    sh = img.height;
    sw = sh * targetRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / targetRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.save();
  if (radius) {
    const r = radius;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.clip();
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}

function drawRoundedImage(ctx, sourceCanvas, x, y, w, h, radius = 0) {
  ctx.save();
  if (radius) {
    const r = radius;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.clip();
  }
  ctx.drawImage(sourceCanvas, x, y, w, h);
  ctx.restore();
}
