import { formatHandle } from "./handle.js";

export function initPreview(){
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const github = document.getElementById('github');
  const ticketType = document.getElementById('ticketType');
  const avatarInput = document.getElementById('avatar');

  const previewName = document.getElementById('previewName');
  const previewHandle = document.getElementById('previewHandle');
  const previewType = document.getElementById('previewTicketType');
  const previewAvatar = document.getElementById('previewAvatar');
  const avatarPreview = document.getElementById('avatarPreview');

  function update(){
    previewName.textContent = fullName.value.trim() || 'Seu Nome';
    previewHandle.textContent = formatHandle(github.value);
    previewType.textContent = (ticketType.value || 'standard').toUpperCase();
  }

  fullName.addEventListener('input', update);
  github.addEventListener('input', update);
  ticketType.addEventListener('change', update);

  avatarInput.addEventListener('change', (e)=>{
    const file = e.target.files?.[0];
    if(!file) return;
    const fr = new FileReader();
    fr.onload = ()=>{
      avatarPreview.src = fr.result;
      previewAvatar.src = fr.result;
    };
    fr.readAsDataURL(file);
  });

  update();
}

export function resetPreview(){
  document.getElementById('avatarPreview').src = './assets/placeholder-avatar.png';
  document.getElementById('previewAvatar').src = './assets/placeholder-avatar.png';
  document.getElementById('previewName').textContent = 'Seu Nome';
  document.getElementById('previewHandle').textContent = '@github';
  document.getElementById('previewTicketType').textContent = 'STANDARD';
}
