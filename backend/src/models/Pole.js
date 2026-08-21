import mongoose from 'mongoose';

const poleSchema = new mongoose.Schema(
  {
    poleId: { type: String, required: true, unique: true },
    label: { type: String, default: '' },
    lastSeenAt: { type: Date, default: Date.now },
    eventCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Pole = mongoose.model('Pole', poleSchema);
