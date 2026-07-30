# Website Profile Refresh — AI Systems Architect & DevSecOps

Fecha: 2026-07-29
Repo vigente: `ndf14685.github.io` (CNAME `www.nestorfleitas.ar`).
El repo `nestorfleitas.ar` está marcado como obsoleto en su `OPENCLAW_NOTE.md` y no se toca.

## 1. Auditoría

### Arquitectura y stack actual

- Sitio estático en GitHub Pages: `index.html` único (one-page) + páginas
  independientes `/servicios/`, `/novedades/`, `/busquedas/`, `/dashboard/`.
- CSS propio modular: `base.css`, `theme.css`, `layout.css`, `sections.css`,
  `blog.css`, `servicios.css` (+ `accessibility.css` existente pero **no linkeado**).
- JS vanilla propio: `main.js` (nav, fades, contacto ofuscado), `theme.js`
  (dark/light + localStorage), `lang.js` (i18n parcial por `data-lang`),
  `blog.js` (feed de noticias desde `assets/data/news.json`).
- Bootstrap 5 CSS por CDN (se usa `.container` y el grid); jQuery y Bootstrap JS
  cargados pero **sin uso** en el código propio (nav y animaciones son vanilla).
- Pipelines: GitHub Actions `daily-news.yml` y `ai-novedades.yml` regeneran
  `assets/data/*.json`. No hay build step: lo que está en `master` se publica.
- Sin analytics. El formulario PHP (`assets/php/sendemail.php`) no puede
  ejecutarse en GitHub Pages: el contacto real es mailto + WhatsApp (ofuscados
  en `main.js`).

### Problemas de contenido

1. Título y hero: "DevOps & DevSecOps Consultant" — desactualizado; IA aparece
   solo como tag ("AI Security / Secure GenAI Adoption").
2. NexusOS ausente: solo un crédito en el footer ("Construido con NexusAI").
3. Proyectos genéricos sin evidencia ("Automatización CI/CD", "Infraestructura
   Segura en la Nube", "Monitorización con Wazuh").
4. Skill bars con porcentajes arbitrarios (Python 55%, Kubernetes 60%) y
   soft-skills con % — formato que penaliza un perfil senior.
5. Fecha de nacimiento (14/06/1985) expuesta en el About — se elimina por
   requisito explícito.
6. i18n incompleto: solo ~25 claves; el 90% del contenido (hero H1, skills,
   timeline, proyectos) queda en español al cambiar a EN.
7. Sin sección de servicios profesionales en la home; `/servicios/` apunta a
   PyMEs locales de Chubut (otra audiencia, se conserva como landing aparte).
8. Sin sección de contacto como tal (solo botones sueltos en About).

### Problemas SEO

- Home sin Open Graph, Twitter cards, canonical, JSON-LD, robots.txt ni
  sitemap.xml (solo `/servicios/` tiene OG + canonical).
- `title`/`description` posicionan solo DevOps.
- hreflang: no aplica con la arquitectura actual (una sola URL con toggle de
  idioma por JS, sin URLs por idioma). Se documenta en vez de forzarlo.

### Inconsistencias web vs CV (CV DevOps ES/EN, `assets/cv.pdf` / `cvIngles.pdf`, mayo 2026)

- Telecom: web dice MAR 2018–2020; CV dice 03/2018–12/2022 (se superpondría con
  Equifax, Flux IT, Ingenia y Clarín — probable typo del CV). Se mantiene
  2018–2020. **Confirmar.**
- Allianz: web "JUL 2024–MAY 2025" vs CV "07/2024–05/2025" — coinciden.
- Educación: "cursando 3er año" de Ingeniería Industrial (UTN) puede estar
  desactualizado. Se deja sin el detalle de año. **Confirmar.**

### Fuentes de verdad usadas

- CV DevOps/DevSecOps ES y EN (PDFs del repo, versión mayo 2026).
- CV "AI Systems Architect": **no existe en el repo ni en el disco** — queda
  como pendiente (ver §6).
- NexusOS: página pública `nexus-ai.lat/nexusos` (fuente local:
  `workspace/nexus-security/nexusos.html`) y `NexusOS-manifesto`. De ahí salen
  los datos verificables: pipeline de 10 gates (Identity → Policy → Permission →
  Risk → PEP → Execute → Audit), 102 governed capabilities, 1.300+ test cases,
  audit chain HMAC-SHA256 + prevHash, identity provider-neutral (Local,
  Keycloak, Azure Entra, LDAP), clasificación de riesgo por tiers, estado:
  pipeline de gobernanza completo, habilitación de ejecución en progreso.

### Riesgos de modificar

- No tocar `assets/data/*.json` ni los workflows (los regenera CI).
- `blog.js` renderiza dentro de `#news-feed`; la sección de noticias se mueve
  de lugar pero conserva IDs y clases.
- `/servicios/`, `/novedades/`, `/busquedas/`, `/dashboard/` no se modifican.
- `theme.js` espera `body.dark|light` y `#theme-toggle-btn`: se conservan.

## 2. Objetivo y posicionamiento

- Título elegido: **"AI Systems Architect & DevSecOps Engineer"** — claro para
  recruiters y ATS, dos familias de búsqueda (A: AI/agentic; B:
  DevOps/Platform/Security), sin sobrecarga de pipes. "AI Governance" se lleva
  al subtítulo/propuesta de valor, donde aporta contexto sin diluir el H1.
- Propuesta de valor (EN): *"I design secure platforms where cloud
  infrastructure, DevSecOps pipelines and autonomous AI agents operate under
  identity, authorization, policy and audit controls."*
- Narrativa: Backend Java → Arquitectura/SOA → Cloud/DevOps → DevSecOps →
  AI Systems Architecture → Governance para IA autónoma. La experiencia previa
  es el fundamento, no un perfil separado.
- Idea central de NexusOS: **"AI proposes. Governance decides."**

## 3. Arquitectura de información (home)

1. Hero — nombre, título, propuesta de valor, ubicación (Chubut, Argentina ·
   Remote), disponibilidad, CTAs (Contacto / NexusOS), links CV + LinkedIn +
   GitHub + NexusOS. Sin panel de noticias (se muda abajo). Badges reducidos.
2. Sobre mí — evolución profesional en 3 párrafos con evidencia; sin frases
   genéricas; sin fecha de nacimiento.
3. Áreas de especialización — 3 grupos de tags descriptivos (sin %):
   A. AI Systems & Governance · B. DevOps, Platform & Cloud · C. Security &
   Software Engineering.
4. NexusOS (proyecto principal) — problema, propuesta, pipeline visual de
   gobernanza, qué está implementado vs en progreso vs visión, links a
   nexus-ai.lat/nexusos y GitHub.
5. Proyectos — casos reales: NexusOS platform, adopción segura de GenAI
   (Allianz, desde el rol de seguridad), plataformas cloud bancarias
   (Pichincha/Itaú), data & cloud en medios (Clarín). Se eliminan los genéricos.
6. Experiencia — timeline completo; últimos ~8 años detallados, etapa Java/SOA
   (2012–2018) resumida como fundamento; Cobol/Accenture en una línea.
7. Servicios — AI Systems Architecture, AI Governance Assessment, Secure
   Agentic AI Adoption, DevSecOps Consulting, Cloud & Platform Architecture,
   Secure SDLC / Architecture Review. CTA por servicio → contacto. Link a la
   landing PyME `/servicios/` como oferta local separada.
8. News feed — sección propia (mantiene el feed automatizado como evidencia de
   pipeline propio).
9. Contacto — email, LinkedIn, GitHub, WhatsApp (se mantiene, ya estaba público
   y ofuscado en JS), CTA doble: oportunidades laborales / consultoría-NexusOS.
10. Certificaciones y educación se mantienen dentro de Resume (sin cambios de
    fondo, sin inventar credenciales).

## 4. Decisiones visuales

- Se conserva la identidad terminal (prompt, dots, monospace en labels) pero
  como acento, no como obstáculo: cuerpo en Inter, líneas ≤ ~70ch, jerarquía
  H1/H2/H3 real, contraste AA en ambos temas.
- Sin barras de progreso; tags agrupados por dominio.
- `accessibility.css` (prefers-reduced-motion, focus-visible) pasa a estar
  linkeado en la home.
- Se mantienen dark/light y el toggle existente.

## 5. Decisiones técnicas

- Mismo stack (HTML estático + CSS modular + JS vanilla). Sin frameworks nuevos.
- Se eliminan jQuery y Bootstrap JS de la home (sin uso). Bootstrap CSS se
  conserva (grid/container en uso por otras páginas y estilos).
- i18n: se mantiene el mecanismo `data-lang` y se amplía el diccionario a
  cobertura total del contenido de la home; el toggle también actualiza
  `<html lang>`, `<title>` y `meta description`.
- i18n ampliado (2026-07-30): la home soporta **es/en/pt/de** — el mismo set
  de idiomas que nexus-ai.lat. La terminología NexusOS en PT/DE sigue los
  diccionarios de `nexus-security/locales/nexusos.{pt,de}.json` (governança /
  trilha de auditoria; Governance-Gates / Audit-Trail / Risikoklassifizierung)
  para consistencia entre ambos sitios. El switcher pasó de dos banderas a un
  `<select>` ES/EN/PT/DE (mismo patrón que nexus-ai.lat), con autodetección
  del idioma del navegador en la primera visita (pt→PT, de→DE, es→ES, resto→EN)
  y persistencia en localStorage. `og:locale:alternate` incluye pt_BR y de_DE;
  JSON-LD `inLanguage` cubre los cuatro.
- SEO: title/description nuevos, OG + Twitter cards, canonical, JSON-LD
  (`Person` + `WebSite` + `SoftwareApplication` para NexusOS con estado honesto
  vía descripción), robots.txt y sitemap.xml.
- Rutas estáticas por idioma (2026-07-30): `/en/`, `/pt/` y `/de/` se generan
  con `node scripts/build-i18n.js` (npm run build:i18n) a partir de
  `index.html` + `scripts/i18n-dictionaries.mjs`. Cada página lleva su
  contenido horneado (indexable sin JS), `<html lang>`, meta description/OG
  por idioma, canonical propio, cluster hreflang idéntico en las cuatro
  (x-default → /en/, pensado para visitantes internacionales) y assets con
  rutas root-absolute. `lang.js` quedó como runtime mínimo: el select navega
  entre las cuatro URLs y recuerda la elección explícita (sin autodetección
  ni redirect para visitantes nuevos, para no confundir crawlers). El sitemap
  lista las cuatro URLs con `xhtml:link` alternates.
  **Importante**: tras editar `index.html` o los diccionarios, correr el build
  y commitear las páginas regeneradas.
- Se elimina el código de skill-bars de `main.js`.

## 6. Datos confirmados por el usuario (2026-07-29)

1. **CVs**: se publican solo dos archivos, uno en español y uno en inglés
   (`assets/cv.pdf` y `assets/cvIngles.pdf`); uno de ellos está customizado
   para postulaciones de IA. Los botones usan etiquetas neutrales por idioma
   ("CV en español" / "Resume in English"), sin un tercer CV separado.
2. **Telecom**: trabajó hasta fines de 2022 — 2018–2020 como referente
   técnico/configuration manager y 2020–2022 soporte de despliegues
   productivos fuera de horario y fines de semana (por eso se superpone con
   Equifax/Flux IT/Ingenia/Clarín). Timeline actualizado (bloque Java/SOA
   2012–2022).
3. **UTN**: confirmado; se muestra carrera e institución sin detalle de año.
4. Disponibilidad ("disponible") — se mantiene porque ya estaba publicada.
5. WhatsApp público — se mantiene (ya estaba público); avisar si se quiere
   retirar.

## 7. Archivos modificados

- `index.html` — reescritura completa (contenido + SEO + estructura).
- `assets/js/lang.js` — diccionario completo ES/EN + lang/title/meta switch +
  autodetección de idioma del navegador en la primera visita.
- `assets/js/main.js` — se quita el código de skill bars; se cablean los CTAs
  de contacto (jobs/consultoría con asunto) y los duplicados de email/WhatsApp.
- `assets/js/theme.js` — **bugfix preexistente**: corría en `<head>` cuando
  `document.body` aún no existía, el IIFE moría con TypeError y el toggle de
  tema nunca se registraba. Ahora la aplicación inicial se difiere al
  DOMContentLoaded cuando hace falta.
- `assets/css/sections.css` — estilos nuevos (hero single-column, expertise,
  nexusos + pipeline, services, contact, timeline compacto, `hyphens: none`
  en títulos).
- `robots.txt`, `sitemap.xml` — nuevos.
- `docs/website-profile-refresh.md` — este documento.

## 8. Validaciones realizadas

- `node --check` sobre `lang.js`, `main.js`, `theme.js`: OK.
- Cobertura i18n verificada por script: 105 claves `data-lang` en el HTML,
  105 en ES y 105 en EN, sin asimetrías ni claves huérfanas.
- Anclas internas verificadas por script: ninguna rota.
- Assets referenciados verificados en disco (banderas, foto, favicon, PDFs).
- Tests existentes de `scripts/` (`node --test`): 17 pass, 0 fail (no se
  tocaron los pipelines de noticias).
- Prueba en Chromium local (server estático):
  - Desktop 1280×800 y mobile 390×844: hero, expertise, NexusOS (pipeline
    envuelve bien en mobile), services, contact y nav hamburguesa OK.
  - Toggle ES/EN: navegación, hero, secciones y `<html lang>`/title/meta
    cambian completos en ambos sentidos.
  - Toggle dark/light: funciona tras el bugfix de theme.js; tema claro legible
    en todas las secciones nuevas.
  - Consola sin errores.
  - Fix aplicado durante la validación: títulos partidos con guiones en mobile
    (`hyphens: none` en h1/h2/h3).
- No se modificaron `/servicios/`, `/novedades/`, `/busquedas/`, `/dashboard/`
  ni los workflows de GitHub Actions.
- Validación PT/DE (2026-07-30): 104 claves por idioma en los cuatro
  diccionarios, sin faltantes ni huérfanas (verificado por script);
  prueba en Chromium: hero/NexusOS en PT, hero/servicios en DE, roundtrip
  ES↔PT↔DE↔ES, persistencia del idioma tras recarga con el select
  sincronizado, y `<html lang>` + meta description correctos por idioma.
