// dragonball.js — ANIGMA (atualizado para novas tabelas)

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
  { nome: 'Oolong',         genero: 'Masculino', raca: 'Metamorfo',        afiliacao: 'Nenhuma',        altura: 115, primeiroArco: 1,  estado: 'Vivo',  img: '' },
  { nome: 'Puar',           genero: 'Feminino',  raca: 'Metamorfo',        afiliacao: 'Nenhuma',        altura: 90,  primeiroArco: 1,  estado: 'Viva',  img: '' },
  { nome: 'Mestre Kame',    genero: 'Masculino', raca: 'Humano',           afiliacao: 'Z Fighters',     altura: 165, primeiroArco: 1,  estado: 'Vivo',  img: '' },
  { nome: 'Chi-Chi',        genero: 'Feminino',  raca: 'Humano',           afiliacao: 'Z Fighters',     altura: 163, primeiroArco: 1,  estado: 'Viva',  img: '' },
  { nome: 'Yajirobe',       genero: 'Masculino', raca: 'Humano',           afiliacao: 'Z Fighters',     altura: 165, primeiroArco: 2,  estado: 'Vivo',  img: '' },
  { nome: 'Karin',          genero: 'Masculino', raca: 'Deidade',          afiliacao: 'Nenhuma',        altura: 130, primeiroArco: 2,  estado: 'Vivo',  img: '' },
  { nome: 'Kami-sama',      genero: 'Masculino', raca: 'Namekuseijin',     afiliacao: 'Nenhuma',        altura: 190, primeiroArco: 6,  estado: 'Morto', img: '' },
  { nome: 'Mr. Popo',       genero: 'Masculino', raca: 'Outro Mundo',      afiliacao: 'Nenhuma',        altura: 170, primeiroArco: 6,  estado: 'Vivo',  img: '' },
  { nome: 'Pilaf',          genero: 'Masculino', raca: 'Extraterrestre',   afiliacao: 'Império Pilaf',  altura: 120, primeiroArco: 1,  estado: 'Vivo',  img: '' },
  { nome: 'Mai',            genero: 'Feminino',  raca: 'Humano',           afiliacao: 'Império Pilaf',  altura: 160, primeiroArco: 1,  estado: 'Viva',  img: '' },
  { nome: 'Shu',            genero: 'Masculino', raca: 'Antropomorfo',     afiliacao: 'Império Pilaf',  altura: 150, primeiroArco: 1,  estado: 'Vivo',  img: '' },
  { nome: 'Tao Pai Pai',    genero: 'Masculino', raca: 'Humano',           afiliacao: 'Red Ribbon',     altura: 178, primeiroArco: 3,  estado: 'Vivo',  img: '' },
  { nome: 'General Red',    genero: 'Masculino', raca: 'Humano',           afiliacao: 'Red Ribbon',     altura: 110, primeiroArco: 3,  estado: 'Morto', img: '' },
  { nome: 'Comandante Blue',genero: 'Masculino', raca: 'Humano',           afiliacao: 'Red Ribbon',     altura: 180, primeiroArco: 3,  estado: 'Morto', img: '' },
  { nome: 'Piccolo Daimaoh',genero: 'Masculino', raca: 'Namekuseijin',     afiliacao: 'Nenhuma',        altura: 220, primeiroArco: 6,  estado: 'Morto', img: '' },
  { nome: 'Rei Vegeta',     genero: 'Masculino', raca: 'Saiyajin',         afiliacao: 'Planeta Vegeta', altura: 190, primeiroArco: 8,  estado: 'Morto', img: '' },
  { nome: 'Bardock',        genero: 'Masculino', raca: 'Saiyajin',         afiliacao: 'Exército Saiyajin', altura: 180, primeiroArco: 8, estado: 'Morto', img: '' },
  { nome: 'Gine',           genero: 'Feminino',  raca: 'Saiyajin',         afiliacao: 'Exército Saiyajin', altura: 165, primeiroArco: 8, estado: 'Morta', img: '' },
  { nome: 'Dende',          genero: 'Masculino', raca: 'Namekuseijin',     afiliacao: 'Terra',          altura: 140, primeiroArco: 9,  estado: 'Vivo',  img: '' },
  { nome: 'Nail',           genero: 'Masculino', raca: 'Namekuseijin',     afiliacao: 'Namek',          altura: 210, primeiroArco: 9,  estado: 'Morto', img: '' },
  { nome: 'Rei Cold',       genero: 'Masculino', raca: 'Frost Demon',      afiliacao: 'Frieza Force',   altura: 210, primeiroArco: 11, estado: 'Morto', img: '' },
  { nome: 'Android 16',     genero: 'Masculino', raca: 'Androide',         afiliacao: 'Nenhuma',        altura: 226, primeiroArco: 13, estado: 'Morto', img: '' },
  { nome: 'Android 19',     genero: 'Masculino', raca: 'Androide',         afiliacao: 'Red Ribbon',     altura: 155, primeiroArco: 13, estado: 'Morto', img: '' },
  { nome: 'Dr. Gero',       genero: 'Masculino', raca: 'Humano',           afiliacao: 'Red Ribbon',     altura: 165, primeiroArco: 13, estado: 'Morto', img: '' },
  { nome: 'Babidi',         genero: 'Masculino', raca: 'Mago',             afiliacao: 'Nenhuma',        altura: 140, primeiroArco: 17, estado: 'Morto', img: '' },
  { nome: 'Dabura',         genero: 'Masculino', raca: 'Demônio',          afiliacao: 'Babidi',         altura: 190, primeiroArco: 17, estado: 'Morto', img: '' },
  { nome: 'Supremo Kaioshin',genero:'Masculino', raca: 'Kaioshin',         afiliacao: 'Deuses',         altura: 170, primeiroArco: 17, estado: 'Vivo',  img: '' },
  { nome: 'Baby',           genero: 'Masculino', raca: 'Tsufurujin',       afiliacao: 'Nenhuma',        altura: 180, primeiroArco: 20, estado: 'Morto', img: '' },
  { nome: 'Super 17',       genero: 'Masculino', raca: 'Androide',         afiliacao: 'Nenhuma',        altura: 185, primeiroArco: 21, estado: 'Morto', img: '' },
  { nome: 'Omega Shenron',  genero: 'Masculino', raca: 'Dragão',           afiliacao: 'Nenhuma',        altura: 230, primeiroArco: 22, estado: 'Morto', img: '' },
  { nome: 'Champa',         genero: 'Masculino', raca: 'Deus da Destruição',afiliacao:'Universo 6',     altura: 180, primeiroArco: 25, estado: 'Vivo',  img: '' },
  { nome: 'Vados',          genero: 'Feminino',  raca: 'Anjo',             afiliacao: 'Universo 6',     altura: 210, primeiroArco: 25, estado: 'Viva',  img: '' },
  { nome: 'Zeno Sama',      genero: 'Masculino', raca: 'Rei de Tudo',      afiliacao: 'Multiverso',     altura: 120, primeiroArco: 26, estado: 'Vivo',  img: '' },
  { nome: 'Daishinkan',     genero: 'Masculino', raca: 'Anjo',             afiliacao: 'Multiverso',     altura: 230, primeiroArco: 26, estado: 'Vivo',  img: '' },
  { nome: 'Goku Black',     genero: 'Masculino', raca: 'Kaioshin',         afiliacao: 'Nenhuma',        altura: 175, primeiroArco: 26, estado: 'Morto', img: '' },
  { nome: 'Zamasu',         genero: 'Masculino', raca: 'Kaioshin',         afiliacao: 'Universo 10',    altura: 175, primeiroArco: 26, estado: 'Morto', img: '' },
  { nome: 'Toppo',          genero: 'Masculino', raca: 'Extraterrestre',   afiliacao: 'Pride Troopers', altura: 190, primeiroArco: 27, estado: 'Vivo',  img: '' },
  { nome: 'Caulifla',       genero: 'Feminino',  raca: 'Saiyajin',         afiliacao: 'Universo 6',     altura: 160, primeiroArco: 27, estado: 'Viva',  img: '' },
  { nome: 'Kale',           genero: 'Feminino',  raca: 'Saiyajin',         afiliacao: 'Universo 6',     altura: 155, primeiroArco: 27, estado: 'Viva',  img: '' },
  { nome: 'Cabba',          genero: 'Masculino', raca: 'Saiyajin',         afiliacao: 'Universo 6',     altura: 165, primeiroArco: 25, estado: 'Vivo',  img: '' },
  { nome: 'Gamma 1',        genero: 'Masculino', raca: 'Androide',         afiliacao: 'Red Ribbon',     altura: 180, primeiroArco: 28, estado: 'Vivo',  img: '' },
  { nome: 'Gamma 2',        genero: 'Masculino', raca: 'Androide',         afiliacao: 'Red Ribbon',     altura: 180, primeiroArco: 28, estado: 'Morto', img: '' },
  { nome: 'Dr. Hedo',       genero: 'Masculino', raca: 'Humano',           afiliacao: 'Red Ribbon',     altura: 165, primeiroArco: 28, estado: 'Vivo',  img: '' },
  { nome: 'Cell Max',       genero: 'Masculino', raca: 'Androide',         afiliacao: 'Red Ribbon',     altura: 300, primeiroArco: 28, estado: 'Morto', img: '' },
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
// CARREGAR PROGRESSO — novas tabelas
// ============================================================
async function carregarProgresso() {
  try {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    sessaoAtiva = session;
    const hoje = new Date().toISOString().split('T')[0];

    if (!session) {
      const localData = localStorage.getItem('anigma_dragonball_save');
      if (localData) {
        const data = JSON.parse(localData);
        if (data.data === hoje) {
          estado.pontos             = data.pontos;
          estado.tentativas         = data.tentativas;
          estado.jogoTerminado      = data.jogoTerminado;
          estado.diamantesPendentes = data.diamantesPendentes || 0;
          estado.palpitesDados      = data.palpites || [];
          estado.claimFeito         = data.claimFeito || false;
          const secreto = PERSONAGENS[estado.personagemSecretoIdx];
          estado.palpitesDados.forEach(nome => {
            const p = PERSONAGENS.find(x => x.nome === nome);
            if (p) renderizarLinha(p, secreto, p.nome === secreto.nome, false);
          });
          if (estado.jogoTerminado) mostrarResultado(estado.palpitesDados.includes(secreto.nome), !estado.claimFeito);
        } else {
          localStorage.removeItem('anigma_dragonball_save');
        }
      }
      return;
    }

    const [statsRes, jogoRes] = await Promise.all([
      window.supabaseClient.from('profile_stats').select('diamantes, pontos_totais').eq('user_id', session.user.id).single(),
      window.supabaseClient.from('game_state_db').select('*').eq('user_id', session.user.id).single(),
    ]);

    const stats = statsRes.data;
    const jogo  = jogoRes.data;
    if (!stats || !jogo) return;

    estado.diamantes    = stats.diamantes     || 0;
    estado.pontosTotais = stats.pontos_totais || 0;

    if (jogo.ultimo_jogo_db === hoje) {
      estado.pontos        = jogo.pontos_db         ?? PONTOS_INICIAIS;
      estado.tentativas    = jogo.tentativas_db      ?? 0;
      estado.jogoTerminado = jogo.jogo_terminado_db  ?? false;
      estado.claimFeito    = jogo.claim_feito_db     ?? false;
      if (jogo.palpites_db) {
        try {
          const guardados = JSON.parse(jogo.palpites_db);
          estado.palpitesDados = guardados.map(p => p.nome);
          const secreto = PERSONAGENS[estado.personagemSecretoIdx];
          guardados.forEach(p => {
            const personagem = PERSONAGENS.find(x => x.nome === p.nome);
            if (personagem) renderizarLinha(personagem, secreto, personagem.nome === secreto.nome, false);
          });
          if (estado.jogoTerminado) mostrarResultado(estado.palpitesDados.includes(secreto.nome), !estado.claimFeito);
        } catch (e) { console.warn('Erro ao restaurar palpites:', e); }
      }
    } else {
      estado.pontos     = PONTOS_INICIAIS;
      estado.tentativas = 0;
      await window.supabaseClient.from('game_state_db').update({
        pontos_db: PONTOS_INICIAIS, tentativas_db: 0,
        jogo_terminado_db: false, claim_feito_db: false,
        ultimo_jogo_db: hoje, palpites_db: '[]',
      }).eq('user_id', session.user.id);
    }

    if (window.weeklyRewards) window.weeklyRewards.mostrarPremiosSemanasPendentes();
  } catch (e) { console.warn('Erro ao carregar progresso:', e); }
}

// ============================================================
// GUARDAR PROGRESSO — novas tabelas
// ============================================================
async function guardarProgresso() {
  const hoje = new Date().toISOString().split('T')[0];
  if (!sessaoAtiva) {
    localStorage.setItem('anigma_dragonball_save', JSON.stringify({
      data: hoje, pontos: estado.pontos, tentativas: estado.tentativas,
      jogoTerminado: estado.jogoTerminado, palpites: estado.palpitesDados,
      diamantesPendentes: estado.diamantesPendentes, claimFeito: estado.claimFeito,
    }));
    return;
  }
  try {
    await window.supabaseClient.from('game_state_db').update({
      pontos_db: estado.pontos, tentativas_db: estado.tentativas,
      jogo_terminado_db: estado.jogoTerminado,
      palpites_db: JSON.stringify(estado.palpitesDados.map(n => ({ nome: n }))),
    }).eq('user_id', sessaoAtiva.user.id);
  } catch (e) { console.warn('Erro ao guardar:', e); }
}

// ============================================================
// CLAIM — novas tabelas
// ============================================================
function mostrarBotaoClaim(diamantesGanhos) {
  if (estado.claimFeito) return;
  const resultEl = document.getElementById('gameResult');
  if (!resultEl) return;
  document.getElementById('btnClaim')?.remove();

  const pontosFinais = Math.max(0, estado.pontos);
  const btn = document.createElement('button');
  btn.id = 'btnClaim';
  btn.className = 'btn-claim';

  if (!sessaoAtiva) {
    btn.innerHTML = `<div>💎 ${diamantesGanhos} Diamantes · ⭐ ${pontosFinais} Pontos</div><div style="font-size:.65rem;font-weight:400;opacity:.9;margin-top:2px;">Só podes receber com uma conta</div>`;
    btn.style.flexDirection = 'column';
    btn.onclick = () => {
      localStorage.setItem('anigma_pending_rewards', JSON.stringify({ diamantes: diamantesGanhos, pontos: pontosFinais }));
      document.getElementById('resultText').innerHTML = `As tuas recompensas foram guardadas! <br><strong>Cria uma conta para as receber.</strong>`;
      btn.textContent = 'Criar Conta';
      btn.onclick = () => sairDaPagina('../register.html');
    };
    resultEl.appendChild(btn);
    return;
  }

  btn.innerHTML = `💎 Receber ${diamantesGanhos} Diamantes · ⭐ +${pontosFinais} Pontos`;
  btn.onclick = async function () {
    if (estado.claimFeito) return;
    btn.disabled = true; btn.textContent = 'A guardar...';
    try {
      const hoje  = new Date().toISOString().split('T')[0];
      const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      const { data: stats } = await window.supabaseClient
        .from('profile_stats')
        .select('current_streak, last_streak_date, pontos_totais, diamantes, level, acertos_primeira_tentativa')
        .eq('user_id', sessaoAtiva.user.id).single();

      let newStreak = stats.current_streak || 0;
      if (stats.last_streak_date !== hoje) {
        newStreak = stats.last_streak_date === ontem ? newStreak + 1 : 1;
      }

      const ganhou    = estado.palpitesDados.includes(PERSONAGENS[estado.personagemSecretoIdx].nome);
      const primeira  = ganhou && estado.tentativas === 1;
      const novoAcertos1a  = (stats.acertos_primeira_tentativa || 0) + (primeira ? 1 : 0);
      const novosDiamantes = (stats.diamantes || 0) + diamantesGanhos;
      const novosPontos    = (stats.pontos_totais || 0) + pontosFinais;

      await Promise.all([
        window.supabaseClient.from('profile_stats').update({
          diamantes: novosDiamantes, pontos_totais: novosPontos,
          current_streak: newStreak, last_streak_date: hoje,
          acertos_primeira_tentativa: novoAcertos1a,
        }).eq('user_id', sessaoAtiva.user.id),
        window.supabaseClient.from('game_state_db').update({ claim_feito_db: true }).eq('user_id', sessaoAtiva.user.id),
      ]);

      if (window.weeklyRewards) await window.weeklyRewards.registarPontosSemana(sessaoAtiva.user.id, pontosFinais);

      if (typeof window.spAddXp === 'function') {
        await window.spAddXp('jogar');
        if (ganhou) {
          const fonte = estado.tentativas === 1 ? 'primeira_tent' : estado.tentativas <= 3 ? 'acertar_top3' : 'acertar';
          await window.spAddXp(fonte);
        }
        if (newStreak > 0) await window.spAddXp('streak');
      }

      if (typeof handleLevelUp === 'function') await handleLevelUp(sessaoAtiva.user.id, stats.pontos_totais, novosPontos);
      if (typeof verificarConquistas === 'function') {
        await verificarConquistas({ ...stats, diamantes: novosDiamantes, pontos_totais: novosPontos, current_streak: newStreak, acertos_primeira_tentativa: novoAcertos1a });
      }

      estado.claimFeito = true;
      btn.textContent   = '✓ Recebido!';
      btn.style.opacity = '0.5';
      animarDiamantesParaHeader(diamantesGanhos, btn);
      if (typeof atualizarHeaderStats === 'function') atualizarHeaderStats(novosDiamantes, novosPontos);
    } catch (e) { console.error('Erro no claim:', e); btn.textContent = 'Erro! Tenta de novo.'; btn.disabled = false; }
  };
  resultEl.appendChild(btn);
}

// ============================================================
// ANIMAÇÃO DIAMANTES
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
      gem.style.cssText = `position:fixed;left:${origem.left+origem.width/2}px;top:${origem.top+origem.height/2}px;font-size:1.2rem;z-index:9999;pointer-events:none;transition:left .8s cubic-bezier(.2,.8,.4,1),top .8s cubic-bezier(.2,.8,.4,1),opacity .8s,transform .8s;`;
      document.body.appendChild(gem);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        gem.style.left = destino.left + destino.width/2 + 'px';
        gem.style.top  = destino.top  + destino.height/2 + 'px';
        gem.style.opacity   = '0';
        gem.style.transform = 'scale(0.3)';
      }));
      setTimeout(() => { gem.remove(); if (i===total-1) { headerEl.style.color='#ffd700'; setTimeout(()=>headerEl.style.color='',500); } }, 900);
    }, i * 80);
  }
}

// ============================================================
// PERSONAGEM DO DIA + TIMER
// ============================================================
function escolherPersonagemDoDia() {
  const hoje = new Date();
  const seed = hoje.getFullYear() * 10000 + (hoje.getMonth() + 1) * 100 + hoje.getDate();
  return seed % PERSONAGENS.length;
}

function iniciarTimer() {
  function atualizar() {
    const agora = new Date(); const meia = new Date(); meia.setHours(24, 0, 0, 0);
    const diff = meia - agora;
    const h = Math.floor(diff / 3600000); const m = Math.floor((diff % 3600000) / 60000); const s = Math.floor((diff % 60000) / 1000);
    const el = document.getElementById('timer');
    if (el) el.textContent = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  }
  atualizar(); setInterval(atualizar, 1000);
}

// ============================================================
// UI
// ============================================================
function atualizarUI() {
  const elPontos     = document.getElementById('pontos');
  const elDiamantes  = document.getElementById('diamantes');
  const elTentativas = document.getElementById('tentativas');
  if (elPontos)     elPontos.textContent     = Math.max(0, estado.pontos);
  if (elDiamantes)  elDiamantes.textContent  = estado.diamantesPendentes;
  if (elTentativas) elTentativas.textContent = estado.tentativas;
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
  const res = PERSONAGENS.filter(p => p.nome.toLowerCase().includes(query) && !estado.palpitesDados.includes(p.nome)).slice(0, 6);
  if (!res.length) { suggestionsEl.classList.remove('open'); return; }
  res.forEach(p => {
    const item = document.createElement('div');
    item.classList.add('suggestion-item');
    item.innerHTML = `<div style="width:36px;height:36px;border-radius:5px;background:rgba(255,255,255,0.08);flex-shrink:0;"></div><div class="suggestion-name">${p.nome}</div>`;
    item.addEventListener('click', () => { inputEl.value = p.nome; suggestionsEl.classList.remove('open'); submeterPalpite(); });
    suggestionsEl.appendChild(item);
  });
  suggestionsEl.classList.add('open');
});
document.addEventListener('click', e => { if (!e.target.closest('.game-search-wrap')) suggestionsEl.classList.remove('open'); });
inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') submeterPalpite(); });

// ============================================================
// SUBMETER PALPITE
// ============================================================
async function submeterPalpite() {
  if (estado.jogoTerminado) return;
  const nome = inputEl.value.trim();
  if (!nome) return;
  const personagem = PERSONAGENS.find(p => p.nome.toLowerCase() === nome.toLowerCase());
  if (!personagem) { inputEl.style.borderColor = '#f87171'; setTimeout(() => inputEl.style.borderColor = '', 800); return; }
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

  if (correto) await terminarJogo(true);
  else if (estado.tentativas >= MAX_TENTATIVAS) await terminarJogo(false);
  else await guardarProgresso();
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
  const arcoExtra  = diffArco === 0 ? '' : diffArco > 0 ? '<span class="arrow-down">▼ mais cedo</span>' : '<span class="arrow-up">▲ mais tarde</span>';
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
  } else if (html) { cell.innerHTML = conteudo; }
  else { cell.textContent = conteudo; }
  return cell;
}

// ============================================================
// DIAMANTES
// ============================================================
function verificarDiamantes(genero, raca, afil, altura, arco, estadoC, acertou) {
  let ganhou = 0;
  if (!estado.primeiroAmarelo && (genero || raca || afil || estadoC || altura || arco)) { estado.primeiroAmarelo = true; ganhou += 10; }
  if (acertou && !estado.primeiroVerde) { estado.primeiroVerde = true; ganhou += 25 + Math.max(0, 25 - estado.tentativas * 2); }
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
  if (estado.tentativas < TENTATIVAS_DICAS) { document.getElementById('hintResult').textContent = '⚠ Só podes usar dicas a partir da 10.ª tentativa!'; return; }
  if (estado.dicasUsadas >= num) return;
  const secreto = PERSONAGENS[estado.personagemSecretoIdx];
  const dicas   = ['💡 O personagem é do género: ' + secreto.genero, '💡 A raça do personagem é: ' + secreto.raca, '💡 A afiliação é: ' + secreto.afiliacao];
  if (estado.dicasUsadas >= DICAS_GRATIS) {
    if (estado.pontos < CUSTO_DICA) { document.getElementById('hintResult').textContent = '⚠ Pontos insuficientes!'; return; }
    estado.pontos = Math.max(0, estado.pontos - CUSTO_DICA);
  }
  estado.dicasUsadas++;
  document.getElementById('hintResult').textContent = dicas[num - 1];
  atualizarUI(); atualizarDicas(); await guardarProgresso();
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
    ? `💎 +${estado.diamantesPendentes} diamantes para receber!` : '';
  resultEl.style.display = 'block';
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  document.getElementById('searchInput').disabled   = true;
  document.querySelector('.btn-submit-guess')?.setAttribute('disabled', '');
  if (mostrarClaim && estado.diamantesPendentes > 0 && !estado.claimFeito) mostrarBotaoClaim(estado.diamantesPendentes);
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