import { Schema, model } from 'mongoose';

export const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    avatar: { type: String, default: '' },
    dueDate: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ },
    theme: {
      type: String,
      enum: ['girl', 'boy', 'neutral'],
      default: 'neutral',
    },
  },
  { timestamps: true },
);

userSchema.pre('save', function () {
  if (!this.name) {
    this.name = this.email;
  }
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
