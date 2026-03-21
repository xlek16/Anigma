// achievements.js — ANIGMA

// ── Raridade ──────────────────────────────────────────────────
const ACHIEVEMENT_RARITY = {
  bronze: { label: 'Bronze', color: '#cd7f32', glow: 'rgba(205,127,50,0.3)' },
  prata: { label: 'Prata', color: '#b0b8c8', glow: 'rgba(176,184,200,0.3)' },
  ouro: { label: 'Ouro', color: '#ffd700', glow: 'rgba(255,215,0,0.3)' },
  diamante: { label: 'Diamante', color: '#38bdf8', glow: 'rgba(56,189,248,0.3)' },
  lendario: { label: 'Lendário', color: '#a78bfa', glow: 'rgba(167,139,250,0.35)' },
};

// ── Fórmula de nível (igual ao perfil.js) ────────────────────
function _calcLevel(pts) {
  return Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * pts) / 250)) / 2));
}

// ── Conquistas ────────────────────────────────────────────────
const ACHIEVEMENTS = {

  // ═══════════ NÍVEL ═══════════════════════════════════════
  nivel_5: {
    name: 'Pupilo',
    description: 'Alcança o nível 5. O treino começa.',
    icon: '📘', rarity: 'bronze',
    reward: { diamonds: 30 },
    check: (p) => _calcLevel(p.pontos_totais || 0) >= 5,
  },
  nivel_15: {
    name: 'Ninja Genin',
    description: 'Alcança o nível 15. Passaste no exame Chūnin.',
    icon: '🥷', rarity: 'bronze',
    reward: { diamonds: 75 },
    check: (p) => _calcLevel(p.pontos_totais || 0) >= 15,
  },
  nivel_30: {
    name: 'Capitão da Soul Society',
    description: 'Alcança o nível 30. A Soul Society aceita-te.',
    icon: '⚔️', rarity: 'prata',
    reward: { diamonds: 150, title: 'Capitão' },
    check: (p) => _calcLevel(p.pontos_totais || 0) >= 30,
  },
  nivel_50: {
    name: 'Guerreiro Z',
    description: 'Alcança o nível 50. O teu ki transborda.',
    icon: '💥', rarity: 'ouro',
    reward: { diamonds: 400, title: 'Guerreiro Z' },
    check: (p) => _calcLevel(p.pontos_totais || 0) >= 50,
  },
  nivel_75: {
    name: 'Hashira',
    description: 'Alcança o nível 75. Apenas 9 em todo o Japão.',
    icon: '🗡️', rarity: 'diamante',
    reward: { diamonds: 800, title: 'Hashira' },
    check: (p) => _calcLevel(p.pontos_totais || 0) >= 75,
  },
  nivel_100: {
    name: 'Rei dos Piratas',
    description: 'Alcança o nível 100. Conquistaste o mundo.',
    icon: '👑', rarity: 'lendario',
    reward: { diamonds: 2000, title: 'Rei dos Piratas' },
    check: (p) => _calcLevel(p.pontos_totais || 0) >= 100,
  },

  // ═══════════ PONTOS TOTAIS ════════════════════════════════
  pontos_5k: {
    name: 'Iniciante Determinado',
    description: 'Acumula 5.000 pontos totais.',
    icon: '⭐', rarity: 'bronze',
    reward: { diamonds: 50 },
    check: (p) => (p.pontos_totais || 0) >= 5000,
  },
  pontos_25k: {
    name: 'Veterano do Campo de Batalha',
    description: 'Acumula 25.000 pontos. Sobreviveste a muitos combates.',
    icon: '🌟', rarity: 'prata',
    reward: { diamonds: 150, title: 'Veterano' },
    check: (p) => (p.pontos_totais || 0) >= 25000,
  },
  pontos_100k: {
    name: 'Lendário',
    description: 'Acumula 100.000 pontos. O teu nome ficará na história.',
    icon: '🏅', rarity: 'ouro',
    reward: { diamonds: 600, title: 'Lendário' },
    check: (p) => (p.pontos_totais || 0) >= 100000,
  },
  pontos_500k: {
    name: 'Ultra Instinto',
    description: 'Acumula 500.000 pontos. Transcendeste os teus limites.',
    icon: '✨', rarity: 'lendario',
    reward: { diamonds: 3000, title: 'Ultra Instinto' },
    check: (p) => (p.pontos_totais || 0) >= 500000,
  },

  // ═══════════ STREAK ═══════════════════════════════════════
  streak_7: {
    name: 'Semana de Treino',
    description: 'Joga 7 dias seguidos. A disciplina começa aqui.',
    icon: '🔥', rarity: 'bronze',
    reward: { diamonds: 100 },
    check: (p) => (p.current_streak || 0) >= 7,
  },
  streak_30: {
    name: 'Modo de Treinamento Duro',
    description: 'Joga 30 dias seguidos. Rock Lee treinaria orgulhoso.',
    icon: '💪', rarity: 'prata',
    reward: { diamonds: 350, title: 'Discípulo' },
    check: (p) => (p.current_streak || 0) >= 30,
  },
  streak_100: {
    name: 'Asceta',
    description: 'Joga 100 dias seguidos. Dedicação sobre-humana.',
    icon: '🧘', rarity: 'ouro',
    reward: { diamonds: 1200, title: 'Asceta' },
    check: (p) => (p.current_streak || 0) >= 100,
  },
  streak_365: {
    name: 'Imortal',
    description: 'Joga 365 dias seguidos. Um ano inteiro. Impossível?',
    icon: '♾️', rarity: 'lendario',
    reward: { diamonds: 10000, title: 'Imortal' },
    check: (p) => (p.current_streak || 0) >= 365,
  },

  // ═══════════ DRAGON BALL ══════════════════════════════════
  db_50: {
    name: 'Estudante de Kame House',
    description: 'Joga Dragon Ball 50 vezes.',
    icon: '🐢', rarity: 'bronze',
    reward: { diamonds: 75 },
    check: (p) => (p.tentativas_db || 0) >= 50,
  },
  db_200: {
    name: 'Saiyajin de Elite',
    description: 'Joga Dragon Ball 200 vezes. O teu poder de combate é real.',
    icon: '🔵', rarity: 'prata',
    reward: { diamonds: 250, title: 'Saiyajin de Elite' },
    check: (p) => (p.tentativas_db || 0) >= 200,
  },
  db_500: {
    name: 'Filho do Kakaroto',
    description: 'Joga Dragon Ball 500 vezes. Tornaste-te a lenda.',
    icon: '💫', rarity: 'ouro',
    reward: { diamonds: 700, title: 'Super Saiyajin' },
    check: (p) => (p.tentativas_db || 0) >= 500,
  },
  db_pontos_50k: {
    name: 'Torneio das Artes Marciais',
    description: 'Acumula 50.000 pontos no modo Dragon Ball.',
    icon: '🏆', rarity: 'ouro',
    reward: { diamonds: 500 },
    check: (p) => (p.pontos_db || 0) >= 50000,
  },

  // ═══════════ JUJUTSU KAISEN ═══════════════════════════════
  jjk_50: {
    name: 'Estudante de Jujutsu',
    description: 'Joga JJK 50 vezes. A Escola Superior aceita-te.',
    icon: '🟣', rarity: 'bronze',
    reward: { diamonds: 75 },
    check: (p) => (p.tentativas_jjk || 0) >= 50,
  },
  jjk_200: {
    name: 'Feiticeiro de Grau 2',
    description: 'Joga JJK 200 vezes. As maldições temem-te.',
    icon: '🗡️', rarity: 'prata',
    reward: { diamonds: 250, title: 'Feiticeiro' },
    check: (p) => (p.tentativas_jjk || 0) >= 200,
  },
  jjk_500: {
    name: 'Grau Especial',
    description: 'Joga JJK 500 vezes. Apenas 4 no mundo inteiro.',
    icon: '☄️', rarity: 'ouro',
    reward: { diamonds: 700, title: 'Grau Especial' },
    check: (p) => (p.tentativas_jjk || 0) >= 500,
  },

  // ═══════════ COLEÇÃO ══════════════════════════════════════
  avatar_10: {
    name: 'Colecionador Casual',
    description: 'Desbloqueia 10 avatares diferentes.',
    icon: '🖼️', rarity: 'bronze',
    reward: { diamonds: 100 },
    check: (p) => (p.unlocked_avatars?.length || 0) >= 10,
  },
  avatar_25: {
    name: 'Colecionador Dedicado',
    description: 'Desbloqueia 25 avatares.',
    icon: '🎨', rarity: 'prata',
    reward: { diamonds: 300, title: 'Colecionador' },
    check: (p) => (p.unlocked_avatars?.length || 0) >= 25,
  },
  avatar_50: {
    name: 'Museu de Anime',
    description: 'Desbloqueia 50 avatares. Uma obra de arte.',
    icon: '🏛️', rarity: 'ouro',
    reward: { diamonds: 800, title: 'Curador' },
    check: (p) => (p.unlocked_avatars?.length || 0) >= 50,
  },
  estilos_5: {
    name: 'Estilista Ninja',
    description: 'Desbloqueia 5 estilos de nome.',
    icon: '✍️', rarity: 'bronze',
    reward: { diamonds: 60 },
    check: (p) => (p.unlocked_name_styles?.length || 0) >= 5,
  },
  estilos_15: {
    name: 'Mestre da Caligrafia',
    description: 'Desbloqueia 15 estilos de nome.',
    icon: '🖌️', rarity: 'prata',
    reward: { diamonds: 200, title: 'Calígrafo' },
    check: (p) => (p.unlocked_name_styles?.length || 0) >= 15,
  },

  // ═══════════ ECONOMIA ═════════════════════════════════════
  diamantes_500: {
    name: 'Caçador de Recompensas',
    description: 'Acumula 500 💎 em simultâneo.',
    icon: '💎', rarity: 'bronze',
    reward: { diamonds: 0 },
    check: (p) => (p.diamantes || 0) >= 500,
  },
  diamantes_5000: {
    name: 'Mercador do Mar',
    description: 'Acumula 5.000 💎 em simultâneo. O Barão de Berry aprovaria.',
    icon: '💰', rarity: 'prata',
    reward: { title: 'Mercador' },
    check: (p) => (p.diamantes || 0) >= 5000,
  },
  diamantes_25000: {
    name: 'Shinigami Abastado',
    description: 'Acumula 25.000 💎 em simultâneo.',
    icon: '🌕', rarity: 'ouro',
    reward: { title: 'Abastado' },
    check: (p) => (p.diamantes || 0) >= 25000,
  },

  // ═══════════ RANKING ══════════════════════════════════════
  top_100: {
    name: 'No Radar',
    description: 'Entra no Top 100 do ranking geral.',
    icon: '📡', rarity: 'prata',
    reward: { diamonds: 200 },
    check: (p) => (p.ranking_position || 9999) <= 100,
  },
  top_10: {
    name: 'Predador do Ranking',
    description: 'Entra no Top 10 do ranking geral.',
    icon: '🎯', rarity: 'ouro',
    reward: { diamonds: 600, title: 'Predador' },
    check: (p) => (p.ranking_position || 9999) <= 10,
  },
  top_1: {
    name: 'O Mais Forte',
    description: 'Chega ao 1.º lugar do ranking. Um e único.',
    icon: '🥇', rarity: 'lendario',
    reward: { diamonds: 2500, title: 'O Mais Forte' },
    check: (p) => (p.ranking_position || 9999) === 1,
  },

  // ═══════════ SEASON PASS ══════════════════════════════════
  sp_nivel_10: {
    name: 'Explorador da Época',
    description: 'Alcança o nível 10 no Season Pass.',
    icon: '🎫', rarity: 'bronze',
    reward: { diamonds: 100 },
    check: (p) => (p.season_pass_level || 0) >= 10,
  },
  sp_completo: {
    name: 'Mestre da Época',
    description: 'Completa o Season Pass inteiro.',
    icon: '🏁', rarity: 'ouro',
    reward: { diamonds: 1000, title: 'Mestre da Época' },
    check: (p) => (p.season_pass_level || 0) >= 50,
  },

  // ═══════════ OCULTAS ══════════════════════════════════════
  sniper: {
    name: '🎯 Sniper',
    description: 'Acerta o personagem na primeira tentativa.',
    icon: '🎯', rarity: 'diamante',
    reward: { diamonds: 500, title: 'Sniper' },
    hidden: true,
    check: (p) => (p.acertos_primeira_tentativa || 0) >= 1,
  },
  noob: {
    name: '🤡 Noob Perfeito',
    description: 'Erra o mesmo personagem 10 vezes no mesmo jogo.',
    icon: '🤡', rarity: 'bronze',
    reward: { diamonds: 20 },
    hidden: true,
    check: (p) => (p.maior_sequencia_erros || 0) >= 10,
  },
  maratonista: {
    name: '🏃 Maratonista',
    description: 'Joga os dois modos no mesmo dia, 7 dias seguidos.',
    icon: '🏃', rarity: 'diamante',
    reward: { diamonds: 400, title: 'Maratonista' },
    hidden: true,
    check: (p) => (p.streak_ambos_modos || 0) >= 7,
  },
  semanal_top3: {
    name: '🥉 Pódio Semanal',
    description: 'Termina no Top 3 do ranking semanal.',
    icon: '🥉', rarity: 'diamante',
    reward: { diamonds: 600, title: 'Pódio' },
    hidden: true,
    check: (p) => (p.best_weekly_position || 9999) <= 3,
  },
  semanal_1: {
    name: '🥇 Campeão Semanal',
    description: 'Termina em 1.º lugar no ranking semanal.',
    icon: '🥇', rarity: 'lendario',
    reward: { diamonds: 1500, title: 'Campeão Semanal' },
    hidden: true,
    check: (p) => (p.best_weekly_position || 9999) === 1,
  },
};

// ── CSS da raridade (injectado uma vez) ──────────────────────
(function injectAchievementCSS() {
  if (document.getElementById('ach-rarity-css')) return;
  const s = document.createElement('style');
  s.id = 'ach-rarity-css';
  s.textContent = `
    @keyframes achIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
    .achievement-toast{
      position:fixed;bottom:24px;right:24px;
      background:linear-gradient(135deg,#0f0f1a,#1a1a2e);
      border:1px solid var(--ac,#f59e0b);border-radius:14px;
      padding:14px 18px;display:flex;align-items:center;gap:13px;
      z-index:99999;max-width:320px;color:#fff;
      font-family:'DM Sans',sans-serif;
      box-shadow:0 8px 32px rgba(0,0,0,.5),0 0 24px var(--ag,rgba(245,158,11,.2));
      animation:achIn .4s cubic-bezier(.2,.8,.2,1) forwards;
    }
    .ach-ti{font-size:2rem;flex-shrink:0;line-height:1;}
    .ach-tl{font-size:.68rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
    .ach-tn{font-size:.95rem;font-weight:800;margin:3px 0;}
    .ach-td{font-size:.72rem;opacity:.55;margin-bottom:3px;}
    .ach-tr{font-size:.78rem;color:#a3e635;}

    /* Cards no perfil */
    .ach-card.rarity-bronze  { border-color:rgba(205,127,50,.4);  }
    .ach-card.rarity-prata   { border-color:rgba(176,184,200,.4); }
    .ach-card.rarity-ouro    { border-color:rgba(255,215,0,.4);   }
    .ach-card.rarity-diamante{ border-color:rgba(56,189,248,.4);  }
    .ach-card.rarity-lendario{ border-color:rgba(167,139,250,.45);}
    .ach-card.rarity-lendario.unlocked{
      background:linear-gradient(135deg,rgba(167,139,250,.08),rgba(0,0,0,0));
      box-shadow:0 0 20px rgba(167,139,250,.15);
    }
    .ach-badge{
      display:inline-block;font-size:.6rem;font-weight:700;
      letter-spacing:.8px;text-transform:uppercase;
      padding:2px 7px;border-radius:4px;margin-bottom:5px;
      border:1px solid currentColor;opacity:.8;
    }
    .ach-card.locked .ach-icon { filter:grayscale(1); opacity:.4; }
    .ach-card.hidden-locked .ach-info { filter:blur(3px); user-select:none; }
  `;
  document.head.appendChild(s);
})();

// ── Toast ────────────────────────────────────────────────────
function mostrarToastConquista(ach) {
  document.querySelector('.achievement-toast')?.remove();
  const r = ACHIEVEMENT_RARITY[ach.rarity] || ACHIEVEMENT_RARITY.bronze;
  const rewardStr = [
    (ach.reward?.diamonds || 0) > 0 ? `💎 +${ach.reward.diamonds}` : '',
    ach.reward?.title ? `🏷️ "${ach.reward.title}"` : '',
  ].filter(Boolean).join(' · ');

  const t = document.createElement('div');
  t.className = 'achievement-toast';
  t.style.setProperty('--ac', r.color);
  t.style.setProperty('--ag', r.glow);
  t.innerHTML = `
    <div class="ach-ti">${ach.icon || '🏆'}</div>
    <div>
      <div class="ach-tl" style="color:${r.color}">${r.label} · Conquista!</div>
      <div class="ach-tn">${ach.name}</div>
      <div class="ach-td">${ach.description}</div>
      ${rewardStr ? `<div class="ach-tr">${rewardStr}</div>` : ''}
    </div>
  `;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.cssText += 'transition:opacity .4s,transform .4s;opacity:0;transform:translateX(120%)';
    setTimeout(() => t.remove(), 400);
  }, 5500);
}

// ── Verificar e guardar conquistas ────────────────────────────
async function verificarConquistas(profile) {
  if (!profile?.id) return;
  const unlocked = profile.unlocked_achievements || [];
  console.log(`[Achievements] Verificando para ${profile.username} (${profile.id}). Já desbloqueadas:`, unlocked.length);
  const novos = []; const recompensas = { diamonds: 0, titles: [] };

  for (const [id, ach] of Object.entries(ACHIEVEMENTS)) {
    if (unlocked.includes(id)) continue;
    try {
      if (ach.check(profile)) {
        novos.push(id);
        if ((ach.reward?.diamonds || 0) > 0) recompensas.diamonds += ach.reward.diamonds;
        if (ach.reward?.title) recompensas.titles.push(ach.reward.title);
        const idx = novos.length;
        setTimeout(() => mostrarToastConquista(ach), 900 * idx);
      }
    } catch (e) { /* ignora */ }
  }

  if (!novos.length) return;

  try {
    const novaLista = [...unlocked, ...novos];
    const novosDiam = (profile.diamantes || 0) + recompensas.diamonds;
    const novosTit = [...new Set([...(profile.unlocked_titles || []), ...recompensas.titles])];

    // 1. Atualizar conquistas e títulos na tabela 'profile_cosmetics'
    const { error: err1 } = await window.supabaseClient.from('profile_cosmetics').update({
      unlocked_achievements: novaLista,
      unlocked_titles: novosTit,
    }).eq('user_id', profile.id);
    if (err1) throw err1;

    // Atualiza localmente já
    profile.unlocked_achievements = novaLista;
    profile.unlocked_titles = novosTit;

    // 2. Atualizar diamantes na tabela 'profile_stats'
    if (recompensas.diamonds > 0) {
      const { error: err2 } = await window.supabaseClient.from('profile_stats').update({
        diamantes: novosDiam
      }).eq('user_id', profile.id);
      if (err2) throw err2;
      profile.diamantes = novosDiam;
    }

    profile.unlocked_achievements = novaLista;
    profile.diamantes = novosDiam;
    profile.unlocked_titles = novosTit;

    if (typeof atualizarHeaderStats === 'function') {
      atualizarHeaderStats(novosDiam, profile.pontos_totais);
    }
  } catch (e) { console.error('[Achievements]', e); }
}

// ── Render no perfil (substitui o renderAchievements do perfil.js) ──
function renderAchievements(profile) {
  const container = document.getElementById('achievementsGrid');
  if (!container) return;
  container.innerHTML = '';

  const unlocked = profile.unlocked_achievements || [];
  const equippedTitle = profile.equipped_title;

  // Separar por raridade para agrupar visualmente
  const order = ['lendario', 'diamante', 'ouro', 'prata', 'bronze'];

  order.forEach(rarity => {
    const grupo = Object.entries(ACHIEVEMENTS).filter(([, a]) => a.rarity === rarity);
    if (!grupo.length) return;

    const r = ACHIEVEMENT_RARITY[rarity];

    grupo.forEach(([id, ach]) => {
      const isUnlocked = unlocked.includes(id);
      const isHidden = ach.hidden && !isUnlocked;

      const card = document.createElement('div');
      card.className = [
        'ach-card',
        `rarity-${rarity}`,
        isUnlocked ? 'unlocked' : 'locked',
        isHidden ? 'hidden-locked' : '',
      ].filter(Boolean).join(' ');

      const rewardText = [
        (ach.reward?.diamonds || 0) > 0 ? `💎 ${ach.reward.diamonds}` : '',
        ach.reward?.title ? `🏷️ "${ach.reward.title}"` : '',
      ].filter(Boolean).join(' · ') || 'Sem recompensa';

      card.innerHTML = `
        <div class="ach-icon" style="font-size:1.8rem;margin-bottom:6px;">${ach.icon || '🏆'}</div>
        <div class="ach-info">
          <div class="ach-badge" style="color:${r.color}">${r.label}</div>
          <h4 class="ach-name">${isHidden ? '???' : ach.name}</h4>
          <p class="ach-desc">${isHidden ? 'Conquista oculta. Descobre como desbloquear.' : ach.description}</p>
          <div class="ach-reward">${rewardText}</div>
        </div>
        ${isUnlocked ? '' : '<div class="ach-lock-overlay"><span>🔒</span></div>'}
      `;

      // Botão de equipar título
      if (isUnlocked && ach.reward?.title) {
        const btnWrap = document.createElement('div');
        btnWrap.className = 'ach-button-wrap';
        const equipBtn = document.createElement('button');
        equipBtn.className = 'btn-equip-title' + (equippedTitle === ach.reward.title ? ' equipped' : '');
        equipBtn.textContent = equippedTitle === ach.reward.title ? 'Equipado' : 'Equipar Título';
        equipBtn.disabled = equippedTitle === ach.reward.title;
        equipBtn.onclick = (e) => { e.stopPropagation(); equiparTitulo(ach.reward.title, equipBtn); };
        btnWrap.appendChild(equipBtn);
        card.appendChild(btnWrap);
      }

      container.appendChild(card);
    });
  });
}

window.verificarConquistas = verificarConquistas;
window.renderAchievements = renderAchievements;
window.ACHIEVEMENTS = ACHIEVEMENTS;
window.ACHIEVEMENT_RARITY = ACHIEVEMENT_RARITY;