import mongoose, { Schema, models, model } from "mongoose";

export interface IReservation {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  quantity: number;
  paymentMethod: "cash";
  description?: string;
  customDesignImage?: string; // base64 data URL, optional
  unitPrice: number;
  discountApplied: boolean;
  totalPrice: number;
  createdAt: Date;
}

const ReservationSchema = new Schema<IReservation>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  addressLine1: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  paymentMethod: { type: String, enum: ["cash"], default: "cash" },
  description: { type: String, trim: true },
  customDesignImage: { type: String },
  unitPrice: { type: Number, required: true },
  discountApplied: { type: Boolean, default: false },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Reservation ||
  model<IReservation>("Reservation", ReservationSchema);
