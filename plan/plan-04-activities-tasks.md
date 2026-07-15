# Módulo 4: Actividades / Tareas

## Propósito

Gestionar el trabajo planificado dentro de un proyecto. Las actividades representan unidades de trabajo definidas por el equipo ACME que deben ejecutarse para cumplir los objetivos del proyecto.

## Principios

- Una actividad siempre pertenece a un proyecto.
- Las actividades son creadas por el Project Manager o un Administrador.
- Una actividad puede tener sub-tareas para desglose más fino.
- Las actividades y los tickets son conceptos separados pero pueden vincularse.

## Modelo de Datos — Activity

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | Identificador único. |
| project_id | UUID (FK) | Proyecto al que pertenece. |
| parent_activity_id | UUID (FK) | Actividad padre (para sub-tareas, opcional). |
| title | VARCHAR | Título descriptivo. |
| description | TEXT | Detalle del trabajo a realizar. |
| priority | ENUM | `low`, `medium`, `high`, `critical`. |
| status | ENUM | `pending`, `in_progress`, `blocked`, `completed`, `cancelled`. |
| estimated_hours | DECIMAL | Horas estimadas para completar. |
| start_date | DATE | Fecha de inicio planeada. |
| due_date | DATE | Fecha límite. |
| created_by | UUID (FK) | Usuario que creó la actividad. |
| created_at | TIMESTAMP | Fecha de creación. |
| updated_at | TIMESTAMP | Fecha de última actualización. |

## Relación Activity ↔ Ticket

| Campo | Tipo | Notas |
|---|---|---|
| activity_id | UUID (FK) | Actividad vinculada. |
| ticket_id | UUID (FK) | Ticket relacionado. |
| relation_type | ENUM | `resolves`, `related_to`, `blocked_by`. |

## Ciclo de Vida (Estados)

```
pending → in_progress → blocked → in_progress → completed
                                               → cancelled
```

## Funcionalidades

1. **CRUD de Actividades** — Crear, editar, cambiar estado, eliminar.
2. **Jerarquía** — Actividades padre/hijo para desglose de trabajo (WBS).
3. **Vinculación con tickets** — Relacionar actividades con tickets existentes.
4. **Tablero Kanban** — Vista de actividades por estado.
5. **Filtrado** — Por proyecto, prioridad, estado, asignado, fechas.
6. **Estimación vs real** — Comparar horas estimadas contra horas registradas.

## Reglas de Negocio

- Una actividad no puede crearse en un proyecto con estado `completed`, `cancelled` o `archived`.
- Cambiar a `completed` requiere que todas las sub-tareas estén completadas o canceladas.
- Una actividad `blocked` debe registrar un motivo/comentario.
- Solo el PM, Owner o Admin pueden cancelar actividades.
