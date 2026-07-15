# Módulo 7: Registro de Tiempo (Time Tracking)

## Propósito

Registrar las horas de trabajo de los colaboradores ACME contra actividades, tickets o directamente contra proyectos. Permite el seguimiento del esfuerzo real y la comparación con presupuestos y estimaciones.

## Principios

- Todo registro de tiempo pertenece a un colaborador.
- El tiempo puede registrarse contra una actividad, un ticket o un proyecto (trabajo general).
- Los registros son la base para reportes de productividad y facturación.
- Un registro puede requerir aprobación del PM.

## Modelo de Datos — TimeEntry

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | Identificador único. |
| user_id | UUID (FK) | Colaborador que registra el tiempo. |
| project_id | UUID (FK) | Proyecto asociado. |
| trackable_type | ENUM | `activity`, `ticket`, `project` (trabajo general). |
| trackable_id | UUID | ID de la actividad, ticket o proyecto. |
| date | DATE | Fecha del trabajo realizado. |
| hours | DECIMAL | Cantidad de horas (ej. 1.5). |
| description | TEXT | Descripción del trabajo realizado. |
| billable | BOOLEAN | Indica si es facturable al cliente. |
| approval_status | ENUM | `pending`, `approved`, `rejected`. |
| approved_by | UUID (FK) | Usuario que aprobó (opcional). |
| approved_at | TIMESTAMP | Fecha de aprobación. |
| created_at | TIMESTAMP | Fecha de creación. |
| updated_at | TIMESTAMP | Fecha de última actualización. |

## Funcionalidades

1. **Registro de horas** — Formulario para ingresar tiempo trabajado.
2. **Timer** — Cronómetro opcional para registro en tiempo real.
3. **Aprobación** — PM aprueba o rechaza registros de su equipo.
4. **Resumen diario/semanal** — Vista de horas por día y semana del colaborador.
5. **Reporte por proyecto** — Horas consumidas vs presupuesto.
6. **Reporte por colaborador** — Productividad y distribución de tiempo.
7. **Filtrado** — Por colaborador, proyecto, actividad/ticket, fecha, estado de aprobación.
8. **Exportación** — Exportar registros en CSV/Excel para facturación.

## Reglas de Negocio

- No se puede registrar más de 24 horas en un mismo día por colaborador.
- No se puede registrar tiempo en proyectos con estado `completed`, `cancelled` o `archived`.
- Los registros rechazados deben incluir motivo y pueden ser editados y reenviados.
- El campo `description` es obligatorio (mínimo 10 caracteres).
- Las horas deben ser positivas y en incrementos de 0.25 (15 minutos).
- Alertas automáticas cuando el proyecto alcanza 80% y 100% del presupuesto de horas.
