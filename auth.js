// auth.js

// ── Atualizar os valores de diamantes e pontos no header ──────
function atualizarHeaderStats(diamantes, pontos) {
  const hPontos    = document.getElementById('headerPontos');
  const hDiamantes = document.getElementById('headerDiamantes');
  const hStats     = document.getElementById('headerStats');
  if (hStats)     hStats.style.display   = 'flex';
  if (hPontos)    hPontos.textContent    = Math.max(0, pontos ?? 0);
  if (hDiamantes) hDiamantes.textContent = diamantes ?? 0;
}

// ── Sistema de Níveis ─────────────────────────────────────────
function calculateLevel(points) {
  if (points < 0) return 1;
  return Math.floor(1 + (Math.sqrt(8 * (points / 500) + 1) - 1) / 2);
}

async function handleLevelUp(userId, pontosAntigos, pontosNovos) {
  const nivelAntigo = calculateLevel(pontosAntigos);
  const nivelNovo = calculateLevel(pontosNovos);

  if (nivelNovo > nivelAntigo) {
    const niveisSubidos = nivelNovo - nivelAntigo;
    const diamantesGanhos = niveisSubidos * 10;

    try {
      const { data: profile, error: fetchError } = await window.supabaseClient
        .from('profiles')
        .select('diamantes')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      const { data: updatedProfile, error: updateError } = await window.supabaseClient
        .from('profiles')
        .update({
          level: nivelNovo,
          diamantes: (profile.diamantes || 0) + diamantesGanhos
        })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

      if (updatedProfile && typeof verificarConquistas === 'function') {
        verificarConquistas(updatedProfile);
      }

      setTimeout(() => {
        alert(`⬆️ Subiste para o Nível ${nivelNovo}!\n\n💎 Ganhaste ${diamantesGanhos} diamantes!`);
      }, 1500);
    } catch (e) {
      console.error("Erro ao processar subida de nível:", e);
    }
  }
}

// ── Criar botão de perfil com dropdown ───────────────────────
function criarBotaoPerfil(profile, prefix) {
  const btnLogin = document.getElementById('btnLogin');
  if (!btnLogin) return;

  const avatarUrl = profile.avatar_url || 'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/animes/avatar_default.png';
  const username  = profile.username || 'Perfil';

  // Remove dropdown anterior se existir
  const existente = document.getElementById('userDropdownWrap');
  if (existente) existente.remove();

  // Esconder botão login
  btnLogin.style.display = 'none';

  // Criar wrapper
  const wrap = document.createElement('div');
  wrap.id = 'userDropdownWrap';
  wrap.style.cssText = 'position:relative; display:inline-flex; align-items:center;';

  // Botão principal
  const btn = document.createElement('button');
  btn.id = 'userDropdownBtn';
  btn.style.cssText = `
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px;
    padding: 5px 12px 5px 6px;
    cursor: pointer;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
    font-family: inherit;
    transition: background 0.2s;
  `;

  // Limpar o conteúdo do botão antes de adicionar novos elementos
  btn.innerHTML = '';

  // Criar elemento do avatar (imagem ou vídeo) de forma segura
  let avatarElement;
  if (avatarUrl.endsWith('.webm') || avatarUrl.endsWith('.mp4')) {
    avatarElement = document.createElement('video');
    avatarElement.autoplay = true;
    avatarElement.loop = true;
    avatarElement.muted = true;
  } else {
    avatarElement = document.createElement('img');
    avatarElement.alt = 'avatar';
  }
  avatarElement.id = 'headerUserAvatar';
  avatarElement.src = avatarUrl;
  avatarElement.style.cssText = "width:28px;height:28px;border-radius:50%;object-fit:cover;";

  btn.appendChild(avatarElement);

  const usernameSpan = document.createElement('span');
  usernameSpan.textContent = username;

  // Aplicar estilo de nome equipado
  if (profile.equipped_name_style && typeof NAME_STYLES !== 'undefined' && NAME_STYLES[profile.equipped_name_style]) {
    const styleInfo = NAME_STYLES[profile.equipped_name_style];
    if (styleInfo.style) {
      usernameSpan.style.cssText = styleInfo.style;
    }
    if (styleInfo.className) {
      usernameSpan.className = styleInfo.className;
    }
  }

  btn.appendChild(usernameSpan);

  const arrowSpan = document.createElement('span');
  arrowSpan.style.cssText = "font-size:0.7rem;opacity:0.7;";
  arrowSpan.innerHTML = '&#9662;'; // Seta para baixo
  btn.appendChild(arrowSpan);

  // Dropdown menu
  const menu = document.createElement('div');
  menu.id = 'userDropdownMenu';
  menu.style.cssText = `
    display: none;
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: #1a1a2e;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    min-width: 160px;
    z-index: 9999;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  `;

  const itemStyle = `
    display: block;
    width: 100%;
    padding: 11px 16px;
    background: none;
    border: none;
    color: #fff;
    font-size: 0.85rem;
    font-family: inherit;
    cursor: pointer;
    text-align: left;
    text-decoration: none;
    transition: background 0.15s;
  `;

  menu.innerHTML = `
    <a href="${prefix}perfil.html" style="${itemStyle}">👤 O meu Perfil</a>
    <div style="height:1px;background:rgba(255,255,255,0.08);"></div>
    <button id="btnLogout" style="${itemStyle}color:#f87171;">🚪 Sair</button>
  `;

  // Toggle dropdown
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menu.style.display === 'block';
    menu.style.display = isOpen ? 'none' : 'block';
  });

  // Fechar ao clicar fora
  document.addEventListener('click', () => {
    menu.style.display = 'none';
  });

  // Logout
  menu.querySelector('#btnLogout').addEventListener('click', async () => {
    await window.supabaseClient.auth.signOut();
    window.location.href = prefix + 'login.html';
  });

  // Hover nos itens do menu
  menu.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => el.style.background = 'rgba(255,255,255,0.08)');
    el.addEventListener('mouseleave', () => el.style.background = 'none');
  });

  wrap.appendChild(btn);
  wrap.appendChild(menu);
  btnLogin.parentNode.insertBefore(wrap, btnLogin.nextSibling);
}

// ── Atualizar o header consoante sessao ───────────────────────
async function atualizarHeader(session) {
  const btnLogin = document.getElementById('btnLogin');
  const btnLoja  = document.getElementById('btnLoja');
  const hStats   = document.getElementById('headerStats');

  const path = window.location.pathname;
  const isSubFolder = path.includes('/Jogos/') || path.includes('/loja/') || path.includes('/ranking/');
  const prefix = isSubFolder ? '../' : '';

  if (!session) {
    if (btnLogin) {
      btnLogin.style.display = 'inline-flex';
      btnLogin.href = prefix + 'login.html';
      btnLogin.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             style="width:14px;height:14px;">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        Login`;
    }
    if (btnLoja) btnLoja.style.display = 'none';
    if (hStats)  hStats.style.display  = 'none';
    return;
  }

  try {
    let { data: profile } = await window.supabaseClient
      .from('profiles')
      .select('*') // Usar '*' para obter todas as colunas
      .eq('id', session.user.id)
      .single();

    // Se o perfil não for encontrado, pode ser um novo utilizador cujo perfil ainda não foi criado pelo trigger.
    // Não devemos quebrar a execução. Em vez disso, mostramos um estado de login básico e saímos.
    if (!profile) {
      console.warn(`Perfil para o utilizador ${session.user.id} não encontrado. A apresentar estado de login genérico.`);
      
      // Cria um objeto de perfil temporário apenas para o botão de perfil
      const tempProfile = {
        username: session.user.user_metadata.username || session.user.user_metadata.full_name || (session.user.email ? session.user.email.split('@')[0] : 'Utilizador'),
        avatar_url: session.user.user_metadata.avatar_url || 'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/animes/avatar_default.png',
        equipped_name_style: null
      };

      criarBotaoPerfil(tempProfile, prefix);
      atualizarHeaderStats(0, 0); // Mostra 0 para pontos e diamantes
      if (btnLoja) btnLoja.style.display = 'none'; // Esconde a loja pois não temos dados de diamantes
      if (hStats)  hStats.style.display  = 'flex'; // Mostra o container de stats

      return; // Impede a execução do resto da lógica (daily streak, etc.)
    }

    // ── ATRIBUIR RECOMPENSAS PENDENTES ──
    const pendingRewardsJSON = localStorage.getItem('anigma_pending_rewards');
    if (pendingRewardsJSON && profile) {
      try {
        const pendingRewards = JSON.parse(pendingRewardsJSON);
        localStorage.removeItem('anigma_pending_rewards');

        const novosDiamantes = (profile.diamantes || 0) + pendingRewards.diamantes;
        const novosPontos = (profile.pontos_totais || 0) + pendingRewards.pontos;

        const { data: updatedProfile, error: updateError } = await window.supabaseClient
          .from('profiles')
          .update({ diamantes: novosDiamantes, pontos_totais: novosPontos })
          .eq('id', session.user.id)
          .select()
          .single();

        if (updateError) throw updateError;
        profile = updatedProfile;

        await handleLevelUp(session.user.id, (profile.pontos_totais - pendingRewards.pontos), profile.pontos_totais);

        setTimeout(() => {
          alert(`Recompensas da sua última partida foram adicionadas!\n\n💎 +${pendingRewards.diamantes} Diamantes\n⭐ +${pendingRewards.pontos} Pontos`);
        }, 500);
      } catch (e) {
        console.error('Erro ao atribuir recompensas pendentes:', e);
      }
    }

    // ── DAILY STREAK ──
    const hoje = new Date().toISOString().split('T')[0];

    if (profile && profile.last_claim_date !== hoje) {
      const ontem = new Date();
      ontem.setDate(ontem.getDate() - 1);
      const ontemStr = ontem.toISOString().split('T')[0];

      let newStreak = 1;
      if (profile.last_claim_date === ontemStr) {
        newStreak = (profile.current_streak || 0) + 1;
      }

      const reward = Math.min(200, 50 + (newStreak - 1) * 10);
      const newDiamantes = (profile.diamantes || 0) + reward;

      const { error: streakError } = await window.supabaseClient
        .from('profiles')
        .update({ last_claim_date: hoje, current_streak: newStreak, diamantes: newDiamantes })
        .eq('id', session.user.id);

      if (!streakError) {
        profile.diamantes = newDiamantes;
        setTimeout(() => {
          alert(`🔥 Daily Streak: Dia ${newStreak}!\n💎 Recebeste ${reward} Diamantes!`);
        }, 1500);
      }
    }

    // Guardar temas
    if (profile && profile.unlocked_themes) {
      localStorage.setItem('anigma_unlocked_themes', JSON.stringify(profile.unlocked_themes));
    }

    // Admin check
    if (window.location.pathname.includes('admin/admin.html') && !profile?.isAdmin) {
      window.location.href = prefix + 'index.html';
    }

    atualizarHeaderStats(profile.diamantes, profile.pontos_totais);

    if (btnLoja) btnLoja.style.display = 'inline-flex';
    if (hStats)  hStats.style.display  = 'flex';

    // Criar botão de perfil
    criarBotaoPerfil(profile, prefix);

  } catch (e) {
    console.error('Erro ao atualizar header:', e);
  }
}

// ── Inicializar ───────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  await atualizarHeader(session);

  window.supabaseClient.auth.onAuthStateChange((_event, session) => {
    atualizarHeader(session);
  });
});