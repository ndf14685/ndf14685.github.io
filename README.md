# nestorfleitas.ar
Codigo de Pagina que sera posteada como CV.
Tecnologias utilizadas: Js - Bootstrap - Jquery - CSS3 - HTML - PHP


---

## Actualizacion de Noticias

El blog muestra 3 noticias de las últimas 48h (mínimo 1 de ciberseguridad y 1 de DevOps) obtenidas de:

- **Ciberseguridad** — RSS de The Hacker News, BleepingComputer y Krebs on Security
- **DevOps** — NewsAPI con terminos: `devops`, `kubernetes`, `terraform`, `CI/CD`, `gitlab`, `jenkins`

El resultado se guarda en `assets/data/news.json` y el sitio lo consume desde ahi.

### Automatico (GitHub Actions)

El workflow `.github/workflows/daily-news.yml` se ejecuta todos los dias a las 11:00 UTC.
Si `news.json` cambia, hace commit y push automaticamente con el mensaje `chore: daily news update [skip ci]`.

Tambien se puede disparar manualmente desde la UI de GitHub Actions en la pestaña **Actions > Daily News Update > Run workflow**.

### Ejecucion manual local

Requisitos: Node.js 22+

```bash
cd scripts
npm install         # solo la primera vez
node fetch-news.js
```

Para habilitar noticias de DevOps via NewsAPI, crear el archivo `scripts/.env`:

```
NEWS_API_KEY=tu_clave_aqui
```

Sin esa clave el script igual funciona, pero solo trae noticias de ciberseguridad via RSS (sin costo ni registro).

La clave de NewsAPI en produccion esta configurada como secret `NEWS_API_KEY` en el repositorio de GitHub.

## Novedades IA

La pagina `https://www.nestorfleitas.ar/novedades/` consume
`assets/data/ai-novedades.json`, generado por `scripts/fetch-ai-news.js`.

El radar combina:

- RSS oficiales y fuentes fuertes de IA: OpenAI, Google AI, Google Developers,
  The Decoder y VentureBeat AI.
- Releases de GitHub para herramientas como `openai/codex`,
  `google-gemini/gemini-cli` y repos DeepSeek.
- NewsAPI opcional para capturar novedades sin RSS de Claude, ChatGPT,
  Codex, Gemini, DeepSeek, agentes, MCP, voz, latencia e inferencia.

Cada item se puntua contra el stack real: OpenClaw, Claude, Codex,
ChatGPT/OpenAI, Gemini, DeepSeek e infraestructura de agentes. El blog muestra
el score y por que podria beneficiar la infraestructura.

### Automatico

El workflow `.github/workflows/ai-novedades.yml` corre:

- 06:00 ART
- 14:00 ART
- 20:00 ART

A las 09:00 ART vuelve a refrescar el feed y envia un resumen por Telegram si
hay novedades relevantes.

Secrets/variables usados:

- `NEWS_API_KEY` para busqueda profunda opcional.
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` y opcional `TELEGRAM_TOPIC_ID` para
  el digest.
- variable `AI_RELEASE_REPOS` para sumar repos propios o privados a monitorear,
  separados por coma.

### Ejecucion manual

```bash
cd scripts
npm install
npm run fetch:ai
npm run send:ai-digest
```
