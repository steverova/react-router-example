# React Router + Base UI + Drizzle ORM

Stack: React Router v7, TypeScript, Base UI, TailwindCSS v4, Drizzle ORM, SQLite/MySQL.

## Requisitos

- Node.js 20+
- pnpm

## Instalación

```bash
pnpm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Requerido
SESSION_SECRET=una-clave-secreta-de-al-menos-16-chars

# Base de datos (por defecto SQLite)
DB_DRIVER=sqlite
SQLITE_PATH=./local.db

# MySQL (solo si DB_DRIVER=mysql)
# DB_DRIVER=mysql
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=secret
# DB_NAME=mydb

# Email (opcional)
# EMAIL_HOST=smtp.example.com
# EMAIL_PORT=587
# EMAIL_USER=user@example.com
# EMAIL_PASS=password
# EMAIL_FROM=noreply@example.com
```

## Base de datos

### SQLite (por defecto)

**Desarrollo** — aplica el schema directamente sin migraciones:

```bash
pnpm db:push:sqlite
```

**Producción** — genera y aplica migraciones:

```bash
pnpm db:generate:sqlite
pnpm db:migrate:sqlite
```

Poblar con usuario inicial:

```bash
pnpm db:seed
```

Credenciales del usuario seed:
- Email: `admin@admin.com`
- Password: `password123`

### MySQL

**Desarrollo:**

```bash
pnpm db:push:mysql
pnpm db:seed
```

**Producción:**

```bash
pnpm db:generate:mysql
pnpm db:migrate:mysql
pnpm db:seed
```

> `db:push` — aplica cambios directamente al schema, ideal para desarrollo rápido.
> `db:generate` + `db:migrate` — genera archivos de migración versionados, recomendado para producción.

## Desarrollo

```bash
pnpm dev
```

La app corre en [http://localhost:3000](http://localhost:3000).

## Producción

```bash
pnpm build
pnpm start
```

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Servidor de desarrollo con HMR |
| `pnpm build` | Build de producción |
| `pnpm start` | Servidor de producción |
| `pnpm typecheck` | Verificación de tipos TypeScript |
| `pnpm format` | Formatear código con Prettier |
| `pnpm db:push:sqlite` | Aplicar schema a SQLite |
| `pnpm db:push:mysql` | Aplicar schema a MySQL |
| `pnpm db:studio` | Abrir Drizzle Studio (SQLite) |
| `pnpm db:seed` | Crear usuario admin inicial |

## Estructura del proyecto

```
app/
├── components/
│   ├── blocks/layout/     # Layout principal con sidebar
│   ├── providers/         # Alert dialog, theme
│   ├── shared/            # DataTable, tabs
│   └── ui/                # Componentes Base UI (button, input, etc.)
├── features/
│   └── user/
│       ├── actions/       # create, edit, delete (rutas independientes)
│       ├── ui/            # user-page, user-form, loader
│       ├── user.repository.ts
│       ├── user.service.ts
│       └── user.schema.ts
├── db/
│   ├── schema/sqlite/     # Schema Drizzle para SQLite
│   └── schema/mysql/      # Schema Drizzle para MySQL
├── routes.ts              # Configuración de rutas
└── root.tsx
```

## Agregar componentes UI

```bash
npx shadcn@latest add button
```

Los componentes se colocan en `app/components/ui/`.

```tsx
import { Button } from "~/components/ui/button"
```

## Convenciones

### Action routes

Las mutaciones se manejan como rutas independientes bajo `{feature}/actions/{intent}`:

```
POST /users/actions/create
POST /users/actions/edit
POST /users/actions/delete
```

Cada archivo exporta solo `action`. El `fetcher` apunta directamente a la URL:

```ts
fetcher.submit(data, { method: "post", action: "/users/actions/create" })
```

### shouldRevalidate

El layout tiene `shouldRevalidate = () => false` para evitar revalidaciones innecesarias de la sesión después de cada mutación.
