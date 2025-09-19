// ======= CONFIG GERAL =======
const CONFIG = {
  nomeDela: "Stella",
  seuNome:  "Davi",
  dataAni:  "2025-04-27T00:00:00", // data oficial do namoro
};

// ======= PLAYLIST =======
const PLAYLIST = [
  { arquivo: "best-part.mp3", titulo: "Best Part - H.E.R." },
];

// ======= SEGREDO (ofuscado com XOR; sem CSS necessário) =======
const CONFIG_SEGREDO = {
  codigo: "promessa",
  dica: "o que prometemos que nos impede de fazer besteira",
  // Mensagem: "SAFADINHA VC É" (UTF-8) ofuscada com XOR por "promessa", em HEX
  cipher_hex: "2333292c213a3d293152392e45b0fa"
};

function hexToBytes(hex){
  const a = [];
  for(let i=0;i<hex.length;i+=2){ a.push(parseInt(hex.slice(i,i+2),16)); }
  return new Uint8Array(a);
}
function bytesToUtf8(bytes){ return new TextDecoder().decode(bytes); }
function xorWithKey(bytes, key){
  const k = new TextEncoder().encode(key);
  const out = new Uint8Array(bytes.length);
  for(let i=0;i<bytes.length;i++){ out[i] = bytes[i] ^ k[i % k.length]; }
  return out;
}

// ======= Preencher nomes =======
function preencherNomes(){ document.querySelectorAll('.nome').forEach(el=> el.textContent = CONFIG.nomeDela); }

// ======= Contador principal =======
function iniciarContador(){
  const d0 = new Date(CONFIG.dataAni).getTime();
  const diasEl  = document.getElementById('dias');
  const horasEl = document.getElementById('horas');
  const minEl   = document.getElementById('min');
  const segEl   = document.getElementById('seg');
  function tick(){
    const now = Date.now();
    const diff = Math.max(0, now - d0);
    const dias = Math.floor(diff / (1000*60*60*24));
    const horas = Math.floor((diff / (1000*60*60)) % 24);
    const min = Math.floor((diff / (1000*60)) % 60);
    const seg = Math.floor((diff / 1000) % 60);
    diasEl.textContent  = dias;
    horasEl.textContent = horas.toString().padStart(2,'0');
    minEl.textContent   = min.toString().padStart(2,'0');
    segEl.textContent   = seg.toString().padStart(2,'0');
  }
  tick(); setInterval(tick, 1000);
}

// ======= Corações BG =======
function coracoes(){
  const root = document.querySelector('.hearts');
  const EMOJIS = ['💗','💖','💘','💝','💞','💕'];
  function spawn(){
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = EMOJIS[Math.floor(Math.random()*EMOJIS.length)];
    h.style.left = Math.random()*100 + 'vw';
    h.style.animationDuration = 8 + Math.random()*8 + 's';
    h.style.opacity = .4 + Math.random()*0.6;
    root.appendChild(h);
    setTimeout(()=> h.remove(), 16000);
  }
  for(let i=0;i<18;i++) setTimeout(spawn, i*400);
  setInterval(spawn, 1100);
}

// ======= Sparkles BG =======
function sparkles(){
  const root = document.querySelector('.sparkles');
  function spawn(){
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = Math.random()*100 + 'vw';
    s.style.animationDuration = 4 + Math.random()*6 + 's';
    s.style.opacity = .3 + Math.random()*0.5;
    root.appendChild(s);
    setTimeout(()=> s.remove(), 10000);
  }
  for(let i=0;i<26;i++) setTimeout(spawn, i*250);
  setInterval(spawn, 800);
}

// ======= Carrossel + Dots + Lightbox =======
function iniciarCarrossel(){
  const track = document.getElementById('track');
  const imgs  = Array.from(track.querySelectorAll('img'));
  const dots  = document.getElementById('dots');
  let idx = 0;

  function desenharDots(){
    dots.innerHTML = '';
    imgs.forEach((_,i)=>{
      const b = document.createElement('button');
      b.className = (i===idx? 'active' : '');
      b.addEventListener('click', ()=> irPara(i));
      dots.appendChild(b);
    });
  }
  function irPara(i){
    idx = (i + imgs.length) % imgs.length;
    track.style.transform = `translateX(-${idx*100}%)`;
    desenharDots();
  }
  document.querySelector('.prev').addEventListener('click', ()=> irPara(idx-1));
  document.querySelector('.next').addEventListener('click', ()=> irPara(idx+1));
  desenharDots();
  setInterval(()=> irPara(idx+1), 5000);

  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbCaption = document.getElementById('lbCaption');

  imgs.forEach(im => im.addEventListener('click', ()=>{
    lbImg.src = im.src;
    lbCaption.textContent = im.dataset.caption || 'Um pedacinho da nossa história.';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
  }));
  lbClose.addEventListener('click', ()=>{
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
    lbImg.src='';
  });
  lb.addEventListener('click', (e)=>{ if(e.target===lb){ lbClose.click(); } });
}

// ======= Player =======
function player(){
  const audio = document.getElementById('audio');
  const playBtn = document.getElementById('play');
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  const titulo = document.getElementById('titulo');
  const barra = document.getElementById('barra');
  let curr = 0;

  function carregar(i){
    if(!PLAYLIST.length){
      titulo.textContent = "Sem música (adicione arquivos em assets/musicas)";
      return;
    }
    curr = (i + PLAYLIST.length) % PLAYLIST.length;
    const faixa = PLAYLIST[curr];
    audio.src = `assets/musicas/${faixa.arquivo}`;
    titulo.textContent = faixa.titulo || faixa.arquivo;
    audio.play().then(()=>{ playBtn.textContent='⏸'; }).catch(()=>{});
  }
  playBtn.addEventListener('click', ()=>{
    if(!PLAYLIST.length) return;
    if(audio.paused){ audio.play(); playBtn.textContent='⏸'; }
    else{ audio.pause(); playBtn.textContent='▶'; }
  });
  nextBtn.addEventListener('click', ()=> carregar(curr+1));
  prevBtn.addEventListener('click', ()=> carregar(curr-1));
  audio.addEventListener('timeupdate', ()=>{
    if(audio.duration){
      const p = (audio.currentTime/audio.duration)*100;
      barra.style.width = p.toFixed(2)+'%';
    }
  });
  audio.addEventListener('ended', ()=> carregar(curr+1));
  if(PLAYLIST.length){ carregar(0); }
}

// ======= Compartilhar =======
function compartilhar(){
  const copiar = document.getElementById('copiar');
  const whats  = document.getElementById('whatsapp');
  const instalar = document.getElementById('instalar');
  const url = location.href;

  copiar.addEventListener('click', async ()=>{
    try{ await navigator.clipboard.writeText(url); copiar.textContent = 'Link copiado!'; }
    catch(e){ copiar.textContent='Copie da barra do navegador'; }
    setTimeout(()=> copiar.textContent='Copiar link', 2500);
  });
  whats.href = `https://wa.me/?text=${encodeURIComponent('Feito pra você, meu amor 💘 ' + url)}`;
  instalar.addEventListener('click', ()=>{
    alert('No celular, toque no menu do navegador e escolha "Adicionar à tela inicial" para criar um atalho.');
  });
}

// ======= Tema =======
function tema(){ document.getElementById('btnTema').addEventListener('click', ()=>{ document.body.classList.toggle('theme-light'); }); }

// ======= Confete =======
function confete(){
  const btn = document.getElementById('btnConfete');
  btn.addEventListener('click', ()=>{
    const c = document.createElement('canvas');
    Object.assign(c.style,{position:'fixed',inset:0,pointerEvents:'none'});
    c.width = innerWidth; c.height = innerHeight;
    document.body.appendChild(c);
    const ctx = c.getContext('2d');
    const parts = Array.from({length: 220}, ()=>({
      x: Math.random()*c.width, y: -20 - Math.random()*c.height, s: 4+Math.random()*6, v: 1+Math.random()*3, r: Math.random()*Math.PI,
    }));
    function loop(){
      ctx.clearRect(0,0,c.width,c.height);
      parts.forEach(p=>{ p.y+=p.v; p.r+=.03; p.x+=Math.sin(p.r)*.8;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r);
        ctx.fillStyle = `hsl(${(p.y/3)%360},90%,70%)`; ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s); ctx.restore();
      });
      if(parts.some(p=> p.y < c.height+20)) requestAnimationFrame(loop); else c.remove();
    } loop();
  });
}

// ======= Segredo (usa <dialog> e XOR; sem CSS obrigatório) =======
function segredo(){
  const btn   = document.getElementById('btnSegredo');
  const dlg   = document.getElementById('secretDlg');
  const form  = document.getElementById('secretForm');
  const input = document.getElementById('secretInput');
  const sec   = document.getElementById('segredo');
  const txt   = document.getElementById('segredoTexto');
  const KEY   = 'segredoUnlocked';

  function reveal(){
    sec.hidden = false; // mostra a seção
    const plain = bytesToUtf8(xorWithKey(hexToBytes(CONFIG_SEGREDO.cipher_hex), CONFIG_SEGREDO.codigo));
    txt.innerHTML = `<h1 class="big-secret">${plain}</h1>`;
    localStorage.setItem(KEY, 'true');
  }

  if(localStorage.getItem(KEY) === 'true'){ reveal(); }

  btn?.addEventListener('click', ()=>{ dlg.showModal(); setTimeout(()=> input?.focus(), 50); });
  document.getElementById('secretCancel')?.addEventListener('click', ()=> dlg.close());

  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const val = (input.value || '').trim().toLowerCase();
    if(val === CONFIG_SEGREDO.codigo.toLowerCase()){ reveal(); dlg.close(); }
    else { alert('Ops! Tenta de novo 😉'); }
  });
}

// ======= Inicialização =======
window.addEventListener('DOMContentLoaded', ()=>{
  preencherNomes();
  iniciarContador();
  iniciarCarrossel();
  coracoes();
  sparkles();
  player();
  compartilhar();
  tema();
  confete();
  segredo();
});
