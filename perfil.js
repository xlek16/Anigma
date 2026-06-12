// perfil.js — suporta perfil próprio + perfil público (?username=X)

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const targetUsername = params.get('username');
  const { data: { session } } = await window.supabaseClient.auth.getSession();

  // ── MODO PÚBLICO ──────────────────────────────────────────
  if (targetUsername) {
    let ownProfile = null;
    if (session) {
      const { data } = await window.supabaseClient.from('profiles').select('username').eq('id', session.user.id).single();
      ownProfile = data?.username;
    }
    if (!session || ownProfile?.toLowerCase() !== targetUsername.toLowerCase()) {
      await carregarPerfilPublico(targetUsername);
      return;
    }
  }

  // FIX #6: mapeamento correto de todos os IDs de tab
  window.mudarTab = (tabId, btn) => {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    // Mapa: valor do onclick → id do elemento no HTML
    const panelMap = {
      'avatars': 'panel-avatars',
      'banners': 'panel-banners',
      'nameStyles': 'nameStyles',       // id="nameStyles" no HTML
      'conquistas': 'panel-conquistas',
    };

    const panelId = panelMap[tabId] || tabId;
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
    if (btn) btn.classList.add('active');
  };

  // ── MODO PRÓPRIO ──────────────────────────────────────────
  if (!session) { window.location.href = 'register.html'; return; }
  await carregarPerfilProprio(session);
});

// ════════════════════════════════════════════════════════════
// PERFIL PÚBLICO
// ════════════════════════════════════════════════════════════
async function carregarPerfilPublico(username) {
  // Esconder tabs e controlos de edição
  document.querySelector('.perfil-tabs-nav')?.style &&
    (document.querySelector('.perfil-tabs-nav').style.display = 'none');
  document.querySelectorAll('.tab-panel').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.perfil-edit-only').forEach(el => el.style.display = 'none');
  document.querySelector('.stats-toggle-wrap')?.style &&
    (document.querySelector('.stats-toggle-wrap').style.display = 'none');

  const main = document.querySelector('.perfil-main');

  try {
    const { data: profileData, error } = await window.supabaseClient
      .from('profiles')
      .select('id, username, avatar_url, equipped_title, equipped_name_style')
      .eq('username', username)
      .single();

    if (error || !profileData) throw error || new Error('Perfil não encontrado');

    const uid = profileData.id;

    const [cosmeticsRes, pStatsRes, statsRes, jogoDbRes, jogoJjkRes, spRes] = await Promise.all([
      window.supabaseClient.from('profile_cosmetics').select('banner_url').eq('user_id', uid).single(),
      window.supabaseClient.from('profile_stats').select('plano_pago').eq('user_id', uid).single(),
      window.supabaseClient.from('profile_stats').select('pontos_totais, level, current_streak, diamantes').eq('user_id', uid).single(),
      window.supabaseClient.from('game_state_db').select('pontos_db, tentativas_db').eq('user_id', uid).single(),
      window.supabaseClient.from('game_state_jjk').select('pontos_jjk, tentativas_jjk').eq('user_id', uid).single(),
      window.supabaseClient.from('season_pass').select('season_pass_premium, season_pass_level').eq('user_id', uid).single(),
    ]);

    const bannerUrl = cosmeticsRes?.data?.banner_url || null;
    const isPrem = spRes.data?.season_pass_premium || false;
    const spLv = spRes.data?.season_pass_level || 1;
    const stats = statsRes.data || {};
    profileData.plano_pago = pStatsRes?.data?.plano_pago ?? false;

    const totalPoints = stats.pontos_totais || 0;
    const calcLevel = pts => Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * pts) / 250)) / 2));
    const currentLevel = calcLevel(totalPoints);
    const baseLv = 250 * currentLevel * (currentLevel - 1);
    const nextLv = 250 * (currentLevel + 1) * currentLevel;
    const currentXP = Math.max(0, totalPoints - baseLv);
    const xpNeeded = Math.max(1, nextLv - baseLv);
    const pct = Math.min(100, (currentXP / xpNeeded) * 100);

    const avatarUrl = profileData.avatar_url || 'https://xxpmvxcjnqwzrsbnqdsg.supabase.co/storage/v1/object/public/avatares/bulma.webp';
    const avatarHtml = avatarUrl.endsWith('.webm') || avatarUrl.endsWith('.mp4')
      ? `<video src="${avatarUrl}" autoplay loop muted class="profile-avatar-img pub-avatar"></video>`
      : `<img src="${avatarUrl}" alt="Avatar" class="profile-avatar-img pub-avatar">`;

    const premIcon = profileData.plano_pago ? '<span class="premium-icon-name">👑</span> ' : '';

    // FIX #5: renderizarBanner ANTES de modificar o DOM, e usar os elementos existentes
    // em vez de recriar tudo com innerHTML
    renderizarBanner(bannerUrl, isPrem);

    // Preencher elementos existentes no HTML
    document.querySelector('.profile-avatar-wrap').innerHTML = avatarHtml;

    const usernameEl = document.getElementById('pUsername');
    if (usernameEl) usernameEl.innerHTML = `${premIcon}${profileData.username}`;

    const titleEl = document.getElementById('pTitle');
    if (titleEl) {
      if (profileData.equipped_title) {
        titleEl.textContent = profileData.equipped_title;
        titleEl.style.display = 'inline-block';
      } else {
        titleEl.style.display = 'none';
      }
    }

    const levelFill = document.getElementById('pLevelFill');
    if (levelFill) levelFill.style.width = `${pct}%`;

    const curXPEl = document.getElementById('pCurrentXP');
    const nxtXPEl = document.getElementById('pNextXP');
    const lvEl = document.getElementById('pLevel');
    const nxtLvEl = document.getElementById('pNextLevel');
    if (curXPEl) curXPEl.textContent = currentXP.toLocaleString();
    if (nxtXPEl) nxtXPEl.textContent = xpNeeded.toLocaleString();
    if (lvEl) lvEl.textContent = currentLevel;
    if (nxtLvEl) nxtLvEl.textContent = currentLevel + 1;

    // Stats container público (abrir automaticamente no modo público)
    const statsContainer = document.getElementById('statsContainer');
    if (statsContainer) statsContainer.classList.add('open');

    // Helper — preenche stats de forma segura
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('pPoints', totalPoints.toLocaleString());
    setEl('pStreak', stats.current_streak || 0);
    setEl('pDbPoints', jogoDbRes.data?.pontos_db ?? '—');
    setEl('pDbAttempts', jogoDbRes.data?.tentativas_db ?? '—');
    setEl('pJjkPoints', jogoJjkRes.data?.pontos_jjk ?? '—');
    setEl('pJjkAttempts', jogoJjkRes.data?.tentativas_jjk ?? '—');
    setEl('pSpLevel', spLv);

    // Estilo de nome
    if (usernameEl && profileData.equipped_name_style && typeof NAME_STYLES !== 'undefined' && NAME_STYLES[profileData.equipped_name_style]) {
      const s = NAME_STYLES[profileData.equipped_name_style];
      if (s.style) usernameEl.style.cssText = s.style;
      if (s.className) usernameEl.classList.add(s.className);
      if (s.dataText) { usernameEl.setAttribute('data-text-effect', ''); usernameEl.setAttribute('data-text', usernameEl.textContent); }
    }

    // Botão voltar
    const backRow = document.createElement('div');
    backRow.style.cssText = 'text-align:center;margin-top:24px;';
    backRow.innerHTML = `<a href="ranking/ranking.html" style="color:rgba(255,255,255,.5);font-size:.85rem;text-decoration:none;">← Voltar ao Ranking</a>`;
    main.appendChild(backRow);

  } catch (e) {
    console.error('Erro ao carregar perfil público:', e);
    document.querySelector('.perfil-main').innerHTML = `
      <div style="color:white;text-align:center;padding:80px 20px;">
        <div style="font-size:3rem;margin-bottom:16px;">🔍</div>
        <h3>Utilizador não encontrado</h3>
        <p style="opacity:.6;">O utilizador "${username}" não existe.</p>
        <a href="index.html" style="color:#a78bfa;text-decoration:none;margin-top:16px;display:inline-block;">← Voltar ao início</a>
      </div>`;
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
    window.supabaseClient.from('season_pass').select('season_pass_premium, season_pass_level').eq('user_id', session.user.id).single(),
  ]);

  if (!profileRes.data) {
    document.querySelector('.perfil-main').innerHTML = '<div style="color:white;text-align:center;padding-top:50px;"><h3>Erro ao Carregar Perfil</h3></div>';
    return;
  }

  const profile = {
    ...profileRes.data,
    ...statsRes.data,
    ...cosmeticsRes.data,
    pontos_db: jogoDbRes.data?.pontos_db ?? '--',
    tentativas_db: jogoDbRes.data?.tentativas_db ?? '--',
    pontos_jjk: jogoJjkRes.data?.pontos_jjk ?? '--',
    tentativas_jjk: jogoJjkRes.data?.tentativas_jjk ?? '--',
    season_pass_premium: spRes.data?.season_pass_premium ?? false,
    season_pass_level: spRes.data?.season_pass_level ?? 1,
    plano_pago: statsRes.data?.plano_pago ?? false,
  };

  console.log('[Perfil] Dados carregados:', profile);
  console.log('[Perfil] URL do Banner persistida:', profile.banner_url);

  // Mostrar controlos de edição (usar classe em vez de inline style)
  document.querySelectorAll('.perfil-edit-only').forEach(el => {
    el.classList.add('edit-visible');
    el.style.removeProperty('display');
  });

  // FIX #5: renderizar banner AGORA (elementos já existem no HTML)
  renderizarBanner(profile.banner_url, profile.season_pass_premium);
  renderBannersGrid(profile);

  // Listener upload de ficheiro
  const bannerInput = document.getElementById('bannerInput');
  if (bannerInput) bannerInput.onchange = e => uploadBanner(e.target.files[0], profile.plano_pago);

  // Listener link externo
  const btnExternal = document.getElementById('btnExternalBanner');
  if (btnExternal) {
    btnExternal.onclick = () => {
      const url = prompt('Cole aqui o LINK DIRETO da imagem ou GIF.\nExemplo: https://site.com/imagem.png ou .gif');
      if (url && url.trim()) equiparBannerPorURL(url.trim(), profile.plano_pago);
    };
  }

  // Username + estilo
  const usernameEl = document.getElementById('pUsername');
  const premiumTag = profile.plano_pago ? '<span class="premium-icon-name" title="Anigma Premium">👑</span> ' : '';
  usernameEl.innerHTML = `${premiumTag}${profile.username || 'Sem nome'}`;

  const equippedStyle = profile.equipped_name_style || null;
  if (equippedStyle && typeof NAME_STYLES !== 'undefined' && NAME_STYLES[equippedStyle]) {
    const s = NAME_STYLES[equippedStyle];
    if (s.style) usernameEl.style.cssText = s.style;
    if (s.className) usernameEl.classList.add(s.className);
    if (s.dataText) { usernameEl.setAttribute('data-text-effect', ''); usernameEl.setAttribute('data-text', usernameEl.textContent); }
  }

  // Título
  if (profile.equipped_title) {
    const titleEl = document.getElementById('pTitle');
    if (titleEl) { titleEl.textContent = profile.equipped_title; titleEl.style.display = 'inline-block'; }
  }

  // Level / XP
  const totalPoints = profile.pontos_totais || 0;
  const calcLevel = pts => Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * pts) / 250)) / 2));
  const currentLevel = calcLevel(totalPoints);
  const currentLevelBaseXP = 250 * currentLevel * (currentLevel - 1);
  const nextLevelXP = 250 * (currentLevel + 1) * currentLevel;
  const xpNeeded = Math.max(1, nextLevelXP - currentLevelBaseXP);
  const currentXP = Math.max(0, totalPoints - currentLevelBaseXP);
  const progressPct = Math.min(100, (currentXP / xpNeeded) * 100);

  document.getElementById('pLevelFill').style.width = `${progressPct}%`;
  document.getElementById('pCurrentXP').textContent = currentXP.toLocaleString();
  document.getElementById('pNextXP').textContent = xpNeeded.toLocaleString();
  document.getElementById('pNextLevel').textContent = currentLevel + 1;
  document.getElementById('pLevel').textContent = currentLevel;
  document.getElementById('pPoints').textContent = totalPoints.toLocaleString();
  document.getElementById('pDiamonds').textContent = (profile.diamantes || 0).toLocaleString();
  document.getElementById('pStreak').textContent = profile.current_streak || 0;
  document.getElementById('pDbPoints').textContent = profile.pontos_db;
  document.getElementById('pDbAttempts').textContent = profile.tentativas_db;
  document.getElementById('pJjkPoints').textContent = profile.pontos_jjk;
  document.getElementById('pJjkAttempts').textContent = profile.tentativas_jjk;

  const spLevelEl = document.getElementById('pSpLevel');
  if (spLevelEl) spLevelEl.textContent = profile.season_pass_level;

  // Avatar atual
  const currentAvatar = profile.avatar_url || 'https://xxpmvxcjnqwzrsbnqdsg.supabase.co/storage/v1/object/public/avatares/bulma.webp';
  const avatarWrap = document.querySelector('.profile-avatar-wrap');
  avatarWrap.innerHTML = currentAvatar.endsWith('.webm') || currentAvatar.endsWith('.mp4')
    ? `<video src="${currentAvatar}" autoplay loop muted class="profile-avatar-img"></video>`
    : `<img src="${currentAvatar}" alt="Avatar" class="profile-avatar-img">`;

  // Grid de avatares
  const avatarContainer = document.getElementById('avatarGrid');
  avatarContainer.innerHTML = '';
  let unlocked = Array.isArray(profile.unlocked_avatars) ? profile.unlocked_avatars : [];
  const defaultAvatar = 'https://xxpmvxcjnqwzrsbnqdsg.supabase.co/storage/v1/object/public/avatares/bulma.webp';
  if (!unlocked.includes(defaultAvatar)) unlocked = [defaultAvatar, ...unlocked];

  if (typeof AVATARES !== 'undefined') {
    ['impossible', 'hard', 'medium', 'easy'].forEach(rarity => {
      const section = document.createElement('div');
      section.className = 'rarity-section';
      const config = RARITY_CONFIG[rarity];
      section.innerHTML = `<h3 class="rarity-title" style="color:${config.color}">${config.label}</h3>`;
      const grid = document.createElement('div');
      grid.className = 'avatars-grid';
      AVATARES[rarity].forEach(url => {
        const isUnlocked = unlocked.includes(url);
        const div = document.createElement('div');
        div.className = `avatar-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        if (url === currentAvatar) div.classList.add('equipped');
        const mediaHtml = url.endsWith('.webm') || url.endsWith('.mp4')
          ? `<video src="${url}" autoplay loop muted style="width:100%;height:100%;object-fit:cover;"></video>`
          : `<img src="${url}" alt="Avatar">`;
        div.innerHTML = mediaHtml + (isUnlocked ? '' : '<div class="lock-icon">&#128274;</div>');
        if (isUnlocked) div.onclick = e => equiparAvatar(url, e.currentTarget);
        grid.appendChild(div);
      });
      section.appendChild(grid);
      avatarContainer.appendChild(section);
    });
  }

  renderNameStyles(profile);
  if (typeof renderAchievements === 'function') renderAchievements(profile);
  if (typeof verificarConquistas === 'function') await verificarConquistas(profile);

  // Toggle stats
  const toggleBtn = document.getElementById('toggleStatsBtn');
  const statsContainer = document.getElementById('statsContainer');
  if (toggleBtn && statsContainer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = statsContainer.classList.contains('open');
      statsContainer.classList.toggle('open');
      toggleBtn.innerHTML = isOpen ? '📊 Ver Estatísticas' : '🔼 Ocultar Estatísticas';
    });
  }
}

// ════════════════════════════════════════════════════════════
// BANNER
// ════════════════════════════════════════════════════════════

// FIX #5: renderizarBanner usa apenas elementos já existentes no HTML
// Nunca recria o DOM — só preenche o #bannerContent
function renderizarBanner(url, isPremium) {
  const container = document.getElementById('bannerContent');
  if (!container) return;
  console.log('[Banner] Renderizar URL:', url);

  if (url && url.trim()) {
    const trimmedUrl = url.trim();

    // Banner animado do Season Pass
    if (trimmedUrl === 'sp_frieren_banner') {
      if (typeof injetarBannerPerfil === 'function') {
        injetarBannerPerfil(isPremium);
        const spBanner = document.getElementById('spPremiumBanner');
        if (spBanner) {
          container.innerHTML = '';
          container.appendChild(spBanner);
          spBanner.style.cssText = 'display:block;margin:0;border:none;border-radius:0;width:100%;height:100%;';
        }
      }
      return;
    }

    // Imagem ou GIF
    container.innerHTML = ''; // Limpar antes de adicionar
    const img = document.createElement('img');
    img.src = trimmedUrl;
    img.alt = "Banner";
    img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
    img.onerror = () => {
      console.error('[Banner] Falha ao carregar imagem:', trimmedUrl);
      container.innerHTML = '<div class="banner-placeholder">ERRO AO CARREGAR</div>';
    };
    container.appendChild(img);

    // Ocultar banner do season pass se existir no DOM (fora do content)
    const spBanner = document.getElementById('spPremiumBanner');
    if (spBanner && spBanner.parentElement !== container) spBanner.style.display = 'none';

  } else {
    // Sem banner → placeholder
    container.innerHTML = '<div class="banner-placeholder">ANIGMA</div>';
  }
}

async function uploadBanner(file, isPlanoPago) {
  if (!file) return;

  const isGif = file.name.toLowerCase().endsWith('.gif');
  if (isGif && !isPlanoPago) {
    alert('⚠️ Apenas utilizadores com Plano Pago podem usar GIFs no banner!');
    window.location.href = 'loja/loja.html';
    return;
  }

  const maxSizeBytes = 2 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    alert('❌ O ficheiro é demasiado grande! O limite é de 2MB. Tenta usar um link externo se for maior.');
    return;
  }

  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) return;

  const btn = document.querySelector('.btn-edit-banner');
  const originalHtml = btn?.innerHTML;
  if (btn) { btn.innerHTML = '<span>⏳ A carregar...</span>'; btn.style.pointerEvents = 'none'; }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${session.user.id}_banner_${Date.now()}.${fileExt}`;
    const filePath = `banners/${fileName}`;

    const { error: uploadError } = await window.supabaseClient.storage
      .from('profiles_assets').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = window.supabaseClient.storage
      .from('profiles_assets').getPublicUrl(filePath);

    const { error: dbError } = await window.supabaseClient
      .from('profile_cosmetics').update({ banner_url: publicUrl }).eq('user_id', session.user.id);
    if (dbError) throw dbError;

    renderizarBanner(publicUrl, isPlanoPago);
    alert('✅ Banner atualizado com sucesso!');

  } catch (e) {
    console.error('Erro no upload do banner:', e);
    alert('❌ Erro ao atualizar o banner. Verifica se o bucket "profiles_assets" existe no Supabase.');
  } finally {
    if (btn) { btn.innerHTML = originalHtml; btn.style.pointerEvents = 'auto'; }
  }
}

async function equiparBannerPorURL(url, isPlanoPago) {
  if (!url || !url.trim()) return;

  const trimmedUrl = url.trim();
  const cleanUrl = trimmedUrl.split('?')[0].toLowerCase();
  const isGif = cleanUrl.endsWith('.gif');

  console.log('[Banner] Equipar link externo:', { original: url, clean: cleanUrl, isGif, premium: isPlanoPago });

  if (isGif && !isPlanoPago) {
    alert('⚠️ Apenas utilizadores com Plano Pago podem usar GIFs no banner!');
    window.location.href = 'loja/loja.html';
    return;
  }

  // Validação básica de URL
  try { new URL(trimmedUrl); } catch {
    alert('❌ O link que introduziste não é válido. Certifica-te que começa por https://');
    return;
  }

  // Se não termina em extensão comum, avisar mas deixar tentar
  const commonExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const hasExt = commonExts.some(ext => cleanUrl.endsWith(ext));

  // Deteção de links de visualização comuns (não diretos)
  let hint = "";
  if (cleanUrl.includes('tenor.com/view') || cleanUrl.includes('giphy.com/gifs')) {
    hint = "\n\n💡 Parece que estás a usar um link de página. Tenta clicar com o botão direito no GIF e escolher 'Copiar endereço da imagem'.";
  }

  if (!hasExt) {
    const prosseguir = confirm('⚠️ O link não parece terminar numa imagem direta (ex: .png ou .gif).' + hint + '\n\nQueres tentar aplicar mesmo assim?');
    if (!prosseguir) return;
  }

  try {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (!session) { alert('❌ Não estás autenticado!'); return; }

    console.log('[Banner] Guardando no Supabase...', trimmedUrl);

    // upsert garante que cria a linha se não existir
    const { error } = await window.supabaseClient
      .from('profile_cosmetics')
      .upsert({ user_id: session.user.id, banner_url: trimmedUrl }, { onConflict: 'user_id' });

    if (error) {
      console.error('[Banner] Erro Supabase:', error);
      throw error;
    }

    console.log('[Banner] Guardado com sucesso. Atualizando UI e recarregando...');

    // Atualizar UI antes do reload para feedback visual imediato
    renderizarBanner(trimmedUrl, isPlanoPago);

    alert('✅ Banner aplicado com sucesso!\nO teu perfil vai recarregar para salvar permanentemente.');
    window.location.reload();

  } catch (e) {
    console.error('[Banner] Erro geral:', e);
    alert('❌ Erro ao atualizar o banner: ' + e.message);
  }
}

// ════════════════════════════════════════════════════════════
// BANNERS GRID
// ════════════════════════════════════════════════════════════
function renderBannersGrid(profile) {
  const container = document.getElementById('bannersGrid');
  if (!container) return;
  container.innerHTML = '';

  const unlocked = Array.isArray(profile.unlocked_banners) ? profile.unlocked_banners : [];
  const current = profile.banner_url;

  // Opção padrão
  const defaultItem = document.createElement('div');
  defaultItem.className = `banner-item ${!current ? 'equipped' : ''}`;
  defaultItem.innerHTML = `<div class="banner-item-info">Padrão / Season Pass</div>`;
  defaultItem.onclick = () => equiparBanner(null, defaultItem, profile.season_pass_premium);
  container.appendChild(defaultItem);

  unlocked.forEach(banner => {
    const bannerUrl = (typeof banner === 'object' && banner !== null) ? banner.url : banner;
    const bannerName = (typeof banner === 'object' && banner !== null) ? (banner.name || 'Banner') : 'Banner';
    if (!bannerUrl) return;

    const item = document.createElement('div');
    item.className = `banner-item ${current === bannerUrl ? 'equipped' : ''}`;

    const media = `<img src="${bannerUrl}" class="banner-item-media">`;

    item.innerHTML = `${media}<div class="banner-item-info">${bannerName}</div>`;
    item.onclick = () => equiparBanner(bannerUrl, item, profile.season_pass_premium);
    container.appendChild(item);
  });

  const countEl = document.getElementById('countBanners');
  if (countEl) countEl.textContent = unlocked.length;
}

async function equiparBanner(url, element, isPremium) {
  if (element.classList.contains('equipped')) return;

  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) return;

  document.querySelectorAll('#bannersGrid .banner-item').forEach(el => el.classList.remove('equipped'));
  element.classList.add('equipped');

  try {
    const { error } = await window.supabaseClient
      .from('profile_cosmetics').update({ banner_url: url }).eq('user_id', session.user.id);
    if (error) throw error;

    // FIX: atualizar o banner em tempo real sem reload
    renderizarBanner(url, isPremium);

  } catch (e) {
    console.error('Erro ao equipar banner:', e);
    alert('Erro ao equipar banner.');
  }
}

// ════════════════════════════════════════════════════════════
// AVATAR
// ════════════════════════════════════════════════════════════
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
        ? Object.assign(document.createElement('video'), { autoplay: true, loop: true, muted: true })
        : document.createElement('img');
      el.id = 'headerUserAvatar'; el.src = url;
      if (el.tagName === 'IMG') el.alt = 'avatar';
      el.style.cssText = 'width:28px;height:28px;border-radius:50%;object-fit:cover;';
      oldHeaderAvatar.replaceWith(el);
    }
  } catch (e) {
    console.error('Erro ao equipar avatar:', e);
    alert('Não foi possível equipar o avatar.');
  }
}

// ════════════════════════════════════════════════════════════
// TÍTULO
// ════════════════════════════════════════════════════════════
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

    document.querySelectorAll('.btn-equip-title').forEach(btn => {
      btn.textContent = 'Equipar Título'; btn.disabled = false; btn.classList.remove('equipped');
    });
    if (clickedElement) {
      clickedElement.textContent = 'Equipado'; clickedElement.disabled = true; clickedElement.classList.add('equipped');
    }
  } catch (e) {
    console.error('Erro ao equipar título:', e);
  }
}

// ════════════════════════════════════════════════════════════
// ESTILOS DE NOME
// ════════════════════════════════════════════════════════════
function renderNameStyles(profile) {
  const container = document.getElementById('nameStyleGrid');
  if (!container || typeof NAME_STYLES === 'undefined') return;
  container.innerHTML = '';

  const unlocked = Array.isArray(profile.unlocked_name_styles) ? profile.unlocked_name_styles : [];
  const equipped = profile.equipped_name_style || null;

  const defaultCard = document.createElement('div');
  defaultCard.className = `name-style-item unlocked${!equipped ? ' equipped' : ''}`;
  defaultCard.innerHTML = `<div class="name-style-preview">Username</div><div class="name-style-info"><h4>Padrão</h4><p>Visual simples e clássico.</p></div>`;
  defaultCard.onclick = e => equiparNameStyle(null, e.currentTarget);
  container.appendChild(defaultCard);

  Object.values(NAME_STYLES).forEach(style => {
    const isUnlocked = unlocked.includes(style.id);
    const isEquipped = equipped === style.id;
    const card = document.createElement('div');
    card.className = `name-style-item ${isUnlocked ? 'unlocked' : 'locked'}${isUnlocked && isEquipped ? ' equipped' : ''}`;
    card.innerHTML = `
      <div class="name-style-preview ${style.className || ''}" style="${style.style || ''}" ${style.dataText ? 'data-text-effect' : ''}>Username</div>
      <div class="name-style-info"><h4>${style.name}</h4><p>${style.rarity}</p></div>
      ${isUnlocked ? '' : '<div class="lock-icon">&#128274;</div>'}`;
    if (isUnlocked) card.onclick = e => equiparNameStyle(style.id, e.currentTarget);
    container.appendChild(card);
  });
}

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
      usernameEl.style.cssText = '';
      usernameEl.removeAttribute('data-text-effect');
      usernameEl.removeAttribute('data-text');
      if (typeof NAME_STYLES !== 'undefined') {
        Object.values(NAME_STYLES).forEach(s => {
          if (s.className) usernameEl.classList.remove(...s.className.split(' ').filter(Boolean));
        });
      }
      if (styleId && NAME_STYLES[styleId]) {
        const s = NAME_STYLES[styleId];
        if (s.style) usernameEl.style.cssText = s.style;
        if (s.className) usernameEl.classList.add(...s.className.split(' ').filter(Boolean));
        if (s.dataText) { usernameEl.setAttribute('data-text-effect', ''); usernameEl.setAttribute('data-text', usernameEl.textContent); }
      }
    }
  } catch (e) {
    console.error('Erro ao equipar estilo:', e);
  }
}