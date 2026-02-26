document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) { window.location.href = 'login.html'; return; }

  const { data: profile } = await window.supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (!profile) {
    document.querySelector('.perfil-main').innerHTML = '<div style="color:white; text-align:center; padding-top: 50px; font-size: 1.1rem;"><h3>Erro ao Carregar Perfil</h3><p>Não foi possível encontrar os dados do seu perfil. <br>Por favor, tente recarregar a página.</p></div>';
    return;
  }

  // ── Username + estilo de nome ──
  const usernameEl = document.getElementById('pUsername');
  usernameEl.textContent = profile.username || 'Sem nome';

  const unlockedNameStyles = Array.isArray(profile.unlocked_name_styles) ? profile.unlocked_name_styles : [];
  const equippedStyle = profile.equipped_name_style || null;

  if (equippedStyle && typeof NAME_STYLES !== 'undefined' && NAME_STYLES[equippedStyle]) {
    const s = NAME_STYLES[equippedStyle];
    if (s.style)     usernameEl.style.cssText = s.style;
    if (s.className) usernameEl.classList.add(s.className);
    if (s.dataText) {
      usernameEl.setAttribute('data-text-effect', '');
      usernameEl.setAttribute('data-text', usernameEl.textContent);
    }
  }

  // ── Título equipado ──
  if (profile.equipped_title) {
    const titleEl = document.getElementById('pTitle');
    if (titleEl) { titleEl.textContent = profile.equipped_title; titleEl.style.display = 'inline-block'; }
  }

  // ── Barra de progresso ──
  // Calcula o nível real a partir dos pontos (ignora o level da DB que pode estar desatualizado)
  const totalPoints = profile.pontos_totais || 0;
  function calcLevel(pts) {
    // Inversa de: pts_necessarios_para_nivel_N = 250 * N * (N-1)
    // Resolve: 250*N*(N-1) <= pts  →  N = floor((1 + sqrt(1 + 4*pts/250)) / 2)
    return Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * pts) / 250)) / 2));
  }
  const currentLevel    = calcLevel(totalPoints);
  const currentLevelBaseXP = 250 * currentLevel * (currentLevel - 1);
  const nextLevelXP        = 250 * (currentLevel + 1) * currentLevel;
  const xpNeeded    = Math.max(1, nextLevelXP - currentLevelBaseXP);
  const currentXP   = Math.max(0, totalPoints - currentLevelBaseXP);
  const progressPct = Math.min(100, (currentXP / xpNeeded) * 100);

  document.getElementById('pLevelFill').style.width  = `${progressPct}%`;
  document.getElementById('pCurrentXP').textContent  = currentXP.toLocaleString();
  document.getElementById('pNextXP').textContent     = xpNeeded.toLocaleString();
  document.getElementById('pNextLevel').textContent  = currentLevel + 1;
  document.getElementById('pLevel').textContent      = currentLevel;
  document.getElementById('pPoints').textContent     = (profile.pontos_totais || 0).toLocaleString();
  document.getElementById('pDiamonds').textContent   = (profile.diamantes || 0).toLocaleString();
  document.getElementById('pStreak').textContent     = profile.current_streak || 0;

  // ── Stats dos jogos ──
  document.getElementById('pDbPoints').textContent   = profile.pontos_db    ?? '--';
  document.getElementById('pDbAttempts').textContent = profile.tentativas_db ?? '--';
  document.getElementById('pJjkPoints').textContent  = profile.pontos_jjk    ?? '--';
  document.getElementById('pJjkAttempts').textContent = profile.tentativas_jjk ?? '--';

  // ── Avatar principal ──
  const currentAvatar = profile.avatar_url || 'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/animes/avatar_default.png';
  const avatarWrap = document.querySelector('.profile-avatar-wrap');
  avatarWrap.innerHTML = '';
  if (currentAvatar.endsWith('.webm') || currentAvatar.endsWith('.mp4')) {
    avatarWrap.innerHTML = `<video src="${currentAvatar}" autoplay loop muted class="profile-avatar-img"></video>`;
  } else {
    avatarWrap.innerHTML = `<img src="${currentAvatar}" alt="Avatar" class="profile-avatar-img">`;
  }

  // ── Grid de avatares ──
  const avatarContainer = document.getElementById('avatarGrid');
  avatarContainer.innerHTML = '';
  let unlocked = profile.unlocked_avatars || [];
  const defaultAvatar = 'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/animes/avatar_default.png';
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
        let mediaHtml = url.endsWith('.webm') || url.endsWith('.mp4')
          ? `<video src="${url}" autoplay loop muted style="width:100%;height:100%;object-fit:cover;"></video>`
          : `<img src="${url}" alt="Avatar">`;
        div.innerHTML = mediaHtml + (isUnlocked ? '' : '<div class="lock-icon">&#128274;</div>');
        if (isUnlocked) div.onclick = (e) => equiparAvatar(url, e.currentTarget);
        grid.appendChild(div);
      });
      section.appendChild(grid);
      avatarContainer.appendChild(section);
    });
  }

  // ── Estilos de nome ──
  renderNameStyles(profile);

  // ── Conquistas ──
  if (typeof renderAchievements === 'function') renderAchievements(profile);

  // ── Verificar novas conquistas ──
  if (typeof verificarConquistas === 'function') await verificarConquistas(profile);

  // ── Toggle estatísticas ──
  const toggleBtn    = document.getElementById('toggleStatsBtn');
  const statsContainer = document.getElementById('statsContainer');
  if (toggleBtn && statsContainer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = statsContainer.classList.contains('open');
      statsContainer.classList.toggle('open');
      toggleBtn.innerHTML = isOpen ? '📊 Ver Estatísticas' : '🔼 Ocultar Estatísticas';
    });
  }
});

// ── Equipar avatar ──
async function equiparAvatar(url, clickedElement) {
  if (clickedElement.classList.contains('equipped')) return;
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) return;

  const oldEquipped = document.querySelector('.avatar-item.equipped');
  if (oldEquipped) oldEquipped.classList.remove('equipped');
  clickedElement.classList.add('equipped');

  try {
    const { error } = await window.supabaseClient
      .from('profiles').update({ avatar_url: url }).eq('id', session.user.id);
    if (error) throw error;

    const avatarWrap = document.querySelector('.profile-avatar-wrap');
    if (url.endsWith('.webm') || url.endsWith('.mp4')) {
      avatarWrap.innerHTML = `<video src="${url}" autoplay loop muted class="profile-avatar-img"></video>`;
    } else {
      avatarWrap.innerHTML = `<img src="${url}" alt="Avatar" class="profile-avatar-img">`;
    }

    const oldHeaderAvatar = document.getElementById('headerUserAvatar');
    if (oldHeaderAvatar) {
      const el = url.endsWith('.webm') || url.endsWith('.mp4') ? Object.assign(document.createElement('video'), { autoplay: true, loop: true, muted: true }) : document.createElement('img');
      el.id = 'headerUserAvatar';
      el.src = url;
      if (el.tagName === 'IMG') el.alt = 'avatar';
      el.style.cssText = 'width:28px;height:28px;border-radius:50%;object-fit:cover;';
      oldHeaderAvatar.replaceWith(el);
    }
  } catch (e) {
    console.error('Erro ao equipar avatar:', e);
    alert('Não foi possível equipar o avatar.');
    clickedElement.classList.remove('equipped');
    if (oldEquipped) oldEquipped.classList.add('equipped');
  }
}

// ── Equipar título ──
async function equiparTitulo(titulo, clickedElement) {
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) return;

  const oldEquipped = document.querySelector('.title-item.equipped');
  if (oldEquipped) oldEquipped.classList.remove('equipped');
  if (clickedElement) clickedElement.classList.add('equipped');

  try {
    const { error } = await window.supabaseClient
      .from('profiles').update({ equipped_title: titulo }).eq('id', session.user.id);
    if (error) throw error;

    const titleEl = document.getElementById('pTitle');
    if (titleEl) { titleEl.textContent = titulo; titleEl.style.display = 'inline-block'; }

    // Atualizar botões de equipar título no render
    document.querySelectorAll('.btn-equip-title').forEach(btn => {
      btn.textContent = 'Equipar Título';
      btn.disabled = false;
      btn.classList.remove('equipped');
    });
    if (clickedElement) {
      clickedElement.textContent = 'Equipado';
      clickedElement.disabled = true;
      clickedElement.classList.add('equipped');
    }
  } catch (e) {
    console.error('Erro ao equipar título:', e);
    alert('Não foi possível equipar o título.');
    if (oldEquipped) oldEquipped.classList.add('equipped');
    if (clickedElement) clickedElement.classList.remove('equipped');
  }
}

// ── Render estilos de nome ──
function renderNameStyles(profile) {
  const container = document.getElementById('nameStyleGrid');
  if (!container || typeof NAME_STYLES === 'undefined') return;
  container.innerHTML = '';

  // Garantir que é sempre array — mesmo se a coluna for null na DB
  const unlocked = Array.isArray(profile.unlocked_name_styles) ? profile.unlocked_name_styles : [];
  const equipped  = profile.equipped_name_style || null;

  // Card padrão
  const defaultCard = document.createElement('div');
  defaultCard.className = `name-style-item unlocked${!equipped ? ' equipped' : ''}`;
  defaultCard.innerHTML = `
    <div class="name-style-preview">Username</div>
    <div class="name-style-info"><h4>Padrão</h4><p>Visual simples e clássico.</p></div>
  `;
  defaultCard.onclick = (e) => equiparNameStyle(null, e.currentTarget);
  container.appendChild(defaultCard);

  Object.values(NAME_STYLES).forEach(style => {
    const isUnlocked = unlocked.includes(style.id);
    const isEquipped  = equipped === style.id;

    const card = document.createElement('div');
    card.className = `name-style-item ${isUnlocked ? 'unlocked' : 'locked'}${isUnlocked && isEquipped ? ' equipped' : ''}`;
    card.innerHTML = `
      <div class="name-style-preview ${style.className || ''}" style="${style.style || ''}" ${style.dataText ? 'data-text-effect' : ''}>Username</div>
      <div class="name-style-info">
        <h4>${style.name}</h4>
        <p>${style.rarity}</p>
      </div>
      ${isUnlocked ? '' : '<div class="lock-icon">&#128274;</div>'}
    `;
    if (isUnlocked) card.onclick = (e) => equiparNameStyle(style.id, e.currentTarget);
    container.appendChild(card);
  });
}

// ── Equipar estilo de nome ──
async function equiparNameStyle(styleId, clickedElement) {
  if (clickedElement.classList.contains('equipped')) return;
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) return;

  document.querySelectorAll('.name-style-item.equipped').forEach(el => el.classList.remove('equipped'));
  clickedElement.classList.add('equipped');

  try {
    const { error } = await window.supabaseClient
      .from('profiles').update({ equipped_name_style: styleId }).eq('id', session.user.id);
    if (error) throw error;

    // Atualizar username no perfil
    const usernameEl = document.getElementById('pUsername');
    if (usernameEl) {
      usernameEl.style.cssText = '';
      usernameEl.className = '';
      usernameEl.removeAttribute('data-text-effect');
      usernameEl.removeAttribute('data-text');
      if (styleId && NAME_STYLES[styleId]) {
        const s = NAME_STYLES[styleId];
        if (s.style)     usernameEl.style.cssText = s.style;
        if (s.className) usernameEl.classList.add(s.className);
        if (s.dataText) {
          usernameEl.setAttribute('data-text-effect', '');
          usernameEl.setAttribute('data-text', usernameEl.textContent);
        }
      }
    }

    // Atualizar username no header — usa o id="headerUsername" criado pelo auth.js
    const headerNameEl = document.getElementById('headerUsername');
    if (headerNameEl) {
      headerNameEl.style.cssText = '';
      headerNameEl.className = '';
      if (styleId && NAME_STYLES[styleId]) {
        const s = NAME_STYLES[styleId];
        if (s.style)     headerNameEl.style.cssText = s.style;
        if (s.className) headerNameEl.classList.add(s.className);
      }
    }

    console.log('✅ Estilo equipado:', styleId ?? 'padrão');
  } catch (e) {
    console.error('Erro ao equipar estilo:', e);
    alert('Não foi possível equipar o estilo.');
    clickedElement.classList.remove('equipped');
  }
}

// ── Render conquistas ──
function renderAchievements(profile) {
  const container = document.getElementById('achievementsGrid');
  if (!container || typeof ACHIEVEMENTS === 'undefined') return;
  container.innerHTML = '';

  const unlocked      = profile.unlocked_achievements || [];
  const equippedTitle = profile.equipped_title;

  Object.entries(ACHIEVEMENTS).forEach(([id, ach]) => {
    const isUnlocked = unlocked.includes(id);
    const card = document.createElement('div');
    card.className = `ach-card ${isUnlocked ? 'unlocked' : 'locked'}`;

    let rewardText = '';
    if (ach.reward.diamonds) rewardText += `💎 ${ach.reward.diamonds}`;
    if (ach.reward.title)    rewardText += ` 🏷️ "${ach.reward.title}"`;

    card.innerHTML = `
      <div class="ach-icon">🏆</div>
      <div class="ach-info">
        <h4 class="ach-name">${ach.name}</h4>
        <p class="ach-desc">${ach.description}</p>
        <div class="ach-reward">${rewardText || 'Sem recompensa'}</div>
      </div>
      ${isUnlocked ? '' : '<div class="ach-lock-overlay"><span>🔒</span></div>'}
    `;

    if (isUnlocked && ach.reward.title) {
      const btnWrap  = document.createElement('div');
      btnWrap.className = 'ach-button-wrap';
      const equipBtn = document.createElement('button');
      equipBtn.className = 'btn-equip-title';
      if (equippedTitle === ach.reward.title) {
        equipBtn.textContent = 'Equipado';
        equipBtn.disabled = true;
        equipBtn.classList.add('equipped');
      } else {
        equipBtn.textContent = 'Equipar Título';
      }
      equipBtn.onclick = (e) => { e.stopPropagation(); equiparTitulo(ach.reward.title, equipBtn); };
      btnWrap.appendChild(equipBtn);
      card.appendChild(btnWrap);
    }
    container.appendChild(card);
  });
}