// ANIGMA - Tema.js

const TEMAS = {
  escuro:     { label: 'Dark',       classe: '',                 pago: false },
  claro:      { label: 'Light',      classe: 'light-mode',       pago: false },
  sakura:     { label: 'Sakura',     classe: 'theme-sakura',     pago: false },
  oceano:     { label: 'Ocean',      classe: 'theme-oceano',     pago: false },
  cyberpunk:  { label: 'Cyberpunk',  classe: 'theme-cyberpunk',  pago: true  },
  bleach:     { label: 'Bleach',     classe: 'theme-bleach',     pago: true  },
  rgb:        { label: 'RGB',        classe: 'theme-rgb',        pago: true  },
  floresta:   { label: 'Floresta',   classe: 'theme-floresta',   pago: true  },
};

const path = window.location.pathname;
const isSubFolder = path.includes('/Jogos/') || path.includes('/loja/') || path.includes('/ranking/');
const pathPrefix = isSubFolder ? '../' : '';

const LOGO_BRANCA = pathPrefix + 'Imagens/LogoSite/LogoSite.png';
const LOGO_PRETA  = pathPrefix + 'Imagens/LogoSite/LogoPreta.png';

function setTheme(tema) {
  document.body.classList.remove(
    'light-mode','theme-sakura','theme-oceano','theme-cyberpunk',
    'theme-bleach','theme-rgb','theme-floresta'
  );
  pararOceano();
  pararSakura();
  pararCyberpunk();
  pararBleach();
  pararRGB();
  pararFloresta();

  if (TEMAS[tema].classe) document.body.classList.add(TEMAS[tema].classe);

  const logo = document.getElementById('logoImg');
  if (logo) logo.src = (tema === 'claro') ? LOGO_PRETA : LOGO_BRANCA;

  const themeLabel = document.getElementById('themeLabel');
  if (themeLabel) themeLabel.textContent = TEMAS[tema].label;

  updateThemeMenu();

  if (tema === 'sakura')    criarPetalas();
  if (tema === 'oceano')    iniciarOceano();
  if (tema === 'cyberpunk') iniciarCyberpunk();
  if (tema === 'bleach')    iniciarBleach();
  if (tema === 'rgb')       iniciarRGB();
  if (tema === 'floresta')  iniciarFloresta();

  localStorage.setItem('anigma_tema', tema);
  closeThemeMenu();
}

function updateThemeMenu() {
  const menu = document.getElementById('themeMenu');
  if (!menu) return;

  const temaAtual = localStorage.getItem('anigma_tema') || 'escuro';
  let unlocked = ['escuro', 'claro', 'sakura', 'oceano'];
  try {
    const stored = localStorage.getItem('anigma_unlocked_themes');
    if (stored) unlocked = [...new Set([...unlocked, ...JSON.parse(stored)])];
  } catch (e) {}

  menu.innerHTML = '';
  Object.keys(TEMAS).forEach(temaId => {
    const temaInfo   = TEMAS[temaId];
    const isUnlocked = !temaInfo.pago || unlocked.includes(temaId);

    const option = document.createElement('div');
    option.className = 'theme-option';
    option.dataset.theme = temaId;
    if (!isUnlocked) option.classList.add('locked');
    if (temaId === temaAtual) option.classList.add('active');

    option.onclick = () => {
      if (isUnlocked) setTheme(temaId);
      else alert(`🔒 O tema "${temaInfo.label}" precisa de ser desbloqueado na Loja!`);
    };

    const icon = isUnlocked ? '<span class="theme-dot"></span>' : '🔒';
    option.innerHTML = `${icon} ${temaInfo.label}`;
    menu.appendChild(option);
  });
}

function toggleThemeMenu() { document.getElementById('themeMenu').classList.toggle('open'); }
function closeThemeMenu()  { const m = document.getElementById('themeMenu'); if (m) m.classList.remove('open'); }
document.addEventListener('click', (e) => { if (!e.target.closest('#themeWrap')) closeThemeMenu(); });

// ── SAKURA ──────────────────────────────────────────────────
function criarPetalas() {
  const container = document.getElementById('sakuraContainer');
  if (!container) return;
  container.innerHTML = '';
  const cores = ['#f9a8d4', '#fbcfe8', '#f472b6', '#fce7f3'];
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.classList.add('petal');
    p.style.left              = Math.random() * 100 + 'vw';
    p.style.width             = (Math.random() * 10 + 7) + 'px';
    p.style.height            = p.style.width;
    p.style.animationDuration = (Math.random() * 5 + 4) + 's';
    p.style.animationDelay    = (Math.random() * 6) + 's';
    p.style.opacity           = (Math.random() * 0.5 + 0.4).toString();
    p.style.background        = cores[Math.floor(Math.random() * cores.length)];
    container.appendChild(p);
  }
}
function pararSakura() { const c = document.getElementById('sakuraContainer'); if (c) c.innerHTML = ''; }

// ── OCEANO ──────────────────────────────────────────────────
let oceanAnimation = null;
let particles = [];

class OceanParticle {
  constructor(canvas) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height * 0.6;
    this.size = Math.random() * 3 + 1;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.speedX = (Math.random() - 1) * 1;
    this.speedY = Math.random() * 0.5 + 0.3;
    this.wobbleSpeed = Math.random() * 0.3 + 0.1;
    this.wobbleAmount = 0;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.wobbleAmount += this.wobbleSpeed;
    this.x += Math.sin(this.wobbleAmount) * 0.5;
    this.opacity -= 0.0015;
  }
}

function iniciarOceano() {
  const canvas = document.getElementById('oceanCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function redimensionar() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 80; i++) particles.push(new OceanParticle(canvas));
  }
  redimensionar();
  window.addEventListener('resize', redimensionar);
  const ondas = [
    { cor: 'rgba(7,80,120,0.42)',   amp:36, freq:0.0045, vel:0.0045, yBase:0.56, phase:0 },
    { cor: 'rgba(14,120,160,0.30)', amp:28, freq:0.0052, vel:0.0058, yBase:0.66, phase:Math.PI*.5 },
    { cor: 'rgba(56,189,248,0.20)', amp:20, freq:0.0068, vel:0.0065, yBase:0.76, phase:Math.PI*1.0 },
  ];
  let t = 0, particleTimer = 0;
  function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(5,21,37,0.3)'); gradient.addColorStop(1, 'rgba(5,21,37,0.7)');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ondas.forEach((onda, index) => {
      ctx.beginPath(); ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 2) {
        const baseY = canvas.height * onda.yBase;
        const wave1 = Math.sin(x * onda.freq + t * onda.vel * 60 + onda.phase) * onda.amp;
        const wave2 = Math.sin(x * onda.freq * 1.8 + t * onda.vel * 45 + onda.phase * 0.7) * (onda.amp * 0.5);
        const wave3 = Math.sin(x * onda.freq * 0.5 + t * onda.vel * 30 + onda.phase * 1.3) * (onda.amp * 0.3);
        ctx.lineTo(x, baseY + wave1 + wave2 + wave3);
      }
      ctx.lineTo(canvas.width, canvas.height); ctx.closePath();
      ctx.fillStyle = onda.cor; ctx.fill();
      if (index > 0) { ctx.strokeStyle = `rgba(100,220,255,${0.08*(1-index/ondas.length)})`; ctx.lineWidth = 1.5; ctx.stroke(); }
    });
    particleTimer++;
    if (particleTimer > 15) { particles.push(new OceanParticle(canvas)); particleTimer = 0; }
    particles = particles.filter(p => p.opacity > 0);
    particles.forEach(p => {
      p.update();
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, `rgba(150,230,255,${p.opacity*.8})`);
      g.addColorStop(1, `rgba(56,189,248,${p.opacity*.3})`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
    });
    t += 0.35; oceanAnimation = requestAnimationFrame(desenhar);
  }
  desenhar();
}
function pararOceano() {
  if (oceanAnimation) { cancelAnimationFrame(oceanAnimation); oceanAnimation = null; }
  const canvas = document.getElementById('oceanCanvas');
  if (canvas) { const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

// ── CYBERPUNK ────────────────────────────────────────────────
let cyberpunkAnimation = null;
function iniciarCyberpunk() {
  const canvas = document.getElementById('oceanCanvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  function redimensionar() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  redimensionar();
  window.addEventListener('resize', redimensionar);
  const linhas = [];
  for (let i = 0; i < 40; i++) {
    linhas.push({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      largura: Math.random() * 1.5 + 0.5, velocidade: Math.random() * 2 + 0.5,
      comprimento: Math.random() * 80 + 20,
      cor: Math.random() > 0.5 ? 'rgba(252,238,10,' : 'rgba(255,0,255,',
      opacidade: Math.random() * 0.3 + 0.05,
    });
  }
  function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0, 'rgba(8,0,16,0.6)'); g.addColorStop(1, 'rgba(8,0,16,0.9)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
    linhas.forEach(l => {
      ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(l.x, l.y + l.comprimento);
      ctx.strokeStyle = l.cor + l.opacidade + ')'; ctx.lineWidth = l.largura; ctx.stroke();
      l.y += l.velocidade;
      if (l.y > canvas.height) { l.y = -l.comprimento; l.x = Math.random() * canvas.width; }
    });
    ctx.strokeStyle = 'rgba(252,238,10,0.03)'; ctx.lineWidth = 1;
    for (let y = 0; y < canvas.height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
    cyberpunkAnimation = requestAnimationFrame(desenhar);
  }
  desenhar();
}
function pararCyberpunk() {
  if (cyberpunkAnimation) { cancelAnimationFrame(cyberpunkAnimation); cyberpunkAnimation = null; }
  const canvas = document.getElementById('oceanCanvas');
  if (canvas) { canvas.style.display = 'none'; canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); }
}

// ── BLEACH ───────────────────────────────────────────────────
let bleachAnimation = null;
function iniciarBleach() {
  const canvas = document.getElementById('oceanCanvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  function redimensionar() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  redimensionar();
  window.addEventListener('resize', redimensionar);

  // Partículas de espiritual (reiatsu)
  const reiatsuParticles = [];
  for (let i = 0; i < 60; i++) {
    reiatsuParticles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -(Math.random() * 0.8 + 0.2),
      life: Math.random(),
    });
  }

  let t = 0;
  function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fundo gradiente preto/azul escuro
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, 'rgba(0,0,0,0.5)');
    bg.addColorStop(1, 'rgba(5,10,30,0.7)');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Lua ocasional (fundo)
    const moonX = canvas.width * 0.82;
    const moonY = canvas.height * 0.18;
    const moonGrad = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 100);
    moonGrad.addColorStop(0, 'rgba(220,230,255,0.08)');
    moonGrad.addColorStop(0.4, 'rgba(180,200,255,0.04)');
    moonGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = moonGrad; ctx.beginPath(); ctx.arc(moonX, moonY, 100, 0, Math.PI * 2); ctx.fill();

    // Partículas reiatsu (azul/branco)
    reiatsuParticles.forEach(p => {
      p.x += p.speedX + Math.sin(t * 0.02 + p.y * 0.01) * 0.3;
      p.y += p.speedY;
      p.life += 0.005;
      p.opacity = Math.abs(Math.sin(p.life)) * 0.4;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; p.life = 0; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150,180,255,${p.opacity})`;
      ctx.fill();
    });

    // Linha horizontal subtil (like Bleach's horizon)
    ctx.strokeStyle = 'rgba(100,140,220,0.05)';
    ctx.lineWidth = 1;
    for (let y = 0; y < canvas.height; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    t++;
    bleachAnimation = requestAnimationFrame(desenhar);
  }
  desenhar();
}
function pararBleach() {
  if (bleachAnimation) { cancelAnimationFrame(bleachAnimation); bleachAnimation = null; }
  const canvas = document.getElementById('oceanCanvas');
  if (canvas) { canvas.style.display = 'none'; canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); }
}

// ── RGB ──────────────────────────────────────────────────────
let rgbAnimation = null;
function iniciarRGB() {
  const canvas = document.getElementById('oceanCanvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  function redimensionar() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  redimensionar();
  window.addEventListener('resize', redimensionar);

  let hue = 0;
  function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Gradiente RGB que roda
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0, `hsla(${hue}, 80%, 12%, 0.7)`);
    g.addColorStop(0.5, `hsla(${(hue + 120) % 360}, 80%, 10%, 0.7)`);
    g.addColorStop(1, `hsla(${(hue + 240) % 360}, 80%, 12%, 0.7)`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Partículas coloridas
    for (let i = 0; i < 3; i++) {
      const px = Math.random() * canvas.width;
      const py = Math.random() * canvas.height;
      const pg = ctx.createRadialGradient(px, py, 0, px, py, Math.random() * 80 + 20);
      pg.addColorStop(0, `hsla(${(hue + i * 120) % 360}, 100%, 60%, 0.06)`);
      pg.addColorStop(1, 'transparent');
      ctx.fillStyle = pg; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    hue = (hue + 0.4) % 360;
    rgbAnimation = requestAnimationFrame(desenhar);
  }
  desenhar();
}
function pararRGB() {
  if (rgbAnimation) { cancelAnimationFrame(rgbAnimation); rgbAnimation = null; }
  const canvas = document.getElementById('oceanCanvas');
  if (canvas) { canvas.style.display = 'none'; canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); }
}

// ── FLORESTA ─────────────────────────────────────────────────
let florestaAnimation = null;
function iniciarFloresta() {
  const canvas = document.getElementById('oceanCanvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  function redimensionar() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  redimensionar();
  window.addEventListener('resize', redimensionar);

  // Partículas de folhas
  const folhas = [];
  for (let i = 0; i < 25; i++) {
    folhas.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 6 + 3,
      opacity: Math.random() * 0.3 + 0.05,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: Math.random() * 0.4 + 0.1,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 1.5,
    });
  }

  let t = 0;
  function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, 'rgba(5,20,10,0.5)');
    bg.addColorStop(1, 'rgba(10,30,15,0.7)');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Raios de luz
    for (let i = 0; i < 4; i++) {
      const lx = (canvas.width / 4) * i + canvas.width / 8;
      const lg = ctx.createLinearGradient(lx, 0, lx + 40, canvas.height);
      lg.addColorStop(0, 'rgba(100,200,100,0.04)');
      lg.addColorStop(1, 'transparent');
      ctx.fillStyle = lg;
      ctx.beginPath(); ctx.moveTo(lx - 20, 0); ctx.lineTo(lx + 60, 0); ctx.lineTo(lx + 80, canvas.height); ctx.lineTo(lx, canvas.height); ctx.closePath(); ctx.fill();
    }

    // Folhas
    folhas.forEach(f => {
      f.x += f.speedX + Math.sin(t * 0.01 + f.y * 0.005) * 0.3;
      f.y += f.speedY;
      f.rot += f.rotSpeed;
      if (f.y > canvas.height + 20) { f.y = -20; f.x = Math.random() * canvas.width; }
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate((f.rot * Math.PI) / 180);
      ctx.fillStyle = `rgba(80,180,80,${f.opacity})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, f.size, f.size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    t++;
    florestaAnimation = requestAnimationFrame(desenhar);
  }
  desenhar();
}
function pararFloresta() {
  if (florestaAnimation) { cancelAnimationFrame(florestaAnimation); florestaAnimation = null; }
  const canvas = document.getElementById('oceanCanvas');
  if (canvas) { canvas.style.display = 'none'; canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); }
}

// ── INICIAR ───────────────────────────────────────────────────
window.onload = function () {
  const temaGuardado = localStorage.getItem('anigma_tema') || 'escuro';
  let unlocked = ['escuro', 'claro', 'sakura', 'oceano'];
  try {
    const stored = localStorage.getItem('anigma_unlocked_themes');
    if (stored) unlocked = [...new Set([...unlocked, ...JSON.parse(stored)])];
  } catch (e) {}
  const temaFinal = (TEMAS[temaGuardado] && (!TEMAS[temaGuardado].pago || unlocked.includes(temaGuardado)))
    ? temaGuardado : 'escuro';
  setTheme(temaFinal);
  updateThemeMenu();
};