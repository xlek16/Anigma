function sairDaPagina(url) {
  const overlay = document.getElementById('pageTransition');
  if (!overlay) {
    window.location.href = url;
    return;
  }

  overlay.style.animation  = 'none';
  overlay.style.opacity    = '1';
  overlay.style.visibility = 'visible';
  overlay.style.pointerEvents = 'all';

  setTimeout(() => {
    window.location.href = url;
  }, 400);
}

document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('a[href]');

  links.forEach(link => {
    const href = link.getAttribute('href');

    // ignora links externos, ancora (#), javascript: e vazios
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript')) return;

    link.addEventListener('click', function (e) {
      e.preventDefault();
      sairDaPagina(href);
    });
  });
});