// ANIGMA - Tema.js

const TEMAS = {
  escuro: { label: 'Dark',   classe: ''             },
  claro:  { label: 'Light',  classe: 'light-mode'   },
  sakura: { label: 'Sakura', classe: 'theme-sakura' },
  oceano: { label: 'Ocean',  classe: 'theme-oceano' },
};

// Verifica se estamos dentro da pasta Jogos para ajustar o caminho da imagem
const isGamePath = window.location.pathname.includes('/Jogos/');
const pathPrefix = isGamePath ? '../' : '';

const LOGO_BRANCA = pathPrefix + 'Imagens/LogoSite/LogoSite.png';
const LOGO_PRETA  = pathPrefix + 'Imagens/LogoSite/LogoPreta.png';

// APLICAR TEMA
function setTheme(tema) {
  document.body.classList.remove('light-mode', 'theme-sakura', 'theme-oceano');

  pararOceano();
  pararSakura();

  if (TEMAS[tema].classe) {
    document.body.classList.add(TEMAS[tema].classe);
  }

  const logo = document.getElementById('logoImg');
  if (logo) logo.src = tema === 'claro' ? LOGO_PRETA : LOGO_BRANCA;

  document.getElementById('themeLabel').textContent = TEMAS[tema].label;

  updateThemeMenu();

  if (tema === 'sakura') criarPetalas();
  if (tema === 'oceano') iniciarOceano();

  localStorage.setItem('anigma_tema', tema);
  closeThemeMenu();
}

function updateThemeMenu() {
  const menu = document.getElementById('themeMenu');
  if (!menu) return;

  const temaAtual = localStorage.getItem('anigma_tema') || 'escuro';

  menu.innerHTML = '';

  Object.keys(TEMAS).forEach(temaId => {
    const temaInfo = TEMAS[temaId];

    const option = document.createElement('div');
    option.className = 'theme-option';
    option.dataset.theme = temaId;
    option.onclick = () => setTheme(temaId);

    if (temaId === temaAtual) option.classList.add('active');

    option.innerHTML = `<span class="theme-dot"></span> ${temaInfo.label}`;
    menu.appendChild(option);
  });
}
// MENU
function toggleThemeMenu() {
  document.getElementById('themeMenu').classList.toggle('open');
}

function closeThemeMenu() {
  document.getElementById('themeMenu').classList.remove('open');
}

document.addEventListener('click', function (e) {
  if (!e.target.closest('#themeWrap')) closeThemeMenu();
});

// SAKURA
function criarPetalas() {
  const container = document.getElementById('sakuraContainer');
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

function pararSakura() {
  const container = document.getElementById('sakuraContainer');
  if (container) container.innerHTML = '';
}

// OCEANO
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
  const ctx    = canvas.getContext('2d');

  function redimensionar() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push(new OceanParticle(canvas));
    }
  }

  redimensionar();
  window.addEventListener('resize', redimensionar);

  // menos camadas e velocidades mais baixas para um movimento mais realista
  const ondas = [
    { cor: 'rgba(7, 80, 120, 0.42)', amp: 36, freq: 0.0045, vel: 0.0045, yBase: 0.56, phase: 0 },
    { cor: 'rgba(14, 120, 160, 0.30)', amp: 28, freq: 0.0052, vel: 0.0058, yBase: 0.66, phase: Math.PI * 0.5 },
    { cor: 'rgba(56, 189, 248, 0.20)', amp: 20, freq: 0.0068, vel: 0.0065, yBase: 0.76, phase: Math.PI * 1.0 },
  ];

  let t = 0;
  let particleTimer = 0;

  function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fundo gradiente suave
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(5, 21, 37, 0.3)');
    gradient.addColorStop(1, 'rgba(5, 21, 37, 0.7)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar ondas com sombras e brilho
    ondas.forEach((onda, index) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      
      for (let x = 0; x <= canvas.width; x += 2) {
        const baseY = canvas.height * onda.yBase;
        const wave1 = Math.sin(x * onda.freq + t * onda.vel * 60 + onda.phase) * onda.amp;
        const wave2 = Math.sin(x * onda.freq * 1.8 + t * onda.vel * 45 + onda.phase * 0.7) * (onda.amp * 0.5);
        const wave3 = Math.sin(x * onda.freq * 0.5 + t * onda.vel * 30 + onda.phase * 1.3) * (onda.amp * 0.3);
        
        const y = baseY + wave1 + wave2 + wave3;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fillStyle = onda.cor;
      ctx.fill();

      // Efeito de brilho nas ondas
      if (index > 0) {
        ctx.strokeStyle = `rgba(100, 220, 255, ${0.08 * (1 - index / ondas.length)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    // Atualizar e desenhar partículas
    particleTimer++;
    if (particleTimer > 15) {
      particles.push(new OceanParticle(canvas));
      particleTimer = 0;
    }

    particles = particles.filter(p => p.opacity > 0);

    particles.forEach(particle => {
      particle.update();
      
      const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
      gradient.addColorStop(0, `rgba(150, 230, 255, ${particle.opacity * 0.8})`);
      gradient.addColorStop(1, `rgba(56, 189, 248, ${particle.opacity * 0.3})`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // Aura brilhante
      ctx.strokeStyle = `rgba(100, 220, 255, ${particle.opacity * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Efeito de luz superior (reflexo)
    const topGlow = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.3);
    topGlow.addColorStop(0, 'rgba(100, 200, 255, 0.05)');
    topGlow.addColorStop(1, 'rgba(100, 200, 255, 0)');
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.3);

    // incrementar t mais devagar para desacelerar o movimento geral
    t += 0.35;
    oceanAnimation = requestAnimationFrame(desenhar);
  }

  desenhar();
}

function pararOceano() {
  if (oceanAnimation) {
    cancelAnimationFrame(oceanAnimation);
    oceanAnimation = null;
  }
}

// INICIAR
window.onload = function () {
  const temaGuardado = localStorage.getItem('anigma_tema') || 'escuro';
  setTheme(temaGuardado);
  updateThemeMenu();
};