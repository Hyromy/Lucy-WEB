# Variables de entorno

Lucy-WEB utiliza variables de entorno con prefijo `VITE_` para configurar endpoints y parametros de Discord desde el frontend.

Para configurar estas variables:

1. Copia `.env.example` a `.env`.
2. Ajusta valores segun tu entorno.
3. Reinicia el servidor de desarrollo.

## Indice

- [Variables de entorno](#variables-de-entorno)
  - [Indice](#indice)
  - [API](#api)
    - [`VITE_API_URL`](#vite_api_url)
  - [Discord Bot](#discord-bot)
    - [`VITE_DISCORD_BOT_CLIENT_ID`](#vite_discord_bot_client_id)
    - [`VITE_DISCORD_BOT_PERMISSIONS`](#vite_discord_bot_permissions)
    - [`VITE_DISCORD_BOT_SCOPES`](#vite_discord_bot_scopes)

## API

### `VITE_API_URL`

URL base de la API de Lucy.

- Se usa para construir endpoints en `src/services/lucy.ts`.
- Se normaliza para terminar con `/` en `src/constants/config.ts`.

Ejemplos validos:

```env
VITE_API_URL=http://localhost:8000/
VITE_API_URL=https://api.lucy.com/
```

## Discord Bot

> [!Note]
> Puedes conseguir estas variables en el [Discord Developer Portal](https://discord.com/developers/applications)

### `VITE_DISCORD_BOT_CLIENT_ID`

Client ID de la aplicación de Discord usada para invitación del bot a servidores.

### `VITE_DISCORD_BOT_PERMISSIONS`

Permisos en formato bitmask para el enlace de invitación.

- Valor común: `8` (Administrator).

### `VITE_DISCORD_BOT_SCOPES`

Scopes requeridos para la invitación del bot.

- Se definen separados por coma en `.env`.
- El proyecto los transforma al formato URL (`%20`) internamente.

Ejemplo:

```env
VITE_DISCORD_BOT_SCOPES=bot, applications.commands
```
