// models/CreditPackage.js - Same as Stripe version
import mongoose from "mongoose";



// You send this to frontend because frontend needs this data to show plans to the user
/*
🔹 Why needed
Display pricing cards (Free, Starter, Pro)
Show credits, price, features
Let user choose a plan
*/
const creditPackageSchema = new mongoose.Schema({
  name: { type: String, required: true, enum: ["Free", "Starter Pack", "Pro Pack"] },
  credits: { type: Number, required: true },
  price: { type: Number, required: true, default: 0 },
  currency: { type: String, default: "INR" },
  isFree: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  features: [{ name: String, included: Boolean }],
  savings: String,
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const CreditPackage = mongoose.model("CreditPackage", creditPackageSchema);



// models/Payment.js
const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "CreditPackage", required: true },
  packageName: String,
  credits: { type: Number, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  
  // Razorpay Specific Fields
  razorpayOrderId: { type: String, unique: true, sparse: true },
  razorpayPaymentId: { type: String, unique: true, sparse: true },
  razorpaySignature: String,
  
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  paidAt: Date,
  failedReason: String,
}, { timestamps: true });

paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });

export const Payment = mongoose.model("Payment", paymentSchema);