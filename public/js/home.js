// Scripts da homepage (index.html)
window.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('mainNav');

  // Navbar encolhe ao rolar a página
  const encolherNav = () => nav.classList.toggle('navbar-shrink', window.scrollY > 0);
  encolherNav();
  document.addEventListener('scroll', encolherNav);

  // Destaque do item de menu conforme a seção visível
  new bootstrap.ScrollSpy(document.body, { target: '#mainNav', rootMargin: '0px 0px -40%' });

  // Fecha o menu mobile ao clicar em um link
  const toggler = document.querySelector('.navbar-toggler');
  document.querySelectorAll('#navbarResponsive .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (getComputedStyle(toggler).display !== 'none') toggler.click();
    });
  });

  // Galeria do portfólio
  new SimpleLightbox({ elements: '#portfolio a.portfolio-box' });
});
