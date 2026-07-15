# Módulo 6: Asignaciones

## Propósito

Gestionar la participación de colaboradores ACME en actividades y tickets. Una asignación vincula a un usuario con una unidad de trabajo específica.

## Principios

- Un colaborador puede estar asignado a múltiples actividades/tickets simultáneamente.
- Una actividad o ticket puede tener múltiples colaboradores asignados.
- Las asignaciones las gestiona el Project Manager o un Administrador.
- Se registra el rol del colaborador dentro de la asignación.

## Modelo de Datos — Assignment

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | Identificador único. |
| user_id | UUID (FK) | Colaborador ACME asignado. |
| assignable_type | ENUM | `activity` o `ticket`. |
| assignable_id | UUID | ID de la actividad o ticket. |
| role_in_assignment | ENUM | `lead`, `collaborator`, `reviewer`. |
| status | ENUM | `active`, `paused`, `completed`, `removed`. |
| assigned_by | UUID (FK) | Usuario que realizó la asignación. |
| assigned_at | TIMESTAMP | Fecha de asignación. |
| completed_at | TIMESTAMP | Fecha de finalización (opcional). |
| notes | TEXT | Notas sobre la asignación (opcional). |
| created_at | TIMESTAMP | Fecha de creación. |
| updated_at | TIMESTAMP | Fecha de última actualización. |

## Funcionalidades

1. **Asignar colaborador** — Vincular un usuario ACME a una actividad o ticket.
2. **Cambiar rol** — Modificar el rol dentro de la asignación.
3. **Reasignar** — Cambiar el colaborador asignado.
4. **Vista de carga** — Dashboard de carga de trabajo por colaborador.
5. **Historial** — Log de asignaciones pasadas y actuales.
6. **Filtrado** — Por colaborador, proyecto, tipo (actividad/ticket), estado.

## Reglas de Negocio

- Solo usuarios con `organization_side = acme` y `employment_status = active` pueden ser asignados.
- Cada actividad/ticket debe tener al menos un `lead` cuando está `in_progress`.
- Un colaborador `suspended` no puede recibir nuevas asignaciones.
- Al completar una asignación se registra automáticamente `completed_at`.
- La reasignación no elimina el registro anterior; cambia su estado a `removed`.
