// ranking.js — atualizado para novas tabelas

let rankingChannel = null;

// Calcula nível a partir dos pontos (mesma fórmula do perfil)
function calcLevel(pts) {
  if (!pts || pts <= 0) return 1;
  return Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * pts) / 250)) / 2));
}

async function carregarRanking() {
  const rankingBody = document.getElementById('rankingBody');
  rankingBody.innerHTML = '<div class="loading-spinner"></div>';

  try {
    const { data: profiles, error } = await window.supabaseClient
      .from('profiles')
      .select('id, username, avatar_url, equipped_name_style')
      .not('username', 'is', null);

    if (error) throw error;

    const userIds = profiles.map(p => p.id);

    const [statsRes, spRes, cosmeticsRes] = await Promise.all([
      window.supabaseClient.from('profile_stats').select('user_id, pontos_totais').in('user_id', userIds),
      window.supabaseClient.from('season_pass').select('user_id, season_pass_premium').in('user_id', userIds),
      window.supabaseClient.from('profile_cosmetics').select('user_id, banner_url').in('user_id', userIds),
    ]);

    const statsMap = Object.fromEntries((statsRes.data || []).map(s => [s.user_id, s]));
    const spMap = Object.fromEntries((spRes.data || []).map(s => [s.user_id, s]));
    const bannerMap = Object.fromEntries((cosmeticsRes.data || []).map(c => [c.user_id, c.banner_url]));

    const combined = profiles
      .map(p => {
        const pts = statsMap[p.id]?.pontos_totais ?? 0;
        return {
          ...p,
          pontos_totais: pts,
          level: calcLevel(pts),
          season_pass_premium: spMap[p.id]?.season_pass_premium ?? false,
          banner_url: bannerMap[p.id] || null,
        };
      })
      .sort((a, b) => b.pontos_totais - a.pontos_totais)
      .slice(0, 100);

    renderRanking(combined);

    if (rankingChannel) window.supabaseClient.removeChannel(rankingChannel);
    rankingChannel = window.supabaseClient.channel('public:profile_stats')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profile_stats' }, () => carregarRanking())
      .subscribe();

  } catch (e) {
    console.error('Erro ao carregar ranking:', e);
    document.getElementById('rankingBody').innerHTML =
      '<div class="ranking-empty">Ocorreu um erro ao carregar o ranking. Tenta novamente mais tarde.</div>';
  }
}

function renderRanking(data) {
  const rankingBody = document.getElementById('rankingBody');
  rankingBody.innerHTML = '';

  if (!data.length) {
    rankingBody.innerHTML = '<div class="ranking-empty">Ainda não há jogadores no ranking. Sê o primeiro!</div>';
    return;
  }

  data.forEach((profile, index) => {
    const isPrem = profile.season_pass_premium === true;
    const row = document.createElement('div');
    row.className = 'ranking-row' + (index < 3 ? ` top-${index + 1}` : '') + (isPrem ? ' rank-prem' : '');
    row.dataset.userId = profile.id;

    // ── Banner de fundo ──────────────────────────────────────────
    if (profile.banner_url) {
      const bannerBg = document.createElement('div');
      bannerBg.className = 'rank-banner-bg';
      bannerBg.innerHTML = `<img src="${profile.banner_url}" alt="" loading="lazy">`;
      row.appendChild(bannerBg);

      const overlay = document.createElement('div');
      overlay.className = 'rank-banner-overlay';
      row.appendChild(overlay);
    }

    // ── Coluna #pos ──────────────────────────────────────────────
    const posCol = document.createElement('div');
    posCol.className = 'rank-col rank-pos';
    posCol.textContent = index + 1;
    row.appendChild(posCol);

    // ── Coluna utilizador ────────────────────────────────────────
    const avatarUrl = profile.avatar_url ||
      'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/animes/avatar_default.png';

    const avatarHtml = (avatarUrl.endsWith('.webm') || avatarUrl.endsWith('.mp4'))
      ? `<video src="${avatarUrl}" autoplay loop muted class="rank-avatar${isPrem ? ' rank-avatar-prem' : ''}"></video>`
      : `<img src="${avatarUrl}" alt="Avatar" class="rank-avatar${isPrem ? ' rank-avatar-prem' : ''}">`;

    const usernameSpan = document.createElement('span');
    usernameSpan.className = 'rank-username';
    usernameSpan.textContent = profile.username;
    if (profile.equipped_name_style && typeof NAME_STYLES !== 'undefined' && NAME_STYLES[profile.equipped_name_style]) {
      const s = NAME_STYLES[profile.equipped_name_style];
      if (s.style) usernameSpan.style.cssText = s.style;
      if (s.className) usernameSpan.classList.add(s.className);
    }

    const userLink = document.createElement('a');
    userLink.href = `../perfil.html?username=${encodeURIComponent(profile.username)}`;
    userLink.className = 'rank-col rank-user';
    userLink.innerHTML = avatarHtml;
    userLink.appendChild(usernameSpan);
    if (isPrem) userLink.insertAdjacentHTML('beforeend', `<span class="rank-prem-badge">★ S1</span>`);
    row.appendChild(userLink);

    // ── Coluna nível ─────────────────────────────────────────────
    const levelCol = document.createElement('div');
    levelCol.className = 'rank-col rank-level';
    levelCol.innerHTML = `<span class="rank-level-badge">LVL ${profile.level}</span>`;
    row.appendChild(levelCol);

    // ── Coluna pontos ────────────────────────────────────────────
    const pointsCol = document.createElement('div');
    pointsCol.className = 'rank-col rank-points';
    pointsCol.textContent = `⭐ ${profile.pontos_totais.toLocaleString('pt-PT')}`;
    row.appendChild(pointsCol);

    rankingBody.appendChild(row);
  });
}

window.addEventListener('beforeunload', () => { if (rankingChannel) window.supabaseClient.removeChannel(rankingChannel); });
document.addEventListener('DOMContentLoaded', carregarRanking);