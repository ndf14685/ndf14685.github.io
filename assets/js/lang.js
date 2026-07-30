// lang.js — i18n ES/EN (cobertura completa de la home)
(function () {
  'use strict';

  const meta = {
    es: {
      title: 'Néstor Fleitas — AI Systems Architect & DevSecOps Engineer',
      description: 'AI Systems Architect y DevSecOps Engineer. Diseño plataformas seguras donde infraestructura cloud, pipelines DevSecOps y agentes de IA autónomos operan bajo identidad, autorización, políticas y auditoría. Creador de NexusOS. Argentina · Remote.'
    },
    en: {
      title: 'Néstor Fleitas — AI Systems Architect & DevSecOps Engineer',
      description: 'AI Systems Architect and DevSecOps Engineer. I design secure platforms where cloud infrastructure, DevSecOps pipelines and autonomous AI agents operate under identity, authorization, policy and audit controls. Creator of NexusOS. Argentina · Remote.'
    }
  };

  const translations = {
    es: {
      // Nav
      'nav-home':      'home',
      'nav-about':     'about',
      'nav-expertise': 'expertise',
      'nav-projects':  'proyectos',
      'nav-resume':    'resume',
      'nav-services':  'servicios',
      'nav-contact':   'contacto',

      // Hero
      'hero-value':       'Diseño plataformas seguras donde la infraestructura cloud, los pipelines DevSecOps y los agentes de IA autónomos operan bajo controles de identidad, autorización, políticas y auditoría.',
      'hero-available':   'disponible',
      'hero-cta-contact': 'Contactarme',
      'hero-cta-nexusos': 'Ver NexusOS',
      'btn-cv-es':        'CV en español',
      'btn-cv-en':        'Resume in English',

      // About
      'about-title':      'Sobre Mí',
      'meta-name':        'Nombre',
      'meta-location':    'Ubicación',
      'meta-work':        'Modalidad',
      'meta-work-val':    'Remote / Híbrido',
      'btn-whatsapp':     'WhatsApp',
      'btn-email':        'Enviarme un mail',
      'about-path-title': '// trayectoria',
      'about-p1':         'Más de 15 años en ingeniería de software. Empecé como desarrollador backend Java e integración SOA en banca y telecomunicaciones (Banco Credicoop, HSBC, Telefónica, Telecom): sistemas distribuidos, buses de servicios y arquitectura de integración fueron mi base técnica.',
      'about-p2':         'Esa base evolucionó hacia cloud y operaciones: SRE en Equifax, CI/CD mobile en Flux IT, arquitectura de plataformas en Ingenia, data & cloud engineering en Clarín, y DevSecOps en Allianz, donde participé desde el área de seguridad en la adopción corporativa de IA generativa: prácticas de desarrollo seguro, controles de acceso y riesgos de LLMs. Hoy administro plataformas DevOps en banca (Banco Pichincha, Banco Itaú) con AWS, Azure, OpenShift, Terraform y GitLab CI.',
      'about-p3':         'Ese recorrido converge en NexusOS: una plataforma de gobernanza para sistemas de IA autónomos. No me dedico solo a crear agentes, sino a construir la capa de identidad, autorización, políticas, riesgo y auditoría que les permite operar de forma segura en entornos reales. La idea central: la IA propone, la gobernanza decide.',

      // Expertise
      'exp-title':  'Áreas de Especialización',
      'exp-intro':  'Tres dominios conectados: la experiencia en plataformas y seguridad es la base que hace posible diseñar sistemas de IA autónomos gobernados y utilizables en producción.',
      'exp-a-desc': 'Arquitectura de sistemas agénticos y la capa de control que los hace confiables.',
      'exp-b-desc': 'Infraestructura y automatización aplicadas en banca, seguros, telcos y medios.',
      'exp-c-desc': 'Seguridad en el ciclo de vida del software, sobre una base de backend y arquitectura.',

      // NexusOS
      'nx-problem-title':  'El problema',
      'nx-problem-text':   'Los agentes de IA ya pueden leer bases de datos, escribir en repositorios y modificar infraestructura, pero la mayoría de los frameworks ejecutan primero y auditan después: sin trail de auditoría, sin flujo de aprobación, sin clasificación de riesgo y sin un modelo de identidad que responda quién autorizó qué.',
      'nx-solution-title': 'La propuesta',
      'nx-solution-text':  'NexusOS es una capa de gobernanza y autorización para agentes de IA. Cada capability pasa por un pipeline de gates obligatorios antes de ejecutar: sin atajos, sin bypass y con evidencia firmada de cada decisión. Es neutral al proveedor: la gobernanza no se reescribe al cambiar de modelo.',
      'nx-pipeline-title': '// governance pipeline',
      'nx-pipeline-note':  'Si un gate falla, la ejecución se deniega, el motivo se registra y el audit se escribe igual. Si el audit no puede escribirse, la ejecución también se deniega.',
      'nx-done-title':     '✓ Implementado',
      'nx-done-1':         'Verificación de identidad neutral al proveedor (Local, Keycloak, Azure Entra, LDAP)',
      'nx-done-2':         'Evaluación de políticas con evidencia firmada (HMAC-SHA256)',
      'nx-done-3':         'Clasificación de riesgo: read-only / escritura reversible / escritura irreversible',
      'nx-done-4':         'Permisos por operador con alcance por capability',
      'nx-done-5':         'Audit chain append-only con encadenamiento prevHash',
      'nx-done-6':         '102 capabilities gobernadas · 10 gates · 1.300+ casos de test',
      'nx-wip-title':      '⚡ En desarrollo',
      'nx-wip-1':          'Habilitación incremental de ejecución, empezando por acciones reversibles de bajo riesgo',
      'nx-wip-2':          'Firma con clave pública para la evidencia de auditoría (hoy HMAC simétrico)',
      'nx-uses-title':     'Escenarios de uso',
      'nx-uses-1':         'Consultas de infraestructura de solo lectura, con identidad de operador y scope por namespace',
      'nx-uses-2':         'Pull requests generados por IA con aprobación humana firmada antes del merge',
      'nx-uses-3':         'Automatización de tickets y operaciones de seguridad con acciones críticas bloqueadas hasta aprobación',
      'nx-cta-product':    'Producto y demo interactiva ↗',

      // Projects
      'projects-title': 'Proyectos y Casos',
      'prj-1-title':    'Integraciones gobernadas — Nexus Desktop & Senses',
      'prj-1-text':     'Integraciones de agentes con Desktop, voz, Telegram, HTTP, Linux, Windows, Docker, Kubernetes, Git y logs, ejecutando bajo el pipeline de gobernanza de NexusOS con routing multi-proveedor de LLMs.',
      'prj-2-title':    'Adopción segura de IA generativa',
      'prj-2-text':     'En Allianz Argentina, desde el área de seguridad: evaluación de prácticas de desarrollo seguro, controles de acceso y riesgos de LLMs en la implementación corporativa de IA generativa; seguridad en CI/CD con Jenkins, SonarQube y GitHub Advanced Security.',
      'prj-3-title':    'Plataformas DevOps en banca',
      'prj-3-text':     'Infraestructura como código en Azure con Terraform y contenedores en OpenShift 4 (Banco Pichincha); administración de plataformas y pipelines GitLab CI sobre AWS (Banco Itaú). Evaluación de frameworks CNCF en el chapter DevOps.',
      'prj-4-title':    'Data & Cloud en medios',
      'prj-4-text':     'En Clarín (AGEA): integración de GCP con Elastic Cloud (Pub/Sub, Dataflow, Airflow), desarrollo de conector Java, clusters EKS con CDK y microservicios Node.js.',

      // Resume
      'resume-title':     'Experiencia',
      'resume-exp':       '// historia laboral',
      'resume-edu':       '// formación y certificaciones',
      'date-present':     'Actualidad',
      'res-nexus-role':   'Founder & CTO · AI Systems Architect',
      'res-nexus-desc':   'Diseño y desarrollo de NexusOS, plataforma de gobernanza y autorización para agentes de IA: pipeline de 10 gates (identidad, políticas, permisos, riesgo, enforcement, auditoría), audit chain firmado con HMAC e integraciones gobernadas para infraestructura, código y operaciones.',
      'res-itau-role':    'DevOps — Contractor',
      'res-itau-desc':    'Administración de infraestructura y plataformas DevOps/DevSecOps. Automatización de pipelines CI/CD y despliegues, infraestructura como código y colaboración con equipos técnicos en incidentes y mejoras. Stack: AWS, GitLab CI.',
      'res-pich-role':    'DevOps — Freelance',
      'res-pich-desc':    'Infraestructura en Azure con Terraform y gestión de contenedores en OpenShift 4. Evaluación de frameworks CNCF en el chapter DevOps y optimización de procesos CI/CD en entornos bancarios.',
      'res-allianz-desc': 'Participación desde el área de seguridad en la implementación corporativa de IA generativa: evaluación de prácticas de desarrollo seguro, controles de acceso y riesgos de LLMs. Seguridad en CI/CD con Jenkins, SonarQube y GHAS. Infraestructura AWS EKS con Terraform. Capacitación en seguridad para equipos internos y externos.',
      'res-arkho-desc':   'Infraestructura AWS con CloudFront, S3 y RDS. Backend con microservicios Node.js en cluster EKS. CDK, CodeBuild, CodePipeline, CodeCommit y Docker.',
      'res-clarin-desc':  'Integración de GCP con Elastic Cloud: Pub/Sub, Dataflow, Airflow. Docker y Kubernetes. Desarrollo de conector Java, AWS EKS con CDK (VPC, ELB) y microservicios Node.js.',
      'res-ingenia-desc': 'Geopagos: diseño de arquitectura e infraestructura AWS con Kubernetes, Terraform, Airflow y GitLab. Mercantil Andina: diseño de nueva plataforma en Azure con AKS, Terraform, Azure DevOps y Bitbucket.',
      'res-flux-desc':    'CI/CD para apps Android e iOS con Docker, Jenkins y Azure DevOps sobre GCP, AWS y Azure. Integración con SonarQube y Browserstack.',
      'res-equifax-desc': 'Site Reliability Engineering: Docker, Ansible, Apache, Tomcat, Nagios, Linux Red Hat, Nginx, Jenkins, Terraform y Kubernetes en GCP.',
      'res-java-title':   'Etapa Java / SOA — banca y telcos',
      'res-java-role':    'Backend & Integration Engineer · Arquitectura',
      'res-java-desc':    'Fundamento de backend y arquitectura de integración: Telecom (SOA con OSB 12c, DataPower, Jenkins; referente técnico y configuration manager 2018–2020, y hasta fines de 2022 soporte de despliegues productivos fuera de horario y fines de semana), HSBC (Java Sr, ESB IBM, 2017–2018), Banco Credicoop (Java en área de Arquitectura; investigación open source: CouchDB, Node.js, ELK, Jenkins, 2014–2017), Telefónica/Movistar (consultor Java SOA/OSB, WebLogic, Spring, 2012–2014).',
      'res-acc-role':     'Desarrollador Cobol',
      'res-acc-desc':     'Programación Cobol en mainframe (JCL, DB2).',
      'edu-utn-title':    'Ingeniería Industrial',
      'edu-tec-title':    'Técnico en Informática',

      // Services
      'svc-title':   'Servicios',
      'svc-intro':   'Trabajo con equipos de plataforma, seguridad y tecnología que necesitan adoptar IA sin perder control, o llevar su práctica DevOps/DevSecOps al siguiente nivel.',
      'svc-1-text':  'Diseño de sistemas agénticos y multi-agente listos para producción: arquitectura, routing de proveedores, observabilidad y límites de ejecución. Para organizaciones que pasaron de los pilotos y necesitan que la IA opere de forma confiable.',
      'svc-2-text':  'Evaluación del estado de gobernanza de agentes y LLMs: identidad, autorización, clasificación de riesgo, aprobaciones y auditoría. Para CISOs y equipos de compliance que necesitan evidencia, no promesas.',
      'svc-3-text':  'Acompañamiento en la adopción de IA generativa y agentes con controles desde el día uno: desarrollo seguro, mitigación de prompt injection y human-in-the-loop para acciones críticas.',
      'svc-4-text':  'Seguridad integrada al ciclo de vida: SAST/DAST/SCA en pipelines, Secure SDLC, hardening de CI/CD. Experiencia aplicada en banca y seguros.',
      'svc-5-text':  'Arquitectura e infraestructura como código en AWS, Azure y GCP: Kubernetes, OpenShift, Terraform y automatización CI/CD para plataformas que escalan.',
      'svc-6-title': 'Architecture Review & Technical Advisory',
      'svc-6-text':  'Revisión de arquitectura y acompañamiento técnico para decisiones de plataforma, seguridad e IA: una mirada senior externa antes de comprometer inversión.',
      'svc-cta':     'Iniciar una conversación',
      'svc-pyme':    'IA y automatización para PyMEs →',

      // News
      'blog-title': 'News',
      'news-intro': 'Feed generado automáticamente por un pipeline propio (GitHub Actions + RSS + scoring) que se actualiza a diario.',

      // Contact
      'ct-title':        'Contacto',
      'ct-jobs-title':   'Oportunidades laborales',
      'ct-jobs-text':    'Roles de AI Systems / Platform / DevSecOps Architecture y posiciones senior de DevOps, SRE o Platform Engineering. Remote desde Argentina.',
      'ct-jobs-cta':     'Hablemos de tu búsqueda',
      'ct-consult-title':'Consultoría y NexusOS',
      'ct-consult-text': 'Adopción segura de IA, gobernanza de agentes, DevSecOps o una presentación de NexusOS para tu equipo técnico.',
      'ct-consult-cta':  'Agendar una conversación',

      // Footer
      'footer-line':  'AI Systems Architect & DevSecOps Engineer  ·  Chubut, Argentina',
      'footer-built': 'Construido con'
    },

    en: {
      // Nav
      'nav-home':      'home',
      'nav-about':     'about',
      'nav-expertise': 'expertise',
      'nav-projects':  'projects',
      'nav-resume':    'resume',
      'nav-services':  'services',
      'nav-contact':   'contact',

      // Hero
      'hero-value':       'I design secure platforms where cloud infrastructure, DevSecOps pipelines and autonomous AI agents operate under identity, authorization, policy and audit controls.',
      'hero-available':   'available',
      'hero-cta-contact': "Let's talk",
      'hero-cta-nexusos': 'See NexusOS',
      'btn-cv-es':        'CV in Spanish',
      'btn-cv-en':        'Resume in English',

      // About
      'about-title':      'About Me',
      'meta-name':        'Name',
      'meta-location':    'Location',
      'meta-work':        'Work mode',
      'meta-work-val':    'Remote / Hybrid',
      'btn-whatsapp':     'WhatsApp',
      'btn-email':        'Send me an email',
      'about-path-title': '// career path',
      'about-p1':         'Over 15 years in software engineering. I started as a Java backend developer working on SOA integration for banking and telecom (Banco Credicoop, HSBC, Telefónica, Telecom): distributed systems, service buses and integration architecture were my technical foundation.',
      'about-p2':         'That foundation evolved into cloud and operations: SRE at Equifax, mobile CI/CD at Flux IT, platform architecture at Ingenia, data & cloud engineering at Clarín, and DevSecOps at Allianz, where I worked from the security team on the corporate adoption of generative AI: secure development practices, access controls and LLM risk. Today I run DevOps platforms in banking (Banco Pichincha, Banco Itaú) with AWS, Azure, OpenShift, Terraform and GitLab CI.',
      'about-p3':         "That path converges in NexusOS: a governance platform for autonomous AI systems. I don't just build agents — I build the identity, authorization, policy, risk and audit layer that lets them operate safely in real environments. The core idea: AI proposes, governance decides.",

      // Expertise
      'exp-title':  'Areas of Expertise',
      'exp-intro':  'Three connected domains: platform and security experience is the foundation that makes it possible to design governed, production-ready autonomous AI systems.',
      'exp-a-desc': 'Architecture of agentic systems and the control layer that makes them trustworthy.',
      'exp-b-desc': 'Infrastructure and automation applied in banking, insurance, telcos and media.',
      'exp-c-desc': 'Security across the software lifecycle, on top of a backend and architecture foundation.',

      // NexusOS
      'nx-problem-title':  'The problem',
      'nx-problem-text':   'AI agents can already read databases, write to repositories and modify infrastructure, but most frameworks execute first and audit later: no audit trail, no approval workflow, no risk classification, and no identity model that answers who authorized what.',
      'nx-solution-title': 'The approach',
      'nx-solution-text':  'NexusOS is a governance and authorization layer for AI agents. Every capability goes through a pipeline of mandatory gates before execution: no shortcuts, no bypasses, and signed evidence for every decision. It is provider-neutral: governance is not rebuilt when you switch models.',
      'nx-pipeline-title': '// governance pipeline',
      'nx-pipeline-note':  'If any gate fails, execution is denied, the reason is logged and the audit record is still written. If the audit cannot be written, execution is denied as well.',
      'nx-done-title':     '✓ Implemented',
      'nx-done-1':         'Provider-neutral identity verification (Local, Keycloak, Azure Entra, LDAP)',
      'nx-done-2':         'Policy evaluation with signed evidence (HMAC-SHA256)',
      'nx-done-3':         'Risk classification: read-only / reversible write / irreversible write',
      'nx-done-4':         'Per-operator, capability-scoped permission grants',
      'nx-done-5':         'Append-only audit chain with prevHash linking',
      'nx-done-6':         '102 governed capabilities · 10 gates · 1,300+ test cases',
      'nx-wip-title':      '⚡ In progress',
      'nx-wip-1':          'Incremental execution enablement, starting with low-risk, reversible actions',
      'nx-wip-2':          'Public-key signing for audit evidence (currently symmetric HMAC)',
      'nx-uses-title':     'Use cases',
      'nx-uses-1':         'Read-only infrastructure queries with operator identity and namespace scoping',
      'nx-uses-2':         'AI-generated pull requests with a signed human approval before merge',
      'nx-uses-3':         'Ticket automation and security operations with critical actions blocked until approval',
      'nx-cta-product':    'Product & interactive demo ↗',

      // Projects
      'projects-title': 'Projects & Case Studies',
      'prj-1-title':    'Governed integrations — Nexus Desktop & Senses',
      'prj-1-text':     'Agent integrations with Desktop, voice, Telegram, HTTP, Linux, Windows, Docker, Kubernetes, Git and logs, running under the NexusOS governance pipeline with multi-provider LLM routing.',
      'prj-2-title':    'Secure generative AI adoption',
      'prj-2-text':     'At Allianz Argentina, from the security team: assessment of secure development practices, access controls and LLM risk in the corporate rollout of generative AI; CI/CD security with Jenkins, SonarQube and GitHub Advanced Security.',
      'prj-3-title':    'Banking DevOps platforms',
      'prj-3-text':     'Infrastructure as code on Azure with Terraform and containers on OpenShift 4 (Banco Pichincha); platform administration and GitLab CI pipelines on AWS (Banco Itaú). CNCF framework evaluation in the DevOps chapter.',
      'prj-4-title':    'Data & Cloud in media',
      'prj-4-text':     'At Clarín (AGEA): GCP integration with Elastic Cloud (Pub/Sub, Dataflow, Airflow), Java connector development, EKS clusters with CDK and Node.js microservices.',

      // Resume
      'resume-title':     'Experience',
      'resume-exp':       '// work history',
      'resume-edu':       '// education & certifications',
      'date-present':     'Present',
      'res-nexus-role':   'Founder & CTO · AI Systems Architect',
      'res-nexus-desc':   'Design and development of NexusOS, a governance and authorization platform for AI agents: a 10-gate pipeline (identity, policy, permission, risk, enforcement, audit), an HMAC-signed audit chain, and governed integrations for infrastructure, code and operations.',
      'res-itau-role':    'DevOps — Contractor',
      'res-itau-desc':    'Administration of DevOps/DevSecOps infrastructure and platforms. CI/CD pipeline and deployment automation, infrastructure as code, and collaboration with technical teams on incidents and improvements. Stack: AWS, GitLab CI.',
      'res-pich-role':    'DevOps — Freelance',
      'res-pich-desc':    'Azure infrastructure with Terraform and container management on OpenShift 4. CNCF framework evaluation in the DevOps chapter and CI/CD process optimization in banking environments.',
      'res-allianz-desc': 'Worked from the security team on the corporate rollout of generative AI: assessment of secure development practices, access controls and LLM risk. CI/CD security with Jenkins, SonarQube and GHAS. AWS EKS infrastructure with Terraform. Security training for internal and external teams.',
      'res-arkho-desc':   'AWS infrastructure with CloudFront, S3 and RDS. Backend with Node.js microservices on an EKS cluster. CDK, CodeBuild, CodePipeline, CodeCommit and Docker.',
      'res-clarin-desc':  'GCP integration with Elastic Cloud: Pub/Sub, Dataflow, Airflow. Docker and Kubernetes. Java connector development, AWS EKS with CDK (VPC, ELB) and Node.js microservices.',
      'res-ingenia-desc': 'Geopagos: architecture design and AWS infrastructure with Kubernetes, Terraform, Airflow and GitLab. Mercantil Andina: new platform design on Azure with AKS, Terraform, Azure DevOps and Bitbucket.',
      'res-flux-desc':    'CI/CD for Android and iOS apps with Docker, Jenkins and Azure DevOps across GCP, AWS and Azure. Integration with SonarQube and Browserstack.',
      'res-equifax-desc': 'Site Reliability Engineering: Docker, Ansible, Apache, Tomcat, Nagios, Red Hat Linux, Nginx, Jenkins, Terraform and Kubernetes on GCP.',
      'res-java-title':   'Java / SOA era — banking & telcos',
      'res-java-role':    'Backend & Integration Engineer · Architecture',
      'res-java-desc':    'Backend and integration architecture foundation: Telecom (SOA with OSB 12c, DataPower, Jenkins; technical lead and configuration manager 2018–2020, plus production deployment support off-hours and on weekends through late 2022), HSBC (Sr Java, IBM ESB, 2017–2018), Banco Credicoop (Java in the Architecture team; open source research: CouchDB, Node.js, ELK, Jenkins, 2014–2017), Telefónica/Movistar (Java SOA/OSB consultant, WebLogic, Spring, 2012–2014).',
      'res-acc-role':     'Cobol Developer',
      'res-acc-desc':     'Cobol programming on mainframe (JCL, DB2).',
      'edu-utn-title':    'Industrial Engineering',
      'edu-tec-title':    'IT Technician',

      // Services
      'svc-title':   'Services',
      'svc-intro':   'I work with platform, security and technology teams that need to adopt AI without losing control, or take their DevOps/DevSecOps practice to the next level.',
      'svc-1-text':  'Design of production-ready agentic and multi-agent systems: architecture, provider routing, observability and execution boundaries. For organizations that are past the pilot stage and need AI to operate reliably.',
      'svc-2-text':  'Assessment of your agent and LLM governance posture: identity, authorization, risk classification, approvals and audit. For CISOs and compliance teams that need evidence, not promises.',
      'svc-3-text':  'Guidance for adopting generative AI and agents with controls from day one: secure development, prompt injection mitigation and human-in-the-loop for critical actions.',
      'svc-4-text':  'Security integrated into the lifecycle: SAST/DAST/SCA in pipelines, Secure SDLC, CI/CD hardening. Applied experience in banking and insurance.',
      'svc-5-text':  'Architecture and infrastructure as code on AWS, Azure and GCP: Kubernetes, OpenShift, Terraform and CI/CD automation for platforms that scale.',
      'svc-6-title': 'Architecture Review & Technical Advisory',
      'svc-6-text':  'Architecture review and technical guidance for platform, security and AI decisions: an external senior perspective before committing investment.',
      'svc-cta':     'Start a conversation',
      'svc-pyme':    'AI & automation for SMBs →',

      // News
      'blog-title': 'News',
      'news-intro': 'Feed generated automatically by my own pipeline (GitHub Actions + RSS + scoring), updated daily.',

      // Contact
      'ct-title':        'Contact',
      'ct-jobs-title':   'Job opportunities',
      'ct-jobs-text':    'AI Systems / Platform / DevSecOps Architecture roles and senior DevOps, SRE or Platform Engineering positions. Remote from Argentina.',
      'ct-jobs-cta':     "Let's talk about your search",
      'ct-consult-title':'Consulting & NexusOS',
      'ct-consult-text': 'Secure AI adoption, agent governance, DevSecOps, or a NexusOS walkthrough for your technical team.',
      'ct-consult-cta':  'Schedule a conversation',

      // Footer
      'footer-line':  'AI Systems Architect & DevSecOps Engineer  ·  Chubut, Argentina',
      'footer-built': 'Built with'
    }
  };

  function setLanguage(lang) {
    if (!translations[lang]) return;

    document.querySelectorAll('[data-lang]').forEach(function (el) {
      const key = el.getAttribute('data-lang');
      if (translations[lang][key] !== undefined) {
        el.textContent = translations[lang][key];
      }
    });

    // <html lang>, title y meta description por idioma
    document.documentElement.setAttribute('lang', lang);
    if (meta[lang]) {
      document.title = meta[lang].title;
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', meta[lang].description);
    }

    try { localStorage.setItem('nf-lang', lang); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    const btnEs = document.getElementById('flag-es');
    const btnEn = document.getElementById('flag-en');
    if (btnEs) btnEs.addEventListener('click', function () { setLanguage('es'); });
    if (btnEn) btnEn.addEventListener('click', function () { setLanguage('en'); });

    // Restaurar idioma guardado o detectar el del navegador
    let saved = null;
    try { saved = localStorage.getItem('nf-lang'); } catch (e) {}
    if (saved === 'en') {
      setLanguage('en');
    } else if (!saved && navigator.language && !navigator.language.toLowerCase().startsWith('es')) {
      setLanguage('en');
    }
  });
})();
