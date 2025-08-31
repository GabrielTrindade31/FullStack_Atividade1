import { initPreview, resetPreview } from "./preview.js";
import { validateForm } from "./validation.js";
import { getModes, initLayoutButtons } from "./formModes.js";
import { downloadTicketPNG } from "./download.js";

document.addEventListener('DOMContentLoaded', ()=>{
  initPreview();
  initLayoutButtons();

  const form = document.getElementById('ticket-form');
  const btnReset = document.getElementById('btnReset');
  const btnDownload = document.getElementById('btnDownloadPNG');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const { errMode, nameRule } = getModes();
    const ok = validateForm({ errMode, nameRule });
    if (ok){
      // aqui você poderia salvar no localStorage ou gerar ID
      const id = '#TicketID-' + String(Math.floor(Math.random()*9999)).padStart(4,'0');
      document.getElementById('ticketId').textContent = id;
      // feedback suave (pode ser toast também)
      alert('Ingresso gerado com sucesso!');
    }
  });

  btnReset.addEventListener('click', ()=>{
    form.reset();
    resetPreview();
  });

  btnDownload.addEventListener('click', async ()=>{
    await downloadTicketPNG();
  });
});
