import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    poleId: { type: String, required: true, index: true },
    path: { type: String, default: 'A' },
    destination: { type: String, default: 'MAIN' },
    type: {
      type: String,
      enum: ['SOS', 'CHECKIN', 'UNKNOWN_CARD', 'MESSAGE', 'HEARTBEAT', 'CHECKIN_PENDING'],
      required: true,
      index: true,
    },
    rawData: { type: String, required: true },
    normalizedUid: { type: String, default: null },
    resolvedName: { type: String, default: null },
    receivedAt: { type: Date, required: true, default: Date.now, index: true },
    acknowledgedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

eventSchema.index({ type: 1, receivedAt: -1 });

export const Event = mongoose.model('Event', eventSchema);
