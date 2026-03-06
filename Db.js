// db.js — helpers centralizados para as novas tabelas
// Inclui em todos os ficheiros JS que acedam à DB

window.DB = {

  // ── Buscar tudo de uma vez (join manual) ──────────────────
  async getFullProfile(userId) {
    const [
      { data: p },
      { data: stats },
      { data: cosmetics },
      { data: sp },
      { data: rank }
    ] = await Promise.all([
      window.supabaseClient.from('profiles').select('id,username,email,avatar_url,equipped_title,equipped_name_style,isAdmin,created_at').eq('id', userId).single(),
      window.supabaseClient.from('profile_stats').select('*').eq('user_id', userId).single(),
      window.supabaseClient.from('profile_cosmetics').select('*').eq('user_id', userId).single(),
      window.supabaseClient.from('season_pass').select('*').eq('user_id', userId).single(),
      window.supabaseClient.from('ranking_data').select('*').eq('user_id', userId).single(),
    ]);
    return {
      ...p,
      // stats
      pontos_totais: stats?.pontos_totais ?? 0,
      level:         stats?.level         ?? 1,
      diamantes:     stats?.diamantes     ?? 0,
      diamantes_pendentes:        stats?.diamantes_pendentes        ?? 0,
      current_streak:             stats?.current_streak             ?? 0,
      last_streak_date:           stats?.last_streak_date           ?? null,
      streak_ambos_modos:         stats?.streak_ambos_modos         ?? 0,
      last_ambos_modos_date:      stats?.last_ambos_modos_date      ?? null,
      acertos_primeira_tentativa: stats?.acertos_primeira_tentativa ?? 0,
      maior_sequencia_erros:      stats?.maior_sequencia_erros      ?? 0,
      // cosmetics
      unlocked_avatars:     cosmetics?.unlocked_avatars     ?? [],
      unlocked_themes:      cosmetics?.unlocked_themes      ?? [],
      unlocked_achievements:cosmetics?.unlocked_achievements?? [],
      unlocked_titles:      cosmetics?.unlocked_titles      ?? [],
      unlocked_name_styles: cosmetics?.unlocked_name_styles ?? [],
      unlocked_frames:      cosmetics?.unlocked_frames      ?? [],
      // season pass
      season_pass_xp:         sp?.season_pass_xp         ?? 0,
      season_pass_level:      sp?.season_pass_level      ?? 1,
      season_pass_premium:    sp?.season_pass_premium    ?? false,
      season_claimed_rewards: sp?.season_claimed_rewards ?? [],
      // ranking
      ranking_position:       rank?.ranking_position       ?? 9999,
      best_weekly_position:   rank?.best_weekly_position   ?? 9999,
      weekly_rewards_pending: rank?.weekly_rewards_pending ?? [],
    };
  },

  // ── Atualizar stats ───────────────────────────────────────
  async updateStats(userId, data) {
    return window.supabaseClient.from('profile_stats').update(data).eq('user_id', userId);
  },

  // ── Atualizar cosmetics ───────────────────────────────────
  async updateCosmetics(userId, data) {
    return window.supabaseClient.from('profile_cosmetics').update(data).eq('user_id', userId);
  },

  // ── Atualizar season pass ─────────────────────────────────
  async updateSeasonPass(userId, data) {
    return window.supabaseClient.from('season_pass').update(data).eq('user_id', userId);
  },

  // ── Atualizar ranking ─────────────────────────────────────
  async updateRanking(userId, data) {
    return window.supabaseClient.from('ranking_data').update(data).eq('user_id', userId);
  },

  // ── Atualizar perfil base ─────────────────────────────────
  async updateProfile(userId, data) {
    return window.supabaseClient.from('profiles').update(data).eq('id', userId);
  },

  // ── Buscar estado do jogo DB ──────────────────────────────
  async getGameDB(userId) {
    const { data } = await window.supabaseClient.from('game_state_db').select('*').eq('user_id', userId).single();
    return data;
  },

  async updateGameDB(userId, data) {
    return window.supabaseClient.from('game_state_db').update(data).eq('user_id', userId);
  },

  // ── Buscar estado do jogo JJK ─────────────────────────────
  async getGameJJK(userId) {
    const { data } = await window.supabaseClient.from('game_state_jjk').select('*').eq('user_id', userId).single();
    return data;
  },

  async updateGameJJK(userId, data) {
    return window.supabaseClient.from('game_state_jjk').update(data).eq('user_id', userId);
  },
};