 import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value); // ✅ FIXED
        },
        message: "Invalid email address",
      },
    },

    firebaseUid: { type: String, required: true }, // ✅ FIXED POSITION

    credits: { type: Number, default: 100 }, // ✅ FIXED POSITION
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);