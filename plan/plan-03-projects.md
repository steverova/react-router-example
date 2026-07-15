# Módulo 3: Proyectos

## Propósito

Gestionar las iniciativas de prestación de servicios que ACME ejecuta para sus clientes. Cada proyecto pertenece a una entidad cliente y tiene un responsable de coordinación (Project Manager) y un responsable de negocio (Owner).

## Principios

- Un proyecto siempre está vinculado a una entidad cliente.
- El Project Manager coordina el trabajo diario.
- El Owner es responsable de decisiones de negocio y aprobaciones clave.
- Un proyecto puede tener un presupuesto de horas opcional.

## Modelo de Datos — Project

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | Identificador único. |
| client_entity_id | UUID (FK) | Entidad cliente que recibe el servicio. |
| name | VARCHAR | Nombre del proyecto. |
| description | TEXT | Alcance y objetivos. |
| project_manager_id | UUID (FK) | Usuario ACME responsable de coordinación. |
| owner_id | UUID (FK) | Responsable de negocio/aprobaciones. |
| status | ENUM | `draft`, `active`, `on_hold`, `completed`, `cancelled`, `archived`. |
| start_date | DATE | Fecha de inicio planeada/real. |
| target_end_date | DATE | Fecha de fin planeada. |
| hours_budget | DECIMAL | Presupuesto de horas (opcional). |
| created_at | TIMESTAMP | Fecha de creación. |
| updated_at | TIMESTAMP | Fecha de última actualización. |

## Tabla auxiliar — Project Owners (si se requieren múltiples owners)

| Campo | Tipo | Notas |
|---|---|---|
| project_id | UUID (FK) | Referencia al proyecto. |
| user_id | UUID (FK) | Usuario owner. |
| role_label | VARCHAR | Etiqueta opcional (ej. "Business Owner", "Technical Owner"). |

## Ciclo de Vida (Estados)

```
draft → active → on_hold → active → completed → archived
                                   → cancelled → archived
```

## Funcionalidades

1. **CRUD de Proyectos** — Crear, editar, cambiar estado, archivar.
2. **Asignación de PM y Owner** — Vincular responsables al proyecto.
3. **Dashboard de proyecto** — Resumen de actividades, tickets, horas consumidas vs presupuesto.
4. **Filtrado** — Por cliente, estado, PM, fechas.
5. **Historial de cambios** — Log de cambios de estado y ediciones.

## Reglas de Negocio

- Un proyecto no puede pasar a `active` sin un PM asignado.
- Solo un ACME Administrator o el Owner pueden cancelar un proyecto.
- El presupuesto de horas es informativo; el sistema alerta cuando se supera el 80% y 100%.
- Un proyecto `completed` o `cancelled` no puede recibir nuevas actividades ni tickets.
