// nameStyles.js — Estilos de Nome ANIGMA

// ── CSS dos estilos ─────────────────────────────────────────
(function injetarCSS() {
  if (document.getElementById('name-styles-css')) return;
  const style = document.createElement('style');
  style.id = 'name-styles-css';
  style.textContent = `
    /* ANIMAÇÕES */
    @keyframes ns-kira-burn {
      0%,100% { text-shadow:0 0 4px #ff6600,0 0 10px #ff4400,0 0 20px #cc2200; color:#ff8844; }
      50%      { text-shadow:0 0 8px #ff3300,0 0 18px #ff6600,0 0 35px #ffaa00; color:#ffcc66; }
    }
    @keyframes ns-thunder {
      0%,100% { text-shadow:0 0 4px #aadfff,0 0 10px #55aaff,0 0 18px #0077ff; color:#99ccff; }
      50%      { text-shadow:0 0 10px #ffffff,0 0 20px #aaddff,0 0 40px #3388ff; color:#ffffff; opacity:0.9; }
    }
    @keyframes ns-sharingan {
      0%,100% { color:#cc2200; text-shadow:0 0 5px #cc0000,0 0 12px #880000; }
      50%      { color:#ff3322; text-shadow:0 0 12px #ff2222,0 0 24px #cc0000,0 0 40px #660000; }
    }
    @keyframes ns-sage {
      0%,100% { color:#88ffcc; text-shadow:0 0 5px #00ffaa,0 0 12px #00cc88; }
      50%      { color:#aaffdd; text-shadow:0 0 12px #00ffbb,0 0 24px #00aa77,0 0 40px #005544; opacity:0.85; }
    }
    @keyframes ns-ryomen {
      0%,100% { color:#cc55ff; text-shadow:0 0 5px #aa33ee,0 0 12px #7700cc; }
      50%      { color:#dd88ff; text-shadow:0 0 14px #cc55ff,0 0 30px #9922ff,0 0 50px #550099; }
    }
    @keyframes ns-gold-king {
      0%,100% { color:#ffd700; text-shadow:0 0 5px #ffd700,0 0 12px #ffaa00; }
      50%      { color:#ffe866; text-shadow:0 0 14px #ffd700,0 0 28px #ffcc00,0 0 50px #ff9900; }
    }
    @keyframes ns-demon-moon {
      0%,100% { color:#ff2200; text-shadow:0 0 5px #ff2200,0 0 14px #990000; }
      50%      { color:#ff4422; text-shadow:0 0 14px #ff3311,0 0 30px #cc0000,0 0 55px #440000; }
    }
    @keyframes ns-void-eye {
      0%,100% { color:#9966ff; text-shadow:0 0 6px #7744ee,0 0 14px #5522bb; }
      33%      { color:#bbaaff; text-shadow:0 0 10px #9977ff,0 0 22px #6633cc; }
      66%      { color:#6633cc; text-shadow:0 0 8px #5522bb,0 0 18px #330099; }
    }
    @keyframes ns-ice-breath {
      0%,100% { color:#c8f0ff; text-shadow:0 0 5px #aae8ff,0 0 12px #55ccff; }
      50%      { color:#eeffff; text-shadow:0 0 12px #ddf8ff,0 0 25px #88ddff,0 0 40px #33aaee; }
    }
    @keyframes ns-sand-wind {
      0%,100% { color:#e8c060; text-shadow:0 0 5px #d4a840,0 0 12px #b08020; }
      50%      { color:#ffd878; text-shadow:0 0 12px #f0c050,0 0 25px #c89030; }
    }
    @keyframes ns-rainbow-hero {
      0%   { color:#ff5566; text-shadow:0 0 8px #ff5566; }
      14%  { color:#ff8844; text-shadow:0 0 8px #ff8844; }
      28%  { color:#ffdd44; text-shadow:0 0 8px #ffdd44; }
      43%  { color:#44ee88; text-shadow:0 0 8px #44ee88; }
      57%  { color:#44bbff; text-shadow:0 0 8px #44bbff; }
      71%  { color:#8855ff; text-shadow:0 0 8px #8855ff; }
      85%  { color:#ff44cc; text-shadow:0 0 8px #ff44cc; }
      100% { color:#ff5566; text-shadow:0 0 8px #ff5566; }
    }
    @keyframes ns-glitch-code {
      0%,88%,100% { text-shadow:none; transform:none; filter:none; }
      90% { text-shadow:-2px 0 #ff00ff,2px 0 #00ffff; transform:translateX(-2px); }
      92% { text-shadow:2px 0 #ff00ff,-2px 0 #00ffff; transform:translateX(2px); filter:blur(0.5px); }
      94% { text-shadow:none; transform:translateX(0); filter:none; }
      96% { text-shadow:-1px 0 #ff00ff; transform:translateX(-1px); }
    }
    @keyframes ns-titan-step {
      0%,100% { letter-spacing:3px; text-shadow:0 3px 0 #2a1a00,0 0 10px rgba(255,180,80,0.2); }
      50%      { letter-spacing:4px; text-shadow:0 4px 0 #1a1000,0 0 18px rgba(255,180,80,0.35); }
    }
    @keyframes ns-pink-devil {
      0%,100% { color:#ff55cc; text-shadow:0 0 5px #ff00aa,0 0 12px #cc0088; }
      50%      { color:#ff88ee; text-shadow:0 0 12px #ff44cc,0 0 26px #cc0099,0 0 45px #880055; }
    }
    @keyframes ns-cosmos {
      0%,100% { color:#cce4ff; text-shadow:0 0 6px #ffffff,0 0 14px #aaccff; opacity:1; }
      50%      { color:#eef6ff; text-shadow:0 0 10px #ffffff,0 0 22px #88aaff,0 0 40px #4466ff; opacity:0.75; }
    }

    /* CLASSES */
    .ns-kira       { animation:ns-kira-burn 1.6s ease-in-out infinite; font-weight:800; }
    .ns-thunder    { animation:ns-thunder 1.2s ease-in-out infinite; font-weight:800; }
    .ns-sharingan  { animation:ns-sharingan 2s ease-in-out infinite; font-weight:800; }
    .ns-sage       { animation:ns-sage 2s ease-in-out infinite; font-weight:700; }
    .ns-ryomen     { animation:ns-ryomen 2.5s ease-in-out infinite; font-weight:800; }
    .ns-gold-king  { animation:ns-gold-king 2s ease-in-out infinite; font-weight:800; }
    .ns-demon-moon { animation:ns-demon-moon 1.8s ease-in-out infinite; font-weight:800; letter-spacing:1px; }
    .ns-void-eye   { animation:ns-void-eye 3s ease-in-out infinite; font-weight:800; }
    .ns-ice-breath { animation:ns-ice-breath 2s ease-in-out infinite; font-weight:700; letter-spacing:1px; }
    .ns-sand-wind  { animation:ns-sand-wind 2.2s ease-in-out infinite; font-weight:700; }
    .ns-rainbow    { animation:ns-rainbow-hero 3s linear infinite; font-weight:800; }
    .ns-glitch     { animation:ns-glitch-code 3.5s linear infinite; font-weight:800; color:#00ffcc; font-family:monospace; }
    .ns-titan      { animation:ns-titan-step 2s ease-in-out infinite; font-weight:800; text-transform:uppercase; color:#f5dda0; }
    .ns-pink-devil { animation:ns-pink-devil 1.6s ease-in-out infinite; font-weight:800; }
    .ns-cosmos     { animation:ns-cosmos 2s ease-in-out infinite; font-weight:700; }
    .ns-galaxy     { background:linear-gradient(135deg,#a78bfa,#38bdf8,#f0abfc); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; font-weight:800; }
    .ns-sunset     { background:linear-gradient(135deg,#f97316,#ec4899,#8b5cf6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; font-weight:800; }
    .ns-ocean-blue { background:linear-gradient(135deg,#38bdf8,#0ea5e9,#22d3ee); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; font-weight:800; }
    .ns-forest     { background:linear-gradient(135deg,#4ade80,#16a34a,#22d3ee); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; font-weight:800; }
    .ns-crimson    { color:#c0392b; font-weight:800; letter-spacing:1px; text-shadow:1px 1px 0 #7b0f0f; }
    .ns-white-soul { color:#fff; font-weight:800; letter-spacing:2px; text-shadow:0 0 8px rgba(255,255,255,0.7),0 1px 0 #aaa; }
  `;
  (document.head || document.documentElement).appendChild(style);
})();

// ── RARIDADE ──────────────────────────────────────────────────
const NAME_STYLE_RARITY_CONFIG = {
  comum:    { label: 'Comum',    chance: 60, color: '#9ca3af' },
  raro:     { label: 'Raro',     chance: 25, color: '#38bdf8' },
  epico:    { label: 'Épico',    chance: 13, color: '#a78bfa' },
  lendario: { label: 'Lendário', chance: 2,  color: '#fbbf24' },
};

// ── ESTILOS ───────────────────────────────────────────────────
const NAME_STYLES = {

  // ════ COMUM ══════════════════════════════
  branco: {
    id: 'branco', name: 'Alma Branca', rarity: 'Comum',
    className: 'ns-white-soul',
    desc: 'Puro como a alma de um Shinigami novato.',
  },
  vermelho: {
    id: 'vermelho', name: 'Sangue Ninja', rarity: 'Comum',
    style: 'color:#ef4444; font-weight:700;',
    desc: 'A cor que corre nas batalhas shinobi.',
  },
  azul: {
    id: 'azul', name: 'Chakra Azul', rarity: 'Comum',
    style: 'color:#60a5fa; font-weight:700;',
    desc: 'O chakra elementar da água e do vento.',
  },
  verde: {
    id: 'verde', name: 'Força de Rock Lee', rarity: 'Comum',
    style: 'color:#4ade80; font-weight:700;',
    desc: 'A determinação de quem não desiste — nunca.',
  },
  roxo: {
    id: 'roxo', name: 'Reiatsu Capitão', rarity: 'Comum',
    style: 'color:#c084fc; font-weight:700;',
    desc: 'Energia espiritual ao nível de capitão da Soul Society.',
  },
  laranja: {
    id: 'laranja', name: 'Espírito de Naruto', rarity: 'Comum',
    style: 'color:#fb923c; font-weight:800;',
    desc: 'Acredita! A cor do futuro Hokage.',
  },
  amarelo: {
    id: 'amarelo', name: 'Relâmpago Dourado', rarity: 'Comum',
    style: 'color:#fbbf24; font-weight:700;',
    desc: 'Tão rápido quanto o Yondaime Hokage.',
  },
  crimson: {
    id: 'crimson', name: 'Clã Carmesim', rarity: 'Comum',
    className: 'ns-crimson',
    desc: 'A cor dos clãs guerreiros ancestrais.',
  },

  // ════ RARO ════════════════════════════════
  kira: {
    id: 'kira', name: '🔥 Chamas de Rengoku', rarity: 'Raro',
    className: 'ns-kira',
    desc: '"Arde, coração meu!" — Kyojuro Rengoku, Hashira das Chamas.',
  },
  ice: {
    id: 'ice', name: '❄️ Respiração da Água', rarity: 'Raro',
    className: 'ns-ice-breath',
    desc: 'Fluída e fria como a técnica mestra de Giyu Tomioka.',
  },
  sand: {
    id: 'sand', name: '🏜️ Areia do Kazekage', rarity: 'Raro',
    className: 'ns-sand-wind',
    desc: 'A areia que protege — e esmaga. Gaara do Deserto.',
  },
  sage: {
    id: 'sage', name: '🐸 Modo Sábio', rarity: 'Raro',
    className: 'ns-sage',
    desc: 'Energia natural em harmonia perfeita. Modo Sennin de Naruto.',
  },
  ocean_blue: {
    id: 'ocean_blue', name: '🌊 Grande Linha', rarity: 'Raro',
    className: 'ns-ocean-blue',
    desc: 'O oceano infinito onde piratas perseguem os seus sonhos.',
  },
  sunset: {
    id: 'sunset', name: '🌅 Aurora Final', rarity: 'Raro',
    className: 'ns-sunset',
    desc: 'O último amanhecer antes da batalha definitiva.',
  },
  titan: {
    id: 'titan', name: '⚔️ Rugido do Titã', rarity: 'Raro',
    className: 'ns-titan',
    desc: 'Pesado como os passos do Titã Colosso. Tatakae.',
  },
  cosmos: {
    id: 'cosmos', name: '⭐ Pequeno Cosmos', rarity: 'Raro',
    className: 'ns-cosmos',
    desc: 'O chama que arde no peito de cada Cavaleiro de Atena.',
  },
  forest: {
    id: 'forest', name: '🌿 Espírito da Floresta', rarity: 'Raro',
    className: 'ns-forest',
    desc: 'Verde e ciano — guardião da natureza e da vida.',
  },

  // ════ ÉPICO ═══════════════════════════════
  thunder: {
    id: 'thunder', name: '⚡ Primeira Forma: Trovão', rarity: 'Épico',
    className: 'ns-thunder',
    desc: 'Zenitsu Agatsuma — o único fio que domina com perfeição.',
  },
  sharingan: {
    id: 'sharingan', name: '👁️ Mangekyō Sharingan', rarity: 'Épico',
    className: 'ns-sharingan',
    desc: 'O dōjutsu dos Uchiha. Um olho que carrega dor e poder infinito.',
  },
  void_eye: {
    id: 'void_eye', name: '♾️ Infinito de Gojo', rarity: 'Épico',
    className: 'ns-void-eye',
    desc: 'O olho dos seis olhos. Nada o toca. Ninguém o iguala.',
  },
  demon_moon: {
    id: 'demon_moon', name: '🌑 Lua de Muzan', rarity: 'Épico',
    className: 'ns-demon-moon',
    desc: 'A transformação ao luar do rei dos demónios. Terror ancestral.',
  },
  pink_devil: {
    id: 'pink_devil', name: '💗 Diabo Cor-de-Rosa', rarity: 'Épico',
    className: 'ns-pink-devil',
    desc: 'Mitsuri Kanroji — a Hashira do Amor que ninguém subestima.',
  },
  glitch: {
    id: 'glitch', name: '💻 Jogador Sombra', rarity: 'Épico',
    className: 'ns-glitch',
    desc: 'Sung Jinwoo levantou-se sozinho. O sistema corrompido obedece-lhe.',
  },
  galaxy: {
    id: 'galaxy', name: '🌌 Ultra Instinto', rarity: 'Épico',
    className: 'ns-galaxy',
    desc: 'O poder que transcende deuses. Goku contra Jiren.',
  },

  // ════ LENDÁRIO ════════════════════════════
  gold_king: {
    id: 'gold_king', name: '👑 Rei dos Piratas', rarity: 'Lendário',
    className: 'ns-gold-king',
    desc: '"Quero ser o Rei dos Piratas!" — Monkey D. Luffy. O homem que conquistou tudo.',
  },
  rainbow: {
    id: 'rainbow', name: '🌈 Plus Ultra!', rarity: 'Lendário',
    className: 'ns-rainbow',
    desc: 'Izuku Midoriya — todas as cores do One For All a brilhar em simultâneo.',
  },
  ryomen: {
    id: 'ryomen', name: '💀 Ryomen Sukuna', rarity: 'Lendário',
    className: 'ns-ryomen',
    desc: 'O Rei das Maldições. Sukuna de quatro braços. Nada te pode.',
  },
};