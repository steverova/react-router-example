# Hours and Tickets RPA — Functional and Data Model Specification

## 1. Purpose

This document defines the initial functional model for a multi-company platform that manages projects, tasks, tickets, work assignments, and time tracking.

**ACME** is the service provider (base company). ACME delivers services to client entities such as **ABC**. A client can be either a legal entity (company) or an individual person.

The platform must allow client users to submit service tickets, while ACME reviews, approves, assigns, tracks, and closes the work.

## 2. Scope and Core Principles

- ACME is the base/service-provider company.
- A client entity belongs to ACME's customer portfolio.
- A client entity can be a company or an individual.
- A client company can have contacts/users who create and follow tickets.
- ACME users manage projects, activities, tickets, assignments, hours, and approvals.
- Client users do not automatically receive internal ACME workflow details.
- Tickets and planned activities are related but remain separate concepts.

## 3. Roles

| Role | Main responsibility |
|---|---|
| ACME Administrator | Manages entities, users, access, projects, and configuration. |
| Project Manager / Assignee | Runs the daily operation of a project; creates activities and assigns work. |
| Owner | Business/accountable owner. Approves important deliverables, milestones, or closure when required. |
| ACME Collaborator | Performs assigned work, updates status, records hours, and reports blockers. |
| Client Requester | Creates tickets for their entity, supplies information, and validates results when allowed. |
| Client Approver (optional) | Validates completed work on behalf of the client. |

> A Project Manager and an Owner can be different people. The manager coordinates work; the owner is accountable for outcome, business decisions, or approvals.

## 4. Main Modules

1. **Entities and Clients** — client companies and individual clients.
2. **Users and Collaborators** — ACME staff and client contacts.
3. **Projects** — service delivery initiatives for a client.
4. **Activities / Tasks** — planned work within a project.
5. **Tickets** — client service requests and incidents.
6. **Assignments** — collaborator participation in tasks or tickets.
7. **Time Tracking** — work logs against activities, tickets, or projects.
8. **Repositories and Documentation** — project links and technical/business documentation.
9. **Approvals, Notifications, and Reporting** — workflow control, alerts, and metrics.

## 5. Data Model

### 5.1 Entity (Client)

Represents a customer served by ACME. It may be a legal entity or a person.

| Field | Notes |
|---|---|
| id | Unique identifier. |
| entity_type | `legal_entity` or `person`. |
| legal_name | Registered name; required for legal entities. |
| trade_name | Optional commercial name. |
| tax_id | Tax/legal identification number. |
| country | Country of operation. |
| state_province | Optional administrative region. |
| city | Optional city. |
| address | Physical/billing address. |
| postal_code | Postal/ZIP code. |
| email | Main contact email. |
| phone | Main contact phone. |
| status | `active` or `inactive`. |
| created_at / updated_at | Audit fields. |

### 5.2 User and Collaborator

A user has login/access information. A collaborator is a user who can perform work. A client contact is a user associated with a client entity.

| Field | Notes |
|---|---|
| id | Unique identifier. |
| organization_side | `acme` or `client`. |
| entity_id | Required for client users; optional/not applicable for ACME users. |
| full_name | User name. |
| email | Login/contact email. |
| phone | Optional phone. |
| role | One or more platform roles. |
| employment_status | `active`, `inactive`, `suspended`. |
| is_primary_contact | Client-contact indicator. |

### 5.3 Project

A project is created by ACME for a client entity.

| Field | Notes |
|---|---|
| id | Unique identifier. |
| client_entity_id | Client receiving the service. |
| name | Project name, e.g., `Project A`. |
| description | Scope and objectives. |
| project_manager_id | ACME user responsible for daily coordination. |
| owner_id | Accountable owner; allow multiple owners through a relation table if needed. |
| status | `draft`, `active`, `on_hold`, `completed`, `cancelled`, `archived`. |
| start_date | Planned/actual start date. |
| target_end_date | Planned end date. |
| hours_budget | Optional hour budget/bag. |