// Configuração única do Firebase (compartilhada por login.html e monitor.html).
// A apiKey do Firebase é pública por natureza; a segurança vem das regras do Auth/Database.
firebase.initializeApp({
  apiKey: "AIzaSyBpi_VoNLtZKW0cL1WeAm-ESR2dZpo2dWE",
  authDomain: "geta-plataforma.firebaseapp.com",
  databaseURL: "https://sensor-data-e973e-default-rtddb.firebaseio.com",
  projectId: "geta-plataforma",
  storageBucket: "geta-plataforma.firebasestorage.app",
  messagingSenderId: "513008989523",
  appId: "1:513008989523:web:423fc5a8fe60378f675da6",
  measurementId: "G-672LC85VDH"
});

const auth = firebase.auth();
const db = firebase.database ? firebase.database() : null; // só existe na página de monitoramento
