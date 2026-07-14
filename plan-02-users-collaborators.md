# Módulo 2: Usuarios y Colaboradores

## Propósito

Gestionar los usuarios de la plataforma, tanto del lado ACME (personal interno) como del lado cliente (contactos). Un colaborador es un usuario que puede ejecutar trabajo asignado.

## Principios

- Todo usuario tiene credenciales de acceso.
- Un usuario ACME puede tener roles de administrador, project manager, owner o colaborador.
- Un usuario cliente está vinculado a una entidad y puede crear/seguir tickets.
- Un colaborador es un usuario ACME habilitado para recibir asignaciones de trabajo.

## Modelo de Datos — User

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | Identificador único. |
| organization_side | ENUM | `acme` o `client`. |
| entity_id | UUID (FK) | Requerido para usuarios cliente; referencia a Entity. |
| full_name | VARCHAR | Nombre completo. |
| email | VARCHAR | Email de login/contacto (único). |
| phone | VARCHAR | Teléfono (opcional). |
| role | ENUM[] | Uno o más roles de plataforma. |
| employment_status | ENUM | `active`, `inactive`, `suspended`. |
| is_primary_contact | BOOLEAN | Indicador de contacto principal (solo para usuarios cliente). |
| created_at | TIMESTAMP | Fecha de creación. |
| updated_at | TIMESTAMP | Fecha de última actualización. |

## Roles del Sistema

| Rol | Lado | Descripción |
|---|---|---|
| ACME Administrator | acme | Gestión completa de la plataforma. |
| Project Manager | acme | Coordinación diaria de proyectos. |
| Owner | acme | Responsable de negocio/aprobaciones. |
| ACME Collaborator | acme | Ejecuta trabajo, registra horas. |
| Client Requester | client | Crea tickets, aporta información. |
| Client Approver | client | Valida trabajo completado (opcional). |

## Funcionalidades

1. **CRUD de Usuarios** — Alta, edición, suspensión y desactivación.
2. **Asignación de roles** — Un usuario puede tener múltiples roles.
3. **Vinculación a entidad** — Usuarios cliente asociados a su empresa.
4. **Directorio de colaboradores** — Lista de personal ACME disponible para asignaciones.
5. **Gestión de acceso** — Control de permisos basado en roles.

## Reglas de Negocio

- Un usuario cliente debe tener `entity_id` obligatorio.
- El email debe ser único en toda la plataforma.
- No se puede eliminar un usuario con asignaciones activas; solo suspender/desactivar.
- Cada entidad cliente debe tener al menos un contacto primario (`is_primary_contact = true`).
