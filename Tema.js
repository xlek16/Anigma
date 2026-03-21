// ANIGMA - Tema.js — Temas de Anime
// Substitui os temas genéricos por universos de anime

const TEMAS = {
  // ── Gratuitos ──────────────────────────────────────────
  escuro: { label: 'Dark',         classe: '',                   pago: false },
  claro:  { label: 'Light',        classe: 'light-mode',         pago: false },

  // Naruto — laranja/azul, céu de Konoha, folhas
  naruto: { label: 'Naruto',       classe: 'theme-naruto',       pago: false },

  // One Piece — azul oceano, aventura, ilhas tropicais  
  onepiece: { label: 'One Piece',  classe: 'theme-onepiece',     pago: false },

  // ── Pagos ──────────────────────────────────────────────
  // Bleach — já existia, mantém
  bleach: { label: 'Bleach',       classe: 'theme-bleach',       pago: true  },

  // Attack on Titan — verde militar, titan steam, Survey Corps
  aot:    { label: 'Attack on Titan', classe: 'theme-aot',       pago: true  },

  // Demon Slayer — preto/vermelho/rosa, respiração da água, katana
  demonslayer: { label: 'Demon Slayer', classe: 'theme-demonslayer', pago: true },

  // Jujutsu Kaisen — roxo escuro, energia amaldiçoada, domínio
  jjk:    { label: 'JJK',          classe: 'theme-jjk',          pago: true  },

  // Dragon Ball — laranja ki, Super Saiyan dourado, espaço
  dragonball: { label: 'Dragon Ball', classe: 'theme-dragonball', pago: true },
};

// ── Gratuitos: Naruto (partículas de folhas) e One Piece (oceano) substituem Sakura e Ocean
// Os pagos anteriores: Cyberpunk → JJK, Floresta → Demon Slayer, RGB → Dragon Ball

const path = window.location.pathname;
const isSubFolder = path.includes('/Jogos/') || path.includes('/loja/') || path.includes('/ranking/');
const pathPrefix = isSubFolder ? '../' : '';

const LOGO_BRANCA = pathPrefix + 'Imagens/LogoSite/LogoSite.png';
const LOGO_PRETA  = pathPrefix + 'Imagens/LogoSite/LogoPreta.png';

let _temasDesbloqueados = ['escuro', 'claro', 'naruto', 'onepiece'];

function getTemasDesbloqueados() { return _temasDesbloqueados; }

async function carregarTemasDesbloqueados() {
  if (!window.supabaseClient) {
    _temasDesbloqueados = ['escuro', 'claro', 'naruto', 'onepiece'];
    updateThemeMenu(); return;
  }
  try {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (!session) {
      _temasDesbloqueados = ['escuro', 'claro', 'naruto', 'onepiece'];
      localStorage.removeItem('anigma_unlocked_themes');
      updateThemeMenu();
      const t = localStorage.getItem('anigma_tema') || 'escuro';
      if (TEMAS[t]?.pago) setTheme('escuro');
      return;
    }
    const { data: cosmetics, error } = await window.supabaseClient
      .from('profile_cosmetics').select('unlocked_themes').eq('user_id', session.user.id).single();
    if (error || !cosmetics) {
      _temasDesbloqueados = ['escuro', 'claro', 'naruto', 'onepiece'];
    } else {
      const db = Array.isArray(cosmetics.unlocked_themes) ? cosmetics.unlocked_themes : [];
      _temasDesbloqueados = [...new Set(['escuro', 'claro', 'naruto', 'onepiece', ...db])];
      localStorage.setItem('anigma_unlocked_themes', JSON.stringify(db));
    }
  } catch(e) {
    _temasDesbloqueados = ['escuro', 'claro', 'naruto', 'onepiece'];
  }
  updateThemeMenu();
  const t = localStorage.getItem('anigma_tema') || 'escuro';
  if (!_temasDesbloqueados.includes(t)) setTheme('escuro');
}

function setTheme(tema) {
  if (TEMAS[tema]?.pago && !_temasDesbloqueados.includes(tema)) { tema = 'escuro'; }

  document.body.classList.remove(
    'light-mode','theme-naruto','theme-onepiece','theme-bleach',
    'theme-aot','theme-demonslayer','theme-jjk','theme-dragonball'
  );

  // Parar efeitos anteriores
  pararNaruto(); pararOnePiece(); pararBleach(); pararAot();
  pararDemonSlayer(); pararJJK(); pararDragonBall();

  if (TEMAS[tema].classe) document.body.classList.add(TEMAS[tema].classe);

  const logo = document.getElementById('logoImg');
  if (logo) logo.src = (tema === 'claro') ? LOGO_PRETA : LOGO_BRANCA;

  const themeLabel = document.getElementById('themeLabel');
  if (themeLabel) themeLabel.textContent = TEMAS[tema].label;

  updateThemeMenu();

  if (tema === 'naruto')     iniciarNaruto();
  if (tema === 'onepiece')   iniciarOnePiece();
  if (tema === 'bleach')     iniciarBleach();
  if (tema === 'aot')        iniciarAot();
  if (tema === 'demonslayer') iniciarDemonSlayer();
  if (tema === 'jjk')        iniciarJJK();
  if (tema === 'dragonball') iniciarDragonBall();

  localStorage.setItem('anigma_tema', tema);
  closeThemeMenu();
}

function updateThemeMenu() {
  const menu = document.getElementById('themeMenu');
  if (!menu) return;
  const temaAtual = localStorage.getItem('anigma_tema') || 'escuro';
  menu.innerHTML = '';
  Object.keys(TEMAS).forEach(id => {
    const info = TEMAS[id];
    const isUnlocked = !info.pago || _temasDesbloqueados.includes(id);
    const opt = document.createElement('div');
    opt.className = 'theme-option';
    opt.dataset.theme = id;
    if (!isUnlocked) opt.classList.add('locked');
    if (id === temaAtual) opt.classList.add('active');
    opt.onclick = () => isUnlocked ? setTheme(id) : mostrarToastTema(info.label);
    opt.innerHTML = isUnlocked ? `<span class="theme-dot"></span> ${info.label}` : `🔒 ${info.label}`;
    menu.appendChild(opt);
  });
}

function mostrarToastTema(nome) {
  document.getElementById('tema-locked-toast')?.remove();
  const t = document.createElement('div'); t.id = 'tema-locked-toast';
  t.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1a1a2e;border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:12px 20px;color:#fff;font-size:0.84rem;font-weight:600;display:flex;align-items:center;gap:10px;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,0.4);`;
  t.innerHTML = `🔒 O tema <strong>${nome}</strong> precisa de ser desbloqueado na <a href="${pathPrefix}loja/loja.html" style="color:#38bdf8;text-decoration:underline;">Loja</a>!`;
  document.body.appendChild(t);
  setTimeout(() => t.style.opacity='0', 3000);
  setTimeout(() => t.remove(), 3400);
}

function toggleThemeMenu() { document.getElementById('themeMenu').classList.toggle('open'); }
function closeThemeMenu()  { document.getElementById('themeMenu')?.classList.remove('open'); }
document.addEventListener('click', e => { if (!e.target.closest('#themeWrap')) closeThemeMenu(); });

// ════════════════════════════════════════════════════════════
// EFEITOS VISUAIS
// ════════════════════════════════════════════════════════════

// ── NARUTO — Folhas de Konoha (laranja/verde) ────────────────
function iniciarNaruto() {
  const c = document.getElementById('sakuraContainer') || (() => {
    const d = document.createElement('div'); d.id='sakuraContainer'; d.className='sakura-container'; document.body.prepend(d); return d;
  })();
  c.innerHTML = '';
  const emojis = ['🍃','🍂','🍁','✦'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.style.cssText = `position:fixed;top:-20px;left:${Math.random()*100}vw;font-size:${Math.random()*12+8}px;animation:folhaKonoha ${Math.random()*6+4}s linear ${Math.random()*5}s infinite;opacity:${Math.random()*0.5+0.3};pointer-events:none;z-index:0;`;
    p.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    c.appendChild(p);
  }
}
function pararNaruto() {
  const c = document.getElementById('sakuraContainer'); if(c) c.innerHTML='';
}

// ── ONE PIECE — Ondas do oceano (mantém o canvas de ondas) ──
function iniciarOnePiece() { iniciarOndas('onepiece'); }
function pararOnePiece()   { pararCanvas(); }

// ── BLEACH — Partículas de reiatsu (azul) ────────────────────
let bleachAnim = null;
function iniciarBleach() {
  const canvas = obterCanvas(); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  redimCanvas(canvas);
  const pts = Array.from({length:60},()=>novaPtBleach(canvas));
  let t = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const bg = ctx.createLinearGradient(0,0,0,canvas.height);
    bg.addColorStop(0,'rgba(0,0,10,0.55)'); bg.addColorStop(1,'rgba(5,10,30,0.75)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);
    // Lua
    const mx=canvas.width*.82,my=canvas.height*.18;
    const mg=ctx.createRadialGradient(mx,my,0,mx,my,90);
    mg.addColorStop(0,'rgba(200,220,255,0.09)'); mg.addColorStop(1,'transparent');
    ctx.fillStyle=mg; ctx.beginPath(); ctx.arc(mx,my,90,0,Math.PI*2); ctx.fill();
    pts.forEach(p=>{
      p.x+=p.vx+Math.sin(t*.02+p.y*.01)*.3; p.y+=p.vy; p.life+=.005;
      p.opacity=Math.abs(Math.sin(p.life))*.4;
      if(p.y<-10){Object.assign(p,novaPtBleach(canvas));}
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle=`rgba(150,180,255,${p.opacity})`; ctx.fill();
    });
    t++; bleachAnim=requestAnimationFrame(draw);
  }
  draw();
}
function novaPtBleach(c){return{x:Math.random()*c.width,y:c.height+10,size:Math.random()*2+.5,opacity:Math.random()*.5+.1,vx:(Math.random()-.5)*.4,vy:-(Math.random()*.8+.2),life:Math.random()};}
function pararBleach(){if(bleachAnim){cancelAnimationFrame(bleachAnim);bleachAnim=null;}limparCanvas();}

// ── ATTACK ON TITAN — Vapor de Titans (verde/cinza, névoa) ──
let aotAnim = null;
function iniciarAot() {
  const canvas = obterCanvas(); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  redimCanvas(canvas);
  const vapores = Array.from({length:20},()=>novoVapor(canvas));
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const bg=ctx.createLinearGradient(0,0,0,canvas.height);
    bg.addColorStop(0,'rgba(8,14,6,0.5)'); bg.addColorStop(1,'rgba(15,22,10,0.75)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);
    // Grade Survey Corps
    ctx.strokeStyle='rgba(80,120,60,0.04)'; ctx.lineWidth=1;
    for(let x=0;x<canvas.width;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
    for(let y=0;y<canvas.height;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
    vapores.forEach(v=>{
      v.x+=v.vx; v.y+=v.vy; v.opacity-=.002; v.radius+=.5;
      if(v.opacity<=0){Object.assign(v,novoVapor(canvas));}
      const g=ctx.createRadialGradient(v.x,v.y,0,v.x,v.y,v.radius);
      g.addColorStop(0,`rgba(180,210,160,${v.opacity})`);
      g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(v.x,v.y,v.radius,0,Math.PI*2); ctx.fill();
    });
    aotAnim=requestAnimationFrame(draw);
  }
  draw();
}
function novoVapor(c){return{x:Math.random()*c.width,y:c.height*(.4+Math.random()*.6),radius:Math.random()*30+20,opacity:Math.random()*.15+.05,vx:(Math.random()-.5)*.3,vy:-(Math.random()*.4+.1)};}
function pararAot(){if(aotAnim){cancelAnimationFrame(aotAnim);aotAnim=null;}limparCanvas();}

// ── DEMON SLAYER — Respiração da Água / Flores de ameixa ────
let dsAnim = null;
function iniciarDemonSlayer() {
  const canvas = obterCanvas(); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  redimCanvas(canvas);
  const linhas = Array.from({length:8},()=>novaLinhaAgua(canvas));
  const flores = Array.from({length:25},()=>novaFlorDS(canvas));
  let t=0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const bg=ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    bg.addColorStop(0,'rgba(5,0,12,0.6)'); bg.addColorStop(1,'rgba(15,0,5,0.7)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);
    // Linhas de respiração da água
    linhas.forEach(l=>{
      l.phase+=l.speed;
      ctx.beginPath();
      for(let x=0;x<=canvas.width;x+=4){
        const y=l.y+Math.sin((x*l.freq)+l.phase)*l.amp;
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.strokeStyle=`rgba(${l.cor},${l.opacity+Math.sin(t*.05)*.05})`; ctx.lineWidth=l.width; ctx.stroke();
    });
    // Flores
    flores.forEach(f=>{
      f.x+=f.vx; f.y+=f.vy+Math.sin(t*.02+f.x*.01)*.2; f.rot+=f.rotV;
      if(f.y>canvas.height+10){Object.assign(f,novaFlorDS(canvas));}
      ctx.save(); ctx.translate(f.x,f.y); ctx.rotate(f.rot); ctx.globalAlpha=f.opacity;
      ctx.fillStyle=f.cor; ctx.beginPath(); ctx.arc(0,0,f.size,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });
    ctx.globalAlpha=1; t++; dsAnim=requestAnimationFrame(draw);
  }
  draw();
}
function novaLinhaAgua(c){const cores=['100,180,255','180,220,255','200,240,255'];return{y:Math.random()*c.height,freq:Math.random()*.01+.005,amp:Math.random()*40+20,phase:Math.random()*Math.PI*2,speed:Math.random()*.04+.02,opacity:Math.random()*.12+.03,width:Math.random()*1.5+.5,cor:cores[Math.floor(Math.random()*cores.length)]};}
function novaFlorDS(c){return{x:Math.random()*c.width,y:-10,size:Math.random()*3+1,vx:(Math.random()-.5)*.4,vy:Math.random()*.6+.2,rot:Math.random()*Math.PI*2,rotV:(Math.random()-.5)*.05,opacity:Math.random()*.4+.1,cor:Math.random()>.5?'rgba(255,100,120,1)':'rgba(220,80,100,1)'};}
function pararDemonSlayer(){if(dsAnim){cancelAnimationFrame(dsAnim);dsAnim=null;}limparCanvas();}

// ── JJK — Energia Amaldiçoada (roxo/preto) ──────────────────
let jjkAnim = null;
function iniciarJJK() {
  const canvas = obterCanvas(); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  redimCanvas(canvas);
  const orbs = Array.from({length:12},()=>novoOrbeJJK(canvas));
  let t=0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='rgba(4,0,10,0.7)'; ctx.fillRect(0,0,canvas.width,canvas.height);
    // Crack / domínio — linhas irregulares
    if(t%180<3){
      ctx.strokeStyle='rgba(139,92,246,0.15)'; ctx.lineWidth=1;
      for(let i=0;i<5;i++){
        ctx.beginPath();
        let cx=Math.random()*canvas.width, cy=Math.random()*canvas.height;
        ctx.moveTo(cx,cy);
        for(let j=0;j<8;j++){cx+=((Math.random()-.5)*80);cy+=((Math.random()-.5)*80);ctx.lineTo(cx,cy);}
        ctx.stroke();
      }
    }
    orbs.forEach(o=>{
      o.x+=Math.sin(t*.02+o.phase)*o.drift; o.y+=Math.cos(t*.015+o.phase)*o.drift;
      o.pulse=Math.sin(t*.04+o.phase)*.3+.7;
      const g=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.radius*o.pulse);
      g.addColorStop(0,`rgba(${o.cor},${o.opacity})`);
      g.addColorStop(.5,`rgba(${o.cor},${o.opacity*.4})`);
      g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(o.x,o.y,o.radius*o.pulse,0,Math.PI*2); ctx.fill();
    });
    t++; jjkAnim=requestAnimationFrame(draw);
  }
  draw();
}
function novoOrbeJJK(c){const cores=['139,92,246','167,139,250','99,40,180','200,150,255'];return{x:Math.random()*c.width,y:Math.random()*c.height,radius:Math.random()*80+30,opacity:Math.random()*.12+.04,drift:Math.random()*.8+.2,phase:Math.random()*Math.PI*2,cor:cores[Math.floor(Math.random()*cores.length)],pulse:1};}
function pararJJK(){if(jjkAnim){cancelAnimationFrame(jjkAnim);jjkAnim=null;}limparCanvas();}

// ── DRAGON BALL — Ki dourado / Super Saiyan ──────────────────
let dbAnim = null;
function iniciarDragonBall() {
  const canvas = obterCanvas(); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  redimCanvas(canvas);
  const sparks = Array.from({length:40},()=>novaSparkDB(canvas));
  let t=0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const bg=ctx.createRadialGradient(canvas.width*.5,canvas.height*.5,0,canvas.width*.5,canvas.height*.5,canvas.width);
    bg.addColorStop(0,'rgba(20,10,0,0.6)'); bg.addColorStop(1,'rgba(5,2,0,0.75)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);
    // Aura de ki — ondas concentricas
    for(let i=0;i<3;i++){
      const r=100+i*80+(Math.sin(t*.05+i)*30);
      const g=ctx.createRadialGradient(canvas.width*.5,canvas.height*.7,0,canvas.width*.5,canvas.height*.7,r);
      g.addColorStop(0,'transparent');
      g.addColorStop(.7,`rgba(255,200,0,${0.04-i*.01})`);
      g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    // Sparks de ki
    sparks.forEach(s=>{
      s.x+=s.vx; s.y+=s.vy; s.life-=.02;
      if(s.life<=0){Object.assign(s,novaSparkDB(canvas));}
      ctx.save(); ctx.globalAlpha=s.life;
      ctx.fillStyle=Math.random()>.7?'rgba(255,255,150,1)':'rgba(255,180,0,1)';
      ctx.beginPath(); ctx.arc(s.x,s.y,s.size,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });
    ctx.globalAlpha=1; t++; dbAnim=requestAnimationFrame(draw);
  }
  draw();
}
function novaSparkDB(c){return{x:c.width*(.3+Math.random()*.4),y:c.height*(.5+Math.random()*.5),size:Math.random()*2+.5,vx:(Math.random()-.5)*2,vy:-(Math.random()*2+.5),life:Math.random()*.8+.2};}
function pararDragonBall(){if(dbAnim){cancelAnimationFrame(dbAnim);dbAnim=null;}limparCanvas();}

// ── ONE PIECE — Ondas do grande oceano ───────────────────────
let opAnim = null;
function iniciarOndas(tipo) {
  const canvas = obterCanvas(); if (!canvas) return;
  canvas.style.display='block';
  const ctx = canvas.getContext('2d');
  redimCanvas(canvas);
  const isOP = tipo==='onepiece';
  const ondas=[
    {cor:isOP?'rgba(7,80,160,0.45)':'rgba(7,80,120,0.42)',amp:36,freq:.0045,vel:.0045,yBase:.56,phase:0},
    {cor:isOP?'rgba(14,120,200,0.32)':'rgba(14,120,160,0.30)',amp:28,freq:.0052,vel:.0058,yBase:.66,phase:Math.PI*.5},
    {cor:isOP?'rgba(56,189,255,0.22)':'rgba(56,189,248,0.20)',amp:20,freq:.0068,vel:.0065,yBase:.76,phase:Math.PI},
  ];
  let t=0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const bg=ctx.createLinearGradient(0,0,0,canvas.height);
    bg.addColorStop(0,isOP?'rgba(0,15,40,0.35)':'rgba(5,21,37,0.3)');
    bg.addColorStop(1,isOP?'rgba(0,10,30,0.75)':'rgba(5,21,37,0.7)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);
    ondas.forEach(o=>{
      ctx.beginPath(); ctx.moveTo(0,canvas.height);
      for(let x=0;x<=canvas.width;x+=2){
        const by=canvas.height*o.yBase;
        ctx.lineTo(x,by+Math.sin(x*o.freq+t*o.vel*60+o.phase)*o.amp+Math.sin(x*o.freq*1.8+t*o.vel*45+o.phase*.7)*(o.amp*.5));
      }
      ctx.lineTo(canvas.width,canvas.height); ctx.closePath(); ctx.fillStyle=o.cor; ctx.fill();
    });
    t+=.35; opAnim=requestAnimationFrame(draw);
  }
  draw();
}
function pararCanvas(){if(opAnim){cancelAnimationFrame(opAnim);opAnim=null;}limparCanvas();}

// ── Utilitários canvas ────────────────────────────────────────
function obterCanvas() {
  let c = document.getElementById('oceanCanvas');
  if (!c) { c=document.createElement('canvas'); c.id='oceanCanvas'; c.className='ocean-canvas'; document.body.prepend(c); }
  c.style.display='block'; return c;
}
function redimCanvas(c) {
  c.width=window.innerWidth; c.height=window.innerHeight;
  window.addEventListener('resize',()=>{c.width=window.innerWidth;c.height=window.innerHeight;});
}
function limparCanvas() {
  const c=document.getElementById('oceanCanvas');
  if(c){c.style.display='none';c.getContext('2d').clearRect(0,0,c.width,c.height);}
}

// ── INICIAR ───────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  const temaGuardado = localStorage.getItem('anigma_tema') || 'escuro';
  // Migrar temas antigos para os novos
  const migrar = {sakura:'naruto', oceano:'onepiece', cyberpunk:'jjk', floresta:'demonslayer', rgb:'dragonball'};
  const temaFinal = migrar[temaGuardado] || temaGuardado;
  if (temaFinal !== temaGuardado) localStorage.setItem('anigma_tema', temaFinal);

  const temaInicial = TEMAS[temaFinal]?.pago ? 'escuro' : temaFinal;
  setTheme(temaInicial);
  await carregarTemasDesbloqueados();
  if (_temasDesbloqueados.includes(temaFinal)) setTheme(temaFinal);

  if (window.supabaseClient) {
    window.supabaseClient.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        _temasDesbloqueados = ['escuro','claro','naruto','onepiece'];
        localStorage.removeItem('anigma_unlocked_themes');
        const t = localStorage.getItem('anigma_tema') || 'escuro';
        if (TEMAS[t]?.pago) setTheme('escuro');
        updateThemeMenu();
      } else if (event === 'SIGNED_IN') {
        await carregarTemasDesbloqueados();
        const t = localStorage.getItem('anigma_tema') || 'escuro';
        if (_temasDesbloqueados.includes(t)) setTheme(t);
      }
    });
  }
});