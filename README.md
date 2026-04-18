# nestorfleitas.ar
Codigo de Pagina que sera posteada como CV.
Tecnologias utilizadas: Js - Bootstrap - Jquery - CSS3 - HTML - PHP



TODO: 
	- Agregar desplegables en cada cartel de experiencia laboral y formacion academica LISTO
	- Detectar en navegador idioma original LISTO
	- Agregar extracto de codigo de cv viejo para medir visitas
	- Armar un cv en español y otro en ingles - LISTO
	- Agregar SEO - LISTO
	- Agregar experiencias vividas logros etcen cada trabajo que tuve

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
