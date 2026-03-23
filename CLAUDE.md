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
- JWT (15 min) + refresh token (7 days) both stored in `httpOnly` cookies. Refresh tokens are stored in the DB and rotated on use.
- Google OAuth uses the pattern: set `oauth_state` cookie → redirect to provider → callback validates state → set JWT cookies. Google tokens (`access_token`, `refresh_token`) are AES-encrypted via `src/utils/crypto.js` before storing in the `users` table and decrypted on use in `services/googleCalendar.js`.
- **Critical**: OAuth callbacks go through Vercel's proxy (browser navigates to `/api/auth/google/callback`), so JWT cookies land on the Vercel domain. All axios requests must also go through Vercel (relative URLs) so cookies are sent correctly.
- Vercel's edge proxy strips `Set-Cookie` headers from **302** responses. All `res.redirect()` calls in `authController.js` are replaced with `res.send(htmlRedirect(url))` — a 200 HTML page using `<meta http-equiv="refresh">` — to preserve cookies. Do not revert this to `res.redirect()`.

### Database schema
Tables in `backend/src/db/schema.sql` (full production dump in `schema_dump.sql`):
- `users` — id, name, email, password_hash, profile_image_url (TEXT, base64 data URL), google_access_token, google_refresh_token, refresh_token, google_sync_enabled, email_alerts, push_alerts
- `artists` — id, name, spotify_id, genres (TEXT[]), image_url
- `events` — id, user_id, title, event_date, start_time, end_time, description, category, external_url, google_calendar_event_id
- `event_artists` — event_id, artist_id (join table for tagging artists on events)
- `user_artists` — user_id, artist_id (join table for user's tracked artists)

Raw SQL via `pg` — no ORM. Always use parameterized queries (`$1, $2`). The `query()` helper from `config/database.js` is the standard way to run queries. Note: `usersController.js` uses `pool` imported directly (the default export) — this is an inconsistency; prefer the `query()` named export in new code.

Backend uses ES Modules (`"type": "module"`). All local imports need `.js` extensions.

### Backend structure
```
backend/
  server.js                  # Express app, middleware setup, route mounting
  src/
    config/database.js       # pg Pool, query() helper
    controllers/             # Business logic (authController, eventsController, artistController, usersController, spotifyController)
    routes/                  # Route definitions with validation middleware
    middleware/              # authenticate (JWT), cache (node-cache, keyed by userId + path)
    services/                # googleCalendar.js (Google Calendar API integration)
    utils/crypto.js          # AES-256-CBC encrypt/decrypt for storing Google OAuth tokens
    scripts/                 # One-off DB scripts: init-db, verify-db, apply-indexes, verify-owasp
    db/                      # schema.sql, add_indexes.sql, schema_dump.sql
```

### Key backend features
- **Google Calendar sync**: When a user has connected Google, events are async-synced to their Google Calendar on create/delete. Sync uses encrypted tokens from `users` table. The `google_calendar_event_id` column stores the remote ID for deletion.
- **Spotify search**: Uses client credentials flow only (no user auth). `GET /api/spotify/search?q=` searches Spotify artists and returns `{ spotify_id, name, image_url, genres, popularity }`. Token is cached in memory.
- **Profile images**: Uploaded via `POST /api/users/profile-image` using multer (memory storage), stored as base64 data URLs directly in `users.profile_image_url`.
- **Artist tracking**: Users track artists via `user_artists` join table. Artists are upserted by `spotify_id` on conflict.
- **Caching**: `cacheMiddleware` caches GET responses per user. `clearCachePrefix(userId, path)` is called after any mutation to `/api/events`.

### Frontend structure
```
frontend/
  src/
    context/AuthContext.jsx  # Global auth state, axios baseURL config, token refresh interceptor
    pages/                   # Dashboard, Artists, Releases, Settings, Login, Register, Landing
    components/              # Navbar, BottomNav, and ui/ primitives
    App.jsx                  # Routes (react-router-dom v7)
```

Auth state lives in `AuthContext`. It sets `axios.defaults.withCredentials = true` and `axios.defaults.baseURL` (falls back to `''` for relative URLs). Components use the `useAuth()` hook. Toasts use `sonner`.

### Styling
Tailwind CSS v4 with custom theme tokens:
- `primary`: `#59f20d` (neon green)
- `background-dark`: `#070a06`
- `card-dark`, `accent-dark`
- Space Mono font, `rounded-none` corners, `font-black italic uppercase` headings, neon glow effects via `drop-shadow`

### Key env vars
| Variable | Where set | Purpose |
|---|---|---|
| `DATABASE_URL` | Railway / local `.env` | Neon PostgreSQL connection string (overrides `DB_*` vars) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | local `.env` | Local PostgreSQL (Docker) |
| `JWT_SECRET` | Railway / local `.env` | JWT signing key |
| `FRONTEND_URL` | Railway | Used in CORS and OAuth redirect URIs |
| `BACKEND_URL` | Railway | Must equal `FRONTEND_URL` (Vercel URL) so OAuth redirect URIs route through Vercel |
| `ENCRYPTION_KEY` | Railway / local `.env` | AES-256 key for encrypting stored Google OAuth tokens |
| `GOOGLE_CLIENT_ID` | Railway / local `.env` | Google OAuth app client ID |
| `GOOGLE_CLIENT_SECRET` | Railway / local `.env` | Google OAuth app client secret |
| `SPOTIFY_CLIENT_ID` | Railway / local `.env` | Spotify app client ID (client credentials only) |
| `SPOTIFY_CLIENT_SECRET` | Railway / local `.env` | Spotify app client secret |
| `VITE_API_URL` | Vercel | Must be **empty/unset** — if set to the Railway URL, API calls bypass Vercel and cookies break |

Local dev: copy `backend/.env.example` or configure `backend/.env`. Vite proxies `/api/*` to `http://127.0.0.1:5000` automatically — no `VITE_API_URL` needed locally.
