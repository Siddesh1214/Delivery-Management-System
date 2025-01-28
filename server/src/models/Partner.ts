import mongoose, { Schema,Document } from "mongoose";

interface Shift {
  start: string; // HH:mm format
  end: string;   // HH:mm format
}

interface Metrics {
  rating: number; // Average rating
  completedOrders: number; // Total number of completed orders
  cancelledOrders: number; // Total number of cancelled orders
}

export interface DeliveryPartner extends Document{
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  currentLoad: number; // Maximum: 3
  areas: string[]; 
  shift: Shift;
  metrics: Metrics;
}


const PartnerSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  currentLoad: {
    type: Number,
    default: 0
  },
  areas: {
    type: [String],
    required: true
  },
  shift: {
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    },
  },
  metrics: {
    rating: {
      type: Number,
      default: 0
    },
    completedOrders: {
      type: Number,
      default: 0
    },
    cancelledOrders: {
      type: Number,
      default: 0
    },
  },
  

});

export default mongoose.model<DeliveryPartner>('Partner', PartnerSchema);