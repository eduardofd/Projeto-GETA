/*!
* Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });

});



async function getThingspeakData() {
    let response = await fetch(`https://api.thingspeak.com/channels/2448762/feeds.json?api_key=CZ4I7Y43VBKOIC9S&start=2024-02-27&end=2024-02-28`);

    return await response.json();
}

function minhaFuncaoAssincrona() {
    return new Promise(resolve => {
      // Simulando uma operação assíncrona com setTimeout
      setTimeout(() => {
        resolve('Operação assíncrona concluída!');
      }, 2000); // Espera 2 segundos antes de resolver a Promise
    });
  }
getThingspeakData();



var dadosGrafico = dadosSensores['feeds'].slice(-20);
var options = {
    chart: {
      type: 'line',
      foreColor: '#ffffff', // Branco
    },
    series: [{
      name: 'sales',
      data: [30,40,35,50,49,60,70,91,125]
    }],
    xaxis: {
      categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
    }
  }
  
  var chart = new ApexCharts(document.querySelector("#chart"), options);
  
  chart.render();

  //firebase config 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRAJT-6EhEwS3Vw2BXbVXvMYdoRGNRvow",
  authDomain: "geta-site.firebaseapp.com",
  databaseURL: "https://geta-site-default-rtdb.firebaseio.com",
  projectId: "geta-site",
  storageBucket: "geta-site.appspot.com",
  messagingSenderId: "735904865497",
  appId: "1:735904865497:web:1c6ac6422aa25ba5d6f2c8",
  measurementId: "G-LD2D54HDMK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);