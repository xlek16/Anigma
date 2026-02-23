async function comprarItem(itemId, custoDiamantes, ganhoPontos = 0) {
  const btn = event.currentTarget;
  const textoOriginal = btn.innerHTML;

  // 1. Verificar Sessão
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) {
    alert('Precisas de fazer login para comprar na loja.');
    window.location.href = 'login.html';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'A processar...';

  try {
    // Verificar se as configurações globais existem
    if (typeof AVATARES === 'undefined' || typeof RARITY_CONFIG === 'undefined') {
      throw new Error('Erro de configuração: avatars.js não carregado.');
    }

    // 2. Obter dados atuais do utilizador
    const { data: profileData, error: fetchError } = await window.supabaseClient
      .from('profiles')
      .select('id, diamantes, pontos_totais, unlocked_avatars, unlocked_themes, unlocked_achievements, level')
      .eq('id', session.user.id)
      .single();

    if (fetchError) throw new Error('Erro ao buscar perfil: ' + fetchError.message);
    if (!profileData) throw new Error('Perfil não encontrado.');

    // Cria uma cópia do perfil para evitar erros de "objeto imutável"
    const profile = { ...profileData };

    // 3. Verificar saldo
    if ((profile.diamantes || 0) < custoDiamantes) {
      alert(`Não tens diamantes suficientes! (Tens: ${profile.diamantes || 0}, Custo: ${custoDiamantes})`);
      btn.disabled = false;
      btn.innerHTML = textoOriginal;
      return;
    }

    // 4. Lógica de Compra
    const novosDiamantes = (profile.diamantes || 0) - custoDiamantes;
    let updateData = { diamantes: novosDiamantes };
    let successMessage = 'Comprado!';
    let avatarGanhoUrl = null;

    if (itemId.startsWith('caixa_avatar_')) {
      // Sorteio de raridade
      const rand = Math.random() * 100;
      let rarity = 'easy';
      
      if (rand < RARITY_CONFIG.easy.chance) rarity = 'easy';
      else if (rand < RARITY_CONFIG.easy.chance + RARITY_CONFIG.medium.chance) rarity = 'medium';
      else if (rand < RARITY_CONFIG.easy.chance + RARITY_CONFIG.medium.chance + RARITY_CONFIG.hard.chance) rarity = 'hard';
      else rarity = 'impossible';

      const pool = AVATARES[rarity];
      if (!pool || pool.length === 0) throw new Error(`Pool de avatares vazia para raridade: ${rarity}`);

      const avatarGanho = pool[Math.floor(Math.random() * pool.length)];
      
      const unlocked = profile.unlocked_avatars || [];

      // Define o avatar ganho para mostrar a animação SEMPRE
      avatarGanhoUrl = avatarGanho;

      if (unlocked.includes(avatarGanho)) {
        successMessage = 'Avatar Repetido!';
        // Não atualiza unlocked_avatars, apenas desconta diamantes
      } else {
        updateData.unlocked_avatars = [...unlocked, avatarGanho];
        successMessage = 'Novo Avatar!';
      }
    }

    // 5. Atualizar Base de Dados
    const { error: updateError } = await window.supabaseClient
      .from('profiles')
      .update(updateData)
      .eq('id', session.user.id);

    if (updateError) throw new Error('Erro ao atualizar perfil: ' + updateError.message);

    // 6. Sucesso!
    btn.style.background = '#4ade80';
    btn.textContent = successMessage;
    
    // Atualizar o header
    if (typeof atualizarHeaderStats === 'function') {
      atualizarHeaderStats(novosDiamantes, profile.pontos_totais);
    }

    // Verificar conquistas
    if (typeof verificarConquistas === 'function') {
      profile.diamantes = novosDiamantes;
      profile.unlocked_avatars = updateData.unlocked_avatars || profile.unlocked_avatars || [];
      verificarConquistas(profile).catch(err => console.warn('Erro conquistas:', err));
    }

    if (avatarGanhoUrl) {
      mostrarAnimacaoCaixa(avatarGanhoUrl);
    }

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = textoOriginal;
      btn.style.background = '';
    }, 2000);

  } catch (e) {
    console.error('Erro na compra:', e);
    // Mostra a mensagem real do erro para ajudar a resolver
    alert('Erro: ' + e.message);
    btn.disabled = false;
    btn.innerHTML = textoOriginal;
  }
}

function mostrarAnimacaoCaixa(avatarUrl) {
  const overlay = document.createElement('div');
  overlay.className = 'box-animation-overlay';
  overlay.innerHTML = `
    <video autoplay muted playsinline class="box-video">
      <source src="https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/219846.webm" type="video/webm">
    </video>
  `;
  document.body.appendChild(overlay);

  // Quando o vídeo acabar (ou após 3.5s), mostra o prémio
  setTimeout(() => {
    if (document.body.contains(overlay)) overlay.remove();
    mostrarRecompensa(avatarUrl);
  }, 3500);
}

function mostrarRecompensa(url) {
  const overlay = document.createElement('div');
  overlay.className = 'reward-overlay';
  
  let mediaHtml = '';
  if (url.endsWith('.webm') || url.endsWith('.mp4')) {
    mediaHtml = `<video src="${url}" autoplay loop muted class="reward-img" style="border-radius:50%; object-fit:cover;"></video>`;
  } else {
    mediaHtml = `<img src="${url}" class="reward-img" alt="Avatar Ganho">`;
  }

  overlay.innerHTML = `
    <div class="reward-box">
      <div class="reward-title">🎉 Saiu-te isto!</div>
      ${mediaHtml}
      <br>
      <button class="btn-close-reward" onclick="this.closest('.reward-overlay').remove()">Fechar</button>
    </div>
  `;

  document.body.appendChild(overlay);
}
