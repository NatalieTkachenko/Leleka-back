import { Schema, model } from 'mongoose';

export const DiaryNoteSchema = new Schema(
  {
    title: { type: String, min: 1, max: 64, required: true },
    description: { type: String, min: 1, max: 100, required: true },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    emotions: { type: [String], min: 1, max: 12, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export const DiaryNote = model('DiaryNote', DiaryNoteSchema, 'diary_notes');
