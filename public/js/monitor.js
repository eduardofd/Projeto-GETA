// Página de monitoramento: proteção por login, leitura em tempo real e gauges.
const $ = (id) => document.getElementById(id);

// chave = campo no Realtime Database | texto = id do <span> | canvas = id do gráfico
// cores = [faixa baixa (<40), faixa média (<75), faixa alta]
const SENSORES = [
  { chave: 't',  texto: 'temp', canvas: 'tempGaugeChart', titulo: 'Temperatura',     unidade: '°C',  cores: ['#00add6', '#059e8a', '#e3242b'] },
  { chave: 'h',  texto: 'hum',  canvas: 'humGaugeChart',  titulo: 'Umidade do Ar',   unidade: '%',   cores: ['#e3242b', '#059e8a', '#00add6'] },
  { chave: 's',  texto: 'soil', canvas: 'soilGaugeChart', titulo: 'Umidade do Solo', unidade: '%',   cores: ['#e3242b', '#e1e437', '#28a745'] },
  { chave: 'uv', texto: 'uv',   canvas: 'uvGaugeChart',   titulo: 'Radiação UV',     unidade: ' uv', cores: ['#059e8a', '#e1e437', '#e3242b'] },
];

const graficos = {};
let leitura = null; // referência da escuta no banco, para poder desligar

function criarGauge({ canvas, titulo, unidade, cores }) {
  const faixa = (v) => (v < 40 ? 0 : v < 75 ? 1 : 2);

  graficos[canvas] = new Chart($(canvas), {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [0, 100],
        borderWidth: 0,
        backgroundColor: (ctx) => {
          if (ctx.type !== 'data') return 'transparent';
          return ctx.index === 1 ? 'rgb(234, 234, 234)' : cores[faixa(ctx.raw)];
        },
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      circumference: 180,
      rotation: -90,
      cutout: '75%',
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    },
    plugins: [{
      id: 'textoCentral',
      beforeDraw(chart) {
        const { ctx, width, height } = chart;
        const valor = chart.data.datasets[0].data[0];
        const tamanho = height / 120;
        const x = width / 2;
        const y = height - 20;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = `bold ${tamanho.toFixed(2)}em sans-serif`;
        ctx.fillStyle = cores[faixa(valor)];
        ctx.fillText(valor.toFixed(2) + unidade, x, y);

        ctx.font = `${(tamanho / 3).toFixed(2)}em sans-serif`;
        ctx.fillStyle = 'grey';
        ctx.fillText(titulo, x, y - 32);
        ctx.restore();
      },
    }],
  });
}

// Recebe os dados do banco e atualiza números e gauges
function atualizar(snap) {
  const dados = snap.val();
  if (!dados) return;

  SENSORES.forEach(({ chave, texto, canvas }) => {
    if (dados[chave] == null) return;
    const valor = Number(dados[chave]);
    $(texto).textContent = valor.toFixed(2);

    const limitado = Math.min(Math.max(valor || 0, 0), 100);
    const grafico = graficos[canvas];
    grafico.data.datasets[0].data = [limitado, 100 - limitado];
    grafico.update();
  });
}

// Só mostra o painel para quem está logado; os demais voltam ao login
auth.onAuthStateChanged((user) => {
  if (!user) {
    location.replace('login.html');
    return;
  }

  $('user-details').textContent = user.displayName || user.email.split('@')[0];
  $('authentication-bar').hidden = false;
  $('content-sign-in').hidden = false;

  if (!Object.keys(graficos).length) SENSORES.forEach(criarGauge);

  if (leitura) leitura.off();
  leitura = db.ref('UsersData/' + user.uid);
  leitura.on('value', atualizar, (err) => console.error('Erro ao ler o banco de dados:', err));
});

// Sair
$('logout-link').addEventListener('click', (e) => {
  e.preventDefault();
  if (leitura) leitura.off();
  auth.signOut(); // o onAuthStateChanged redireciona para o login
});
