// premium_banner.js — Banner Premium Season Pass
// Inclui no perfil.html e ranking.html antes do perfil.js/ranking.js

// Runas élficas para o banner
const BANNER_RUNES = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᛁ','ᛇ','ᛈ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛞ','ᛟ'];

// Injeta o banner no perfil
function injetarBannerPerfil(isPremium) {
  const headerCard = document.querySelector('.profile-header-card');
  if (!headerCard) return;

  // Remover banner anterior se existir
  const old = document.getElementById('spPremiumBanner');
  if (old) old.remove();

  const banner = document.createElement('div');
  banner.id = 'spPremiumBanner';

  if (isPremium) {
    banner.className = 'sp-premium-banner';
    banner.innerHTML = `
      <div class="sp-premium-banner-bg"></div>
      <div class="sp-banner-particles" id="bannerParticles"></div>
      <div class="sp-banner-content">
        <div class="sp-banner-left">
          <div class="sp-banner-icon">✨</div>
          <div class="sp-banner-text">
            <div class="sp-banner-title">ÉPOCA 1 · FRIEREN</div>
            <div class="sp-banner-sub">SEASON PASS PREMIUM</div>
          </div>
        </div>
        <div class="sp-banner-badge">★ PREMIUM ATIVO</div>
      </div>
    `;
    headerCard.insertAdjacentElement('beforebegin', banner);
    // Adicionar partículas e runas
    _initBannerFx(banner);
  } else {
    banner.className = 'sp-free-banner';
    banner.innerHTML = `
      <div class="sp-free-banner-content">
        <a href="seasonpass.html" class="sp-free-banner-cta">✦ VER SEASON PASS</a>
      </div>
    `;
    headerCard.insertAdjacentElement('beforebegin', banner);
  }
}

function _initBannerFx(banner) {
  const particles = banner.querySelector('#bannerParticles');
  if (!particles) return;

  // Partículas
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'sp-banner-particle';
    const sz = 1.5 + Math.random() * 2.5;
    p.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      background:${Math.random()>0.5 ? 'rgba(200,169,110,0.7)' : 'rgba(140,180,230,0.6)'};
      --dur:${2+Math.random()*3}s;
      --delay:${Math.random()*3}s;
      --lo:${0.2+Math.random()*0.2};
      --hi:${0.6+Math.random()*0.4};
    `;
    particles.appendChild(p);
  }

  // Runas
  for (let i = 0; i < 8; i++) {
    const r = document.createElement('div');
    r.className = 'sp-banner-rune';
    r.textContent = BANNER_RUNES[Math.floor(Math.random()*BANNER_RUNES.length)];
    r.style.cssText = `
      left:${5+Math.random()*90}%;
      top:${10+Math.random()*70}%;
      --sz:${0.8+Math.random()*0.8}rem;
      --dur:${5+Math.random()*6}s;
      --delay:${Math.random()*4}s;
    `;
    banner.appendChild(r);
  }
}

// Badge no ranking — retorna HTML string para injetar ao lado do nome
function getBannerRankingTag(isPremium, spLevel) {
  if (!isPremium) return '';
  return `<span class="sp-ranking-tag" title="Season Pass Premium · Nível ${spLevel||1}">✦ S1</span>`;
}

// Expor globalmente
window.injetarBannerPerfil = injetarBannerPerfil;
window.getBannerRankingTag = getBannerRankingTag;
