// Página de login: animação, validação dos campos e autenticação (Firebase Auth).
document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);

  // ---------- Painel deslizante (login <-> cadastro) ----------
  const container = $('container');
  $('register').addEventListener('click', () => container.classList.add('active'));
  $('login').addEventListener('click', () => container.classList.remove('active'));

  // ---------- Elementos ----------
  const loginForm = $('mainForm');
  const registerForm = $('registerForm');
  const loginBtn = $('login-button');
  const registerBtn = $('register-button');
  const forgotBtn = $('forgotpassword');
  const loginMsg = $('login-message');
  const registerMsg = $('register-message');
  const campo = {
    email: $('email'),
    senha: $('password'),
    nome: $('reg-name'),
    regEmail: $('reg-email'),
    regSenha: $('reg-password'),
  };

  // ---------- Utilidades ----------
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  const dizer = (el, texto = '', ok = false) => {
    el.textContent = texto;
    el.classList.toggle('ok', ok);
  };

  // Pinta o campo de verde/vermelho e mostra o ícone correspondente
  function marcar(input, valido, aviso) {
    const caixa = input.parentElement;
    input.dataset.ph = input.dataset.ph || input.placeholder;
    caixa.className = 'form-control ' + (valido ? 'success' : 'error');
    caixa.querySelector('.icon').className =
      'icon fa-solid ' + (valido ? 'fa-circle-check' : 'fa-circle-xmark');
    input.placeholder = valido ? input.dataset.ph : aviso;
  }

  // Validação enquanto digita
  campo.email.addEventListener('input', () => marcar(campo.email, isEmail(campo.email.value.trim()), 'Insira um email válido'));
  campo.senha.addEventListener('input', () => marcar(campo.senha, campo.senha.value.length > 0, 'Digite sua senha'));
  campo.nome.addEventListener('input', () => marcar(campo.nome, campo.nome.value.trim().length >= 2, 'Informe seu nome'));
  campo.regEmail.addEventListener('input', () => marcar(campo.regEmail, isEmail(campo.regEmail.value.trim()), 'Insira um email válido'));
  campo.regSenha.addEventListener('input', () => marcar(campo.regSenha, campo.regSenha.value.length >= 8, 'Mínimo de 8 caracteres'));

  // Habilita/desabilita os botões conforme o preenchimento
  function atualizarBotoes() {
    loginBtn.disabled = !(campo.email.value && campo.senha.value);
    forgotBtn.disabled = !campo.email.value;
    registerBtn.disabled = !(campo.nome.value && campo.regEmail.value && campo.regSenha.value);
  }
  document.querySelectorAll('input').forEach((input) => {
    ['input', 'change'].forEach((ev) => input.addEventListener(ev, atualizarBotoes));
  });
  atualizarBotoes();

  // ---------- Firebase Auth ----------
  const ERROS = {
    'auth/invalid-email': 'Email inválido.',
    'auth/invalid-credential': 'Email ou senha incorretos.',
    'auth/user-not-found': 'Email ou senha incorretos.',
    'auth/wrong-password': 'Email ou senha incorretos.',
    'auth/email-already-in-use': 'Este email já está cadastrado.',
    'auth/weak-password': 'Senha fraca. Use 8 caracteres ou mais.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
  };
  const traduzir = (err) => ERROS[err.code] || 'Algo deu errado. Tente novamente.';

  // Quem já está logado vai direto para o monitoramento
  let cadastrando = false; // evita redirecionar antes de salvar o nome no cadastro
  auth.onAuthStateChanged((user) => {
    if (user && !cadastrando) location.replace('monitor.html');
  });

  // Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = campo.email.value.trim();
    if (!isEmail(email)) return dizer(loginMsg, 'Insira um email válido.');

    loginBtn.disabled = true;
    dizer(loginMsg);
    try {
      await auth.signInWithEmailAndPassword(email, campo.senha.value);
      // o redirecionamento acontece no onAuthStateChanged
    } catch (err) {
      dizer(loginMsg, traduzir(err));
      atualizarBotoes();
    }
  });

  // Cadastro
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = campo.nome.value.trim();
    const email = campo.regEmail.value.trim();
    const senha = campo.regSenha.value;

    if (nome.length < 2) return dizer(registerMsg, 'Informe seu nome.');
    if (!isEmail(email)) return dizer(registerMsg, 'Insira um email válido.');
    if (senha.length < 8) return dizer(registerMsg, 'A senha deve ter 8 caracteres ou mais.');

    registerBtn.disabled = true;
    dizer(registerMsg);
    cadastrando = true;
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, senha);
      await cred.user.updateProfile({ displayName: nome }).catch(() => {});
      location.replace('monitor.html');
    } catch (err) {
      cadastrando = false;
      dizer(registerMsg, traduzir(err));
      atualizarBotoes();
    }
  });

  // Recuperar senha
  forgotBtn.addEventListener('click', async () => {
    const email = campo.email.value.trim();
    if (!isEmail(email)) return dizer(loginMsg, 'Digite seu email acima para recuperar a senha.');
    try {
      await auth.sendPasswordResetEmail(email);
      dizer(loginMsg, 'Enviamos um link de recuperação para o seu email.', true);
    } catch (err) {
      dizer(loginMsg, err.code === 'auth/user-not-found' ? 'Não encontramos uma conta com este email.' : traduzir(err));
    }
  });
});
