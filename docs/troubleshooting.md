# Problemas comunes

Este documento recopila problemas frecuentes en Lucy-WEB, sus causas probables y pasos de solución.

## Indice

- [Problemas comunes](#problemas-comunes)
  - [Indice](#indice)
  - [Entorno y arranque](#entorno-y-arranque)
    - [No inicia Vite](#no-inicia-vite)
    - [Variables env no aplican](#variables-env-no-aplican)
    - [Comandos de limpieza fallan en Windows](#comandos-de-limpieza-fallan-en-windows)
  - [API y red](#api-y-red)
    - [Error de CORS en peticiones](#error-de-cors-en-peticiones)
    - [404 o 500 desde backend](#404-o-500-desde-backend)
    - [Error CSRF en peticiones con sesión](#error-csrf-en-peticiones-con-sesión)
  - [Autenticación Discord](#autenticación-discord)
    - [Callback no autentica](#callback-no-autentica)
    - [Bot invite abre mal](#bot-invite-abre-mal)
    - [Login funciona pero sesión no persiste](#login-funciona-pero-sesión-no-persiste)
  - [Docker y despliegue](#docker-y-despliegue)
    - [Build de Docker falla por variables VITE](#build-de-docker-falla-por-variables-vite)
    - [Contenedor levanta pero la web no responde](#contenedor-levanta-pero-la-web-no-responde)
    - [Rutas internas devuelven 404 tras recargar](#rutas-internas-devuelven-404-tras-recargar)
  - [CI/CD y workflows](#cicd-y-workflows)
    - [Falla quality.yaml en CI y no en local](#falla-qualityyaml-en-ci-y-no-en-local)
    - [Deploy no ocurre después de build](#deploy-no-ocurre-después-de-build)
    - [Rollback falla con image\_tag](#rollback-falla-con-image_tag)
  - [Build y pruebas](#build-y-pruebas)
    - [Falla TypeScript en build](#falla-typescript-en-build)
    - [Tests inestables](#tests-inestables)
  - [Escalación recomendada](#escalación-recomendada)

## Entorno y arranque

### No inicia Vite

Puede deberse a dependencias incompletas o version de Node incompatible.

**Solución:**
1. Verifica version de Node (`node -v`).
2. Reinstala dependencias:
   ```sh
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Inicia de nuevo:
   ```sh
   npm run dev
   ```

### Variables env no aplican

En Vite solo se exponen variables que empiezan por `VITE_`.

**Solución:**
1. Asegura nombres con prefijo `VITE_`.
2. Verifica archivo `.env` en la raíz del proyecto.
3. Reinicia el servidor de desarrollo después de cambiar variables.

### Comandos de limpieza fallan en Windows

El comando `rm -rf` no funciona en PowerShell por defecto.

**Solución:**
1. En PowerShell usa:
  ```powershell
  Remove-Item -Recurse -Force node_modules
  Remove-Item -Force package-lock.json
  npm install
  ```
2. Alternativamente usa Git Bash para comandos tipo Unix.

## API y red

### Error de CORS en peticiones

El frontend alcanza la API, pero el navegador bloquea la respuesta por política CORS.

**Solución:**
1. Verifica que `VITE_API_URL` apunte a la API correcta.
2. Configura CORS en backend para permitir el origen del frontend.
3. Confirma protocolo correcto (`http` vs `https`).

### 404 o 500 desde backend

Normalmente ocurre por ruta invalida o backend caido.

**Solución:**
1. Verifica conectividad con endpoint de salud de la API.
2. Revisa logs del backend.
3. Valida que las rutas usadas por `src/services/lucy.ts` coincidan con las del backend.

### Error CSRF en peticiones con sesión

El cliente HTTP usa cookies y token CSRF (`withCredentials`, `withXSRFToken`, `X-CSRFToken`). Si backend o dominio no están bien configurados, las peticiones mutables pueden fallar con `403`.

**Solución:**
1. Verifica que el backend este enviando la cookie `csrftoken`.
2. Asegura que frontend y backend usen el esquema correcto (`http`/`https`) y dominios permitidos.
3. Confirma configuración CORS/CSRF del backend para el origen del frontend.
4. Revisa en Network que se envié header `X-CSRFToken` en `POST`, `PATCH`, `PUT` o `DELETE`.

## Autenticación Discord

### Callback no autentica

Si `/auth/callback` no termina en dashboard, la sesión no se estableció correctamente.

**Solución:**
1. Verifica configuración OAuth en backend y Discord Developer Portal.
2. Asegura que la cookie/sesión se este creando en backend.
3. Revisa peticiones a `auth/discord/` y `discord/me/`.

### Bot invite abre mal

El enlace de invitación puede fallar por `client_id`, `permissions` o `scopes` inválidos.

**Solución:**
1. Verifica `VITE_DISCORD_BOT_CLIENT_ID`.
2. Revisa `VITE_DISCORD_BOT_PERMISSIONS` (bitmask).
3. Revisa `VITE_DISCORD_BOT_SCOPES` (coma separada en `.env`).

### Login funciona pero sesión no persiste

Puede ocurrir cuando el callback autentica en backend, pero el navegador no guarda o no reenvía cookies de sesión.

**Solución:**
1. Verifica atributos de cookie en backend (`Secure`, `SameSite`, dominio).
2. Si frontend y backend están en dominios distintos, valida configuración para third-party cookies según tu arquitectura.
3. Comprueba en navegador que tras callback exista cookie de sesión y que luego se envié en `discord/me/`.

## Docker y despliegue

### Build de Docker falla por variables VITE

El `Dockerfile` usa `ARG` para variables de build. Si no se pasan correctamente o con nombre incorrecto, la build puede quedar mal configurada.

**Solución:**
1. Construye imagen pasando `--build-arg` requeridos.
2. Revisa compatibilidad de nombres entre Docker, CI y `src/constants/config.ts`.
3. En caso de cambios recientes de nombres (`VITE_DISCORD_CLIENT_ID` vs `VITE_DISCORD_BOT_CLIENT_ID`), unifica convención en código y pipelines.

### Contenedor levanta pero la web no responde

Suele deberse a mapeo de puertos incorrecto o firewall.

**Solución:**
1. Verifica que el contenedor expone y sirve en `5173`.
2. Ejecuta contenedor con `-p 5173:5173`.
3. Revisa logs:
  ```sh
  docker logs -f lucy_web_app
  ```

### Rutas internas devuelven 404 tras recargar

En SPAs, el servidor debe redirigir rutas internas al `index.html`.

**Solución:**
1. Si usas `serve -s dist`, confirma que ese comando sea el que corre en contenedor.
2. Si usas Nginx/Proxy externo, agrega fallback de rutas al `index.html`.

## CI/CD y workflows

### Falla quality.yaml en CI y no en local

Puede ser diferencia de version de Node o dependencia no instalada desde lockfile.

**Solución:**
1. Ejecuta localmente con Node 24.
2. Borra `node_modules` y reinstala usando lockfile.
3. Corre la misma secuencia que CI:
  ```sh
  npm ci
  npm run lint
  npm run test
  npm run build
  ```

### Deploy no ocurre después de build

`deploy.yml` depende de la conclusion exitosa de `Push Docker Image`.

**Solución:**
1. Verifica que `build_image.yml` haya terminado en success.
2. Revisa que no falten `secrets`/`vars` para SSH y Docker.
3. Si necesitas, dispara `deploy.yml` manualmente (`workflow_dispatch`).

### Rollback falla con image_tag

El workflow valida que `image_tag` no este vacio ni sea `latest`.

**Solución:**
1. Usa un tag fijo valido (ejemplo `26.04.03-12`).
2. Verifica que ese tag exista en el registro Docker.
3. Si no existe, usa un tag estable anterior disponible.

## Build y pruebas

### Falla TypeScript en build

El comando `npm run build` ejecuta `tsc -b` antes de Vite.

**Solución:**
1. Corrige errores de tipado reportados por TypeScript.
2. Si hay cambios estructurales, revisa tipos en `src/types/`.

### Tests inestables

Puede ocurrir por estado compartido o mocks incompletos.

**Solución:**
1. Verifica setup global en `src/tests/setup.ts`.
2. Asegura limpieza de mocks entre tests.
3. Ejecuta pruebas en modo no watch para resultado consistente:
   ```sh
   npm run test
   ```

## Escalación recomendada

Si un incidente no se resuelve con este documento:

1. Captura evidencia minima (error exacto, request/response, logs relevantes).
2. Documenta ambiente (local, CI o VPS) y version desplegada.
3. Abre issue interno con pasos de reproducción.
4. Vincula cambios recientes de frontend, backend y pipeline para acotar causa raíz.
