const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    severity: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High", "Critical"],
    },
    message: { type: String, required: true },
    location: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    timestamp: { type: Date, default: Date.now },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Acknowledged", "Resolved", "In Progress"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
