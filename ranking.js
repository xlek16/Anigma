document.addEventListener('DOMContentLoaded', carregarRanking);

async function carregarRanking() {
    const rankingBody = document.getElementById('rankingBody');
    rankingBody.innerHTML = '<div class="loading-spinner"></div>';

    try {
        const { data, error } = await window.supabaseClient
            .from('profiles')
            .select('username, pontos_totais, level, avatar_url')
            .not('username', 'is', null) // Não mostrar users sem nome
            .order('pontos_totais', { ascending: false })
            .limit(100);

        if (error) throw error;

        rankingBody.innerHTML = ''; // Limpar spinner

        if (data.length === 0) {
            rankingBody.innerHTML = '<div class="ranking-empty">Ainda não há jogadores no ranking. Sê o primeiro!</div>';
            return;
        }

        data.forEach((profile, index) => {
            const row = document.createElement('div');
            row.className = 'ranking-row';
            if (index < 3) {
                row.classList.add(`top-${index + 1}`);
            }

            // Usa o avatar do perfil ou o default que definimos no SQL
            const avatarUrl = profile.avatar_url || 'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/animes/avatar_default.png';

            let avatarHtml = '';
            if (avatarUrl.endsWith('.webm') || avatarUrl.endsWith('.mp4')) {
                avatarHtml = `<video src="${avatarUrl}" autoplay loop muted class="rank-avatar"></video>`;
            } else {
                avatarHtml = `<img src="${avatarUrl}" alt="Avatar" class="rank-avatar">`;
            }

            row.innerHTML = `
                <div class="rank-col rank-pos">${index + 1}</div>
                <div class="rank-col rank-user">
                    ${avatarHtml}
                    <span class="rank-username">${profile.username}</span>
                </div>
                <div class="rank-col rank-level">
                    <span class="rank-level-badge">LVL ${profile.level || 1}</span>
                </div>
                <div class="rank-col rank-points">
                    ⭐ ${profile.pontos_totais.toLocaleString('pt-PT')}
                </div>
            `;
            rankingBody.appendChild(row);
        });

    } catch (e) {
        console.error('Erro ao carregar ranking:', e);
        rankingBody.innerHTML = '<div class="ranking-empty">Ocorreu um erro ao carregar o ranking. Tenta novamente mais tarde.</div>';
    }
}