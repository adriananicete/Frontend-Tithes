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

## 13. Established Page Pattern (Tithes / RF / Voucher — follow for every new list page)

This is the real-world pattern the codebase has converged on. **When building a new feature page, don't reinvent the layout — mirror this.**

### 13.1 Folder layout per feature

Actual folder convention (supersedes the planned `features/<name>/` in §2):

```
src/components/<feature>-components/
  mockData.js                 ← mock arrays + statusConfig + formatPHP/formatDate/formatDateTime
  <Feature>SummaryStats.jsx   ← Card with CardHeader + CardContent grid of StatTile
  <Feature>Table.jsx          ← Card: header with filters, CardContent with Table, CardFooter with pagination
  <Feature>DetailsDialog.jsx  ← read-only details modal
  Create<Feature>Dialog.jsx   ← create/submit modal
  (optional) <Feature>PipelineTracker.jsx, PendingRfsCard.jsx, RejectDialog.jsx, etc.

src/pages/<Feature>.jsx       ← thin assembly (~30–50 lines): useState hoist, import components, layout
```

### 13.2 Page shell (copy verbatim)

```jsx
<div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto">
  {/* Header row: title block on left, CTA on right */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-semibold">Page Title</h1>
      <p className="text-sm text-muted-foreground">One-line description.</p>
    </div>
    <div className="w-40" onClick={() => launch()}>
      <CustomButton titleName="Create X" icon={GoPlus} />
    </div>
  </div>

  <FeatureSummaryStats />
  {/* optional: pipeline tracker, pending-action card */}
  <div className="h-[32rem]">
    <FeatureTable onViewItem={setViewing} />
  </div>

  <FeatureDetailsDialog item={viewing} open={!!viewing} onOpenChange={...} />
</div>
```

- **Gap rule:** `gap-5` between page sections, never mix.
- **Table height:** fixed `h-[32rem]` wrapper so rows scroll internally, not the whole page.
- **CTA button:** use the custom `@/components/Buttons.jsx` (react-icons `GoPlus`) wrapped in `<div className="w-40" onClick>`. Cancel/Submit inside dialogs still use shadcn `Button` for `variant`/`disabled` support.
- **Custom hook for dialog state** when the dialog needs to be launched from multiple places (CTA + pending card): hoist `open` and `preselectedId` to the page, pass as controlled props.

### 13.3 Modal (Dialog) pattern

```jsx
<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
  <DialogHeader>
    <DialogTitle>Submit New X</DialogTitle>
    <DialogDescription>One-line context.</DialogDescription>
  </DialogHeader>
  <form className="space-y-4"> ... </form>
</DialogContent>
```

- `overflow-x-hidden` is **required** — without it the `DialogFooter -mx-4` bleed causes a horizontal scrollbar when vertical scroll appears.
- `DialogTitle` default styling (`text-lg font-semibold`) is set in `components/ui/dialog.jsx`; do not override per modal.
- Form sections use `space-y-4`; label+input pairs use `space-y-1.5`; two-column rows use `grid grid-cols-2 gap-3`.
- File upload uses a **dropzone label** (hidden `<input type="file">`) + a list of uploaded file chips with remove button. No URL-string inputs for attachments.
- Remarks/notes fields use `<Textarea rows={3}>` (imported from `@/components/ui/textarea`).

### 13.4 Table pattern

- Outer `<Card className="w-full h-full flex flex-col">` so it fills the wrapper.
- `CardHeader` has two rows: title/description row, then filter row (`Input` search + `Select` filters).
- `CardContent className="flex-1 min-h-0 overflow-auto"` with `<TableHeader className="sticky top-0 bg-background z-10">`.
- `CardFooter` has `Showing X–Y of N` on left, Previous/Next pagination on right.
- Row action column uses `DropdownMenu` with a state-aware items array (items vary by row status — see `RfTable.jsx` `ActionMenu`).
- Status badges: `<Badge variant="secondary" className={cfg.color}>{cfg.label}</Badge>` where `cfg` comes from the feature's `statusConfig` in mockData.

### 13.5 Summary stats pattern

- `Card` → `CardHeader` (title + description) → `CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-3">` of `StatTile`.
- Each `StatTile` shows: label + icon top row, big `formatPHP(amount)` value, small `{count} unit` subtext.
- Pastel accent per tile via `accent="bg-blue-50/50"` style classes.
- For fixed-height cards (e.g., Voucher summary), use `h-auto lg:h-80` — hug content on narrow screens, fixed on desktop.

### 13.6 Mock data conventions

Every `mockData.js` exports:

- `mockCategories` (string array)
- `mock<Feature>s` (array of domain objects, with `id`, timestamps, nested `timeline` where applicable)
- `statusConfig` — `{ [status]: { label, color: "bg-X-100 text-X-700", order? } }`
- `formatPHP(n)` — `Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 })`
- `formatDate(d)` — `toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })`
- `formatDateTime(d)` — same + hour/minute

Keep payload shapes close to the backend Mongoose schemas in `CLAUDE.md` so the later swap to real API is a one-line change inside the hook/component.

### 13.7 Select (dropdown) conventions

- **Value must be the user-facing identifier**, not a numeric id. e.g., use `rfNo` (`"RF-0008"`), not `id` (`8`). Otherwise the trigger falls back to showing the raw value after selection.
- For multi-line items, wrap children in `<div className="flex flex-col items-start text-left ...">`. Set `<SelectTrigger className="h-auto py-2">` when items are multi-line.

### 13.8 Absolute rules

- **Never add horizontal scrollbars to modals** — always `overflow-x-hidden` alongside `overflow-y-auto`.
- **Never use solid-color status badges** — always the `bg-X-100 text-X-700` pastel pattern.
- **Never inline status strings in UI** — always go through `statusConfig`.
- **Never duplicate `formatPHP`/`formatDate`** — import from the feature's `mockData.js` (or later, `lib/formatters.js` after migration).
- **TODO comments point to the real API endpoint** (e.g., `// TODO: POST /api/vouchers`). Mock `console.log` payloads stay until the feature is wired to the backend.

---

## 14. Update History

- **2026-04-10** — Initial frontend context. Established tech stack, folder structure, design system, auth flow, shared components list, mobile strategy, anti-patterns.
- **2026-04-10** — `feat/login` pushed. Shipped: Login page (`src/pages/Login.jsx`), reusable `LoginInput` component with password visibility toggle, `OauthButton` placeholder for Google/Facebook sign-in, Inter variable font installed via `@fontsource-variable/inter` and set as Tailwind v4 default via `--font-sans` theme token. Controlled form inputs wired with `useState` + `handleChange`; `handleSubmit` stub in place (fetch call pending). **Deviations from plan:** using `react-icons` instead of `lucide-react` (react-icons already installed); using `fetch` instead of `axios` per Adrian's preference.
- **2026-04-13** — `feat/layout-shell` pushed. Shipped: Dashboard wired with two chart widgets — `ChartAreaGradient` and `ChartBarExpense` (plus `ChartAreaInteractive` scaffolded) under `src/components/dashboard-components/`. Added shadcn primitives `card.jsx`, `chart.jsx`, `select.jsx` under `src/components/ui/`. Updated `--chart-*` tokens in `src/index.css` (light theme: blue/red/black brand palette; dark theme: shadcn defaults). Pinned `recharts` to `^3.8.0`.
- **2026-04-13** — `feat/request-form-page` pushed (covers both Request Form and Voucher pages). Shipped: (1) **Request Form page** — `src/pages/RequestForm.jsx` assembled from `src/components/request-form-components/`: `mockData.js` (16 mock RFs across 7 statuses + pipelineStages + statusConfig + formatters), `RfSummaryStats` (4 KPI tiles: Active/Pending Disbursement/Approved/Rejected), `RfPipelineTracker` (horizontal clickable stages that filter the table + separated Rejected stage), `RfTable` (search + status + category filters, state-aware action menu per row status, pagination), `RfDetailsDialog` (full approval timeline with done/current/upcoming/rejected states + rejection note card), `CreateRfDialog` (Save as Draft vs Submit for Validation dual-action footer, multi-URL attachments), `RejectDialog` (shared for validate/approve stages). Page hoists `activeStatus` + `viewingRf` state for cross-component wiring. (2) **Voucher page** — `src/pages/Voucher.jsx` assembled from `src/components/voucher-components/`: `mockData.js` (3 mock vouchers + 4 approved RFs awaiting voucher + voucherStatusConfig), `VoucherSummaryStats` (4 tiles: Total Issued/Pending Receipt/Disbursed/RFs Awaiting Voucher, `h-auto lg:h-80` responsive height), `PendingRfsCard` (clickable grid of approved RFs that launches pre-filled CreateVoucherDialog), `VoucherTable` (search + status + category filters), `VoucherDetailsDialog` (voucher + linked RF summary card + receipts), `CreateVoucherDialog` (controlled-or-uncontrolled modal supporting `preselectedRfId`; Select dropdown keyed on `rfNo` so trigger shows "RF-0008"; file upload dropzone for receipts with multi-file support; optional remarks/notes Textarea). (3) **Shared tweaks** — `src/components/ui/dialog.jsx` DialogTitle default bumped to `text-lg font-semibold`; all modals set `overflow-x-hidden` to kill the horizontal scrollbar caused by DialogFooter's `-mx-4` bleed; `src/components/ui/textarea.jsx` added. `src/components/layout/Header.jsx` brand text updated to "JOSCM Tithes Management System". (4) **Documentation** — new §13 "Established Page Pattern" codifies the page shell, modal pattern, table pattern, summary-stats pattern, mock-data conventions, Select conventions, and absolute rules so future list pages are built consistently without re-deriving the layout.
- **2026-04-13** — `feat/dashboard-stats` pushed. Shipped: (1) Dashboard expansion — `SummaryStats.jsx` (4 KPI tiles: Tithes/Expenses/Net/Pending) and `RecentActivity.jsx` (filterable + paginated activity table with sticky header, type dropdown, 10/page pagination) under `src/components/dashboard-components/`. (2) Full Tithes page build — `src/pages/Tithes.jsx` composed from five new components under `src/components/tithes-components/`: `TithesTrendChart` (area chart with 7D/30D/90D/1Y range presets + service type filter + computed stats footer), `TithesSummary` (4 status KPI tiles), `ServiceTypeBreakdown` (horizontal bar chart, % distribution), `TithesTable` (search + status + service filters, status badges via shadcn Badge, row action dropdown, details dialog showing denominations breakdown, pagination), `SubmitTithesDialog` (modal triggered by custom `Buttons.jsx` component; form with entryDate, serviceType, 9 denomination rows ₱1000–₱1 with auto-computed subtotals + total, remarks). (3) Layout refactor — `Header.jsx` simplified to global chrome only (logo, search, date, icons); per-page greeting/action headers adopted in `Dashboard.jsx` and `Tithes.jsx` so each page owns its own action button (e.g., Tithes owns `SubmitTithesDialog`). Fixed `Dashboard.jsx` outer from `h-full` to `flex-1 min-h-0` so Layout's flex-col correctly allocates remaining space after Header. Added shadcn primitives: `table, dialog, input, label, popover, calendar, dropdown-menu, badge`. **Deviations:** Tithes submit trigger uses the existing custom `Buttons.jsx` (wrapped in clickable div, Dialog controlled via `open` state) per Adrian's request, while Cancel/Submit inside the dialog stay as shadcn Button for `variant`/`type`/`disabled` support.
- **2026-04-15** — `feat/expense` pushed and merged (PR #5). Shipped: full admin-route pages with mock data — `Expense.jsx` (SummaryStats, TrendChart, CategoryBreakdown, Table, Details + RecordExpense dialogs), `Categories.jsx` (SummaryStats, Table, FormDialog, ConfirmActionDialog), `Reports.jsx` (DateRangePicker, ExportBar, PreviewTable, ReportSummary, tithes/expense tabs), `Users.jsx` (SummaryStats, Table, Create/Edit/Details/ConfirmAction dialogs). All follow §13 established page pattern.
- **2026-04-15** — `feat/auth-rbac` pushed and merged (PR #6). Shipped auth + RBAC foundation: (1) **AuthContext primitives** — `src/context/AuthContext.jsx` (user/token/isLoading state, rehydrates from localStorage on mount, login/logout API), `src/hooks/useAuth.js`, `src/routes/ProtectedRoute.jsx` (waits on isLoading to avoid redirect flash, optional `allowedRoles` prop), `src/services/api.js` (fetch wrapper with Authorization header injection and global 401 auto-logout). `main.jsx` wrapped in `<AuthProvider>`. (2) **Routing refactor** — `App.jsx` restructured to nested `<ProtectedRoute>` matching §4: `/login` public, everything else gated; Voucher allowed for admin/do/validator/auditor; Expense for admin/auditor; `/admin/*` for admin only; `*` → `/dashboard` fallback. (3) **RBAC helpers** — `utils/rolePermissions.js` extended with `ROLES`, `ROLE_LABELS`, `MOCK_USERS`, and a `can` matrix that mirrors backend ACLs from `CLAUDE.md` (approveTithes with conflict-of-interest check, validateRf/approveRf/rejectRf, createVoucherFromRf, recordManualExpense, viewExpenseReport, etc.). (4) **Sidebar + SideBarHeader wired to auth** — `Sidebar.jsx` uses `getNavItemsForRole(user.role)` so each role sees only their allowed nav items; `SideBarHeader.jsx` shows `user.name` + `ROLE_LABELS[user.role]` and adds a logout button (clears localStorage → redirects to `/login`); removed the hardcoded "Create User" CTA that didn't belong in global chrome. (5) **In-page gating** — CTAs hidden via `can.*` checks: Create Voucher + Approved-RFs-Awaiting-Voucher card visible to admin/validator only; Record Expense visible to admin only; Reports Expense tab hidden for members (with fallback `effectiveTab` so direct tab prop can't leak). Row-action dropdowns: `RfTable.ActionMenu` now receives `role` + `currentUserName` and filters items per backend ACL (validate/approve/reject/createVoucher), owner-only draft edit/submit/delete and voucher_created receipt confirmation. `TithesTable` approve/reject items honor conflict-of-interest (`submittedBy !== user.name`) and are hidden from members entirely. Route paths `/voucher`, `/expense`, `/admin/users`, `/admin/categories` double-gated via ProtectedRoute even if someone edits the URL directly. **Note:** initial commit replaced `pages/Login.jsx` with the role-picker UI — reverted on `feat/dev-role-picker` (see next entry) since Adrian's original design should be preserved.
- **2026-04-15** — `feat/dev-role-picker` pushed. Shipped: (1) Restored `pages/Login.jsx` to its original email/password + OAuth design (Adrian's work preserved — the role-picker replacement from `feat/auth-rbac` was reverted). (2) New `pages/DevRolePicker.jsx` — standalone dev-only page that lists `MOCK_USERS` as clickable cards; calls `login(mockUser, mock-<role>-token)` and routes to `/dashboard`. (3) `App.jsx` adds public route `/dev-login` pointing to the new component. **Convention going forward:** when dev tooling needs a different UI, add a new component/route rather than overwriting a styled page. Real `/api/auth/login` integration remains a one-line change inside `Login.handleSubmit` when backend wiring starts.
- **2026-04-16** — `feat/mobile-tables` pushed. Branch 2 of 3 in the mobile-responsive rollout. Shipped: mobile card-stack fallback on all 7 data tables so list pages are usable on phones without horizontal scroll. Applied pattern: (1) desktop table wrapped in `<div className="hidden md:block">`; (2) mobile card list in `<div className="md:hidden -mx-4 divide-y border-t">` (the `-mx-4` cancels `CardContent`'s default padding so rows go edge-to-edge); (3) each card shows a primary identifier + 1–2 secondary fields + status badge + row-action dropdown; (4) filter row now stacks with `flex flex-col sm:flex-row sm:flex-wrap`, inputs/selects become `w-full sm:w-X`; (5) footer goes `flex flex-col-reverse sm:flex-row`, verbose "Showing X–Y of N" gated `hidden sm:block`, Prev/Next pair becomes full-width on mobile. Tables refactored: `TithesTable`, `RfTable` (kept existing state-aware `ActionMenu`), `VoucherTable`, `ExpenseTable`, `UsersTable` (two-row layout — avatar+name/email on top, role+status badges on bottom), `CategoriesTable` (color dot next to name on mobile card), `ReportPreviewTable` (dual rendering per `tab` prop — tithes vs expense). Extracted `RowActions` helper inside each file so desktop table rows and mobile cards share one dropdown definition. **Note:** no `RequestSummaryTable` exists — the plan mention was conditional. Login remains untouched.
- **2026-04-16** — `feat/mobile-pages-dialogs` pushed. Branch 3 of 3 in the mobile-responsive rollout — closes the mobile refactor. Shipped: (1) **Page shells** — every `src/pages/*.jsx` (except `Login.jsx`) updated: header rows go `flex flex-col sm:flex-row sm:items-center justify-between gap-3` so title block and CTA stack on mobile; titles drop to `text-xl md:text-2xl`; CTA wrappers `w-40` / `w-44` → `w-full sm:w-40` / `w-full sm:w-44` so primary actions span the full mobile width; data-table containers `h-[32rem]` → `h-[24rem] md:h-[32rem]` for tighter mobile viewports; chart containers `h-96`/`h-80` → `h-72 md:h-96`/`h-72 md:h-80`. Same CTA pattern applied inside the dialog triggers `SubmitTithesDialog` and `CreateRfDialog`. (2) **Dashboard** — `Dashboard.jsx` arbitrary widths replaced: `w-110`/`w-110`/`flex-1 h-98` row → `grid grid-cols-1 lg:grid-cols-3 gap-5` with `min-w-0` children so charts stack on mobile and tablet, three across on desktop; header `text-[25px]` → `text-xl md:text-[25px]`; "Add Category" button `w-33` → `w-full sm:w-36`. (3) **SummaryStats grid** — `RfSummaryStats` aligned with the established pattern: `grid-cols-2 gap-3` → `grid grid-cols-2 lg:grid-cols-4 gap-3` (Categories/Users/Expense/Voucher/Dashboard SummaryStats already conformed). (4) **Form & details dialogs** — internal two-column layouts go `grid grid-cols-2` → `grid grid-cols-1 sm:grid-cols-2` across `SubmitTithesDialog`, `CreateRfDialog`, `CreateVoucherDialog`, `RecordExpenseDialog`, `UserDetailsDialog`, `RfDetailsDialog`, `ExpenseDetailsDialog`, `VoucherDetailsDialog`; full-width sub-rows updated `col-span-2` → `sm:col-span-2` so they match the new mobile single-column flow. `CreateVoucherDialog` and `CreateRfDialog` footers had hardcoded `flex gap-2` overriding the primitive's responsive default — overrides removed so footers inherit `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end` from `dialog.jsx` (primary action sits on top when stacked on mobile). Confirm/Reject dialogs and Create/Edit User + Category dialogs already used single-column forms and the default footer — no changes needed. (5) **Verification** — `vite build` clean (no new warnings); spot-checked at 390/768/1440. **Note:** `Login.jsx` and shared `dialog.jsx` primitive untouched. Mobile rollout complete.
- **2026-04-16** — `fix/dashboard-mobile-recent-activity` pushed. Follow-up to the mobile rollout — Adrian flagged `RecentActivity` invisible on the admin Dashboard at mobile width. Two root causes: (1) `Dashboard.jsx` outer wrapper was missing `overflow-auto` (every other page had it), so when the three chart tiles stacked vertically on mobile they consumed the entire viewport and the trailing `<RecentActivity />` (sized `flex-1 min-h-0`) collapsed to 0px with nowhere to scroll. Added `overflow-auto` and gave the wrapper `h-[28rem] md:flex-1 md:min-h-0` so it has a guaranteed mobile height while keeping its desktop "fill remaining space" behavior. (2) `RecentActivity` was the one data table missed during Branch 2 (`feat/mobile-tables`) because it lives in `dashboard-components/`, not a feature folder — its 7-column desktop table was horizontally scrolling inside `CardContent` on phones. Applied the established Branch 2 mobile card-stack pattern: desktop `<Table>` wrapped in `hidden md:block`; new `md:hidden -mx-4 divide-y border-t` card list per row showing user (font-medium) + action badge on top, `type · ref` subtitle, then role badge + date + amount on the bottom row; CardHeader filter Select goes `w-full sm:w-40` inside `flex flex-col sm:flex-row sm:flex-wrap`; CardFooter pagination matches the rest of the codebase (`flex flex-col-reverse sm:flex-row`, "Showing X–Y" gated `hidden sm:block`, Prev/Next pair `w-full sm:w-auto`). `vite build` clean.
- **2026-04-16** — `feat/mobile-layout-shell` pushed. Branch 1 of 3 in the mobile-responsive rollout. Shipped: (1) **shadcn `Sheet` primitive** added at `src/components/ui/sheet.jsx` (base-ui Dialog-based, left/right/top/bottom sides, used for the mobile nav drawer). (2) **`Layout.jsx`** — removed hardcoded `w-[95%] h-[95%]` in favor of `w-full h-full md:w-[95%] md:h-[95%]` so the shell goes full-bleed on mobile and keeps the framed desktop look at `md:`+. Hoisted `sidebarOpen` state and passed it to `Header` (trigger) and `MobileSidebar` (content). Reduced gap/padding on mobile (`gap-4 md:gap-8`, `p-3 md:p-5`). (3) **`Sidebar.jsx`** — extracted reusable `SidebarBody` (logo/user header + role-filtered nav links) so desktop and mobile share one source of truth. Default export `Sidebar` is now `hidden md:flex` (desktop fixed `w-96` column preserved). New named export `MobileSidebar` wraps `SidebarBody` in `<Sheet side="left">` with `showCloseButton={false}` and an `sr-only` SheetTitle for a11y; nav clicks auto-close the drawer via `onOpenChange(false)`. (4) **`Header.jsx`** — added `FiMenu` hamburger (`md:hidden`) that triggers `onOpenSidebar`. Brand text collapses to "JOSCM Tithes" on `<sm` screens via paired `hidden sm:inline` / `sm:hidden` spans. Search bar hidden on `<sm` and replaced with a `CiSearch` icon button; on `sm+` the search expands `w-48 lg:w-70`. Share icon and full date label hidden on narrow screens (`hidden sm:block` / `hidden lg:block`). Outer flex gaps reduced on mobile (`gap-3 md:gap-5`). (5) **Verification** — tested at 390px/768px/1440px via Chrome DevTools; no horizontal scroll on mobile; desktop experience unchanged. **Note:** `Login.jsx` intentionally untouched (already mobile-friendly, preserved per design rule).

---

*See also: [`CLAUDE.md`](./CLAUDE.md) for shared domain knowledge and workflow rules.*
