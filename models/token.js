import e from 'express';
import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Number,
      required: true,
    },
    data: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

export const Token = mongoose.model('Token', tokenSchema);
export default Token;
