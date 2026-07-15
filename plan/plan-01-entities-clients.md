# Módulo 1: Entidades y Clientes

## Propósito

Gestionar las empresas y personas que son clientes de ACME. Una entidad puede ser una persona jurídica (empresa) o una persona física.

## Principios

- ACME es el proveedor de servicios; cada entidad es un cliente de ACME.
- Una entidad puede tener múltiples contactos/usuarios asociados.
- La entidad es la unidad base para proyectos, tickets y facturación.

## Modelo de Datos — Entity

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | Identificador único. |
| entity_type | ENUM | `legal_entity` o `person`. |
| legal_name | VARCHAR | Nombre registrado; obligatorio para personas jurídicas. |
| trade_name | VARCHAR | Nombre comercial (opcional). |
| tax_id | VARCHAR | Identificación fiscal/legal. |
| country | VARCHAR | País de operación. |
| state_province | VARCHAR | Región administrativa (opcional). |
| city | VARCHAR | Ciudad (opcional). |
| address | TEXT | Dirección física/facturación. |
| postal_code | VARCHAR | Código postal. |
| email | VARCHAR | Email de contacto principal. |
| phone | VARCHAR | Teléfono de contacto principal. |
| status | ENUM | `active` o `inactive`. |
| created_at | TIMESTAMP | Fecha de creación. |
| updated_at | TIMESTAMP | Fecha de última actualización. |

## Funcionalidades

1. **CRUD de Entidades** — Crear, leer, actualizar y desactivar entidades cliente.
2. **Búsqueda y filtrado** — Por nombre, tipo, estado, país.
3. **Detalle de entidad** — Vista con proyectos asociados, contactos y tickets.
4. **Validación de duplicados** — Verificar tax_id único por país.

## Reglas de Negocio

- No se puede eliminar una entidad con proyectos activos; solo desactivar.
- El campo `legal_name` es obligatorio si `entity_type = legal_entity`.
- El `tax_id` debe ser único dentro del mismo país.
