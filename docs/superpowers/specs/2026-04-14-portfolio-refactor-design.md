# Design Spec: Portfolio Refactor + Automated News Blog

**Date:** 2026-04-14  
**Project:** nestorfleitas.ar  
**Author:** Nestor Fleitas (brainstormed with Claude)

---

## Overview

Refactor completo del portfolio/CV personal de Nestor Fleitas, con mejora de UI/UX aplicando la estetica "Terminal/Hacker Pro" y agregado de una seccion de blog con noticias automatizadas diarias de DevOps/DevSecOps/Cybersecurity.

---

## Decisiones de Diseno

| Decision | Eleccion | Razon |
|---|---|---|
| Estetica visual | Terminal/Hacker Pro | On-brand para DevSecOps. GitHub dark palette, verde terminal, monospace. |
| Hosting | VPS propio | Node v22 disponible, cron viable |
| Fuentes de noticias Cybersecurity | RSS feeds | TheHackerNews, BleepingComputer, Krebs. Sin API key, gratuito. |
| Fuentes de noticias DevOps | NewsAPI.org | Keywords: `devops kubernetes terraform CI/CD`. Plan free 100 req/dia. |
| Runtime del script | Node.js v22 | Ya instalado en el VPS |
| Estructura | Archivos separados por responsabilidad | Sin build tool (Vite/webpack). HTML estatico deployable. |
| Prioridad | Resultado visual + blog funcional | Estructura limpia secundaria al resultado |

---

## Paleta de Colores

```
Background principal:  #010409  (GitHub dark max)
Background secciones:  #0d1117  (GitHub dark)
Borders / separadores: #21262d  #30363d
Texto principal:       #e6edf3
Texto secundario:      #8b949e
Verde terminal:        #3fb950  (acento primario)
Azul link:             #58a6ff
Naranja warning:       #ffa657
Rojo security:         #f85149
```

Fuente: `'Segoe UI', system-ui` para cuerpo. `monospace` para elementos de terminal (nav brand, labels, skill names, news metadata).

---

## Estructura de Archivos (nueva)

```
nestorfleitas.ar/
├── index.html                  ← refactoreado, todas las secciones
├── assets/
│   ├── css/
│   │   ├── base.css            ← reset, variables CSS, tipografia
│   │   ├── layout.css          ← nav, hero, footer, grid
│   │   ├── sections.css        ← about, skills, resume, certifications, projects
│   │   ├── blog.css            ← news feed estilo terminal
│   │   └── theme.css           ← dark/light mode vars y overrides
│   ├── js/
│   │   ├── main.js             ← init, scroll suave, sticky nav, preloader, WOW
│   │   ├── blog.js             ← fetch assets/data/news.json, render feed
│   │   ├── lang.js             ← i18n ES/EN (existente, adaptado)
│   │   └── theme.js            ← toggle dark/light con localStorage
│   ├── images/                 ← sin cambios
│   └── data/
│       └── news.json           ← generado por fetch-news.js (cron diario)
├── scripts/
│   ├── fetch-news.js           ← Node.js: RSS + NewsAPI → news.json
│   └── .env.example            ← plantilla de variables de entorno
├── docs/
│   └── superpowers/specs/
│       └── 2026-04-14-portfolio-refactor-design.md
└── .gitignore                  ← agregar: .env, node_modules/, .superpowers/
```

---

## Secciones del Sitio

### Secciones que se eliminan (template placeholder)

- Works (portfolio con imagenes placeholder)
- Facts (contadores con datos falsos: "651 Projects Done")
- Hire section (vacia)
- Blog placeholder del template original
- Video section (comentada, se elimina definitivamente)
- Contact form (comentado, se elimina — reemplazado por links directos)

### Secciones que se mantienen y mejoran

| Seccion | Cambios |
|---|---|
| **Nav** | Brand `~/nestorfleitas.ar` estilo terminal. Links en lowercase. Dark/light toggle y language switcher a la derecha. Sticky con backdrop-filter. |
| **Hero** | Prompt `nestor@fleitas:~$ whoami`. Titulo grande. Badges de tecnologias. CTAs: "Ver Resume" + "Descargar CV". Scroll indicator animado. |
| **About** | Foto con borde verde circular. Metadata en tabla monospace. Tags de skills y tools. Botones CV ES/EN + email + WhatsApp. |
| **Skills** | Barras de progreso con gradiente verde→azul. Tipografia monospace para nombres. Soft skills como cards con porcentaje. |
| **Certifications** | Cards simples con badge de certificacion. |
| **Projects** | Cards con border izquierdo verde. Descripcion breve. |
| **Resume** | Timeline rediseñada: linea vertical izquierda, cards oscuras por empresa. |
| **Blog/News** | Nueva seccion. Ventana de terminal con top 3 noticias del dia. |
| **Footer** | Prompt de terminal. Links sociales como botones monospace. |

---

## Blog de Noticias Automatizado

### Flujo de datos

```
RSS Feeds (Cybersecurity)          NewsAPI (DevOps)
├── thehackernews.com              keywords: devops kubernetes
├── bleepingcomputer.com                    terraform CI/CD
└── krebsonsecurity.com
         │                                    │
         └──────────────┬─────────────────────┘
                        ▼
               scripts/fetch-news.js
               (Node v22, cron 0 8 * * *)
                        │
                        ▼
              assets/data/news.json
              (top 3 noticias, max 1 por fuente)
                        │
                        ▼
              blog.js → render en index.html
```

### Estructura de news.json

```json
{
  "generated_at": "2026-04-14T08:00:00-03:00",
  "items": [
    {
      "id": 1,
      "category": "cybersecurity",
      "title": "Critical RCE in OpenSSH — Patch Immediately",
      "summary": "Resumen de 2-3 oraciones generado por el script...",
      "source": "The Hacker News",
      "source_url": "https://thehackernews.com/...",
      "published_at": "2026-04-14T06:00:00Z"
    }
  ]
}
```

### Script fetch-news.js — responsabilidades

1. Leer RSS feeds con `rss-parser` (npm)
2. Consultar NewsAPI con `axios` usando keywords DevOps
3. Filtrar noticias de las ultimas 24h
4. Seleccionar top 3: minimo 1 cybersecurity, minimo 1 devops, el tercero el mas reciente de cualquier categoria
5. Generar resumen: tomar los primeros 200 caracteres del `content` o `description` del feed
6. Escribir `assets/data/news.json`
7. Log de resultado a stdout (capturado por cron en `/var/log/fetch-news.log`)

### Dependencias Node (scripts/package.json)

```json
{
  "dependencies": {
    "rss-parser": "^3.13.0",
    "axios": "^1.6.0",
    "dotenv": "^16.0.0"
  }
}
```

### Variables de entorno (.env)

```
NEWS_API_KEY=<tu_key_de_newsapi.org>
NEWS_JSON_PATH=../assets/data/news.json
```

### Configuracion cron en VPS

```bash
# Ejecutar diariamente a las 8:00 AM hora Argentina (ART = UTC-3)
0 11 * * * cd /path/to/nestorfleitas.ar/scripts && node fetch-news.js >> /var/log/fetch-news.log 2>&1
```

---

## Comportamiento del Frontend (blog.js)

- Al cargar la pagina, hace `fetch('assets/data/news.json')`
- Si el fetch falla o el JSON tiene mas de 48h de antiguedad: muestra mensaje "Feed no disponible temporalmente"
- Renderiza las 3 noticias en el formato terminal definido en el mockup
- Badge de categoria: `CYBERSECURITY` (rojo) o `DEVOPS` (azul)
- Link "→ leer" abre la URL original en `_blank`
- Timestamp relativo ("hace 2h", "hace 5h")

---

## Dark / Light Mode

- Default: dark (body class `dark`)
- Toggle persiste en `localStorage` con key `theme`
- `theme.css` define variables CSS para ambos modos:
  - `--bg-primary`, `--bg-secondary`, `--text-primary`, `--text-muted`, `--border`, `--accent-green`, `--accent-blue`
- Light mode: fondo blanco/gris claro, texto oscuro, acentos verde y azul se mantienen

---

## i18n (ES / EN)

- `lang.js` existente se mantiene y adapta
- Atributo `data-lang` en elementos traducibles
- Switcher de bandera en nav (🇦🇷 / 🇺🇸)
- La seccion de blog muestra noticias en ingles (fuentes en EN), sin traduccion automatica

---

## Seguridad

- CSP header existente se mantiene y ajusta si se agregan nuevos dominios externos
- Email y WhatsApp siguen obfuscados en JS (patron existente)
- `NEWS_API_KEY` solo vive en `.env` del servidor, nunca en el frontend
- El frontend solo lee `news.json` estatico — sin endpoints expuestos
- `.env` en `.gitignore`

---

## Handoff para VPS (Claude en rig3060)

Cuando se implemente en el VPS, llevar este resumen:

```
CONTEXTO: nestorfleitas.ar — script de noticias automatizado
- Node v22 disponible
- Script: scripts/fetch-news.js
- Output: assets/data/news.json
- Fuentes cybersec: RSS de thehackernews, bleepingcomputer, krebsonsecurity
- Fuentes devops: NewsAPI (requiere NEWS_API_KEY en .env)
- Cron: 0 11 * * * (8AM ART = 11:00 UTC)
- Dependencias: rss-parser, axios, dotenv
- Ver spec completo: docs/superpowers/specs/2026-04-14-portfolio-refactor-design.md
```

---

## Lo que NO entra en scope

- Sistema de comentarios
- CMS o panel de admin
- Build tool (Vite, webpack) — el output es HTML estatico
- Backend propio para el news feed (solo script + JSON estatico)
- Traduccion automatica de noticias al español
- Analytics / tracking
