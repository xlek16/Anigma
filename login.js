document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const msg      = document.getElementById('loginMsg');

  if (!email || !password) {
    msg.textContent = 'Preenche todos os campos.';
    msg.style.color = '#f87171';
    return;
  }

  msg.textContent = 'A entrar...';
  msg.style.color = 'rgba(255,255,255,0.60)';

  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      msg.textContent = 'Email ou password incorretos.';
    } else if (error.message.includes('Email not confirmed')) {
      msg.textContent = 'Confirma o teu email antes de fazer login.';
    } else {
      msg.textContent = 'Erro: ' + error.message;
    }
    msg.style.color = '#f87171';
    return;
  }

  // Login com sucesso
  msg.textContent = 'Login feito com sucesso!';
  msg.style.color = '#4ade80';

  // Redireciona para a pagina principal
  setTimeout(function () {
    window.location.href = 'index.html';
  }, 800);
});