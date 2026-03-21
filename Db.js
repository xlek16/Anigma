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
      pontos_totais:              stats?.pontos_totais              ?? 0,
      level:                      stats?.level                      ?? 1,
      diamantes:                  stats?.diamantes                  ?? 0,
      diamantes_pendentes:        stats?.diamantes_pendentes        ?? 0,
      current_streak:             stats?.current_streak             ?? 0,
      last_streak_date:           stats?.last_streak_date           ?? null,
      streak_ambos_modos:         stats?.streak_ambos_modos         ?? 0,
      last_ambos_modos_date:      stats?.last_ambos_modos_date      ?? null,
      acertos_primeira_tentativa: stats?.acertos_primeira_tentativa ?? 0,
      maior_sequencia_erros:      stats?.maior_sequencia_erros      ?? 0,
      // boosts XP — colunas novas na profile_stats
      xp_boost_active:            stats?.xp_boost_active            ?? false,
      xp_boost_multiplier:        stats?.xp_boost_multiplier        ?? 1,
      xp_boost_expires_at:        stats?.xp_boost_expires_at        ?? null,
      // cosmetics
      unlocked_avatars:           cosmetics?.unlocked_avatars       ?? [],
      unlocked_themes:            cosmetics?.unlocked_themes        ?? [],
      unlocked_achievements:      cosmetics?.unlocked_achievements  ?? [],
      unlocked_titles:            cosmetics?.unlocked_titles        ?? [],
      unlocked_name_styles:       cosmetics?.unlocked_name_styles   ?? [],
      unlocked_frames:            cosmetics?.unlocked_frames        ?? [],
      // season pass
      season_pass_xp:             sp?.season_pass_xp                ?? 0,
      season_pass_level:          sp?.season_pass_level             ?? 1,
      season_pass_premium:        sp?.season_pass_premium           ?? false,
      season_claimed_rewards:     sp?.season_claimed_rewards        ?? [],
      // ranking
      ranking_position:           rank?.ranking_position            ?? 9999,
      best_weekly_position:       rank?.best_weekly_position        ?? 9999,
      weekly_rewards_pending:     rank?.weekly_rewards_pending      ?? [],
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

  // ════════════════════════════════════════════════════════
  // SISTEMA DE BOOSTS XP
  // ════════════════════════════════════════════════════════

  // ── Ativar boost (chamado pela loja após compra) ──────────
  // Se já houver boost ativo, o tempo ACUMULA (não substitui)
  async ativarBoost(userId, multiplicador, duracaoHoras) {
    const { data: stats } = await window.supabaseClient
      .from('profile_stats')
      .select('xp_boost_active, xp_boost_expires_at')
      .eq('user_id', userId)
      .single();

    const agora = new Date();
    let base = agora;
    if (stats?.xp_boost_active && stats?.xp_boost_expires_at) {
      const expiraAtual = new Date(stats.xp_boost_expires_at);
      if (expiraAtual > agora) base = expiraAtual;
    }

    const novaExpiracao = new Date(base.getTime() + duracaoHoras * 3600000);

    const { error } = await window.supabaseClient
      .from('profile_stats')
      .update({
        xp_boost_active:     true,
        xp_boost_multiplier: multiplicador,
        xp_boost_expires_at: novaExpiracao.toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;

    // Sincronizar localStorage para leituras rápidas sem latência
    localStorage.setItem('anigma_xp_booster', JSON.stringify({
      multiplicador,
      expira: novaExpiracao.toISOString(),
    }));

    return { multiplicador, expira: novaExpiracao.toISOString() };
  },

  // ── Verificar boost ativo com confirmação na DB ───────────
  // Usar nos jogos antes de adicionar XP (verifica e desativa se expirou)
  async getBoostMultiplier(userId) {
    try {
      const { data: stats } = await window.supabaseClient
        .from('profile_stats')
        .select('xp_boost_active, xp_boost_multiplier, xp_boost_expires_at')
        .eq('user_id', userId)
        .single();

      if (!stats?.xp_boost_active) return 1;

      const expira = new Date(stats.xp_boost_expires_at);
      if (expira <= new Date()) {
        // Expirou — desativar na DB e limpar cache
        await window.supabaseClient
          .from('profile_stats')
          .update({ xp_boost_active: false, xp_boost_multiplier: 1 })
          .eq('user_id', userId);
        localStorage.removeItem('anigma_xp_booster');
        return 1;
      }

      return stats.xp_boost_multiplier ?? 1;
    } catch (e) {
      // Fallback para cache local se DB falhar
      return window.DB.getBoostMultiplierLocal();
    }
  },

  // ── Verificar boost via cache local (sem latência) ────────
  // Usar para leituras frequentes de UI (ex: mostrar badge "2x XP")
  getBoostMultiplierLocal() {
    try {
      const b = JSON.parse(localStorage.getItem('anigma_xp_booster') || '{}');
      if (b.expira && new Date(b.expira) > new Date()) return b.multiplicador || 1;
    } catch (e) {}
    return 1;
  },

  // ── Info completa do boost (para mostrar na UI) ───────────
  // Retorna { ativo, multiplicador, restante, expiresAt }
  getBoostInfo() {
    try {
      const b = JSON.parse(localStorage.getItem('anigma_xp_booster') || '{}');
      if (b.expira && new Date(b.expira) > new Date()) {
        const diff = new Date(b.expira) - new Date();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        return {
          ativo:        true,
          multiplicador: b.multiplicador,
          restante:     h > 0 ? `${h}h ${m}m` : `${m}m`,
          expiresAt:    b.expira,
        };
      }
    } catch (e) {}
    return { ativo: false, multiplicador: 1, restante: null, expiresAt: null };
  },

  // ── Desativar boost manualmente ───────────────────────────
  async desativarBoost(userId) {
    await window.supabaseClient
      .from('profile_stats')
      .update({ xp_boost_active: false, xp_boost_multiplier: 1, xp_boost_expires_at: null })
      .eq('user_id', userId);
    localStorage.removeItem('anigma_xp_booster');
  },

  // ── Calcular XP final com boost (consulta DB) ─────────────
  // Uso nos jogos: const xpFinal = await DB.calcXP(session.user.id, 50);
  async calcXP(userId, xpBase) {
    const mult = await window.DB.getBoostMultiplier(userId);
    return Math.round(xpBase * mult);
  },

  // ── Calcular XP final via cache (sem latência) ────────────
  // Uso quando precisas do valor imediatamente na UI
  calcXPLocal(xpBase) {
    return Math.round(xpBase * window.DB.getBoostMultiplierLocal());
  },

};

// ── Atalhos globais (retrocompatibilidade com código antigo) ─
window.getBoosterXP   = () => window.DB.getBoostMultiplierLocal();
window.getBoosterInfo = () => window.DB.getBoostInfo();