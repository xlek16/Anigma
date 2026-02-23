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

// ── Atualizar o header consoante sessao ───────────────────────
async function atualizarHeader(session) {
  const btnLogin = document.getElementById('btnLogin');
  const btnLoja  = document.getElementById('btnLoja');
  const hStats   = document.getElementById('headerStats');

  if (!session) {
    if (btnLogin) {
      btnLogin.style.display = 'inline-flex';
      btnLogin.href          = 'login.html';
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
    const { data: profile } = await window.supabaseClient
      .from('profiles')
      .select('username, diamantes, pontos_totais')
      .eq('id', session.user.id)
      .single();

    const username = profile?.username || session.user.email?.split('@')[0] || 'User';

    if (btnLogin) {
      btnLogin.style.display = 'inline-flex';
      btnLogin.href          = 'perfil.html';
      btnLogin.innerHTML     = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             style="width:14px;height:14px;">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
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
    sairDaPagina('index.html');
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