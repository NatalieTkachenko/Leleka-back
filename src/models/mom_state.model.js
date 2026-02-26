import { Schema, model } from 'mongoose';

const MomStateSchema = new Schema(
  {
    weekNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 42,
    },

    feelings: {
      _id: false,
      states: { type: [String], default: [] },
      sensationDescr: String,
    },
    comfortTips: [
      {
        _id: false,
        category: { type: String, default: '' },
        tip: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
    strict: true,
  },
);

export const MomState = model('MomState', MomStateSchema, 'mom_states');
