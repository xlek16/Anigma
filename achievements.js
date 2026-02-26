// achievements.js

const ACHIEVEMENTS = {
    'nivel_5': {
        name: 'Novato Promissor',
        description: 'Alcança o nível 5.',
        reward: { diamonds: 50 },
        check: (profile) => (profile.level || 1) >= 5,
    },
    'nivel_10': {
        name: 'Veterano',
        description: 'Alcança o nível 10.',
        reward: { diamonds: 100, title: 'Veterano' },
        check: (profile) => (profile.level || 1) >= 10,
    },
    'primeira_compra': {
        name: 'Primeira Compra',
        description: 'Compra o teu primeiro item na loja.',
        reward: { diamonds: 25 },
        check: (profile) => (profile.unlocked_avatars?.length || 0) + (profile.unlocked_themes?.length || 0) + (profile.unlocked_name_styles?.length || 0) > 0,
    },
    'colecionador_avatar': {
        name: 'Colecionador de Avatares',
        description: 'Desbloqueia 5 avatares diferentes.',
        reward: { diamonds: 75, title: 'Colecionador' },
        check: (profile) => (profile.unlocked_avatars?.length || 0) >= 5,
    },
    'mestre_db': {
        name: 'Mestre de Dragon Ball',
        description: 'Joga o modo Dragon Ball 10 vezes.',
        reward: { diamonds: 50, title: 'Guerreiro Z' },
        check: (profile) => (profile.tentativas_db || 0) >= 10,
    },
    'mestre_jjk': {
        name: 'Feiticeiro de Jujutsu',
        description: 'Joga o modo Jujutsu Kaisen 10 vezes.',
        reward: { diamonds: 50, title: 'Feiticeiro' },
        check: (profile) => (profile.tentativas_jjk || 0) >= 10,
    }
};

// ── Toast de notificação (substitui o alert) ──────────────────
function mostrarToastConquista(achievement) {
    // Remover toast anterior se existir
    document.querySelector('.achievement-toast')?.remove();

    const rewardParts = [];
    if (achievement.reward.diamonds) rewardParts.push(`💎 +${achievement.reward.diamonds} diamantes`);
    if (achievement.reward.title)    rewardParts.push(`🏷️ Título "${achievement.reward.title}"`);
    const rewardString = rewardParts.join(' · ');

    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
        <div class="achievement-toast-icon">🏆</div>
        <div class="achievement-toast-body">
            <div class="achievement-toast-title">Conquista Desbloqueada!</div>
            <div class="achievement-toast-name">${achievement.name}</div>
            ${rewardString ? `<div class="achievement-toast-reward">${rewardString}</div>` : ''}
        </div>
    `;

    // Estilos inline para não depender de CSS externo
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        border: 1px solid #f59e0b;
        border-radius: 12px;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 99999;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(245,158,11,0.2);
        color: white;
        font-family: 'DM Sans', sans-serif;
        max-width: 320px;
        animation: slideInToast 0.4s ease;
    `;

    // Adicionar CSS da animação se ainda não existir
    if (!document.getElementById('toast-keyframes')) {
        const style = document.createElement('style');
        style.id = 'toast-keyframes';
        style.textContent = `
            @keyframes slideInToast {
                from { transform: translateX(120%); opacity: 0; }
                to   { transform: translateX(0);    opacity: 1; }
            }
            .achievement-toast-icon { font-size: 2rem; flex-shrink: 0; }
            .achievement-toast-title { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: #f59e0b; font-weight: 700; }
            .achievement-toast-name  { font-size: 0.95rem; font-weight: 700; margin: 2px 0; }
            .achievement-toast-reward { font-size: 0.78rem; color: #a3e635; margin-top: 3px; }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Remover após 4 segundos
    setTimeout(() => {
        toast.style.animation = 'slideInToast 0.4s ease reverse';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ── Verificar e guardar conquistas ────────────────────────────
async function verificarConquistas(profile) {
    if (!profile || !profile.id) return;

    const unlocked    = profile.unlocked_achievements || [];
    const newlyUnlocked = [];
    const totalRewards  = { diamonds: 0, titles: [] };

    for (const id in ACHIEVEMENTS) {
        if (!unlocked.includes(id)) {
            const achievement = ACHIEVEMENTS[id];
            if (achievement.check(profile)) {
                newlyUnlocked.push(id);
                if (achievement.reward.diamonds) totalRewards.diamonds += achievement.reward.diamonds;
                if (achievement.reward.title)    totalRewards.titles.push(achievement.reward.title);

                // Mostrar toast com delay entre conquistas
                setTimeout(() => {
                    mostrarToastConquista(achievement);
                }, 800 * (newlyUnlocked.indexOf(id) + 1));
            }
        }
    }

    if (newlyUnlocked.length === 0) return;

    try {
        const newUnlockedList = [...unlocked, ...newlyUnlocked];
        const newDiamonds    = (profile.diamantes || 0) + totalRewards.diamonds;
        const newTitles      = [...(profile.unlocked_titles || []), ...totalRewards.titles];

        const { error } = await window.supabaseClient
            .from('profiles')
            .update({
                unlocked_achievements: newUnlockedList,
                diamantes:             newDiamonds,
                unlocked_titles:       newTitles,
            })
            .eq('id', profile.id);

        if (error) throw error;

        // Atualizar objeto local
        profile.unlocked_achievements = newUnlockedList;
        profile.diamantes             = newDiamonds;
        profile.unlocked_titles       = newTitles;

        // Atualizar header
        if (typeof atualizarHeaderStats === 'function') {
            atualizarHeaderStats(newDiamonds, profile.pontos_totais || profile.pontos_db);
        }

    } catch (e) {
        console.error('Erro ao guardar conquistas:', e);
    }
}

// Expor globalmente para ser chamado da loja após compras
window.verificarConquistas = verificarConquistas;