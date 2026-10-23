// Configuração única do Firebase (compartilhada por login.html e monitor.html).
// A apiKey do Firebase é pública por natureza; a segurança vem das regras do Auth/Database.
firebase.initializeApp({
  apiKey: "AIzaSyDRAJT-6EhEwS3Vw2BXbVXvMYdoRGNRvow",
  authDomain: "geta-site.firebaseapp.com",
  databaseURL: "https://geta-site-default-rtdb.firebaseio.com",
  projectId: "geta-site",
  storageBucket: "geta-site.firebasestorage.app",
  messagingSenderId: "735904865497",
  appId: "1:735904865497:web:1c6ac6422aa25ba5d6f2c8",
  measurementId: "G-LD2D54HDMK"
});

const auth = firebase.auth();
const db = firebase.database ? firebase.database() : null; // só existe na página de monitoramento
