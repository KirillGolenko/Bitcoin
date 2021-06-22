import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const Schema = mongoose.Schema;
const users = new Schema(
  {
    name: String,
    username: String,
    email: String,
    bitcoinAmount: { type: Number, default: 0 },
    usdBalance: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

export const Users = mongoose.model('users', users);
