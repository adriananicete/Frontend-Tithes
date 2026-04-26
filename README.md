# JOSCM Tithes — Frontend

React + Vite client for the **JOSCM Tithes Management System**, a financial management app for Jesus Our Savior Christian Ministries (tithes collection, request form approval workflow, expense tracking, role-based access).

Backend repo: [Backend-Tithes](https://github.com/adriananicete/Backend-Tithes)

## Live

- **App:** https://tithes-management-system.vercel.app
- **Login:** seeded admin is `adrian@joscm.com` / `adrian` (change on first login)

> First login after the backend has been idle takes 30–60s — Render free tier sleeps the API after ~15 min.

## Tech stack

| Layer | Choice |
|---|---|
| Build tool | Vite |
| UI framework | React 19 (JavaScript, not TypeScript) |
| Styling | Tailwind CSS v4 |
| Component library | shadcn/ui (Slate base) |
| Routing | React Router v7 |
| HTTP | `fetch` via `src/services/api.js` (handles auth header injection + 401 auto-logout + blob downloads) |
| Global state | React Context — Auth + Notifications only |
| Icons | `lucide-react` + `react-icons` |
| Notifications (toast) | `sonner` |

## Local development

```bash
npm install

# Optional: create .env file (see "Environment variables" below).
# If absent, defaults to http://localhost:7001/api so it works
# out-of-the-box against a local backend.

npm run dev
# → Vite dev server on http://localhost:5173
```

Backend must be running separately (see [Backend-Tithes](https://github.com/adriananicete/Backend-Tithes) for setup).

## Environment variables

| Key | Required | Meaning |
|---|---|---|
| `VITE_API_URL` | Recommended in prod | Full API base URL **including `/api` suffix**. Defaults to `http://localhost:7001/api` if unset. The trailing `/api` is required because route paths in the code are written as `/auth/login`, `/tithes`, etc. — the base URL gets prepended verbatim. |

Example for production: `VITE_API_URL=https://backend-tithes-management-system.onrender.com/api`

## Production deployment (Vercel)

- **Auto-deploys** on every push to `main`.
- **Framework Preset:** Vite (auto-detected).
- **Build Command:** `npm run build` (default).
- **Output Directory:** `dist` (default).
- **Env vars** set in Vercel dashboard → Settings → Environment Variables. After changing, you must trigger a redeploy (env vars only apply to new builds, not existing deployments).

### SPA routing

`vercel.json` at the repo root contains a single rewrite rule that falls back all paths to `index.html`. Without this, refreshing a deep route like `/tithes` would 404 because Vercel's filesystem lookup wouldn't find a matching static file.

`public/_redirects` is a Render/Netlify-style equivalent kept around as a fallback in case the deploy target ever changes. Vercel ignores it.

## Project layout

```
frontend/
├── public/
├── vercel.json                 SPA rewrite for client-side routing
├── vite.config.js
└── src/
    ├── App.jsx                 Routes — wraps protected ones in <ProtectedRoute>
    ├── main.jsx                ReactDOM.createRoot + <AuthProvider>
    ├── context/                AuthContext, NotificationsContext
    ├── hooks/                  Per-feature hooks (useTithes, useExpenses, useReports, useNotifications, ...)
    ├── pages/                  Thin assemblers — mount hooks, pipe data to components
    ├── components/
    │   ├── layout/             Sidebar, Header, Layout shell
    │   ├── ui/                 shadcn primitives (managed by CLI)
    │   ├── shared/             Reusable building blocks
    │   └── <feature>-components/  Per-feature display components + utils
    ├── services/api.js         fetch wrapper — auth injection, 401 redirect, blob downloads
    ├── routes/ProtectedRoute.jsx
    └── utils/rolePermissions.js   ROLES, NAV_ITEMS, can.* RBAC helpers
```

## Architecture notes

- See [`CLAUDE_CLIENT.md`](./CLAUDE_CLIENT.md) for the long-form context: tech stack rationale, design system, established page pattern, mobile strategy, real-data rollout pattern, and full update history.
- Domain knowledge (roles, business rules, status flows) lives in [`../CLAUDE.md`](../CLAUDE.md).
