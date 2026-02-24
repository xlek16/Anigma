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
    let novosDiamantes = (profile.diamantes || 0) - custoDiamantes;
    let updateData = { diamantes: novosDiamantes };
    let successMessage = 'Comprado!';
    let avatarGanhoUrl = null;
    let overlayMessage = '';

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
        let refund = 0;
        if (rarity === 'easy') refund = 15;
        else if (rarity === 'medium') refund = 25;
        else if (rarity === 'hard') refund = 40;
        else if (rarity === 'impossible') refund = 75;

        novosDiamantes += refund;
        updateData.diamantes = novosDiamantes;

        successMessage = `Repetido! +${refund} 💎`;
        overlayMessage = `Repetido! Reembolso: ${refund} 💎`;
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
      mostrarAnimacaoCaixa(avatarGanhoUrl, overlayMessage);
    }

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = textoOriginal;
      btn.style.background = '';
    }, 2000);

  } catch (e) {
    console.error('Erro na compra:', e);
    alert('Erro: ' + e.message);
    btn.disabled = false;
    btn.innerHTML = textoOriginal;
  }
}

function mostrarAnimacaoCaixa(avatarUrl, overlayMessage) {
  const overlay = document.createElement('div');
  overlay.className = 'box-animation-overlay';
  overlay.innerHTML = `
    <video autoplay muted playsinline class="box-video">
      <source src="https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/219846.webm" type="video/webm">
    </video>
  `;
  document.body.appendChild(overlay);

  // Quando o vídeo acabar (ou após 3.5s), inicia a roleta
  setTimeout(() => {
    if (document.body.contains(overlay)) overlay.remove();
    iniciarRoleta(avatarUrl, overlayMessage);
  }, 3500);
}

// Helper para obter info do avatar (nome, raridade)
function getAvatarInfo(url) {
  let rarity = 'easy';
  // Procura a raridade na lista global
  for (const [key, list] of Object.entries(AVATARES)) {
    if (list.includes(url)) {
      rarity = key;
      break;
    }
  }
  
  const config = RARITY_CONFIG[rarity];
  
  // Extrai o nome do ficheiro
  // Ex: .../avatar_goku.gif -> goku
  const filename = url.split('/').pop().split('.')[0];
  let name = filename.replace('avatar_', '').replace(/_/g, ' ');
  // Capitalizar primeira letra
  name = name.charAt(0).toUpperCase() + name.slice(1);

  return {
    url,
    name,
    rarityKey: rarity,
    rarityLabel: config.label,
    rarityColor: config.color
  };
}

function iniciarRoleta(finalUrl, overlayMessage) {
  // 1. Criar Overlay
  const overlay = document.createElement('div');
  overlay.className = 'gacha-overlay';
  document.body.appendChild(overlay);

  // 2. Preparar lista de todos os avatares para o sorteio visual
  const allAvatars = [];
  Object.values(AVATARES).forEach(list => allAvatars.push(...list));
  
  // 3. Estrutura HTML
  overlay.innerHTML = `
    <div class="gacha-container">
      <div class="gacha-card">
        <div class="gacha-media-wrap"></div>
        <div class="gacha-info">
          <div class="gacha-name">Sorteando...</div>
          <div class="gacha-rarity">...</div>
        </div>
      </div>
      <button class="btn-close-reward" style="display:none; margin-top:20px;">Fechar</button>
    </div>
  `;

  const mediaWrap = overlay.querySelector('.gacha-media-wrap');
  const nameEl = overlay.querySelector('.gacha-name');
  const rarityEl = overlay.querySelector('.gacha-rarity');
  const btnClose = overlay.querySelector('.btn-close-reward');
  
  btnClose.onclick = () => overlay.remove();

  // 4. Lógica da Animação
  let steps = 0;
  const maxSteps = 30; // Quantas trocas de imagem antes de parar
  let speed = 50; // Velocidade inicial (ms)
  
  function updateDisplay(url) {
    const info = getAvatarInfo(url);
    
    // Atualiza Media (Video ou Imagem)
    let mediaHtml = '';
    if (url.endsWith('.webm') || url.endsWith('.mp4')) {
      mediaHtml = `<video src="${url}" autoplay loop muted class="gacha-img"></video>`;
    } else {
      mediaHtml = `<img src="${url}" class="gacha-img" alt="${info.name}">`;
    }
    mediaWrap.innerHTML = mediaHtml;
    
    // Atualiza Texto
    nameEl.textContent = info.name;
    rarityEl.textContent = info.rarityLabel;
    rarityEl.style.color = info.rarityColor;
    rarityEl.style.borderColor = info.rarityColor;
    
    // Efeito visual de "pulso" a cada troca
    const card = overlay.querySelector('.gacha-card');
    card.classList.remove('pulse');
    void card.offsetWidth; // trigger reflow
    card.classList.add('pulse');
  }

  function cycle() {
    steps++;
    
    if (steps >= maxSteps) {
      // PARAR no avatar ganho
      updateDisplay(finalUrl);
      const card = overlay.querySelector('.gacha-card');
      card.classList.add('finished'); // Efeito final
      
      if (overlayMessage) {
        const infoDiv = overlay.querySelector('.gacha-info');
        const msgDiv = document.createElement('div');
        msgDiv.style.color = '#ffd700';
        msgDiv.style.fontWeight = '800';
        msgDiv.style.marginTop = '10px';
        msgDiv.style.fontSize = '0.9rem';
        msgDiv.textContent = overlayMessage;
        infoDiv.appendChild(msgDiv);
      }

      // Mostrar botão de fechar
      btnClose.style.display = 'inline-block';
      return;
    }

    // Escolher um avatar aleatório para mostrar durante o giro
    const randomUrl = allAvatars[Math.floor(Math.random() * allAvatars.length)];
    updateDisplay(randomUrl);

    // Desacelerar no final
    if (steps > maxSteps - 8) {
      speed += 60; 
    } else {
      speed += 5;
    }

    setTimeout(cycle, speed);
  }

  cycle();
}
