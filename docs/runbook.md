# Manual de operaciones

El presente manual tiene como propósito guiar en la configuración, despliegue y mantenimiento del proyecto __Lucy-WEB__ en Docker para entornos de preproducción y producción.

## Indice

- [Manual de operaciones](#manual-de-operaciones)
  - [Indice](#indice)
  - [Requerimientos](#requerimientos)
  - [Inicio rápido](#inicio-rápido)
  - [Despliegue](#despliegue)
  - [Health check](#health-check)
  - [Automatizaciones](#automatizaciones)
  - [Mantenimiento](#mantenimiento)
    - [Monitoreo y logs](#monitoreo-y-logs)
    - [Actualización de la aplicación](#actualización-de-la-aplicación)
    - [Rollback manual](#rollback-manual)

## Requerimientos

Es necesario disponer de Docker instalado en el host donde se despliegue la aplicación, y preferentemente comunicación con [Lucy-API](https://github.com/Hyromy/Lucy-API) por medio de una red de docker.

Adicionalmente se recomienda:

- Imagen de docker para Node 24-alpine
- Backend de Lucy disponible en la URL definida para `VITE_API_URL`

Consulte [variables de entorno](./virtual-env.md) para mas información sobre la configuración del frontend.

## Inicio rápido

Para validar el flujo en local, se puede levantar el proyecto en desarrollo:

1. Instalar dependencias:
   ```sh
   npm i
   ```

2. Ejecutar entorno de desarrollo:
   ```sh
   npm run dev
   ```

3. Validar que la SPA cargue en `http://localhost:5173`.

## Despliegue

El proyecto incluye un `Dockerfile` multistage (build + runtime) y expone el puerto `5173`.

Para desplegar manualmente es necesario construir la imagen con los argumentos de build esperados.

```sh
# Linux / macOS
docker build -t lucy_web \
  --build-arg VITE_DISCORD_CLIENT_ID='YOUR_DISCORD_CLIENT_ID' \
  --build-arg VITE_DISCORD_REDIRECT_URI='https://your.frontend/auth/callback' \
  --build-arg VITE_API_URL='https://your.api/' \
  .

# Windows PowerShell
docker build -t lucy_web `
  --build-arg VITE_DISCORD_CLIENT_ID='YOUR_DISCORD_CLIENT_ID' `
  --build-arg VITE_DISCORD_REDIRECT_URI='https://your.frontend/auth/callback' `
  --build-arg VITE_API_URL='https://your.api/' `
  .
```

Posteriormente, crear el contenedor:

```sh
# Linux / macOS
docker run -d --name lucy_web_app \
  -p 5173:5173 \
  --restart unless-stopped \
  lucy_web

# Windows PowerShell
docker run -d --name lucy_web_app `
  -p 5173:5173 `
  --restart unless-stopped `
  lucy_web
```

## Health check

Al tratarse de una SPA, el health check principal es funcional y debe validar que la aplicación cargue y se conecte correctamente al backend.

Checklist recomendado:

1. La ruta raíz (`/`) carga sin errores en consola.
2. El flujo de autenticación retorna a `/auth/callback` y redirige al dashboard.
3. El dashboard renderiza servidores sin errores de red.
4. La navegación a gestión de servidor (`/guilds/:id/...`) responde correctamente.
5. No hay respuestas `4xx/5xx` inesperadas en peticiones al backend.

## Automatizaciones

El proyecto utiliza GitHub Actions para asegurar calidad y automatizar despliegues en VPS.

| Workflow | Propósito |
| :--- | :--- |
| **Calidad (`quality.yaml`)** | Ejecuta `npm run lint`, `npm run test` y `npm run build` para validar el código antes de integración. |
| **Build (`build_image.yml`)** | Construye la imagen Docker y publica tags (`latest` y tag versionado) en el registro. |
| **Deploy (`deploy.yml`)** | Despliega automáticamente `latest` en VPS cuando el build finaliza correctamente o por trigger manual. |
| **Deploy by Tag (`deploy-by-tag.yml`)** | Permite desplegar una version especifica mediante tag de imagen. |
| **Rollback (`rollback.yml`)** | Revierte a un tag fijo validado cuando hay incidentes en producción. |

## Mantenimiento

Para garantizar estabilidad del frontend en producción se recomienda aplicar estas pautas operativas.

### Monitoreo y logs

Revisar periódicamente logs del contenedor:

```sh
docker logs -f lucy_web_app
```

También se recomienda revisar en navegador:

- Consola JavaScript para errores de runtime.
- Pestaña Network para detectar latencias altas y respuestas `4xx/5xx`.

### Actualización de la aplicación

El flujo recomendado es mediante CI/CD. Si se requiere una actualización manual:

1. Obtener la nueva imagen (por `latest` o por tag).
2. Detener y eliminar el contenedor activo.
3. Levantar un nuevo contenedor con el mismo mapeo de puertos y politica de reinicio.
4. Validar health check funcional (ver sección [Health check](#health-check)).

Comandos de referencia:

```sh
docker pull <registry>/lucy_web:latest
docker stop lucy_web_app
docker rm lucy_web_app
docker run -d --name lucy_web_app -p 5173:5173 --restart unless-stopped <registry>/lucy_web:latest
```

### Rollback manual

Si no se puede ejecutar `rollback.yml`, el rollback se puede realizar manualmente con un tag estable.

```sh
docker pull <registry>/lucy_web:<tag_estable>
docker stop lucy_web_app
docker rm lucy_web_app
docker run -d --name lucy_web_app -p 5173:5173 --restart unless-stopped <registry>/lucy_web:<tag_estable>
```

Pasos recomendados para un rollback seguro:

1. Identificar el ultimo tag validado funcionalmente.
2. Detener y eliminar el contenedor actual.
3. Levantar el contenedor con el tag estable.
4. Validar login, callback y carga del dashboard.
5. Monitorear logs por al menos 2-3 minutos.

Para errores comunes y su resolución, consulte [troubleshooting.md](./troubleshooting.md).
