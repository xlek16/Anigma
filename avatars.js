// avatars.js

const AVATARES = {
  // ── EASY (Verde) ─────────────────────────────────────────────
  easy: [
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/majinboo.webp',
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/miwa.webp',
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/spandan.webp',
    
  ],

  // ── MEDIUM (Amarelo) ─────────────────────────────────────────
  medium: [
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/choso.webp',
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/bulma.webp',
  ],

  // ── HARD (Vermelho) ──────────────────────────────────────────
  hard: [
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/yuta.webp',
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/vegita.webp',
  ],

  // ── IMPOSSIBLE (Roxo) ────────────────────────────────────────
  impossible: [
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/sukuna.webm',
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/Gojo.webm',
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/Goku.webm',
    'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/Avatares/dio.webm',
    
  ]
};

const RARITY_CONFIG = {
  easy:       { label: 'Comum',      color: '#31f700', chance: 60 },
  medium:     { label: 'Raro',       color: '#ffcc00', chance: 30 },
  hard:       { label: 'Épico',      color: '#ff0000', chance: 9  },
  impossible: { label: 'Lendário',   color: '#4d1283', chance: 1  }
};
