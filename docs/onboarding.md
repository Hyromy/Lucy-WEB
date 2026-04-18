# Manual de desarrollador

Lucy-WEB es el cliente frontend del proyecto [Lucy](https://github.com/Hyromy/Lucy). Este manual proporciona la información necesaria para configurar, desarrollar, validar y desplegar el proyecto en entornos locales y seguros.

A modo de guía de inicio rápido, se recomienda consultar las secciones de [requerimientos](#requerimientos), [instalación](#instalacion) y [preparacion-y-ejecucion](#preparacion-y-ejecucion).

## Indice

- [Manual de desarrollador](#manual-de-desarrollador)
  - [Indice](#indice)
  - [Requerimientos](#requerimientos)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Variables de entorno](#variables-de-entorno)
  - [Instalación](#instalación)
    - [Dependencias](#dependencias)
    - [Configuración inicial](#configuración-inicial)
  - [Preparación y ejecución](#preparación-y-ejecución)
  - [Tests y revisiones](#tests-y-revisiones)
  - [Mantenimiento y correcciones](#mantenimiento-y-correcciones)
    - [Actualización de dependencias](#actualización-de-dependencias)
    - [Integración con backend](#integración-con-backend)
    - [Mantenimiento de tests](#mantenimiento-de-tests)
  - [Flujo colaborativo](#flujo-colaborativo)
    - [Ramas](#ramas)
    - [Pull requests](#pull-requests)
    - [Workflows](#workflows)

## Requerimientos

Para ejecutar y desarrollar Lucy-WEB se recomienda:

- Node.js 24.x
- Acceso a [Lucy-API](https://github.com/Hyromy/Lucy-API) en local o por red

> [!Warning]
> No se garantiza compatibilidad fuera de Node 24.x, ya que los workflows del proyecto usan esa version para CI.

## Estructura del proyecto

El proyecto sigue una estructura estándar de Vite + React + TypeScript. A continuación se detallan las carpetas y archivos relevantes.

- `src/`: Código fuente del frontend.
  - `assets/`: Recursos estáticos y estilos base.
  - `components/`: Componentes reutilizables de interfaz.
  - `contexts/`: Estado global (autenticación, idioma y tema).
  - `hooks/`: Hooks custom para lógica reutilizable.
  - `layouts/`: Layouts principales de la aplicación.
  - `pages/`: Vistas de rutas publicas y privadas.
  - `routes/`: Definición centralizada de rutas y módulos.
  - `services/`: Cliente HTTP y acceso a endpoints.
  - `tests/`: Suite de pruebas con Vitest + Testing Library.
  - `types/`: Tipado compartido de entidades y contratos.
- `docs/`: Documentación técnica y operativa.
- `.env.example`: Plantilla base para variables de entorno.

> [!Tip]
> Si necesitas anotar algo, puedes crear archivos `.md` auxiliares (por ejemplo con el sufijo `notes`).

## Variables de entorno

Lucy-WEB expone configuración al cliente mediante variables con prefijo `VITE_`.

Si el frontend arranca sin variables, puede renderizar parcialmente, pero funciones como autenticación, dashboard o invitación de bot pueden fallar por falta de configuración.

Consulta [variables de entorno](./virtual-env.md) para ver el detalle completo.

## Instalación

### Dependencias

1. Clonar repositorio:
  ```sh
  git clone https://github.com/Hyromy/Lucy-WEB.git    # https
  git clone git@github.com:Hyromy/Lucy-WEB.git        # ssh

  cd Lucy-WEB
  ```

2. Instalar dependencias:
  ```sh
  npm i
  ```

### Configuración inicial

1. Crear archivo local de entorno:
  ```sh
  cp .env.example .env
  ```

  En Windows PowerShell:
  ```powershell
  Copy-Item .env.example .env
  ```

2. Ajustar variables necesarias para conectar con backend.

## Preparación y ejecución

Con dependencias instaladas y `.env` configurado:

1. Iniciar servidor de desarrollo:
  ```sh
  npm run dev
  ```

2. Abrir la URL mostrada por Vite (por defecto `http://localhost:5173`).

3. Verificar conectividad con backend:
  - Revisar consola del navegador por errores.
  - Revisar peticiones de red en endpoints de auth y guilds.
  - Confirmar que el flujo de callback redirige correctamente al dashboard.

## Tests y revisiones

Para garantizar calidad y evitar regresiones funcionales, ejecutar:

```sh
npm run lint # Valida estilo y calidad de código
npm run test # Ejecuta pruebas unitarias/integración de UI
npm run build # valida tipos con TypeScript y genera el bundle final
```

## Mantenimiento y correcciones

A medida que el proyecto crece, es normal ajustar configuraciones, contratos y pruebas para mantener estabilidad.

### Actualización de dependencias

Cuando se actualicen paquetes:

1. Actualizar lockfile y dependencias.
2. Ejecutar `npm run lint`, `npm run test` y `npm run build`.
3. Validar manualmente flujos críticos de autenticación y dashboard.

### Integración con backend

Si el backend cambia endpoints o payloads:

1. Actualizar `src/services/` y `src/types/`.
2. Revisar efectos colaterales en hooks/contextos.
3. Probar rutas protegidas y callback de autenticación.

### Mantenimiento de tests

Los tests no son estáticos; deben evolucionar con los requerimientos.

Si se modifica una funcionalidad existente:

1. Ajustar tests afectados.
2. Agregar casos de borde cuando aplique.
3. Evitar mocks excesivos que oculten regresiones reales.

## Flujo colaborativo

Para mantener un flujo consistente entre colaboradores, se recomienda seguir estas pautas.

### Ramas

Existen dos ramas principales en el proyecto:

- `main`: rama de producción, integrada con pipelines de build/despliegue.
- `dev`: rama de integración previa, usada para validar cambios antes de `main`.

Las ramas de feature/fix son de formato libre, pero se recomienda crearlas desde `dev`.

### Pull requests

Recomendaciones para PR:

1. Las ramas deben comenzar en dev u otras sub-ramas.
2. La pull request debe de pasar todas las revisiones y tests para ser considerada a integración.
3. Si agregas funcionalidad adicional, debes definir los tests correspondientes. Estos deben de ser realistas, y con una cobertura de los casos de borde como mínimo.
4. En caso de alterar los tests existentes, justificar el motivo en el cuerpo de la pull request.

En caso contrario la pull request puede ser rechazada o detenerse indefinidamente hasta que todos los puntos anteriormente mencionados queden resueltos. También es posible crear PR's de una sub-rama a otra.

En caso de que la pull request sea aceptada, esta debe de ser eliminada del repositorio remoto.

La rama main únicamente recibe pull request de la rama `dev`.

### Workflows

El proyecto cuenta con workflows de GitHub Actions orientados a calidad y despliegue.

| Flujo | Descripcion | Trigger |
| - | - | - |
| `quality.yaml` | Ejecuta lint, tests y build check | PR a `main` o `dev`, reusable (`workflow_call`) |
| `build_image.yml` | Construye y publica imagen Docker | Push a `main`, manual |
| `deploy.yml` | Despliega imagen `latest` en VPS | Manual o exito de `Push Docker Image` |
| `deploy-by-tag.yml` | Despliega una imagen por tag especifico | Reusable (`workflow_call`) |
| `rollback.yml` | Revierte despliegue a un tag fijo | Manual |
