# Módulo 5: Tickets

## Propósito

Gestionar las solicitudes de servicio e incidencias que los usuarios cliente envían a ACME. Los tickets representan trabajo reactivo (a diferencia de las actividades que son trabajo planificado).

## Principios

- Un ticket es creado por un usuario cliente (Client Requester).
- ACME revisa, aprueba, asigna, ejecuta y cierra los tickets.
- Un ticket puede estar vinculado a un proyecto o ser independiente.
- Los usuarios cliente no ven detalles internos del workflow de ACME.

## Modelo de Datos — Ticket

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | Identificador único. |
| ticket_number | VARCHAR | Número secuencial legible (ej. TKT-0001). |
| client_entity_id | UUID (FK) | Entidad cliente que solicita. |
| project_id | UUID (FK) | Proyecto asociado (opcional). |
| created_by | UUID (FK) | Usuario cliente que creó el ticket. |
| assigned_to | UUID (FK) | Colaborador ACME asignado (opcional hasta asignación). |
| title | VARCHAR | Resumen del ticket. |
| description | TEXT | Descripción detallada del problema/solicitud. |
| category | ENUM | `incident`, `service_request`, `change_request`, `consultation`. |
| priority | ENUM | `low`, `medium`, `high`, `critical`. |
| status | ENUM | `open`, `under_review`, `approved`, `in_progress`, `pending_client`, `resolved`, `closed`, `rejected`. |
| resolution_notes | TEXT | Notas de resolución (al cerrar). |
| submitted_at | TIMESTAMP | Fecha de envío. |
| resolved_at | TIMESTAMP | Fecha de resolución. |
| closed_at | TIMESTAMP | Fecha de cierre. |
| created_at | TIMESTAMP | Fecha de creación. |
| updated_at | TIMESTAMP | Fecha de última actualización. |

## Ciclo de Vida (Estados)

```
open → under_review → approved → in_progress → pending_client → in_progress → resolved → closed
                    → rejected → closed
```

## Funcionalidades

1. **Creación de tickets** — Formulario para usuarios cliente con campos requeridos.
2. **Revisión y aprobación** — ACME revisa y decide si aprobar o rechazar.
3. **Asignación** — PM asigna un colaborador ACME al ticket.
4. **Seguimiento** — Historial de comentarios y cambios de estado.
5. **Vista cliente** — El cliente ve su ticket con estados simplificados (sin detalles internos).
6. **Vista ACME** — Detalle completo con asignaciones, horas y notas internas.
7. **Filtrado** — Por cliente, proyecto, estado, prioridad, asignado, fechas.
8. **Vinculación** — Relacionar ticket con actividades del proyecto.

## Reglas de Negocio

- Un usuario cliente solo puede ver tickets de su propia entidad.
- El `ticket_number` se genera automáticamente y es secuencial.
- Un ticket `rejected` debe incluir motivo de rechazo.
- Un ticket no puede cerrarse sin `resolution_notes`.
- Al resolver, se puede solicitar validación del cliente (`pending_client`).
- Si el cliente no responde en X días, el ticket se cierra automáticamente.
