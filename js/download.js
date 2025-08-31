export async function downloadTicketPNG(){
  const ticketDom = document.getElementById('ticketDom');
  const name = document.getElementById('previewName').textContent.trim() || 'Seu Nome';
  const handle = document.getElementById('previewHandle').textContent.trim() || '@github';
  const type = document.getElementById('previewTicketType').textContent.trim() || 'STANDARD';
  const avatar = document.getElementById('previewAvatar');

  // Canvas base — dimensões proporcionais à prévia
  const width = 900, height = 400;
  const pad = 24;
  const avatarSize = 120;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Fundo gradiente em azul
  const g = ctx.createLinearGradient(0,0,width,height);
  g.addColorStop(0, '#0e132a');
  g.addColorStop(1, '#0f1d46');
  ctx.fillStyle = g;
  roundRect(ctx, 0, 0, width, height, 16);
  ctx.fill();

  // Header
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  roundRect(ctx, 0, 0, width, 64, {tl:16,tr:16,br:0,bl:0});
  ctx.fill();

  // Logo fake e Badge
  ctx.fillStyle = '#6ea8ff';
  ctx.font = 'bold 20px Arial';
  ctx.fillText('FrontConf', pad, 40);

  // Badge
  const badge = ` ${type} `;
  const badgeWidth = ctx.measureText(badge).width + 24;
  ctx.fillStyle = '#36c2ff';
  roundRect(ctx, width - pad - badgeWidth, 16, badgeWidth, 32, 16);
  ctx.fill();
  ctx.fillStyle = '#0b1020';
  ctx.font = 'bold 12px Arial';
  ctx.fillText(type, width - pad - badgeWidth + 12, 36);

  // Avatar
  const avatarX = pad;
  const avatarY = 64 + pad;
  await drawImageCover(ctx, avatar, avatarX, avatarY, avatarSize, avatarSize, 12);

  // Nome / handle
  ctx.fillStyle = '#e9eef7';
  ctx.font = 'bold 28px Arial';
  ctx.fillText(name, avatarX + avatarSize + 16, avatarY + 34);

  ctx.fillStyle = '#a7b1c6';
  ctx.font = '16px Arial';
  ctx.fillText(handle, avatarX + avatarSize + 16, avatarY + 62);

  // Metadata caixinhas
  const metaX = avatarX + avatarSize + 16;
  const metaY = avatarY + 90;
  const metaW = width - metaX - pad;
  const metaH = 28;
  const rows = [
    ['Evento','FrontConf 2025'],
    ['Data','30 Ago 2025'],
    ['Local','Online'],
  ];
  let y = metaY;
  rows.forEach(([k,v])=>{
    ctx.fillStyle = 'rgba(255,255,255,.06)';
    roundRect(ctx, metaX, y, metaW, metaH, 10);
    ctx.fill();

    ctx.fillStyle = '#a7b1c6';
    ctx.font = '12px Arial';
    ctx.fillText(k, metaX + 10, y + 19);

    ctx.fillStyle = '#e9eef7';
    ctx.font = 'bold 13px Arial';
    ctx.fillText(v, metaX + metaW - 10 - ctx.measureText(v).width, y + 19);
    y += metaH + 10;
  });

  // Footer
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  roundRect(ctx, 0, height-48, width, 48, {tl:0,tr:0,br:16,bl:16});
  ctx.fill();

  ctx.fillStyle = '#a7b1c6';
  ctx.font = '12px Arial';
  ctx.fillText('onemoretry.net', pad, height - 18);

  const idText = document.getElementById('ticketId')?.textContent || '#TicketID-0001';
  ctx.fillText(idText, width - pad - ctx.measureText(idText).width, height - 18);

  // Baixar
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ticket.png';
  a.click();
}

// helpers
function roundRect(ctx, x, y, w, h, r){
  let radii = typeof r === 'number' ? {tl:r,tr:r,br:r,bl:r} : (r || {tl:0,tr:0,br:0,bl:0});
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

function drawImageBitmap(ctx, img, x, y, w, h){
  return new Promise(resolve=>{
    try{
      ctx.save();
      // máscara arredondada
      ctx.beginPath();
      const r = 12;
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
      ctx.drawImage(img, x, y, w, h);
      ctx.restore();
    }catch(e){}
    resolve();
  });
}

async function drawImageCover(ctx, imgEl, x, y, w, h, radius=0){
  // cria um bitmap a partir do dataURL/URL do <img>
  if (!imgEl || !imgEl.src) return;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = imgEl.src;
  await new Promise(res=>{
    img.onload = res;
    img.onerror = res;
  });
  // Fit "cover"
  const ratio = img.width / img.height;
  const targetRatio = w / h;
  let sx, sy, sw, sh;
  if (ratio > targetRatio){
    // mais largo
    sh = img.height;
    sw = sh * targetRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    // mais alto
    sw = img.width;
    sh = sw / targetRatio;
    sx = 0; sy = (img.height - sh) / 2;
  }

  // Clip com raio
  ctx.save();
  if (radius){
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
