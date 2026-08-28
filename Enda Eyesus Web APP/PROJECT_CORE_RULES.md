# 🏛️ Koinonia – Permanent Project Core Rules
> **Project:** Enda Eyesus Community Digital Ecosystem (Koinonia)
> **Created:** 2026-08-04
> **Maintained by:** AI Chief Architect (Antigravity)

---

## 1. BACKEND RULES (Node.js / Express / Prisma)

| # | Rule | Enforcement |
|---|------|-------------|
| B1 | **Runtime:** Node.js + Express + TypeScript | All backend code must be `.ts` |
| B2 | **ORM:** Prisma ONLY – no raw SQL unless performance-critical | Reviewed per-PR |
| B3 | **RBAC:** Strict role-based access control via `requireAuth`, `requireRole`, and domain guards | Every route MUST have auth middleware |
| B4 | **Zero-Blob Storage:** Database stores ONLY URLs for media. All files go to Cloudinary | `uploads/` directory is LEGACY ONLY |
| B5 | **Validation:** Zod schemas for ALL request bodies. Middleware: `validate(schema)` | Every POST/PUT/PATCH route |
| B6 | **Module Structure:** `controller.ts`, `service.ts`, `repository.ts`, `routes.ts`, `schema.ts` | Per feature module |
| B7 | **Error Handling:** Use custom error classes (`NotFoundError`, `BadRequestError`, etc.) | Never raw `res.status().json()` for errors |

## 2. FRONTEND RULES (Next.js App Router)

| # | Rule | Enforcement |
|---|------|-------------|
| F1 | **`page.tsx` MUST be pure Server Components** – NO `"use client"`, no hooks, no API calls | Zero exceptions – delegate to `.view.tsx` |
| F2 | **4-File Feature Rule:** Every feature MUST have: `.types.ts`, `.service.ts`, `.hooks.ts`, `.view.tsx` | Checked per feature folder |
| F3 | **Forms:** `react-hook-form` + `zod` ONLY. No raw `useState` for form fields | All forms must use `useForm()` |
| F4 | **State Management:** `zustand` for global state; `react-query` / `useSWR` for server state | No raw `useEffect` for data fetching |
| F5 | **API Layer:** All API calls go through `src/api/` – never `fetch()` in components | Centralized API client |
| F6 | **Component Library:** shadcn/ui components in `src/components/ui/` | Consistency enforced |

## 3. GENERAL RULES

| # | Rule |
|---|------|
| G1 | **No `any` types** – use proper TypeScript typing everywhere |
| G2 | **No console.log in production** – use proper logging |
| G3 | **Meaningful commit messages** following conventional commits |
| G4 | **Environment variables** via `.env` – never hardcode secrets |

---

## 4. PROGRESS TRACKER

| Module | Backend | Frontend | Status |
|--------|---------|----------|--------|
| Auth (Login/Register/Forgot) | ✅ | ⚠️ Violations | Functional but non-compliant |
| Announcements | ✅ | ⚠️ Partial | Needs 4-file refactor |
| Posts | ✅ | ❌ Major violations | `page.tsx` is a monolith |
| Library | ✅ | ⚠️ Partial | Needs cleanup |
| Messages | ✅ | ✅ Compliant | Good |
| Notifications | ✅ | ✅ Compliant | Good |
| Profile | ✅ | ✅ Compliant | Good |
| Education/Courses | ✅ | ⚠️ Partial | `page.tsx` violation |
| LMS (Batches/Enrollments) | ⚠️ READ-ONLY | ❌ Not started | Missing CRUD + Submissions |
| LMS Submissions | ❌ Missing | ❌ Not started | **CRITICAL GAP** |
| Member Affairs | ✅ | ⚠️ Partial | Complex but functional |
| Dashboard Home | N/A | ✅ Compliant | Good |
| About / History | N/A | ✅ Compliant | Good |
| Admin Panel | ⚠️ TS Errors | N/A | Prisma schema mismatch |

---

*This file is the single source of truth for all architectural decisions. Updated automatically by the AI Architect.*
