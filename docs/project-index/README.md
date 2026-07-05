# Project Intelligence Index — NAMA Website Builder

## Purpose

This directory is the **permanent architectural memory** of the NAMA Website Builder project. It exists so that AI agents (and human developers) can understand the complete project without reading every source file.

This index significantly **reduces context usage** and **improves audit speed and consistency**.

---

## How AI Agents Should Use These Files

### Before Starting Any Work

1. **Always read `16-ai-context.md` first.** This is the most important file. It contains a complete architectural summary including:
   - Architecture overview
   - Folder structure
   - Critical files (what to never modify vs. extension points)
   - Important classes with their key methods
   - Dependency graph (with circular dependency warnings)
   - Provider graph
   - Naming conventions
   - Coding standards
   - Completed/pending epics
   - Common pitfalls
   - Error hierarchy

   Reading this single file gives an AI ~90-95% understanding of the project.

2. **If the task involves a specific area**, read the corresponding detailed file:
   - Workspace changes → `12-workspace-system.md` + `11-provision-engine.md`
   - Provision Engine changes → `11-provision-engine.md` + `04-repository-map.md`
   - Repository changes → `04-repository-map.md` + `03-database-map.md`
   - Provider changes → `05-provider-map.md`
   - Theme changes → `09-theme-system.md`
   - Routes/UI changes → `02-routing-map.md` + `07-component-map.md` + `08-admin-map.md`
   - Database schema changes → `03-database-map.md`
   - Performance work → `13-performance-map.md`
   - Security work → `14-security-map.md`

3. **Always check `15-technical-debt.md` before implementing** to avoid:
   - Re-creating known issues
   - Missing critical fixes that should be included
   - Making architecture worse instead of better

4. **After reading context, cross-reference with `00-project-overview.md`** for project-level goals and vision.

---

## File Index

| File | Purpose | Read When |
|------|---------|-----------|
| `00-project-overview.md` | Business goals, architecture vision, version, tech stack | First-time orientation |
| `01-folder-map.md` | Complete folder structure with purpose and dependency direction | Navigating the codebase |
| `02-routing-map.md` | All routes, auth requirements, layouts, component dependencies | Modifying routes or navigation |
| `03-database-map.md` | All tables, relations, workspace readiness, migration history | Database changes |
| `04-repository-map.md` | All repositories, methods, dependencies, bypass issues | Repository work |
| `05-provider-map.md` | All provider interfaces and implementations, replacement strategy | Provider changes or migration |
| `06-service-map.md` | All services, responsibilities, dependencies, side effects | Service layer work |
| `07-component-map.md` | Important UI components, routes, dependencies, reusability | UI component work |
| `08-admin-map.md` | Complete admin architecture, CRUD modules, missing features | Admin panel work |
| `09-theme-system.md` | Theme engine, tokens, presets, bridge, limitations | Theme or visual changes |
| `10-builder-map.md` | Landing builder, blocks, renderer, editor, serialization | Page builder work |
| `11-provision-engine.md` | Complete provision engine architecture, state machine, pipeline | Provision Engine work |
| `12-workspace-system.md` | Workspace lifecycle, plans, roles, implementation gaps | Workspace work |
| `13-performance-map.md` | Lazy loading, bundle splitting, bottlenecks | Performance work |
| `14-security-map.md` | Auth, authorization, RLS, secrets, risks | Security work |
| `15-technical-debt.md` | Every known issue with severity, priority, and suggested epic | Before ANY implementation |
| `16-ai-context.md` | **MUST READ FIRST** — Complete architectural summary for AI | EVERY task |
| `README.md` | This file — how to use the index | Orientation |

---

## Cross-Reference Guide

### For Workspace Changes
Read: `16-ai-context.md` → `12-workspace-system.md` → `11-provision-engine.md` → `03-database-map.md` → `15-technical-debt.md`

### For Provision Engine Changes
Read: `16-ai-context.md` → `11-provision-engine.md` → `04-repository-map.md` (bypass issues) → `12-workspace-system.md` → `15-technical-debt.md`

### For New Blueprint
Read: `16-ai-context.md` → `11-provision-engine.md` (Blueprint section) → `04-repository-map.md`

### For Database Migration
Read: `16-ai-context.md` → `03-database-map.md` → `14-security-map.md` → `15-technical-debt.md`

### For New Route/Page
Read: `16-ai-context.md` → `02-routing-map.md` → `07-component-map.md` → `08-admin-map.md`

---

## Maintenance

This index should be **updated whenever significant architectural changes are made**. When adding:
- A new epic → Update `00-project-overview.md` (completed/pending)
- A new repository → Update `04-repository-map.md` + `16-ai-context.md`
- A new provider → Update `05-provider-map.md` + `16-ai-context.md`
- A new service → Update `06-service-map.md` + `16-ai-context.md`
- A new table → Update `03-database-map.md` + `16-ai-context.md`
- A new route → Update `02-routing-map.md`
- A new component → Update `07-component-map.md`
- New technical debt → Update `15-technical-debt.md`

**Rule**: If a human or AI would need to read source code to understand a change, this index should be updated.
