if (typeof supabase === 'undefined') {
  console.error('supabase nao carregou!');
} else {
  verificarSessao();
}
async function verificarSessao() {
  // usa a instância `supabaseClient` criada em `supabase.js`
  const { data: { session } } = await window.supabaseClient.auth.getSession();

  const btnLogin = document.querySelector('.btn-login-nav') || document.querySelector('.btn-login');

  if (session) {
    // Passo 1: Criar o registo em `profiles` se não existir (lazy creation)
    const { data: existingProfile, error: checkError } = await window.supabaseClient
      .from('profiles')
      .select('username')
      .eq('id', session.user.id)
      .single();

    let dbUsername = null;

    if (checkError && checkError.code === 'PGRST116') {
      // Registo não existe, cria um novo
      const username = session.user.user_metadata?.username || session.user.email.split('@')[0];
      dbUsername = username;

      const { error: insertError } = await window.supabaseClient
        .from('profiles')
        .insert({
          id: session.user.id,
          username: username,
        });

      if (insertError) {
        console.warn('Erro ao criar profile:', insertError);
      } else {
        console.log('Profile criado com sucesso para:', username);
      }
    } else if (existingProfile) {
      dbUsername = existingProfile.username;
    }

    // Passo 2: Mostrar o botão Loja e menu de utilizador
    const username = dbUsername || 
                     session.user.user_metadata?.username || 
                     session.user.email?.split('@')[0] || 
                     'Utilizador';
    
    console.log('Sessão activa - username:', username, 'user_metadata:', session.user.user_metadata);

    if (btnLogin) {
      btnLogin.outerHTML = `
        <a class="btn-loja" href="loja.html">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Loja
        </a>

        <div class="user-menu-wrap" id="userMenuWrap">
          <button class="btn-user" onclick="toggleUserMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            ${username} &#9662;
          </button>
          <div class="user-menu" id="userMenu">
            <div class="user-menu-email">${session.user.email}</div>
            <a class="user-menu-item" href="perfil.html">Perfil</a>
            <a class="user-menu-item" href="ranking.html">Ranking</a>
            <div class="user-menu-divider"></div>
            <button class="user-menu-item user-menu-logout" onclick="logout()">Sair da conta</button>
          </div>
        </div>
      `;
    }
  }
}

function toggleUserMenu() {
  document.getElementById('userMenu').classList.toggle('open');
}

document.addEventListener('click', function (e) {
  if (!e.target.closest('#userMenuWrap')) {
    const menu = document.getElementById('userMenu');
    if (menu) menu.classList.remove('open');
  }
});

async function logout() {
  await window.supabaseClient.auth.signOut();
  window.location.href = 'index.html';
}
