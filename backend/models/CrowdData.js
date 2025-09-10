// models/CrowdData.js
const mongoose = require("mongoose");

const crowdDataSchema = new mongoose.Schema(
  {
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    currentOccupancy: {
      type: Number,
      required: true,
    },
    crowdLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    heatmap: {
      type: [[Number]], // Optional: 2D array for heatmap
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CrowdData", crowdDataSchema);
