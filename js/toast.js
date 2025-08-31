export function showToast(message, timeout=3000){
  const root = document.getElementById('toast-root');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  root.appendChild(el);
  setTimeout(()=> {
    el.style.opacity = '0';
    setTimeout(()=> root.removeChild(el), 250);
  }, timeout);
}
