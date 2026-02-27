let isPurchasing = false;

// ── COMPRAR TEMA ─────────────────────────────────────────────
async function comprarTema(temaId, custoDiamantes) {
  if (isPurchasing) return;

  const btn = event.currentTarget;
  const textoOriginal = btn.innerHTML;

  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) {
    alert('Precisas de fazer login para comprar na loja.');
    window.location.href = '../login.html';
    return;
  }

  let unlockedLocal = [];
  try {
    const stored = localStorage.getItem('anigma_unlocked_themes');
    if (stored) unlockedLocal = JSON.parse(stored);
  } catch(e) {}

  if (unlockedLocal.includes(temaId)) {
    alert('Já tens este tema desbloqueado!');
    return;
  }

  if (!confirm(`Desbloquear o tema por ${custoDiamantes} 💎?`)) return;

  try {
    isPurchasing = true;
    btn.disabled = true;
    btn.textContent = 'A processar...';

    const { data: profileData, error: fetchError } = await window.supabaseClient
      .from('profiles')
      .select('id, diamantes, unlocked_themes')
      .eq('id', session.user.id)
      .single();

    if (fetchError) throw fetchError;

    if ((profileData.diamantes || 0) < custoDiamantes) {
      alert(`Não tens diamantes suficientes! (Tens: ${profileData.diamantes || 0}, Custo: ${custoDiamantes})`);
      btn.disabled = false;
      btn.innerHTML = textoOriginal;
      isPurchasing = false;
      return;
    }

    const unlockedDB  = Array.isArray(profileData.unlocked_themes) ? profileData.unlocked_themes : [];
    if (unlockedDB.includes(temaId)) {
      alert('Já tens este tema desbloqueado!');
      btn.disabled = false;
      btn.innerHTML = textoOriginal;
      isPurchasing = false;
      return;
    }

    const novosDiamantes = (profileData.diamantes || 0) - custoDiamantes;
    const novosThemes    = [...unlockedDB, temaId];

    const { data: updatedProfile, error: updateError } = await window.supabaseClient
      .from('profiles')
      .update({ diamantes: novosDiamantes, unlocked_themes: novosThemes })
      .eq('id', session.user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    localStorage.setItem('anigma_unlocked_themes', JSON.stringify(novosThemes));

    if (typeof atualizarHeaderStats === 'function') {
      atualizarHeaderStats(updatedProfile.diamantes, updatedProfile.pontos_totais);
    }

    if (typeof updateThemeMenu === 'function') updateThemeMenu();

    btn.textContent = '✅ Desbloqueado!';
    btn.style.background = 'rgba(255,255,255,0.1)';
    btn.style.color = 'rgba(255,255,255,0.5)';
    btn.style.cursor = 'not-allowed';

    setTimeout(() => {
      if (confirm(`Tema desbloqueado! Queres aplicá-lo agora?`)) {
        if (typeof setTheme === 'function') setTheme(temaId);
      }
      isPurchasing = false;
    }, 500);

  } catch (e) {
    console.error('Erro ao comprar tema:', e);
    alert('Erro: ' + e.message);
    btn.disabled = false;
    btn.innerHTML = textoOriginal;
    isPurchasing = false;
  }
}

// ── COMPRAR ITEM ─────────────────────────────────────────────
async function comprarItem(itemId, custoDiamantes, ganhoPontos = 0) {
  if (isPurchasing) { console.warn("Compra já em progresso."); return; }

  const btn = event.currentTarget;
  const textoOriginal = btn.innerHTML;

  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) {
    alert('Precisas de fazer login para comprar na loja.');
    window.location.href = '../login.html';
    return;
  }

  try {
    isPurchasing = true;
    btn.disabled = true;
    btn.textContent = 'A processar...';

    if (typeof AVATARES === 'undefined' || typeof RARITY_CONFIG === 'undefined') {
      throw new Error('Erro de configuração: avatars.js não carregado.');
    }

    const { data: profileData, error: fetchError } = await window.supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (fetchError) throw fetchError;

    const profile = { ...profileData };

    if ((profile.diamantes || 0) < custoDiamantes) {
      alert(`Não tens diamantes suficientes! (Tens: ${profile.diamantes || 0}, Custo: ${custoDiamantes})`);
      btn.disabled = false;
      btn.innerHTML = textoOriginal;
      isPurchasing = false;
      return;
    }

    let novosDiamantes = (profile.diamantes || 0) - custoDiamantes;
    let updateData     = { diamantes: novosDiamantes };
    let successMessage = 'Comprado!';
    let avatarGanhoUrl = null;
    let estiloGanhoId  = null;
    let overlayMessage = '';

    if (itemId.startsWith('caixa_avatar_')) {
      const rand = Math.random() * 100;
      let rarity = 'easy';
      if      (rand < RARITY_CONFIG.easy.chance) rarity = 'easy';
      else if (rand < RARITY_CONFIG.easy.chance + RARITY_CONFIG.medium.chance) rarity = 'medium';
      else if (rand < RARITY_CONFIG.easy.chance + RARITY_CONFIG.medium.chance + RARITY_CONFIG.hard.chance) rarity = 'hard';
      else rarity = 'impossible';

      const pool = AVATARES[rarity];
      if (!pool || pool.length === 0) throw new Error(`Pool de avatares vazia para raridade: ${rarity}`);

      const avatarGanho = pool[Math.floor(Math.random() * pool.length)];
      const unlocked = Array.isArray(profile.unlocked_avatars) ? profile.unlocked_avatars : [];
      avatarGanhoUrl = avatarGanho;

      if (unlocked.includes(avatarGanho)) {
        const refunds = { easy: 15, medium: 25, hard: 40, impossible: 75 };
        const refund  = refunds[rarity] || 15;
        novosDiamantes       += refund;
        updateData.diamantes  = novosDiamantes;
        successMessage        = `Repetido! +${refund} 💎`;
        overlayMessage        = `Repetido! Reembolso: ${refund} 💎`;
      } else {
        updateData.unlocked_avatars = [...unlocked, avatarGanho];
        successMessage = 'Novo Avatar!';
      }

    } else if (itemId.startsWith('caixa_nome_')) {
      if (typeof NAME_STYLES === 'undefined' || typeof NAME_STYLE_RARITY_CONFIG === 'undefined') {
        throw new Error('Erro de configuração: nameStyles.js não carregado.');
      }

      const rand = Math.random() * 100;
      let rarityKey = 'comum';
      if      (rand < NAME_STYLE_RARITY_CONFIG.comum.chance) rarityKey = 'comum';
      else if (rand < NAME_STYLE_RARITY_CONFIG.comum.chance + NAME_STYLE_RARITY_CONFIG.raro.chance) rarityKey = 'raro';
      else if (rand < NAME_STYLE_RARITY_CONFIG.comum.chance + NAME_STYLE_RARITY_CONFIG.raro.chance + NAME_STYLE_RARITY_CONFIG.epico.chance) rarityKey = 'epico';
      else rarityKey = 'lendario';

      const rarityLabel = NAME_STYLE_RARITY_CONFIG[rarityKey].label;
      const pool = Object.values(NAME_STYLES).filter(
        s => s.rarity.toLowerCase() === rarityLabel.toLowerCase()
      );

      if (!pool || pool.length === 0) throw new Error(`Pool de estilos vazia para raridade: ${rarityLabel}`);

      const estiloGanho = pool[Math.floor(Math.random() * pool.length)];
      const unlocked = Array.isArray(profile.unlocked_name_styles) ? profile.unlocked_name_styles : [];
      estiloGanhoId = estiloGanho.id;

      if (unlocked.includes(estiloGanhoId)) {
        const refunds = { comum: 10, raro: 25, epico: 40, lendario: 75 };
        const refund  = refunds[rarityKey] || 10;
        novosDiamantes       += refund;
        updateData.diamantes  = novosDiamantes;
        successMessage        = `Repetido! +${refund} 💎`;
        overlayMessage        = `Estilo Repetido! Reembolso: ${refund} 💎`;
      } else {
        updateData.unlocked_name_styles = [...unlocked, estiloGanhoId];
        successMessage = 'Novo Estilo!';
      }
    }

    const { data: updatedProfile, error: updateError } = await window.supabaseClient
      .from('profiles')
      .update(updateData)
      .eq('id', session.user.id)
      .select()
      .single();

    if (updateError) throw new Error('Erro ao atualizar perfil: ' + updateError.message);

    btn.style.background = '#4ade80';
    btn.textContent = successMessage;

    if (typeof atualizarHeaderStats === 'function') {
      atualizarHeaderStats(updatedProfile.diamantes, updatedProfile.pontos_totais);
    }

    if (typeof window.verificarConquistas === 'function') {
      await window.verificarConquistas(updatedProfile);
    }

    if (avatarGanhoUrl) mostrarAnimacaoCaixa(avatarGanhoUrl, overlayMessage);
    if (estiloGanhoId)  mostrarAnimacaoEstilo(estiloGanhoId, overlayMessage);

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = textoOriginal;
      btn.style.background = '';
      isPurchasing = false;
    }, 2000);

  } catch (e) {
    console.error('Erro na compra:', e);
    alert('Erro: ' + e.message);
    btn.disabled = false;
    btn.innerHTML = textoOriginal;
    isPurchasing = false;
  }
}

// ── Animação caixa de avatar ──────────────────────────────────
function mostrarAnimacaoCaixa(avatarUrl, overlayMessage) {
  const overlay = document.createElement('div');
  overlay.className = 'box-animation-overlay';
  overlay.innerHTML = `
    <video autoplay muted playsinline class="box-video">
      <source src="https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/219846.webm" type="video/webm">
    </video>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => {
    if (document.body.contains(overlay)) overlay.remove();
    iniciarRoleta(avatarUrl, overlayMessage);
  }, 3500);
}

function getAvatarInfo(url) {
  let rarity = 'easy';
  for (const [key, list] of Object.entries(AVATARES)) {
    if (list.includes(url)) { rarity = key; break; }
  }
  const config   = RARITY_CONFIG[rarity];
  const filename = url.split('/').pop().split('.')[0];
  let name = filename.replace('avatar_', '').replace(/_/g, ' ');
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return { url, name, rarityKey: rarity, rarityLabel: config.label, rarityColor: config.color };
}

function iniciarRoleta(finalUrl, overlayMessage) {
  const overlay = document.createElement('div');
  overlay.className = 'gacha-overlay';
  document.body.appendChild(overlay);

  const allAvatars = [];
  Object.values(AVATARES).forEach(list => allAvatars.push(...list));

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
  const nameEl    = overlay.querySelector('.gacha-name');
  const rarityEl  = overlay.querySelector('.gacha-rarity');
  const btnClose  = overlay.querySelector('.btn-close-reward');
  btnClose.onclick = () => overlay.remove();

  let steps = 0;
  const maxSteps = 30;
  let speed = 50;

  function updateDisplay(url) {
    const info = getAvatarInfo(url);
    mediaWrap.innerHTML = url.endsWith('.webm') || url.endsWith('.mp4')
      ? `<video src="${url}" autoplay loop muted class="gacha-img"></video>`
      : `<img src="${url}" class="gacha-img" alt="${info.name}">`;
    nameEl.textContent         = info.name;
    rarityEl.textContent       = info.rarityLabel;
    rarityEl.style.color       = info.rarityColor;
    rarityEl.style.borderColor = info.rarityColor;
    const card = overlay.querySelector('.gacha-card');
    card.classList.remove('pulse');
    void card.offsetWidth;
    card.classList.add('pulse');
  }

  function cycle() {
    steps++;
    if (steps >= maxSteps) {
      updateDisplay(finalUrl);
      overlay.querySelector('.gacha-card').classList.add('finished');
      if (overlayMessage) {
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = 'color:#ffd700;font-weight:800;margin-top:10px;font-size:0.9rem;';
        msgDiv.textContent = overlayMessage;
        overlay.querySelector('.gacha-info').appendChild(msgDiv);
      }
      btnClose.style.display = 'inline-block';
      return;
    }
    updateDisplay(allAvatars[Math.floor(Math.random() * allAvatars.length)]);
    speed += steps > maxSteps - 8 ? 60 : 5;
    setTimeout(cycle, speed);
  }
  cycle();
}

function mostrarAnimacaoEstilo(finalStyleId, overlayMessage) {
  const overlay = document.createElement('div');
  overlay.className = 'gacha-overlay';
  document.body.appendChild(overlay);

  const allStyles = Object.values(NAME_STYLES);

  overlay.innerHTML = `
    <div class="gacha-container">
      <div class="gacha-card" style="padding: 40px 20px;">
        <div class="name-style-preview" style="font-size: 2.5rem; margin-bottom: 20px;">Sorteando...</div>
        <div class="gacha-info">
          <div class="gacha-name">...</div>
          <div class="gacha-rarity">...</div>
        </div>
      </div>
      <button class="btn-close-reward" style="display:none; margin-top:20px;">Fechar</button>
    </div>
  `;

  const previewEl = overlay.querySelector('.name-style-preview');
  const nameEl    = overlay.querySelector('.gacha-name');
  const rarityEl  = overlay.querySelector('.gacha-rarity');
  const btnClose  = overlay.querySelector('.btn-close-reward');
  btnClose.onclick = () => overlay.remove();

  let steps = 0;
  const maxSteps = 30;
  let speed = 50;

  function getRarityColor(rarityLabel) {
    for (const key in NAME_STYLE_RARITY_CONFIG) {
      if (NAME_STYLE_RARITY_CONFIG[key].label.toLowerCase() === rarityLabel.toLowerCase()) {
        return NAME_STYLE_RARITY_CONFIG[key].color;
      }
    }
    return '#ccc';
  }

  function updateDisplay(styleInfo) {
    previewEl.style.cssText = 'font-size: 2.5rem; margin-bottom: 20px;';
    previewEl.className = 'name-style-preview';
    if (styleInfo.style)     previewEl.style.cssText += styleInfo.style;
    if (styleInfo.className) previewEl.classList.add(styleInfo.className);
    previewEl.textContent = 'Anigma';
    if (styleInfo.dataText) previewEl.setAttribute('data-text', 'Anigma');
    nameEl.textContent         = styleInfo.name;
    rarityEl.textContent       = styleInfo.rarity;
    rarityEl.style.color       = getRarityColor(styleInfo.rarity);
    rarityEl.style.borderColor = getRarityColor(styleInfo.rarity);
    const card = overlay.querySelector('.gacha-card');
    card.classList.remove('pulse');
    void card.offsetWidth;
    card.classList.add('pulse');
  }

  function cycle() {
    steps++;
    if (steps >= maxSteps) {
      const finalStyleInfo = NAME_STYLES[finalStyleId];
      if (!finalStyleInfo) { overlay.remove(); return; }
      updateDisplay(finalStyleInfo);
      overlay.querySelector('.gacha-card').classList.add('finished');
      if (overlayMessage) {
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = 'color:#ffd700;font-weight:800;margin-top:10px;font-size:0.9rem;';
        msgDiv.textContent = overlayMessage;
        overlay.querySelector('.gacha-info').appendChild(msgDiv);
      }
      btnClose.style.display = 'inline-block';
      return;
    }
    updateDisplay(allStyles[Math.floor(Math.random() * allStyles.length)]);
    speed += steps > maxSteps - 8 ? 60 : 5;
    setTimeout(cycle, speed);
  }
  cycle();
}