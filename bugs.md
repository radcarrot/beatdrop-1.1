# BeatDrop — Bug Report

Audit date: 2026-06-01. Found via static read of backend controllers, middleware, routes, services.

**Status: all 10 findings resolved on branch `fix/top-three-bugs`.**

Severity legend: **HIGH** (data loss / security / broken core flow), **MEDIUM** (feature broken or inconsistent), **LOW** (robustness / hygiene).

---

## HIGH

### 1. `deleteAccount` clears the wrong cookie
**File:** `backend/src/controllers/usersController.js:119`

```js
res.cookie('token', '', { httpOnly: true, maxAge: 1 });
```

Auth cookies are named `jwt` and `refreshToken` (see `authController.js`). This clears a non-existent `token` cookie. After account deletion the browser still holds a valid `jwt` cookie for up to 15 min. The user row is gone, so every subsequent request 403s and the axios refresh interceptor fails.

**Fix:** mirror `logout()`:
```js
res.clearCookie('jwt', COOKIE_OPTIONS);
res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);
```
(import/share the cookie option objects so domain/sameSite/secure match.)

### 2. `.escape()` corrupts data at storage time
**File:** `backend/src/routes/events.js:14,16`

```js
body('title').trim().isLength({ min: 1, max: 255 }).escape(),
body('description').optional(...).escape(),
```

`express-validator`'s `.escape()` mutates `req.body` in place. The escaped string is what gets INSERTed. Result: `Drake & Future` is stored as `Drake &amp; Future`, apostrophes become `&#x27;`, etc. Mojibake shows up in the UI and in synced Google Calendar events.

**Fix:** remove `.escape()` from validation. Escape on output/render instead (React already escapes JSX text). Keep `.trim()` and length checks.

### 3. cacheMiddleware caches error responses
**File:** `backend/src/middleware/cacheMiddleware.js:25`

```js
res.json = (body) => {
    apiCache.set(key, body, durationSeconds || 300);
    originalJson.call(res, body);
};
```

The `res.json` hijack ignores HTTP status. A transient `500 { error }` (or any error body) gets cached and served for up to 180s to that user.

**Fix:** only cache success:
```js
res.json = (body) => {
    if (res.statusCode < 400) apiCache.set(key, body, durationSeconds || 300);
    originalJson.call(res, body);
};
```

---

## MEDIUM

### 4. Account lockout never resets the attempt counter on expiry
**File:** `backend/src/controllers/authController.js:107-117`

After the first lockout, `failed_login_attempts` stays at 5 in the DB. Once `locked_until` passes, the next wrong password computes `5 + 1 = 6 ≥ 5` and re-locks immediately. Net effect: any wrong password permanently re-locks the account in 15-min cycles until a *successful* login resets the counter.

**Fix:** when `locked_until` has passed, reset `failed_login_attempts` to 0 before counting the new failure (or treat an expired lock as a fresh window).

### 5. `updateEvent` does not re-sync to Google Calendar
**File:** `backend/src/controllers/eventsController.js:107`

`createEvent` syncs to Google; `deleteEvent` deletes from Google; `updateEvent` does neither. Editing an event leaves the Google Calendar copy stale (old title/date/time).

**Fix:** on update, if `google_calendar_event_id` exists, call a `updateEventInGoogle()` (add to `googleCalendar.js`, using `calendar.events.update`); otherwise sync as new if the user has Google linked.

### 6. Refresh token is not rotated on use
**File:** `backend/src/controllers/authController.js:149`

`CLAUDE.md` states refresh tokens are "rotated on use." `refresh()` only issues a new JWT — the refresh token in the DB is untouched. Doc/code mismatch and weaker security: a stolen refresh token stays valid for its full 7-day life and is reusable.

**Fix:** in `refresh()`, mint a new refresh token, `UPDATE users SET refresh_token = $1`, and re-set the `refreshToken` cookie.

---

## LOW

### 7. Email not normalized
**File:** `backend/src/controllers/authController.js` (register + login)

Email comparison is case-sensitive. `A@x.com` and `a@x.com` create two distinct accounts. Lowercase (and trim) email before insert and lookup.

### 8. Spotify env crash risk
**File:** `backend/src/controllers/spotifyController.js:19`

`process.env.SPOTIFY_CLIENT_ID.trim()` throws `Cannot read properties of undefined (reading 'trim')` if the var is unset. Guard for presence and return a clean 500.

### 9. `clearCookie('oauth_state')` option mismatch
**File:** `backend/src/controllers/authController.js:251`

The `oauth_state` cookie is set with `secure` / `sameSite: 'none'` in prod but cleared with no options, so the clear may not match and the cookie can linger. Pass the same options to `clearCookie`.

### 10. Startup `ALTER TABLE` runs every cold start
**File:** `backend/server.js:56`

```js
query(`ALTER TABLE users ALTER COLUMN profile_image_url TYPE TEXT`).catch(() => {});
```

Fire-and-forget migration on every boot. Works but belongs in a one-off migration script, not app startup.

---

## Suggested order

Start with HIGH (#1, #2, #3) — each is small, low-risk, and high-impact. #2 may need a one-time data cleanup migration for already-escaped rows.
