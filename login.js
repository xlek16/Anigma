document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const msg      = document.getElementById('loginMsg');

  msg.textContent = 'A entrar...';
  msg.style.color = 'rgba(255,255,255,0.60)';

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    msg.textContent = 'Email ou password incorretos.';
    msg.style.color = '#f87171';
    return;
  }

  // Login com sucesso — vai para a pagina principal
  window.location.href = 'index.html';
});