// jujutsukaisen.js — ANIGMA (atualizado para novas tabelas)

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
  0: 'Jujutsu Kaisen 0', 1: 'Intro / Cursed Child', 2: 'Fearsome Womb',
  3: 'Vs. Mahito', 4: 'Kyoto Goodwill Event', 5: 'Death Painting',
  6: "Gojo's Past", 7: 'Shibuya Incident', 8: 'Culling Game', 9: 'Shinjuku Showdown',
};

const PONTOS_INICIAIS  = 250;
const CUSTO_TENTATIVA  = 2;
const CUSTO_DICA       = 20;
const DICAS_GRATIS     = 3;
const TENTATIVAS_DICAS = 10;
const MAX_TENTATIVAS   = 50;

let estado = {
  personagemSecretoIdx: 0, pontos: PONTOS_INICIAIS, diamantes: 0,
  pontosTotais: 0, diamantesPendentes: 0, tentativas: 0,
  jogoTerminado: false, claimFeito: false, dicasUsadas: 0,
  primeiroAmarelo: false, primeiroVerde: false, palpitesDados: [],
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
          if (estado.jogoTerminado) mostrarResultado(estado.palpitesDados.includes(secreto.nome), !estado.claimFeito);
        } else { localStorage.removeItem('anigma_jjk_save'); }
      }
      return;
    }

    const [statsRes, jogoRes] = await Promise.all([
      window.supabaseClient.from('profile_stats').select('diamantes, pontos_totais').eq('user_id', session.user.id).single(),
      window.supabaseClient.from('game_state_jjk').select('*').eq('user_id', session.user.id).single(),
    ]);

    const stats = statsRes.data;
    const jogo  = jogoRes.data;
    if (!stats || !jogo) return;

    estado.diamantes    = stats.diamantes     || 0;
    estado.pontosTotais = stats.pontos_totais || 0;

    if (jogo.ultimo_jogo_jjk === hoje) {
      estado.pontos        = jogo.pontos_jjk         ?? PONTOS_INICIAIS;
      estado.tentativas    = jogo.tentativas_jjk     ?? 0;
      estado.jogoTerminado = jogo.jogo_terminado_jjk ?? false;
      estado.claimFeito    = jogo.claim_feito_jjk    ?? false;
      if (jogo.palpites_jjk) {
        try {
          const guardados = JSON.parse(jogo.palpites_jjk);
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
      estado.pontos = PONTOS_INICIAIS; estado.tentativas = 0;
      await window.supabaseClient.from('game_state_jjk').update({
        pontos_jjk: PONTOS_INICIAIS, tentativas_jjk: 0,
        jogo_terminado_jjk: false, claim_feito_jjk: false,
        ultimo_jogo_jjk: hoje, palpites_jjk: '[]',
      }).eq('user_id', session.user.id);
    }
  } catch (e) { console.warn('Erro ao carregar progresso:', e); }
}

// ============================================================
// GUARDAR PROGRESSO — novas tabelas
// ============================================================
async function guardarProgresso() {
  const hoje = new Date().toISOString().split('T')[0];
  if (!sessaoAtiva) {
    localStorage.setItem('anigma_jjk_save', JSON.stringify({
      data: hoje, pontos: estado.pontos, tentativas: estado.tentativas,
      jogoTerminado: estado.jogoTerminado, palpites: estado.palpitesDados,
      diamantesPendentes: estado.diamantesPendentes, claimFeito: estado.claimFeito,
    }));
    return;
  }
  try {
    await window.supabaseClient.from('game_state_jjk').update({
      pontos_jjk: estado.pontos, tentativas_jjk: estado.tentativas,
      jogo_terminado_jjk: estado.jogoTerminado,
      palpites_jjk: JSON.stringify(estado.palpitesDados.map(nome => ({ nome }))),
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
  btn.id = 'btnClaim'; btn.className = 'btn-claim';

  if (!sessaoAtiva) {
    btn.innerHTML = `<div>💎 ${diamantesGanhos} Diamantes · ⭐ ${pontosFinais} Pontos</div><div style="font-size:.65rem;font-weight:400;opacity:.9;margin-top:2px;">Só podes receber com uma conta</div>`;
    btn.style.flexDirection = 'column';
    btn.onclick = () => {
      localStorage.setItem('anigma_pending_rewards', JSON.stringify({ diamantes: diamantesGanhos, pontos: pontosFinais }));
      document.getElementById('resultText').innerHTML = `As tuas recompensas foram guardadas! <br><strong>Cria uma conta para as receber.</strong>`;
      btn.textContent = 'Criar Conta';
      btn.onclick = () => sairDaPagina('../register.html');
    };
    resultEl.appendChild(btn); return;
  }

  btn.innerHTML = `💎 Receber ${diamantesGanhos} Diamantes · ⭐ +${pontosFinais} Pontos`;
  btn.onclick = async function () {
    if (estado.claimFeito) return;
    btn.disabled = true; btn.textContent = 'A guardar...';
    try {
      const hoje  = new Date().toISOString().split('T')[0];
      const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      const { data: stats } = await window.supabaseClient
        .from('profile_stats').select('current_streak, last_streak_date, pontos_totais, diamantes, level')
        .eq('user_id', sessaoAtiva.user.id).single();

      let newStreak = stats.current_streak || 0;
      if (stats.last_streak_date !== hoje) newStreak = stats.last_streak_date === ontem ? newStreak + 1 : 1;

      const novosDiamantes = (stats.diamantes || 0) + diamantesGanhos;
      const novosPontos    = (stats.pontos_totais || 0) + pontosFinais;

      await Promise.all([
        window.supabaseClient.from('profile_stats').update({
          diamantes: novosDiamantes, pontos_totais: novosPontos,
          current_streak: newStreak, last_streak_date: hoje,
        }).eq('user_id', sessaoAtiva.user.id),
        window.supabaseClient.from('game_state_jjk').update({ claim_feito_jjk: true }).eq('user_id', sessaoAtiva.user.id),
      ]);

      if (typeof handleLevelUp === 'function') await handleLevelUp(sessaoAtiva.user.id, stats.pontos_totais, novosPontos);
      if (typeof verificarConquistas === 'function') await verificarConquistas({ ...stats, diamantes: novosDiamantes, pontos_totais: novosPontos, current_streak: newStreak });

      estado.claimFeito = true;
      btn.textContent = '✓ Recebido!'; btn.style.opacity = '0.5';
      animarDiamantesParaHeader(diamantesGanhos, btn);
      if (typeof atualizarHeaderStats === 'function') atualizarHeaderStats(novosDiamantes, novosPontos);
    } catch (e) { console.error('Erro no claim:', e); btn.textContent = 'Erro! Tenta de novo.'; btn.disabled = false; }
  };
  resultEl.appendChild(btn);
}

function animarDiamantesParaHeader(quantidade, origemEl) {
  const headerEl = document.getElementById('headerDiamantes');
  if (!headerEl) return;
  const destino = headerEl.getBoundingClientRect();
  const origem  = origemEl.getBoundingClientRect();
  for (let i = 0; i < Math.min(quantidade, 10); i++) {
    setTimeout(() => {
      const gem = document.createElement('div');
      gem.textContent = '💎';
      gem.style.cssText = `position:fixed;left:${origem.left+origem.width/2}px;top:${origem.top+origem.height/2}px;font-size:1.2rem;z-index:9999;pointer-events:none;transition:left .8s cubic-bezier(.2,.8,.4,1),top .8s cubic-bezier(.2,.8,.4,1),opacity .8s,transform .8s;`;
      document.body.appendChild(gem);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        gem.style.left = destino.left+destino.width/2+'px'; gem.style.top = destino.top+destino.height/2+'px';
        gem.style.opacity = '0'; gem.style.transform = 'scale(0.3)';
      }));
      setTimeout(() => gem.remove(), 900);
    }, i * 80);
  }
}

function escolherPersonagemDoDia() {
  const hoje = new Date();
  return (hoje.getFullYear()*10000 + (hoje.getMonth()+1)*100 + hoje.getDate()) % PERSONAGENS.length;
}

function iniciarTimer() {
  function atualizar() {
    const agora=new Date(), meia=new Date(); meia.setHours(24,0,0,0);
    const diff=meia-agora, h=Math.floor(diff/3600000), m=Math.floor((diff%3600000)/60000), s=Math.floor((diff%60000)/1000);
    const el=document.getElementById('timer');
    if(el) el.textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }
  atualizar(); setInterval(atualizar,1000);
}

function atualizarUI() {
  const elPontos=document.getElementById('pontos'), elDiamantes=document.getElementById('diamantes'), elTentativas=document.getElementById('tentativas');
  if(elPontos) elPontos.textContent=Math.max(0,estado.pontos);
  if(elDiamantes) elDiamantes.textContent=estado.diamantesPendentes;
  if(elTentativas) elTentativas.textContent=estado.tentativas;
}

const inputEl=document.getElementById('searchInput'), suggestionsEl=document.getElementById('searchSuggestions');
inputEl.addEventListener('input', function() {
  const query=this.value.trim().toLowerCase(); suggestionsEl.innerHTML='';
  if(!query){suggestionsEl.classList.remove('open');return;}
  const res=PERSONAGENS.filter(p=>p.nome.toLowerCase().includes(query)&&!estado.palpitesDados.includes(p.nome)).slice(0,6);
  if(!res.length){suggestionsEl.classList.remove('open');return;}
  res.forEach(p=>{
    const item=document.createElement('div'); item.classList.add('suggestion-item');
    item.innerHTML=`<div style="width:36px;height:36px;border-radius:5px;background:rgba(255,255,255,0.08);flex-shrink:0;"></div><div class="suggestion-name">${p.nome}</div>`;
    item.addEventListener('click',()=>{inputEl.value=p.nome;suggestionsEl.classList.remove('open');submeterPalpite();});
    suggestionsEl.appendChild(item);
  });
  suggestionsEl.classList.add('open');
});
document.addEventListener('click',e=>{if(!e.target.closest('.game-search-wrap'))suggestionsEl.classList.remove('open');});
inputEl.addEventListener('keydown',e=>{if(e.key==='Enter')submeterPalpite();});

async function submeterPalpite() {
  if(estado.jogoTerminado) return;
  const nome=inputEl.value.trim(); if(!nome) return;
  const personagem=PERSONAGENS.find(p=>p.nome.toLowerCase()===nome.toLowerCase());
  if(!personagem){inputEl.style.borderColor='#f87171';setTimeout(()=>inputEl.style.borderColor='',800);return;}
  if(estado.palpitesDados.includes(personagem.nome)){inputEl.value='';return;}
  estado.palpitesDados.push(personagem.nome); estado.tentativas++;
  const secreto=PERSONAGENS[estado.personagemSecretoIdx], correto=personagem.nome===secreto.nome;
  if(!correto) estado.pontos=Math.max(0,estado.pontos-CUSTO_TENTATIVA);
  renderizarLinha(personagem,secreto,correto,true); atualizarUI(); atualizarDicas();
  inputEl.value=''; suggestionsEl.classList.remove('open');
  if(correto) await terminarJogo(true);
  else if(estado.tentativas>=MAX_TENTATIVAS) await terminarJogo(false);
  else await guardarProgresso();
}

function renderizarLinha(p,secreto,correto,animar=true) {
  const row=document.createElement('div'); row.classList.add('guess-row');
  if(!animar) row.style.animation='none';
  row.appendChild(criarCelula('img','',null));
  row.appendChild(criarCelula('text',p.nome,correto?'correct':'wrong'));
  row.appendChild(criarCelula('text',p.genero,p.genero===secreto.genero?'correct':'wrong'));
  row.appendChild(criarCelula('text',p.raca,p.raca===secreto.raca?'correct':'wrong'));
  row.appendChild(criarCelula('text',p.afiliacao,p.afiliacao===secreto.afiliacao?'correct':'wrong'));
  const dA=p.altura-secreto.altura, aC=dA===0?'correct':Math.abs(dA)<=10?'close':'wrong';
  const aE=dA===0?'':dA>0?'<span class="arrow-down">▼</span>':'<span class="arrow-up">▲</span>';
  row.appendChild(criarCelula('text',p.altura+' cm '+aE,aC,true));
  const dR=p.primeiroArco-secreto.primeiroArco, rC=dR===0?'correct':Math.abs(dR)===1?'close':'wrong';
  const rE=dR===0?'':dR>0?'<span class="arrow-down">▼ mais cedo</span>':'<span class="arrow-up">▲ mais tarde</span>';
  row.appendChild(criarCelula('text',(ARCOS[p.primeiroArco]||'Arco '+p.primeiroArco)+' '+rE,rC,true));
  const eC=p.estado===secreto.estado; row.appendChild(criarCelula('text',p.estado,eC?'correct':'wrong'));
  if(animar) verificarDiamantes(p.genero===secreto.genero,p.raca===secreto.raca,p.afiliacao===secreto.afiliacao,dA===0,dR===0,eC,correto);
  document.getElementById('guessesRows').prepend(row);
}

function criarCelula(tipo,conteudo,classe,html=false) {
  const cell=document.createElement('div'); cell.classList.add('guess-cell');
  if(classe) cell.classList.add(classe);
  if(tipo==='img') cell.innerHTML=`<div style="width:40px;height:40px;border-radius:5px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:0.55rem;color:rgba(255,255,255,0.25);">img</div>`;
  else if(html) cell.innerHTML=conteudo;
  else cell.textContent=conteudo;
  return cell;
}

function verificarDiamantes(genero,raca,afil,altura,arco,estadoC,acertou) {
  let ganhou=0;
  if(!estado.primeiroAmarelo&&(genero||raca||afil||estadoC||altura||arco)){estado.primeiroAmarelo=true;ganhou+=10;}
  if(acertou&&!estado.primeiroVerde){estado.primeiroVerde=true;ganhou+=25+Math.max(0,25-estado.tentativas*2);}
  if(ganhou>0) estado.diamantesPendentes+=ganhou;
}

function atualizarDicas() {
  const ok=estado.tentativas>=TENTATIVAS_DICAS;
  for(let i=1;i<=3;i++){
    const btn=document.getElementById('hint'+i); if(!btn) continue;
    btn.classList.remove('locked','unlocked','used');
    if(estado.dicasUsadas>=i) btn.classList.add('used');
    else if(ok) btn.classList.add('unlocked');
    else btn.classList.add('locked');
  }
  const el=document.getElementById('dicasRestantes');
  if(el) el.textContent=Math.max(0,DICAS_GRATIS-estado.dicasUsadas)+' gratuitas restantes';
}

async function usarDica(num) {
  if(estado.jogoTerminado) return;
  if(estado.tentativas<TENTATIVAS_DICAS){document.getElementById('hintResult').textContent='⚠ Só podes usar dicas a partir da 10.ª tentativa!';return;}
  if(estado.dicasUsadas>=num) return;
  const secreto=PERSONAGENS[estado.personagemSecretoIdx];
  const dicas=['💡 O personagem é do género: '+secreto.genero,'💡 A raça do personagem é: '+secreto.raca,'💡 A afiliação é: '+secreto.afiliacao];
  if(estado.dicasUsadas>=DICAS_GRATIS){if(estado.pontos<CUSTO_DICA){document.getElementById('hintResult').textContent='⚠ Pontos insuficientes!';return;}estado.pontos=Math.max(0,estado.pontos-CUSTO_DICA);}
  estado.dicasUsadas++; document.getElementById('hintResult').textContent=dicas[num-1];
  atualizarUI(); atualizarDicas(); await guardarProgresso();
}

function mostrarResultado(ganhou,mostrarClaim=true) {
  const secreto=PERSONAGENS[estado.personagemSecretoIdx], resultEl=document.getElementById('gameResult');
  if(!resultEl) return;
  document.getElementById('resultIcon').textContent=ganhou?'🎉':'😔';
  document.getElementById('resultTitle').textContent=ganhou?'Acertaste!':'Não foi desta...';
  document.getElementById('resultText').textContent=ganhou?`Encontraste em ${estado.tentativas} tentativa(s) com ${Math.max(0,estado.pontos)} pontos!`:`O personagem era: ${secreto.nome}`;
  document.getElementById('resultDiamonds').textContent=estado.diamantesPendentes>0?`💎 +${estado.diamantesPendentes} diamantes para receber!`:'';
  resultEl.style.display='block'; resultEl.scrollIntoView({behavior:'smooth',block:'center'});
  document.getElementById('searchInput').disabled=true;
  document.querySelector('.btn-submit-guess')?.setAttribute('disabled','');
  if(mostrarClaim&&estado.diamantesPendentes>0&&!estado.claimFeito) mostrarBotaoClaim(estado.diamantesPendentes);
}

async function terminarJogo(ganhou) { estado.jogoTerminado=true; mostrarResultado(ganhou,true); await guardarProgresso(); }

async function iniciarJogo() {
  estado.personagemSecretoIdx=escolherPersonagemDoDia();
  console.log('Personagem do dia:',PERSONAGENS[estado.personagemSecretoIdx].nome);
  iniciarTimer(); await carregarProgresso(); atualizarUI(); atualizarDicas();
}

iniciarJogo();