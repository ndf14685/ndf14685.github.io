// lang.js — i18n ES/EN
(function () {
  'use strict';

  const translations = {
    es: {
      'nav-home':         'home',
      'nav-about':        'about',
      'nav-skills':       'skills',
      'nav-resume':       'resume',
      'nav-blog':         'blog',
      'hero-available':   'disponible',
      'about-title':      'Sobre Mí',
      'about-who-title':  '// quién soy',
      'about-who-text':   'Especialista en DevOps y DevSecOps con amplia experiencia en automatización de infraestructura cloud (AWS, GCP), seguridad en el ciclo de vida del software (CI/CD) y gestión de contenedores (Docker, Kubernetes). Apasionado por implementar soluciones seguras y escalables.',
      'about-skills-title': '// aptitudes',
      'about-tools-title':  '// herramientas',
      'btn-email':        'Enviarme un mail',
      'btn-cv-es':        'Descargar CV',
      'btn-cv-en':        'Download Resume',
      'btn-whatsapp':     'WhatsApp',
      'skills-title':     'Skills',
      'certif-title':     'Certificaciones',
      'projects-title':   'Proyectos Destacados',
      'resume-title':     'Resume',
      'resume-exp':       '// historia laboral',
      'resume-edu':       '// formación académica',
      'blog-title':       'News',
    },
    en: {
      'nav-home':         'home',
      'nav-about':        'about',
      'nav-skills':       'skills',
      'nav-resume':       'resume',
      'nav-blog':         'blog',
      'hero-available':   'available',
      'about-title':      'About Me',
      'about-who-title':  '// who am i',
      'about-who-text':   'DevOps and DevSecOps specialist with extensive experience in cloud infrastructure automation (AWS, GCP), software lifecycle security (CI/CD), and container management (Docker, Kubernetes). Passionate about implementing secure and scalable solutions.',
      'about-skills-title': '// skills',
      'about-tools-title':  '// tools',
      'btn-email':        'Send me an email',
      'btn-cv-es':        'Download CV (ES)',
      'btn-cv-en':        'Download Resume',
      'btn-whatsapp':     'WhatsApp',
      'skills-title':     'Skills',
      'certif-title':     'Certifications',
      'projects-title':   'Featured Projects',
      'resume-title':     'Resume',
      'resume-exp':       '// work history',
      'resume-edu':       '// education',
      'blog-title':       'News',
    }
  };

  let currentLang = 'es';

  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    document.querySelectorAll('[data-lang]').forEach(function (el) {
      const key = el.getAttribute('data-lang');
      if (translations[lang][key] !== undefined) {
        el.textContent = translations[lang][key];
      }
    });
    try { localStorage.setItem('nf-lang', lang); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    const btnEs = document.getElementById('flag-es');
    const btnEn = document.getElementById('flag-en');
    if (btnEs) btnEs.addEventListener('click', function () { setLanguage('es'); });
    if (btnEn) btnEn.addEventListener('click', function () { setLanguage('en'); });

    // Restaurar idioma guardado
    let saved = null;
    try { saved = localStorage.getItem('nf-lang'); } catch (e) {}
    if (saved === 'en') setLanguage('en');
  });
})();
