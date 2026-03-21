// auth.js — atualizado para novas tabelas

function atualizarHeaderStats(diamantes, pontos) {
  const hPontos = document.getElementById('headerPontos');
  const hDiamantes = document.getElementById('headerDiamantes');
  const hStats = document.getElementById('headerStats');
  if (hStats) hStats.style.display = 'flex';
  if (hPontos) hPontos.textContent = Math.max(0, pontos ?? 0);
  if (hDiamantes) hDiamantes.textContent = diamantes ?? 0;
}

function calculateLevel(points) {
  if (points < 0) return 1;
  return Math.floor(1 + (Math.sqrt(8 * (points / 500) + 1) - 1) / 2);
}

async function handleLevelUp(userId, pontosAntigos, pontosNovos) {
  const nivelAntigo = calculateLevel(pontosAntigos);
  const nivelNovo = calculateLevel(pontosNovos);
  if (nivelNovo <= nivelAntigo) return;

  const niveisSubidos = nivelNovo - nivelAntigo;
  const diamantesGanhos = niveisSubidos * 10;

  try {
    const { data: stats } = await window.supabaseClient
      .from('profile_stats').select('diamantes').eq('user_id', userId).single();

    await window.supabaseClient.from('profile_stats').update({
      level: nivelNovo,
      pontos_totais: pontosNovos,
      diamantes: (stats?.diamantes || 0) + diamantesGanhos,
    }).eq('user_id', userId);

    setTimeout(() => showLevelUpModal(nivelNovo, diamantesGanhos), 1500);
  } catch (e) { console.error('Erro ao processar subida de nível:', e); }
}

function showLevelUpModal(newLevel, diamondsWon) {
  document.querySelector('.levelup-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `
    <div class="levelup-modal">
      <div class="levelup-icon">🎉</div>
      <h2 class="levelup-title">Subiste de Nível!</h2>
      <div class="levelup-level">${newLevel}</div>
      <p class="levelup-reward">💎 +${diamondsWon} Diamantes Ganhos!</p>
      <button class="btn-levelup-close">Continuar</button>
    </div>`;
  document.body.appendChild(overlay);
  const close = () => { overlay.style.animation = 'fadeOut 0.3s ease forwards'; setTimeout(() => overlay.remove(), 300); };
  overlay.querySelector('.btn-levelup-close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
}

function criarBotaoPerfil(profile, prefix) {
  const btnLogin = document.getElementById('btnLogin');
  if (!btnLogin) return;

  const avatarUrl = profile.avatar_url || 'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/avatar_default.png';
  const username = profile.username || 'Perfil';

  document.getElementById('userDropdownWrap')?.remove();
  btnLogin.style.display = 'none';

  const wrap = document.createElement('div');
  wrap.id = 'userDropdownWrap';
  wrap.style.cssText = 'position:relative;display:inline-flex;align-items:center;';

  const btn = document.createElement('button');
  btn.id = 'userDropdownBtn';
  btn.style.cssText = `display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:5px 12px 5px 6px;cursor:pointer;color:#fff;font-size:0.85rem;font-weight:700;font-family:inherit;transition:background 0.2s;`;
  btn.innerHTML = '';

  let avatarEl;
  if (avatarUrl.endsWith('.webm') || avatarUrl.endsWith('.mp4')) {
    avatarEl = Object.assign(document.createElement('video'), { autoplay: true, loop: true, muted: true });
  } else {
    avatarEl = Object.assign(document.createElement('img'), { alt: 'avatar' });
  }
  avatarEl.id = 'headerUserAvatar';
  avatarEl.src = avatarUrl;
  avatarEl.style.cssText = 'width:28px;height:28px;border-radius:50%;object-fit:cover;';
  btn.appendChild(avatarEl);

  const usernameSpan = document.createElement('span');
  usernameSpan.id = 'headerUsername';
  usernameSpan.textContent = username;
  if (profile.equipped_name_style && typeof NAME_STYLES !== 'undefined' && NAME_STYLES[profile.equipped_name_style]) {
    const s = NAME_STYLES[profile.equipped_name_style];
    if (s.style) usernameSpan.style.cssText = s.style;
    if (s.className) usernameSpan.className = s.className;
  }
  btn.appendChild(usernameSpan);

  const arrow = document.createElement('span');
  arrow.style.cssText = 'font-size:0.7rem;opacity:0.7;';
  arrow.innerHTML = '&#9662;';
  btn.appendChild(arrow);

  const menu = document.createElement('div');
  menu.id = 'userDropdownMenu';
  menu.style.cssText = `display:none;position:absolute;top:calc(100% + 8px);right:0;background:#1a1a2e;border:1px solid rgba(255,255,255,0.12);border-radius:10px;min-width:160px;z-index:9999;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.4);`;

  const itemStyle = `display:block;width:100%;padding:11px 16px;background:none;border:none;color:#fff;font-size:0.85rem;font-family:inherit;cursor:pointer;text-align:left;text-decoration:none;transition:background 0.15s;`;
  menu.innerHTML = `
    <a href="${prefix}perfil.html" style="${itemStyle}">👤 O meu Perfil</a>
    <div style="height:1px;background:rgba(255,255,255,0.08);"></div>
    <button id="btnLogout" style="${itemStyle}color:#f87171;">🚪 Sair</button>
  `;

  btn.addEventListener('click', e => { e.stopPropagation(); menu.style.display = menu.style.display === 'block' ? 'none' : 'block'; });
  document.addEventListener('click', () => menu.style.display = 'none');
  menu.querySelector('#btnLogout').addEventListener('click', async () => {
    await window.supabaseClient.auth.signOut();
    window.location.href = prefix + 'login.html';
  });
  menu.querySelectorAll('a,button').forEach(el => {
    el.addEventListener('mouseenter', () => el.style.background = 'rgba(255,255,255,0.08)');
    el.addEventListener('mouseleave', () => el.style.background = 'none');
  });

  wrap.appendChild(btn); wrap.appendChild(menu);
  btnLogin.parentNode.insertBefore(wrap, btnLogin.nextSibling);
}

async function atualizarHeader(session) {
  const btnLogin = document.getElementById('btnLogin');
  const btnLoja = document.getElementById('btnLoja');
  const btnSeasonPass = document.getElementById('btnSeasonPass');
  const hStats = document.getElementById('headerStats');

  const path = window.location.pathname;
  const isSubFolder = path.includes('/Jogos/') || path.includes('/loja/') || path.includes('/ranking/');
  const prefix = isSubFolder ? '../' : '';

  if (!session) {
    // Redirecionar para register.html se não estiver em página pública ou de auth
    const path = window.location.pathname;
    const isAuthPage = path.includes('login.html') || path.includes('register.html');
    const isPublicPage = path.includes('ranking.html') || path.includes('index.html') || path.endsWith('/');
    
    if (!isAuthPage && !isPublicPage) {
      window.location.href = prefix + 'register.html';
      return;
    }

    if (btnLogin) {
      btnLogin.style.display = 'inline-flex';
      btnLogin.href = prefix + 'register.html';
      btnLogin.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Login`;
    }
    if (btnLoja) btnLoja.style.display = 'none';
    if (hStats) hStats.style.display = 'none';
    if (btnSeasonPass) btnSeasonPass.style.display = 'none';
    return;
  }

  try {
    // Buscar perfil base + stats em paralelo
    const [profileRes, statsRes, cosmeticsRes] = await Promise.all([
      window.supabaseClient.from('profiles').select('id,username,avatar_url,equipped_name_style,equipped_title,isAdmin').eq('id', session.user.id).single(),
      window.supabaseClient.from('profile_stats').select('diamantes,pontos_totais,current_streak,last_streak_date').eq('user_id', session.user.id).single(),
      window.supabaseClient.from('profile_cosmetics').select('unlocked_themes').eq('user_id', session.user.id).single(),
    ]);

    let profile = profileRes.data;
    let stats = statsRes.data;
    let cosmetics = cosmeticsRes.data;

    if (!profile) {
      const tempProfile = {
        username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'Utilizador',
        avatar_url: session.user.user_metadata?.avatar_url || 'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/avatar_default.png',
        equipped_name_style: null,
      };
      criarBotaoPerfil(tempProfile, prefix);
      atualizarHeaderStats(0, 0);
      if (hStats) hStats.style.display = 'flex';
      return;
    }

    // Recompensas pendentes
    const pendingJSON = localStorage.getItem('anigma_pending_rewards');
    if (pendingJSON && stats) {
      try {
        const pending = JSON.parse(pendingJSON);
        localStorage.removeItem('anigma_pending_rewards');
        const nd = (stats.diamantes || 0) + pending.diamantes;
        const np = (stats.pontos_totais || 0) + pending.pontos;
        await window.supabaseClient.from('profile_stats').update({ diamantes: nd, pontos_totais: np }).eq('user_id', session.user.id);
        await handleLevelUp(session.user.id, stats.pontos_totais, np);
        stats.diamantes = nd; stats.pontos_totais = np;
        setTimeout(() => alert(`Recompensas adicionadas!\n\n💎 +${pending.diamantes}\n⭐ +${pending.pontos}`), 500);
      } catch (e) { console.error('Erro ao atribuir recompensas pendentes:', e); }
    }

    // Daily streak
    if (stats) {
      const hoje = new Date().toISOString().split('T')[0];
      const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (stats.last_streak_date !== hoje) {
        let newStreak = stats.last_streak_date === ontem ? (stats.current_streak || 0) + 1 : 1;
        let reward = Math.min(200, 50 + (newStreak - 1) * 10);
        let msg = `🔥 Daily Streak: Dia ${newStreak}!\n💎 Recebeste ${reward} Diamantes!`;
        if (newStreak % 7 === 0) { reward += 250; msg = `🎉 Bónus Semanal! (Dia ${newStreak})\n💎 Total: ${reward} Diamantes!`; }

        const nd = (stats.diamantes || 0) + reward;
        await window.supabaseClient.from('profile_stats').update({
          diamantes: nd, current_streak: newStreak, last_streak_date: hoje,
        }).eq('user_id', session.user.id);
        stats.diamantes = nd;
        setTimeout(() => alert(msg), 1500);
      }
    }

    // Temas
    if (cosmetics?.unlocked_themes) localStorage.setItem('anigma_unlocked_themes', JSON.stringify(cosmetics.unlocked_themes));

    // Admin
    if (window.location.pathname.includes('admin/admin.html') && !profile.isAdmin) {
      window.location.href = prefix + 'index.html';
    }

    atualizarHeaderStats(stats?.diamantes || 0, stats?.pontos_totais || 0);
    if (btnLoja) btnLoja.style.display = 'inline-flex';
    if (btnSeasonPass) btnSeasonPass.style.display = 'inline-flex';
    if (hStats) hStats.style.display = 'flex';

    criarBotaoPerfil(profile, prefix);

  } catch (e) { console.error('Erro ao atualizar header:', e); }
}

window.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  await atualizarHeader(session);
  window.supabaseClient.auth.onAuthStateChange((_event, session) => atualizarHeader(session));
});