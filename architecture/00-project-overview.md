# Pole Network — Project Overview

## What this system already is (hardware, existing firmware)

Two ESP32 firmware roles already exist and are NOT to be rewritten by this project
(only referenced for the data contract they emit):

1. **Sender / Pole node** (`MY_ID = "A"` or `"B"`)
   - PN532 NFC reader — reads card UID, sends it over LoRa
   - Push button — sends `"SOS"` over LoRa on press
   - Local WiFi AP + captive portal — lets a bystander type a free-text message that
     also gets sent over LoRa
   - Relays/forwards any packet not addressed to it toward `NEXT_ID`
   - LoRa packet format (plain text, pipe-delimited):
     ```
     SRC=<id>|PATH=<id->id->...>|DEST=<id>|DATA=<payload>
     ```
     `DATA` is one of: `SOS`, `UID:AA:BB:CC:DD`, or free text (≤150 chars).

2. **Receiver / MAIN node**
   - Receives LoRa packets addressed to `MAIN`
   - Has a local UID → Name mapping table (in-memory, "Mapping Mode" on the device)
   - Displays the event on a TFT screen
   - Already POSTs every event to an **n8n webhook**:
     `POST https://nevid.app.n8n.cloud/webhook/esp-32`
     ```json
     {
       "source": "A",
       "path": "A",
       "destination": "MAIN",
       "data": "<SOS | mapped name | raw UID | free text>"
     }
     ```

## What we are building now

1. **An n8n workflow** that receives that webhook payload, classifies it
   (emergency / check-in / unknown card / message), fires alerts for emergencies,
   and forwards a normalized event to a new backend.
2. **A MERN web application**:
   - **Backend** (Node/Express/MongoDB/Socket.io) that stores events, manages the
     UID↔name card directory (source of truth, replacing the ESP32's in-memory
     table long-term), and pushes live updates.
   - **Frontend** (React) dashboard: live event feed, pole status, SOS alert
     banner, card management screen, historical log with filters/export.

## Goals

- Every SOS press is visible within ~2 seconds on the dashboard and triggers an
  external alert (Telegram/Email/WhatsApp) even if nobody is looking at the screen.
- Every NFC tap is logged as a check-in/attendance event, attributable to a name
  once mapped.
- Admins can manage the UID→name directory from the web instead of the device's
  tiny screen.
- Full historical log, searchable/filterable/exportable, survives device reboots
  (unlike the ESP32's RAM-only `uidList[]`).

## Non-goals

- No changes to the ESP32 firmware are required for v1 (it already POSTs to n8n).
- No mobile app in v1 — the React dashboard is responsive but not native.

## Build order for the agent

1. `02-n8n-workflow.md` — configure/update the n8n workflow first (fast, unblocks testing).
2. `05-database-schema.md` + `03-backend-spec.md` — backend, so n8n has a real target.
3. `04-frontend-spec.md` — dashboard.
4. `06-api-reference.md` — keep in sync as endpoints are built.
5. `07-deployment.md` — last, for shipping.

See `01-architecture.md` for the full data-flow diagram.
