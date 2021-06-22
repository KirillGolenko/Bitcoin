import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const bitcoin = new Schema(
  {
    price: { type: Number, default: 100 },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  },
);

export const Bitcoin = mongoose.model('bitcoin', bitcoin);
