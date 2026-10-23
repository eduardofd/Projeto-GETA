// Botões "Voltar": volta à página anterior do site; se não houver, vai para o início.
document.querySelectorAll('[data-voltar]').forEach((botao) => {
  botao.addEventListener('click', (e) => {
    e.preventDefault();
    const veioDoSite = document.referrer.startsWith(location.origin);
    if (history.length > 1 && veioDoSite) history.back();
    else location.href = 'index.html';
  });
});
