// avatars.js

const AVATARES = {
  // ── EASY (Verde) ─────────────────────────────────────────────
  easy: [
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/animes/avatar_default.png',
  ],

  // ── MEDIUM (Amarelo) ─────────────────────────────────────────
  medium: [
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/choso.webp',
  ],

  // ── HARD (Vermelho) ──────────────────────────────────────────
  hard: [
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/yuta.webp',
  ],

  // ── IMPOSSIBLE (Roxo) ────────────────────────────────────────
  impossible: [
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/sukuna.webm',
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/Gojo.webm',
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/Goku.webm',
    
  ]
};

const RARITY_CONFIG = {
  easy:       { label: 'Comum',      color: '#4ade80', chance: 60 },
  medium:     { label: 'Raro',       color: '#facc15', chance: 30 },
  hard:       { label: 'Épico',      color: '#f87171', chance: 9  },
  impossible: { label: 'Lendário',   color: '#a855f7', chance: 1  }
};
