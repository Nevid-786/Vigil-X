# Frontend Spec (React dashboard)

## Stack
- React (Vite)
- React Router
- Tailwind CSS
- `socket.io-client`
- `axios`
- `recharts` (simple stats: events/day, SOS count, check-ins per pole)
- Zustand (or React Context) for shared state: auth token, live event list, pole
  statuses

## Folder structure

```
frontend/
  src/
    main.jsx
    App.jsx
    api/
      client.js          // axios instance, attaches JWT
      events.js
      cards.js
      poles.js
      auth.js
    socket/
      socket.js           // socket.io-client singleton, connect on login
    store/
      useAppStore.js       // zustand: token, events[], poles[], unresolvedSOS
    pages/
      LoginPage.jsx
      DashboardPage.jsx
      CardsPage.jsx
      HistoryPage.jsx
      SettingsPage.jsx
    components/
      layout/
        Sidebar.jsx
        Topbar.jsx
      dashboard/
        SosBanner.jsx
        LiveEventFeed.jsx
        PoleStatusCard.jsx
        StatsPanel.jsx
      cards/
        CardTable.jsx
        CardFormModal.jsx
      history/
        EventTable.jsx
        EventFilterBar.jsx
        ExportButton.jsx
      common/
        Badge.jsx
        LoadingSpinner.jsx
```

## Pages

### LoginPage
- Simple email/password form → `POST /api/auth/login` → store JWT in
  `useAppStore` (and localStorage) → redirect to Dashboard.

### DashboardPage (default route after login)
- `SosBanner` — full-width red banner that appears when an `sos_alert` socket
  event arrives; shows pole ID + time; dismissible but re-appears on the next
  SOS; plays a short alert sound (respect a mute toggle in Settings).
- `PoleStatusCard` — one card per known pole (`A`, `B`, ... from `/api/poles`):
  last-seen time, today's event count.
- `LiveEventFeed` — scrolling list, newest first, populated initially from
  `GET /api/events?limit=50` then prepended live via the `new_event` socket
  event. Each row: type badge (color-coded: SOS=red, CHECKIN=green,
  UNKNOWN_CARD=amber, MESSAGE=blue), pole, resolved name or raw data, timestamp.
- `StatsPanel` — small recharts bar/line chart, events per day for the last 7
  days, from `GET /api/events` aggregated client-side or a dedicated
  `/api/events/stats` endpoint if you want it server-aggregated.

### CardsPage
- `CardTable` — list of `CardMapping` docs (UID, name, createdAt), search box.
- "Add Card" button → `CardFormModal` (UID + name fields; UID can be typed
  manually or, nicer, pre-filled if an `UNKNOWN_CARD` event was clicked from the
  dashboard feed — pass the raw UID via route state).
- Edit/delete inline.

### HistoryPage
- `EventFilterBar` — filter by type, pole, date range.
- `EventTable` — paginated table of `GET /api/events` with those filters.
- `ExportButton` — hits `GET /api/events/export` and downloads the CSV.

### SettingsPage
- Alert sound mute toggle (local only, persisted to localStorage).
- Change password.

## Real-time behavior

- On app load (post-login), open the socket connection once, pass JWT for auth
  if you want to restrict who can subscribe.
- `new_event` → prepend to the store's `events` array (cap at ~200 in memory,
  older events are still in Mongo, just re-fetch via `HistoryPage` for those).
- `sos_alert` → set `unresolvedSOS` in the store so `SosBanner` renders anywhere
  in the app, not just on the Dashboard route.
- `pole_status` → update the matching pole's `lastSeenAt` in the store.

## Visual/UX notes

- SOS must be impossible to miss: full-width banner + sound + tab title flashing
  (`document.title`) while unresolved, cleared by an explicit "Acknowledge"
  button (not just auto-dismiss on a timer).
- Everything else (check-ins, messages) is low-key — a normal feed row, no
  popups, so real alerts don't get lost in noise.
