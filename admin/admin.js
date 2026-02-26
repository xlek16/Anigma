async function darDiamantes() {
  const userEmail = document.getElementById('userEmail').value.trim();
  const amount    = parseInt(document.getElementById('diamondAmount').value);
  const msg       = document.getElementById('adminMsg');

  if (!userEmail || isNaN(amount) || amount <= 0) {
    msg.textContent = 'Por favor insira um email e uma quantidade válida.';
    msg.style.color = '#f87171';
    return;
  }

  msg.textContent = 'A processar...';
  msg.style.color = 'rgba(255,255,255,0.6)';

  try {
    // 1. Obter o user ID a partir do email
    const { data: users, error: userError } = await window.supabaseClient
      .from('auth.users')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError) throw userError;
    if (!users) throw new Error('Utilizador não encontrado.');

    const userId = users.id;

    // 2. Obter o perfil do utilizador
    const { data: profile, error: profileError } = await window.supabaseClient
      .from('profiles')
      .select('diamantes')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // 3. Dar os diamantes
    const newDiamonds = (profile.diamantes || 0) + amount;
    const { error: updateError } = await window.supabaseClient
      .from('profiles')
      .update({ diamantes: newDiamonds })
      .eq('id', userId);

    if (updateError) throw updateError;

    msg.textContent = `💎 ${amount} diamantes dados a ${userEmail}!`;
    msg.style.color = '#4ade80';
    document.getElementById('userEmail').value   = '';
    document.getElementById('diamondAmount').value = '100';

  } catch (e) {
    console.error('Erro ao dar diamantes:', e);
    msg.textContent = 'Erro: ' + e.message;
    msg.style.color = '#f87171';
  }
}
