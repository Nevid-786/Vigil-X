# Deployment

## Suggested hosting (fastest path, low ops overhead)

- **MongoDB**: MongoDB Atlas (free M0 tier is enough for this volume of events).
- **Backend**: Railway or Render (Node web service). Needs a persistent process
  for Socket.io — avoid pure serverless functions for this piece.
- **Frontend**: Vercel or Netlify (static build from Vite).
- **n8n**: already on n8n Cloud (`nevid.app.n8n.cloud`) — no change needed, just
  add/update the workflow described in `02-n8n-workflow.md`.

## Backend `.env.example`

```
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/pole-network
JWT_SECRET=<generate a long random string>
DEVICE_API_KEY=<generate a long random string, put the same value in n8n>
CORS_ORIGIN=https://<your-frontend-domain>
```

## Frontend `.env.example`

```
VITE_API_URL=https://<your-backend-domain>/api
VITE_SOCKET_URL=https://<your-backend-domain>
```

## n8n

- In the "Forward to backend" HTTP Request node, set:
  - URL → `https://<your-backend-domain>/api/events`
  - Header `x-api-key` → same value as `DEVICE_API_KEY`
- Store the backend URL and api key as n8n **credentials/environment variables**,
  not hardcoded in the node, so they can be rotated without editing the workflow.

## CORS

Backend must allow the frontend's origin explicitly (not `*`) since JWT-bearing
requests come from the browser:

```js
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
```

## Local development

```bash
# backend
cd backend && npm install && npm run dev   # nodemon, PORT=4000

# frontend
cd frontend && npm install && npm run dev  # vite, proxies /api to :4000 in dev
```

For local n8n testing without a public backend, use a tool like `ngrok` to
tunnel `localhost:4000` and point the n8n HTTP Request node at the tunnel URL
temporarily.

## First-run checklist

1. Deploy backend + Mongo, confirm `POST /api/events` works with `curl` and the
   `x-api-key` header before touching n8n.
2. Update the n8n workflow's HTTP Request node URL/key, send a manual test
   execution with a sample `SOS` body, confirm it lands in Mongo and fires the
   Telegram/Email alert.
3. Deploy frontend, log in, confirm the live feed updates when you re-run the
   n8n test execution.
4. Physically test one real button press / NFC tap end-to-end.
