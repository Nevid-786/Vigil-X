# API Reference

Base URL: `https://<backend-domain>/api`

## Auth

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/auth/register` | none (disable after first admin, or protect with a setup token) | `{email, password}` | `{token, user}` |
| POST | `/auth/login` | none | `{email, password}` | `{token, user}` |

## Events

| Method | Path | Auth | Body / Query | Response |
|---|---|---|---|---|
| POST | `/events` | `x-api-key` | `{poleId, path, destination, type, rawData, receivedAt}` | `201 {event}` |
| GET | `/events` | JWT | query: `type, poleId, from, to, page, limit` | `{events[], total, page}` |
| GET | `/events/export` | JWT | same filters as above | CSV file stream |
| PATCH | `/events/:id/acknowledge` | JWT | — | `{event}` (sets `acknowledgedAt`, used to clear the SOS banner state across dashboard users) |

## Cards (UID directory)

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/cards` | JWT | query: `search` | `{cards[]}` |
| POST | `/cards` | JWT | `{rawUid, name}` | `201 {card}` |
| PUT | `/cards/:id` | JWT | `{name}` | `{card}` |
| DELETE | `/cards/:id` | JWT | — | `204` |

## Poles

| Method | Path | Auth | Response |
|---|---|---|---|
| GET | `/poles` | JWT | `{poles[]}` — includes `lastSeenAt`, `eventCount` |

## Error format (all endpoints)

```json
{ "error": { "message": "human readable", "code": "OPTIONAL_MACHINE_CODE" } }
```

## Status codes used

- `200` success (read)
- `201` created
- `204` deleted, no body
- `400` validation error
- `401` missing/invalid JWT or api-key
- `404` not found
- `409` conflict (e.g. duplicate `normalizedUid` on card create)
- `500` server error
