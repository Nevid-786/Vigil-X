# Backend Spec (Express + MongoDB + Socket.io)

## Stack
- Node.js + Express
- MongoDB via Mongoose
- Socket.io for live push to the dashboard
- JWT for dashboard admin auth (separate from the `x-api-key` used by n8n)
- `dotenv` for config

## Folder structure

```
backend/
  src/
    app.js
    server.js                 // creates http server, attaches socket.io
    config/
      db.js
    middleware/
      apiKeyAuth.js            // for POST /api/events (n8n)
      jwtAuth.js                // for dashboard endpoints
      errorHandler.js
    models/
      Pole.js
      CardMapping.js
      Event.js
      User.js
    controllers/
      eventsController.js
      cardsController.js
      polesController.js
      authController.js
    routes/
      events.js
      cards.js
      poles.js
      auth.js
    sockets/
      index.js                 // io.on('connection', ...), emits
  .env.example
  package.json
```

## Auth

Two separate mechanisms:
1. **Device/automation auth** — `x-api-key` header, checked against
   `process.env.DEVICE_API_KEY`, only required on `POST /api/events`.
2. **Dashboard auth** — JWT bearer token from `/api/auth/login`, required on all
   `/api/cards`, `/api/poles`, and read endpoints used by the React app.

## Core logic: `POST /api/events`

1. Validate `x-api-key`.
2. Validate body shape (`poleId`, `type`, `rawData`, `receivedAt` required).
3. If `type === "CHECKIN_PENDING"`:
   - Strip `UID:` prefix, normalize (uppercase, remove `:`/`-`/spaces — mirror
     the ESP32's `normalizeUID()` logic) to get `normalizedUid`.
   - Look up `CardMapping` by `normalizedUid`.
   - If found → `type = "CHECKIN"`, `resolvedName = mapping.name`.
   - If not found → `type = "UNKNOWN_CARD"`, `resolvedName = null`.
4. Upsert/touch the `Pole` document (`lastSeenAt = now`, increment `eventCount`).
5. Save the `Event` document.
6. Emit via Socket.io:
   - Always: `io.emit('new_event', event)`
   - If `type === "SOS"`: also `io.emit('sos_alert', event)` (dashboard uses this
     to trigger the loud banner/sound distinctly from the regular feed).
7. Respond `201` with the saved event.

## Endpoints

See `06-api-reference.md` for the full table. Summary:

- `POST /api/events` — n8n → backend (api-key auth)
- `GET /api/events` — dashboard event history, paginated, filterable by `type`,
  `poleId`, date range (JWT auth)
- `GET /api/events/export` — CSV export of filtered events (JWT auth)
- `GET /api/cards` / `POST /api/cards` / `PUT /api/cards/:id` / `DELETE /api/cards/:id`
  — UID↔name directory CRUD (JWT auth)
- `GET /api/poles` — list poles with `lastSeenAt`, `eventCount`, online/offline
  status derived from `lastSeenAt` vs a threshold (e.g. offline if no event/heartbeat
  in 10 minutes — see note below)
- `POST /api/auth/login` — admin login, returns JWT
- `POST /api/auth/register` — first-run admin creation only (guard with an env flag
  or disable after first admin exists)

## Pole "online" status caveat

The current firmware only sends events when something happens (button/NFC/message)
— there's no periodic heartbeat. So "online" status from `lastSeenAt` alone will
look stale between events. Two options, pick one for v1:
- **v1 (simplest):** show "last seen X ago" instead of a binary online/offline badge.
- **v1.1 (better):** add a lightweight heartbeat — the MAIN receiver already loops
  constantly, so it could POST a `type: "HEARTBEAT"` event every N minutes. This
  requires a small firmware addition, so treat it as a fast-follow, not a blocker.

## Socket.io events (server → client)

| Event | Payload | When |
|---|---|---|
| `new_event` | full `Event` doc | every event, all types |
| `sos_alert` | full `Event` doc | only when `type === "SOS"` |
| `pole_status` | `{poleId, lastSeenAt}` | on every event, to update pole cards live |

## Environment variables

```
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<random>
DEVICE_API_KEY=<shared secret, matches n8n's x-api-key>
CORS_ORIGIN=https://<frontend-domain>
```
