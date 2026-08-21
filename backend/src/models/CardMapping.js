import mongoose from 'mongoose';

const cardMappingSchema = new mongoose.Schema(
  {
    normalizedUid: { type: String, required: true, unique: true, index: true },
    rawUid: { type: String, required: true },
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const CardMapping = mongoose.model('CardMapping', cardMappingSchema);
