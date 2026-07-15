# Módulo 8: Repositorios y Documentación

## Propósito

Centralizar los enlaces a repositorios de código, documentación técnica y de negocio asociados a cada proyecto. Facilita el acceso rápido a recursos relevantes.

## Principios

- Cada proyecto puede tener múltiples repositorios y documentos vinculados.
- Los repositorios son enlaces externos (GitHub, GitLab, Bitbucket, etc.).
- La documentación puede ser enlaces externos o archivos adjuntos.
- El acceso a repositorios y documentos respeta los roles del usuario.

## Modelo de Datos — Repository

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | Identificador único. |
| project_id | UUID (FK) | Proyecto asociado. |
| name | VARCHAR | Nombre del repositorio. |
| url | VARCHAR | URL del repositorio. |
| provider | ENUM | `github`, `gitlab`, `bitbucket`, `azure_devops`, `other`. |
| description | TEXT | Descripción breve (opcional). |
| access_level | ENUM | `public`, `internal`, `restricted`. |
| created_at | TIMESTAMP | Fecha de creación. |
| updated_at | TIMESTAMP | Fecha de última actualización. |

## Modelo de Datos — Document

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | Identificador único. |
| project_id | UUID (FK) | Proyecto asociado. |
| title | VARCHAR | Título del documento. |
| doc_type | ENUM | `technical`, `business`, `meeting_notes`, `deliverable`, `other`. |
| url | VARCHAR | URL externa (opcional si es archivo adjunto). |
| file_path | VARCHAR | Ruta del archivo adjunto (opcional si es URL). |
| uploaded_by | UUID (FK) | Usuario que subió/creó el documento. |
| visibility | ENUM | `acme_only`, `client_visible`. |
| created_at | TIMESTAMP | Fecha de creación. |
| updated_at | TIMESTAMP | Fecha de última actualización. |

## Funcionalidades

1. **CRUD de Repositorios** — Agregar, editar y eliminar enlaces a repositorios.
2. **CRUD de Documentos** — Subir, vincular, editar y eliminar documentos.
3. **Categorización** — Filtrar por tipo de documento.
4. **Control de visibilidad** — Documentos internos ACME vs visibles para cliente.
5. **Búsqueda** — Buscar documentos por título o tipo dentro de un proyecto.
6. **Vista de proyecto** — Sección de recursos con repos y docs organizados.

## Reglas de Negocio

- Documentos con `visibility = acme_only` no son visibles para usuarios cliente.
- Al menos un campo entre `url` y `file_path` debe estar presente en un documento.
- Solo PM, Owner o Admin pueden eliminar repositorios o documentos.
- Los archivos adjuntos tienen un límite de tamaño configurable (ej. 50 MB).
