import { showToast } from "./toast.js";
import { formatHandle } from "./handle.js";

function placeError(id, mode, message){
  const above = document.getElementById(`err-${id}-above`);
  const below = document.getElementById(`err-${id}-below`);

  if(mode === 'alert'){
    if(message) alert(message);
    if(above) above.textContent = '';
    if(below) below.textContent = '';
    return;
  }
  if(mode === 'toast'){
    if(message) showToast(message);
    if(above) above.textContent = '';
    if(below) below.textContent = '';
    return;
  }

  // modos acima/abaixo
  if(above) above.textContent = (mode === 'above') ? (message || '') : '';
  if(below) below.textContent = (mode === 'below') ? (message || '') : '';
}

export function validateForm({ errMode, nameRule }){
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  let github = document.getElementById('github').value.trim();
  const agree = document.getElementById('agree').checked;

  let isValid = true;

  // Nome: sem regex, apenas split em espaços
  const parts = fullName.split(/\s+/).filter(Boolean);
  if(nameRule === 'firstOnly'){
    if(parts.length < 1) {
      placeError('fullName', errMode, 'Informe pelo menos o primeiro nome.');
      isValid = false;
    } else {
      placeError('fullName', errMode, '');
    }
  } else { // fullName
    if(parts.length < 2){
      placeError('fullName', errMode, 'Informe nome e sobrenome.');
      isValid = false;
    } else {
      placeError('fullName', errMode, '');
    }
  }

  // E-mail (checagem simples)
  if(!email.includes('@') || !email.includes('.')){
    placeError('email', errMode, 'E-mail parece inválido.');
    isValid = false;
  } else {
    placeError('email', errMode, '');
  }

  // GitHub: três variações para seu vídeo (exemplos)
  // 1) exigir que tenha @:
  // if (!github.startsWith('@')) { placeError('github', errMode, 'Inclua o @ do GitHub.'); isValid=false; } else { placeError('github', errMode, ''); }

  // 2) não permitir @ e adicioná-lo automaticamente:
  // if (github.startsWith('@')) { github = github.slice(1); }
  // placeError('github', errMode, '');

  // 3) "independente se tem @ ou não, apresentar sem duplicar":
  github = formatHandle(github);
  placeError('github', errMode, '');

  // Termos
  if(!agree){
    placeError('agree', errMode, 'Confirme os dados.');
    isValid = false;
  } else {
    placeError('agree', errMode, '');
  }

  // Atualiza o input GitHub normalizado (útil p/ submissão)
  const ghInput = document.getElementById('github');
  if (ghInput) {
    ghInput.value = github;
  }

  return isValid;
}
