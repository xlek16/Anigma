// perfil.js — suporta perfil próprio + perfil público (?username=X)

document.addEventListener('DOMContentLoaded', async () => {
  const params       = new URLSearchParams(window.location.search);
  const targetUsername = params.get('username');
  const { data: { session } } = await window.supabaseClient.auth.getSession();

  // ── MODO PÚBLICO ──────────────────────────────────────────
  if (targetUsername) {
    // Verificar se é o próprio perfil
    let ownProfile = null;
    if (session) {
      const { data } = await window.supabaseClient.from('profiles').select('username').eq('id', session.user.id).single();
      ownProfile = data?.username;
    }
    // Se for o próprio, mostrar perfil normal (sem redirect)
    if (!session || ownProfile?.toLowerCase() !== targetUsername.toLowerCase()) {
      await carregarPerfilPublico(targetUsername);
      return;
    }
  }

  // ── MODO PRÓPRIO ──────────────────────────────────────────
  if (!session) { window.location.href = 'login.html'; return; }
  await carregarPerfilProprio(session);
});

// ════════════════════════════════════════════════════════════
// PERFIL PÚBLICO
// ════════════════════════════════════════════════════════════
async function carregarPerfilPublico(username) {
  // Esconder controlos de edição
  document.querySelectorAll('.perfil-edit-only, #avatarGrid, #nameStyleGrid, #achievementsGrid').forEach(el => { if (el) el.style.display = 'none'; });
  document.querySelector('.perfil-tabs')?.style && (document.querySelector('.perfil-tabs').style.display = 'none');

  const main = document.querySelector('.perfil-main');

  try {
    // Buscar perfil pelo username
    const { data: profileData, error } = await window.supabaseClient
      .from('profiles').select('id, username, avatar_url, equipped_title, equipped_name_style').eq('username', username).single();

    if (error || !profileData) {
      main.innerHTML = `<div style="color:white;text-align:center;padding:80px 20px;">
        <div style="font-size:3rem;margin-bottom:16px;">🔍</div>
        <h3>Utilizador não encontrado</h3>
        <p style="opacity:.6;">O utilizador "${username}" não existe.</p>
        <a href="index.html" style="color:#a78bfa;text-decoration:none;margin-top:16px;display:inline-block;">← Voltar ao início</a>
      </div>`;
      return;
    }

    const uid = profileData.id;

    const [statsRes, jogoDbRes, jogoJjkRes, spRes] = await Promise.all([
      window.supabaseClient.from('profile_stats').select('pontos_totais, level, current_streak, diamantes').eq('user_id', uid).single(),
      window.supabaseClient.from('game_state_db').select('pontos_db, tentativas_db').eq('user_id', uid).single(),
      window.supabaseClient.from('game_state_jjk').select('pontos_jjk, tentativas_jjk').eq('user_id', uid).single(),
      window.supabaseClient.from('season_pass').select('season_pass_premium, season_pass_level').eq('user_id', uid).single(),
    ]);

    const stats  = statsRes.data || {};
    const isPrem = spRes.data?.season_pass_premium || false;
    const spLv   = spRes.data?.season_pass_level   || 1;

    const totalPoints  = stats.pontos_totais || 0;
    const calcLevel    = pts => Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * pts) / 250)) / 2));
    const currentLevel = calcLevel(totalPoints);
    const baseLv       = 250 * currentLevel * (currentLevel - 1);
    const nextLv       = 250 * (currentLevel + 1) * currentLevel;
    const currentXP    = Math.max(0, totalPoints - baseLv);
    const xpNeeded     = Math.max(1, nextLv - baseLv);
    const pct          = Math.min(100, (currentXP / xpNeeded) * 100);

    const avatarUrl = profileData.avatar_url || 'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/animes/avatar_default.png';
    const avatarHtml = avatarUrl.endsWith('.webm') || avatarUrl.endsWith('.mp4')
      ? `<video src="${avatarUrl}" autoplay loop muted class="profile-avatar-img pub-avatar"></video>`
      : `<img src="${avatarUrl}" alt="Avatar" class="profile-avatar-img pub-avatar">`;

    let usernameHtml = `<span id="pUsername">${profileData.username}</span>`;

    // Banner premium
    const premBanner = isPrem ? `<div class="pub-prem-banner">★ Season Pass Premium · S1 Lv.${spLv}</div>` : '';

    main.innerHTML = `
      <div class="pub-profile-card">
        ${premBanner}
        <div class="profile-header-card">
          <div class="profile-avatar-wrap pub-avatar-wrap">${avatarHtml}</div>
          <div class="profile-info">
            <div class="pub-username-row">
              <span class="pub-username" id="pUsername">${profileData.username}</span>
              ${isPrem ? '<span class="pub-prem-tag">★ Premium</span>' : ''}
            </div>
            ${profileData.equipped_title ? `<div class="pub-title">${profileData.equipped_title}</div>` : ''}
            <div class="pub-level-row">
              <span class="pub-level-badge">LVL ${currentLevel}</span>
              <div class="pub-xp-bar"><div class="pub-xp-fill" style="width:${pct}%"></div></div>
              <span class="pub-xp-text">${currentXP.toLocaleString()} / ${xpNeeded.toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        <div class="pub-stats-grid">
          <div class="pub-stat-card">
            <div class="pub-stat-icon">⭐</div>
            <div class="pub-stat-val">${totalPoints.toLocaleString()}</div>
            <div class="pub-stat-label">Pontos Totais</div>
          </div>
          <div class="pub-stat-card">
            <div class="pub-stat-icon">🔥</div>
            <div class="pub-stat-val">${stats.current_streak || 0}</div>
            <div class="pub-stat-label">Streak Atual</div>
          </div>
          <div class="pub-stat-card">
            <div class="pub-stat-icon">🏆</div>
            <div class="pub-stat-val">${currentLevel}</div>
            <div class="pub-stat-label">Nível</div>
          </div>
          <div class="pub-stat-card">
            <div class="pub-stat-icon">🌟</div>
            <div class="pub-stat-val">${spLv}</div>
            <div class="pub-stat-label">Season Pass Lv.</div>
          </div>
        </div>

        <div class="pub-games-section">
          <h3 class="pub-section-title">🎮 Histórico de Jogos</h3>
          <div class="pub-games-grid">
            <div class="pub-game-card pub-db">
              <div class="pub-game-icon">🐉</div>
              <div class="pub-game-name">Dragon Ball</div>
              <div class="pub-game-stats">
                <div class="pub-game-stat"><span class="pub-game-stat-val">${jogoDbRes.data?.pontos_db ?? '—'}</span><span class="pub-game-stat-label">pts hoje</span></div>
                <div class="pub-game-stat"><span class="pub-game-stat-val">${jogoDbRes.data?.tentativas_db ?? '—'}</span><span class="pub-game-stat-label">tentativas</span></div>
              </div>
            </div>
            <div class="pub-game-card pub-jjk">
              <div class="pub-game-icon">⚡</div>
              <div class="pub-game-name">Jujutsu Kaisen</div>
              <div class="pub-game-stats">
                <div class="pub-game-stat"><span class="pub-game-stat-val">${jogoJjkRes.data?.pontos_jjk ?? '—'}</span><span class="pub-game-stat-label">pts hoje</span></div>
                <div class="pub-game-stat"><span class="pub-game-stat-val">${jogoJjkRes.data?.tentativas_jjk ?? '—'}</span><span class="pub-game-stat-label">tentativas</span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pub-back-row">
          <a href="ranking/ranking.html" class="pub-back-btn">← Voltar ao Ranking</a>
        </div>
      </div>

      <style>
        .pub-profile-card { max-width:700px; margin:0 auto; padding:0 0 40px; }
        .pub-prem-banner { background:linear-gradient(135deg,#1a0a3a,#0d1f3c); border:1px solid #c8a96e; border-radius:10px 10px 0 0; padding:10px 20px; text-align:center; color:#c8a96e; font-weight:700; font-size:.85rem; letter-spacing:.08em; }
        .profile-header-card { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:14px; padding:24px; display:flex; align-items:center; gap:20px; margin-bottom:20px; }
        .pub-avatar-wrap { flex-shrink:0; }
        .pub-avatar { width:80px; height:80px; border-radius:50%; object-fit:cover; border:3px solid rgba(255,255,255,.15); }
        .pub-username-row { display:flex; align-items:center; gap:10px; margin-bottom:6px; }
        .pub-username { font-size:1.4rem; font-weight:800; color:#fff; }
        .pub-prem-tag { background:linear-gradient(135deg,#c8a96e,#e8c97e); color:#1a0a00; font-size:.7rem; font-weight:800; padding:3px 8px; border-radius:20px; }
        .pub-title { color:#a78bfa; font-size:.85rem; font-weight:600; margin-bottom:10px; }
        .pub-level-row { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
        .pub-level-badge { background:linear-gradient(135deg,#7c3aed,#4f46e5); color:#fff; font-size:.78rem; font-weight:700; padding:3px 10px; border-radius:20px; white-space:nowrap; }
        .pub-xp-bar { flex:1; min-width:80px; height:6px; background:rgba(255,255,255,.1); border-radius:3px; overflow:hidden; }
        .pub-xp-fill { height:100%; background:linear-gradient(90deg,#7c3aed,#a78bfa); border-radius:3px; transition:width .6s; }
        .pub-xp-text { font-size:.72rem; color:rgba(255,255,255,.45); white-space:nowrap; }
        .pub-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:20px; }
        @media(max-width:500px){.pub-stats-grid{grid-template-columns:repeat(2,1fr);}}
        .pub-stat-card { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08); border-radius:12px; padding:16px 10px; text-align:center; }
        .pub-stat-icon { font-size:1.4rem; margin-bottom:6px; }
        .pub-stat-val { font-size:1.3rem; font-weight:800; color:#fff; }
        .pub-stat-label { font-size:.72rem; color:rgba(255,255,255,.45); margin-top:3px; }
        .pub-games-section { margin-bottom:24px; }
        .pub-section-title { font-size:1rem; font-weight:700; color:rgba(255,255,255,.7); margin-bottom:12px; }
        .pub-games-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        @media(max-width:400px){.pub-games-grid{grid-template-columns:1fr;}}
        .pub-game-card { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08); border-radius:12px; padding:18px; }
        .pub-db { border-color:rgba(255,165,0,.2); }
        .pub-jjk { border-color:rgba(139,92,246,.2); }
        .pub-game-icon { font-size:1.6rem; margin-bottom:6px; }
        .pub-game-name { font-weight:700; color:#fff; font-size:.9rem; margin-bottom:12px; }
        .pub-game-stats { display:flex; gap:16px; }
        .pub-game-stat { display:flex; flex-direction:column; }
        .pub-game-stat-val { font-size:1.2rem; font-weight:800; color:#fff; }
        .pub-game-stat-label { font-size:.7rem; color:rgba(255,255,255,.4); }
        .pub-back-row { text-align:center; margin-top:8px; }
        .pub-back-btn { color:rgba(255,255,255,.5); font-size:.85rem; text-decoration:none; transition:color .2s; }
        .pub-back-btn:hover { color:#a78bfa; }
      </style>
    `;

    // Aplicar estilo de nome
    const usernameEl = document.getElementById('pUsername');
    if (usernameEl && profileData.equipped_name_style && typeof NAME_STYLES !== 'undefined' && NAME_STYLES[profileData.equipped_name_style]) {
      const s = NAME_STYLES[profileData.equipped_name_style];
      if (s.style)     usernameEl.style.cssText = s.style;
      if (s.className) usernameEl.classList.add(s.className);
    }

  } catch (e) {
    console.error('Erro ao carregar perfil público:', e);
  }
}

// ════════════════════════════════════════════════════════════
// PERFIL PRÓPRIO
// ════════════════════════════════════════════════════════════
async function carregarPerfilProprio(session) {
  const [profileRes, statsRes, cosmeticsRes, jogoDbRes, jogoJjkRes, spRes] = await Promise.all([
    window.supabaseClient.from('profiles').select('*').eq('id', session.user.id).single(),
    window.supabaseClient.from('profile_stats').select('*').eq('user_id', session.user.id).single(),
    window.supabaseClient.from('profile_cosmetics').select('*').eq('user_id', session.user.id).single(),
    window.supabaseClient.from('game_state_db').select('pontos_db,tentativas_db').eq('user_id', session.user.id).single(),
    window.supabaseClient.from('game_state_jjk').select('pontos_jjk,tentativas_jjk').eq('user_id', session.user.id).single(),
    window.supabaseClient.from('season_pass').select('season_pass_premium').eq('user_id', session.user.id).single(),
  ]);

  if (!profileRes.data) {
    document.querySelector('.perfil-main').innerHTML = '<div style="color:white;text-align:center;padding-top:50px;"><h3>Erro ao Carregar Perfil</h3></div>';
    return;
  }

  const profile = {
    ...profileRes.data, ...statsRes.data, ...cosmeticsRes.data,
    pontos_db:         jogoDbRes.data?.pontos_db         ?? '--',
    tentativas_db:     jogoDbRes.data?.tentativas_db     ?? '--',
    pontos_jjk:        jogoJjkRes.data?.pontos_jjk       ?? '--',
    tentativas_jjk:    jogoJjkRes.data?.tentativas_jjk   ?? '--',
    season_pass_premium: spRes.data?.season_pass_premium ?? false,
  };

  if (typeof injetarBannerPerfil === 'function') injetarBannerPerfil(profile.season_pass_premium);

  const usernameEl = document.getElementById('pUsername');
  usernameEl.textContent = profile.username || 'Sem nome';
  const equippedStyle = profile.equipped_name_style || null;
  if (equippedStyle && typeof NAME_STYLES !== 'undefined' && NAME_STYLES[equippedStyle]) {
    const s = NAME_STYLES[equippedStyle];
    if (s.style)     usernameEl.style.cssText = s.style;
    if (s.className) usernameEl.classList.add(s.className);
    if (s.dataText) { usernameEl.setAttribute('data-text-effect', ''); usernameEl.setAttribute('data-text', usernameEl.textContent); }
  }

  if (profile.equipped_title) {
    const titleEl = document.getElementById('pTitle');
    if (titleEl) { titleEl.textContent = profile.equipped_title; titleEl.style.display = 'inline-block'; }
  }

  const totalPoints        = profile.pontos_totais || 0;
  const calcLevel          = pts => Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * pts) / 250)) / 2));
  const currentLevel       = calcLevel(totalPoints);
  const currentLevelBaseXP = 250 * currentLevel * (currentLevel - 1);
  const nextLevelXP        = 250 * (currentLevel + 1) * currentLevel;
  const xpNeeded           = Math.max(1, nextLevelXP - currentLevelBaseXP);
  const currentXP          = Math.max(0, totalPoints - currentLevelBaseXP);
  const progressPct        = Math.min(100, (currentXP / xpNeeded) * 100);

  document.getElementById('pLevelFill').style.width  = `${progressPct}%`;
  document.getElementById('pCurrentXP').textContent  = currentXP.toLocaleString();
  document.getElementById('pNextXP').textContent     = xpNeeded.toLocaleString();
  document.getElementById('pNextLevel').textContent  = currentLevel + 1;
  document.getElementById('pLevel').textContent      = currentLevel;
  document.getElementById('pPoints').textContent     = totalPoints.toLocaleString();
  document.getElementById('pDiamonds').textContent   = (profile.diamantes || 0).toLocaleString();
  document.getElementById('pStreak').textContent     = profile.current_streak || 0;
  document.getElementById('pDbPoints').textContent    = profile.pontos_db;
  document.getElementById('pDbAttempts').textContent  = profile.tentativas_db;
  document.getElementById('pJjkPoints').textContent   = profile.pontos_jjk;
  document.getElementById('pJjkAttempts').textContent = profile.tentativas_jjk;

  const currentAvatar = profile.avatar_url || 'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/animes/avatar_default.png';
  const avatarWrap = document.querySelector('.profile-avatar-wrap');
  avatarWrap.innerHTML = currentAvatar.endsWith('.webm') || currentAvatar.endsWith('.mp4')
    ? `<video src="${currentAvatar}" autoplay loop muted class="profile-avatar-img"></video>`
    : `<img src="${currentAvatar}" alt="Avatar" class="profile-avatar-img">`;

  const avatarContainer = document.getElementById('avatarGrid');
  avatarContainer.innerHTML = '';
  let unlocked = Array.isArray(profile.unlocked_avatars) ? profile.unlocked_avatars : [];
  const defaultAvatar = 'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/animes/avatar_default.png';
  if (!unlocked.includes(defaultAvatar)) unlocked = [defaultAvatar, ...unlocked];

  if (typeof AVATARES !== 'undefined') {
    ['impossible','hard','medium','easy'].forEach(rarity => {
      const section = document.createElement('div'); section.className = 'rarity-section';
      const config = RARITY_CONFIG[rarity];
      section.innerHTML = `<h3 class="rarity-title" style="color:${config.color}">${config.label}</h3>`;
      const grid = document.createElement('div'); grid.className = 'avatars-grid';
      AVATARES[rarity].forEach(url => {
        const isUnlocked = unlocked.includes(url);
        const div = document.createElement('div');
        div.className = `avatar-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        if (url === currentAvatar) div.classList.add('equipped');
        const mediaHtml = url.endsWith('.webm') || url.endsWith('.mp4')
          ? `<video src="${url}" autoplay loop muted style="width:100%;height:100%;object-fit:cover;"></video>`
          : `<img src="${url}" alt="Avatar">`;
        div.innerHTML = mediaHtml + (isUnlocked ? '' : '<div class="lock-icon">&#128274;</div>');
        if (isUnlocked) div.onclick = (e) => equiparAvatar(url, e.currentTarget);
        grid.appendChild(div);
      });
      section.appendChild(grid); avatarContainer.appendChild(section);
    });
  }

  renderNameStyles(profile);
  if (typeof renderAchievements === 'function') renderAchievements(profile);
  if (typeof verificarConquistas === 'function') await verificarConquistas(profile);

  const toggleBtn = document.getElementById('toggleStatsBtn'), statsContainer = document.getElementById('statsContainer');
  if (toggleBtn && statsContainer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = statsContainer.classList.contains('open');
      statsContainer.classList.toggle('open');
      toggleBtn.innerHTML = isOpen ? '📊 Ver Estatísticas' : '🔼 Ocultar Estatísticas';
    });
  }
}

// ── Equipar avatar ────────────────────────────────────────────
async function equiparAvatar(url, clickedElement) {
  if (clickedElement.classList.contains('equipped')) return;
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) return;
  document.querySelector('.avatar-item.equipped')?.classList.remove('equipped');
  clickedElement.classList.add('equipped');
  try {
    const { error } = await window.supabaseClient.from('profiles').update({ avatar_url: url }).eq('id', session.user.id);
    if (error) throw error;
    document.querySelector('.profile-avatar-wrap').innerHTML = url.endsWith('.webm') || url.endsWith('.mp4')
      ? `<video src="${url}" autoplay loop muted class="profile-avatar-img"></video>`
      : `<img src="${url}" alt="Avatar" class="profile-avatar-img">`;
    const oldHeaderAvatar = document.getElementById('headerUserAvatar');
    if (oldHeaderAvatar) {
      const el = url.endsWith('.webm') || url.endsWith('.mp4')
        ? Object.assign(document.createElement('video'), { autoplay:true, loop:true, muted:true })
        : document.createElement('img');
      el.id = 'headerUserAvatar'; el.src = url;
      if (el.tagName === 'IMG') el.alt = 'avatar';
      el.style.cssText = 'width:28px;height:28px;border-radius:50%;object-fit:cover;';
      oldHeaderAvatar.replaceWith(el);
    }
  } catch (e) { console.error('Erro ao equipar avatar:', e); alert('Não foi possível equipar o avatar.'); }
}

// ── Equipar título ────────────────────────────────────────────
async function equiparTitulo(titulo, clickedElement) {
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) return;
  document.querySelector('.title-item.equipped')?.classList.remove('equipped');
  if (clickedElement) clickedElement.classList.add('equipped');
  try {
    const { error } = await window.supabaseClient.from('profiles').update({ equipped_title: titulo }).eq('id', session.user.id);
    if (error) throw error;
    const titleEl = document.getElementById('pTitle');
    if (titleEl) { titleEl.textContent = titulo; titleEl.style.display = 'inline-block'; }
    document.querySelectorAll('.btn-equip-title').forEach(btn => { btn.textContent = 'Equipar Título'; btn.disabled = false; btn.classList.remove('equipped'); });
    if (clickedElement) { clickedElement.textContent = 'Equipado'; clickedElement.disabled = true; clickedElement.classList.add('equipped'); }
  } catch (e) { console.error('Erro ao equipar título:', e); }
}

// ── Render estilos de nome ────────────────────────────────────
function renderNameStyles(profile) {
  const container = document.getElementById('nameStyleGrid');
  if (!container || typeof NAME_STYLES === 'undefined') return;
  container.innerHTML = '';
  const unlocked = Array.isArray(profile.unlocked_name_styles) ? profile.unlocked_name_styles : [];
  const equipped  = profile.equipped_name_style || null;
  const defaultCard = document.createElement('div');
  defaultCard.className = `name-style-item unlocked${!equipped ? ' equipped' : ''}`;
  defaultCard.innerHTML = `<div class="name-style-preview">Username</div><div class="name-style-info"><h4>Padrão</h4><p>Visual simples e clássico.</p></div>`;
  defaultCard.onclick = (e) => equiparNameStyle(null, e.currentTarget);
  container.appendChild(defaultCard);
  Object.values(NAME_STYLES).forEach(style => {
    const isUnlocked = unlocked.includes(style.id), isEquipped = equipped === style.id;
    const card = document.createElement('div');
    card.className = `name-style-item ${isUnlocked ? 'unlocked' : 'locked'}${isUnlocked && isEquipped ? ' equipped' : ''}`;
    card.innerHTML = `<div class="name-style-preview ${style.className||''}" style="${style.style||''}" ${style.dataText?'data-text-effect':''}>Username</div><div class="name-style-info"><h4>${style.name}</h4><p>${style.rarity}</p></div>${isUnlocked ? '' : '<div class="lock-icon">&#128274;</div>'}`;
    if (isUnlocked) card.onclick = (e) => equiparNameStyle(style.id, e.currentTarget);
    container.appendChild(card);
  });
}

// ── Equipar estilo de nome ────────────────────────────────────
async function equiparNameStyle(styleId, clickedElement) {
  if (clickedElement.classList.contains('equipped')) return;
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) return;
  document.querySelectorAll('.name-style-item.equipped').forEach(el => el.classList.remove('equipped'));
  clickedElement.classList.add('equipped');
  try {
    const { error } = await window.supabaseClient.from('profiles').update({ equipped_name_style: styleId }).eq('id', session.user.id);
    if (error) throw error;
    const usernameEl = document.getElementById('pUsername');
    if (usernameEl) {
      usernameEl.style.cssText = ''; usernameEl.removeAttribute('data-text-effect'); usernameEl.removeAttribute('data-text');
      if (typeof NAME_STYLES !== 'undefined') Object.values(NAME_STYLES).forEach(s => { if (s.className) usernameEl.classList.remove(...s.className.split(' ').filter(Boolean)); });
      if (styleId && NAME_STYLES[styleId]) {
        const s = NAME_STYLES[styleId];
        if (s.style) usernameEl.style.cssText = s.style;
        if (s.className) usernameEl.classList.add(...s.className.split(' ').filter(Boolean));
        if (s.dataText) { usernameEl.setAttribute('data-text-effect',''); usernameEl.setAttribute('data-text', usernameEl.textContent); }
      }
    }
  } catch (e) { console.error('Erro ao equipar estilo:', e); }
}

// ── Render conquistas ─────────────────────────────────────────
function renderAchievements(profile) {
  const container = document.getElementById('achievementsGrid');
  if (!container || typeof ACHIEVEMENTS === 'undefined') return;
  container.innerHTML = '';
  const unlocked = profile.unlocked_achievements || [], equippedTitle = profile.equipped_title;
  Object.entries(ACHIEVEMENTS).forEach(([id, ach]) => {
    const isUnlocked = unlocked.includes(id);
    const card = document.createElement('div'); card.className = `ach-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    let rewardText = '';
    if (ach.reward.diamonds) rewardText += `💎 ${ach.reward.diamonds}`;
    if (ach.reward.title)    rewardText += ` 🏷️ "${ach.reward.title}"`;
    card.innerHTML = `<div class="ach-icon">🏆</div><div class="ach-info"><h4 class="ach-name">${ach.name}</h4><p class="ach-desc">${ach.description}</p><div class="ach-reward">${rewardText || 'Sem recompensa'}</div></div>${isUnlocked ? '' : '<div class="ach-lock-overlay"><span>🔒</span></div>'}`;
    if (isUnlocked && ach.reward.title) {
      const btnWrap = document.createElement('div'); btnWrap.className = 'ach-button-wrap';
      const equipBtn = document.createElement('button'); equipBtn.className = 'btn-equip-title';
      if (equippedTitle === ach.reward.title) { equipBtn.textContent = 'Equipado'; equipBtn.disabled = true; equipBtn.classList.add('equipped'); }
      else equipBtn.textContent = 'Equipar Título';
      equipBtn.onclick = (e) => { e.stopPropagation(); equiparTitulo(ach.reward.title, equipBtn); };
      btnWrap.appendChild(equipBtn); card.appendChild(btnWrap);
    }
    container.appendChild(card);
  });
}