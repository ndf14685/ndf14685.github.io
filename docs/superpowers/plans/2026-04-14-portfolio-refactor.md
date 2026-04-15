# Portfolio Refactor + Automated News Blog — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactorizar nestorfleitas.ar con estetica Terminal/Hacker Pro y agregar un blog de noticias automatizado diario de DevOps/DevSecOps/Cybersecurity.

**Architecture:** Frontend estatico (HTML + CSS modular + JS vanilla), sin build tool. Un script Node.js corre via cron en el VPS, lee RSS feeds (cybersecurity) + NewsAPI (devops), y escribe `assets/data/news.json`. El frontend lee ese JSON y renderiza el feed estilo terminal.

**Tech Stack:** HTML5, CSS3 custom properties, Bootstrap 5 (CDN), jQuery 3.7 (CDN), Node.js v22, `rss-parser`, `axios`, `dotenv`, `node:test` (tests).

**Spec:** `docs/superpowers/specs/2026-04-14-portfolio-refactor-design.md`

**Mockup aprobado:** `.superpowers/brainstorm/1374-1776206858/content/design-mockup-v2.html`

---

## File Map

| Archivo | Accion | Responsabilidad |
|---|---|---|
| `index.html` | Reescribir | Estructura HTML completa del sitio |
| `assets/css/base.css` | Crear | Variables CSS, reset, tipografia |
| `assets/css/layout.css` | Crear | Nav, hero, footer |
| `assets/css/sections.css` | Crear | About, skills, resume, certifications, projects |
| `assets/css/blog.css` | Crear | Terminal news feed |
| `assets/css/theme.css` | Crear | Dark/light mode via CSS vars |
| `assets/js/theme.js` | Crear | Toggle dark/light + localStorage |
| `assets/js/main.js` | Crear | Scroll, sticky nav, preloader, progress bars |
| `assets/js/blog.js` | Crear | Fetch news.json + render |
| `assets/js/lang.js` | Modificar | Adaptar traducciones al nuevo HTML |
| `assets/data/news.json` | Crear | Stub para desarrollo |
| `scripts/package.json` | Crear | Dependencias del script Node |
| `scripts/fetch-news.js` | Crear | Script de noticias automatizado |
| `scripts/fetch-news.test.js` | Crear | Tests con node:test |
| `scripts/.env.example` | Crear | Plantilla de variables de entorno |
| `.gitignore` | Modificar | Agregar .env, node_modules/, .superpowers/ |
| `assets/css/style.css` | Eliminar contenido | Reemplazado por los 5 archivos nuevos |

---

## PARTE A: Frontend

---

### Task 1: Setup — estructura de carpetas y archivos stub

**Files:**
- Create: `assets/data/news.json`
- Create: `scripts/.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Crear directorio data y stub news.json**

```bash
mkdir -p assets/data
```

Crear `assets/data/news.json` con este contenido exacto:

```json
{
  "generated_at": "2026-04-14T11:00:00Z",
  "items": [
    {
      "id": 1,
      "category": "cybersecurity",
      "title": "Critical RCE Vulnerability in OpenSSH — Patch Immediately",
      "summary": "A critical remote code execution vulnerability was discovered in OpenSSH versions prior to 9.8. Attackers can exploit this without authentication. Patches are available for all major distributions.",
      "source": "The Hacker News",
      "source_url": "https://thehackernews.com",
      "published_at": "2026-04-14T06:00:00Z"
    },
    {
      "id": 2,
      "category": "devops",
      "title": "Kubernetes 1.32 Released: New Security Context and RBAC Features",
      "summary": "The latest Kubernetes release introduces fine-grained security context controls, improved RBAC audit logging, and performance improvements for large clusters with thousands of nodes.",
      "source": "The New Stack",
      "source_url": "https://thenewstack.io",
      "published_at": "2026-04-14T04:00:00Z"
    },
    {
      "id": 3,
      "category": "cybersecurity",
      "title": "Ransomware Group Exploiting Unpatched Fortinet VPNs — CISA Alert",
      "summary": "CISA and FBI issued a joint advisory warning of active exploitation in FortiOS. Organizations are urged to apply patches and audit VPN access logs immediately.",
      "source": "BleepingComputer",
      "source_url": "https://www.bleepingcomputer.com",
      "published_at": "2026-04-14T03:00:00Z"
    }
  ]
}
```

- [ ] **Step 2: Crear scripts/.env.example**

```bash
mkdir -p scripts
```

Crear `scripts/.env.example`:

```
# Obtener key gratuita en https://newsapi.org/register
NEWS_API_KEY=your_newsapi_key_here

# Ruta relativa desde scripts/ al archivo de salida
NEWS_JSON_PATH=../assets/data/news.json
```

- [ ] **Step 3: Actualizar .gitignore**

Agregar al final de `.gitignore` (crear el archivo si no existe):

```
# Secrets
scripts/.env

# Node
scripts/node_modules/

# Brainstorm sessions
.superpowers/

# Logs
*.log
```

- [ ] **Step 4: Vaciar style.css**

Reemplazar el contenido de `assets/css/style.css` con:

```css
/* style.css — reemplazado por base.css, layout.css, sections.css, blog.css, theme.css */
```

- [ ] **Step 5: Commit**

```bash
git add assets/data/news.json scripts/.env.example .gitignore assets/css/style.css
git commit -m "chore: project setup — new folder structure, stub news.json, gitignore"
```

---

### Task 2: CSS — base.css (variables y reset)

**Files:**
- Create: `assets/css/base.css`

- [ ] **Step 1: Crear assets/css/base.css**

```css
/* ==============================================
   base.css — Variables CSS, reset, tipografia
   ============================================== */

/* --- Variables: Dark Mode (default) --- */
:root {
  --bg-primary:    #010409;
  --bg-secondary:  #0d1117;
  --bg-card:       #0d1117;
  --bg-elevated:   #21262d;
  --border:        #21262d;
  --border-subtle: #30363d;
  --text-primary:  #e6edf3;
  --text-muted:    #8b949e;
  --text-faint:    #6e7681;
  --accent-green:  #3fb950;
  --accent-blue:   #58a6ff;
  --accent-orange: #ffa657;
  --accent-red:    #f85149;
  --green-bg:      rgba(63, 185, 80, 0.1);
  --green-border:  rgba(63, 185, 80, 0.3);
  --red-bg:        rgba(248, 81, 73, 0.15);
  --red-border:    rgba(248, 81, 73, 0.3);
  --blue-bg:       rgba(88, 166, 255, 0.15);
  --blue-border:   rgba(88, 166, 255, 0.3);
}

/* --- Reset --- */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.7;
  font-weight: 400;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* --- Tipografia --- */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
}

a {
  color: var(--accent-blue);
  text-decoration: none;
  transition: color 0.15s;
}

a:hover {
  color: var(--accent-green);
}

img {
  max-width: 100%;
  display: block;
}

ul {
  list-style: none;
}

/* --- Utilidades --- */
.mono {
  font-family: 'Courier New', Consolas, monospace;
}

.section-padding {
  padding: 72px 0;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-label {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 11px;
  color: var(--accent-green);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 6px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.section-title span {
  color: var(--accent-green);
}

.section-hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 16px 0 40px;
}

/* --- Preloader --- */
#tt-preloader {
  position: fixed;
  inset: 0;
  background: var(--bg-primary);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

#pre-status {
  font-family: monospace;
  color: var(--accent-green);
  font-size: 13px;
}

/* --- Scroll Up Button --- */
.scroll-up {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.3s;
}

.scroll-up.visible {
  opacity: 1;
}

.scroll-up a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  color: var(--accent-green);
  font-size: 14px;
}
```

- [ ] **Step 2: Verificar que no hay errores de sintaxis**

```bash
node -e "
const fs = require('fs');
const css = fs.readFileSync('assets/css/base.css', 'utf8');
const openBraces = (css.match(/{/g) || []).length;
const closeBraces = (css.match(/}/g) || []).length;
if (openBraces !== closeBraces) {
  console.error('MISMATCHED BRACES:', openBraces, 'open vs', closeBraces, 'close');
  process.exit(1);
}
console.log('OK — braces balanced:', openBraces);
"
```

Resultado esperado: `OK — braces balanced: <numero>`

- [ ] **Step 3: Commit**

```bash
git add assets/css/base.css
git commit -m "feat: add base.css with CSS variables and reset"
```

---

### Task 3: CSS — layout.css (nav, hero, footer)

**Files:**
- Create: `assets/css/layout.css`

- [ ] **Step 1: Crear assets/css/layout.css**

```css
/* ==============================================
   layout.css — Nav, Hero, Footer
   ============================================== */

/* --- Language Switcher (arriba a la derecha) --- */
.language-switcher {
  display: none; /* movido al nav */
}

/* --- NAV --- */
.site-nav {
  background: rgba(1, 4, 9, 0.95);
  border-bottom: 1px solid var(--border);
  padding: 14px 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background 0.3s;
}

.site-nav .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 15px;
  font-weight: 700;
  color: var(--accent-green);
  text-decoration: none;
}

.nav-brand .nav-brand-path {
  color: var(--accent-blue);
}

.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-links a {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--accent-green);
}

.nav-links a[href="#blog"] {
  color: var(--accent-green);
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-flag-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.nav-flag-btn:hover {
  opacity: 1;
}

.nav-flag-btn img {
  width: 22px;
  height: auto;
  display: block;
}

.nav-theme-btn {
  background: none;
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.nav-theme-btn:hover {
  color: var(--accent-green);
  border-color: var(--accent-green);
}

/* Hamburger mobile */
.nav-toggler {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.nav-toggler span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-muted);
  border-radius: 2px;
}

/* Mobile nav collapse */
@media (max-width: 768px) {
  .nav-toggler { display: flex; }

  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    flex-direction: column;
    gap: 0;
    padding: 8px 0;
  }

  .nav-links.open { display: flex; }

  .nav-links a {
    padding: 12px 24px;
    width: 100%;
  }
}

/* --- HERO --- */
.hero-section {
  min-height: 100vh;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 24px 40px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 65%, rgba(63, 185, 80, 0.07) 0%, transparent 70%);
  pointer-events: none;
}

.hero-prompt {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 13px;
  color: var(--accent-green);
  margin-bottom: 12px;
}

.hero-prompt .prompt-user {
  color: var(--accent-blue);
}

.hero-prompt .prompt-cmd {
  color: var(--text-primary);
}

.hero-prompt .cursor {
  display: inline-block;
  width: 8px;
  height: 14px;
  background: var(--accent-green);
  margin-left: 2px;
  animation: cursor-blink 1s step-end infinite;
  vertical-align: middle;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.hero-section h1 {
  font-size: 44px;
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 1.1;
  margin-bottom: 14px;
}

.hero-section h1 em {
  color: var(--accent-green);
  font-style: normal;
}

.hero-sub {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 13px;
  color: var(--text-muted);
}

.hero-sub .hero-available {
  color: var(--accent-orange);
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 28px;
}

.hero-badge {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-family: 'Courier New', Consolas, monospace;
  font-size: 11px;
  padding: 5px 12px;
  border-radius: 20px;
}

.hero-badge.green { border-color: var(--accent-green); color: var(--accent-green); }
.hero-badge.blue  { border-color: var(--accent-blue);  color: var(--accent-blue); }
.hero-badge.orange{ border-color: var(--accent-orange); color: var(--accent-orange); }

.hero-cta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 32px;
}

.btn-primary-nf {
  background: #238636;
  border: 1px solid #2ea043;
  color: #fff;
  padding: 10px 22px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-primary-nf:hover {
  background: #2ea043;
  color: #fff;
}

.btn-secondary-nf {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  padding: 10px 22px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s;
}

.btn-secondary-nf:hover {
  border-color: var(--accent-green);
  color: var(--accent-green);
}

.scroll-indicator {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  font-family: monospace;
  font-size: 11px;
  color: var(--accent-green);
  animation: scroll-pulse 1.5s ease-in-out infinite;
}

@keyframes scroll-pulse {
  0%, 100% { opacity: 1; transform: translateX(-50%) translateY(0); }
  50%       { opacity: 0.4; transform: translateX(-50%) translateY(4px); }
}

@media (max-width: 600px) {
  .hero-section h1 { font-size: 30px; }
}

/* --- FOOTER --- */
.site-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  padding: 32px 0;
  text-align: center;
}

.footer-prompt {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 12px;
  color: var(--text-faint);
  margin-bottom: 6px;
}

.footer-prompt .fp-user { color: var(--accent-green); }

.footer-output {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 12px;
  color: var(--accent-green);
  margin-bottom: 20px;
}

.footer-social {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.footer-social a {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 12px;
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
  padding: 5px 14px;
  border-radius: 4px;
  text-decoration: none;
  transition: color 0.2s, border-color 0.2s;
}

.footer-social a:hover {
  color: var(--accent-green);
  border-color: var(--accent-green);
}
```

- [ ] **Step 2: Verificar braces balanceadas**

```bash
node -e "
const fs = require('fs');
const css = fs.readFileSync('assets/css/layout.css', 'utf8');
const o = (css.match(/{/g)||[]).length;
const c = (css.match(/}/g)||[]).length;
if(o!==c){console.error('MISMATCH:',o,'vs',c);process.exit(1);}
console.log('OK — braces:',o);
"
```

- [ ] **Step 3: Commit**

```bash
git add assets/css/layout.css
git commit -m "feat: add layout.css — nav, hero, footer styles"
```

---

### Task 4: CSS — sections.css (about, skills, resume, certifications, projects)

**Files:**
- Create: `assets/css/sections.css`

- [ ] **Step 1: Crear assets/css/sections.css**

```css
/* ==============================================
   sections.css — About, Skills, Resume, Certif, Projects
   ============================================== */

/* --- About --- */
.about-section { background: var(--bg-primary); }

.about-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 48px;
  align-items: start;
}

@media (max-width: 700px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .about-photo-col { text-align: center; }
}

.about-photo {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 2px solid var(--accent-green);
  object-fit: cover;
  display: block;
  margin: 0 auto;
}

.about-meta {
  margin-top: 16px;
  font-family: 'Courier New', Consolas, monospace;
  font-size: 11px;
}

.about-meta-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid var(--border);
  color: var(--text-muted);
}

.about-meta-row span {
  color: var(--text-primary);
}

.about-wa-btn {
  display: block;
  margin-top: 14px;
  background: #238636;
  border: 1px solid #2ea043;
  color: #fff;
  padding: 8px;
  border-radius: 6px;
  font-size: 11px;
  text-align: center;
  text-decoration: none;
  font-family: 'Courier New', Consolas, monospace;
  transition: background 0.2s;
}

.about-wa-btn:hover {
  background: #2ea043;
  color: #fff;
}

.about-text-col h4 {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 11px;
  color: var(--accent-blue);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 400;
  margin: 20px 0 10px;
}

.about-text-col h4:first-child { margin-top: 0; }

.about-text-col p {
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.8;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-family: 'Courier New', Consolas, monospace;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 4px;
}

.about-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.about-actions a {
  font-size: 12px;
  padding: 8px 16px;
}

/* --- Skills --- */
.skills-section { background: var(--bg-secondary); }

.skills-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 48px;
}

@media (max-width: 600px) {
  .skills-grid { grid-template-columns: 1fr; }
}

.skill-row { margin-bottom: 16px; }

.skill-name {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.skill-name .skill-pct { color: var(--accent-green); }

.skill-bar {
  height: 4px;
  background: var(--border);
  border-radius: 2px;
}

.skill-fill {
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--accent-green), var(--accent-blue));
  width: 0;
  transition: width 1s ease-in-out;
}

.soft-skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 40px;
}

@media (max-width: 500px) {
  .soft-skills-grid { grid-template-columns: 1fr 1fr; }
}

.soft-card {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 18px;
  text-align: center;
}

.soft-pct {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 24px;
  font-weight: 700;
  color: var(--accent-green);
}

.soft-label {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

/* --- Certifications --- */
.certifications-section { background: var(--bg-primary); }

.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.cert-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent-green);
  border-radius: 0 8px 8px 0;
  padding: 16px 20px;
}

.cert-card h4 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.cert-card span {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 11px;
  color: var(--accent-green);
}

/* --- Projects --- */
.projects-section { background: var(--bg-secondary); }

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.project-card {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-top: 2px solid var(--accent-green);
  border-radius: 0 0 8px 8px;
  padding: 20px;
}

.project-card h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.project-card p {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.7;
}

/* --- Resume / Timeline --- */
.resume-section { background: var(--bg-primary); }

.timeline {
  position: relative;
  padding-left: 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 130px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--border);
}

@media (max-width: 600px) {
  .timeline::before { left: 0; }
}

.tl-item {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 0;
  margin-bottom: 28px;
  position: relative;
}

@media (max-width: 600px) {
  .tl-item {
    grid-template-columns: 1fr;
    padding-left: 20px;
  }
  .tl-date { display: none; }
  .tl-dot { left: -4px !important; }
}

.tl-date {
  text-align: right;
  padding-right: 24px;
  padding-top: 6px;
}

.tl-date span {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 10px;
  color: var(--accent-blue);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.5;
}

.tl-dot {
  position: absolute;
  left: 126px;
  top: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-green);
  border: 2px solid var(--bg-primary);
  z-index: 1;
}

.tl-content {
  margin-left: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px 20px;
}

.tl-content h3 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 3px;
}

.tl-content h5 {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 11px;
  color: var(--accent-green);
  font-weight: 400;
  margin-bottom: 8px;
}

.tl-content p {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.7;
}

.resume-subsection-title {
  font-size: 18px;
  color: var(--text-muted);
  margin-bottom: 28px;
  margin-top: 48px;
  font-family: 'Courier New', Consolas, monospace;
  font-weight: 400;
}

.resume-subsection-title::before {
  content: '// ';
  color: var(--accent-green);
}
```

- [ ] **Step 2: Verificar braces**

```bash
node -e "
const fs = require('fs');
const css = fs.readFileSync('assets/css/sections.css', 'utf8');
const o = (css.match(/{/g)||[]).length;
const c = (css.match(/}/g)||[]).length;
if(o!==c){console.error('MISMATCH:',o,'vs',c);process.exit(1);}
console.log('OK — braces:',o);
"
```

- [ ] **Step 3: Commit**

```bash
git add assets/css/sections.css
git commit -m "feat: add sections.css — about, skills, resume, certif, projects"
```

---

### Task 5: CSS — blog.css (terminal news feed)

**Files:**
- Create: `assets/css/blog.css`

- [ ] **Step 1: Crear assets/css/blog.css**

```css
/* ==============================================
   blog.css — Terminal News Feed
   ============================================== */

.blog-section {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

/* --- Ventana de terminal --- */
.terminal-window {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-subtle);
}

.terminal-titlebar {
  background: var(--bg-elevated);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border);
}

.t-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.terminal-title-text {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 12px;
  color: var(--text-muted);
  margin-left: 6px;
}

.terminal-title-text .t-date {
  color: var(--accent-green);
}

.terminal-body {
  background: var(--bg-primary);
}

.terminal-cmd-line {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 11px;
  color: var(--accent-green);
  padding: 10px 20px 8px;
  border-bottom: 1px solid var(--border);
}

.terminal-cmd-line .cmd-args {
  color: var(--text-faint);
}

/* --- Items de noticias --- */
.news-item {
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
  display: grid;
  grid-template-columns: 24px 1fr auto;
  gap: 14px;
  align-items: start;
  transition: background 0.15s;
}

.news-item:last-child {
  border-bottom: none;
}

.news-item:hover {
  background: var(--bg-secondary);
}

.news-index {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 11px;
  color: var(--accent-green);
  padding-top: 2px;
  min-width: 20px;
}

.news-body {}

.news-cat {
  display: inline-block;
  font-family: 'Courier New', Consolas, monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 2px 7px;
  border-radius: 3px;
  margin-bottom: 7px;
}

.news-cat.cat-cybersecurity {
  background: var(--red-bg);
  color: var(--accent-red);
  border: 1px solid var(--red-border);
}

.news-cat.cat-devops {
  background: var(--blue-bg);
  color: var(--accent-blue);
  border: 1px solid var(--blue-border);
}

.news-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 7px;
}

.news-summary {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.65;
  margin-bottom: 8px;
}

.news-meta {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 11px;
  color: var(--text-faint);
}

.news-meta a {
  color: var(--accent-blue);
  text-decoration: none;
}

.news-meta a:hover {
  color: var(--accent-green);
}

.news-read-link {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 12px;
  color: var(--accent-green);
  text-decoration: none;
  white-space: nowrap;
  padding: 4px 10px;
  border: 1px solid var(--accent-green);
  border-radius: 4px;
  transition: background 0.15s;
  align-self: start;
  margin-top: 2px;
}

.news-read-link:hover {
  background: var(--green-bg);
  color: var(--accent-green);
}

/* --- Estado de error/carga --- */
.blog-fallback {
  padding: 32px 20px;
  text-align: center;
  font-family: 'Courier New', Consolas, monospace;
  font-size: 12px;
  color: var(--text-faint);
}

.blog-fallback .fallback-icon {
  font-size: 24px;
  margin-bottom: 8px;
  color: var(--accent-orange);
}

/* Responsive */
@media (max-width: 500px) {
  .news-item {
    grid-template-columns: 20px 1fr;
  }
  .news-read-link {
    display: none;
  }
  .news-title a {
    color: var(--accent-blue);
  }
}
```

- [ ] **Step 2: Verificar braces**

```bash
node -e "
const fs = require('fs');
const css = fs.readFileSync('assets/css/blog.css', 'utf8');
const o = (css.match(/{/g)||[]).length;
const c = (css.match(/}/g)||[]).length;
if(o!==c){console.error('MISMATCH:',o,'vs',c);process.exit(1);}
console.log('OK — braces:',o);
"
```

- [ ] **Step 3: Commit**

```bash
git add assets/css/blog.css
git commit -m "feat: add blog.css — terminal news feed styles"
```

---

### Task 6: CSS — theme.css (dark/light mode)

**Files:**
- Create: `assets/css/theme.css`

- [ ] **Step 1: Crear assets/css/theme.css**

```css
/* ==============================================
   theme.css — Dark / Light mode overrides
   Variables dark ya definidas en base.css como :root
   Aqui se sobreescriben para light mode
   ============================================== */

/* Light mode: sobreescribe las variables de :root */
body.light {
  --bg-primary:    #ffffff;
  --bg-secondary:  #f6f8fa;
  --bg-card:       #f6f8fa;
  --bg-elevated:   #eaeef2;
  --border:        #d0d7de;
  --border-subtle: #d0d7de;
  --text-primary:  #1f2328;
  --text-muted:    #636c76;
  --text-faint:    #8c959f;
  --accent-green:  #1a7f37;
  --accent-blue:   #0969da;
  --accent-orange: #bc4c00;
  --accent-red:    #cf222e;
  --green-bg:      rgba(26, 127, 55, 0.1);
  --green-border:  rgba(26, 127, 55, 0.3);
  --red-bg:        rgba(207, 34, 46, 0.1);
  --red-border:    rgba(207, 34, 46, 0.3);
  --blue-bg:       rgba(9, 105, 218, 0.1);
  --blue-border:   rgba(9, 105, 218, 0.3);
}

/* Ajustes especificos light que no cubren las variables */
body.light .site-nav {
  background: rgba(255, 255, 255, 0.95);
}

body.light .hero-section {
  background: var(--bg-secondary);
}

body.light .hero-section::before {
  background: radial-gradient(ellipse at 50% 65%, rgba(26, 127, 55, 0.05) 0%, transparent 70%);
}

body.light .terminal-body {
  background: #f0f3f6;
}

body.light .news-item:hover {
  background: #eaeef2;
}

body.light .tl-dot {
  border-color: var(--bg-primary);
}

body.light .btn-secondary-nf {
  color: var(--text-primary);
}

body.light .soft-card {
  background: var(--bg-primary);
}
```

- [ ] **Step 2: Verificar braces**

```bash
node -e "
const fs = require('fs');
const css = fs.readFileSync('assets/css/theme.css', 'utf8');
const o = (css.match(/{/g)||[]).length;
const c = (css.match(/}/g)||[]).length;
if(o!==c){console.error('MISMATCH:',o,'vs',c);process.exit(1);}
console.log('OK — braces:',o);
"
```

- [ ] **Step 3: Commit**

```bash
git add assets/css/theme.css
git commit -m "feat: add theme.css — dark/light mode CSS variable overrides"
```

---

### Task 7: JS — theme.js

**Files:**
- Create: `assets/js/theme.js`

- [ ] **Step 1: Crear assets/js/theme.js**

```javascript
// theme.js — Dark/Light toggle con persistencia en localStorage
(function () {
  'use strict';

  const STORAGE_KEY = 'nf-theme';
  const DARK_CLASS = 'dark';
  const LIGHT_CLASS = 'light';

  function applyTheme(theme) {
    const body = document.body;
    if (theme === 'light') {
      body.classList.remove(DARK_CLASS);
      body.classList.add(LIGHT_CLASS);
    } else {
      body.classList.remove(LIGHT_CLASS);
      body.classList.add(DARK_CLASS);
    }
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = theme === 'dark' ? '○' : '◑';
  }

  function getStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function saveTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  function getPreferredTheme() {
    const stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  }

  function toggleTheme() {
    const current = document.body.classList.contains('dark') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    saveTheme(next);
    applyTheme(next);
  }

  // Aplicar tema antes de que se pinte el DOM (evita flash)
  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.addEventListener('click', toggleTheme);
  });
})();
```

- [ ] **Step 2: Commit**

```bash
git add assets/js/theme.js
git commit -m "feat: add theme.js — dark/light toggle"
```

---

### Task 8: JS — lang.js (adaptado)

**Files:**
- Modify: `assets/js/lang.js`

- [ ] **Step 1: Reemplazar assets/js/lang.js**

```javascript
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
```

- [ ] **Step 2: Commit**

```bash
git add assets/js/lang.js
git commit -m "feat: update lang.js — adapt translations to refactored HTML"
```

---

### Task 9: JS — main.js

**Files:**
- Create: `assets/js/main.js`

- [ ] **Step 1: Crear assets/js/main.js**

```javascript
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
    const sections = document.querySelectorAll('section[id]');
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
```

- [ ] **Step 2: Agregar CSS de fade-in a base.css**

Agregar al final de `assets/css/base.css`:

```css
/* --- Fade-in animation --- */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 3: Commit**

```bash
git add assets/js/main.js assets/css/base.css
git commit -m "feat: add main.js — scroll, nav active, skill bars animation, contact obfuscation"
```

---

### Task 10: JS — blog.js

**Files:**
- Create: `assets/js/blog.js`

- [ ] **Step 1: Crear assets/js/blog.js**

```javascript
// blog.js — Fetch news.json y renderiza el feed de noticias
(function () {
  'use strict';

  const NEWS_JSON_PATH = 'assets/data/news.json';
  const MAX_STALE_HOURS = 48;

  function relativeTime(isoString) {
    const published = new Date(isoString);
    const now = new Date();
    const diffMs = now - published;
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffM = Math.floor(diffMs / (1000 * 60));

    if (diffM < 60) return 'hace ' + diffM + 'm';
    if (diffH < 24) return 'hace ' + diffH + 'h';
    const diffD = Math.floor(diffH / 24);
    return 'hace ' + diffD + 'd';
  }

  function isStale(generatedAt) {
    const generated = new Date(generatedAt);
    const now = new Date();
    const diffH = (now - generated) / (1000 * 60 * 60);
    return diffH > MAX_STALE_HOURS;
  }

  function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/Buenos_Aires'
    }) + ' ART';
  }

  function renderFallback(container, message) {
    container.innerHTML =
      '<div class="blog-fallback">' +
        '<div class="fallback-icon">⚠</div>' +
        '<p>' + message + '</p>' +
      '</div>';
  }

  function renderNews(data, container) {
    if (!data.items || data.items.length === 0) {
      renderFallback(container, 'Sin noticias disponibles por el momento.');
      return;
    }

    const dateStr = data.generated_at ? formatDate(data.generated_at) : '—';

    // Actualizar fecha en el titlebar
    const dateEl = document.querySelector('.t-date');
    if (dateEl) dateEl.textContent = dateStr;

    const html = data.items.map(function (item, i) {
      const catClass = item.category === 'cybersecurity' ? 'cat-cybersecurity' : 'cat-devops';
      const catLabel = item.category === 'cybersecurity' ? 'CYBERSECURITY' : 'DEVOPS';
      const index = String(i + 1).padStart(2, '0');
      const time = item.published_at ? relativeTime(item.published_at) : '';

      return (
        '<div class="news-item">' +
          '<div class="news-index">' + index + '</div>' +
          '<div class="news-body">' +
            '<span class="news-cat ' + catClass + '">' + catLabel + '</span>' +
            '<div class="news-title">' + escapeHtml(item.title) + '</div>' +
            '<div class="news-summary">' + escapeHtml(item.summary) + '</div>' +
            '<div class="news-meta">' +
              'via <a href="' + escapeAttr(item.source_url) + '" target="_blank" rel="noopener">' +
                escapeHtml(item.source) +
              '</a>' +
              (time ? ' &nbsp;·&nbsp; ' + time : '') +
            '</div>' +
          '</div>' +
          '<a href="' + escapeAttr(item.source_url) + '" target="_blank" rel="noopener" class="news-read-link">→ leer</a>' +
        '</div>'
      );
    }).join('');

    container.innerHTML = html;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    // Solo permite http/https URLs
    const s = String(str || '');
    if (!/^https?:\/\//i.test(s)) return '#';
    return s.replace(/"/g, '%22');
  }

  function init() {
    const container = document.getElementById('news-feed');
    if (!container) return;

    container.innerHTML = '<div class="blog-fallback"><p>Cargando noticias...</p></div>';

    fetch(NEWS_JSON_PATH)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (isStale(data.generated_at)) {
          renderFallback(container, 'Feed no disponible temporalmente. Volvé pronto.');
          return;
        }
        renderNews(data, container);
      })
      .catch(function () {
        renderFallback(container, 'Feed no disponible temporalmente. Volvé pronto.');
      });
  }

  document.addEventListener('DOMContentLoaded', init);

})();
```

- [ ] **Step 2: Commit**

```bash
git add assets/js/blog.js
git commit -m "feat: add blog.js — fetch news.json and render terminal news feed"
```

---

### Task 11: HTML — index.html (refactor completo)

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Reemplazar index.html con la version refactoreada**

Reemplazar el contenido completo de `index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Nestor Fleitas | DevOps & DevSecOps Consultant</title>
  <meta name="description" content="Nestor Fleitas, especialista en DevOps y DevSecOps, con experiencia en AWS, GCP, Docker, Kubernetes y automatizacion de infraestructuras seguras.">

  <!-- Security: Content Security Policy -->
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'self';
             script-src 'self' 'unsafe-inline' https://code.jquery.com https://cdn.jsdelivr.net;
             style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
             img-src 'self' data: https:;
             font-src 'self' https://fonts.gstatic.com data:;
             connect-src 'self';
             frame-ancestors 'self';
             object-src 'none';
             base-uri 'self';">

  <!-- Bootstrap 5 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
    crossorigin="anonymous">

  <!-- Font Awesome 4 (local) -->
  <link href="assets/css/font-awesome.min.css" rel="stylesheet">

  <!-- Google Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">

  <!-- Nuestros estilos (orden importa) -->
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/theme.css">
  <link rel="stylesheet" href="assets/css/layout.css">
  <link rel="stylesheet" href="assets/css/sections.css">
  <link rel="stylesheet" href="assets/css/blog.css">

  <!-- Favicon -->
  <link rel="shortcut icon" href="assets/images/ico/hack-icon-512x512.png">

  <!-- theme.js inline-first para evitar flash de tema incorrecto -->
  <script src="assets/js/theme.js"></script>
</head>

<body class="dark">

  <!-- Preloader -->
  <div id="tt-preloader">
    <div id="pre-status">nestor@fleitas:~$ <span id="pre-cursor">_</span></div>
  </div>

  <!-- NAV -->
  <nav class="site-nav">
    <div class="container">
      <a href="#home" class="nav-brand">
        <span class="nav-brand-path">~/</span>nestorfleitas.ar
      </a>

      <button id="nav-toggler" class="nav-toggler" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>

      <div class="nav-links">
        <a href="#home"   data-lang="nav-home"   class="active">home</a>
        <a href="#about"  data-lang="nav-about">about</a>
        <a href="#skills" data-lang="nav-skills">skills</a>
        <a href="#resume" data-lang="nav-resume">resume</a>
        <a href="#blog"   data-lang="nav-blog">blog</a>
      </div>

      <div class="nav-controls">
        <button class="nav-flag-btn" id="flag-es" aria-label="Español">
          <img src="assets/images/argentina-flag.png" alt="ES">
        </button>
        <button class="nav-flag-btn" id="flag-en" aria-label="English">
          <img src="assets/images/us-flag.png" alt="EN">
        </button>
        <button id="theme-toggle-btn" class="nav-theme-btn" aria-label="Cambiar tema">○</button>
      </div>
    </div>
  </nav>

  <!-- HERO -->
  <section id="home" class="hero-section">
    <div class="hero-prompt">
      <span class="prompt-user">nestor@fleitas</span>:~$
      <span class="prompt-cmd">whoami</span>
      <span class="cursor"></span>
    </div>
    <h1>DevOps &amp; <em>DevSecOps</em><br>Consultant</h1>
    <p class="hero-sub">
      Nestor Fleitas &nbsp;|&nbsp; Chubut, Argentina &nbsp;|&nbsp;
      <span class="hero-available" data-lang="hero-available">disponible</span>
    </p>
    <div class="hero-badges">
      <span class="hero-badge green">AWS</span>
      <span class="hero-badge green">GCP</span>
      <span class="hero-badge blue">Kubernetes</span>
      <span class="hero-badge blue">Docker</span>
      <span class="hero-badge orange">Terraform</span>
      <span class="hero-badge orange">DevSecOps</span>
      <span class="hero-badge">CI/CD</span>
      <span class="hero-badge">Wazuh</span>
    </div>
    <div class="hero-cta">
      <a href="#resume" class="btn-primary-nf">Ver Resume</a>
      <a href="assets/cv.pdf" class="btn-secondary-nf" download data-lang="btn-cv-es">Descargar CV</a>
    </div>
    <span class="scroll-indicator">▼ scroll</span>
  </section>

  <!-- ABOUT -->
  <section id="about" class="about-section section-padding">
    <div class="container">
      <p class="section-label">// about</p>
      <h2 class="section-title fade-in">Sobre <span>Mí</span></h2>
      <hr class="section-hr">

      <div class="about-grid">
        <div class="about-photo-col">
          <img src="assets/images/myphoto.jpg" alt="Nestor Fleitas" class="about-photo">
          <div class="about-meta">
            <div class="about-meta-row">Nombre <span>Nestor Fleitas</span></div>
            <div class="about-meta-row">Nac. <span>14/06/1985</span></div>
            <div class="about-meta-row">Ubicacion <span>Chubut, AR</span></div>
            <div class="about-meta-row">Nac. <span>Argentino</span></div>
            <div class="about-meta-row">Email <span id="email-inline"></span></div>
          </div>
          <a id="whatsapp-link" href="#" target="_blank" rel="noopener" class="about-wa-btn">
            📱 <span data-lang="btn-whatsapp">WhatsApp</span>
          </a>
        </div>

        <div class="about-text-col">
          <h4 data-lang="about-who-title">// quién soy</h4>
          <p data-lang="about-who-text">
            Especialista en DevOps y DevSecOps con amplia experiencia en automatización de infraestructura
            cloud (AWS, GCP), seguridad en el ciclo de vida del software (CI/CD) y gestión de contenedores
            (Docker, Kubernetes). Apasionado por implementar soluciones seguras y escalables.
          </p>

          <h4 data-lang="about-skills-title">// aptitudes</h4>
          <div class="tag-list">
            <span class="tag">DevSecOps</span>
            <span class="tag">Cloud Architect (AWS, GCP)</span>
            <span class="tag">CI/CD Automation</span>
            <span class="tag">Kubernetes &amp; Docker</span>
            <span class="tag">Terraform / AWS CDK</span>
            <span class="tag">English Intermediate</span>
          </div>

          <h4 data-lang="about-tools-title">// herramientas</h4>
          <div class="tag-list">
            <span class="tag">Docker</span>
            <span class="tag">Kubernetes</span>
            <span class="tag">Terraform</span>
            <span class="tag">Jenkins</span>
            <span class="tag">GitLab CI</span>
            <span class="tag">AWS</span>
            <span class="tag">GCP</span>
            <span class="tag">Wazuh</span>
            <span class="tag">Burp Suite</span>
            <span class="tag">SonarQube</span>
            <span class="tag">OAuth 2.0 / IAM</span>
            <span class="tag">Python</span>
            <span class="tag">Bash</span>
            <span class="tag">Linux</span>
          </div>

          <div class="about-actions">
            <a id="email-btn" href="#" class="btn-primary-nf">
              📧 <span data-lang="btn-email">Enviarme un mail</span>
            </a>
            <a href="assets/cv.pdf" class="btn-secondary-nf" download data-lang="btn-cv-es">Descargar CV</a>
            <a href="assets/cvIngles.pdf" class="btn-secondary-nf" download data-lang="btn-cv-en">Download Resume</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SKILLS -->
  <section id="skills" class="skills-section section-padding">
    <div class="container">
      <p class="section-label">// stack</p>
      <h2 class="section-title fade-in">Skills <span>&amp; Tools</span></h2>
      <hr class="section-hr">

      <div class="skills-grid">
        <div>
          <div class="skill-row fade-in">
            <div class="skill-name">Java <span class="skill-pct">75%</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="75"></div></div>
          </div>
          <div class="skill-row fade-in">
            <div class="skill-name">Cloud (AWS / GCP) <span class="skill-pct">80%</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="80"></div></div>
          </div>
          <div class="skill-row fade-in">
            <div class="skill-name">Linux <span class="skill-pct">80%</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="80"></div></div>
          </div>
          <div class="skill-row fade-in">
            <div class="skill-name">Git <span class="skill-pct">75%</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="75"></div></div>
          </div>
          <div class="skill-row fade-in">
            <div class="skill-name">Docker <span class="skill-pct">75%</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="75"></div></div>
          </div>
          <div class="skill-row fade-in">
            <div class="skill-name">Kubernetes <span class="skill-pct">60%</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="60"></div></div>
          </div>
          <div class="skill-row fade-in">
            <div class="skill-name">Terraform <span class="skill-pct">70%</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="70"></div></div>
          </div>
        </div>
        <div>
          <div class="skill-row fade-in">
            <div class="skill-name">Bash Scripting <span class="skill-pct">70%</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="70"></div></div>
          </div>
          <div class="skill-row fade-in">
            <div class="skill-name">Python <span class="skill-pct">55%</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="55"></div></div>
          </div>
          <div class="skill-row fade-in">
            <div class="skill-name">Jenkins / GitLab CI <span class="skill-pct">70%</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="70"></div></div>
          </div>
          <div class="skill-row fade-in">
            <div class="skill-name">Node.js <span class="skill-pct">55%</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="55"></div></div>
          </div>
          <div class="skill-row fade-in">
            <div class="skill-name">MySQL / MongoDB <span class="skill-pct">60%</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="60"></div></div>
          </div>
          <div class="skill-row fade-in">
            <div class="skill-name">SOA / OSB12c <span class="skill-pct">70%</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="70"></div></div>
          </div>
          <div class="skill-row fade-in">
            <div class="skill-name">HTML / CSS <span class="skill-pct">60%</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="60"></div></div>
          </div>
        </div>
      </div>

      <div class="soft-skills-grid">
        <div class="soft-card fade-in">
          <div class="soft-pct">75%</div>
          <div class="soft-label">Liderazgo</div>
        </div>
        <div class="soft-card fade-in">
          <div class="soft-pct">85%</div>
          <div class="soft-label">Comunicacion</div>
        </div>
        <div class="soft-card fade-in">
          <div class="soft-pct">75%</div>
          <div class="soft-label">Trabajo en Equipo</div>
        </div>
      </div>
    </div>
  </section>

  <!-- CERTIFICATIONS -->
  <section id="certifications" class="certifications-section section-padding">
    <div class="container">
      <p class="section-label">// credentials</p>
      <h2 class="section-title fade-in" data-lang="certif-title">Certificaciones</h2>
      <hr class="section-hr">
      <div class="cert-grid">
        <div class="cert-card fade-in">
          <h4>AWS Cloud Practitioner</h4>
          <span>Amazon Web Services</span>
        </div>
        <div class="cert-card fade-in">
          <h4>Cybersecurity Technician</h4>
          <span>Certificacion Tecnica</span>
        </div>
        <div class="cert-card fade-in">
          <h4>Certified DevSecOps Professional</h4>
          <span>DevSecOps Institute</span>
        </div>
      </div>
    </div>
  </section>

  <!-- PROJECTS -->
  <section id="projects" class="projects-section section-padding">
    <div class="container">
      <p class="section-label">// work</p>
      <h2 class="section-title fade-in" data-lang="projects-title">Proyectos Destacados</h2>
      <hr class="section-hr">
      <div class="projects-grid">
        <div class="project-card fade-in">
          <h3>Automatizacion CI/CD</h3>
          <p>Implementacion de pipelines de integracion continua utilizando Jenkins y GitLab CI para despliegue automatico en AWS.</p>
        </div>
        <div class="project-card fade-in">
          <h3>Infraestructura Segura en la Nube</h3>
          <p>Despliegue de microservicios seguros en AWS y Kubernetes, integrando practicas de DevSecOps y auditorias de seguridad.</p>
        </div>
        <div class="project-card fade-in">
          <h3>Monitorizacion con Wazuh</h3>
          <p>Implementacion de un SOC utilizando Wazuh para monitorear amenazas en infraestructuras locales y en la nube.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- RESUME -->
  <section id="resume" class="resume-section section-padding">
    <div class="container">
      <p class="section-label">// experience</p>
      <h2 class="section-title fade-in" data-lang="resume-title">Resume</h2>
      <hr class="section-hr">

      <p class="resume-subsection-title" data-lang="resume-exp">historia laboral</p>

      <div class="timeline">
        <div class="tl-item">
          <div class="tl-date"><span>OCT 2022<br>MAR 2024</span></div>
          <div class="tl-dot"></div>
          <div class="tl-content fade-in">
            <h3>CLARIN - AGEA</h3>
            <h5>Data &amp; Cloud Engineer</h5>
            <p>Integracion de GCP con Elastic Cloud; Pubsub, Dataflow, Airflow; Docker, Kubernetes; Desarrollo de conector Java; AWS EKS VPC ELB, CDK; implementacion de microservicios Node.</p>
          </div>
        </div>

        <div class="tl-item">
          <div class="tl-date"><span>MAY 2022<br>JUL 2022</span></div>
          <div class="tl-dot"></div>
          <div class="tl-content fade-in">
            <h3>Ingenia</h3>
            <h5>Technology Architect / DevSecOps</h5>
            <p>Creacion de pipelines con Ansible, Jenkins y Terraform. Kubernetes en GCP. Linux Red Hat, Nginx, Python scripting, balanceo de carga.</p>
          </div>
        </div>

        <div class="tl-item">
          <div class="tl-date"><span>JUL 2021<br>ABR 2022</span></div>
          <div class="tl-dot"></div>
          <div class="tl-content fade-in">
            <h3>FLUX IT</h3>
            <h5>DevOps Mobile</h5>
            <p>DevOps GCP, AWS, Azure. Docker, Jenkins, Azure DevOps para CI/CD de apps Android e iOS. Integracion con SonarQube, Browserstack.</p>
          </div>
        </div>

        <div class="tl-item">
          <div class="tl-date"><span>FEB 2020<br>JUN 2021</span></div>
          <div class="tl-dot"></div>
          <div class="tl-content fade-in">
            <h3>Equifax</h3>
            <h5>SRE - DevOps</h5>
            <p>Site Reliability Engineer. Docker, Ansible, Apache, Tomcat, Nagios, Linux Red Hat, Nginx, Jenkins, Terraform, Kubernetes en GCP.</p>
          </div>
        </div>

        <div class="tl-item">
          <div class="tl-date"><span>MAR 2018<br>2020</span></div>
          <div class="tl-dot"></div>
          <div class="tl-content fade-in">
            <h3>Telecom</h3>
            <h5>Java SOA Developer / Configuration Manager</h5>
            <p>Servicios SOA con OSB (Oracle), IBM DataPower. Jenkins, Stash, Maven. Administracion Linux, automatizacion bash, troubleshooting.</p>
          </div>
        </div>

        <div class="tl-item">
          <div class="tl-date"><span>OCT 2017<br>JUN 2018</span></div>
          <div class="tl-dot"></div>
          <div class="tl-content fade-in">
            <h3>HSBC</h3>
            <h5>Analista Desarrollador Java Sr Middleware</h5>
            <p>Analisis y desarrollo Java, integracion SOA con ESB IBM. IDE: RTC, IID. SoapUI. Cliente/Proyecto: HSBC - Equipo Middleware.</p>
          </div>
        </div>

        <div class="tl-item">
          <div class="tl-date"><span>OCT 2014<br>SEPT 2017</span></div>
          <div class="tl-dot"></div>
          <div class="tl-content fade-in">
            <h3>Banco Credicoop</h3>
            <h5>Analista Desarrollador Java Ssr — Arquitectura</h5>
            <p>Desarrollo Java, ESB IBM, Eclipse. Investigacion Open Source: CouchDB, Node.js, AngularJS, ELK Stack, Jenkins.</p>
          </div>
        </div>

        <div class="tl-item">
          <div class="tl-date"><span>AGO 2013<br>OCT 2014</span></div>
          <div class="tl-dot"></div>
          <div class="tl-content fade-in">
            <h3>Telefonica-Movistar</h3>
            <h5>Consultor Java SOA / OSB</h5>
            <p>Desarrollo SOA con Oracle Service Bus, JDeveloper, OEPE. WebLogic, Tomcat. Integracion mediante OSB, BPel, WebServices, Spring.</p>
          </div>
        </div>

        <div class="tl-item">
          <div class="tl-date"><span>JUL 2012<br>AGO 2013</span></div>
          <div class="tl-dot"></div>
          <div class="tl-content fade-in">
            <h3>Telefonica</h3>
            <h5>Consultor Java</h5>
            <p>Desarrollo Java, JSP, Android. Tomcat, WebLogic. Customizacion de apps de gestion de Redes: HDM, CSC, MDM. Metodologias Agiles Scrum.</p>
          </div>
        </div>

        <div class="tl-item">
          <div class="tl-date"><span>SEPT 2008<br>JUN 2009</span></div>
          <div class="tl-dot"></div>
          <div class="tl-content fade-in">
            <h3>Accenture S.A.</h3>
            <h5>Desarrollador Cobol</h5>
            <p>Programacion Cobol en entorno Mainframe, JCL, DB2. Diversos proyectos asignados en Rosario.</p>
          </div>
        </div>
      </div>

      <p class="resume-subsection-title" data-lang="resume-edu">formacion academica</p>

      <div class="timeline">
        <div class="tl-item">
          <div class="tl-date"><span>2013<br>Actualidad</span></div>
          <div class="tl-dot"></div>
          <div class="tl-content fade-in">
            <h3>Ingenieria Industrial</h3>
            <h5>U.T.N. — Facultad Regional Buenos Aires</h5>
            <p>Cursando 3er ano de la carrera.</p>
          </div>
        </div>
        <div class="tl-item">
          <div class="tl-date"><span>2002</span></div>
          <div class="tl-dot"></div>
          <div class="tl-content fade-in">
            <h3>Tecnico en Informatica</h3>
            <h5>E.E.T. N° 9 Ing. Torcuato Di Tella — Avellaneda</h5>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- BLOG / NEWS -->
  <section id="blog" class="blog-section section-padding">
    <div class="container">
      <p class="section-label">// automated daily feed</p>
      <h2 class="section-title fade-in">Security &amp; DevOps <span data-lang="blog-title">News</span></h2>
      <hr class="section-hr">

      <div class="terminal-window">
        <div class="terminal-titlebar">
          <div class="t-dot" style="background:#ff5f57"></div>
          <div class="t-dot" style="background:#febc2e"></div>
          <div class="t-dot" style="background:#28c840"></div>
          <span class="terminal-title-text">
            news.log &mdash; top 3 del dia &mdash;
            <span class="t-date">cargando...</span>
          </span>
        </div>
        <div class="terminal-body">
          <div class="terminal-cmd-line">
            $ <span class="cmd-args">cat assets/data/news.json | jq '.items[]'</span>
          </div>
          <div id="news-feed">
            <!-- blog.js renderiza aqui -->
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="site-footer">
    <div class="container">
      <p class="footer-prompt">
        <span class="fp-user">nestor@fleitas</span>:~$ echo "DevOps &amp; Security Specialist"
      </p>
      <p class="footer-output">DevOps &amp; Security Specialist &nbsp;·&nbsp; Chubut, Argentina</p>
      <nav class="footer-social">
        <a href="https://www.linkedin.com/in/ndf14685/" target="_blank" rel="noopener">linkedin</a>
        <a href="https://github.com/ndf14685" target="_blank" rel="noopener">github</a>
        <a href="https://www.instagram.com/nestorfleitas.ar/" target="_blank" rel="noopener">instagram</a>
        <a id="email-icon" href="#">email</a>
      </nav>
    </div>
  </footer>

  <!-- Scroll up -->
  <div class="scroll-up">
    <a href="#home" aria-label="Volver arriba"><i class="fa fa-angle-up"></i></a>
  </div>

  <!-- Scripts -->
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"
    integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
    crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
    crossorigin="anonymous"></script>

  <script src="assets/js/main.js"></script>
  <script src="assets/js/lang.js"></script>
  <script src="assets/js/blog.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verificar el HTML en el browser**

Abrir `index.html` con un servidor local:

```bash
# Desde la raiz del proyecto
npx serve . -l 3000
# o si tenes Python:
python -m http.server 3000
```

Abrir http://localhost:3000 y verificar el siguiente checklist:

```
[ ] Dark mode activo por defecto
[ ] Nav visible con brand ~/nestorfleitas.ar
[ ] Links del nav: home, about, skills, resume, blog
[ ] Hero muestra el prompt, titulo, badges y botones
[ ] About muestra foto, meta, tags, botones
[ ] Skills muestra barras que se animan al hacer scroll
[ ] Certifications muestra 3 cards
[ ] Projects muestra 3 cards
[ ] Resume muestra timeline con todas las empresas
[ ] Blog muestra el feed con 3 noticias del stub
[ ] Click "→ leer" abre nueva pestaña
[ ] Click theme-toggle-btn: cambia a light mode
[ ] Click banderas: cambia texto de secciones
[ ] Click logo o "home": scroll al inicio
[ ] En mobile (DevTools 375px): nav colapsa, hamburger visible
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: refactor index.html — terminal hacker aesthetic, all sections"
```

---

## PARTE B: Script de Noticias Automatizado

---

### Task 12: Script — package.json e instalacion de dependencias

**Files:**
- Create: `scripts/package.json`

- [ ] **Step 1: Crear scripts/package.json**

```json
{
  "name": "nestorfleitas-news-fetcher",
  "version": "1.0.0",
  "description": "Daily news fetcher for nestorfleitas.ar — RSS (cybersec) + NewsAPI (devops)",
  "type": "module",
  "scripts": {
    "fetch": "node fetch-news.js",
    "test": "node --test fetch-news.test.js"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "dotenv": "^16.4.0",
    "rss-parser": "^3.13.0"
  }
}
```

- [ ] **Step 2: Instalar dependencias**

```bash
cd scripts
npm install
```

Resultado esperado: directorio `scripts/node_modules/` creado, `scripts/package-lock.json` creado.

- [ ] **Step 3: Verificar instalacion**

```bash
node -e "import('rss-parser').then(m => console.log('rss-parser OK:', m.default.name))"
node -e "import('axios').then(m => console.log('axios OK:', typeof m.default))"
node -e "import('dotenv').then(m => console.log('dotenv OK:', typeof m.config))"
```

Resultado esperado: 3 lineas `OK`.

- [ ] **Step 4: Crear .env de desarrollo**

```bash
# En scripts/
cp .env.example .env
# Editar scripts/.env y agregar tu NEWS_API_KEY real de newsapi.org
```

- [ ] **Step 5: Commit**

```bash
cd ..  # volver a la raiz
git add scripts/package.json scripts/package-lock.json scripts/.env.example
git commit -m "chore: add scripts/package.json — rss-parser, axios, dotenv"
```

---

### Task 13: Script — fetch-news.test.js (tests primero)

**Files:**
- Create: `scripts/fetch-news.test.js`

- [ ] **Step 1: Escribir los tests (TDD — fallan hasta que implementemos el modulo)**

Crear `scripts/fetch-news.test.js`:

```javascript
// fetch-news.test.js — Tests con node:test (Node v18+, no requiere dependencias)
import { test } from 'node:test';
import assert from 'node:assert/strict';

// Importamos solo las funciones puras que vamos a testear
// (el modulo principal no debe tener side-effects al importar)
import {
  filterLast24h,
  selectTop3,
  truncateSummary,
  buildItem,
} from './fetch-news.js';

// --- filterLast24h ---

test('filterLast24h: incluye items de las ultimas 24h', function () {
  const now = new Date();
  const recent = new Date(now - 2 * 60 * 60 * 1000).toISOString(); // hace 2h
  const items = [{ pubDate: recent, title: 'Reciente' }];
  const result = filterLast24h(items);
  assert.equal(result.length, 1);
});

test('filterLast24h: excluye items de mas de 24h', function () {
  const old = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(); // hace 25h
  const items = [{ pubDate: old, title: 'Viejo' }];
  const result = filterLast24h(items);
  assert.equal(result.length, 0);
});

test('filterLast24h: maneja items sin pubDate', function () {
  const items = [{ title: 'Sin fecha' }];
  const result = filterLast24h(items);
  assert.equal(result.length, 0);
});

// --- truncateSummary ---

test('truncateSummary: no trunca textos cortos', function () {
  const text = 'Texto corto.';
  assert.equal(truncateSummary(text, 200), 'Texto corto.');
});

test('truncateSummary: trunca en limite de caracteres y agrega ...', function () {
  const text = 'A'.repeat(250);
  const result = truncateSummary(text, 200);
  assert.ok(result.length <= 203); // 200 + '...'
  assert.ok(result.endsWith('...'));
});

test('truncateSummary: maneja null/undefined', function () {
  assert.equal(truncateSummary(null, 200), '');
  assert.equal(truncateSummary(undefined, 200), '');
});

// --- selectTop3 ---

test('selectTop3: retorna exactamente 3 items', function () {
  const cybersec = [
    { category: 'cybersecurity', title: 'C1', pubDate: new Date().toISOString() },
    { category: 'cybersecurity', title: 'C2', pubDate: new Date().toISOString() },
  ];
  const devops = [
    { category: 'devops', title: 'D1', pubDate: new Date().toISOString() },
    { category: 'devops', title: 'D2', pubDate: new Date().toISOString() },
  ];
  const result = selectTop3(cybersec, devops);
  assert.equal(result.length, 3);
});

test('selectTop3: incluye minimo 1 cybersecurity y 1 devops', function () {
  const cybersec = [
    { category: 'cybersecurity', title: 'C1', pubDate: new Date().toISOString() },
    { category: 'cybersecurity', title: 'C2', pubDate: new Date().toISOString() },
    { category: 'cybersecurity', title: 'C3', pubDate: new Date().toISOString() },
  ];
  const devops = [
    { category: 'devops', title: 'D1', pubDate: new Date().toISOString() },
  ];
  const result = selectTop3(cybersec, devops);
  const cats = result.map(function (i) { return i.category; });
  assert.ok(cats.includes('cybersecurity'), 'debe incluir cybersecurity');
  assert.ok(cats.includes('devops'), 'debe incluir devops');
});

test('selectTop3: funciona si hay menos de 3 items en total', function () {
  const cybersec = [{ category: 'cybersecurity', title: 'C1', pubDate: new Date().toISOString() }];
  const devops = [];
  const result = selectTop3(cybersec, devops);
  assert.ok(result.length <= 3);
  assert.ok(result.length >= 1);
});

// --- buildItem ---

test('buildItem: retorna estructura correcta', function () {
  const raw = {
    title: 'Test Title',
    content: 'Test content text here.',
    link: 'https://example.com/article',
    pubDate: '2026-04-14T10:00:00Z',
    category: 'cybersecurity',
    source: 'Test Source',
  };
  const item = buildItem(raw, 1);
  assert.equal(item.id, 1);
  assert.equal(item.category, 'cybersecurity');
  assert.equal(item.title, 'Test Title');
  assert.ok(typeof item.summary === 'string');
  assert.equal(item.source, 'Test Source');
  assert.equal(item.source_url, 'https://example.com/article');
  assert.ok(typeof item.published_at === 'string');
});

test('buildItem: rechaza URLs no http/https', function () {
  const raw = {
    title: 'Bad URL',
    content: 'content',
    link: 'javascript:alert(1)',
    pubDate: new Date().toISOString(),
    category: 'devops',
    source: 'Src',
  };
  const item = buildItem(raw, 1);
  assert.equal(item.source_url, '#');
});
```

- [ ] **Step 2: Correr los tests — deben fallar (modulo no existe aun)**

```bash
cd scripts
node --test fetch-news.test.js 2>&1 | head -20
```

Resultado esperado: error de importacion `ERR_MODULE_NOT_FOUND` o similar. Correcto — es TDD.

- [ ] **Step 3: Commit de los tests**

```bash
cd ..
git add scripts/fetch-news.test.js
git commit -m "test: add fetch-news tests (TDD — failing until implementation)"
```

---

### Task 14: Script — fetch-news.js (implementacion)

**Files:**
- Create: `scripts/fetch-news.js`

- [ ] **Step 1: Crear scripts/fetch-news.js**

```javascript
// fetch-news.js — Daily news fetcher: RSS (cybersec) + NewsAPI (devops)
// Uso: node fetch-news.js
// Cron: 0 11 * * * cd /path/to/scripts && node fetch-news.js >> /var/log/fetch-news.log 2>&1

import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Cargar .env si existe
try {
  const { config } = await import('dotenv');
  config({ path: resolve(__dirname, '.env') });
} catch (_) {}

import RSSParser from 'rss-parser';
import axios from 'axios';

// --- Configuracion ---
const RSS_FEEDS = [
  { url: 'https://feeds.feedburner.com/TheHackersNews', source: 'The Hacker News' },
  { url: 'https://www.bleepingcomputer.com/feed/',     source: 'BleepingComputer' },
  { url: 'https://krebsonsecurity.com/feed/',          source: 'Krebs on Security' },
];

const NEWSAPI_URL   = 'https://newsapi.org/v2/everything';
const NEWSAPI_KEY   = process.env.NEWS_API_KEY || '';
const NEWSAPI_QUERY = 'devops OR kubernetes OR terraform OR "CI/CD" OR "gitlab" OR "jenkins"';
const MAX_CHARS     = 220;
const OUTPUT_PATH   = resolve(__dirname, process.env.NEWS_JSON_PATH || '../assets/data/news.json');

// --- Funciones puras (exportadas para tests) ---

export function filterLast24h(items) {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  return items.filter(function (item) {
    if (!item.pubDate) return false;
    const d = new Date(item.pubDate);
    return !isNaN(d.getTime()) && d.getTime() >= cutoff;
  });
}

export function truncateSummary(text, maxLen) {
  if (!text) return '';
  // Eliminar HTML tags
  const clean = String(text).replace(/<[^>]+>/g, '').trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen).trimEnd() + '...';
}

export function selectTop3(cybersecItems, devopsItems) {
  // Garantizar minimo 1 de cada categoria, el tercero el mas reciente
  const result = [];

  if (cybersecItems.length > 0) result.push(cybersecItems[0]);
  if (devopsItems.length > 0)   result.push(devopsItems[0]);

  // Tercer item: el mas reciente de cualquier categoria (que no este ya incluido)
  const remaining = [
    ...cybersecItems.slice(1),
    ...devopsItems.slice(1),
  ].sort(function (a, b) {
    return new Date(b.pubDate || 0) - new Date(a.pubDate || 0);
  });

  if (result.length < 3 && remaining.length > 0) {
    result.push(remaining[0]);
  }

  return result.slice(0, 3);
}

export function buildItem(raw, id) {
  const url = String(raw.link || '');
  const safeUrl = /^https?:\/\//i.test(url) ? url : '#';

  return {
    id:           id,
    category:     raw.category || 'cybersecurity',
    title:        String(raw.title || '').trim(),
    summary:      truncateSummary(raw.content || raw.contentSnippet || raw.description || '', MAX_CHARS),
    source:       String(raw.source || '').trim(),
    source_url:   safeUrl,
    published_at: raw.pubDate ? new Date(raw.pubDate).toISOString() : new Date().toISOString(),
  };
}

// --- Funciones de fetch (no exportadas, tienen side effects de red) ---

async function fetchRSSFeeds() {
  const parser = new RSSParser({ timeout: 10000 });
  const allItems = [];

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      const items = (parsed.items || []).map(function (item) {
        return Object.assign({}, item, {
          category: 'cybersecurity',
          source: feed.source,
        });
      });
      allItems.push(...items);
      console.log('[RSS] ' + feed.source + ': ' + items.length + ' items');
    } catch (err) {
      console.error('[RSS] Error fetching ' + feed.source + ':', err.message);
    }
  }

  return filterLast24h(allItems);
}

async function fetchNewsAPI() {
  if (!NEWSAPI_KEY) {
    console.warn('[NewsAPI] NEWS_API_KEY no configurado — saltando');
    return [];
  }

  try {
    const from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const res = await axios.get(NEWSAPI_URL, {
      params: {
        q:        NEWSAPI_QUERY,
        from:     from,
        sortBy:   'publishedAt',
        language: 'en',
        pageSize: 10,
        apiKey:   NEWSAPI_KEY,
      },
      timeout: 10000,
    });

    const articles = (res.data.articles || []).map(function (a) {
      return {
        title:           a.title,
        content:         a.description,
        contentSnippet:  a.description,
        link:            a.url,
        pubDate:         a.publishedAt,
        category:        'devops',
        source:          (a.source && a.source.name) ? a.source.name : 'NewsAPI',
      };
    });

    console.log('[NewsAPI] ' + articles.length + ' articles');
    return filterLast24h(articles);
  } catch (err) {
    console.error('[NewsAPI] Error:', err.message);
    return [];
  }
}

// --- Main ---

async function main() {
  console.log('[fetch-news] Iniciando — ' + new Date().toISOString());

  const [cybersecItems, devopsItems] = await Promise.all([
    fetchRSSFeeds(),
    fetchNewsAPI(),
  ]);

  console.log('[fetch-news] Cybersec items last 24h: ' + cybersecItems.length);
  console.log('[fetch-news] DevOps items last 24h:   ' + devopsItems.length);

  const selected = selectTop3(cybersecItems, devopsItems);

  if (selected.length === 0) {
    console.warn('[fetch-news] Sin noticias disponibles — no se actualiza news.json');
    process.exit(0);
  }

  const output = {
    generated_at: new Date().toISOString(),
    items: selected.map(function (item, i) {
      return buildItem(item, i + 1);
    }),
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');
  console.log('[fetch-news] Escrito: ' + OUTPUT_PATH);
  console.log('[fetch-news] Items: ' + output.items.map(function(i){ return i.category + ' — ' + i.title.slice(0,50); }).join(' | '));
}

// Ejecutar solo si es el entry point (no cuando se importa en tests)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(function (err) {
    console.error('[fetch-news] Error fatal:', err);
    process.exit(1);
  });
}
```

- [ ] **Step 2: Correr los tests — deben pasar**

```bash
cd scripts
node --test fetch-news.test.js
```

Resultado esperado: todos los tests en verde, sin failures.

```
▶ filterLast24h: incluye items de las ultimas 24h
✓ filterLast24h: incluye items de las ultimas 24h (Xms)
...
ℹ tests 9
ℹ pass 9
ℹ fail 0
```

- [ ] **Step 3: Test de ejecucion real (requiere NEWS_API_KEY en .env)**

```bash
# Con la key configurada en scripts/.env:
node fetch-news.js
```

Resultado esperado:
```
[fetch-news] Iniciando — 2026-04-14T...
[RSS] The Hacker News: X items
[RSS] BleepingComputer: X items
[RSS] Krebs on Security: X items
[NewsAPI] X articles
[fetch-news] Escrito: .../assets/data/news.json
[fetch-news] Items: cybersecurity — ... | devops — ... | ...
```

Verificar que `assets/data/news.json` se actualizo con fechas reales.

- [ ] **Step 4: Verificar que el browser muestra las noticias reales**

Abrir http://localhost:3000 → seccion blog → debe mostrar las 3 noticias reales con timestamps reales.

- [ ] **Step 5: Commit**

```bash
cd ..
git add scripts/fetch-news.js
git commit -m "feat: add fetch-news.js — RSS + NewsAPI daily news automation with tests passing"
```

---

### Task 15: Configuracion Cron en VPS (Handoff)

**Files:** ninguno en el repo — configuracion en el servidor.

> **NOTA PARA HANDOFF A rig3060:**  
> Esta tarea se ejecuta en el VPS del usuario (hostname: rig3060) donde tiene Claude y Node v22 instalados.
> Llevar el contenido de este bloque al Claude del servidor.

```
=== HANDOFF: nestorfleitas.ar — configuracion cron ===

REPO: nestorfleitas.ar (clonar o git pull en el VPS)
NODE: v22.22.2 (ya instalado)

PASOS:
1. Ir al directorio del repo en el VPS
2. cd scripts && npm install
3. cp .env.example .env
4. Editar .env: agregar NEWS_API_KEY (obtener en https://newsapi.org/register — plan free)
5. Editar .env: ajustar NEWS_JSON_PATH a la ruta absoluta correcta del repo
   Ejemplo: NEWS_JSON_PATH=/home/ndf14/nestorfleitas.ar/assets/data/news.json
6. Test manual: node fetch-news.js (verificar output y que news.json se actualiza)
7. Configurar cron:

   crontab -e

   Agregar esta linea (8AM hora Argentina = 11:00 UTC):
   0 11 * * * cd /home/ndf14/nestorfleitas.ar/scripts && node fetch-news.js >> /var/log/fetch-news.log 2>&1

8. Crear el archivo de log:
   sudo touch /var/log/fetch-news.log && sudo chown ndf14:ndf14 /var/log/fetch-news.log

9. Verificar al dia siguiente:
   tail -50 /var/log/fetch-news.log

SPEC: docs/superpowers/specs/2026-04-14-portfolio-refactor-design.md
=== FIN HANDOFF ===
```

- [ ] **Step 1: Verificar en el VPS que el script corre manualmente**

```bash
cd /path/to/nestorfleitas.ar/scripts
node fetch-news.js
```

- [ ] **Step 2: Configurar cron**

```bash
crontab -e
# Agregar: 0 11 * * * cd /path/to/nestorfleitas.ar/scripts && node fetch-news.js >> /var/log/fetch-news.log 2>&1
```

- [ ] **Step 3: Crear archivo de log con permisos correctos**

```bash
sudo touch /var/log/fetch-news.log
sudo chown $USER:$USER /var/log/fetch-news.log
```

- [ ] **Step 4: Commit final**

```bash
# En la maquina de desarrollo — sin cambios de codigo
git add docs/superpowers/plans/2026-04-14-portfolio-refactor.md
git commit -m "docs: add implementation plan — portfolio refactor + news automation"
```

---

## Self-Review del Plan

### Cobertura del spec

| Requisito del spec | Tarea que lo implementa |
|---|---|
| Estetica Terminal/Hacker Pro | Tasks 2-6 (CSS), Task 11 (HTML) |
| Nav sticky con backdrop-filter | Task 3 (layout.css) |
| Hero con prompt de terminal | Task 11 (index.html) |
| About con foto + metadata + tags | Tasks 4, 11 |
| Skills con barras animadas al scroll | Tasks 4, 9 (IntersectionObserver) |
| Certifications cards | Tasks 4, 11 |
| Projects cards | Tasks 4, 11 |
| Resume timeline | Tasks 4, 11 |
| Blog terminal feed con 3 noticias | Tasks 5, 10, 11 |
| Footer prompt terminal | Tasks 3, 11 |
| Dark/Light toggle + localStorage | Tasks 6, 7 |
| i18n ES/EN | Task 8 |
| Email + WhatsApp obfuscados | Task 9 (main.js) |
| Responsive mobile | Tasks 2-5 (media queries) |
| RSS feeds cybersec | Task 14 |
| NewsAPI devops | Task 14 |
| news.json estructura definida | Tasks 1 (stub), 14 |
| blog.js fetch + render + fallback | Task 10 |
| Timestamp relativo ("hace Xh") | Task 10 |
| "→ leer" en nueva pestaña | Tasks 10, 11 |
| Filtrado ultimas 24h | Task 13 (test), Task 14 |
| selectTop3 min 1 de cada cat. | Task 13 (test), Task 14 |
| .env para NEWS_API_KEY | Tasks 12, 14 |
| Cron diario 8AM ART | Task 15 |
| Handoff para VPS (rig3060) | Task 15 |
| .gitignore (.env, node_modules) | Task 1 |
| Secciones eliminadas del template | Task 11 (no aparecen en index.html) |

**Gaps:** Ninguno detectado.

### Tipo-consistencia

- `skill-fill` con `data-width` — definido en sections.css (Task 4) y leido en main.js (Task 9). Consistente.
- `#news-feed` — definido en index.html (Task 11) y consultado en blog.js (Task 10). Consistente.
- `#theme-toggle-btn` — definido en index.html (Task 11) y consultado en theme.js (Task 7). Consistente.
- `#flag-es` / `#flag-en` — definidos en index.html (Task 11) y consultados en lang.js (Task 8). Consistente.
- `filterLast24h`, `selectTop3`, `truncateSummary`, `buildItem` — exportados en fetch-news.js (Task 14) e importados en fetch-news.test.js (Task 13). Consistente.
