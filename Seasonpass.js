// Seasonpass.js — ANIGMA Season Pass · Época 1: Frieren (atualizado para novas tabelas)

// ── Config ────────────────────────────────────────────
const SP = {
  id: 'S1_frieren',
  name: 'Frieren',
  end: '2025-08-31',
  levels: 75,
  xp_per_lv: 200,
  price_gems: 30000,
  price_eur: 1.99,
};

const SP_XP = {
  jogar: 2,
  acertar: 15,
  acertar_top3: 35,
  primeira_tent: 80,
  streak: 8,
  conquista: 20,
};

// ── Recompensas ───────────────────────────────────────
function gerarRecompensas() {
  const R = [];
  for (let lv = 1; lv <= 75; lv++) {
    let free = {}, prem = {};
    if (lv === 1) { free = { d: 20 }; prem = { d: 60, special: { type: 'title', val: '✨ Aprendiz de Magia' } }; }
    else if (lv === 5) { free = { d: 25, special: { type: 'banner', val: 'sp_frieren_banner', name: 'Banner Época 1' } }; prem = { d: 80 }; }
    else if (lv === 10) { free = { d: 40, special: { type: 'title', val: '🌿 Viajante' } }; prem = { special: { type: 'style', val: 'sp_runico' } }; }
    else if (lv === 15) { free = { d: 30 }; prem = { d: 80, special: { type: 'title', val: '❄️ Mago Glacial' } }; }
    else if (lv === 20) { free = { d: 50, special: { type: 'title', val: '⚔️ Caçador de Demónios' } }; prem = { special: { type: 'frame', val: 'frame_runico' } }; }
    else if (lv === 25) { free = { d: 40 }; prem = { special: { type: 'avatar', val: 'sp_frieren_young' }, d: 60 }; }
    else if (lv === 30) { free = { d: 60, special: { type: 'title', val: '🌙 Sábio da Magia' } }; prem = { special: { type: 'style', val: 'sp_glacial' } }; }
    else if (lv === 35) { free = { d: 50 }; prem = { d: 100, special: { type: 'title', val: '🌟 Élfico Imortal' } }; }
    else if (lv === 40) { free = { d: 80, special: { type: 'title', val: '💜 Discípulo de Frieren' } }; prem = { special: { type: 'frame', val: 'frame_glacial' } }; }
    else if (lv === 45) { free = { d: 60 }; prem = { special: { type: 'avatar', val: 'sp_frieren_adult' }, d: 80 }; }
    else if (lv === 50) { free = { d: 100, special: { type: 'title', val: '⚡ Mago de Classe S' } }; prem = { special: { type: 'style', val: 'sp_frieren_aurora' } }; }
    else if (lv === 55) { free = { d: 70 }; prem = { d: 140, special: { type: 'title', val: '🔮 Arquimago Élfico' } }; }
    else if (lv === 60) { free = { d: 100 }; prem = { special: { type: 'frame', val: 'frame_eterno' } }; }
    else if (lv === 65) { free = { d: 80 }; prem = { special: { type: 'avatar', val: 'sp_frieren_staff' }, d: 100 }; }
    else if (lv === 70) { free = { d: 120, special: { type: 'title', val: '🌌 Além do Tempo' } }; prem = { special: { type: 'style', val: 'sp_transcendente' } }; }
    else if (lv === 75) {
      free = { d: 300, special: { type: 'title', val: '🏁 Sobrevivente da Época 1' } };
      prem = { d: 800, special: { type: 'avatar', val: 'sp_frieren_final' }, special2: { type: 'title', val: '💫 Lenda da Época 1' }, special3: { type: 'frame', val: 'frame_divino_frieren' } };
    }
    else if (lv % 10 === 0) { free = { d: 35 + Math.floor(lv / 10) * 5 }; prem = { d: 90 + Math.floor(lv / 10) * 10 }; }
    else if (lv % 5 === 0) { free = { d: 20 + Math.floor(lv / 5) * 3 }; prem = { d: 55 + Math.floor(lv / 5) * 5 }; }
    else { free = { d: 10 + Math.floor(lv / 15) * 3 }; prem = { d: 28 + Math.floor(lv / 10) * 4 }; }
    R.push({ lv, free, prem });
  }
  return R;
}

const REWARDS = gerarRecompensas();
const MILESTONES = [10, 20, 25, 30, 40, 50, 60, 70, 75];

const spLv = xp => Math.min(SP.levels, Math.floor((xp || 0) / SP.xp_per_lv) + 1);
const spXpInLv = xp => (xp || 0) % SP.xp_per_lv;
const daysLeft = d => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));

let G = { session: null, profile: null, isPrem: false, xp: 0, level: 1 };

// ── Boot — novas tabelas ──────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  initBg();
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  G.session = session;
  if (!session) { document.getElementById('spGuestWall').style.display = 'flex'; return; }

  const [profileRes, spRes, cosmeticsRes, statsRes] = await Promise.all([
    window.supabaseClient.from('profiles').select('id,username,avatar_url,equipped_title,equipped_name_style').eq('id', session.user.id).single(),
    window.supabaseClient.from('season_pass').select('*').eq('user_id', session.user.id).single(),
    window.supabaseClient.from('profile_cosmetics').select('unlocked_titles,unlocked_name_styles,unlocked_frames,unlocked_avatars').eq('user_id', session.user.id).single(),
    window.supabaseClient.from('profile_stats').select('diamantes').eq('user_id', session.user.id).single(),
  ]);

  const p = {
    ...profileRes.data,
    ...cosmeticsRes.data,
    diamantes: statsRes.data?.diamantes ?? 0,
    season_pass_xp: spRes.data?.season_pass_xp ?? 0,
    season_pass_level: spRes.data?.season_pass_level ?? 1,
    season_pass_premium: spRes.data?.season_pass_premium ?? false,
    season_claimed_rewards: spRes.data?.season_claimed_rewards ?? [],
  };

  if (!p.id) return;
  G.profile = p;
  G.isPrem = p.season_pass_premium;
  G.xp = p.season_pass_xp;
  G.level = spLv(G.xp);

  const spMain = document.getElementById('spMain');
  if (spMain) spMain.style.display = 'block';
  renderHero(); renderBuy(); renderProgress(); renderLevels(); initDrag();
});

// ── Hero ──────────────────────────────────────────────
function renderHero() {
  setText('spDaysLeft', daysLeft(SP.end));
  setText('spHeroLv', G.level);
  const badge = document.getElementById('spPremBadge');
  if (badge) {
    if (G.isPrem) badge.innerHTML = '<span class="sp-prem-badge">★ PREMIUM ATIVO</span>';
    else badge.textContent = 'Gratuito';
  }
}

// ── Cards de compra ───────────────────────────────────
function renderBuy() {
  const el = document.getElementById('spBuySection');
  if (!el) return;
  if (G.isPrem) {
    el.innerHTML = `<div class="sp-card sp-card-premium" style="grid-column:1/-1;max-width:480px;margin:0 auto;text-align:center;"><div class="sp-card-tag gold">✦ Premium Ativo</div><div class="sp-card-name">Tens o Premium!</div><p style="font-size:.82rem;color:rgba(255,255,255,.38);margin:8px 0 0;line-height:1.6;">Aproveita todas as recompensas exclusivas da Época Frieren.</p></div>`;
    return;
  }
  el.innerHTML = `
    <div class="sp-card sp-card-free">
      <div class="sp-card-tag free">Incluído</div>
      <div class="sp-card-name">Gratuito</div>
      <div class="sp-card-price freep">€0</div>
      <div class="sp-card-note">Sempre grátis com conta</div>
      <ul class="sp-card-list">
        <li>Acesso a todos os 75 níveis</li><li>Recompensas base por nível</li>
        <li>Diamantes nos milestones</li><li>Títulos gratuitos desbloqueáveis</li>
      </ul>
      <div class="sp-card-cta owned-cta">✓ Já Incluído</div>
    </div>
    <div class="sp-card sp-card-premium">
      <div class="sp-card-tag gold">★ Recomendado</div>
      <div class="sp-card-name">Premium</div>
      <div class="sp-card-price gold">€1,99</div>
      <div class="sp-card-note">pagamento único · esta época</div>
      <ul class="sp-card-list">
        <li>Tudo do plano gratuito</li><li>2× diamantes em todos os níveis</li>
        <li>Avatares exclusivos do universo Frieren</li><li>Títulos animados únicos</li>
        <li>Estilos de nome rúnicos e élfico</li><li>Frames de perfil exclusivos</li>
        <li>+15% XP em todas as ações</li><li>Recompensa final lendária (Lv 75)</li>
      </ul>
      <button class="sp-card-cta gold-cta" onclick="comprarPremEur()">Comprar por €1,99</button>
    </div>
    <div class="sp-card sp-card-gems">
      <div class="sp-card-tag magic">💎 Gemas</div>
      <div class="sp-card-name">Premium</div>
      <div class="sp-card-price magic">${SP.price_gems.toLocaleString()} 💎</div>
      <div class="sp-card-note">para os mais dedicados</div>
      <ul class="sp-card-list">
        <li>Exatamente igual ao Premium pago</li><li>Sem gastar dinheiro real</li>
        <li>Requer muito grind — és capaz?</li><li>Apenas para verdadeiros fãs</li>
      </ul>
      <button class="sp-card-cta magic-cta" onclick="comprarPremGemas()">Comprar com Gemas</button>
    </div>`;
}

// ── Progresso ─────────────────────────────────────────
function renderProgress() {
  const xpInLv = spXpInLv(G.xp);
  const pct = Math.round((xpInLv / SP.xp_per_lv) * 100);
  setText('spProgLv', `Nível ${G.level}`);
  setText('spProgNext', Math.min(G.level + 1, SP.levels));
  setText('spProgXp', `${xpInLv} / ${SP.xp_per_lv} XP`);
  setText('spHeroLv', G.level);
  setTimeout(() => { const bar = document.getElementById('spBarInner'); if (bar) bar.style.width = pct + '%'; }, 300);
}

// ── Níveis ────────────────────────────────────────────
function renderLevels(scrollToLv) {
  const scroll = document.getElementById('spLevelsScroll');
  if (!scroll) return;
  const savedScroll = scrollToLv !== undefined ? null : scroll.scrollLeft;
  const claimed = Array.isArray(G.profile?.season_claimed_rewards) ? G.profile.season_claimed_rewards : [];

  const temPendentes = REWARDS.some(r => {
    if (G.level < r.lv) return false;
    return !claimed.includes(`f${r.lv}`) || (G.isPrem && !claimed.includes(`p${r.lv}`));
  });

  let btnTudo = document.getElementById('spBtnReceberTudo');
  if (!btnTudo) {
    const trackHeader = document.querySelector('.sp-track-header');
    if (trackHeader) {
      btnTudo = document.createElement('button');
      btnTudo.id = 'spBtnReceberTudo'; btnTudo.className = 'sp-btn-tudo'; btnTudo.onclick = receberTudo;
      trackHeader.appendChild(btnTudo);
    }
  }
  if (btnTudo) {
    btnTudo.textContent = temPendentes ? '✦ Receber Tudo' : '✓ Tudo Recebido';
    btnTudo.disabled = !temPendentes; btnTudo.style.opacity = temPendentes ? '1' : '0.4';
  }

  const inner = document.createElement('div');
  inner.className = 'sp-levels-inner';

  REWARDS.forEach(r => {
    const unlocked = G.level >= r.lv;
    const current = G.level === r.lv;
    const milestone = MILESTONES.includes(r.lv);
    const claimedF = claimed.includes(`f${r.lv}`);
    const claimedP = claimed.includes(`p${r.lv}`);

    const cell = document.createElement('div');
    cell.dataset.lv = r.lv;
    cell.className = ['sp-level-cell', unlocked ? 'unlocked' : '', current ? 'current' : '', milestone ? 'milestone' : ''].filter(Boolean).join(' ');
    cell.innerHTML = `
      ${buildRew(r.prem, unlocked, G.isPrem, claimedP, true, r.lv)}
      <div class="sp-lv-badge">${r.lv === 75 ? '🏁' : r.lv}</div>
      ${buildRew(r.free, unlocked, true, claimedF, false, r.lv)}
    `;
    inner.appendChild(cell);
  });

  scroll.innerHTML = '';
  scroll.appendChild(inner);

  setTimeout(() => {
    if (scrollToLv !== undefined) {
      const targetCell = inner.querySelector(`[data-lv="${scrollToLv}"]`);
      if (targetCell) scroll.scrollLeft = targetCell.offsetLeft - (scroll.offsetWidth / 2 - targetCell.offsetWidth / 2);
    } else if (savedScroll !== null) {
      scroll.scrollLeft = savedScroll;
    } else {
      const idx = Math.max(0, G.level - 3);
      const cells = inner.querySelectorAll('.sp-level-cell');
      if (cells[idx]) scroll.scrollLeft = cells[idx].offsetLeft - 40;
    }
  }, 80);
}

function buildRew(rew, unlocked, hasAccess, claimed, isPrem, lv) {
  const cls = isPrem ? 'sp-rew-prem' : 'sp-rew-free';
  const btnCls = isPrem ? 'prem-btn' : 'free-btn';

  if (claimed) {
    return `<div class="${cls} claimed"><div class="sp-rew-icon">✅</div></div><button class="sp-rew-btn done-btn" disabled>✓ Recebido</button>`;
  }
  if (!hasAccess && isPrem) {
    return `<div class="${cls} locked-prem"><div class="sp-rew-icon">🔒</div><div class="sp-rew-sub">Premium</div></div><button class="sp-rew-btn prem-btn" onclick="comprarPremEur()" style="${!unlocked ? 'display:none;' : ''}">Desbloquear</button>`;
  }

  let content = '';
  if (rew.special) {
    const icons = { avatar: '🖼️', title: '🏷️', style: '✨', frame: '🪟' };
    const icon = icons[rew.special.type] || '🎁';
    const label = rew.special.type === 'title' ? rew.special.val.slice(0, 14) : capType(rew.special.type);
    content = `<div class="sp-rew-icon">${icon}</div><div class="sp-rew-val">${label}</div>`;
    if (rew.special2) content += `<div class="sp-rew-sub">+${capType(rew.special2.type)}</div>`;
  } else if (rew.d) {
    content = `<div class="sp-rew-icon">💎</div><div class="sp-rew-val">${rew.d}</div>`;
  } else {
    content = `<div class="sp-rew-icon">—</div>`;
  }

  return `<div class="${cls}">${content}</div><button class="sp-rew-btn ${btnCls}" style="${!unlocked ? 'display:none;' : ''}" onclick="receber('${isPrem ? 'p' : 'f'}${lv}', ${isPrem}, ${lv})">Receber</button>`;
}

function capType(t) { return { avatar: 'Avatar', title: 'Título', style: 'Estilo', frame: 'Frame', banner: 'Banner' }[t] || t; }

// ── Receber — novas tabelas ───────────────────────────
async function receber(key, isPrem, lv) {
  if (!G.session || !G.profile) return;
  const claimed = Array.isArray(G.profile.season_claimed_rewards) ? [...G.profile.season_claimed_rewards] : [];
  if (claimed.includes(key)) return;
  claimed.push(key);

  const r = REWARDS.find(x => x.lv === lv);
  const rew = isPrem ? r?.prem : r?.free;
  if (!rew) return;

  const spUpdates = { season_claimed_rewards: claimed };
  const statsUpdates = {};
  const cosmeticUpdates = {};

  if (rew.d && !rew.special) { statsUpdates.diamantes = (G.profile.diamantes || 0) + rew.d; G.profile.diamantes = statsUpdates.diamantes; }
  if (rew.special) {
    processarSpecial(rew.special, cosmeticUpdates);
    if (rew.special2) processarSpecial(rew.special2, cosmeticUpdates);
    if (rew.special3) processarSpecial(rew.special3, cosmeticUpdates);
    if (rew.d) { statsUpdates.diamantes = (G.profile.diamantes || 0) + rew.d; G.profile.diamantes = statsUpdates.diamantes; }
  }

  const ops = [window.supabaseClient.from('season_pass').update(spUpdates).eq('user_id', G.session.user.id)];
  if (Object.keys(statsUpdates).length) ops.push(window.supabaseClient.from('profile_stats').update(statsUpdates).eq('user_id', G.session.user.id));
  if (Object.keys(cosmeticUpdates).length) ops.push(window.supabaseClient.from('profile_cosmetics').update(cosmeticUpdates).eq('user_id', G.session.user.id));

  const results = await Promise.all(ops);
  if (results.some(r => r.error)) { console.error('Erro ao receber:', results); return; }

  G.profile.season_claimed_rewards = claimed;
  mostrarToast(rew);
  renderLevels(lv);
  initDrag();
}

function processarSpecial(special, cosmeticUpdates) {
  const profile = G.profile;
  if (special.type === 'title') {
    const arr = Array.isArray(profile.unlocked_titles) ? [...profile.unlocked_titles] : [];
    if (!arr.includes(special.val)) arr.push(special.val);
    cosmeticUpdates.unlocked_titles = arr; profile.unlocked_titles = arr;
  } else if (special.type === 'style') {
    const arr = Array.isArray(profile.unlocked_name_styles) ? [...profile.unlocked_name_styles] : [];
    if (!arr.includes(special.val)) arr.push(special.val);
    cosmeticUpdates.unlocked_name_styles = arr;
  } else if (special.type === 'frame') {
    const arr = Array.isArray(profile.unlocked_frames) ? [...profile.unlocked_frames] : [];
    if (!arr.includes(special.val)) arr.push(special.val);
    cosmeticUpdates.unlocked_frames = arr;
  } else if (special.type === 'avatar') {
    const arr = Array.isArray(profile.unlocked_avatars) ? [...profile.unlocked_avatars] : [];
    if (!arr.includes(special.val)) arr.push(special.val);
    cosmeticUpdates.unlocked_avatars = arr; profile.unlocked_avatars = arr;
  } else if (special.type === 'banner') {
    const arr = Array.isArray(profile.unlocked_banners) ? [...profile.unlocked_banners] : [];
    // O valor do banner deve ser um objeto {url, name}
    if (!arr.find(b => b.url === special.val)) arr.push({ url: special.val, name: special.name || 'Banner do Pass' });
    cosmeticUpdates.unlocked_banners = arr; profile.unlocked_banners = arr;
  }
}

function mostrarToast(rew) {
  const icons = { avatar: '🖼️', title: '🏷️', style: '✨', frame: '🪟' };
  let icon = '💎', title = 'Recompensa Recebida!', sub = '';
  if (rew.special) {
    icon = icons[rew.special.type] || '🎁';
    title = rew.special.type === 'title' ? rew.special.val : `${capType(rew.special.type)} Desbloqueado`;
    sub = rew.d ? `+${rew.d} 💎 incluídos` : 'Vê no teu perfil';
  } else if (rew.d) { icon = '💎'; title = `+${rew.d} Diamantes!`; sub = 'Adicionados à tua conta'; }
  document.querySelectorAll('.sp-toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'sp-toast';
  t.innerHTML = `<div class="sp-toast-icon">${icon}</div><div class="sp-toast-title">${title}</div><div class="sp-toast-sub">${sub}</div>`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ── Receber Tudo — novas tabelas ──────────────────────
async function receberTudo() {
  if (!G.session || !G.profile) return;
  const btn = document.getElementById('spBtnReceberTudo');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ A processar...'; }

  const claimed = Array.isArray(G.profile.season_claimed_rewards) ? [...G.profile.season_claimed_rewards] : [];
  const spUpdates = { season_claimed_rewards: [...claimed] };
  const statsUpdates = {};
  const cosmeticUpdates = {};
  let totalDiamantes = 0, itens = [];

  for (const r of REWARDS) {
    if (G.level < r.lv) continue;
    if (!claimed.includes(`f${r.lv}`)) {
      spUpdates.season_claimed_rewards.push(`f${r.lv}`);
      const rew = r.free;
      if (rew.d && !rew.special) totalDiamantes += rew.d;
      if (rew.special) { processarSpecial(rew.special, cosmeticUpdates); if (rew.d) totalDiamantes += rew.d; itens.push(rew.special.val || capType(rew.special.type)); }
    }
    if (G.isPrem && !claimed.includes(`p${r.lv}`)) {
      spUpdates.season_claimed_rewards.push(`p${r.lv}`);
      const rew = r.prem;
      if (rew.d && !rew.special) totalDiamantes += rew.d;
      if (rew.special) {
        processarSpecial(rew.special, cosmeticUpdates);
        if (rew.special2) processarSpecial(rew.special2, cosmeticUpdates);
        if (rew.special3) processarSpecial(rew.special3, cosmeticUpdates);
        if (rew.d) totalDiamantes += rew.d;
        itens.push(rew.special.val || capType(rew.special.type));
      }
    }
  }

  if (totalDiamantes > 0) { statsUpdates.diamantes = (G.profile.diamantes || 0) + totalDiamantes; G.profile.diamantes = statsUpdates.diamantes; }

  const ops = [window.supabaseClient.from('season_pass').update(spUpdates).eq('user_id', G.session.user.id)];
  if (Object.keys(statsUpdates).length) ops.push(window.supabaseClient.from('profile_stats').update(statsUpdates).eq('user_id', G.session.user.id));
  if (Object.keys(cosmeticUpdates).length) ops.push(window.supabaseClient.from('profile_cosmetics').update(cosmeticUpdates).eq('user_id', G.session.user.id));

  const results = await Promise.all(ops);
  if (results.some(r => r.error)) { console.error('Erro:', results); if (btn) { btn.disabled = false; btn.textContent = '✦ Receber Tudo'; } return; }

  G.profile.season_claimed_rewards = spUpdates.season_claimed_rewards;
  if (totalDiamantes > 0) animarDiamantes(totalDiamantes);

  const toastSub = itens.length > 0
    ? `+${totalDiamantes} 💎 · ${itens.slice(0, 2).join(' · ')}${itens.length > 2 ? ` +${itens.length - 2} mais` : ''}`
    : `+${totalDiamantes} 💎 adicionados`;

  document.querySelectorAll('.sp-toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'sp-toast';
  t.innerHTML = `<div class="sp-toast-icon">🎁</div><div class="sp-toast-title">Tudo Recebido!</div><div class="sp-toast-sub">${toastSub}</div>`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
  renderLevels(); initDrag();
}

// ── Animação diamantes ────────────────────────────────
function animarDiamantes(total) {
  const count = Math.min(18, Math.max(6, Math.floor(total / 20)));
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const d = document.createElement('div');
      d.textContent = '💎';
      d.style.cssText = `position:fixed;left:${20 + Math.random() * 60}vw;bottom:${10 + Math.random() * 20}vh;font-size:${1.2 + Math.random() * 1.2}rem;z-index:99999;pointer-events:none;animation:diamUp ${1.2 + Math.random() * 0.8}s ease-out forwards;`;
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 2200);
    }, i * 80);
  }
  if (!document.getElementById('diamCss')) {
    const s = document.createElement('style');
    s.id = 'diamCss';
    s.textContent = `@keyframes diamUp { 0%{transform:translateY(0) scale(1) rotate(0deg);opacity:1;} 60%{opacity:1;} 100%{transform:translateY(-60vh) scale(0.4) rotate(180deg);opacity:0;} }`;
    document.head.appendChild(s);
  }
  const hd = document.getElementById('headerDiamantes');
  if (hd && G.profile?.diamantes) {
    const start = G.profile.diamantes - total, end = G.profile.diamantes;
    let cur = start; const step = Math.ceil((end - start) / 30);
    const iv = setInterval(() => { cur = Math.min(cur + step, end); hd.textContent = cur; if (cur >= end) clearInterval(iv); }, 40);
  }
}

// ── Comprar Premium ───────────────────────────────────
async function comprarPremEur() {
  const ok = confirm(`Comprar Season Pass Premium por €1,99?\n\n✦ 2× diamantes em todos os níveis\n✦ Avatares exclusivos de Frieren\n✦ Títulos e estilos únicos\n✦ Frames de perfil\n✦ +15% XP\n\n(Liga aqui o teu gateway de pagamento)`);
  if (ok) await ativarPrem();
}

async function comprarPremGemas() {
  if (!G.session) { alert('Precisas de fazer login.'); return; }
  const custo = SP.price_gems, atual = G.profile?.diamantes || 0;
  if (atual < custo) { alert(`Precisas de ${custo.toLocaleString()} 💎.\nTens ${atual.toLocaleString()} 💎.`); return; }
  const ok = confirm(`Comprar Premium por ${custo.toLocaleString()} 💎?\nFicarás com ${(atual - custo).toLocaleString()} 💎.`);
  if (!ok) return;
  const { error } = await window.supabaseClient.from('profile_stats').update({ diamantes: atual - custo }).eq('user_id', G.session.user.id);
  if (error) { alert('Erro: ' + error.message); return; }
  G.profile.diamantes = atual - custo;
  await ativarPrem();
}

async function ativarPrem() {
  const { error } = await window.supabaseClient.from('season_pass').update({ season_pass_premium: true }).eq('user_id', G.session.user.id);
  if (error) { alert('Erro ao ativar: ' + error.message); return; }
  G.isPrem = true;
  const t = document.createElement('div');
  t.className = 'sp-toast';
  t.innerHTML = `<div class="sp-toast-icon">⭐</div><div class="sp-toast-title">PREMIUM ATIVADO!</div><div class="sp-toast-sub">Todas as recompensas premium disponíveis</div>`;
  document.body.appendChild(t);
  setTimeout(() => location.reload(), 2800);
}

// ── Fundo animado ─────────────────────────────────────
function initBg() {
  const starsEl = document.getElementById('spStars');
  if (starsEl) {
    for (let i = 0; i < 120; i++) {
      const s = document.createElement('div'); s.className = 'sp-star';
      const sz = Math.random() * 2 + 0.5;
      s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;--dur:${2 + Math.random() * 4}s;--delay:${Math.random() * 5}s;--lo:${0.05 + Math.random() * 0.1};--hi:${0.4 + Math.random() * 0.5};`;
      starsEl.appendChild(s);
    }
  }
  const runesEl = document.getElementById('spRunes');
  const runeChars = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];
  if (runesEl) {
    for (let i = 0; i < 18; i++) {
      const r = document.createElement('div'); r.className = 'sp-rune';
      r.textContent = runeChars[Math.floor(Math.random() * runeChars.length)];
      r.style.cssText = `left:${Math.random() * 100}%;--sz:${0.8 + Math.random() * 1.2}rem;--dur:${18 + Math.random() * 20}s;--delay:${Math.random() * 18}s;`;
      runesEl.appendChild(r);
    }
  }
}

// ── Drag scroll ───────────────────────────────────────
function initDrag() {
  const el = document.getElementById('spLevelsScroll');
  if (!el) return;
  let dragging = false, startX = 0, scrollL = 0;
  el.onmousedown = e => { dragging = true; startX = e.pageX - el.offsetLeft; scrollL = el.scrollLeft; el.style.scrollBehavior = 'auto'; };
  el.onmouseleave = el.onmouseup = () => dragging = false;
  el.onmousemove = e => { if (!dragging) return; e.preventDefault(); el.scrollLeft = scrollL - (e.pageX - el.offsetLeft - startX) * 1.5; };
}

function setText(id, val) { const e = document.getElementById(id); if (e) e.textContent = val; }

// ── spAddXp — novas tabelas ───────────────────────────
window.spAddXp = async function (tipo) {
  if (!G.session) return;
  const ganho = SP_XP[tipo] || 0;
  if (!ganho) return;
  const novoXp = (G.profile?.season_pass_xp || 0) + ganho;
  const novoLv = spLv(novoXp);
  const velhoLv = G.level;
  await window.supabaseClient.from('season_pass')
    .update({ season_pass_xp: novoXp, season_pass_level: novoLv }).eq('user_id', G.session.user.id);
  if (G.profile) G.profile.season_pass_xp = novoXp;
  G.xp = novoXp; G.level = novoLv;
  if (novoLv > velhoLv) {
    const t = document.createElement('div'); t.className = 'sp-toast';
    t.innerHTML = `<div class="sp-toast-icon">⬆️</div><div class="sp-toast-title">SEASON PASS · NÍVEL ${novoLv}!</div><div class="sp-toast-sub">Vai ao Season Pass para receber as tuas recompensas</div>`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }
};