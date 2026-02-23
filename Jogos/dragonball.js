// dragonball.js

const PERSONAGENS = [
  { nome: 'Goku',        genero: 'Masculino', raca: 'Saiyajin',        afiliacao: 'Z Fighters',     altura: 175, primeiroArco: 1,  estado: 'Vivo',  img: '' },
  { nome: 'Vegeta',      genero: 'Masculino', raca: 'Saiyajin',        afiliacao: 'Z Fighters',     altura: 164, primeiroArco: 5,  estado: 'Vivo',  img: '' },
  { nome: 'Gohan',       genero: 'Masculino', raca: 'Meio-Saiyajin',   afiliacao: 'Z Fighters',     altura: 176, primeiroArco: 5,  estado: 'Vivo',  img: '' },
  { nome: 'Piccolo',     genero: 'Masculino', raca: 'Namekuseijin',    afiliacao: 'Z Fighters',     altura: 226, primeiroArco: 2,  estado: 'Vivo',  img: '' },
  { nome: 'Bulma',       genero: 'Feminino',  raca: 'Humano',          afiliacao: 'Z Fighters',     altura: 165, primeiroArco: 1,  estado: 'Viva',  img: '' },
  { nome: 'Krillin',     genero: 'Masculino', raca: 'Humano',          afiliacao: 'Z Fighters',     altura: 153, primeiroArco: 1,  estado: 'Vivo',  img: '' },
  { nome: 'Trunks',      genero: 'Masculino', raca: 'Meio-Saiyajin',   afiliacao: 'Z Fighters',     altura: 170, primeiroArco: 7,  estado: 'Vivo',  img: '' },
  { nome: 'Goten',       genero: 'Masculino', raca: 'Meio-Saiyajin',   afiliacao: 'Z Fighters',     altura: 123, primeiroArco: 8,  estado: 'Vivo',  img: '' },
  { nome: 'Frieza',      genero: 'Masculino', raca: 'Frost Demon',     afiliacao: 'Frieza Force',   altura: 158, primeiroArco: 4,  estado: 'Vivo',  img: '' },
  { nome: 'Cell',        genero: 'Masculino', raca: 'Androide',        afiliacao: 'Nenhuma',        altura: 213, primeiroArco: 7,  estado: 'Morto', img: '' },
  { nome: 'Majin Buu',   genero: 'Masculino', raca: 'Majin',           afiliacao: 'Nenhuma',        altura: 160, primeiroArco: 8,  estado: 'Vivo',  img: '' },
  { nome: 'Android 18',  genero: 'Feminino',  raca: 'Androide',        afiliacao: 'Z Fighters',     altura: 165, primeiroArco: 7,  estado: 'Viva',  img: '' },
  { nome: 'Android 17',  genero: 'Masculino', raca: 'Androide',        afiliacao: 'Z Fighters',     altura: 170, primeiroArco: 7,  estado: 'Vivo',  img: '' },
  { nome: 'Tenshinhan',  genero: 'Masculino', raca: 'Humano',          afiliacao: 'Z Fighters',     altura: 187, primeiroArco: 2,  estado: 'Vivo',  img: '' },
  { nome: 'Yamcha',      genero: 'Masculino', raca: 'Humano',          afiliacao: 'Z Fighters',     altura: 183, primeiroArco: 1,  estado: 'Vivo',  img: '' },
  { nome: 'Chiaotzu',    genero: 'Masculino', raca: 'Humano',          afiliacao: 'Z Fighters',     altura: 138, primeiroArco: 2,  estado: 'Vivo',  img: '' },
  { nome: 'Raditz',      genero: 'Masculino', raca: 'Saiyajin',        afiliacao: 'Frieza Force',   altura: 187, primeiroArco: 5,  estado: 'Morto', img: '' },
  { nome: 'Nappa',       genero: 'Masculino', raca: 'Saiyajin',        afiliacao: 'Frieza Force',   altura: 195, primeiroArco: 5,  estado: 'Morto', img: '' },
  { nome: 'Zarbon',      genero: 'Masculino', raca: 'Extraterrestre',  afiliacao: 'Frieza Force',   altura: 188, primeiroArco: 4,  estado: 'Morto', img: '' },
  { nome: 'Ginyu',       genero: 'Masculino', raca: 'Extraterrestre',  afiliacao: 'Ginyu Force',    altura: 188, primeiroArco: 4,  estado: 'Morto', img: '' },
  { nome: 'Gotenks',     genero: 'Masculino', raca: 'Meio-Saiyajin',   afiliacao: 'Z Fighters',     altura: 138, primeiroArco: 8,  estado: 'Vivo',  img: '' },
  { nome: 'Vegito',      genero: 'Masculino', raca: 'Saiyajin',        afiliacao: 'Z Fighters',     altura: 177, primeiroArco: 8,  estado: 'Vivo',  img: '' },
  { nome: 'Gogeta',      genero: 'Masculino', raca: 'Saiyajin',        afiliacao: 'Z Fighters',     altura: 177, primeiroArco: 9,  estado: 'Vivo',  img: '' },
  { nome: 'Beerus',      genero: 'Masculino', raca: 'Deus',            afiliacao: 'Deuses',         altura: 198, primeiroArco: 10, estado: 'Vivo',  img: '' },
  { nome: 'Whis',        genero: 'Masculino', raca: 'Anjo',            afiliacao: 'Deuses',         altura: 208, primeiroArco: 10, estado: 'Vivo',  img: '' },
  { nome: 'Hit',         genero: 'Masculino', raca: 'Extraterrestre',  afiliacao: 'Universo 6',     altura: 198, primeiroArco: 11, estado: 'Vivo',  img: '' },
  { nome: 'Jiren',       genero: 'Masculino', raca: 'Extraterrestre',  afiliacao: 'Pride Troopers', altura: 200, primeiroArco: 12, estado: 'Vivo',  img: '' },
  { nome: 'Broly',       genero: 'Masculino', raca: 'Saiyajin',        afiliacao: 'Nenhuma',        altura: 198, primeiroArco: 9,  estado: 'Vivo',  img: '' },
  { nome: 'Pan',         genero: 'Feminino',  raca: 'Quarto-Saiyajin', afiliacao: 'Z Fighters',     altura: 115, primeiroArco: 8,  estado: 'Viva',  img: '' },
  { nome: 'Uub',         genero: 'Masculino', raca: 'Humano',          afiliacao: 'Z Fighters',     altura: 142, primeiroArco: 8,  estado: 'Vivo',  img: '' },
   // DRAGON BALL CLÁSSICO
{ nome: 'Oolong', genero: 'Masculino', raca: 'Metamorfo', afiliacao: 'Nenhuma', altura: 115, primeiroArco: 1, estado: 'Vivo', img: '' },
{ nome: 'Puar', genero: 'Feminino', raca: 'Metamorfo', afiliacao: 'Nenhuma', altura: 90, primeiroArco: 1, estado: 'Viva', img: '' },
{ nome: 'Mestre Kame', genero: 'Masculino', raca: 'Humano', afiliacao: 'Z Fighters', altura: 165, primeiroArco: 1, estado: 'Vivo', img: '' },
{ nome: 'Chi-Chi', genero: 'Feminino', raca: 'Humano', afiliacao: 'Z Fighters', altura: 163, primeiroArco: 1, estado: 'Viva', img: '' },
{ nome: 'Yajirobe', genero: 'Masculino', raca: 'Humano', afiliacao: 'Z Fighters', altura: 165, primeiroArco: 2, estado: 'Vivo', img: '' },
{ nome: 'Karin', genero: 'Masculino', raca: 'Deidade', afiliacao: 'Nenhuma', altura: 130, primeiroArco: 2, estado: 'Vivo', img: '' },
{ nome: 'Kami-sama', genero: 'Masculino', raca: 'Namekuseijin', afiliacao: 'Nenhuma', altura: 190, primeiroArco: 6, estado: 'Morto', img: '' },
{ nome: 'Mr. Popo', genero: 'Masculino', raca: 'Outro Mundo', afiliacao: 'Nenhuma', altura: 170, primeiroArco: 6, estado: 'Vivo', img: '' },
{ nome: 'Pilaf', genero: 'Masculino', raca: 'Extraterrestre', afiliacao: 'Império Pilaf', altura: 120, primeiroArco: 1, estado: 'Vivo', img: '' },
{ nome: 'Mai', genero: 'Feminino', raca: 'Humano', afiliacao: 'Império Pilaf', altura: 160, primeiroArco: 1, estado: 'Viva', img: '' },
{ nome: 'Shu', genero: 'Masculino', raca: 'Antropomorfo', afiliacao: 'Império Pilaf', altura: 150, primeiroArco: 1, estado: 'Vivo', img: '' },
{ nome: 'Tao Pai Pai', genero: 'Masculino', raca: 'Humano', afiliacao: 'Red Ribbon', altura: 178, primeiroArco: 3, estado: 'Vivo', img: '' },
{ nome: 'General Red', genero: 'Masculino', raca: 'Humano', afiliacao: 'Red Ribbon', altura: 110, primeiroArco: 3, estado: 'Morto', img: '' },
{ nome: 'Comandante Blue', genero: 'Masculino', raca: 'Humano', afiliacao: 'Red Ribbon', altura: 180, primeiroArco: 3, estado: 'Morto', img: '' },
{ nome: 'Piccolo Daimaoh', genero: 'Masculino', raca: 'Namekuseijin', afiliacao: 'Nenhuma', altura: 220, primeiroArco: 6, estado: 'Morto', img: '' },

// SAIYAJINS E RELACIONADOS

{ nome: 'Rei Vegeta', genero: 'Masculino', raca: 'Saiyajin', afiliacao: 'Planeta Vegeta', altura: 190, primeiroArco: 8, estado: 'Morto', img: '' },
{ nome: 'Bardock', genero: 'Masculino', raca: 'Saiyajin', afiliacao: 'Exército Saiyajin', altura: 180, primeiroArco: 8, estado: 'Morto', img: '' },
{ nome: 'Gine', genero: 'Feminino', raca: 'Saiyajin', afiliacao: 'Exército Saiyajin', altura: 165, primeiroArco: 8, estado: 'Morta', img: '' },

// NAMEK

{ nome: 'Dende', genero: 'Masculino', raca: 'Namekuseijin', afiliacao: 'Terra', altura: 140, primeiroArco: 9, estado: 'Vivo', img: '' },
{ nome: 'Nail', genero: 'Masculino', raca: 'Namekuseijin', afiliacao: 'Namek', altura: 210, primeiroArco: 9, estado: 'Morto', img: '' },
{ nome: 'Rei Cold', genero: 'Masculino', raca: 'Frost Demon', afiliacao: 'Frieza Force', altura: 210, primeiroArco: 11, estado: 'Morto', img: '' },

// ANDROIDES

{ nome: 'Android 16', genero: 'Masculino', raca: 'Androide', afiliacao: 'Nenhuma', altura: 226, primeiroArco: 13, estado: 'Morto', img: '' },
{ nome: 'Android 19', genero: 'Masculino', raca: 'Androide', afiliacao: 'Red Ribbon', altura: 155, primeiroArco: 13, estado: 'Morto', img: '' },
{ nome: 'Dr. Gero', genero: 'Masculino', raca: 'Humano', afiliacao: 'Red Ribbon', altura: 165, primeiroArco: 13, estado: 'Morto', img: '' },

// BUU

{ nome: 'Babidi', genero: 'Masculino', raca: 'Mago', afiliacao: 'Nenhuma', altura: 140, primeiroArco: 17, estado: 'Morto', img: '' },
{ nome: 'Dabura', genero: 'Masculino', raca: 'Demônio', afiliacao: 'Babidi', altura: 190, primeiroArco: 17, estado: 'Morto', img: '' },
{ nome: 'Supremo Kaioshin', genero: 'Masculino', raca: 'Kaioshin', afiliacao: 'Deuses', altura: 170, primeiroArco: 17, estado: 'Vivo', img: '' },

// GT

{ nome: 'Baby', genero: 'Masculino', raca: 'Tsufurujin', afiliacao: 'Nenhuma', altura: 180, primeiroArco: 20, estado: 'Morto', img: '' },
{ nome: 'Super 17', genero: 'Masculino', raca: 'Androide', afiliacao: 'Nenhuma', altura: 185, primeiroArco: 21, estado: 'Morto', img: '' },
{ nome: 'Omega Shenron', genero: 'Masculino', raca: 'Dragão', afiliacao: 'Nenhuma', altura: 230, primeiroArco: 22, estado: 'Morto', img: '' },

// SUPER

{ nome: 'Champa', genero: 'Masculino', raca: 'Deus da Destruição', afiliacao: 'Universo 6', altura: 180, primeiroArco: 25, estado: 'Vivo', img: '' },
{ nome: 'Vados', genero: 'Feminino', raca: 'Anjo', afiliacao: 'Universo 6', altura: 210, primeiroArco: 25, estado: 'Viva', img: '' },
{ nome: 'Zeno Sama', genero: 'Masculino', raca: 'Rei de Tudo', afiliacao: 'Multiverso', altura: 120, primeiroArco: 26, estado: 'Vivo', img: '' },
{ nome: 'Daishinkan', genero: 'Masculino', raca: 'Anjo', afiliacao: 'Multiverso', altura: 230, primeiroArco: 26, estado: 'Vivo', img: '' },
{ nome: 'Goku Black', genero: 'Masculino', raca: 'Kaioshin', afiliacao: 'Nenhuma', altura: 175, primeiroArco: 26, estado: 'Morto', img: '' },
{ nome: 'Zamasu', genero: 'Masculino', raca: 'Kaioshin', afiliacao: 'Universo 10', altura: 175, primeiroArco: 26, estado: 'Morto', img: '' },
{ nome: 'Hit', genero: 'Masculino', raca: 'Assassino', afiliacao: 'Universo 6', altura: 198, primeiroArco: 25, estado: 'Vivo', img: '' },
{ nome: 'Toppo', genero: 'Masculino', raca: 'Extraterrestre', afiliacao: 'Pride Troopers', altura: 190, primeiroArco: 27, estado: 'Vivo', img: '' },
{ nome: 'Caulifla', genero: 'Feminino', raca: 'Saiyajin', afiliacao: 'Universo 6', altura: 160, primeiroArco: 27, estado: 'Viva', img: '' },
{ nome: 'Kale', genero: 'Feminino', raca: 'Saiyajin', afiliacao: 'Universo 6', altura: 155, primeiroArco: 27, estado: 'Viva', img: '' },
{ nome: 'Cabba', genero: 'Masculino', raca: 'Saiyajin', afiliacao: 'Universo 6', altura: 165, primeiroArco: 25, estado: 'Vivo', img: '' },
{ nome: 'Gamma 1', genero: 'Masculino', raca: 'Androide', afiliacao: 'Red Ribbon', altura: 180, primeiroArco: 28, estado: 'Vivo', img: '' },
{ nome: 'Gamma 2', genero: 'Masculino', raca: 'Androide', afiliacao: 'Red Ribbon', altura: 180, primeiroArco: 28, estado: 'Morto', img: '' },
{ nome: 'Dr. Hedo', genero: 'Masculino', raca: 'Humano', afiliacao: 'Red Ribbon', altura: 165, primeiroArco: 28, estado: 'Vivo', img: '' },
{ nome: 'Cell Max', genero: 'Masculino', raca: 'Androide', afiliacao: 'Red Ribbon', altura: 300, primeiroArco: 28, estado: 'Morto', img: '' },
];

const ARCOS = {
  1: 'Emperor Pilaf', 2: 'Torneio Artes Marciais', 3: 'Red Ribbon Army',
  4: 'Arco Frieza', 5: 'Arco Saiyajins', 6: 'Arco Namek',
  7: 'Androides/Cell', 8: 'Arco Majin Buu', 9: 'Arco Broly',
  10: 'Battle of Gods', 11: 'Universe 6', 12: 'Tournament of Power',
};

const PONTOS_INICIAIS  = 300;
const CUSTO_TENTATIVA  = 2;
const CUSTO_DICA       = 20;
const DICAS_GRATIS     = 3;
const TENTATIVAS_DICAS = 10;
const MAX_TENTATIVAS   = 50;

let estado = {
  personagemSecretoIdx: 0,
  pontos:               PONTOS_INICIAIS, 
  diamantes:            0,               
  pontosTotais:         0,              
  diamantesPendentes:   0,               
  tentativas:           0,
  jogoTerminado:        false,
  claimFeito:           false,
  dicasUsadas:          0,
  primeiroAmarelo:      false,
  primeiroVerde:        false,
  palpitesDados:        [],
};

let sessaoAtiva = null;

// ============================================================
// CARREGAR PROGRESSO
// ============================================================
async function carregarProgresso() {
  try {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    sessaoAtiva = session;

    const hoje = new Date().toISOString().split('T')[0];

    // ── MODO CONVIDADO (Sem Login) ────────────────────────────
    if (!session) {
      const localData = localStorage.getItem('anigma_dragonball_save');
      if (localData) {
        const data = JSON.parse(localData);
        // Só carrega se for do mesmo dia
        if (data.data === hoje) {
          estado.pontos             = data.pontos;
          estado.tentativas         = data.tentativas;
          estado.jogoTerminado      = data.jogoTerminado;
          estado.diamantesPendentes = data.diamantesPendentes || 0;
          estado.palpitesDados      = data.palpites || [];
          estado.claimFeito         = data.claimFeito || false;

          // Renderizar palpites
          const secreto = PERSONAGENS[estado.personagemSecretoIdx];
          estado.palpitesDados.forEach(nome => {
            const p = PERSONAGENS.find(x => x.nome === nome);
            if (p) renderizarLinha(p, secreto, p.nome === secreto.nome, false);
          });

          if (estado.jogoTerminado) {
            const ganhou = estado.palpitesDados.includes(secreto.nome);
            mostrarResultado(ganhou, !estado.claimFeito);
          }
        } else {
          // Dia diferente, limpa save antigo
          localStorage.removeItem('anigma_dragonball_save');
        }
      }
      return;
    }
    // ──────────────────────────────────────────────────────────

    const { data } = await window.supabaseClient
      .from('profiles')
      .select('diamantes, pontos_totais, pontos_db, tentativas_db, jogo_terminado, ultimo_jogo, palpites_db, claim_feito')
      .eq('id', session.user.id)
      .single();

    if (!data) return;

    // Totais do utilizador — nunca se perdem
    estado.diamantes    = data.diamantes     || 0;
    estado.pontosTotais = data.pontos_totais || 0;

    if (data.ultimo_jogo === hoje) {
      // Mesmo dia — restaurar progresso da partida
      estado.pontos        = data.pontos_db     ?? PONTOS_INICIAIS;
      estado.tentativas    = data.tentativas_db ?? 0;
      estado.jogoTerminado = data.jogo_terminado ?? false;
      estado.claimFeito    = data.claim_feito    ?? false;

      if (data.palpites_db) {
        try {
          const guardados = JSON.parse(data.palpites_db);
          estado.palpitesDados = guardados.map(p => p.nome);
          const secreto = PERSONAGENS[estado.personagemSecretoIdx];
          guardados.forEach(p => {
            const personagem = PERSONAGENS.find(x => x.nome === p.nome);
            if (personagem) renderizarLinha(personagem, secreto, personagem.nome === secreto.nome, false);
          });
          if (estado.jogoTerminado) {
            const ganhou = estado.palpitesDados.includes(secreto.nome);
            mostrarResultado(ganhou, !estado.claimFeito);
          }
        } catch (e) {
          console.warn('Erro ao restaurar palpites:', e);
        }
      }
    } else {
      // Novo dia — reset só do progresso da partida, totais ficam intactos
      estado.pontos     = PONTOS_INICIAIS;
      estado.tentativas = 0;
      await window.supabaseClient.from('profiles').update({
        pontos_db:      PONTOS_INICIAIS,
        tentativas_db:  0,
        jogo_terminado: false,
        claim_feito:    false,
        ultimo_jogo:    hoje,
        palpites_db:    '[]',
      }).eq('id', session.user.id);
    }

  } catch (e) {
    console.warn('Erro ao carregar progresso:', e);
  }
}

// ============================================================
// GUARDAR PROGRESSO (so estado da partida, NAO totais)
// ============================================================
async function guardarProgresso() {
  const hoje = new Date().toISOString().split('T')[0];

  // Se não tiver login, guarda no navegador
  if (!sessaoAtiva) {
    const saveState = {
      data:               hoje,
      pontos:             estado.pontos,
      tentativas:         estado.tentativas,
      jogoTerminado:      estado.jogoTerminado,
      palpites:           estado.palpitesDados,
      diamantesPendentes: estado.diamantesPendentes,
      claimFeito:         estado.claimFeito
    };
    localStorage.setItem('anigma_dragonball_save', JSON.stringify(saveState));
    return;
  }

  try {
    await window.supabaseClient.from('profiles').update({
      pontos_db:      estado.pontos,
      tentativas_db:  estado.tentativas,
      jogo_terminado: estado.jogoTerminado,
      ultimo_jogo:    hoje,
      palpites_db:    JSON.stringify(estado.palpitesDados.map(nome => ({ nome }))),
    }).eq('id', sessaoAtiva.user.id);
  } catch (e) {
    console.warn('Erro ao guardar:', e);
  }
}

// ============================================================
// CLAIM — somar ao pontos_totais e diamantes, nunca substituir
// ============================================================
function mostrarBotaoClaim(diamantesGanhos) {
  if (estado.claimFeito) return;

  const resultEl = document.getElementById('gameResult');
  if (!resultEl) return;

  const antigo = document.getElementById('btnClaim');
  if (antigo) antigo.remove();

  const pontosFinais = Math.max(0, estado.pontos);

  const btn = document.createElement('button');
  btn.id        = 'btnClaim';
  btn.className = 'btn-claim';
  btn.innerHTML = `💎 Receber ${diamantesGanhos} Diamantes · ⭐ +${pontosFinais} Pontos`;

  // Se for convidado, mostra mensagem e manda para login
  if (!sessaoAtiva) {
    btn.innerHTML = `
      <div>💎 ${diamantesGanhos} Diamantes · ⭐ ${pontosFinais} Pontos</div>
      <div style="font-size:0.65rem; font-weight:400; opacity:0.9; margin-top:2px;">Só pode dar claim se tiver uma conta</div>
    `;
    btn.style.flexDirection = 'column';
    btn.style.gap = '2px';
    btn.onclick = function () {
      // Guardar recompensas para atribuir após login/registo
      const pendingRewards = {
        diamantes: diamantesGanhos,
        pontos:    pontosFinais,
      };
      localStorage.setItem('anigma_pending_rewards', JSON.stringify(pendingRewards));

      // Mudar o texto do resultado para informar o utilizador
      const resultTextEl = document.getElementById('resultText');
      if (resultTextEl) {
        resultTextEl.innerHTML = `As tuas recompensas (💎 ${diamantesGanhos} e ⭐ ${pontosFinais}) foram guardadas! <br><strong>Cria uma conta ou faz login para as receber.</strong>`;
      }
      this.textContent = 'Criar Conta para Receber';
      this.onclick = () => sairDaPagina('../register.html');
    };
    resultEl.appendChild(btn);
    return;
  }

  btn.onclick = async function () {
    if (estado.claimFeito) return;
    estado.claimFeito = true;
    btn.disabled    = true;
    btn.textContent = 'A guardar...';

    try {
      // Somar ao total acumulado — nunca substituir
      const novosDiamantes = estado.diamantes    + diamantesGanhos;
      const novosPontos    = estado.pontosTotais + pontosFinais;

      const { data: updatedProfile, error } = await window.supabaseClient.from('profiles').update({
        diamantes:     novosDiamantes, // total diamantes acumulado
        pontos_totais: novosPontos,    // total pontos acumulado
        claim_feito:   true,
      }).eq('id', sessaoAtiva.user.id).select().single();

      if (error) throw error;

      // Atualizar estado local
      if (typeof handleLevelUp === 'function') {
        await handleLevelUp(sessaoAtiva.user.id, estado.pontosTotais, novosPontos);
      }

      // Verificar conquistas
      if (typeof verificarConquistas === 'function') {
        // Criar objeto perfil temporário para verificação
        const perfilTemp = { id: sessaoAtiva.user.id, diamantes: novosDiamantes, pontos_totais: novosPontos, unlocked_achievements: updatedProfile.unlocked_achievements, level: updatedProfile.level };
        verificarConquistas(perfilTemp);
      }

      estado.diamantes          = novosDiamantes;
      estado.pontosTotais       = novosPontos;
      estado.diamantesPendentes = 0;

      btn.textContent   = '✓ Recebido!';
      btn.style.opacity = '0.5';

      // Animar e atualizar header SO agora
      animarDiamantesParaHeader(diamantesGanhos, btn);
      if (typeof atualizarHeaderStats === 'function') {
        atualizarHeaderStats(novosDiamantes, novosPontos);
      }

    } catch (e) {
      console.error('Erro no claim:', e);
      btn.textContent   = 'Erro! Tenta de novo.';
      btn.disabled      = false;
      estado.claimFeito = false;
    }
  };

  resultEl.appendChild(btn);
}

// ============================================================
// ANIMACAO DIAMANTES A VOAR PARA O HEADER
// ============================================================
function animarDiamantesParaHeader(quantidade, origemEl) {
  const headerEl = document.getElementById('headerDiamantes');
  if (!headerEl) return;

  const destino = headerEl.getBoundingClientRect();
  const origem  = origemEl.getBoundingClientRect();
  const total   = Math.min(quantidade, 10);

  for (let i = 0; i < total; i++) {
    setTimeout(() => {
      const gem = document.createElement('div');
      gem.textContent = '💎';
      gem.style.cssText = `
        position:fixed;
        left:${origem.left + origem.width / 2}px;
        top:${origem.top + origem.height / 2}px;
        font-size:1.2rem;
        z-index:9999;
        pointer-events:none;
        transition:left 0.8s cubic-bezier(.2,.8,.4,1),top 0.8s cubic-bezier(.2,.8,.4,1),opacity 0.8s,transform 0.8s;
      `;
      document.body.appendChild(gem);

      requestAnimationFrame(() => requestAnimationFrame(() => {
        gem.style.left      = destino.left + destino.width / 2 + 'px';
        gem.style.top       = destino.top  + destino.height / 2 + 'px';
        gem.style.opacity   = '0';
        gem.style.transform = 'scale(0.3)';
      }));

      setTimeout(() => {
        gem.remove();
        if (i === total - 1) {
          headerEl.style.color = '#ffd700';
          setTimeout(() => headerEl.style.color = '', 500);
        }
      }, 900);
    }, i * 80);
  }
}

// ============================================================
// PERSONAGEM DO DIA
// ============================================================
function escolherPersonagemDoDia() {
  const hoje = new Date();
  const seed = hoje.getFullYear() * 10000 + (hoje.getMonth() + 1) * 100 + hoje.getDate();
  return seed % PERSONAGENS.length;
}

// ============================================================
// TIMER
// ============================================================
function iniciarTimer() {
  function atualizar() {
    const agora = new Date();
    const meia  = new Date(); meia.setHours(24, 0, 0, 0);
    const diff  = meia - agora;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const el = document.getElementById('timer');
    if (el) el.textContent =
      String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  }
  atualizar();
  setInterval(atualizar, 1000);
}

// ============================================================
// UI — pontos da partida + diamantes pendentes (NAO totais)
// ============================================================
function atualizarUI() {
  const elPontos     = document.getElementById('pontos');
  const elDiamantes  = document.getElementById('diamantes');
  const elTentativas = document.getElementById('tentativas');
  if (elPontos)     elPontos.textContent     = Math.max(0, estado.pontos);
  if (elDiamantes)  elDiamantes.textContent  = estado.diamantesPendentes;
  if (elTentativas) elTentativas.textContent = estado.tentativas;
  // Header NAO atualizado aqui — so apos o claim
}

// ============================================================
// PESQUISA
// ============================================================
const inputEl       = document.getElementById('searchInput');
const suggestionsEl = document.getElementById('searchSuggestions');

inputEl.addEventListener('input', function () {
  const query = this.value.trim().toLowerCase();
  suggestionsEl.innerHTML = '';
  if (!query) { suggestionsEl.classList.remove('open'); return; }

  const res = PERSONAGENS.filter(p =>
    p.nome.toLowerCase().includes(query) && !estado.palpitesDados.includes(p.nome)
  ).slice(0, 6);

  if (!res.length) { suggestionsEl.classList.remove('open'); return; }

  res.forEach(p => {
    const item = document.createElement('div');
    item.classList.add('suggestion-item');
    item.innerHTML = `
      <div style="width:36px;height:36px;border-radius:5px;background:rgba(255,255,255,0.08);flex-shrink:0;"></div>
      <div class="suggestion-name">${p.nome}</div>`;
    item.addEventListener('click', () => {
      inputEl.value = p.nome;
      suggestionsEl.classList.remove('open');
      submeterPalpite();
    });
    suggestionsEl.appendChild(item);
  });
  suggestionsEl.classList.add('open');
});

document.addEventListener('click', e => {
  if (!e.target.closest('.game-search-wrap')) suggestionsEl.classList.remove('open');
});
inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') submeterPalpite(); });

// ============================================================
// SUBMETER PALPITE
// ============================================================
async function submeterPalpite() {
  if (estado.jogoTerminado) return;

  const nome = inputEl.value.trim();
  if (!nome) return;

  const personagem = PERSONAGENS.find(p => p.nome.toLowerCase() === nome.toLowerCase());
  if (!personagem) {
    inputEl.style.borderColor = '#f87171';
    setTimeout(() => inputEl.style.borderColor = '', 800);
    return;
  }
  if (estado.palpitesDados.includes(personagem.nome)) { inputEl.value = ''; return; }

  estado.palpitesDados.push(personagem.nome);
  estado.tentativas++;

  const secreto = PERSONAGENS[estado.personagemSecretoIdx];
  const correto  = personagem.nome === secreto.nome;

  if (!correto) estado.pontos = Math.max(0, estado.pontos - CUSTO_TENTATIVA);

  renderizarLinha(personagem, secreto, correto, true);
  atualizarUI();
  atualizarDicas();

  inputEl.value = '';
  suggestionsEl.classList.remove('open');

  if (correto) {
    await terminarJogo(true);
  } else if (estado.tentativas >= MAX_TENTATIVAS) {
    await terminarJogo(false);
  } else {
    await guardarProgresso();
  }
}

// ============================================================
// RENDERIZAR LINHA
// ============================================================
function renderizarLinha(p, secreto, correto, animar = true) {
  const row = document.createElement('div');
  row.classList.add('guess-row');
  if (!animar) row.style.animation = 'none';

  row.appendChild(criarCelula('img', '', null));
  row.appendChild(criarCelula('text', p.nome, correto ? 'correct' : 'wrong'));

  const generoC = p.genero === secreto.genero;
  row.appendChild(criarCelula('text', p.genero, generoC ? 'correct' : 'wrong'));

  const racaC = p.raca === secreto.raca;
  row.appendChild(criarCelula('text', p.raca, racaC ? 'correct' : 'wrong'));

  const afilC = p.afiliacao === secreto.afiliacao;
  row.appendChild(criarCelula('text', p.afiliacao, afilC ? 'correct' : 'wrong'));

  const diffAltura = p.altura - secreto.altura;
  const altClasse  = diffAltura === 0 ? 'correct' : Math.abs(diffAltura) <= 10 ? 'close' : 'wrong';
  const altExtra   = diffAltura === 0 ? '' : diffAltura > 0 ? '<span class="arrow-down">▼</span>' : '<span class="arrow-up">▲</span>';
  row.appendChild(criarCelula('text', p.altura + ' cm ' + altExtra, altClasse, true));

  const diffArco   = p.primeiroArco - secreto.primeiroArco;
  const arcoClasse = diffArco === 0 ? 'correct' : Math.abs(diffArco) === 1 ? 'close' : 'wrong';
  const arcoExtra  = diffArco === 0 ? '' : diffArco > 0
    ? '<span class="arrow-down">▼ mais cedo</span>'
    : '<span class="arrow-up">▲ mais tarde</span>';
  row.appendChild(criarCelula('text', (ARCOS[p.primeiroArco] || 'Arco ' + p.primeiroArco) + ' ' + arcoExtra, arcoClasse, true));

  const estadoC = p.estado === secreto.estado;
  row.appendChild(criarCelula('text', p.estado, estadoC ? 'correct' : 'wrong'));

  if (animar) verificarDiamantes(generoC, racaC, afilC, diffAltura === 0, diffArco === 0, estadoC, correto);

  document.getElementById('guessesRows').prepend(row);
}

function criarCelula(tipo, conteudo, classe, html = false) {
  const cell = document.createElement('div');
  cell.classList.add('guess-cell');
  if (classe) cell.classList.add(classe);
  if (tipo === 'img') {
    cell.innerHTML = `<div style="width:40px;height:40px;border-radius:5px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:0.55rem;color:rgba(255,255,255,0.25);">img</div>`;
  } else if (html) {
    cell.innerHTML = conteudo;
  } else {
    cell.textContent = conteudo;
  }
  return cell;
}

// ============================================================
// DIAMANTES
// ============================================================
function verificarDiamantes(genero, raca, afil, altura, arco, estadoC, acertou) {
  let ganhou = 0;

  if (!estado.primeiroAmarelo && (genero || raca || afil || estadoC || altura || arco)) {
    estado.primeiroAmarelo = true;
    ganhou += 10;
  }

  if (acertou && !estado.primeiroVerde) {
    estado.primeiroVerde = true;
    ganhou += 25;
    const bonus = Math.max(0, 25 - estado.tentativas * 2);
    ganhou += bonus;
  }

  if (ganhou > 0) estado.diamantesPendentes += ganhou;
}

// ============================================================
// DICAS
// ============================================================
function atualizarDicas() {
  const ok = estado.tentativas >= TENTATIVAS_DICAS;
  for (let i = 1; i <= 3; i++) {
    const btn = document.getElementById('hint' + i);
    if (!btn) continue;
    btn.classList.remove('locked', 'unlocked', 'used');
    if (estado.dicasUsadas >= i) btn.classList.add('used');
    else if (ok)                  btn.classList.add('unlocked');
    else                          btn.classList.add('locked');
  }
  const el = document.getElementById('dicasRestantes');
  if (el) el.textContent = Math.max(0, DICAS_GRATIS - estado.dicasUsadas) + ' gratuitas restantes';
}

async function usarDica(num) {
  if (estado.jogoTerminado) return;
  if (estado.tentativas < TENTATIVAS_DICAS) {
    document.getElementById('hintResult').textContent = '⚠ Só podes usar dicas a partir da 10.ª tentativa!';
    return;
  }
  if (estado.dicasUsadas >= num) return;

  const secreto = PERSONAGENS[estado.personagemSecretoIdx];
  const dicas   = [
    '💡 O personagem é do género: ' + secreto.genero,
    '💡 A raça do personagem é: '   + secreto.raca,
    '💡 A afiliação é: '             + secreto.afiliacao,
  ];

  if (estado.dicasUsadas >= DICAS_GRATIS) {
    if (estado.pontos < CUSTO_DICA) {
      document.getElementById('hintResult').textContent = '⚠ Pontos insuficientes! Compra mais na Loja.';
      return;
    }
    estado.pontos = Math.max(0, estado.pontos - CUSTO_DICA);
  }

  estado.dicasUsadas++;
  document.getElementById('hintResult').textContent = dicas[num - 1];
  atualizarUI();
  atualizarDicas();
  await guardarProgresso();
}

// ============================================================
// FIM DO JOGO
// ============================================================
function mostrarResultado(ganhou, mostrarClaim = true) {
  const secreto  = PERSONAGENS[estado.personagemSecretoIdx];
  const resultEl = document.getElementById('gameResult');
  if (!resultEl) return;

  document.getElementById('resultIcon').textContent  = ganhou ? '🎉' : '😔';
  document.getElementById('resultTitle').textContent = ganhou ? 'Acertaste!' : 'Não foi desta...';
  document.getElementById('resultText').textContent  = ganhou
    ? `Encontraste em ${estado.tentativas} tentativa(s) com ${Math.max(0, estado.pontos)} pontos!`
    : `O personagem era: ${secreto.nome}`;
  document.getElementById('resultDiamonds').textContent = estado.diamantesPendentes > 0
    ? `💎 +${estado.diamantesPendentes} diamantes para receber!`
    : '';

  resultEl.style.display = 'block';
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const inputEl   = document.getElementById('searchInput');
  const btnSubmit = document.querySelector('.btn-submit-guess');
  if (inputEl)   inputEl.disabled   = true;
  if (btnSubmit) btnSubmit.disabled = true;

  if (mostrarClaim && estado.diamantesPendentes > 0 && !estado.claimFeito) {
    mostrarBotaoClaim(estado.diamantesPendentes);
  }
}

async function terminarJogo(ganhou) {
  estado.jogoTerminado = true;
  mostrarResultado(ganhou, true);
  await guardarProgresso();
}

// ============================================================
// INICIAR
// ============================================================
async function iniciarJogo() {
  estado.personagemSecretoIdx = escolherPersonagemDoDia();
  console.log('Personagem do dia:', PERSONAGENS[estado.personagemSecretoIdx].nome);
  iniciarTimer();
  await carregarProgresso();
  atualizarUI();
  atualizarDicas();
}

iniciarJogo();