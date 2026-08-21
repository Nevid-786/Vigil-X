# Architecture

## Data flow

```
[Pole A: NFC / SOS button / captive-portal message]
              │  LoRa (433 MHz)
              ▼
     [Pole B, if in path] -- relays --
              │  LoRa
              ▼
        [MAIN receiver ESP32]
              │  HTTPS POST (existing, already implemented)
              ▼
        n8n webhook: /webhook/esp-32
              │
        ┌─────┴──────────────┐
        │   Switch on `data` │
        └─────┬──────┬───────┘
              │      │
     data=="SOS"   else: known/unknown UID or free text
              │      │
      ┌───────┘      └────────┐
      ▼                       ▼
 Alert branch           Log branch
 (Telegram/Email/       (HTTP Request node)
  WhatsApp node)               │
      │                       ▼
      └──────────►  POST https://<backend>/api/events
                        (shared, both branches)
                              │
                              ▼
                    Express API (MERN backend)
                       │              │
                 MongoDB (persist)  Socket.io (broadcast)
                                          │
                                          ▼
                              React dashboard (live update)
```

## Event payload contract (n8n → backend)

This is the normalized shape the backend expects at `POST /api/events`.
n8n is responsible for producing this from the raw ESP32 payload.

```json
{
  "poleId": "A",
  "path": "A",
  "destination": "MAIN",
  "type": "SOS",
  "rawData": "SOS",
  "resolvedName": null,
  "receivedAt": "2026-08-21T10:15:00.000Z"
}
```

`type` is one of: `SOS`, `CHECKIN`, `UNKNOWN_CARD`, `MESSAGE`.

- `SOS` — `rawData == "SOS"`
- `CHECKIN` — `rawData` starts with `UID:` **and** it matches a known card in the
  backend's directory → `resolvedName` is filled in by the backend (see
  `03-backend-spec.md`, card lookup happens server-side, not in n8n, so the
  directory only has to live in one place).
- `UNKNOWN_CARD` — `rawData` starts with `UID:` and is not in the directory.
- `MESSAGE` — anything else (free text typed on the captive portal).

n8n does NOT need to do the UID→name lookup itself — it forwards the raw UID and
lets the backend resolve it (single source of truth, avoids the n8n workflow and
backend directory drifting out of sync). n8n only needs to classify `SOS` vs
`UID:` vs other, which is a simple string check.

## Why forward through the backend instead of writing to Mongo directly from n8n

Socket.io live-push needs to happen from the same process that holds the
websocket connections, so the event has to pass through the Express server
regardless of where it's persisted. Keeping n8n → backend → Mongo (rather than
n8n → Mongo directly) means the backend is the single source of truth and can
enforce validation, auth, and the UID lookup in one place.

## Security note

The backend's `POST /api/events` endpoint should require a shared secret header
(`x-api-key`) set in the n8n HTTP Request node, since it's a public internet
endpoint accepting device data. See `03-backend-spec.md` for the auth middleware.
