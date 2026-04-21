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
      'about-who-text':   'Especialista en DevOps y DevSecOps con base en desarrollo Java y evolución hacia Cloud y seguridad. Experiencia en automatización de infraestructura (AWS, GCP, Azure), CI/CD seguro y gestión de contenedores (Docker, Kubernetes, OpenShift). En los últimos años integré IA generativa (ChatGPT, GitHub Copilot) en flujos de trabajo diarios y participé en la adopción corporativa segura de LLMs en entornos de desarrollo.',
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
      'about-who-text':   'DevOps and DevSecOps specialist with a background in Java development, evolved into Cloud and security. Experience in infrastructure automation (AWS, GCP, Azure), secure CI/CD pipelines, and container management (Docker, Kubernetes, OpenShift). Over the last two years I integrated generative AI tools (ChatGPT, GitHub Copilot) into daily workflows and led the secure corporate adoption of LLMs across development teams.',
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
