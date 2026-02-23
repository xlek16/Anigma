// register.js

document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('regUsername').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm  = document.getElementById('regPasswordConfirm').value;
  const msg      = document.getElementById('registerMsg');

  // Validacoes
  if (username.length < 3) {
    msg.textContent = 'O username deve ter pelo menos 3 caracteres.';
    msg.style.color = '#f87171';
    return;
  }

  if (password !== confirm) {
    msg.textContent = 'As passwords nao coincidem.';
    msg.style.color = '#f87171';
    return;
  }

  if (password.length < 6) {
    msg.textContent = 'A password deve ter pelo menos 6 caracteres.';
    msg.style.color = '#f87171';
    return;
  }

  msg.textContent = 'A criar conta...';
  msg.style.color = 'rgba(255,255,255,0.60)';

  // Registar no Supabase
  const { data, error } = await window.supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { username: username }
    }
  });

  if (error) {
    if (error.message.includes('already registered')) {
      msg.textContent = 'Este email ja esta registado.';
    } else {
      msg.textContent = 'Erro: ' + error.message;
    }
    msg.style.color = '#f87171';
    return;
  }

  // Guardar username na tabela profiles
  const { error: profileError } = await window.supabaseClient
    .from('profiles')
    .insert({
      id: data.user.id,
      username: username,
    });

  if (profileError && !profileError.message.includes('duplicate')) {
    console.warn('Erro ao criar perfil:', profileError.message);
  }

  // Sucesso
  msg.textContent = 'Conta criada com sucesso!';
  msg.style.color = '#4ade80';

  document.getElementById('registerForm').reset();

  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1500);
});