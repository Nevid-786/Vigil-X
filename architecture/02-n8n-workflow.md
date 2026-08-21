# n8n Workflow Spec

Workflow name: **Pole Network Event Router**

## Nodes, in order

### 1. Webhook (trigger)
- Already exists at `https://nevid.app.n8n.cloud/webhook/esp-32`
- Method: `POST`
- Response Mode: **"Using Respond to Webhook Node"** (so we control the reply and
  don't leave the ESP32's `HTTPClient` waiting past its timeout)
- Incoming body (from the receiver firmware):
  ```json
  { "source": "A", "path": "A", "destination": "MAIN", "data": "SOS" }
  ```

### 2. Set (Edit Fields) — "Normalize"
Map incoming fields to the internal working names and add a timestamp:
| Field | Value |
|---|---|
| `poleId` | `{{$json.source}}` |
| `path` | `{{$json.path}}` |
| `destination` | `{{$json.destination}}` |
| `rawData` | `{{$json.data}}` |
| `receivedAt` | `{{$now.toISO()}}` |

### 3. Switch — "Classify"
Route on an expression evaluated against `rawData`:

| Output | Condition (expression) | Meaning |
|---|---|---|
| 0 — Emergency | `{{$json.rawData === "SOS"}}` | button press |
| 1 — Card | `{{$json.rawData.startsWith("UID:")}}` | NFC tap (mapped or not — backend resolves) |
| 2 — Message | fallback / else | free-text from captive portal |

### 4a. Branch 0 (Emergency) — Alert node(s)
Add one or more notification nodes in parallel, e.g.:

- **Telegram node** — `sendMessage`, chat ID = admin group, text:
  ```
  🚨 SOS TRIGGERED
  Pole: {{$json.poleId}}
  Path: {{$json.path}}
  Time: {{$json.receivedAt}}
  ```
- **Email (SMTP) node** — same content, to on-call address list.
- Optional **Twilio node** for an SMS/voice call if this is safety-critical
  (recommended if poles are in areas without staff nearby).

All alert nodes run in parallel then feed into the shared "Set type" node below
(node 5), same as the other branches — don't let an alert-node failure block the
event from being logged.

### 4b. Branch 1 (Card) — no extra node needed here
Falls straight through to node 5; type is set based on which switch output fired.

### 4c. Branch 2 (Message) — no extra node needed here
Same — falls through to node 5.

### 5. Set (Edit Fields) — "Set type" (one per branch, or one node fed by all three with an expression)
Add the `type` field per branch:
- Branch 0 → `type = "SOS"`
- Branch 1 → `type = "CHECKIN_PENDING"` (backend will resolve to `CHECKIN` or
  `UNKNOWN_CARD` — see below)
- Branch 2 → `type = "MESSAGE"`

> Simpler alternative: skip per-branch Set nodes and instead compute `type` in
> the node-3 Switch itself using an expression node with a single ternary, then
> merge back into one path before node 6. Either approach is fine — pick
> whichever is less fiddly in the n8n UI.

### 6. HTTP Request — "Forward to backend" (all branches merge here)
- Method: `POST`
- URL: `https://<your-backend-domain>/api/events`
- Headers: `x-api-key: <shared secret, from n8n credential/env>`
- Body (JSON):
  ```json
  {
    "poleId": "{{$json.poleId}}",
    "path": "{{$json.path}}",
    "destination": "{{$json.destination}}",
    "type": "{{$json.type}}",
    "rawData": "{{$json.rawData}}",
    "receivedAt": "{{$json.receivedAt}}"
  }
  ```
- On error: enable "Continue on Fail" so a backend outage doesn't prevent the
  webhook from returning 200 to the ESP32 (which has no retry logic).

### 7. Respond to Webhook
- Response code: `200`
- Body: `{"ok": true}`

## Credentials / env needed in n8n

- Telegram bot token + chat ID (if using Telegram)
- SMTP credentials (if using Email)
- Twilio SID/auth token (if using SMS, optional)
- `BACKEND_API_KEY` — shared secret matching the backend's expected `x-api-key`
- `BACKEND_URL` — set as an n8n environment variable so it's not hardcoded per-node

## Notes for the agent implementing this in n8n

- Import order matters less than getting the Switch conditions right — test each
  branch with the n8n "Pin Data" / manual execution feature using sample bodies
  for `SOS`, `UID:04:A3:9F:1B`, and a free-text message.
- Keep alert nodes non-blocking (parallel, "Continue on Fail") so a bad Telegram
  token never stops an event from being logged.
