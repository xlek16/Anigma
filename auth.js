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
  // Formula: Nível 1 = 0-99, Nível 2 = 100-299, etc.
  return Math.floor(1 + (Math.sqrt(8 * (points / 100) + 1) - 1) / 2);
}

async function handleLevelUp(userId, pontosAntigos, pontosNovos) {
  const nivelAntigo = calculateLevel(pontosAntigos);
  const nivelNovo = calculateLevel(pontosNovos);

  if (nivelNovo > nivelAntigo) {
      const niveisSubidos = nivelNovo - nivelAntigo;
      const diamantesGanhos = niveisSubidos * 10; // Recompensa: 10 diamantes por nível

      try {
          const { data: profile, error: fetchError } = await window.supabaseClient
              .from('profiles')
              .select('diamantes')
              .eq('id', userId)
              .single();
          
          if (fetchError) throw fetchError;

          const { error: updateError } = await window.supabaseClient
              .from('profiles')
              .update({ 
                  level: nivelNovo,
                  diamantes: (profile.diamantes || 0) + diamantesGanhos
              })
              .eq('id', userId);

          if (updateError) throw updateError;

          // Atraso para não colidir com o alerta de recompensas do jogo
          setTimeout(() => {
            alert(`Subiste para o Nível ${nivelNovo}! Ganhaste 💎 ${diamantesGanhos} diamantes!`);
          }, 1500);
      } catch (e) {
          console.error("Erro ao processar subida de nível:", e);
      }
  }
}

// ── Atualizar o header consoante sessao ───────────────────────
async function atualizarHeader(session) {
  let btnLogin = document.getElementById('btnLogin');
  const btnLoja  = document.getElementById('btnLoja');
  const hStats   = document.getElementById('headerStats');

  if (!session) {
    if (btnLogin) {
      btnLogin.style.display = 'inline-flex';
      
      // Ajusta o link dependendo se estamos na raiz ou dentro da pasta Jogos
      const isGamePage = window.location.pathname.includes('/Jogos/');
      btnLogin.href    = isGamePage ? '../login.html' : 'login.html';

      btnLogin.innerHTML     = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             style="width:14px;height:14px;">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        Login`;
    }
    if (btnLoja)  btnLoja.style.display  = 'none';
    if (hStats)   hStats.style.display   = 'none';
    return;
  }

  try {
    let { data: profile } = await window.supabaseClient
      .from('profiles')
      .select('id, username, diamantes, pontos_totais, unlocked_themes, avatar_url, unlocked_achievements, level')
      .eq('id', session.user.id)
      .single();

    // ── ATRIBUIR RECOMPENSAS PENDENTES (do modo convidado) ──
    const pendingRewardsJSON = localStorage.getItem('anigma_pending_rewards');
    if (pendingRewardsJSON && profile) {
      try {
        const pendingRewards = JSON.parse(pendingRewardsJSON);
        localStorage.removeItem('anigma_pending_rewards'); // Atribuir só uma vez

        const novosDiamantes = (profile.diamantes || 0) + pendingRewards.diamantes;
        const novosPontos = (profile.pontos_totais || 0) + pendingRewards.pontos;

        const { data: updatedProfile, error: updateError } = await window.supabaseClient
          .from('profiles')
          .update({
            diamantes: novosDiamantes,
            pontos_totais: novosPontos,
          })
          .eq('id', session.user.id)
          .select()
          .single();

        if (updateError) throw updateError;

        profile = updatedProfile; // Usar o perfil atualizado para o resto da função

        // Verificar se subiu de nível com os pontos ganhos
        await handleLevelUp(session.user.id, (profile.pontos_totais - pendingRewards.pontos), profile.pontos_totais);

        // Alerta o utilizador sobre as recompensas recebidas
        setTimeout(() => {
          alert(`Recompensas da sua última partida foram adicionadas!\n\n💎 +${pendingRewards.diamantes} Diamantes\n⭐ +${pendingRewards.pontos} Pontos`);
        }, 500);

      } catch (e) {
        console.error('Erro ao atribuir recompensas pendentes:', e);
      }
    }

    // Guardar temas desbloqueados no localStorage para acesso rápido
    if (profile && profile.unlocked_themes) {
      localStorage.setItem('anigma_unlocked_themes', JSON.stringify(profile.unlocked_themes));
    }

    // 1. Tenta usar o username da BD ou dos metadados (registo)
    let username = profile?.username || session.user.user_metadata?.username;

    // 2. Se não houver username, usa o início do email como fallback
    if (!username) {
      username = (session.user.email || 'User').split('@')[0];
    }

    if (btnLogin) {
      // Clona o botão para remover event listeners do transicao.js
      const novoBtn = btnLogin.cloneNode(true);
      btnLogin.parentNode.replaceChild(novoBtn, btnLogin);
      btnLogin = novoBtn;

      // Usa o avatar do perfil (o perfil sabe qual está equipado)
      const avatarUrl = profile?.avatar_url;

      let avatarHtml = '';
      if (avatarUrl && (avatarUrl.endsWith('.webm') || avatarUrl.endsWith('.mp4'))) {
        avatarHtml = `<video src="${avatarUrl}" autoplay loop muted style="width:22px;height:22px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,0.2);"></video>`;
      } else {
        const imgUrl = avatarUrl || 'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/animes/avatar_default.png';
        avatarHtml = `<img src="${imgUrl}" alt="Avatar" style="width:22px;height:22px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,0.2);">`;
      }

      btnLogin.style.display = 'inline-flex';
      btnLogin.href          = 'perfil.html';
      btnLogin.innerHTML     = `
        ${avatarHtml}
        ${username}
        <span style="font-size:0.7rem;opacity:0.5;">▾</span>`;
      btnLogin.onclick = function (e) {
        e.preventDefault();
        mostrarMenuUser(session, username);
      };
    }

    if (btnLoja) btnLoja.style.display = 'inline-flex';
    if (hStats) {
      hStats.style.display = 'flex';
      // Usar pontos_totais para o header — nunca pontos_db que é só da partida
      atualizarHeaderStats(profile?.diamantes ?? 0, profile?.pontos_totais ?? 0);
    }

    // Verificar conquistas passivas (nível, diamantes, etc)
    if (typeof verificarConquistas === 'function' && profile) {
      verificarConquistas(profile);
    }

  } catch (e) {
    console.warn('Erro ao carregar perfil:', e);
  }
}

// ── Menu dropdown do utilizador ───────────────────────────────
function mostrarMenuUser(session, username) {
  const existente = document.getElementById('userDropdown');
  if (existente) { existente.remove(); return; }

  const btnLogin = document.getElementById('btnLogin');
  const menu = document.createElement('div');
  menu.id = 'userDropdown';
  menu.style.cssText = `
    position:absolute;
    top:calc(100% + 8px);
    right:0;
    background:#1a1a22;
    border:1px solid rgba(255,255,255,0.10);
    border-radius:6px;
    overflow:hidden;
    min-width:180px;
    z-index:300;
    box-shadow:0 8px 24px rgba(0,0,0,0.5);
  `;

  menu.innerHTML = `
    <div style="padding:10px 16px;font-size:0.72rem;color:rgba(255,255,255,0.30);border-bottom:1px solid rgba(255,255,255,0.07);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${session.user.email}</div>
    <a href="perfil.html" style="display:block;padding:11px 16px;font-size:0.82rem;font-weight:600;color:rgba(255,255,255,0.60);text-decoration:none;">Perfil</a>
    <a href="ranking.html" style="display:block;padding:11px 16px;font-size:0.82rem;font-weight:600;color:rgba(255,255,255,0.60);text-decoration:none;">Ranking</a>
    <div style="height:1px;background:rgba(255,255,255,0.07);margin:4px 0;"></div>
    <button id="btnLogout" style="display:block;width:100%;text-align:left;padding:11px 16px;font-size:0.82rem;font-weight:600;color:#f87171;background:transparent;border:none;cursor:pointer;font-family:inherit;">Sair da conta</button>
  `;

  const wrap = btnLogin.parentElement;
  wrap.style.position = 'relative';
  wrap.appendChild(menu);

  document.getElementById('btnLogout').onclick = async function () {
    await window.supabaseClient.auth.signOut();
    
    // Verifica se está na pasta Jogos para redirecionar corretamente para o login
    const isGamePage = window.location.pathname.includes('/Jogos/');
    sairDaPagina(isGamePage ? '../login.html' : 'login.html');
  };

  setTimeout(() => {
    document.addEventListener('click', function fechar(e) {
      if (!menu.contains(e.target) && e.target !== btnLogin) {
        menu.remove();
        document.removeEventListener('click', fechar);
      }
    });
  }, 50);
}

// ── Inicializar ───────────────────────────────────────────────
(async function () {
  try {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    await atualizarHeader(session);

    window.supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      await atualizarHeader(session);
    });
  } catch (e) {
    console.warn('Auth erro:', e);
  }
})();