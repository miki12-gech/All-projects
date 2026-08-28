# 🏛️ Compliance Audit Report
## Ethiopian Orthodox Gibi Gubae Management System — Koinonia Platform
**Audit Date:** 2026-07-20 | **Auditor:** Elite Senior Staff Engineer  
**Repositories:** `Koinonia-frontend-main` (Next.js 15) · `Koinonia-backend-main` (Express/Prisma)

---

> [!CAUTION]
> This codebase has **CRITICAL architectural violations** across nearly every rule category. The frontend has been built as a traditional React SPA disguised inside a Next.js project shell. The page architecture is fundamentally broken. Immediate action is required before this goes to staging.

---

## 🚨 CRITICAL VIOLATIONS

### VIOLATION #1 — `"use client"` ON EVERY SINGLE `page.tsx` FILE
**Rule Broken:** `page.tsx` files MUST be Server Components. `"use client"` is expressly forbidden at the page level.  
**Impact:** Catastrophic. This single pattern destroys ALL server-side rendering benefits of Next.js App Router. You are shipping a $0 React SPA masquerading as a Next.js app.

**Every page in the project is a client component. Full list of offenders:**

| File | Line | Violation |
|---|---|---|
| `src/app/dashboard/page.tsx` | L1 | `"use client"` |
| `src/app/dashboard/profile/page.tsx` | L1 | `"use client"` |
| `src/app/dashboard/posts/page.tsx` | L1 | `"use client"` |
| `src/app/dashboard/plans-reports/page.tsx` | L1 | `"use client"` |
| `src/app/dashboard/notifications/page.tsx` | L1 | `"use client"` |
| `src/app/dashboard/my-class/page.tsx` | L1 | `"use client"` |
| `src/app/dashboard/my-announcements/page.tsx` | L1 | `"use client"` |
| `src/app/dashboard/messages/page.tsx` | L1 | `"use client"` |
| `src/app/dashboard/membership/status/page.tsx` | L1 | `"use client"` |
| `src/app/dashboard/library/page.tsx` | L1 | `"use client"` |
| `src/app/dashboard/education/page.tsx` | L1 | `"use client"` |
| `src/app/dashboard/courses/page.tsx` | L2 | `"use client"` |
| `src/app/dashboard/announcements/page.tsx` | L1 | `"use client"` |
| `src/app/dashboard/announcements/[id]/page.tsx` | L2 | `"use client"` |
| `src/app/dashboard/about/page.tsx` | L1 | `"use client"` |
| `src/app/dashboard/sub-classes/page.tsx` | L2 | `"use client"` |
| `src/app/(auth)/login/page.tsx` | L1 | `"use client"` |
| `src/app/(auth)/register/page.tsx` | L1 | `"use client"` |
| `src/app/(auth)/forgot-password/page.tsx` | L1 | `"use client"` |
| `src/app/dashboard/layout.tsx` | L1 | `"use client"` — **layout is also a client component** |

**Correct Pattern:**
```tsx
// page.tsx — MUST be a Server Component
import { MyFeatureView } from "@/features/my-feature/my-feature.view";

export default async function MyPage() {
  const data = await fetch("...", { cache: "no-store" }); // Server-side only
  return <MyFeatureView data={data} />;
}
```

---

### VIOLATION #2 — `useState` AND `useEffect` DIRECTLY INSIDE `page.tsx` FILES
**Rule Broken:** ZERO state management (`useState`, `useEffect`) inside `page.tsx`.  
**Impact:** These pages are not thin route wrappers — they are monolithic God Components.

| File | Lines | What's Happening |
|---|---|---|
| `dashboard/profile/page.tsx` | L19–L24 | 6 `useState` calls + `useEffect` fetching profile |
| `dashboard/posts/page.tsx` | L29–L34, L238–L245, L345–L348 | 14+ `useState` calls + `useEffect` for fetching posts |
| `dashboard/page.tsx` | L13 | `useEffect` for routing logic |
| `dashboard/notifications/page.tsx` | L37–L41 | 5 `useState` + `useEffect` fetching notifications |
| `dashboard/my-class/page.tsx` | L112–L115 | 4 `useState` calls |
| `dashboard/messages/page.tsx` | L61–L76 | 8+ `useState` calls + 2 `useEffect` hooks |
| `dashboard/membership/status/page.tsx` | L20 | `useEffect` |
| `dashboard/announcements/page.tsx` | L79, L235, L243, L818, L824 | Multiple `useEffect` + 20+ `useState` calls |
| `(auth)/register/page.tsx` | L40–L83 | 18+ `useState` calls + `useEffect` API fetch |

---

### VIOLATION #3 — RAW `fetch()` CALLS INSIDE `page.tsx` AND FEATURE COMPONENTS
**Rule Broken:** HTTP requests MUST use **Axios**. Native `fetch` is forbidden inside UI components.

| File | Line | Violation |
|---|---|---|
| `dashboard/my-class/page.tsx` | L159 | `fetch('/api/v1/member-affairs/sub-classes/...')` — also reads from `localStorage` directly |
| `dashboard/announcements/page.tsx` | L7 | Imports a custom `api` from `@/lib/api` — a non-standard, undocumented API module |

> **Double violation on `my-class/page.tsx` L163:** `localStorage.getItem("token")` — token management bypassing the Zustand auth store entirely.

---

### VIOLATION #4 — ZERO REACT QUERY USAGE IN MOST FEATURES
**Rule Broken:** Client-side data fetching MUST use **React Query** (`useQuery`/`useMutation`).  
**Impact:** The entire data layer is implemented with manual `useState` + `useEffect` + manual loading/error state flags — a pattern explicitly forbidden by your team guidelines.

Affected pages using manual fetch-in-useEffect instead of React Query:
- `dashboard/profile/page.tsx` — manual `fetchProfile` inside `useEffect`
- `dashboard/posts/page.tsx` — manual fetch for posts and classes
- `dashboard/notifications/page.tsx` — manual `fetchNotifications` with `setInterval`
- `dashboard/messages/page.tsx` — manual fetch for conversations and messages
- `dashboard/membership/status/page.tsx` — manual fetch
- `dashboard/announcements/page.tsx` — manual `fetchAnnouncements` inside `setInterval` (L820) — **re-inventing React Query's `refetchInterval` from scratch**
- `(auth)/register/page.tsx` — manual `fetchClasses` inside `useEffect`

**Only `my-class/page.tsx` correctly uses `useQuery` from `@tanstack/react-query`.**

---

### VIOLATION #5 — ZERO ZOD VALIDATION ON ALL AUTH FORMS
**Rule Broken:** ALL validation MUST be handled by **Zod** schemas. Manual validation is forbidden.  
**Impact:** The entire auth flow is broken.

- **`(auth)/register/page.tsx` L189–L210:** Manual regex validation functions (`validateEmail`, `validatePassword`, `validateStep0`, `validateStep1`) — hand-rolled, error-prone, untestable. Zero Zod. Zero React Hook Form.
- **`(auth)/login/page.tsx` L22–L63:** The form uses `e.currentTarget` to extract values (L28–L29) — bypassing React Hook Form entirely. Zero Zod schema.

---

### VIOLATION #6 — ZERO REACT HOOK FORM ON ALL FORMS
**Rule Broken:** ALL forms MUST use **React Hook Form**.  
**Note:** `react-hook-form` is installed in `package.json` but only used in a single ShadCN UI component (`form.tsx`). No actual application form uses it.

Forms that manually manage state instead of RHF:
- `(auth)/register/page.tsx` — 18+ individual `useState` per field
- `(auth)/login/page.tsx` — `e.currentTarget` DOM access  
- `dashboard/posts/page.tsx` — `useState` per field (title, content, targetType, etc.)

---

### VIOLATION #7 — MASSIVE USE OF `any` TYPE — NO TYPESCRIPT SAFETY
**Rule Broken:** No bypassing types with `any`.  
**Impact:** The TypeScript configuration is worthless. The type system is being actively subverted.

**Count: 100+ instances of `: any`** found. Critical examples:

| File | Lines | Severity |
|---|---|---|
| `features/member-affairs/EditMemberModal.tsx` | L16 | `member: any` — prop typed as `any` |
| `features/member-affairs/PlanReportMatrix.tsx` | L258, L420 | `data: any`, `payload: any` |
| `features/member-affairs/SpiritualAssignments.tsx` | L102, L136 | Iterators typed `any` |
| `app/(auth)/register/page.tsx` | L62, L102 | `useState<any[]>([])` — state typed as `any[]` |
| `app/dashboard/profile/page.tsx` | L22, L23 | `useState<any>({})` |
| `backend/auth.repository.ts` | L42, L49, L56 | `findByEmail`, `findById`, `updateProfile` return `any` |
| `backend/auth.service.ts` | L124 | `updateProfile(id: string, data: any)` |

---

### VIOLATION #8 — INLINE STYLES (`style={{...}}`) USED THROUGHOUT THE CODEBASE
**Rule Broken:** NO inline styles (`style={{...}}`). Tailwind CSS ONLY.  
**Count: 50+ instances** found across the project.

Key offenders:
- `src/app/(auth)/register/page.tsx` — L652: `style={{ borderTop: "4px solid #C9A227" }}`
- `src/app/(auth)/login/page.tsx` — L75: `style={{ borderTop: "4px solid var(--gold, #C9A227)" }}`
- `src/app/dashboard/posts/page.tsx` — L284: `style={{ borderTop: "4px solid #C9A227" }}`
- `src/features/home/home.view.tsx` — L69–L71, L110, L156, L161, L181, L184, L185, L206, L261 — **10+ inline styles in a single file**
- `src/features/about/ServiceTab.tsx` — **13 inline `style={{ fontFamily: "serif" }}`** — repeating the same property 13 times instead of defining a Tailwind class
- `src/features/about/LawTab.tsx` — L42, L52, L59, L102, L142 — same pattern
- `src/features/agent/agent.view.tsx` — L103, L106, L253: dynamic border/color overrides
- `src/components/dashboard/Sidebar.tsx` — L386: inline style
- `src/features/member-affairs/SpiritualAssignments.tsx` — L360: dynamic width calculation

---

### VIOLATION #9 — FEATURE DIRECTORY STRUCTURE COMPLETELY NON-COMPLIANT
**Rule Broken:** Every feature MUST have exactly 4 files: `[feature].service.ts`, `[feature].hooks.ts`, `[feature].types.ts`, `[feature].view.tsx`.

| Feature | Files Present | Compliant? |
|---|---|---|
| `features/home` | `home.types.ts`, `home.view.tsx` | ❌ Missing `home.service.ts`, `home.hooks.ts` |
| `features/about` | `GeneralTab.tsx`, `LawTab.tsx`, `ServiceTab.tsx` | ❌ Wrong naming convention. No service, hooks, or types file. Flat components dumped in. |
| `features/announcements` | `MyAnnouncements.tsx`, `announcementApi.ts` | ❌ Non-standard naming. No types, no hooks file. |
| `features/member-affairs` | 9 mixed component/API files | ❌ Completely non-compliant. Flat folder of unsorted files. |
| `features/education` | 8+ mixed files | ❌ No service/hooks/types/view separation. |
| `features/agent` | `agent.service.ts`, `agent.hooks.ts`, `agent.types.ts`, `agent.view.tsx` + 6 extra files | ⚠️ Core 4 files exist, but 6 extra component files added outside the pattern. |
| `features/library` | `AdminLibraryManager.tsx`, `AdminLibraryUpload.tsx`, `DocumentViewer.tsx`, `LibraryListing.tsx`, `index.ts` | ❌ No service/hooks/types/view pattern. |

**Only `features/agent` has a partial attempt at the 4-file pattern. Every other feature is non-compliant.**

---

### VIOLATION #10 — MISSING `src/` DIRECTORY STRUCTURE ENTRIES
**Rule Broken:** Must strictly follow `src/` structure: `app`, `components`, `features`, `hooks`, `lib`, `store`, `styles`, `types`, `constants`.

**Missing directories:**
- `src/hooks/` — **Does not exist.** All custom hooks are either embedded inside page files or inside `features/`.
- `src/styles/` — **Does not exist.** Only `globals.css` exists at `app/globals.css`.
- `src/types/` — **Does not exist.** Types are scattered in `lib/types.ts` and ad-hoc inside component files.
- `src/constants/` — **Does not exist.**

---

### VIOLATION #11 — SERVER DATA BEING STORED IN ZUSTAND
**Rule Broken:** Zustand is strictly for UI/Auth state. NEVER store server data in Zustand.

- `src/store/userStore.ts` — **This entire store is illegal.** `UserProfile` is server data (fullName, sex, department, serviceClass, email, phone, etc.) being cached in Zustand via `localStorage`. This is a server-cache concern — it belongs in React Query.
- `src/store/authStore.ts` — The `AuthUser` interface contains extensive server-derived data fields (`serviceClassName`, `system_role`, `service_class_id`, etc.) that are server response payloads, not UI state.

---

## ⚠️ WARNINGS

### WARNING #1 — `testCreatePost.js` IN BACKEND ROOT
**File:** `Koinonia-backend-main/testCreatePost.js`  
A `.js` file at the project root. This violates the TypeScript-only rule and should not exist in a TypeScript project. A `.ts` version also exists (`testCreatePost.ts`), suggesting the `.js` was never cleaned up.

### WARNING #2 — `import` INSIDE FUNCTION BODY IN `api/index.ts`
**File:** `src/api/index.ts` — L22  
```ts
import('@/store/authStore').then(({ useAuthStore }) => { ... });
```
Dynamic import inside a response interceptor is an anti-pattern. The store should be imported at the top level and referenced statically.

### WARNING #3 — PASSWORD MINIMUM LENGTH MISMATCH BETWEEN FRONTEND AND BACKEND
**Rule:** Password must be min 8 chars.  
- **Frontend `register/page.tsx` L197:** `pass.length >= 8` ✅  
- **Backend `auth.schema.ts` L8:** `z.string().min(6, ...)` ❌ — **min 6, not 8**. The backend schema allows passwords shorter than what the frontend enforces. This is a security inconsistency.

### WARNING #4 — REGISTER RESPONSE FORMAT DOESN'T MATCH SPEC
**Rule:** `POST /api/v1/auth/register` MUST return `{ success: true, token: "...", user: {...} }`.  
**Actual (`auth.controller.ts` L21):** `res.status(201).json({ ...user, token })`  
The response spreads the user fields into the root object and does NOT include a `success: true` field. The spec is not met.

### WARNING #5 — `username` FIELD MISSING FROM SCHEMA
**Rule:** User table MUST have a `username` field (unique, min 4).  
**Actual (`schema.prisma` L11–L101):** The `User` model has NO `username` field at all. The user is identified by `full_name_three_parts` and `email`. The frontend `AuthUser` interface has a `username` field but it's never populated from any real backend source.

### WARNING #6 — `academicYear` SCHEMA TYPE MISMATCH
**Rule:** `academicYear` should be an enum.  
**Actual (`schema.prisma` L18):** `academic_year Int?` — stored as an integer.  
**Frontend `lib/types.ts` L10–L13:** Typed as `AcademicYear` string enum (`'YEAR_1'`, `'YEAR_2'`, etc.).  
**Frontend `register/page.tsx` L278:** Sends `parseInt(academicYear)`.  
The frontend has an enum abstraction that doesn't match the database integer type. Data integrity is fragile.

### WARNING #7 — `serviceClassID` FIELD NAME CASING INCONSISTENCY
The database uses `snake_case` (`service_class_id`), the frontend Zustand store uses both `serviceClassID` (camelCase) AND `service_class_id` (snake_case) simultaneously in the same `AuthUser` interface. This is a mapping confusion that will cause runtime bugs.

### WARNING #8 — `GET /api/v1/classes/public` ENDPOINT DOES NOT EXIST
**Rule:** `GET /api/v1/classes/public` must exist and be open (no token required).  
**Actual (`classes.routes.ts` L7):** `router.get('/', classesController.getAllClasses)` — the route is `/` (i.e., `GET /api/v1/classes`), not `/public`. The spec endpoint path is not met. The frontend `register/page.tsx` L100 calls `/classes` (no `/public`), which happens to work, but the spec is technically not implemented.

### WARNING #9 — `SET_INTERVAL` FOR POLLING IN `announcements/page.tsx`
**File:** `dashboard/announcements/page.tsx` L820  
`setInterval(fetchAnnouncements, 30000)` — Manual polling with `setInterval` in place of React Query's `refetchInterval`. This is unreliable (no cleanup on component unmount visible at this scan), wastes network calls, and is the exact problem React Query was created to solve.

### WARNING #10 — `alert()` CALLS IN PRODUCTION UI CODE
**File:** `dashboard/my-class/page.tsx` L169, L173  
```ts
alert(`✅ ${selectedMember.full_name_three_parts} በስኬት ተመድቧል።`);
alert("❌ ምደባው አልተሳካም። እባክዎ ይሞክሩ።");
```
Native browser `alert()` calls in production code. Should use the `sonner` toast library that is already installed in `package.json`.

### WARNING #11 — NAMING CONVENTION VIOLATIONS
**Rule:** `kebab-case` for file names, `use-` prefix for hooks, `Type` suffix for type definitions.

- `src/features/about/GeneralTab.tsx` — PascalCase file name (should be `general-tab.tsx`)
- `src/features/about/ServiceTab.tsx` — same
- `src/features/about/LawTab.tsx` — same
- `src/features/member-affairs/EditMemberModal.tsx` — same
- `src/features/member-affairs/PlanReportMatrix.tsx` — same
- `src/lib/types.ts` — exports `Role`, `Sex`, `User`, etc. without `Type` suffix (should be `RoleType`, `SexType`, `UserType`)
- Hooks in `features/agent/agent.hooks.ts` — file name is compliant, but there are no standalone `hooks/` directory files at all

---

## ✅ PASSED

### ✅ PASS-1 — No `/pages` Directory
The forbidden `/pages` directory does not exist. The project correctly uses only `/app`. Routing is on App Router.

### ✅ PASS-2 — No `.js` / `.jsx` Files in `/src`
All frontend source files are `.ts` or `.tsx`. The `.js` violation is isolated to the backend root (`testCreatePost.js`).

### ✅ PASS-3 — Correct Tech Stack Installed
`package.json` confirms all required libraries are present: `@tanstack/react-query`, `axios`, `zustand`, `react-hook-form`, `zod`, `tailwindcss`, `shadcn`. The problem is they are barely used in the actual application code.

### ✅ PASS-4 — Axios Used via `apiClient` (Most Files)
The `apiClient` abstraction in `src/api/index.ts` uses Axios. Most API calls go through this client correctly (e.g., `agent.service.ts`, `memberAffairsApi.ts`, `educationApi.ts`). The violation is the `fetch()` escapees.

### ✅ PASS-5 — Zustand Stores Exist and Use `persist`
`authStore.ts` and `userStore.ts` use Zustand with `persist` middleware correctly set up. Cookie-based storage for SSR compatibility in `authStore.ts` is architecturally sound.

### ✅ PASS-6 — `features/agent` Has Partial 4-File Structure
`agent.service.ts`, `agent.hooks.ts`, `agent.types.ts`, `agent.view.tsx` — the only feature with an attempt at the mandated structure.

### ✅ PASS-7 — Next.js Middleware Exists and Is Functional
`src/middleware.ts` correctly implements auth-based route protection using cookie-based token detection. Logic is sound.

### ✅ PASS-8 — Backend Uses bcrypt for Password Hashing
`auth.service.ts` L37: `bcrypt.hash(data.password, SALT_ROUNDS)` with `SALT_ROUNDS = 12`. Correct.

### ✅ PASS-9 — Login Compares Hashes Correctly
`auth.service.ts` L101: `bcrypt.compare(data.password, user.password_hash)`. Correct.

### ✅ PASS-10 — `POST /api/v1/auth/register` Returns 201
`auth.controller.ts` L21: `res.status(201)`. Correct status code.

### ✅ PASS-11 — `POST /api/v1/auth/login` Endpoint Exists
`auth.routes.ts` L23–L28: Route exists with rate limiting applied. Correct.

### ✅ PASS-12 — Classes Route Is Public (No Auth Middleware)
`classes.routes.ts` — No `requireAuth` middleware on the `GET /` route. Public access confirmed.

### ✅ PASS-13 — Backend Uses Zod for Schema Validation
`auth.schema.ts` uses Zod for both `registerSchema` and `loginSchema`. Validation middleware applied to routes.

### ✅ PASS-14 — Backend Auth Token Returns with Response
`auth.controller.ts` L21, L34: Token is included in the JSON response body AND set as an HttpOnly cookie. Dual delivery is acceptable.

### ✅ PASS-15 — `profileImage` and `bio` Are Optional in Schema
`schema.prisma` L22: `profile_image_url String? @default(...)` — optional ✅  
`schema.prisma` L23: `bio String?` — optional ✅

### ✅ PASS-16 — `email` Field is Unique in Database
`schema.prisma` L14: `email String @unique(map: "idx_users_email")` ✅

### ✅ PASS-17 — Backend Module Structure is Clean
Auth, classes, posts, notifications, etc. are properly modularized into `controller`, `service`, `repository`, `routes`, `schema` files. This is good architecture.

---

## 🛠️ ACTION ITEMS FOR THE PM

> [!IMPORTANT]
> These must be filed as tickets immediately. Items are ordered by business impact — fix in this order.

---

**🔴 P0 — Sprint Blocker Tickets (Fix Before Any Feature Work)**

- **[TICKET-001] Refactor ALL `page.tsx` files to be Server Components**
  - Remove `"use client"` from every `page.tsx` and `layout.tsx`
  - Move all logic into separate `[feature].view.tsx` components
  - Estimated effort: 3–5 days (large refactor across 20 files)
  - Owner: Lead Frontend Dev

- **[TICKET-002] Implement React Query across ALL data-fetching pages**
  - Replace every `useState` + `useEffect` + manual `fetch/axios` pattern with `useQuery`/`useMutation`
  - Affected: `announcements`, `posts`, `profile`, `notifications`, `messages`, `membership/status`, `register`
  - Estimated effort: 3–4 days
  - Owner: Frontend Dev (Data Layer)

- **[TICKET-003] Implement React Hook Form + Zod on ALL forms**
  - `(auth)/login/page.tsx` — replace DOM access with RHF + Zod schema
  - `(auth)/register/page.tsx` — replace 18+ `useState` fields + manual validation with RHF + Zod
  - `dashboard/posts/page.tsx` — create post form must use RHF + Zod
  - Estimated effort: 2 days
  - Owner: Frontend Dev (Forms)

- **[TICKET-004] Fix password minimum length mismatch between frontend and backend**
  - `auth.schema.ts` L8: Change `min(6)` to `min(8)` immediately
  - This is a **security vulnerability** — the backend accepts weaker passwords than advertised
  - Estimated effort: 15 minutes
  - Owner: Backend Dev

---

**🟠 P1 — Must Fix This Sprint**

- **[TICKET-005] Replace all native `fetch()` calls with `apiClient` (Axios)**
  - `dashboard/my-class/page.tsx` L159 — replace `fetch()` + `localStorage` token with Axios call through `apiClient`
  - Audit entire codebase for any remaining direct `fetch` calls
  - Estimated effort: 1 day
  - Owner: Frontend Dev

- **[TICKET-006] Eliminate all `any` type usages — enforce strict TypeScript**
  - Add `"strict": true` and `"noImplicitAny": true` to `tsconfig.json`
  - Create proper typed interfaces for all `member: any`, `data: any` usages
  - Estimated effort: 2–3 days
  - Owner: Frontend Dev + Backend Dev

- **[TICKET-007] Enforce feature-based 4-file structure for all features**
  - Refactor `about`, `announcements`, `member-affairs`, `education`, `library`, `home` features
  - Each MUST have only: `[feature].service.ts`, `[feature].hooks.ts`, `[feature].types.ts`, `[feature].view.tsx`
  - Estimated effort: 2 days
  - Owner: Frontend Dev (Architecture)

- **[TICKET-008] Create missing `src/` directories**
  - Create `src/hooks/`, `src/styles/`, `src/types/`, `src/constants/`
  - Migrate all shared custom hooks into `src/hooks/`
  - Migrate all shared types into `src/types/` with `Type` suffix
  - Estimated effort: 1 day
  - Owner: Frontend Dev

- **[TICKET-009] Move server-data out of Zustand (`userStore.ts`)**
  - `userStore.ts` must be deleted. The data it caches belongs in React Query's cache
  - All components consuming `useUserStore` must be migrated to `useQuery`
  - Estimated effort: 1 day
  - Owner: Frontend Dev

- **[TICKET-010] Fix register API response shape to match spec**
  - Backend `auth.controller.ts` L21: Change `res.status(201).json({ ...user, token })` to `res.status(201).json({ success: true, token, user })`
  - Update all frontend callers accordingly
  - Estimated effort: 30 minutes
  - Owner: Backend Dev

---

**🟡 P2 — Should Fix This Sprint**

- **[TICKET-011] Replace all inline `style={{...}}` with Tailwind classes**
  - 50+ violations across `home.view.tsx`, `ServiceTab.tsx`, `LawTab.tsx`, `login/page.tsx`, `register/page.tsx`, etc.
  - The `fontFamily: "serif"` repeated 13 times in `ServiceTab.tsx` is a prime example — create a `font-serif` utility class
  - Estimated effort: 1 day
  - Owner: Frontend Dev (UI)

- **[TICKET-012] Replace `alert()` with `sonner` toast notifications**
  - `my-class/page.tsx` L169, L173 — two native `alert()` calls in production
  - Audit for any other `alert()` / `confirm()` calls
  - Estimated effort: 2 hours
  - Owner: Frontend Dev

- **[TICKET-013] Add `username` field to backend User schema**
  - `schema.prisma` is missing a `username` field (unique, min 4)
  - The frontend `AuthUser` interface references `username` but it's never populated
  - Create migration, add unique constraint
  - Estimated effort: 1 day (includes migration planning)
  - Owner: Backend Dev

- **[TICKET-014] Fix `academicYear` type mismatch**
  - Database: `Int?` — Frontend types: string enum `YEAR_1`, `YEAR_2`, etc.
  - Decide: Migrate DB column to a proper enum, OR fix the frontend type to use integers
  - Must be consistent across schema, API, and frontend
  - Estimated effort: 0.5–1 day
  - Owner: Backend Dev + Frontend Dev

- **[TICKET-015] Fix API route path: `/api/v1/classes/public`**
  - Current route: `GET /api/v1/classes`
  - Required route: `GET /api/v1/classes/public`
  - Estimated effort: 30 minutes
  - Owner: Backend Dev

- **[TICKET-016] Fix `serviceClassID` field name casing inconsistency**
  - `AuthUser` in `authStore.ts` has BOTH `serviceClassID` and `service_class_id`
  - Pick one convention. `camelCase` for frontend, `snake_case` for backend DTO only
  - Estimated effort: 2 hours
  - Owner: Frontend Dev

- **[TICKET-017] Rename all PascalCase feature files to `kebab-case`**
  - `GeneralTab.tsx` → `general-tab.tsx`, `ServiceTab.tsx` → `service-tab.tsx`, etc.
  - All type exports without `Type` suffix → add `Type` suffix
  - Estimated effort: 2 hours
  - Owner: Any Dev

- **[TICKET-018] Remove `testCreatePost.js` from backend root**
  - This `.js` file has no place in a TypeScript project repository
  - Also remove other debug scripts from root: `check-users.ts`, `check-service-classes.ts`, `test.ts`
  - Estimated effort: 15 minutes
  - Owner: Backend Dev

- **[TICKET-019] Replace `setInterval` polling with React Query `refetchInterval`**
  - `announcements/page.tsx` L820: `setInterval(fetchAnnouncements, 30000)` → React Query `refetchInterval: 30000`
  - Estimated effort: 1 hour (after TICKET-002 is done)
  - Owner: Frontend Dev

- **[TICKET-020] Refactor dynamic import in `api/index.ts` interceptor**
  - Move `useAuthStore` import to top-level; use `useAuthStore.getState()` directly in interceptor
  - Estimated effort: 30 minutes
  - Owner: Frontend Dev

---

## 📊 Audit Summary

| Category | Score | Status |
|---|---|---|
| App Router (No `/pages` dir) | 10/10 | ✅ |
| `page.tsx` as Server Components | 0/10 | 🚨 CRITICAL |
| Feature-based file structure | 1/10 | 🚨 CRITICAL |
| `src/` directory structure | 4/10 | 🚨 |
| React Query for data fetching | 1/10 | 🚨 CRITICAL |
| Axios for HTTP (no raw fetch) | 8/10 | ⚠️ |
| Zustand (UI/Auth only) | 4/10 | 🚨 |
| Tailwind + ShadCN only (no inline styles) | 3/10 | 🚨 |
| React Hook Form on all forms | 0/10 | 🚨 CRITICAL |
| Zod validation on all forms | 0/10 | 🚨 CRITICAL |
| 100% TypeScript (no `any`) | 2/10 | 🚨 |
| Naming conventions | 4/10 | ⚠️ |
| Backend: DB Schema | 6/10 | ⚠️ |
| Backend: Auth endpoints | 7/10 | ⚠️ |
| Backend: Public classes endpoint | 7/10 | ⚠️ |
| Backend: bcrypt password hashing | 10/10 | ✅ |
| **Overall Compliance** | **~40%** | **🚨 FAILING** |
