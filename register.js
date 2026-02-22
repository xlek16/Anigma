const reservedUsernames = [
  'admin',
  'root',
  'support',
  'moderator',
  'staff',
  'owner'
];

const usernameInput = document.getElementById('regUsername');
const msg = document.getElementById('registerMsg');

// =============================
// VERIFICAÇÃO EM TEMPO REAL
// =============================

usernameInput.addEventListener('input', async function () {

  const username = usernameInput.value.trim();

  if (username.length < 3) {
    msg.textContent = '';
    return;
  }

  const usernameRegex = /^[A-Za-z0-9_]+( [A-Za-z0-9_]+)*$/;

  if (!usernameRegex.test(username)) {
    msg.textContent = 'Formato inválido.';
    msg.style.color = '#f87171';
    return;
  }

  if (reservedUsernames.includes(username.toLowerCase())) {
    msg.textContent = 'Este username é reservado.';
    msg.style.color = '#f87171';
    return;
  }

  const { data } = await window.supabaseClient
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (data) {
    msg.textContent = 'Username já está em uso.';
    msg.style.color = '#f87171';
  } else {
    msg.textContent = 'Username disponível ✔';
    msg.style.color = '#4ade80';
  }
});


// =============================
// REGISTO
// =============================

document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm  = document.getElementById('regPasswordConfirm').value;

  // ======================
  // VALIDAÇÕES
  // ======================

  if (username.length < 3) {
    msg.textContent = 'O username deve ter pelo menos 3 caracteres.';
    msg.style.color = '#f87171';
    return;
  }

  const usernameRegex = /^[A-Za-z0-9_]+( [A-Za-z0-9_]+)*$/;

  if (!usernameRegex.test(username)) {
    msg.textContent = 'Username só pode conter letras, números, underscore (_) e apenas 1 espaço entre palavras.';
    msg.style.color = '#f87171';
    return;
  }

  if (reservedUsernames.includes(username.toLowerCase())) {
    msg.textContent = 'Este username é reservado.';
    msg.style.color = '#f87171';
    return;
  }

  if (password !== confirm) {
    msg.textContent = 'As passwords não coincidem.';
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

  try {
    const { data, error } = await window.supabaseClient.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      msg.textContent = error.message;
      msg.style.color = '#f87171';
      return;
    }

    if (!data.user) {
      msg.textContent = 'Erro inesperado no registo.';
      msg.style.color = '#f87171';
      return;
    }

    const { error: profileError } = await window.supabaseClient
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          username: username,
          created_at: new Date()
        }
      ]);

    if (profileError) {
      msg.textContent = 'Conta criada, mas erro ao guardar username.';
      msg.style.color = '#f87171';
      return;
    }

  } catch (err) {
    msg.textContent = 'Erro inesperado: ' + err.message;
    msg.style.color = '#f87171';
    return;
  }

  msg.textContent = 'Conta criada! Verifica o teu email para confirmar.';
  msg.style.color = '#4ade80';

  document.getElementById('registerForm').reset();

  setTimeout(() => {
    window.location.href = 'login.html';
  }, 2500);
});