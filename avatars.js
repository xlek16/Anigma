// avatars.js

const AVATARES = {
  // ── EASY (Verde) ─────────────────────────────────────────────
  easy: [
    'https://xxpmvxcjnqwzrsbnqdsg.supabase.co/storage/v1/object/public/avatares/bulma.webp'
  ],

  // ── MEDIUM (Amarelo) ─────────────────────────────────────────
  medium: [
    'https://xxpmvxcjnqwzrsbnqdsg.supabase.co/storage/v1/object/public/avatares/naruto.webp'
  ],

  // ── HARD (Vermelho) ──────────────────────────────────────────
  hard: [
    'https://xxpmvxcjnqwzrsbnqdsg.supabase.co/storage/v1/object/public/avatares/benimaru.webp'
  ],

  // ── IMPOSSIBLE (Roxo) ────────────────────────────────────────
  impossible: [
    'https://xxpmvxcjnqwzrsbnqdsg.supabase.co/storage/v1/object/public/avatares/rengoku.webp'
  ]
};

const RARITY_CONFIG = {
  easy:       { label: 'Comum',      color: '#31f700', chance: 60 },
  medium:     { label: 'Raro',       color: '#ffcc00', chance: 30 },
  hard:       { label: 'Épico',      color: '#ff0000', chance: 9  },
  impossible: { label: 'Lendário',   color: '#4d1283', chance: 1  }
};
