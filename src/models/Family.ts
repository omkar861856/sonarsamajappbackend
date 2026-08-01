import mongoose from 'mongoose';

const FamilySchema = new mongoose.Schema({
  headName: { type: String, required: true },
  city: { type: String, required: true },
  memberCount: { type: Number, default: 1 },
  cast: { type: String, default: 'Sonar Shehbandh' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export const Family = mongoose.model('Family', FamilySchema);
