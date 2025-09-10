// models/Location.js
const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "temple",
        "facility",
        "emergency",
        "information",
        "parking",
        "food",
        "restroom",
        "security",
        "other",
      ],
      default: "other",
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    description: {
      type: String,
      default: "",
    },
    capacity: {
      type: Number,
      min: 0,
      default: 0,
    },
    currentOccupancy: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance", "closed"],
      default: "active",
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    operatingHours: {
      open: {
        type: String,
        default: "06:00",
      },
      close: {
        type: String,
        default: "22:00",
      },
    },
    isEmergencyPoint: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Location", locationSchema);
