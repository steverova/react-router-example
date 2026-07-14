# Módulo 9: Aprobaciones, Notificaciones y Reportes

## Propósito

Gestionar los flujos de aprobación, el sistema de alertas/notificaciones y la generación de reportes y métricas de la plataforma.

## Principios

- Las aprobaciones controlan puntos clave del workflow (tickets, horas, entregables).
- Las notificaciones mantienen informados a los usuarios sobre eventos relevantes.
- Los reportes proporcionan visibilidad sobre productividad, cumplimiento y costos.

---

## 9.1 Aprobaciones

### Modelo de Datos — Approval

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | Identificador único. |
| approvable_type | ENUM | `ticket`, `time_entry`, `deliverable`, `project_closure`. |
| approvable_id | UUID | ID del recurso que requiere aprobación. |
| requested_by | UUID (FK) | Usuario que solicita la aprobación. |
| assigned_to | UUID (FK) | Usuario que debe aprobar. |
| status | ENUM | `pending`, `approved`, `rejected`, `escalated`. |
| decision_notes | TEXT | Comentarios del aprobador. |
| requested_at | TIMESTAMP | Fecha de solicitud. |
| decided_at | TIMESTAMP | Fecha de decisión. |
| created_at | TIMESTAMP | Fecha de creación. |
| updated_at | TIMESTAMP | Fecha de última actualización. |

### Funcionalidades

1. **Solicitud de aprobación** — Se genera automáticamente en puntos del workflow.
2. **Bandeja de aprobaciones** — Vista para aprobadores con pendientes.
3. **Aprobar/Rechazar** — Con comentarios obligatorios en rechazo.
4. **Escalamiento** — Si no se responde en X días, escalar a un superior.
5. **Historial** — Log completo de decisiones.

### Reglas de Negocio

- Un rechazo debe incluir `decision_notes`.
- Las aprobaciones pendientes más de 5 días generan recordatorio automático.
- Solo el usuario asignado (o un Admin) puede decidir sobre una aprobación.

---

## 9.2 Notificaciones

### Modelo de Datos — Notification

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | Identificador único. |
| user_id | UUID (FK) | Usuario destinatario. |
| type | ENUM | `assignment`, `status_change`, `approval_request`, `mention`, `deadline`, `alert`. |
| title | VARCHAR | Título breve. |
| message | TEXT | Contenido de la notificación. |
| reference_type | VARCHAR | Tipo del recurso relacionado (opcional). |
| reference_id | UUID | ID del recurso relacionado (opcional). |
| channel | ENUM | `in_app`, `email`, `both`. |
| read | BOOLEAN | Indica si fue leída. |
| read_at | TIMESTAMP | Fecha de lectura. |
| created_at | TIMESTAMP | Fecha de creación. |

### Eventos que generan notificaciones

| Evento | Destinatario |
|---|---|
| Nuevo ticket creado | PM del proyecto / Admin. |
| Ticket asignado | Colaborador asignado. |
| Cambio de estado de ticket | Creador del ticket (cliente). |
| Actividad asignada | Colaborador asignado. |
| Aprobación solicitada | Aprobador. |
| Horas rechazadas | Colaborador que registró. |
| Fecha límite próxima (48h) | Asignados a la actividad. |
| Presupuesto al 80%/100% | PM y Owner del proyecto. |

### Funcionalidades

1. **Centro de notificaciones** — Bandeja in-app con notificaciones leídas/no leídas.
2. **Email** — Notificaciones enviadas por correo según preferencias.
3. **Preferencias** — El usuario configura qué notificaciones recibir y por qué canal.
4. **Marcar como leída** — Individual o masiva.

---

## 9.3 Reportes

### Reportes Disponibles

| Reporte | Descripción |
|---|---|
| Horas por proyecto | Total de horas registradas vs presupuesto. |
| Horas por colaborador | Distribución de tiempo por persona y período. |
| Tickets por estado | Cantidad de tickets agrupados por estado actual. |
| Tiempo de resolución | Promedio de días entre apertura y cierre de tickets. |
| Actividades vencidas | Lista de actividades que superaron su fecha límite. |
| Productividad semanal | Horas facturables vs no facturables por semana. |
| Utilización de equipo | Porcentaje de horas asignadas vs capacidad. |

### Funcionalidades

1. **Dashboard general** — Métricas clave en la pantalla principal (solo ACME).
2. **Filtros** — Por período, proyecto, cliente, colaborador.
3. **Exportación** — CSV, Excel, PDF.
4. **Reportes de cliente** — Vista simplificada para usuarios cliente (solo sus proyectos).
5. **Programación** — Envío automático de reportes por email (semanal/mensual).

### Reglas de Negocio

- Los usuarios cliente solo acceden a reportes de sus propias entidades.
- Los reportes respetan los permisos de visibilidad de documentos y datos internos.
- Los datos de reportes tienen un retraso máximo de 1 hora (near real-time).
