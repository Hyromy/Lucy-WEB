# Lucy WEB

Cliente frontend para el proyecto [Lucy](https://github.com/Hyromy/Lucy).

![React](https://img.shields.io/badge/React-149ECA?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

## Inicio rapido

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

3. Crear archivo de entorno:
	```sh
	cp .env.example .env
	```

	En Windows PowerShell:
	```powershell
	Copy-Item .env.example .env
	```

4. Ejecutar en desarrollo:
	```sh
	npm run dev
	```

5. Abrir la URL mostrada por Vite (por defecto `http://localhost:5173`).

## Scripts disponibles

- `npm run dev`: inicia servidor de desarrollo.
- `npm run build`: compila TypeScript y genera build de producción.
- `npm run preview`: sirve build local para validación.
- `npm run lint`: analiza calidad de código con ESLint.
- `npm run test`: ejecuta pruebas con Vitest.

## Variables de entorno

La configuración del frontend usa variables `VITE_*`.

Revisa [docs/virtual-env.md](./docs/virtual-env.md).

## Documentacion adicional

- [Manual de desarrollador](./docs/onboarding.md)
- [Manual de operaciones](./docs/runbook.md)
- [Problemas comunes](./docs/troubleshooting.md)
- [Variables de entorno](./docs/virtual-env.md)
