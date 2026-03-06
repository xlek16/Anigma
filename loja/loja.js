// loja.js — atualizado para novas tabelas

let isPurchasing = false;

// ── COMPRAR TEMA ──────────────────────────────────────────────
async function comprarTema(temaId, custoDiamantes) {
  if (isPurchasing) return;
  const btn = event.currentTarget;
  const textoOriginal = btn.innerHTML;

  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) { alert('Precisas de fazer login para comprar na loja.'); window.location.href = '../login.html'; return; }

  let unlockedLocal = [];
  try { const s = localStorage.getItem('anigma_unlocked_themes'); if (s) unlockedLocal = JSON.parse(s); } catch(e) {}
  if (unlockedLocal.includes(temaId)) { alert('Já tens este tema desbloqueado!'); return; }
  if (!confirm(`Desbloquear o tema por ${custoDiamantes} 💎?`)) return;

  try {
    isPurchasing = true; btn.disabled = true; btn.textContent = 'A processar...';

    // Buscar diamantes de profile_stats e temas de profile_cosmetics
    const [statsRes, cosmeticsRes] = await Promise.all([
      window.supabaseClient.from('profile_stats').select('diamantes').eq('user_id', session.user.id).single(),
      window.supabaseClient.from('profile_cosmetics').select('unlocked_themes').eq('user_id', session.user.id).single(),
    ]);

    if (statsRes.error) throw statsRes.error;
    const stats    = statsRes.data;
    const cosmetics = cosmeticsRes.data;

    if ((stats.diamantes || 0) < custoDiamantes) {
      alert(`Não tens diamantes suficientes! (Tens: ${stats.diamantes || 0}, Custo: ${custoDiamantes})`);
      btn.disabled = false; btn.innerHTML = textoOriginal; isPurchasing = false; return;
    }

    const unlockedDB = Array.isArray(cosmetics?.unlocked_themes) ? cosmetics.unlocked_themes : [];
    if (unlockedDB.includes(temaId)) {
      alert('Já tens este tema desbloqueado!'); btn.disabled = false; btn.innerHTML = textoOriginal; isPurchasing = false; return;
    }

    const novosDiamantes = (stats.diamantes || 0) - custoDiamantes;
    const novosThemes    = [...unlockedDB, temaId];

    // Atualizar diamantes em profile_stats, temas em profile_cosmetics
    const [statsUpd, cosmeticsUpd] = await Promise.all([
      window.supabaseClient.from('profile_stats').update({ diamantes: novosDiamantes }).eq('user_id', session.user.id),
      window.supabaseClient.from('profile_cosmetics').update({ unlocked_themes: novosThemes }).eq('user_id', session.user.id),
    ]);

    if (statsUpd.error) throw statsUpd.error;
    if (cosmeticsUpd.error) throw cosmeticsUpd.error;

    localStorage.setItem('anigma_unlocked_themes', JSON.stringify(novosThemes));
    if (typeof atualizarHeaderStats === 'function') atualizarHeaderStats(novosDiamantes, null);
    if (typeof updateThemeMenu === 'function') {
      // Atualiza a lista local de temas desbloqueados
      if (typeof _temasDesbloqueados !== 'undefined') _temasDesbloqueados.push(temaId);
      updateThemeMenu();
    }

    btn.textContent = '✅ Desbloqueado!';
    btn.style.background = 'rgba(255,255,255,0.1)'; btn.style.color = 'rgba(255,255,255,0.5)'; btn.style.cursor = 'not-allowed';
    setTimeout(() => {
      if (confirm(`Tema desbloqueado! Queres aplicá-lo agora?`)) { if (typeof setTheme === 'function') setTheme(temaId); }
      isPurchasing = false;
    }, 500);

  } catch (e) {
    console.error('Erro ao comprar tema:', e); alert('Erro: ' + e.message);
    btn.disabled = false; btn.innerHTML = textoOriginal; isPurchasing = false;
  }
}

// ── COMPRAR ITEM (caixas avatar / estilos de nome) ────────────
async function comprarItem(itemId, custoDiamantes, ganhoPontos = 0) {
  if (isPurchasing) { console.warn("Compra já em progresso."); return; }
  const btn = event.currentTarget;
  const textoOriginal = btn.innerHTML;

  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) { alert('Precisas de fazer login para comprar na loja.'); window.location.href = '../login.html'; return; }

  try {
    isPurchasing = true; btn.disabled = true; btn.textContent = 'A processar...';

    if (typeof AVATARES === 'undefined' || typeof RARITY_CONFIG === 'undefined') throw new Error('Erro de configuração: avatars.js não carregado.');

    // Buscar dados das tabelas corretas
    const [statsRes, cosmeticsRes] = await Promise.all([
      window.supabaseClient.from('profile_stats').select('diamantes, pontos_totais').eq('user_id', session.user.id).single(),
      window.supabaseClient.from('profile_cosmetics').select('unlocked_avatars, unlocked_name_styles').eq('user_id', session.user.id).single(),
    ]);

    if (statsRes.error) throw statsRes.error;
    const stats     = statsRes.data;
    const cosmetics = cosmeticsRes.data || {};

    if ((stats.diamantes || 0) < custoDiamantes) {
      alert(`Não tens diamantes suficientes! (Tens: ${stats.diamantes || 0}, Custo: ${custoDiamantes})`);
      btn.disabled = false; btn.innerHTML = textoOriginal; isPurchasing = false; return;
    }

    let novosDiamantes  = (stats.diamantes || 0) - custoDiamantes;
    let statsUpdate     = { diamantes: novosDiamantes };
    let cosmeticsUpdate = {};
    let successMessage  = 'Comprado!';
    let avatarGanhoUrl  = null;
    let estiloGanhoId   = null;
    let overlayMessage  = '';

    if (itemId.startsWith('caixa_avatar_')) {
      const rand = Math.random() * 100;
      let rarity = 'easy';
      if      (rand < RARITY_CONFIG.easy.chance) rarity = 'easy';
      else if (rand < RARITY_CONFIG.easy.chance + RARITY_CONFIG.medium.chance) rarity = 'medium';
      else if (rand < RARITY_CONFIG.easy.chance + RARITY_CONFIG.medium.chance + RARITY_CONFIG.hard.chance) rarity = 'hard';
      else rarity = 'impossible';

      const pool = AVATARES[rarity];
      if (!pool || pool.length === 0) throw new Error(`Pool de avatares vazia: ${rarity}`);

      const avatarGanho = pool[Math.floor(Math.random() * pool.length)];
      const unlocked    = Array.isArray(cosmetics.unlocked_avatars) ? cosmetics.unlocked_avatars : [];
      avatarGanhoUrl    = avatarGanho;

      if (unlocked.includes(avatarGanho)) {
        const refunds = { easy:15, medium:25, hard:40, impossible:75 };
        const refund  = refunds[rarity] || 15;
        novosDiamantes += refund; statsUpdate.diamantes = novosDiamantes;
        successMessage = `Repetido! +${refund} 💎`; overlayMessage = `Repetido! Reembolso: ${refund} 💎`;
      } else {
        cosmeticsUpdate.unlocked_avatars = [...unlocked, avatarGanho];
        successMessage = 'Novo Avatar!';
      }

    } else if (itemId.startsWith('caixa_nome_')) {
      if (typeof NAME_STYLES === 'undefined' || typeof NAME_STYLE_RARITY_CONFIG === 'undefined') throw new Error('Erro de configuração: nameStyles.js não carregado.');

      const rand = Math.random() * 100;
      let rarityKey = 'comum';
      if      (rand < NAME_STYLE_RARITY_CONFIG.comum.chance) rarityKey = 'comum';
      else if (rand < NAME_STYLE_RARITY_CONFIG.comum.chance + NAME_STYLE_RARITY_CONFIG.raro.chance) rarityKey = 'raro';
      else if (rand < NAME_STYLE_RARITY_CONFIG.comum.chance + NAME_STYLE_RARITY_CONFIG.raro.chance + NAME_STYLE_RARITY_CONFIG.epico.chance) rarityKey = 'epico';
      else rarityKey = 'lendario';

      const rarityLabel = NAME_STYLE_RARITY_CONFIG[rarityKey].label;
      const pool = Object.values(NAME_STYLES).filter(s => s.rarity.toLowerCase() === rarityLabel.toLowerCase());
      if (!pool || pool.length === 0) throw new Error(`Pool de estilos vazia: ${rarityLabel}`);

      const estiloGanho = pool[Math.floor(Math.random() * pool.length)];
      const unlocked    = Array.isArray(cosmetics.unlocked_name_styles) ? cosmetics.unlocked_name_styles : [];
      estiloGanhoId     = estiloGanho.id;

      if (unlocked.includes(estiloGanhoId)) {
        const refunds = { comum:10, raro:25, epico:40, lendario:75 };
        const refund  = refunds[rarityKey] || 10;
        novosDiamantes += refund; statsUpdate.diamantes = novosDiamantes;
        successMessage = `Repetido! +${refund} 💎`; overlayMessage = `Estilo Repetido! Reembolso: ${refund} 💎`;
      } else {
        cosmeticsUpdate.unlocked_name_styles = [...unlocked, estiloGanhoId];
        successMessage = 'Novo Estilo!';
      }
    }

    // Guardar nas tabelas corretas
    const ops = [window.supabaseClient.from('profile_stats').update(statsUpdate).eq('user_id', session.user.id)];
    if (Object.keys(cosmeticsUpdate).length) ops.push(window.supabaseClient.from('profile_cosmetics').update(cosmeticsUpdate).eq('user_id', session.user.id));
    const results = await Promise.all(ops);
    if (results.some(r => r.error)) throw new Error('Erro ao atualizar: ' + results.find(r=>r.error)?.error?.message);

    btn.style.background = '#4ade80'; btn.textContent = successMessage;
    if (typeof atualizarHeaderStats === 'function') atualizarHeaderStats(novosDiamantes, stats.pontos_totais);

    if (avatarGanhoUrl) mostrarAnimacaoCaixa(avatarGanhoUrl, overlayMessage);
    if (estiloGanhoId)  mostrarAnimacaoEstilo(estiloGanhoId, overlayMessage);

    setTimeout(() => { btn.disabled=false; btn.innerHTML=textoOriginal; btn.style.background=''; isPurchasing=false; }, 2000);

  } catch (e) {
    console.error('Erro na compra:', e); alert('Erro: ' + e.message);
    btn.disabled=false; btn.innerHTML=textoOriginal; isPurchasing=false;
  }
}

// ── Animação caixa avatar ─────────────────────────────────────
function mostrarAnimacaoCaixa(avatarUrl, overlayMessage) {
  const overlay = document.createElement('div');
  overlay.className = 'box-animation-overlay';
  overlay.innerHTML = `<video autoplay muted playsinline class="box-video"><source src="https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/219846.webm" type="video/webm"></video>`;
  document.body.appendChild(overlay);
  setTimeout(() => { if (document.body.contains(overlay)) overlay.remove(); iniciarRoleta(avatarUrl, overlayMessage); }, 3500);
}

function getAvatarInfo(url) {
  let rarity = 'easy';
  for (const [key, list] of Object.entries(AVATARES)) { if (list.includes(url)) { rarity = key; break; } }
  const config = RARITY_CONFIG[rarity];
  const filename = url.split('/').pop().split('.')[0];
  let name = filename.replace('avatar_','').replace(/_/g,' ');
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return { url, name, rarityKey: rarity, rarityLabel: config.label, rarityColor: config.color };
}

function iniciarRoleta(finalUrl, overlayMessage) {
  const overlay = document.createElement('div'); overlay.className = 'gacha-overlay'; document.body.appendChild(overlay);
  const allAvatars = []; Object.values(AVATARES).forEach(list => allAvatars.push(...list));
  overlay.innerHTML = `<div class="gacha-container"><div class="gacha-card"><div class="gacha-media-wrap"></div><div class="gacha-info"><div class="gacha-name">Sorteando...</div><div class="gacha-rarity">...</div></div></div><button class="btn-close-reward" style="display:none;margin-top:20px;">Fechar</button></div>`;
  const mediaWrap=overlay.querySelector('.gacha-media-wrap'), nameEl=overlay.querySelector('.gacha-name'), rarityEl=overlay.querySelector('.gacha-rarity'), btnClose=overlay.querySelector('.btn-close-reward');
  btnClose.onclick = () => overlay.remove();
  let steps=0, speed=50;
  function updateDisplay(url) {
    const info=getAvatarInfo(url);
    mediaWrap.innerHTML = url.endsWith('.webm')||url.endsWith('.mp4') ? `<video src="${url}" autoplay loop muted class="gacha-img"></video>` : `<img src="${url}" class="gacha-img" alt="${info.name}">`;
    nameEl.textContent=info.name; rarityEl.textContent=info.rarityLabel; rarityEl.style.color=info.rarityColor; rarityEl.style.borderColor=info.rarityColor;
    const card=overlay.querySelector('.gacha-card'); card.classList.remove('pulse'); void card.offsetWidth; card.classList.add('pulse');
  }
  function cycle() {
    steps++;
    if (steps>=30) {
      updateDisplay(finalUrl); overlay.querySelector('.gacha-card').classList.add('finished');
      if (overlayMessage) { const d=document.createElement('div'); d.style.cssText='color:#ffd700;font-weight:800;margin-top:10px;font-size:0.9rem;'; d.textContent=overlayMessage; overlay.querySelector('.gacha-info').appendChild(d); }
      btnClose.style.display='inline-block'; return;
    }
    updateDisplay(allAvatars[Math.floor(Math.random()*allAvatars.length)]);
    speed += steps>22 ? 60 : 5; setTimeout(cycle, speed);
  }
  cycle();
}

function mostrarAnimacaoEstilo(finalStyleId, overlayMessage) {
  const overlay = document.createElement('div'); overlay.className = 'gacha-overlay'; document.body.appendChild(overlay);
  const allStyles = Object.values(NAME_STYLES);
  overlay.innerHTML = `<div class="gacha-container"><div class="gacha-card" style="padding:40px 20px;"><div class="name-style-preview" style="font-size:2.5rem;margin-bottom:20px;">Sorteando...</div><div class="gacha-info"><div class="gacha-name">...</div><div class="gacha-rarity">...</div></div></div><button class="btn-close-reward" style="display:none;margin-top:20px;">Fechar</button></div>`;
  const previewEl=overlay.querySelector('.name-style-preview'), nameEl=overlay.querySelector('.gacha-name'), rarityEl=overlay.querySelector('.gacha-rarity'), btnClose=overlay.querySelector('.btn-close-reward');
  btnClose.onclick = () => overlay.remove();
  function getRarityColor(label) { for(const k in NAME_STYLE_RARITY_CONFIG){if(NAME_STYLE_RARITY_CONFIG[k].label.toLowerCase()===label.toLowerCase())return NAME_STYLE_RARITY_CONFIG[k].color;} return '#ccc'; }
  function updateDisplay(s) {
    previewEl.style.cssText='font-size:2.5rem;margin-bottom:20px;'; previewEl.className='name-style-preview';
    if(s.style) previewEl.style.cssText+=s.style; if(s.className) previewEl.classList.add(s.className);
    previewEl.textContent='Anigma'; if(s.dataText) previewEl.setAttribute('data-text','Anigma');
    nameEl.textContent=s.name; rarityEl.textContent=s.rarity; rarityEl.style.color=getRarityColor(s.rarity); rarityEl.style.borderColor=getRarityColor(s.rarity);
    const card=overlay.querySelector('.gacha-card'); card.classList.remove('pulse'); void card.offsetWidth; card.classList.add('pulse');
  }
  let steps=0, speed=50;
  function cycle() {
    steps++;
    if(steps>=30){
      const fs=NAME_STYLES[finalStyleId]; if(!fs){overlay.remove();return;}
      updateDisplay(fs); overlay.querySelector('.gacha-card').classList.add('finished');
      if(overlayMessage){const d=document.createElement('div');d.style.cssText='color:#ffd700;font-weight:800;margin-top:10px;font-size:0.9rem;';d.textContent=overlayMessage;overlay.querySelector('.gacha-info').appendChild(d);}
      btnClose.style.display='inline-block'; return;
    }
    updateDisplay(allStyles[Math.floor(Math.random()*allStyles.length)]);
    speed+=steps>22?60:5; setTimeout(cycle,speed);
  }
  cycle();
}

// ════════════════════════════════════════════════════════════
// COMPRAR TÍTULO
// ════════════════════════════════════════════════════════════
async function comprarTitulo(tituloId, tituloNome, custoDiamantes) {
  if (isPurchasing) return;
  const btn = event.currentTarget;
  const textoOriginal = btn.innerHTML;

  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) { alert('Precisas de fazer login.'); window.location.href = '../login.html'; return; }
  if (!confirm(`Comprar o título "${tituloNome}" por ${custoDiamantes} 💎?`)) return;

  try {
    isPurchasing = true; btn.disabled = true; btn.textContent = 'A processar...';

    const [statsRes, cosmeticsRes] = await Promise.all([
      window.supabaseClient.from('profile_stats').select('diamantes').eq('user_id', session.user.id).single(),
      window.supabaseClient.from('profile_cosmetics').select('unlocked_titles').eq('user_id', session.user.id).single(),
    ]);

    const stats     = statsRes.data;
    const cosmetics = cosmeticsRes.data || {};
    const unlocked  = Array.isArray(cosmetics.unlocked_titles) ? cosmetics.unlocked_titles : [];

    if (unlocked.includes(tituloId)) { alert('Já tens este título!'); btn.disabled=false; btn.innerHTML=textoOriginal; isPurchasing=false; return; }
    if ((stats.diamantes || 0) < custoDiamantes) { alert(`Diamantes insuficientes! (Tens: ${stats.diamantes||0})`); btn.disabled=false; btn.innerHTML=textoOriginal; isPurchasing=false; return; }

    const novosDiamantes = (stats.diamantes || 0) - custoDiamantes;
    const novosTitulos   = [...unlocked, tituloId];

    await Promise.all([
      window.supabaseClient.from('profile_stats').update({ diamantes: novosDiamantes }).eq('user_id', session.user.id),
      window.supabaseClient.from('profile_cosmetics').update({ unlocked_titles: novosTitulos }).eq('user_id', session.user.id),
    ]);

    if (typeof atualizarHeaderStats === 'function') atualizarHeaderStats(novosDiamantes, null);
    btn.textContent='✅ Comprado!'; btn.style.cssText='background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);cursor:not-allowed;';
    setTimeout(() => { isPurchasing=false; }, 1500);
  } catch(e) { console.error(e); alert('Erro: '+e.message); btn.disabled=false; btn.innerHTML=textoOriginal; isPurchasing=false; }
}

// ════════════════════════════════════════════════════════════
// COMPRAR PACOTE DE DIAMANTES
// ════════════════════════════════════════════════════════════
async function comprarPacoteDiamantes(quantidade, custoDiamantes) {
  if (isPurchasing) return;
  const btn = event.currentTarget;
  const textoOriginal = btn.innerHTML;

  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) { alert('Precisas de fazer login.'); window.location.href = '../login.html'; return; }
  if (!confirm(`Comprar pacote de ${quantidade} 💎 por ${custoDiamantes} 💎?\n(Troca diamantes por mais diamantes com bónus)`) ) return;

  try {
    isPurchasing=true; btn.disabled=true; btn.textContent='A processar...';
    const { data: stats, error } = await window.supabaseClient.from('profile_stats').select('diamantes').eq('user_id', session.user.id).single();
    if (error) throw error;
    if ((stats.diamantes||0) < custoDiamantes) { alert(`Diamantes insuficientes! (Tens: ${stats.diamantes||0})`); btn.disabled=false; btn.innerHTML=textoOriginal; isPurchasing=false; return; }
    const novos = (stats.diamantes||0) - custoDiamantes + quantidade;
    await window.supabaseClient.from('profile_stats').update({ diamantes: novos }).eq('user_id', session.user.id);
    if (typeof atualizarHeaderStats === 'function') atualizarHeaderStats(novos, null);
    btn.textContent=`✅ +${quantidade} 💎`;  btn.style.background='#4ade80';
    setTimeout(()=>{ btn.disabled=false; btn.innerHTML=textoOriginal; btn.style.background=''; isPurchasing=false; }, 2500);
  } catch(e) { console.error(e); alert('Erro: '+e.message); btn.disabled=false; btn.innerHTML=textoOriginal; isPurchasing=false; }
}

// ════════════════════════════════════════════════════════════
// COMPRAR BOOSTER XP
// ════════════════════════════════════════════════════════════
async function comprarBoosterXP(multiplicador, duracaoHoras, custoDiamantes) {
  if (isPurchasing) return;
  const btn = event.currentTarget;
  const textoOriginal = btn.innerHTML;

  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) { alert('Precisas de fazer login.'); window.location.href = '../login.html'; return; }
  if (!confirm(`Ativar Booster ${multiplicador}x XP por ${duracaoHoras}h por ${custoDiamantes} 💎?`)) return;

  try {
    isPurchasing=true; btn.disabled=true; btn.textContent='A ativar...';
    const { data: stats, error } = await window.supabaseClient.from('profile_stats').select('diamantes').eq('user_id', session.user.id).single();
    if (error) throw error;
    if ((stats.diamantes||0) < custoDiamantes) { alert(`Diamantes insuficientes! (Tens: ${stats.diamantes||0})`); btn.disabled=false; btn.innerHTML=textoOriginal; isPurchasing=false; return; }

    const novosDiamantes = (stats.diamantes||0) - custoDiamantes;
    const expira = new Date(Date.now() + duracaoHoras * 3600000).toISOString();

    // Guardar booster no localStorage (pode mover para DB se quiseres persistência total)
    const boosterKey = 'anigma_xp_booster';
    const boosterAtual = JSON.parse(localStorage.getItem(boosterKey) || '{}');
    const expiraAtual = boosterAtual.expira ? new Date(boosterAtual.expira) : new Date(0);
    const base = expiraAtual > new Date() ? expiraAtual : new Date();
    const novaExpiracao = new Date(base.getTime() + duracaoHoras * 3600000).toISOString();

    localStorage.setItem(boosterKey, JSON.stringify({ multiplicador, expira: novaExpiracao }));
    await window.supabaseClient.from('profile_stats').update({ diamantes: novosDiamantes }).eq('user_id', session.user.id);
    if (typeof atualizarHeaderStats === 'function') atualizarHeaderStats(novosDiamantes, null);

    btn.textContent=`✅ Ativo por ${duracaoHoras}h!`; btn.style.background='#a78bfa';
    setTimeout(()=>{ btn.disabled=false; btn.innerHTML=textoOriginal; btn.style.background=''; isPurchasing=false; }, 2500);
  } catch(e) { console.error(e); alert('Erro: '+e.message); btn.disabled=false; btn.innerHTML=textoOriginal; isPurchasing=false; }
}

// ════════════════════════════════════════════════════════════
// COMPRAR FRAME DE PERFIL
// ════════════════════════════════════════════════════════════
async function comprarFrame(frameId, frameNome, custoDiamantes) {
  if (isPurchasing) return;
  const btn = event.currentTarget;
  const textoOriginal = btn.innerHTML;

  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) { alert('Precisas de fazer login.'); window.location.href = '../login.html'; return; }
  if (!confirm(`Comprar frame "${frameNome}" por ${custoDiamantes} 💎?`)) return;

  try {
    isPurchasing=true; btn.disabled=true; btn.textContent='A processar...';
    const [statsRes, cosmeticsRes] = await Promise.all([
      window.supabaseClient.from('profile_stats').select('diamantes').eq('user_id', session.user.id).single(),
      window.supabaseClient.from('profile_cosmetics').select('unlocked_frames').eq('user_id', session.user.id).single(),
    ]);
    const stats     = statsRes.data, cosmetics = cosmeticsRes.data || {};
    const unlocked  = Array.isArray(cosmetics.unlocked_frames) ? cosmetics.unlocked_frames : [];
    if (unlocked.includes(frameId)) { alert('Já tens esta frame!'); btn.disabled=false; btn.innerHTML=textoOriginal; isPurchasing=false; return; }
    if ((stats.diamantes||0) < custoDiamantes) { alert(`Diamantes insuficientes! (Tens: ${stats.diamantes||0})`); btn.disabled=false; btn.innerHTML=textoOriginal; isPurchasing=false; return; }
    const novosDiamantes = (stats.diamantes||0) - custoDiamantes;
    const novosFrames    = [...unlocked, frameId];
    await Promise.all([
      window.supabaseClient.from('profile_stats').update({ diamantes: novosDiamantes }).eq('user_id', session.user.id),
      window.supabaseClient.from('profile_cosmetics').update({ unlocked_frames: novosFrames }).eq('user_id', session.user.id),
    ]);
    if (typeof atualizarHeaderStats === 'function') atualizarHeaderStats(novosDiamantes, null);
    btn.textContent='✅ Comprado!'; btn.style.cssText='background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);cursor:not-allowed;';
    setTimeout(()=>{ isPurchasing=false; }, 1500);
  } catch(e) { console.error(e); alert('Erro: '+e.message); btn.disabled=false; btn.innerHTML=textoOriginal; isPurchasing=false; }
}

// ── Verificar booster XP ativo ────────────────────────────────
// Chama isto nos jogos antes de dar XP ao Season Pass
window.getBoosterXP = function() {
  try {
    const b = JSON.parse(localStorage.getItem('anigma_xp_booster') || '{}');
    if (b.expira && new Date(b.expira) > new Date()) return b.multiplicador || 1;
  } catch(e) {}
  return 1;
};

window.getBoosterInfo = function() {
  try {
    const b = JSON.parse(localStorage.getItem('anigma_xp_booster') || '{}');
    if (b.expira && new Date(b.expira) > new Date()) {
      const diff = new Date(b.expira) - new Date();
      const h = Math.floor(diff/3600000), m = Math.floor((diff%3600000)/60000);
      return { ativo: true, multiplicador: b.multiplicador, restante: `${h}h ${m}m` };
    }
  } catch(e) {}
  return { ativo: false };
};