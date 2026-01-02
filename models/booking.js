import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    selectedDay: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    mainOption: {
      type: String,
      required: true,
    },
    subOption: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
