# JOSCM Tithes App — Frontend Context (`CLAUDE_CLIENT.md`)

> This file is layer-specific context for the React frontend. It is loaded alongside `CLAUDE.md` whenever I work on UI, components, routing, state management, or anything client-side.
>
> Domain knowledge (roles, business rules, status flows) lives in `CLAUDE.md` — do not duplicate it here.

---

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Build tool | **Vite** | Fast HMR, minimal config, standard for React in 2026 |
| UI framework | **React 19** (JavaScript, not TypeScript) | Intermediate dev comfort, faster iteration |
| Styling | **Tailwind CSS v4** | Utility-first, pairs with shadcn, single source of truth for design tokens |
| Component library | **shadcn/ui** (Slate base color) | Copy-paste components I own, not a black-box library |
| Routing | **React Router v6** | Outlet-based nested layouts |
| HTTP client | **Axios** | Interceptors for token injection |
| Global state | **React Context API** | Auth only — no Redux, no Zustand until genuinely needed |
| Icons | **lucide-react** | Consistent icon set, tree-shakeable |
| Notifications | **sonner** (via shadcn) | Modern toast library |

**Package manager:** npm

**Backend base URL:** `http://localhost:7001/api`

---

## 2. Project Structure

Scalable structure chosen deliberately. Grow into it, don't fight it.

```
tithes/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/              Shell: Sidebar, Header, Layout
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Header.jsx
│   │   ├── ui/                  shadcn components (managed by CLI, minimal edits)
│   │   └── shared/              Reusable building blocks I built
│   │       ├── PageHeader.jsx
│   │       ├── StatusBadge.jsx
│   │       ├── StatCard.jsx
│   │       ├── DataTable.jsx
│   │       ├── EmptyState.jsx
│   │       ├── ConfirmDialog.jsx
│   │       └── FormField.jsx
│   │
│   ├── features/                Feature-specific logic + components
│   │   ├── tithes/
│   │   │   ├── TithesTable.jsx
│   │   │   ├── TithesForm.jsx
│   │   │   ├── DenominationInput.jsx
│   │   │   └── useTithes.js     (custom hook for fetching + state)
│   │   ├── request-form/
│   │   │   ├── RFTable.jsx
│   │   │   ├── RFStatusStepper.jsx
│   │   │   ├── RFCreateForm.jsx
│   │   │   └── useRequestForm.js
│   │   ├── voucher/
│   │   ├── expense/
│   │   ├── reports/
│   │   └── admin/
│   │       ├── users/
│   │       └── categories/
│   │
│   ├── pages/                   Thin "assemblers" — mostly just import features
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── TithesPage.jsx
│   │   ├── RequestFormPage.jsx
│   │   ├── VoucherPage.jsx
│   │   ├── ExpensePage.jsx
│   │   ├── ReportsPage.jsx
│   │   └── admin/
│   │       ├── UsersPage.jsx
│   │       └── CategoriesPage.jsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   └── useAuth.js
│   │
│   ├── services/
│   │   └── api.js               Single Axios instance + all API call functions
│   │
│   ├── lib/                     Pure helpers, no React
│   │   ├── utils.js             (created by shadcn — holds cn() helper)
│   │   ├── formatters.js        formatCurrency, formatDate, formatRelativeTime
│   │   ├── constants.js         STATUS_STYLES, ROLES, SERVICE_TYPES, DENOMINATIONS
│   │   └── validators.js        Form validation helpers
│   │
│   ├── utils/
│   │   └── rolePermissions.js   Sidebar + route access config
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── index.html
├── jsconfig.json
├── package.json
├── tailwind.config.js
└── vite.config.js
```

### 2.1 The pages/ vs features/ rule

- `pages/` files should be **thin**. Under 50 lines ideally. They import from `features/` and assemble the page.
- `features/` holds the real logic: data fetching, forms, tables, modals, custom hooks.
- **If a page file crosses 100 lines, extract components into `features/<name>/`.** No exceptions.

### 2.2 The components/shared vs features rule

- If a component is used in **two or more features**, it belongs in `components/shared/`.
- If a component is used in **one feature only**, it stays in `features/<name>/`.
- Don't preemptively put things in `shared/`. Promote them when the second usage appears.

---

## 3. Design System

Target vibe: **corporate professional** — Linear, Mercury, Wise, Stripe Dashboard. Boring on purpose. Trustworthy. Data-dense but not cluttered.

### 3.1 Color Palette

Base gray family: **slate** (cool-toned, modern, professional).

Primary accent: **[DECIDE BEFORE FIRST PAGE]**

Three finalists — pick one and delete the rest:

- `indigo-600` — modern, Linear-like, slightly playful
- `blue-900` — traditional banking, conservative
- `slate-900` — ultra-minimal monochrome, ultra-serious

Once chosen, update `src/index.css` to set the shadcn `--primary` CSS variable and do not use other accent colors anywhere in the app.

**Semantic status colors** (used by `StatusBadge`):

```js
// src/lib/constants.js
export const STATUS_STYLES = {
  pending:         { label: 'Pending',         class: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
  approved:        { label: 'Approved',        class: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  rejected:        { label: 'Rejected',        class: 'bg-red-50 text-red-700 ring-red-600/20' },
  draft:           { label: 'Draft',           class: 'bg-slate-50 text-slate-600 ring-slate-500/20' },
  submitted:       { label: 'Submitted',       class: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  for_approval:    { label: 'For Approval',    class: 'bg-violet-50 text-violet-700 ring-violet-600/20' },
  voucher_created: { label: 'Voucher Created', class: 'bg-orange-50 text-orange-700 ring-orange-600/20' },
  disbursed:       { label: 'Disbursed',       class: 'bg-cyan-50 text-cyan-700 ring-cyan-600/20' },
  received:        { label: 'Received',        class: 'bg-teal-50 text-teal-700 ring-teal-600/20' },
}
```

Pattern used: `bg-{color}-50 text-{color}-700 ring-{color}-600/20`. This is the "subtle badge" style from Stripe and Linear — light bg, dark text, faint ring. **Do not use solid-color badges.** They look amateur in financial apps.

### 3.2 Typography

- **Font family:** Inter (load via Google Fonts or `fontsource`)
- **Base size:** 14px (`text-sm` as default in data-heavy views)
- **Numbers in tables:** use `tabular-nums` utility class — `font-variant-numeric: tabular-nums` — so digits align vertically in columns. Non-negotiable for money displays.
- **Font weights:** 400 (normal), 500 (medium — labels, emphasized text), 600 (semibold — headings). Avoid 700 (bold) except for page titles.

### 3.3 Spacing

- **Form fields:** `space-y-2` between label and input, `space-y-4` between fields, `space-y-6` between sections.
- **Cards:** `p-6` padding by default, `p-4` on mobile.
- **Page container:** `p-4 md:p-6 lg:p-8` progressive padding.
- **Table rows:** `py-3 px-4` comfortable density. Not too tight, not too airy.

### 3.4 Shadows and Borders

- **Default:** `border border-slate-200` — thin border, no shadow
- **Elevated (modals, popovers):** `shadow-sm` max. Never `shadow-lg` or higher.
- **No gradients anywhere.** This is a financial app, not a landing page.

### 3.5 Reading "Corporate Pro" in Practice

When in doubt about a styling decision, ask: *"Would this look out of place on the Stripe Dashboard?"* If yes, simplify.

---

## 4. Routing

```jsx
// src/routes/AppRoutes.jsx
<Routes>
  <Route path="/login" element={<Login />} />

  <Route element={<ProtectedRoute />}>
    <Route element={<Layout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tithes" element={<TithesPage />} />
      <Route path="/request-form" element={<RequestFormPage />} />
      <Route path="/reports" element={<ReportsPage />} />

      <Route element={<ProtectedRoute allowedRoles={['admin','do','validator','auditor']} />}>
        <Route path="/voucher" element={<VoucherPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin','auditor']} />}>
        <Route path="/expense" element={<ExpensePage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
      </Route>
    </Route>
  </Route>

  <Route path="*" element={<Navigate to="/dashboard" replace />} />
</Routes>
```

**Rules:**

- All authenticated routes go through `<ProtectedRoute />` which reads from `AuthContext` and redirects to `/login` if no token.
- Role-gated routes use nested `<ProtectedRoute allowedRoles={...} />`.
- The `<Layout />` wraps everything authenticated — it provides the sidebar, header, and `<Outlet />`.

---

## 5. Auth Flow

### 5.1 AuthContext

```jsx
// src/context/AuthContext.jsx
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Rehydrate on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
```

**Important:** the `isLoading` flag is critical. Without it, on page refresh, `ProtectedRoute` briefly sees `user = null` and redirects to `/login` before rehydration finishes. Always gate the redirect behind `!isLoading`.

### 5.2 Token in Axios

```js
// src/services/api.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
```

The 401 interceptor handles expired tokens globally. Without it, every API call needs manual expiry checks — a maintenance nightmare.

---

## 6. Shared Components (build in this order)

These are the reusable building blocks. **Build them before building feature pages.** Every time I resist this and "just put it in the page for now," I regret it within two weeks.

### 6.1 `<StatusBadge status="pending" />`

Reads from `STATUS_STYLES` in `lib/constants.js`. Single source of truth for every status pill in the app. Used on Tithes list, RF list, Voucher list, Dashboard widgets.

### 6.2 `<PageHeader title="Tithes" description="..." actions={<Button />} />`

Every page has a header. Standardize it: title, optional description, optional action buttons on the right. Prevents every page from inventing its own header layout.

### 6.3 `<StatCard label="Total Tithes" value="₱125,430" trend="+12%" icon={Coins} />`

Dashboard summary cards. Takes a label, a primary value, an optional trend indicator, and an icon.

### 6.4 `<DataTable columns={...} data={...} />`

Wraps shadcn's Table component with sorting, pagination, empty state, and loading state built in. Used on every list page.

### 6.5 `<EmptyState icon={Inbox} title="No tithes yet" description="..." action={<Button />} />`

Shown when a list is empty. Never let a user see a blank page — always explain why it's empty and what to do next.

### 6.6 `<ConfirmDialog open={...} onConfirm={...} title="..." description="..." />`

For approve / reject / delete actions. Wraps shadcn's AlertDialog. All destructive or irreversible actions must go through this.

### 6.7 `<FormField label="..." htmlFor="..." error="...">`

Wraps Label + Input + error message. Ensures every form field in the app has identical spacing and error display.

---

## 7. Data Fetching Pattern

No React Query, no SWR — plain `useEffect` + custom hooks per feature. This is simpler for an intermediate dev, and we can migrate later if needed.

```js
// src/features/tithes/useTithes.js
export function useTithes(params) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getTithes(params)
      setData(res.data)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { refetch() }, [refetch])

  return { data, isLoading, error, refetch }
}
```

**Every list page gets one of these hooks.** The page component stays clean:

```jsx
function TithesPage() {
  const { data, isLoading, error, refetch } = useTithes({ status: 'pending' })
  // ... render
}
```

---

## 8. Loading, Error, and Empty States

**Every data-fetching page must handle all three states.** This is the #1 thing I forget as an intermediate dev.

- **Loading:** show skeleton loaders (shadcn's `<Skeleton />`) that match the shape of the eventual content. Do not show a spinner alone — it's jarring.
- **Error:** show an inline error card with a retry button. Use the `Alert` component from shadcn. Never leave the user with a blank page.
- **Empty:** show the `<EmptyState />` component. Explain why it's empty and what to do.

Loading → Error check → Empty check → Actual content. In that order, always.

---

## 9. Mobile Strategy

Target users by device:

- **Officers** (DO, Validator, Pastor, Auditor, Admin) — desktop-first. Data-heavy pages, tables, exports. Optimize for laptop.
- **Members** (Berna, Lourdes, Kiya) — mobile-first. Tithes submission and RF creation will mostly happen on phones after Sunday service.

### 9.1 Responsive Approach

Tailwind is mobile-first by syntax. Default classes = mobile. Prefix with `md:` (768px+) or `lg:` (1024px+) for larger screens.

- **Tables** on desktop become **card stacks** on mobile via `md:hidden` / `hidden md:block`.
- **Sidebar** is a permanent column on desktop, a `<Sheet />` drawer on mobile.
- **Forms** stack to single column on mobile, can go two-column on desktop (`grid grid-cols-1 md:grid-cols-2`).

### 9.2 Device Testing

Before marking a page "done," test in Chrome DevTools device toolbar at:

- iPhone 14 (390px)
- iPad (768px)
- Desktop (1440px)

If any of the three look broken, it's not done.

---

## 10. File Downloads (Excel / PDF)

Reports export as binary files. Pattern:

```jsx
const handleExportExcel = async () => {
  try {
    const response = await exportTithesExcel()
    const url = URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = `tithes-report-${new Date().toISOString().split('T')[0]}.xlsx`
    link.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    toast.error('Failed to export report')
  }
}
```

**Always include:**

1. Date in the filename (audit trail)
2. `URL.revokeObjectURL` to prevent memory leaks
3. Error handling with toast
4. The request itself must set `responseType: 'blob'` in `api.js`

---

## 11. Anti-Patterns to Reject

If I write any of these, Claude should stop me:

- **Hardcoded status colors in a component.** Always use `STATUS_STYLES` from `lib/constants.js`.
- **Inline API calls in components.** Always go through `services/api.js`.
- **Duplicate fetching logic.** Extract to a custom hook in `features/<name>/use<Name>.js`.
- **Direct `localStorage` access in components.** Go through `AuthContext`.
- **Hardcoded role strings.** Use the `ROLES` constant from `lib/constants.js`.
- **`any` escape hatches** (in TypeScript — but this project is JS, so N/A for now).
- **Pages over 100 lines.** Extract to `features/`.
- **Custom Tailwind classes in components/ui/.** Don't edit shadcn components directly for styling — customize via `className` prop at the usage site.
- **`console.log` in committed code.** Remove before commit.
- **Blank catches** (`catch (err) {}`). Always handle or re-throw.

---

## 12. Pages Roadmap

Build in this order — each one teaches the next.

1. **Login** — teaches form basics, AuthContext usage, shadcn Card pattern
2. **Layout shell** — Sidebar + Header + Outlet, teaches routing and role-filtered nav
3. **Dashboard (admin view first)** — teaches StatCard, data fetching pattern, loading states
4. **Tithes List** — teaches DataTable, StatusBadge, filtering, mobile card fallback
5. **Tithes Form** — teaches DenominationInput, computed totals, form validation
6. **Request Form List** — teaches complex status flow display, RFStatusStepper
7. **Request Form Create** — teaches multi-step form, file upload
8. **Voucher List** — similar to Tithes List, good reuse practice
9. **Expense List** — teaches manual entry dialog, category filtering
10. **Reports** — teaches date range pickers, export buttons, tabs
11. **User Management** — teaches CRUD modal pattern
12. **Categories** — simplest CRUD, good refactor opportunity

Don't skip ahead. Each page builds on patterns from the previous ones.

---

## 13. Update History

- **2026-04-10** — Initial frontend context. Established tech stack, folder structure, design system, auth flow, shared components list, mobile strategy, anti-patterns.
- **2026-04-10** — `feat/login` pushed. Shipped: Login page (`src/pages/Login.jsx`), reusable `LoginInput` component with password visibility toggle, `OauthButton` placeholder for Google/Facebook sign-in, Inter variable font installed via `@fontsource-variable/inter` and set as Tailwind v4 default via `--font-sans` theme token. Controlled form inputs wired with `useState` + `handleChange`; `handleSubmit` stub in place (fetch call pending). **Deviations from plan:** using `react-icons` instead of `lucide-react` (react-icons already installed); using `fetch` instead of `axios` per Adrian's preference.
- **2026-04-13** — `feat/layout-shell` pushed. Shipped: Dashboard wired with two chart widgets — `ChartAreaGradient` and `ChartBarExpense` (plus `ChartAreaInteractive` scaffolded) under `src/components/dashboard-components/`. Added shadcn primitives `card.jsx`, `chart.jsx`, `select.jsx` under `src/components/ui/`. Updated `--chart-*` tokens in `src/index.css` (light theme: blue/red/black brand palette; dark theme: shadcn defaults). Pinned `recharts` to `^3.8.0`.

---

*See also: [`CLAUDE.md`](./CLAUDE.md) for shared domain knowledge and workflow rules.*
