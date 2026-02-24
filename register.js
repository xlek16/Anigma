document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('regUsername').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm  = document.getElementById('regPasswordConfirm').value;
  const msg      = document.getElementById('registerMsg');

  if (username.length < 3) {
    return showError('O username deve ter pelo menos 3 caracteres.');
  }

  if (password !== confirm) {
    return showError('As passwords nao coincidem.');
  }

  if (password.length < 6) {
    return showError('A password deve ter pelo menos 6 caracteres.');
  }

  msg.textContent = 'A verificar username...';
  msg.style.color = 'white';

  // 🔎 Verificar se username já existe
  const { data: existingUser } = await window.supabaseClient
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (existingUser) {
    return showError('Este username ja esta em uso.');
  }

  msg.textContent = 'A criar conta...';

  // Envia o username nos metadados para o Trigger do Supabase capturar e criar o perfil
  const { data, error } = await window.supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username
      }
    }
  });

  if (error) {
    return showError(error.message);
  }

  // Garante que o perfil é criado na base de dados.
  // O upsert insere o perfil se não existir, garantindo que o username é guardado.
  // Isto serve como uma garantia, caso o trigger da base de dados falhe ou demore.
  const { error: profileError } = await window.supabaseClient
    .from('profiles')
    .upsert({
      id: data.user.id,
      username: username,
      avatar_url: 'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/login.webp'
    });

  if (profileError) {
    // Este aviso pode ser ignorado se o sistema funcionar.
    // Pode aparecer se o trigger e este código correrem ao mesmo tempo.
    console.warn('Aviso ao criar perfil:', profileError.message);
  }

  msg.textContent = 'Conta criada com sucesso! A redirecionar para o login...';
  msg.style.color = '#4ade80';

  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1500);
});

function showError(text) {
  const msg = document.getElementById('registerMsg');
  msg.textContent = text;
  msg.style.color = '#f87171';
}

document.getElementById('regUsername').addEventListener('blur', async function () {
  const username = this.value.trim();
  const msg = document.getElementById('registerMsg');

  if (username.length < 3) return;

  const { data } = await window.supabaseClient
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (data) {
    msg.textContent = 'Username indisponivel.';
    msg.style.color = '#f87171';
  } else {
    msg.textContent = 'Username disponivel!';
    msg.style.color = '#4ade80';
  }
});