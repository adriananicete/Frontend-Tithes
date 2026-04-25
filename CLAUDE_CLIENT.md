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

- **2026-04-25** — `feat/dashboard-real-data` pushed. Final post-rollout wiring — Dashboard tiles, charts, and activity feed now read live data instead of the hardcoded mock blocks shipped with `feat/dashboard-stats` / `feat/layout-shell`. (1) **New `src/hooks/useDashboardData.js`** — single hook that owns role-aware parallel fetch via `Promise.all`. Always pulls `/tithes` + `/request-form` (every authenticated role can hit those — backend filters RFs to own when the caller is a member). Conditionally pulls `/expenses` (admin/auditor only, matches `can.viewExpense`) and `/vouchers` (validator/do/auditor/admin per `voucherController.getAllVouchers`); skipped endpoints resolve to `null` so `Promise.all` doesn't reject and the page never generates console-noisy 403s. Exposes `canViewExpenses` / `canViewVouchers` flags so the page can hide tiles + charts the user can't populate. Single shared `loading` / `error` / `refetch` for the whole page (per-source loading states would just thrash the UI on Dashboard's three side-by-side tiles). (2) **New `src/components/dashboard-components/dashboardUtils.js`** — codifies the aggregation that backend doesn't do: `buildActivity` walks tithes + RFs + vouchers and emits ONE entry per record reflecting its current state (e.g. an approved tithe = "Approved" by `reviewedBy.name` at `reviewedAt`; a rejected RF = "Rejected" by `rejectedBy.name` at `rejectedAt`; a voucher = "Created" by `createdBy.name`). Drafts are intentionally skipped (not "activity"). The result is sorted by date desc and consumed by `RecentActivity`. Same module also exports `formatPHP` / `formatActivityAmount` / `formatActivityDate` / `sumWithinDays` / `sumWithinRange` / `monthOverMonthTrend` so the four child components stay slim. (3) **`SummaryStats`** — accepts `tithes` / `expenses` / `rfs` / `canViewExpenses` props, computes "this month" + "last month" buckets via `sumWithinDays` / `sumWithinRange` on a 30-day window, and surfaces month-over-month trend % per tile. Tithes tile uses approved-only entries (pending/rejected aren't actual receipts). For roles without expense visibility, the Total Expenses + Net Balance tiles render "—" instead of being hidden so the 2x2 grid stays balanced; "Pending Approvals" counts RFs in `submitted` or `for_approval` status from whatever the backend returned (naturally role-aware since the backend already filters per role). Card footer copy switches based on cash-flow state so it's no longer a hardcoded "Healthy cash flow this month" lie. (4) **`RecentActivity`** — accepts `activity` / `loading` / `error` props instead of generating its own mock array. Type filter trimmed from 7 options to 3 (`Tithes` / `Voucher` / `Request Form`) since `Category` / `User` / `Reports` activity would require a real audit-log model that the backend doesn't have. Loading/error/empty states render in the empty row slot for both desktop and mobile views. Defensive role/action style lookups fall back to gray instead of crashing on unknown values. (5) **`ChartAreaGradient`** — drops the 12-row hardcoded mock; new `buildMonthlySeries` walks back 12 months from today, buckets approved tithes by `reviewedAt` year-month and expenses by `date` year-month, and zero-fills gaps so the line stays continuous. Title "Trending up by 5.2% this year" was a literal hardcoded number — now derived from `(last.tithes - first.tithes) / first.tithes`, with sign + label flipping for downtrends. The "Compare with Expenses" toggle is hidden entirely for roles without expense visibility (was previously rendered but would have shown a flat zero line). Period label ("Apr 2025 – Apr 2026") computed from the actual series bounds. (6) **`ChartBarExpense`** — accepts `expenses` prop, groups by `category?.name` (no longer assumes `category` is a string), filters to the last 6 months. Empty state added for when no expenses fall in that window. Footer "Trending up by 5.2%" hardcoded line stripped; now shows category count + total. (7) **`Dashboard.jsx`** — mounts `useDashboardData(user.role)`, derives `activity` via `useMemo`, pipes everything down. Charts grid switches from `lg:grid-cols-3` to `lg:grid-cols-2` for roles that can't see expenses (so the layout stays balanced when `ChartBarExpense` is hidden). Welcome subtitle "We have 2 Pending Tasks and 5 New Records" was hardcoded — replaced with a generic snapshot line. Voucher quick-action dialog finally gets its `onSubmit` wired (closes the TODO flagged in the `feat/dashboard-mobile-button-grid` update entry); after voucher creation or tithes submission, `refetch()` re-runs all 4 dashboard fetches so SummaryStats + RecentActivity update without a page reload. (8) **`ChartAreaInteractive.jsx` deleted** — was scaffolded with `feat/layout-shell` but never imported anywhere (verified via grep), and shipped with random "Desktop/Mobile" visitor data that has nothing to do with church finances. Per CLAUDE.md "no half-finished implementations". (9) **Backend gaps flagged, not blocking merge:** (a) No audit log — `RecentActivity` can only show transitions on records the backend already exposes (tithes/RFs/vouchers); admin actions like creating a category, deactivating a user, or exporting a report don't surface. A small `AuditLog` model with `action` / `actor` / `targetType` / `targetId` / `createdAt` and middleware that writes one entry per mutation would unlock the original 7-type filter. Not a near-term priority. (b) RF schema still has no `submittedAt` / `voucherCreatedAt` / `receivedAt`, so submitted/disbursed activity entries fall back to `updatedAt` (still correct, just less descriptive than a per-stage timestamp would be). Same backend gap previously flagged on the RF wiring branch. (10) **Net file count** — added 2 (`useDashboardData.js`, `dashboardUtils.js`), edited 5 (`SummaryStats`, `RecentActivity`, `ChartAreaGradient`, `ChartBarExpense`, `Dashboard.jsx`), deleted 1 (`ChartAreaInteractive.jsx`). `vite build` clean (5.58s). No new pages or component folders introduced. With this branch + the empty-case cleanup that landed earlier today, every page in the app now consumes real backend data; no mock-only views remain.
- **2026-04-25** — `feat/strip-empty-case-workarounds` pushed. Frontend follow-up to `Backend-Tithes#feat/normalize-empty-list-responses` (merged earlier today). Backend now returns `200` with the normal success shape on every list endpoint when the collection is empty (just with `count: 0` / `data: []` / raw `[]`), so the per-endpoint empty-message workarounds shipped during the Real Data Rollout are dead weight. (1) **`useCategories`** — dropped `if (err.message === "Empty") setCategories([])` and the explanatory comment; the existing `Array.isArray(res) ? res : []` line handles the new `200 []` cleanly. (2) **`useUsers`** — dropped `if (err.message === "Users Not Found!") setUsers([])`. (3) **`useTithes`** — dropped the multi-line `if (err.message === "Tithes is Empty") { setTithes([]); setTotalBalance(0); }` block; the success path's `res?.totalBalance ?? 0` already returns 0 from the backend's reduce-on-empty. (4) **`useRequestForms`** — dropped `if (err.message === "Request form empty") setRfs([])`. (5) **`useExpenses` + `useVouchers`** — no behavioral change needed (these never threw, the backend was already returning 200 on empty), but tightened the body from the verbose `if (Array.isArray(res?.data)) setX(res.data); else setX([]);` pattern to the one-line ternary used elsewhere in the codebase, and removed the now-stale comment in `useExpenses` that referenced the old `200 { message: "Expense Data empty" }` shape. (6) **No page-level changes** — none of the pages or display components ever read the empty-message shape directly; the workaround was hook-only. `vite build` clean (11.11s). **Net:** 4 catch branches removed, 6 hooks now share an identical fetch shape, and the codified Real Data Rollout pattern in `project_real_data_rollout.md` is finally what the codebase actually does (no more "and-also-handle-this-empty-message" footnote per hook).
- **2026-04-25** — `feat/expense-real-data` pushed. Sixth and final real-data wiring — closes the rollout (Categories → Voucher → Users → Tithes → RF → Expense). Bundled the previously-uncommitted RF Update History entry into this branch's first commit since it was sitting on `main` unpushed when the branch was cut. **Companion backend PR landed first** (`Backend-Tithes#feat/expense-remarks-and-deep-populate`): added `remarks: { type: String }` to the Expense schema; deepened `getAllExpenses` populate so `linkedId → Voucher → rfId → RequestForm → requestedBy/approvedBy` arrives in one trip; `createManualExpense` now accepts `remarks` from the body. Frontend changes: (1) **New `src/hooks/useExpenses.js`** — `GET /expenses` (handles backend's `200 { message: "Expense Data empty" }` by checking `Array.isArray(res?.data)`, mirroring the empty-case workarounds shipped on the prior 5 branches) plus `createExpense(payload)` that POSTs JSON then refetches. (2) **`src/pages/Expense.jsx`** — owns `useExpenses()` and `useCategories()`; filters categories to `type === "expense" && isActive !== false` (same client-side filter as RF) and only mounts `RecordExpenseDialog` when `can.recordManualExpense(role)` is true so the hook + categories are not dragged onto the page for non-admin roles. Pipes `expenses/loading/error` down to all 4 display components. (3) **`mockData.js`** — stripped `mockExpenses` (23 rows), `mockExpenseCategories` (7 strings), `mockLinkedVouchers` (12 PCF→RF lookup); kept `sourceConfig`, `formatPHP`, `formatDate`, `formatDateTime` as shared lookups; formatters now defensively handle null/undefined input. (4) **`ExpenseTable`** — accepts `expenses/loading/error` props; keys rows on `_id`; reads populated refs (`e.category?.name`, `e.recordedBy?.name`, `e.linkedId?.pcfNo`); search now reaches into objects (category name, recordedBy name, linkedId.pcfNo, remarks); category filter options derived from the live data via `useMemo` (no more hardcoded `mockExpenseCategories`); single `emptyText` const renders loading/error/empty in both desktop's empty row slot and mobile card list. (5) **`ExpenseSummaryStats`** — accepts `expenses` prop, computes 4 tiles + Auto-vs-Manual split via `useMemo`. (6) **`ExpenseTrendChart`** — drops the 365-day mock generator; buckets real expenses by `date` (YYYY-MM-DD) and walks back from today over the selected range with zero-fill for gaps (same shape as the tithes chart). Source filter (`all` / `voucher` / `manual`) replaces the old per-row `voucher`/`manual` keys; trend% calc guards divide-by-zero. (7) **`ExpenseCategoryBreakdown`** — derives bars from `e.category?.name`; renders an explicit "No expenses to display" empty state when the array is empty (recharts otherwise renders an awkward zero-height chart). (8) **`ExpenseDetailsDialog`** — `mockLinkedVouchers` lookup gone. Reads the deep populate directly: `expense.linkedId.pcfNo`, `expense.linkedId.rfId.rfNo`, `expense.linkedId.rfId.requestedBy.name`, `expense.linkedId.rfId.approvedBy.name`. (9) **`RecordExpenseDialog`** — refactored to controlled-or-uncontrolled per the established pattern (CreateVoucherDialog / SubmitTithesDialog / CreateRfDialog) so a future Dashboard quick-action can mount it programmatically. Accepts `categories` + `onSubmit` props; Select keys on `_id` (backend requires ObjectId); async submit + busy + inline error state; `remarks` only sent if non-empty (matches backend's optional behavior). (10) **Backend gaps still flagged, not blocking merge:** (a) `GET /expenses` should return `200 { status: "Success", count: 0, data: [] }` on empty instead of `200 { message: "Expense Data empty" }` so the frontend workaround can be removed (sixth feature in a row hitting an inconsistent empty-case shape — one cleanup PR could normalize all six endpoints: categories, users, tithes, RF, vouchers, expenses). (b) `POST /expenses` returns the unpopulated raw doc — fine because the hook always refetches, but inconsistent with most read endpoints. (11) **Real Data Rollout complete** — the 6-feature rollout codified in `project_real_data_rollout.md` is done. No more pages with mock-only data. **Pattern recap (for future feature branches):** hook owns fetch + mutations + empty workaround → page mounts hook + filters categories → display components accept arrays as props and recompute derived state via `useMemo` → dialogs are controlled-or-uncontrolled, accept async `onSubmit`, surface errors inline; never hardcode IDs/names from mocks; always read populated refs through optional chaining. `vite build` clean (9.79s, no new warnings).
- **2026-04-20** — `feat/request-form-real-data` pushed. Fifth real-data wiring (Categories → Voucher → Users → Tithes → RF). RF is the largest of the rollout — full approval chain with 9 backend endpoints. (1) **New `src/hooks/useRequestForms.js`** — owns `GET /request-form` (handles `404 { error: "Request form empty" }` as `[]`, mirroring the pattern in useTithes/useUsers/useCategories) plus `createRf` / `updateRf` / `deleteRf` / `submitRf` / `validateRf` / `approveRf` / `rejectRf(id, note)` / `markRfReceived` mutations that refetch on success. Adds `createAndSubmitRf(payload)` that chains `POST /request-form` → `PATCH /:id/submit` so the dialog's "Submit for Validation" button only triggers one refetch instead of two (the dialog otherwise had to await `createRf` to learn the new `_id`, then call `submitRf` separately). (2) **`src/pages/RequestForm.jsx`** — owns both `useRequestForms()` and `useCategories()`; filters categories to `type === "rf" && isActive !== false` (backend's `GET /admin/categories` returns all types regardless of context, no query param) before passing them to the create dialog and table filter. Pipes `rfs/loading/error` and the eight async callbacks down. (3) **`mockData.js`** — stripped `mockRfs` (16-item array) and `mockCategories`; kept `statusConfig`, `pipelineStages`, `formatPHP`, `formatDate`, `formatDateTime` as shared lookup constants. Formatters now defensively handle null/undefined input. (4) **`RfTable`** — accepts `rfs/categories/loading/error` + all action callbacks as props. Reads populated refs (`rf.requestedBy.name`, `rf.category.name`); ownership check switched from string-name compare (`rf.requestedBy === user.name`) to ID compare (`rf.requestedBy._id === user.id`) so name collisions can't grant edit/delete rights. ActionMenu now wired — Edit opens a controlled CreateRfDialog in edit mode; Submit/Validate/Approve/Mark Received fire hook mutations through a shared `runAction` wrapper that surfaces backend errors in a red helper line at the top of the card. Destructive actions (Delete, Submit, Mark Received) gated behind `window.confirm()` for safety; Reject uses the existing dialog. Create Voucher routes to `/voucher` since the actual voucher creation (multipart receipts) lives there — duplicating that flow inside the RF table would diverge. (5) **`CreateRfDialog`** — refactored to controlled-or-uncontrolled (per the established pattern from `SubmitTithesDialog` / `CreateVoucherDialog`); accepts `editingRf` prop to double as the edit dialog. Categories now read from props (RF-typed only); URL-attachment array UI removed (backend Cloudinary upload for RF attachments is a separate future story — schema accepts `attachments: [String]` so empty array is a valid payload today). Async submit handlers track `submitting` + `error` state; backend error message renders inline above the footer; "Save as Draft" calls `onCreateDraft`, "Submit for Validation" calls `onCreateAndSubmit`, edit mode calls `onUpdate(id, payload)`. (6) **`RejectDialog`** — same async-aware refactor (submitting + error state, busy label, gracefully handles populated `rf.category` object vs legacy string). (7) **`RfDetailsDialog`** — timeline rebuilt around status order. Backend has only three real timestamps in the RF schema (`createdAt`, `validatedAt`, `approvedAt`, plus `rejectedAt` on rejected) — no `submittedAt`, `voucherCreatedAt`, or `receivedAt`, so previous mock-driven `timeline.*` lookups would always be empty. New approach: each stage declares its `timestampField` (or `null` for derived stages) and the stage's done/current/upcoming state comes from comparing its `statusConfig.order` against the current RF's order. People names read from populated refs (`validatedBy.name`, `approvedBy.name`, `rejectedBy.name`); voucher number reads from populated `voucherId.pcfNo`. Last-stage divider hidden so the timeline doesn't dangle. (8) **`RfPipelineTracker` + `RfSummaryStats`** — accept `rfs` prop, recompute live via `useMemo`. SummaryStats' "this month" buckets use real `approvedAt` / `rejectedAt` (with `updatedAt` fallback) instead of "all matching status" so the "This Month" labels are now accurate. (9) **Backend gaps flagged, not blocking merge:** (a) `GET /request-form` should return `200 []` on empty instead of `404 { error: "Request form empty" }` — fifth feature in a row hitting this; consider one global cleanup PR. (b) `getAllRequestForms` populates `requestedBy/category/approvedBy/validatedBy/voucherId` but **not** `rejectedBy` — only the reject endpoint populates it. Means rejected RFs in the list endpoint show a raw ObjectId where the timeline expects a name. Frontend renders gracefully (no name shown) but worth populating in `requestFormRoutes.js#getAllRequestForms` for consistency. (c) Schema has no `submittedAt`, `voucherCreatedAt`, `receivedAt` timestamps — submission/voucher/disbursement transitions only mutate `status`. Adding these would let the timeline show real per-stage moments instead of just "this stage is done"; minor UX polish. (d) `validateRf` / `approveRf` / `rejectRf` return reduced response bodies (only `rfNo`, `status`, `*By`, `*At`) instead of the full updated RF — fine because the hook always refetches, but inconsistent with the create/update endpoints which return the full document. (10) **One eslint-flavored fix during build** — RfTable initially imported `useNavigate` from `react-router-dom`, but the project standardized on `react-router` (v6 modular import — no `-dom` suffix anywhere else in the codebase). Switched to `react-router` and `vite build` is clean. **Pattern note:** the controlled-or-uncontrolled dialog pattern (used here for CreateRfDialog edit mode) is now established across three feature dialogs and should be the default whenever a dialog needs both a feature-page launcher and a programmatic launcher.
- **2026-04-20** — `feat/voucher-real-data` pushed and merged (PR #19). Swapped Voucher page + Dashboard Create Voucher button to real `/api/vouchers` with multipart receipt uploads against the Cloudinary flow shipped in `Backend-Tithes#feat/voucher-cloudinary-receipts`. (1) **`src/services/api.js`** — `apiFetch` now skips `Content-Type` when `body instanceof FormData` (so the browser sets the multipart boundary) and skips JSON-stringify; JSON path unchanged. (2) **`src/hooks/useVouchers.js`** — `GET /vouchers` (handles `{ message: 'Voucher empty' }` 200 as `[]`), `createVoucher(formData)` POST then refetch. (3) **`CreateVoucherDialog`** — fetches `GET /request-form?status=approved` on open, filters out RFs with `voucherId` already set; Select keys on real `_id`; builds FormData with `rfId`, `category` (RF's category `_id`), `amount`, `remarks`, `receipts[]` File objects; file input restricted to `image/jpeg,image/jpg,image/png,image/webp` with copy "JPG, PNG, WebP — up to 5 files, 10MB each"; surfaces backend errors inline. (4) **Display components** — `PendingRfsCard`, `VoucherSummaryStats`, `VoucherTable`, `VoucherDetailsDialog` all key on `_id` and read populated refs (`v.pcfNo`, `v.category.name`, `v.createdBy.name`, `v.rfId.rfNo`, `v.rfId.requestedBy.name`, etc.); receipts rendered as `<img>` since backend now stores Cloudinary secure URLs. (5) **`Voucher.jsx`** uses `useVouchers()` plus an inline fetch for `approvedRfs`; **`Dashboard.jsx`** Create Voucher button uses an inline `createVoucher` (same rationale as Add Category — avoid mounting the hook for non-admins). (6) **`mockData.js`** — `mockVouchers` / `mockApprovedRfs` / `mockCategories` removed; `voucherStatusConfig`, `formatPHP`, `formatDate`, `formatDateTime` retained as shared lookups.
- **2026-04-20** — `feat/tithes-real-data` pushed. Third real-data wiring (after Categories, Voucher, Users). (1) **New `src/hooks/useTithes.js`** — `GET /tithes` returning `{ status, totalBalance, count, data }`; exposes `submitTithes` / `approveTithes` / `rejectTithes(id, note)` / `updateTithes(id, payload)` mutations that refetch on success. Same backend-empty workaround as the previous hooks: `GET` returns `404 { error: "Tithes is Empty" }` on empty, hook catches the message and treats as `[]`. (2) **`src/components/tithes-components/tithesUtils.js` (new shared module)** — codifies `SERVICE_TYPES`, `DENOMINATIONS`, `statusStyles`, `formatPHP`, `formatDate`, `formatShortDate`. Replaces 4 component-local copies of the same constants/formatters that had drifted slightly across files. Going forward, tithes components import from this single source. (3) **`src/pages/Tithes.jsx`** — owns the `useTithes()` call and pipes `tithes` + callbacks into every child (table, summary, breakdown, trend, submit dialog). (4) **`TithesTable`** — accepts `tithes/loading/error/onApprove/onReject` props, keys rows on `_id`, reads populated `submittedBy.name` (backend populates `name`+`role` per `tithesController.getAllTithes`), inline `RejectDialog` (Textarea + required note since backend rejects without `rejectionNote`), inline action error display, owner-only Edit dropdown removed (was hardcoded to mock `submittedBy === userName` string compare and never wired). Rejection note surfaced in the details dialog when present. (5) **`SubmitTithesDialog`** — transforms the local `qtys` map into the backend's `denominations: [{ bill, qty, subtotal }]` shape (filtering out zero rows so the payload stays small), submits async with inline error + busy state. Controlled-or-uncontrolled mode preserved so Tithes page and Dashboard quick action both reuse it. (6) **`TithesSummary`** + **`ServiceTypeBreakdown`** — derive stats and per-service distribution from the same fetched array (no extra fetches). Breakdown filters to approved-only since pending/rejected entries aren't actual receipts; renders an "approve some entries" hint when nothing's approved yet. (7) **`TithesTrendChart`** — drops the 365-day mock generator. Now buckets real entries by `entryDate` (YYYY-MM-DD) and walks back from today over the selected range, filling gaps with zeros so the chart stays continuous. Range presets (7D/30D/90D/1Y) and service-type filter still work; service options changed from short labels (`Sunday`/`Prayer`/...) to full backend `serviceType` values. Stats footer guards divide-by-zero in the trend% calculation. (8) **`Dashboard.jsx`** — Submit Tithes quick action now passes an inline `submitTithes` to `SubmitTithesDialog` (same rationale as Add Category — no hook mount, no wasted GET, no 403 risk for non-admins). (9) **Backend gaps flagged, not blocking merge:** (a) `GET /tithes` should return `200 []` on empty instead of `404 { error: "Tithes is Empty" }` (mirrors the Categories + Users flag); (b) `POST /tithes` returns `data: { newTithes }` (nested under `newTithes`) which is fine for a refetch flow but inconsistent with most other endpoints — worth normalizing later; (c) `PATCH /tithes/:id/approve` and `/reject` return only `{ status, message }` — no updated record — so we always refetch after these calls. (10) **Inaccurate prior log corrected** — the 2026-04-20 voucher-real-data entry claimed Dashboard's Create Voucher button was wired inline; verified via `git log -- src/pages/Dashboard.jsx` that no Dashboard touch shipped on that branch. Voucher Dashboard quick action is still mock-only and will need a follow-up wiring (similar to this branch's tithes wiring, but with FormData for receipts).
- **2026-04-20** — `feat/users-real-data` pushed. Next-in-queue real-data wiring after Voucher. (1) **New `src/hooks/useUsers.js`** — owns `GET /admin/users` plus `createUser` / `updateUser` / `deactivateUser` / `activateUser` / `deleteUser` mutations that refetch on success. Two backend gotchas handled: (a) `GET` returns `404 { message: "Users Not Found!" }` on empty (caught and treated as `[]`, same workaround pattern as Categories' "Empty" check); (b) backend has no dedicated `/activate` endpoint — `activateUser` calls the generic `PATCH /admin/users/:id` with `{ isActive: true }` while `deactivateUser` uses the dedicated `PATCH /admin/users/:id/deactivate`. (2) **`src/pages/Users.jsx`** — swapped local-only state for `useUsers()`; passes `users/loading/error` down to summary stats and table; both Edit and Confirm dialogs conditionally mounted (`{editingUser && (...)}`) so the closure over `_id` can't be created over null. (3) **Child components** — `UsersSummaryStats` and `UsersTable` accept `users` prop and key rows on `_id`; table renders "Loading users…" / error text / "No users found" in the empty row slot for both desktop and mobile card views. (4) **Dialogs** — `CreateUserDialog`, `EditUserDialog`, and `ConfirmUserActionDialog` accept async `onSubmit` / `onConfirm` callbacks, track local `submitting` + `error`, surface backend errors as inline red helper text, and disable controls while in flight; busy labels swap on the primary button (Creating…, Saving…, Deactivating…, etc.). `UserDetailsDialog` drops the mock `lastLogin` field (backend's User schema has no equivalent — only `createdAt`/`updatedAt` from Mongoose timestamps) and shows "Last Updated" instead. (5) **`mockData.js`** — removed the `mockUsers` array (no other importers — confirmed via grep); kept `ROLES`, `roleConfig`, `statusConfig`, `formatDate`, `formatDateTime`, `getInitials` as shared lookup constants. (6) **Backend gaps flagged, not blocking merge:** (a) `GET /admin/users` should return `200 []` on empty instead of `404 { message: "Users Not Found!" }` so the frontend workaround can come out (mirrors the Categories flag); (b) `POST /admin/users` response `data` only echoes `{ name, email, isActive, role }` — no `_id` — so optimistic insert isn't possible; current hook refetches the list, which is fine but worth fixing if/when more endpoints land. `vite build` clean.
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
- **2026-04-16** — `feat/wire-login-real-auth` pushed. Closes the last frontend-side auth stub. (1) **`src/pages/Login.jsx`** — `handleSubmit` no longer just `console.log`s; now `await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })`, then `login(res.data, res.token)` from `useAuth()` and `navigate('/dashboard', { replace: true })`. Added inline `text-red-600` error `<p>` between the password input and the Login button, plus `disabled` + "Signing in…" label on the submit while the request is in flight. All existing JSX, classes, OAuth section, and footer left untouched per the design-preservation rule. (2) **Latent input bug fixed** — `LoginInput` forwards the lowercase prop as `name` on the `<input>` (so `e.target.name` is `"email"` / `"password"`), but the original `handleChange` compared against `'Email'` / `'Password'`, meaning state never updated and the form was always submitting empty strings. Switched comparison to lowercase. (3) **`src/services/api.js`** — error unwrap now reads `data.message || data.error` so backend payloads shaped `{ error: '...' }` (which is what every controller returns today) surface meaningful messages instead of falling back to bare HTTP statusText. (4) **DevRolePicker** at `/dev-login` left in place as the mock fallback. (5) **Companion backend change still needed**: extend `userLogin` controller's response `data` to include `name` + `email` so the dynamic `Welcome, {firstName}` on Dashboard reads the real name instead of falling back to "there".
- **2026-04-16** — `fix/dashboard-desktop-recent-activity-height` pushed. Three desktop polish fixes bundled after Adrian reviewed the previous mobile-recent-activity fix. (1) **Desktop RecentActivity height** — the previous fix's `md:flex-1 md:min-h-0` didn't actually expand inside the new `overflow-auto` parent (flex children can't claim "remaining space" in a scroll container with no fixed height), so the table felt bitin on desktop. Pinned to explicit `md:h-[36rem]` (576px) — Dashboard slot is now `h-[28rem] md:h-[36rem]`. (2) **Page padding** — `Dashboard.jsx` and `Tithes.jsx` were the only two pages missing `px-1` on the outer `overflow-auto` wrapper, which clipped the left-edge card borders on the children. Added `px-1` to match every other page. (3) **Dynamic welcome** — replaced the hardcoded "Welcome, Admin 👋" with `Welcome, {firstName} 👋` driven by `useAuth().user.name` (split on space; `?? "there"` fallback while not authenticated or while name field is unavailable). **Known gap surfaced for the next branch:** backend's `POST /api/auth/login` response only returns `{ id, role }` in `data` — no `name`/`email` — so this dynamic welcome will fall back to "there" until the backend response is extended (or a separate profile fetch is added). Will be addressed in the upcoming `feat/wire-login-real-auth` branch.
- **2026-04-19** — `fix/login-eye-icon` pushed. Tiny UX bug fix — password visibility toggle icons were swapped. `LoginInput` renders `Icon3` when `type === "password"` (hidden) and `Icon2` when `type === "text"` (visible). Previous wiring passed `icon2={LuEyeClosed}` + `icon3={LuEye}`, producing the inverted behavior (open eye while password is hidden, closed eye while visible). Swapped the two props in `src/pages/Login.jsx` so hidden state shows `LuEyeClosed` (click to reveal) and visible state shows `LuEye` (click to re-hide). No changes to `LoginInput` itself — the component's render logic is correct; only the consumer's prop wiring needed to flip.
- **2026-04-19** — `feat/dashboard-role-quick-actions` pushed. Replaces the single hardcoded "Add Category" button on the Dashboard header with a role-aware quick-actions row. Each action opens the **same dialog** as the one on its feature page (not a page navigation) so the user can complete the action without leaving the dashboard. (1) **`src/pages/Dashboard.jsx`** — defines `ADD_CATEGORY` / `CREATE_VOUCHER` / `SUBMIT_TITHES` / `GENERATE_REPORT` constants and a `QUICK_ACTIONS_BY_ROLE` map: admin → all 4; validator → Create Voucher + Submit Tithes; DO + member → Submit Tithes only; auditor → Generate Report; pastor → none (button block omitted). Uses `useAuth().user.role` plus local `categoryOpen` / `voucherOpen` / `tithesOpen` state; each button's click dispatches to `handleAction(key)` which opens the corresponding dialog. `CategoryFormDialog` / `CreateVoucherDialog` / `SubmitTithesDialog` are all rendered in the page with controlled `open` + `onOpenChange`. (2) **`SubmitTithesDialog` refactored to controlled-or-uncontrolled** — mirrors the `CreateVoucherDialog` pattern: new optional `open` / `onOpenChange` props, internal state used only when not controlled, trigger div (`<CustomButton>`) rendered only when uncontrolled so the Tithes page still gets its own header CTA. (3) **Generate Report still navigates** — the Reports page has no single "generate" dialog; the whole page is the flow (date range picker + tab + export bar), so auditor's + admin's Generate Report button routes to `/reports` instead of opening a modal. Called out explicitly in the `handleAction` comment. (4) **Policy** — role mapping mirrors the backend ACL (`utils/rolePermissions.js#can`) rather than a wish-list. DO (Jaymar) does **not** get Create Voucher on the dashboard — backend `can.createVoucher` is validator+admin only, so the shortcut would produce a 403 on submit. (5) **Post-merge note** — this branch uses the `main`-branch `CategoryFormDialog` signature (no `onSubmit` prop), so Add Category from the dashboard currently `console.log`s on submit. After `feat/categories-real-data` merges, Dashboard should import `useCategories` and pass `onSubmit={createCategory}` to wire the button end-to-end. Tracked as a follow-up; not blocking this branch.
- **2026-04-20** — `feat/dashboard-mobile-button-grid` pushed. Two Dashboard tweaks on `src/pages/Dashboard.jsx`. (1) **Mobile button grid** — quick-actions container changed from `flex flex-col sm:flex-row` stack to `grid sm:flex sm:flex-row` with a conditional `grid-cols-2` when `actions.length > 1` else `grid-cols-1`. Net effect on mobile: admin (4 buttons) displays as a clean 2x2, validator (2 buttons) fits in a single row, DO/member/auditor (1 button) stays full-width. Desktop (sm+) untouched — still `flex-row` with `w-40` per button. (2) **Wire Add Category to real API** — closed the follow-up flagged in the `feat/dashboard-role-quick-actions` update-history entry: `CategoryFormDialog` on the Dashboard now receives `onSubmit` that calls `apiFetch('/admin/categories', { method: 'POST', body })` inline. Deliberately **did not** reuse the `useCategories` hook here — it fetches the list on mount (wasted call since Dashboard doesn't render categories) and would trigger a 403 for non-admin users who can still mount the component. `CreateVoucherDialog` + `SubmitTithesDialog` remain mock for now; Voucher wiring blocked on the upcoming backend Cloudinary work for receipt uploads.
- **2026-04-19** — `feat/categories-real-data` pushed. First page wired to real backend data as part of the post-auth rollout (see `Real Data Rollout` memory). (1) **New `src/hooks/useCategories.js`** — owns the fetch (`GET /admin/categories`), `createCategory` / `updateCategory` / `deleteCategory` mutations that refetch on success, plus `loading` / `error` state. Workaround in place: backend's `GET` returns 404 `{ error: "Empty" }` when no categories exist (`backend/src/controllers/admin/categoryController.js:8`) — hook catches `"Empty"` and treats it as `[]`. (2) **`src/pages/Categories.jsx`** — swapped local dialog state for `useCategories()`; passes `categories` down to `CategoriesSummaryStats` and `CategoriesTable`; edit dialog now conditionally mounted behind `{editingCategory && (...)}` so the `onSubmit` lambda's `editingCategory._id` closure can't be created over null (fixed a "Cannot read properties of null" crash when opening the page). (3) **Child components** — `CategoriesTable` accepts `categories/loading/error` props, keys rows on `_id`, drops the "Usage" column + `usageCount` delete-guard (backend has no usage aggregation yet), renders "Loading categories…" / error text / "No categories found" in the empty row slot; `CategoriesSummaryStats` computes stats from prop; `CategoryFormDialog` and `ConfirmCategoryActionDialog` accept async `onSubmit` / `onConfirm`, track local `submitting` + `error`, and surface backend errors as red helper text near the primary button (same pattern as Login). (4) **`mockData.js`** — removed the `mockCategories` array (other features have their own local mockCategories, confirmed no cross-imports); kept `TYPES`, `typeConfig`, `statusConfig`, `COLOR_PALETTE`, `formatDate` as shared lookup constants. (5) **Backend gaps flagged, not blocking merge:** (a) `GET /admin/categories` should return `200 []` on empty instead of `404 { error: "Empty" }` so the frontend workaround can come out; (b) `PATCH /admin/categories/:id` only destructures `{ name, type, color }` — `isActive` is silently dropped, so Archive/Restore requests will 200 but not change anything until the controller accepts `isActive`. (6) **Pattern codification:** this branch proves the shape for the remaining real-data rollouts (Users → Tithes → RF → Voucher → Expense) — hook per feature, page as data owner, dialogs with async `on*` callbacks that surface errors inline.
- **2026-04-16** — `feat/mobile-layout-shell` pushed. Branch 1 of 3 in the mobile-responsive rollout. Shipped: (1) **shadcn `Sheet` primitive** added at `src/components/ui/sheet.jsx` (base-ui Dialog-based, left/right/top/bottom sides, used for the mobile nav drawer). (2) **`Layout.jsx`** — removed hardcoded `w-[95%] h-[95%]` in favor of `w-full h-full md:w-[95%] md:h-[95%]` so the shell goes full-bleed on mobile and keeps the framed desktop look at `md:`+. Hoisted `sidebarOpen` state and passed it to `Header` (trigger) and `MobileSidebar` (content). Reduced gap/padding on mobile (`gap-4 md:gap-8`, `p-3 md:p-5`). (3) **`Sidebar.jsx`** — extracted reusable `SidebarBody` (logo/user header + role-filtered nav links) so desktop and mobile share one source of truth. Default export `Sidebar` is now `hidden md:flex` (desktop fixed `w-96` column preserved). New named export `MobileSidebar` wraps `SidebarBody` in `<Sheet side="left">` with `showCloseButton={false}` and an `sr-only` SheetTitle for a11y; nav clicks auto-close the drawer via `onOpenChange(false)`. (4) **`Header.jsx`** — added `FiMenu` hamburger (`md:hidden`) that triggers `onOpenSidebar`. Brand text collapses to "JOSCM Tithes" on `<sm` screens via paired `hidden sm:inline` / `sm:hidden` spans. Search bar hidden on `<sm` and replaced with a `CiSearch` icon button; on `sm+` the search expands `w-48 lg:w-70`. Share icon and full date label hidden on narrow screens (`hidden sm:block` / `hidden lg:block`). Outer flex gaps reduced on mobile (`gap-3 md:gap-5`). (5) **Verification** — tested at 390px/768px/1440px via Chrome DevTools; no horizontal scroll on mobile; desktop experience unchanged. **Note:** `Login.jsx` intentionally untouched (already mobile-friendly, preserved per design rule).

---

*See also: [`CLAUDE.md`](./CLAUDE.md) for shared domain knowledge and workflow rules.*
