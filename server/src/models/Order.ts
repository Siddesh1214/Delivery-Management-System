import mongoose, { Schema, Document } from 'mongoose';

interface Customer {
  name: string;
  phone: string;
  address: string;
}

interface Item {
  name: string;
  quantity: number;
  price: number;
}

export interface Order extends Document {
  orderNumber: string;
  customer: Customer;
  area: string;
  items: Item[];
  status: 'pending' | 'assigned' | 'picked' | 'delivered';
  scheduledFor: string; 
  assignedTo?: string;  
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
  },
  area: {
    type: String,
    required: true
  },
    items: [
      {
        name: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
      },
    ],
  status: {
    type: String,
    enum: ['pending', 'assigned', 'picked', 'delivered'],
    default: 'pending'
  },
  scheduledFor: {
    type: String,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  },
  { timestamps: true }
);

export default mongoose.model<Order>('Order', OrderSchema);
