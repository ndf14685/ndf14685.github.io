(function () {
  var navToggler = document.getElementById('nav-toggler');
  var navLinks = document.querySelector('.nav-links');

  if (navToggler && navLinks) {
    navToggler.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      navToggler.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        navToggler.classList.remove('active');
      });
    });
  }

  var message = 'Hola Nestor, quiero solicitar un diagnostico gratuito para automatizar tareas y ordenar procesos en mi negocio.';
  var whatsappUrl = 'https://wa.me/5492804006094?text=' + encodeURIComponent(message);

  document.querySelectorAll('[data-whatsapp-cta]').forEach(function (link) {
    link.setAttribute('href', whatsappUrl);
  });
})();