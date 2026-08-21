# Database Schema (Mongoose)

## `Event`

```js
const eventSchema = new mongoose.Schema({
  poleId:       { type: String, required: true, index: true },   // "A", "B", ...
  path:         { type: String },                                  // e.g. "A->B"
  destination:  { type: String, default: "MAIN" },
  type: {
    type: String,
    enum: ["SOS", "CHECKIN", "UNKNOWN_CARD", "MESSAGE", "HEARTBEAT"],
    required: true,
    index: true,
  },
  rawData:      { type: String, required: true },   // original DATA field
  normalizedUid:{ type: String, default: null },     // set when type involves a card
  resolvedName: { type: String, default: null },     // set when CHECKIN
  receivedAt:   { type: Date, required: true, index: true },
  acknowledgedAt: { type: Date, default: null },      // for SOS ack workflow
}, { timestamps: true });

eventSchema.index({ type: 1, receivedAt: -1 });
```

## `CardMapping`

```js
const cardMappingSchema = new mongoose.Schema({
  normalizedUid: { type: String, required: true, unique: true, index: true },
  rawUid:        { type: String, required: true },   // original formatting, for display
  name:          { type: String, required: true },
  createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
```

## `Pole`

```js
const poleSchema = new mongoose.Schema({
  poleId:      { type: String, required: true, unique: true },  // "A", "B"
  label:       { type: String },                                  // friendly name, optional
  lastSeenAt:  { type: Date },
  eventCount:  { type: Number, default: 0 },
}, { timestamps: true });
```

## `User` (admin dashboard login)

```js
const userSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ["admin"], default: "admin" },
}, { timestamps: true });
```

## Normalization helper (shared logic, mirror the firmware's `normalizeUID()`)

```js
function normalizeUid(uid) {
  return uid
    .trim()
    .toUpperCase()
    .replace(/UID:/g, "")
    .replace(/[\s:-]/g, "");
}
```

Use this in the `POST /api/events` controller and in the `CardMapping` CRUD
controller, so a card saved via the web UI matches what arrives over LoRa/n8n
regardless of colon/hyphen formatting differences.
