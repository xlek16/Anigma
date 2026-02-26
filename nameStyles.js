// nameStyles.js

const NAME_STYLES = {
  // --- LENDÁRIOS ---
  'sukuna': {
    id: 'sukuna',
    name: 'Rei das Maldições',
    rarity: 'Lendário',
    className: 'text-glitch',
    style: 'color: #e53e3e;',
    dataText: true
  },
  'gojo': {
    id: 'gojo',
    name: 'Vazio Roxo',
    rarity: 'Lendário',
    className: 'text-gojo',
    style: ''
  },
  'hakai': {
    id: 'hakai',
    name: 'Hakai',
    rarity: 'Lendário',
    className: 'text-hakai',
    style: ''
  },
  // --- ÉPICOS ---
  'flame_hashira': {
    id: 'flame_hashira',
    name: 'Pilar das Chamas',
    rarity: 'Épico',
    className: 'text-flame',
    style: ''
  },
  'gear_5': {
    id: 'gear_5',
    name: 'Gear Fifth',
    rarity: 'Épico',
    className: 'text-gear5',
    style: ''
  },
  'ssj': {
    id: 'ssj',
    name: 'Super Saiyan',
    rarity: 'Épico',
    className: 'text-ssj',
    style: ''
  },
  // --- RAROS ---
  'water_breathing': {
    id: 'water_breathing',
    name: 'Respiração da Água',
    rarity: 'Raro',
    style: 'background: linear-gradient(to right, #3b82f6, #60a5fa, #93c5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800;'
  },
  'titan_spark': {
    id: 'titan_spark',
    name: 'Titã Fundador',
    rarity: 'Raro',
    className: 'text-electric',
    style: ''
  },
  'sharingan': {
    id: 'sharingan',
    name: 'Sharingan',
    rarity: 'Raro',
    style: 'color: #ef4444; text-shadow: 0 0 5px #ef4444, 0 0 10px #ef4444, 1px 1px 1px black;'
  },
  // --- COMUNS ---
  'neon_pink': {
    id: 'neon_pink',
    name: 'Neon Rosa',
    rarity: 'Comum',
    style: 'color: #ec4899; text-shadow: 0 0 5px #ec4899, 0 0 10px #ec4899;'
  },
  'gold': {
    id: 'gold',
    name: 'Dourado',
    rarity: 'Comum',
    style: 'background: linear-gradient(45deg, #fde047, #eab308); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800;'
  }
};

const NAME_STYLE_RARITY_CONFIG = {
  comum:    { label: 'Comum',    chance: 60, color: '#9ca3af' },
  raro:     { label: 'Raro',     chance: 28, color: '#3b82f6' },
  epico:    { label: 'Épico',    chance: 10, color: '#a855f7' },
  lendario: { label: 'Lendário', chance: 2,  color: '#f59e0b' }
};

// Adicionar CSS para os estilos animados
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
.text-flame{background:linear-gradient(to bottom,#ff8a00,#e52e71);-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:flame-animation 2s ease-in-out infinite alternate}@keyframes flame-animation{0%{text-shadow:0 0 10px #ffc300,0 0 20px #ff8a00,0 0 30px #e52e71}100%{text-shadow:0 0 5px #ffc300,0 0 15px #ff8a00,0 0 25px #e52e71}}
.text-glitch{position:relative;animation:glitch-animation 2.5s infinite linear alternate-reverse}.text-glitch::before,.text-glitch::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%;background:inherit;overflow:hidden;color:inherit}.text-glitch::before{left:2px;text-shadow:-2px 0 #00fff9;clip:rect(44px,450px,56px,0);animation:glitch-anim-2 3s infinite linear alternate-reverse}.text-glitch::after{left:-2px;text-shadow:-2px 0 #ff00c1,2px 2px #ff00c1;clip:rect(85px,450px,90px,0);animation:glitch-anim-1 2s infinite linear alternate-reverse}@keyframes glitch-anim-1{0%{clip:rect(42px,9999px,44px,0)}100%{clip:rect(5px,9999px,92px,0)}}@keyframes glitch-anim-2{0%{clip:rect(65px,9999px,119px,0)}100%{clip:rect(40px,9999px,130px,0)}}@keyframes glitch-animation{0%{transform:skewX(0)}10%{transform:skewX(5deg)}20%{transform:skewX(-5deg)}30%{transform:skewX(5deg)}40%{transform:skewX(0)}100%{transform:skewX(0)}}
.text-electric{color:#fff;animation:electric-animation 2s linear infinite}@keyframes electric-animation{0%,100%{text-shadow:0 0 5px #fefcbf,0 0 10px #fefcbf}50%{text-shadow:0 0 10px #facc15,0 0 20px #facc15}}
@keyframes gojo-pulse{0%,100%{color:#a78bfa;text-shadow:0 0 7px #a78bfa,0 0 10px #a78bfa,0 0 21px #8b5cf6,0 0 42px #8b5cf6}50%{color:#c4b5fd;text-shadow:0 0 5px #c4b5fd,0 0 8px #c4b5fd,0 0 15px #7c3aed,0 0 30px #7c3aed}}.text-gojo{animation:gojo-pulse 2s infinite ease-in-out}
@keyframes hakai-flicker{0%,100%{color:#da70d6;text-shadow:0 0 7px #da70d6,0 0 10px #da70d6,0 0 21px #da70d6,0 0 42px #9400d3,0 0 82px #9400d3}50%{color:#ffc0cb;text-shadow:0 0 5px #ffc0cb,0 0 8px #ffc0cb,0 0 15px #ffc0cb,0 0 30px #9400d3,0 0 60px #9400d3}}.text-hakai{animation:hakai-flicker 1.5s infinite alternate}
@keyframes ssj-aura{0%,100%{text-shadow:0 0 5px #fef08a,0 0 10px #fef08a,0 0 20px #facc15,0 0 40px #eab308}50%{text-shadow:0 0 10px #fef9c3,0 0 20px #fef9c3,0 0 30px #facc15,0 0 50px #eab308}}.text-ssj{color:#fff;animation:ssj-aura 1.8s ease-in-out infinite}
@keyframes gear5-bounce{0%,20%,50%,80%,100%{transform:translateY(0)}40%{transform:translateY(-10px)}60%{transform:translateY(-5px)}}.text-gear5{color:#fff;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;display:inline-block;animation:gear5-bounce 2s infinite ease-in-out}
`;
document.head.appendChild(styleSheet);

// Para o efeito glitch funcionar, precisamos de adicionar o data-text
function applyGlitchDataText() {
    document.querySelectorAll('[data-text-effect]').forEach(el => {
        if (el.textContent && el.getAttribute('data-text') !== el.textContent) {
          el.setAttribute('data-text', el.textContent);
        }
    });
}
document.addEventListener('DOMContentLoaded', applyGlitchDataText);
const observer = new MutationObserver(applyGlitchDataText);
observer.observe(document.body, { childList: true, subtree: true, characterData: true });

