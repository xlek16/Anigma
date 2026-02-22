document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm  = document.getElementById('regPasswordConfirm').value;
  const msg      = document.getElementById('registerMsg');

  // verificar se as passwords coincidem
  if (password !== confirm) {
    msg.textContent = 'As passwords nao coincidem.';
    msg.style.color = '#f87171';
    return;
  }

  // verificar tamanho minimo
  if (password.length < 6) {
    msg.textContent = 'A password deve ter pelo menos 6 caracteres.';
    msg.style.color = '#f87171';
    return;
  }

  msg.textContent = 'A criar conta...';
  msg.style.color = 'rgba(255,255,255,0.60)';

  // chamar o Supabase
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    msg.textContent = 'Erro: ' + error.message;
    msg.style.color = '#f87171';
    return;
  }

  // sucesso
  msg.textContent = 'Conta criada! Verifica o teu email para confirmar.';
  msg.style.color = '#4ade80';
});