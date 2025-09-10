// models/DevoteeTiming.js
const mongoose = require("mongoose");

const devoteeTimingSchema = new mongoose.Schema(
  {
    devoteeId: { type: String, required: true }, // Could be device ID or anonymous token
    zone: { type: String, required: true }, // e.g., 'Snan Ghat', 'Temple', etc.
    entryTime: { type: Date, required: true },
    exitTime: { type: Date },
    durationMinutes: { type: Number },
    overstay: { type: Boolean, default: false },
    alertSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DevoteeTiming", devoteeTimingSchema);
