window.onload = function () {
  const temaGuardado = localStorage.getItem('tema');

  if (temaGuardado === 'claro') {
    document.body.classList.add('light-mode');
    document.getElementById('themeToggle').textContent = '🌙 Modo Escuro';
    document.getElementById('logoImg').src = 'images/logo-preta.png';
  }
};

function toggleTheme() {
  const body = document.body;
  const botao = document.getElementById('themeToggle');
  const logo = document.getElementById('logoImg');

  if (body.classList.contains('light-mode')) {
    // Volta ao modo escuro
    body.classList.remove('light-mode');
    botao.textContent = '☀ Modo Claro';
    logo.src = 'Imagens/LogoSite/LogoSite.png';
    localStorage.setItem('tema', 'escuro');

  } else {
    // Muda para modo claro
    body.classList.add('light-mode');
    botao.textContent = '🌙 Modo Escuro';
    logo.src = 'Imagens/LogoSite/LogoPreta.png';
    localStorage.setItem('tema', 'claro');
  }
}