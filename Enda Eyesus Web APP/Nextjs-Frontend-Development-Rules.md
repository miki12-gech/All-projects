# Next.js Frontend Development Rules & Commands

> **Source:** [Nextjs-Frontend-Development-Rules.pdf](file:///c:/Users/VICTUS/Enda%20Eyesus%20Web%20APP/Nextjs-Frontend-Development-Rules.pdf)
> **Saved:** 2026-07-28

---

This document establishes mandatory rules, tools, and coding standards for all frontend developers working on this project. These guidelines ensure consistency, maintainability, and quality across the entire codebase. Adherence to these standards is **not optional** — they form the foundation of our development workflow and must be followed by every team member without exception.

---

## Core Framework & Language Requirements

### Next.js App Router Only
Use App Router **exclusively**. Pages Router is forbidden. All routing must live inside `/app` directory.

### TypeScript Mandatory
JavaScript files are not allowed. Use `.ts` and `.tsx` extensions only for all code files.

> These foundational choices define our technical stack and are non-negotiable. The App Router provides modern routing capabilities with improved performance and developer experience, while TypeScript ensures type safety and reduces runtime errors. Every file in the project must conform to these standards from day one.

---

## Folder Structure Architecture

Follow a **feature-based architecture** where pages remain thin and business logic never lives in `page.tsx` files. This separation of concerns ensures maintainability and scalability as the project grows.

### Required Directory Structure

```
src/
  app/
  components/
  features/
  hooks/
  lib/
  store/
  styles/
  types/
  constants/
```

Each directory serves a specific purpose:
- **`app/`** — contains routes
- **`components/`** — holds reusable UI elements
- **`features/`** — organizes business logic by domain
- **`hooks/`** — manages custom React hooks
- **`lib/`** — contains utilities
- **`store/`** — handles state management
- **`styles/`** — manages global styling
- **`types/`** — defines TypeScript interfaces
- **`constants/`** — stores application-wide values

---

## Page & Feature Organization Rules

### Page Rules (CRITICAL)

The `page.tsx` file must **ONLY** perform two functions:

1. Fetch data on the server side
2. Render a view component

Pages should contain **no state management** and **no API calls** within UI components. This keeps pages lightweight and maintainable.

### Feature Structure — The 4-File Rule

> [!IMPORTANT]
> Each feature must contain **four essential files** that separate concerns clearly:

| # | File | Purpose | Example |
|---|------|---------|---------|
| 1 | **Service file** | API calls | `auth.service.ts` |
| 2 | **Hooks file** | Logic | `auth.hooks.ts` |
| 3 | **Types file** | TypeScript interfaces | `auth.types.ts` |
| 4 | **View file** | UI | `auth.view.tsx` |

**Example structure:** `features/auth/` contains:
```
features/auth/
  auth.service.ts
  auth.hooks.ts
  auth.types.ts
  auth.view.tsx
```

---

## Data Fetching & State Management

### Server Components Default
Server Components are the default rendering method. Use **React Query** for client-side data fetching when needed.

### Axios for HTTP
Use **Axios** exclusively for all HTTP requests. Never fetch data directly inside UI components.

### Zustand for Global State
Use **Zustand** only for:
- Auth state
- UI state
- Shared client state

Do **NOT** store server data in Zustand.

---

## Styling & Component Standards

### Styling Requirements
- **Tailwind CSS** is mandatory for all styling
- No custom CSS files are allowed except `globals.css`
- Use **ShadCN UI** for pre-built components
- Use **Radix UI** when accessibility features are required

### Component Guidelines
- UI components must be **"dumb"** — no business logic, presentation only
- Components must be reusable across the application
- **One component per file**

---

## Forms & Validation Standards

### React Hook Form
Use **React Hook Form** for all form handling.

### Zod Validation
Use **Zod** for schema validation. Manual validation is forbidden — let Zod handle all validation logic.

---

## Naming Conventions & Standards

| Category | Convention | Example |
|----------|-----------|---------|
| **Components** | PascalCase | `UserProfile`, `NavigationBar` |
| **Hooks** | Prefix with `use` + descriptive name | `useSomething`, `useAuth` |
| **Files** | kebab-case | `user-profile.ts`, `auth-service.ts` |
| **Types** | Suffix with `Type` in PascalCase | `UserType`, `AuthResponseType` |
| **Services** | `feature.service.ts` | `auth.service.ts`, `user.service.ts` |

---

## Client Components & Code Quality

### Client Component Rules
Add `"use client"` directive **ONLY** when absolutely required:
- Forms
- Buttons
- Modals
- Browser APIs

Never add it globally or in the root layout.

### Quality Standards
- **ESLint** must pass with zero errors before merge
- **Prettier** formatting is mandatory
- All code requires **peer review** before merging

---

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| Next.js App Router | Routing & SSR |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| React Query | Client-side data fetching |
| Zustand | Global state management |
| Zod | Schema validation |

---

## Forbidden Practices (STRICT)

- ❌ No API calls in components
- ❌ No fat pages
- ❌ No inline styles
- ❌ No direct DOM manipulation
- ❌ No global state abuse
- ❌ No skipping types

---

## Final Rule

> **If you are unsure: Ask before coding, follow existing patterns, and do not invent new structures. Clean code is not optional.**
