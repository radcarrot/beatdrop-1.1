# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development (from repo root)
```bash
npm run dev          # Start both frontend and backend concurrently
npm run db:up        # Start PostgreSQL via Docker
npm run db:down      # Stop PostgreSQL
npm run start        # db:up + dev
```

### Backend (from /backend)
```bash
npm run dev          # nodemon server.js
npm run db:init      # Initialize DB schema (first time only)
npm test             # Run Jest tests
npm run test:watch   # Watch mode
npx jest src/tests/auth.test.js   # Run a single test file
```

### Frontend (from /frontend)
```bash
npm run dev          # Vite dev server at http://127.0.0.1:5173
npm run build        # Production build
npm run lint         # ESLint
npm test             # Vitest run
npx vitest run src/tests/Artists.test.jsx  # Run a single test file
```

### DB scripts (from /backend)
```bash
node src/scripts/verify-db.js       # Check DB connection and schema
node src/scripts/apply-indexes.js   # Apply performance indexes
node src/scripts/verify-owasp.js    # Run OWASP security checks
```

## Architecture

### Deployment topology
- **Frontend**: Vercel (static SPA build of `/frontend`)
- **Backend**: Railway (`/backend` Node/Express server)
- **Database**: Neon (PostgreSQL, production) / Docker (local)
- **Proxy**: `frontend/vercel.json` rewrites `/api/(.*)` → Railway backend. This is critical — all frontend API calls must use relative paths (e.g. `/api/events`) so they route through Vercel's proxy. Never hardcode the Railway URL in frontend code.

### Auth flow
- JWT stored in `httpOnly` cookies. Refresh tokens stored in DB and rotated on use.
- Google OAuth and Spotify OAuth both use the same pattern: set `oauth_state` cookie → redirect to provider → callback validates state → set JWT cookies. Spotify tokens (access + refresh) are AES-encrypted before storing in the DB and decrypted on use via `spotifyController.js`.
- **Critical**: OAuth callbacks go through Vercel's proxy (browser navigates to `/api/auth/google/callback`), so JWT cookies land on the Vercel domain. All axios requests must also go through Vercel (relative URLs) so cookies are sent correctly.
- Vercel's edge proxy strips `Set-Cookie` headers from **302** responses. All `res.redirect()` calls in `authController.js` are replaced with `res.send(htmlRedirect(url))` — a 200 HTML page using `<meta http-equiv="refresh">` — to preserve cookies. Do not revert this to `res.redirect()`.

### Backend structure
```
backend/
  server.js                  # Express app, middleware setup, route mounting
  src/
    config/database.js       # pg Pool, query() helper
    controllers/             # Business logic (authController, eventsController, etc.)
    routes/                  # Route definitions with validation middleware
    middleware/              # authenticate (JWT), cache
    services/                # googleCalendar.js (Google Calendar API integration)
    utils/crypto.js          # AES-256-CBC encrypt/decrypt for storing OAuth tokens
    scripts/                 # One-off DB scripts: init-db, verify-db, apply-indexes, verify-owasp
```

Raw SQL via `pg` — no ORM. Always use parameterized queries (`$1, $2`). The `query()` helper from `config/database.js` is the standard way to run queries.

Backend uses ES Modules (`"type": "module"`). All local imports need `.js` extensions.

### Frontend structure
```
frontend/
  src/
    context/AuthContext.jsx  # Global auth state, axios baseURL config, token refresh interceptor
    pages/                   # Dashboard, Artists, Releases, Settings, Login, Register, Landing
    components/              # Navbar, BottomNav, and ui/ primitives
    App.jsx                  # Routes (react-router-dom v7)
```

Auth state lives in `AuthContext`. It sets `axios.defaults.withCredentials = true` and `axios.defaults.baseURL` (falls back to `''` for relative URLs). Components use the `useAuth()` hook.

### Styling
Tailwind CSS v4 with custom theme tokens:
- `primary`: `#59f20d` (neon green)
- `background-dark`: `#070a06`
- `card-dark`, `accent-dark`
- Space Mono font, `rounded-none` corners, `font-black italic uppercase` headings, neon glow effects via `drop-shadow`

### Key env vars
| Variable | Where set | Purpose |
|---|---|---|
| `DATABASE_URL` | Railway | Neon PostgreSQL connection string |
| `FRONTEND_URL` | Railway | Used in CORS and OAuth redirect URIs |
| `BACKEND_URL` | Railway | Must equal `FRONTEND_URL` (Vercel URL) so OAuth redirect URIs route through Vercel |
| `ENCRYPTION_KEY` | Railway | AES-256 key for encrypting stored OAuth tokens |
| `VITE_API_URL` | Vercel | Must be **empty/unset** — if set to the Railway URL, API calls bypass Vercel and cookies break |

Local dev: copy `backend/.env.example` or set `DB_*` vars. Vite proxies `/api/*` to `http://127.0.0.1:5000` automatically — no `VITE_API_URL` needed locally.
