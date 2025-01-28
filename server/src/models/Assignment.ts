import mongoose, { Schema, Document } from 'mongoose';

export interface Assignment extends Document {
  orderId: string; // ID of the assigned order
  partnerId: string; // ID of the delivery partner
  timestamp: Date; // Time of assignment
  status: 'success' | 'failed'; // Assignment status
  reason?: string; // Failure reason if status is 'failed'
}

const AssignmentSchema: Schema = new Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order', required: true
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner', required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      required: true
    },
    reason: {
      type: String
    },
  },
  { timestamps: true }
);

export default mongoose.model<Assignment>('Assignment', AssignmentSchema);
