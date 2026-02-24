// jujutsukaisen.js

const PERSONAGENS = [
  { nome: 'Yuji Itadori',      genero: 'Masculino', raca: 'Humano',           afiliacao: 'Tokyo High',     altura: 173, primeiroArco: 1, estado: 'Vivo' },
  { nome: 'Megumi Fushiguro',  genero: 'Masculino', raca: 'Humano',           afiliacao: 'Tokyo High',     altura: 175, primeiroArco: 1, estado: 'Vivo' },
  { nome: 'Nobara Kugisaki',   genero: 'Feminino',  raca: 'Humano',           afiliacao: 'Tokyo High',     altura: 160, primeiroArco: 1, estado: 'Viva' },
  { nome: 'Satoru Gojo',       genero: 'Masculino', raca: 'Humano',           afiliacao: 'Tokyo High',     altura: 190, primeiroArco: 1, estado: 'Selado' },
  { nome: 'Ryomen Sukuna',     genero: 'Masculino', raca: 'Maldição',         afiliacao: 'Nenhuma',        altura: 173, primeiroArco: 1, estado: 'Vivo' },
  { nome: 'Maki Zenin',        genero: 'Feminino',  raca: 'Humano',           afiliacao: 'Tokyo High',     altura: 170, primeiroArco: 2, estado: 'Viva' },
  { nome: 'Toge Inumaki',      genero: 'Masculino', raca: 'Humano',           afiliacao: 'Tokyo High',     altura: 164, primeiroArco: 2, estado: 'Vivo' },
  { nome: 'Panda',             genero: 'Masculino', raca: 'Corpo Amaldiçoado',afiliacao: 'Tokyo High',     altura: 200, primeiroArco: 2, estado: 'Vivo' },
  { nome: 'Yuta Okkotsu',      genero: 'Masculino', raca: 'Humano',           afiliacao: 'Tokyo High',     altura: 175, primeiroArco: 0, estado: 'Vivo' }, 
  { nome: 'Kento Nanami',      genero: 'Masculino', raca: 'Humano',           afiliacao: 'Tokyo High',     altura: 184, primeiroArco: 3, estado: 'Morto' },
  { nome: 'Suguru Geto',       genero: 'Masculino', raca: 'Humano',           afiliacao: 'Curse Users',    altura: 190, primeiroArco: 0, estado: 'Morto' },
  { nome: 'Mahito',            genero: 'Masculino', raca: 'Maldição',         afiliacao: 'Maldições',      altura: 179, primeiroArco: 3, estado: 'Morto' },
  { nome: 'Jogo',              genero: 'Masculino', raca: 'Maldição',         afiliacao: 'Maldições',      altura: 160, primeiroArco: 2, estado: 'Morto' },
  { nome: 'Hanami',            genero: 'Masculino', raca: 'Maldição',         afiliacao: 'Maldições',      altura: 220, primeiroArco: 2, estado: 'Morto' },
  { nome: 'Aoi Todo',          genero: 'Masculino', raca: 'Humano',           afiliacao: 'Kyoto High',     altura: 190, primeiroArco: 4, estado: 'Vivo' },
  { nome: 'Mai Zenin',         genero: 'Feminino',  raca: 'Humano',           afiliacao: 'Kyoto High',     altura: 170, primeiroArco: 4, estado: 'Morta' },
  { nome: 'Kasumi Miwa',       genero: 'Feminino',  raca: 'Humano',           afiliacao: 'Kyoto High',     altura: 162, primeiroArco: 4, estado: 'Viva' },
  { nome: 'Noritoshi Kamo',    genero: 'Masculino', raca: 'Humano',           afiliacao: 'Kyoto High',     altura: 180, primeiroArco: 4, estado: 'Vivo' },
  { nome: 'Momo Nishimiya',    genero: 'Feminino',  raca: 'Humano',           afiliacao: 'Kyoto High',     altura: 150, primeiroArco: 4, estado: 'Viva' },
  { nome: 'Mechamaru',         genero: 'Masculino', raca: 'Humano',           afiliacao: 'Kyoto High',     altura: 178, primeiroArco: 4, estado: 'Morto' },
  { nome: 'Utahime Iori',      genero: 'Feminino',  raca: 'Humano',           afiliacao: 'Kyoto High',     altura: 169, primeiroArco: 4, estado: 'Viva' },
  { nome: 'Yoshinobu Gakuganji',genero: 'Masculino',raca: 'Humano',           afiliacao: 'Kyoto High',     altura: 155, primeiroArco: 4, estado: 'Vivo' },
  { nome: 'Masamichi Yaga',    genero: 'Masculino', raca: 'Humano',           afiliacao: 'Tokyo High',     altura: 192, primeiroArco: 1, estado: 'Morto' },
  { nome: 'Shoko Ieiri',       genero: 'Feminino',  raca: 'Humano',           afiliacao: 'Tokyo High',     altura: 168, primeiroArco: 2, estado: 'Viva' },
  { nome: 'Kiyotaka Ijichi',   genero: 'Masculino', raca: 'Humano',           afiliacao: 'Tokyo High',     altura: 172, primeiroArco: 1, estado: 'Vivo' },
  { nome: 'Akari Nitta',       genero: 'Feminino',  raca: 'Humano',           afiliacao: 'Tokyo High',     altura: 165, primeiroArco: 5, estado: 'Viva' },
  { nome: 'Mei Mei',           genero: 'Feminino',  raca: 'Humano',           afiliacao: 'Freelancer',     altura: 175, primeiroArco: 4, estado: 'Viva' },
  { nome: 'Ui Ui',             genero: 'Masculino', raca: 'Humano',           afiliacao: 'Freelancer',     altura: 145, primeiroArco: 7, estado: 'Vivo' },
  { nome: 'Naobito Zenin',     genero: 'Masculino', raca: 'Humano',           afiliacao: 'Zenin Clan',     altura: 175, primeiroArco: 7, estado: 'Morto' },
  { nome: 'Naoya Zenin',       genero: 'Masculino', raca: 'Humano',           afiliacao: 'Zenin Clan',     altura: 178, primeiroArco: 8, estado: 'Morto' },
  { nome: 'Toji Fushiguro',    genero: 'Masculino', raca: 'Humano',           afiliacao: 'Zenin Clan',     altura: 184, primeiroArco: 6, estado: 'Morto' },
  { nome: 'Choso',             genero: 'Masculino', raca: 'Pintura da Morte', afiliacao: 'Maldições',      altura: 181, primeiroArco: 5, estado: 'Vivo' },
  { nome: 'Eso',               genero: 'Masculino', raca: 'Pintura da Morte', afiliacao: 'Maldições',      altura: 195, primeiroArco: 5, estado: 'Morto' },
  { nome: 'Kechizu',           genero: 'Masculino', raca: 'Pintura da Morte', afiliacao: 'Maldições',      altura: 150, primeiroArco: 5, estado: 'Morto' },
  { nome: 'Kenjaku',           genero: 'Masculino', raca: 'Humano',           afiliacao: 'Curse Users',    altura: 190, primeiroArco: 2, estado: 'Vivo' },
  { nome: 'Uraume',            genero: 'Indefinido',raca: 'Humano',           afiliacao: 'Curse Users',    altura: 165, primeiroArco: 7, estado: 'Vivo' },
  { nome: 'Hajime Kashimo',    genero: 'Masculino', raca: 'Humano',           afiliacao: 'Culling Game',   altura: 185, primeiroArco: 8, estado: 'Morto' },
  { nome: 'Hiromi Higuruma',   genero: 'Masculino', raca: 'Humano',           afiliacao: 'Culling Game',   altura: 180, primeiroArco: 8, estado: 'Vivo' },
  { nome: 'Kinji Hakari',      genero: 'Masculino', raca: 'Humano',           afiliacao: 'Tokyo High',     altura: 188, primeiroArco: 8, estado: 'Vivo' },
  { nome: 'Kirara Hoshi',      genero: 'Masculino', raca: 'Humano',           afiliacao: 'Tokyo High',     altura: 170, primeiroArco: 8, estado: 'Vivo' },
  { nome: 'Rika Orimoto',      genero: 'Feminino',  raca: 'Maldição',         afiliacao: 'Tokyo High',     altura: 250, primeiroArco: 0, estado: 'Morta' },
  { nome: 'Junpei Yoshino',    genero: 'Masculino', raca: 'Humano',           afiliacao: 'Nenhuma',        altura: 168, primeiroArco: 3, estado: 'Morto' },
  { nome: 'Dagon',             genero: 'Masculino', raca: 'Maldição',         afiliacao: 'Maldições',      altura: 190, primeiroArco: 2, estado: 'Morto' },
];

const ARCOS = {
  0: 'Jujutsu Kaisen 0',
  1: 'Intro / Cursed Child',
  2: 'Fearsome Womb',
  3: 'Vs. Mahito',
  4: 'Kyoto Goodwill Event',
  5: 'Death Painting',
  6: 'Gojo\'s Past',
  7: 'Shibuya Incident',
  8: 'Culling Game',
  9: 'Shinjuku Showdown'
};

const PONTOS_INICIAIS  = 250;
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
      const localData = localStorage.getItem('anigma_jjk_save');
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

          if (estado.jogoTerminado) {
            const ganhou = estado.palpitesDados.includes(secreto.nome);
            mostrarResultado(ganhou, !estado.claimFeito);
          }
        } else {
          localStorage.removeItem('anigma_jjk_save');
        }
      }
      return;
    }
    // ──────────────────────────────────────────────────────────

    const { data } = await window.supabaseClient
      .from('profiles')
      .select('diamantes, pontos_totais, pontos_jjk, tentativas_jjk, jogo_terminado_jjk, ultimo_jogo, palpites_jjk')
      .eq('id', session.user.id)
      .single();

    if (!data) return;

    estado.diamantes    = data.diamantes     || 0;
    estado.pontosTotais = data.pontos_totais || 0;

    if (data.ultimo_jogo === hoje) {
      estado.pontos        = data.pontos_jjk         ?? PONTOS_INICIAIS;
      estado.tentativas    = data.tentativas_jjk     ?? 0;
      estado.jogoTerminado = data.jogo_terminado_jjk ?? false;

      if (data.palpites_jjk) {
        try {
          const guardados = JSON.parse(data.palpites_jjk);
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
      estado.pontos     = PONTOS_INICIAIS;
      estado.tentativas = 0;
      await window.supabaseClient.from('profiles').update({
        pontos_jjk:         PONTOS_INICIAIS,
        tentativas_jjk:     0,
        jogo_terminado_jjk: false,
        ultimo_jogo:        hoje,
        palpites_jjk:       '[]',
      }).eq('id', session.user.id);
    }

  } catch (e) {
    console.warn('Erro ao carregar progresso:', e);
  }
}

// ============================================================
// GUARDAR PROGRESSO
// ============================================================
async function guardarProgresso() {
  const hoje = new Date().toISOString().split('T')[0];

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
    localStorage.setItem('anigma_jjk_save', JSON.stringify(saveState));
    return;
  }

  try {
    await window.supabaseClient.from('profiles').update({
      pontos_jjk:         estado.pontos,
      tentativas_jjk:     estado.tentativas,
      jogo_terminado_jjk: estado.jogoTerminado,
      ultimo_jogo:        hoje,
      palpites_jjk:       JSON.stringify(estado.palpitesDados.map(nome => ({ nome }))),
    }).eq('id', sessaoAtiva.user.id);
  } catch (e) {
    console.warn('Erro ao guardar:', e);
  }
}

// ============================================================
// CLAIM
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

  if (!sessaoAtiva) {
    btn.innerHTML = `
      <div>💎 ${diamantesGanhos} Diamantes · ⭐ ${pontosFinais} Pontos</div>
      <div style="font-size:0.65rem; font-weight:400; opacity:0.9; margin-top:2px;">Só pode dar claim se tiver uma conta</div>
    `;
    btn.style.flexDirection = 'column';
    btn.style.gap = '2px';
    btn.onclick = function () {
      const pendingRewards = { diamantes: diamantesGanhos, pontos: pontosFinais };
      localStorage.setItem('anigma_pending_rewards', JSON.stringify(pendingRewards));
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
      const novosDiamantes = estado.diamantes    + diamantesGanhos;
      const novosPontos    = estado.pontosTotais + pontosFinais;

      const { data: updatedProfile, error } = await window.supabaseClient.from('profiles').update({
        diamantes:     novosDiamantes,
        pontos_totais: novosPontos,
      }).eq('id', sessaoAtiva.user.id).select().single();

      if (error) throw error;

      if (typeof handleLevelUp === 'function') {
        await handleLevelUp(sessaoAtiva.user.id, estado.pontosTotais, novosPontos);
      }

      if (typeof verificarConquistas === 'function') {
        const perfilTemp = { id: sessaoAtiva.user.id, diamantes: novosDiamantes, pontos_totais: novosPontos, unlocked_achievements: updatedProfile.unlocked_achievements, level: updatedProfile.level };
        verificarConquistas(perfilTemp);
      }

      estado.diamantes          = novosDiamantes;
      estado.pontosTotais       = novosPontos;
      estado.diamantesPendentes = 0;

      btn.textContent   = '✓ Recebido!';
      btn.style.opacity = '0.5';

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
      gem.style.cssText = `position:fixed;left:${origem.left + origem.width / 2}px;top:${origem.top + origem.height / 2}px;font-size:1.2rem;z-index:9999;pointer-events:none;transition:left 0.8s cubic-bezier(.2,.8,.4,1),top 0.8s cubic-bezier(.2,.8,.4,1),opacity 0.8s,transform 0.8s;`;
      document.body.appendChild(gem);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        gem.style.left      = destino.left + destino.width / 2 + 'px';
        gem.style.top       = destino.top  + destino.height / 2 + 'px';
        gem.style.opacity   = '0';
        gem.style.transform = 'scale(0.3)';
      }));
      setTimeout(() => gem.remove(), 900);
    }, i * 80);
  }
}

function escolherPersonagemDoDia() {
  const hoje = new Date();
  const seed = hoje.getFullYear() * 10000 + (hoje.getMonth() + 1) * 100 + hoje.getDate();
  return seed % PERSONAGENS.length;
}

function iniciarTimer() {
  function atualizar() {
    const agora = new Date();
    const meia  = new Date(); meia.setHours(24, 0, 0, 0);
    const diff  = meia - agora;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const el = document.getElementById('timer');
    if (el) el.textContent = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  }
  atualizar();
  setInterval(atualizar, 1000);
}

function atualizarUI() {
  const elPontos     = document.getElementById('pontos');
  const elDiamantes  = document.getElementById('diamantes');
  const elTentativas = document.getElementById('tentativas');
  if (elPontos)     elPontos.textContent     = Math.max(0, estado.pontos);
  if (elDiamantes)  elDiamantes.textContent  = estado.diamantesPendentes;
  if (elTentativas) elTentativas.textContent = estado.tentativas;
}

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

function renderizarLinha(p, secreto, correto, animar = true) {
  const row = document.createElement('div');
  row.classList.add('guess-row');
  if (!animar) row.style.animation = 'none';

  row.appendChild(criarCelula('img', '', null));
  row.appendChild(criarCelula('text', p.nome, correto ? 'correct' : 'wrong'));
  row.appendChild(criarCelula('text', p.genero, p.genero === secreto.genero ? 'correct' : 'wrong'));
  row.appendChild(criarCelula('text', p.raca, p.raca === secreto.raca ? 'correct' : 'wrong'));
  row.appendChild(criarCelula('text', p.afiliacao, p.afiliacao === secreto.afiliacao ? 'correct' : 'wrong'));

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

  if (animar) verificarDiamantes(p.genero === secreto.genero, p.raca === secreto.raca, p.afiliacao === secreto.afiliacao, diffAltura === 0, diffArco === 0, estadoC, correto);
  document.getElementById('guessesRows').prepend(row);
}

function criarCelula(tipo, conteudo, classe, html = false) {
  const cell = document.createElement('div');
  cell.classList.add('guess-cell');
  if (classe) cell.classList.add(classe);
  if (tipo === 'img') cell.innerHTML = `<div style="width:40px;height:40px;border-radius:5px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:0.55rem;color:rgba(255,255,255,0.25);">img</div>`;
  else if (html) cell.innerHTML = conteudo;
  else cell.textContent = conteudo;
  return cell;
}

function verificarDiamantes(genero, raca, afil, altura, arco, estadoC, acertou) {
  let ganhou = 0;
  if (!estado.primeiroAmarelo && (genero || raca || afil || estadoC || altura || arco)) { estado.primeiroAmarelo = true; ganhou += 10; }
  if (acertou && !estado.primeiroVerde) { estado.primeiroVerde = true; ganhou += 25; ganhou += Math.max(0, 25 - estado.tentativas * 2); }
  if (ganhou > 0) estado.diamantesPendentes += ganhou;
}

function atualizarDicas() {
  const ok = estado.tentativas >= TENTATIVAS_DICAS;
  for (let i = 1; i <= 3; i++) {
    const btn = document.getElementById('hint' + i);
    if (!btn) continue;
    btn.classList.remove('locked', 'unlocked', 'used');
    if (estado.dicasUsadas >= i) btn.classList.add('used');
    else if (ok) btn.classList.add('unlocked');
    else btn.classList.add('locked');
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
    if (estado.pontos < CUSTO_DICA) { document.getElementById('hintResult').textContent = '⚠ Pontos insuficientes! Compra mais na Loja.'; return; }
    estado.pontos = Math.max(0, estado.pontos - CUSTO_DICA);
  }
  estado.dicasUsadas++;
  document.getElementById('hintResult').textContent = dicas[num - 1];
  atualizarUI();
  atualizarDicas();
  await guardarProgresso();
}

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

async function iniciarJogo() {
  estado.personagemSecretoIdx = escolherPersonagemDoDia();
  console.log('Personagem do dia:', PERSONAGENS[estado.personagemSecretoIdx].nome);
  iniciarTimer();
  await carregarProgresso();
  atualizarUI();
  atualizarDicas();
}

iniciarJogo();
