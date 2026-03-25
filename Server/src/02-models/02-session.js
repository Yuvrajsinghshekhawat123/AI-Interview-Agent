import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  refreshTokenHash: {
    type: String,
    required: true,
  },
  userAgent: String,
  clientIp: String,
}, { timestamps: true });


export const Session=mongoose.model("Session",sessionSchema);