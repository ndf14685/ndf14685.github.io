// main.js — Inicializacion, scroll, sticky nav, preloader, progress bars
(function () {
  'use strict';

  // --- Preloader ---
  window.addEventListener('load', function () {
    const preloader = document.getElementById('tt-preloader');
    if (preloader) {
      setTimeout(function () {
        preloader.style.opacity = '0';
        preloader.style.transition = 'opacity 0.4s';
        setTimeout(function () { preloader.style.display = 'none'; }, 400);
      }, 200);
    }
  });

  document.addEventListener('DOMContentLoaded', function () {

    // --- Scroll suave para links de ancla ---
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const target = this.getAttribute('href');
        if (target && target.length > 1) {
          const el = document.querySelector(target);
          if (el) {
            e.preventDefault();
            const navH = document.querySelector('.site-nav') ? document.querySelector('.site-nav').offsetHeight : 0;
            const top = el.getBoundingClientRect().top + window.scrollY - navH;
            window.scrollTo({ top: top, behavior: 'smooth' });
          }
        }
      });
    });

    // --- Nav activo segun seccion visible ---
    const sections = document.querySelectorAll('section[id], [data-nav-section][id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveNav() {
      const scrollY = window.scrollY + 80;
      sections.forEach(function (section) {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
          navLinks.forEach(function (a) {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + section.id) {
              a.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // --- Scroll-up button ---
    const scrollUpBtn = document.querySelector('.scroll-up');
    if (scrollUpBtn) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
          scrollUpBtn.classList.add('visible');
        } else {
          scrollUpBtn.classList.remove('visible');
        }
      }, { passive: true });
    }

    // --- Nav mobile toggle ---
    const toggler = document.getElementById('nav-toggler');
    const navLinks2 = document.querySelector('.nav-links');
    if (toggler && navLinks2) {
      toggler.addEventListener('click', function () {
        navLinks2.classList.toggle('open');
      });
      // Cerrar al hacer click en un link
      navLinks2.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          navLinks2.classList.remove('open');
        });
      });
    }

    // --- Skill bars: animar al entrar en viewport ---
    const skillFills = document.querySelectorAll('.skill-fill[data-width]');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.getAttribute('data-width') + '%';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      skillFills.forEach(function (el) { observer.observe(el); });
    } else {
      // Fallback: aplicar inmediatamente
      skillFills.forEach(function (el) {
        el.style.width = el.getAttribute('data-width') + '%';
      });
    }

    // --- Fade-in on scroll (reemplaza WOW.js) ---
    const fadeEls = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window && fadeEls.length > 0) {
      const fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      fadeEls.forEach(function (el) { fadeObserver.observe(el); });
    } else {
      // Fallback: hacer visibles inmediatamente
      fadeEls.forEach(function (el) { el.classList.add('visible'); });
    }

    // --- Obfuscacion de contacto ---
    (function () {
      var user = 'david.fleitas';
      var domain = 'gmail.com';
      var email = user + '@' + domain;
      var mailto = 'mailto:' + email;

      ['email-icon', 'email-btn'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.setAttribute('href', mailto);
      });

      var inlineEl = document.getElementById('email-inline');
      if (inlineEl) inlineEl.innerHTML = '<a href="' + mailto + '">' + email + '</a>';

      // WhatsApp
      var cc = '54', area = '11', num = '30748591';
      var full = cc + area + num;
      var msg = encodeURIComponent('Hola Néstor, te contacto desde tu portfolio.');
      var wa = 'https://wa.me/' + full + '?text=' + msg;
      var waBtn = document.getElementById('whatsapp-link');
      if (waBtn) waBtn.setAttribute('href', wa);
    })();

  });

})();
