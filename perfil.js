document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return;
  }

  const { data: profile } = await window.supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (!profile) return;

  // Preencher Info
  document.getElementById('pUsername').textContent = profile.username || 'Sem nome';
  
  if (profile.equipped_title) {
    const titleEl = document.getElementById('pTitle');
    titleEl.textContent = profile.equipped_title;
    titleEl.style.display = 'inline-block';
  }

  // ── BARRA DE PROGRESSO ──
  const currentLevel = profile.level || 1;
  const totalPoints = profile.pontos_totais || 0;
  
  // Fórmula inversa da usada no auth.js (Base 500): Pontos = 250 * Nivel * (Nivel - 1)
  const currentLevelBaseXP = 250 * currentLevel * (currentLevel - 1);
  const nextLevelXP = 250 * (currentLevel + 1) * currentLevel;
  const xpNeeded = nextLevelXP - currentLevelBaseXP;
  const currentXP = totalPoints - currentLevelBaseXP;
  const progressPercent = Math.min(100, Math.max(0, (currentXP / xpNeeded) * 100));

  document.getElementById('pLevelFill').style.width = `${progressPercent}%`;
  document.getElementById('pCurrentXP').textContent = currentXP.toLocaleString();
  document.getElementById('pNextXP').textContent = xpNeeded.toLocaleString();
  document.getElementById('pNextLevel').textContent = currentLevel + 1;

  document.getElementById('pLevel').textContent = profile.level || 1;
  document.getElementById('pPoints').textContent = (profile.pontos_totais || 0).toLocaleString();
  document.getElementById('pDiamonds').textContent = (profile.diamantes || 0).toLocaleString();
  document.getElementById('pStreak').textContent = (profile.current_streak || 0);
  
  const currentAvatar = profile.avatar_url || 'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/animes/avatar_default.png';
  
  // Exibir avatar principal (Imagem ou Vídeo)
  const avatarWrap = document.querySelector('.profile-avatar-wrap');
  avatarWrap.innerHTML = ''; 
  if (currentAvatar.endsWith('.webm') || currentAvatar.endsWith('.mp4')) {
    avatarWrap.innerHTML = `<video src="${currentAvatar}" autoplay loop muted class="profile-avatar-img"></video>`;
  } else {
    avatarWrap.innerHTML = `<img src="${currentAvatar}" alt="Avatar" id="pAvatar" class="profile-avatar-img">`;
  }

  // Preencher Grid de Avatares
  const container = document.getElementById('avatarGrid');
  container.innerHTML = '';

  let unlocked = profile.unlocked_avatars || [];
  const defaultAvatar = 'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/animes/avatar_default.png';
  if (!unlocked.includes(defaultAvatar)) {
    unlocked = [defaultAvatar, ...unlocked];
  }

  // Verifica se AVATARES está definido
  if (typeof AVATARES !== 'undefined') {
    const rarities = ['impossible', 'hard', 'medium', 'easy'];
    
    rarities.forEach(rarity => {
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
        
        let mediaHtml = '';
        if (url.endsWith('.webm') || url.endsWith('.mp4')) {
          mediaHtml = `<video src="${url}" autoplay loop muted style="width:100%;height:100%;object-fit:cover;"></video>`;
        } else {
          mediaHtml = `<img src="${url}" alt="Avatar">`;
        }
        
        div.innerHTML = mediaHtml + (isUnlocked ? '' : '<div class="lock-icon">&#128274;</div>');
        
        if (isUnlocked) {
          div.onclick = () => equiparAvatar(url);
        }
        
        grid.appendChild(div);
      });
      
      section.appendChild(grid);
      container.appendChild(section);
    });
  } else {
    container.innerHTML = '<div style="color:red">Erro: avatars.js não carregado.</div>';
  }

  // Preencher Conquistas
  if (typeof renderAchievements === 'function') {
    renderAchievements(profile);
  }
});

async function equiparAvatar(url) {
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  await window.supabaseClient.from('profiles').update({ avatar_url: url }).eq('id', session.user.id);
  window.location.reload();
}

async function equiparTitulo(titulo) {
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  await window.supabaseClient.from('profiles').update({ equipped_title: titulo }).eq('id', session.user.id);
  window.location.reload();
}
