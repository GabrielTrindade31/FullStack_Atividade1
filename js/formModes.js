export function getModes(){
  const errMode = document.querySelector('input[name="errMode"]:checked')?.value || 'below';
  const nameRule = document.querySelector('input[name="nameRule"]:checked')?.value || 'fullName';
  return { errMode, nameRule };
}

export function initLayoutButtons(){
  const root = document.getElementById('app');
  document.querySelectorAll('[data-layout]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const mode = btn.getAttribute('data-layout');
      if(mode === 'compact'){
        root.classList.add('u-dense');
      }else{
        root.classList.remove('u-dense');
      }
    });
  });
}
