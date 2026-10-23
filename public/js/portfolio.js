// Portfólio: galeria filtrável com visualizador nativo (<dialog>), sem bibliotecas.
//
// Para adicionar uma foto, basta incluir uma linha em FOTOS.
// Escreva o nome do arquivo EXATAMENTE como ele está na pasta (maiúsculas e minúsculas
// contam no Firebase). Imagem que não for encontrada é escondida e avisada no Console (F12).
const PASTA = 'assets/portfolio/';

const FOTOS = [
  { src: 'fullsize/7.JPG',      categoria: 'Ortofoto',     titulo: 'DEPAq - UFRPE',          legenda: 'DEPAq - UFRPE' },
  { src: 'fullsize/8.jpg',      categoria: 'Audiovisual',  titulo: 'Privê das Jaqueiras',    legenda: 'Paudalho' },
  { src: 'fullsize/3.jpg',      categoria: 'Sensores',     titulo: 'Agrofloresta - UFRPE',   legenda: 'Agrofloresta' },
  { src: 'thumbnails/12.jpg',   categoria: 'Prototipagem', titulo: 'Produção de Protótipos', legenda: 'Protótipo Estação Multisensorial' },
  { src: 'fullsize/5.jpg',      categoria: 'Cursos',       titulo: 'Pilotagem',              legenda: 'Drones' },
  { src: 'fullsize/6.jpg',      categoria: 'Cursos',       titulo: 'Desenvolvimento',        legenda: 'Desenvolvimento Web' },
];

(() => {
  const grid = document.getElementById('portfolioGrid');
  const filtros = document.getElementById('portfolioFiltros');
  const box = document.getElementById('portfolioLightbox');
  const boxImg = box.querySelector('img');
  const boxLegenda = box.querySelector('figcaption');

  let filtroAtivo = 'Todos';
  let visiveis = [];
  let atual = 0;

  // ---------- Cartões ----------
  FOTOS.forEach((foto) => {
    const legenda = foto.legenda || foto.titulo;

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'pf-item';
    card.dataset.categoria = foto.categoria;
    card.dataset.src = PASTA + foto.src;
    card.dataset.legenda = legenda;

    const img = new Image();
    img.alt = legenda;
    img.loading = 'lazy';
    img.addEventListener('error', () => {
      console.warn('Portfólio: imagem não encontrada ->', img.src);
      card.remove();
      montarFiltros();
    });
    img.src = PASTA + foto.src;

    const texto = document.createElement('span');
    const categoria = document.createElement('small');
    const titulo = document.createElement('strong');
    categoria.textContent = foto.categoria;
    titulo.textContent = foto.titulo;
    texto.append(categoria, titulo);

    card.append(img, texto);
    card.addEventListener('click', () => abrir(card));
    grid.append(card);
  });

  // ---------- Filtros ----------
  function montarFiltros() {
    const categorias = ['Todos', ...new Set([...grid.children].map((c) => c.dataset.categoria))];
    if (!categorias.includes(filtroAtivo)) filtroAtivo = 'Todos';

    filtros.replaceChildren(...categorias.map((nome) => {
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.textContent = nome;
      botao.addEventListener('click', () => {
        filtroAtivo = nome;
        aplicarFiltro();
      });
      return botao;
    }));
    aplicarFiltro();
  }

  function aplicarFiltro() {
    [...grid.children].forEach((c) => {
      c.hidden = filtroAtivo !== 'Todos' && c.dataset.categoria !== filtroAtivo;
    });
    [...filtros.children].forEach((b) => b.classList.toggle('ativo', b.textContent === filtroAtivo));
  }

  // ---------- Visualizador ----------
  function abrir(card) {
    visiveis = [...grid.children].filter((c) => !c.hidden);
    atual = visiveis.indexOf(card);
    mostrar();
    box.showModal();
  }

  function mostrar() {
    const card = visiveis[atual];
    boxImg.src = card.dataset.src;
    boxImg.alt = card.dataset.legenda;
    boxLegenda.textContent = card.dataset.legenda;
  }

  function mover(passo) {
    atual = (atual + passo + visiveis.length) % visiveis.length;
    mostrar();
  }

  box.querySelector('.pf-fechar').addEventListener('click', () => box.close());
  box.querySelector('.pf-prev').addEventListener('click', () => mover(-1));
  box.querySelector('.pf-next').addEventListener('click', () => mover(1));
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); }); // clique no fundo
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'ArrowRight') mover(1);
  });

  montarFiltros();
})();
