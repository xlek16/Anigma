let rankingChannel = null;

async function carregarRanking() {
    const rankingBody = document.getElementById('rankingBody');
    rankingBody.innerHTML = '<div class="loading-spinner"></div>';

    try {
        const { data, error } = await window.supabaseClient
            .from('profiles')
            .select('id, username, pontos_totais, level, avatar_url, equipped_name_style')
            .not('username', 'is', null) // Não mostrar users sem nome
            .order('pontos_totais', { ascending: false })
            .limit(100);

        if (error) throw error;

        renderRanking(data);

        // Subscribe to realtime updates
        if (rankingChannel) {
            window.supabaseClient.removeChannel(rankingChannel);
        }
        rankingChannel = window.supabaseClient.channel('public:profiles')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, payload => {
                console.log('Ranking update received, reloading...', payload);
                // A simple but effective way is to just reload the whole ranking
                carregarRanking(); 
            })
            .subscribe();

    } catch (e) {
        console.error('Erro ao carregar ranking:', e);
        rankingBody.innerHTML = '<div class="ranking-empty">Ocorreu um erro ao carregar o ranking. Tenta novamente mais tarde.</div>';
    }
}

function renderRanking(data) {
    const rankingBody = document.getElementById('rankingBody');
    rankingBody.innerHTML = ''; // Limpar spinner ou conteúdo antigo

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
        row.dataset.userId = profile.id;

        const avatarUrl = profile.avatar_url || 'https://kpfrlivnrqqzajwpambo.supabase.co/storage/v1/object/public/animes/avatar_default.png';

        let avatarHtml = '';
        if (avatarUrl.endsWith('.webm') || avatarUrl.endsWith('.mp4')) {
            avatarHtml = `<video src="${avatarUrl}" autoplay loop muted class="rank-avatar"></video>`;
        } else {
            avatarHtml = `<img src="${avatarUrl}" alt="Avatar" class="rank-avatar">`;
        }

        const usernameSpan = document.createElement('span');
        usernameSpan.className = 'rank-username';
        usernameSpan.textContent = profile.username;

        if (profile.equipped_name_style && typeof NAME_STYLES !== 'undefined' && NAME_STYLES[profile.equipped_name_style]) {
            const styleInfo = NAME_STYLES[profile.equipped_name_style];
            if (styleInfo.style) usernameSpan.style.cssText = styleInfo.style;
            if (styleInfo.className) usernameSpan.classList.add(styleInfo.className);
        }

        const userLink = document.createElement('a');
        userLink.href = `../perfil.html?username=${encodeURIComponent(profile.username)}`;
        userLink.className = 'rank-col rank-user';
        userLink.innerHTML = avatarHtml;
        userLink.appendChild(usernameSpan);

        row.innerHTML = `
            <div class="rank-col rank-pos">${index + 1}</div>
            <div class="rank-col rank-level">
                <span class="rank-level-badge">LVL ${profile.level || 1}</span>
            </div>
            <div class="rank-col rank-points">
                ⭐ ${profile.pontos_totais.toLocaleString('pt-PT')}
            </div>
        `;
        row.insertBefore(userLink, row.querySelector('.rank-level'));
        rankingBody.appendChild(row);
    });
}

window.addEventListener('beforeunload', () => {
    if (rankingChannel) {
        window.supabaseClient.removeChannel(rankingChannel);
    }
});

document.addEventListener('DOMContentLoaded', carregarRanking);