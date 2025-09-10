// // models/LostFound.js

const mongoose = require("mongoose");

const lostFoundSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["lost", "found"],
    },
    item: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: "open",
      enum: ["open", "claimed", "resolved"],
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    reporter: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    claimedBy: {
      type: String,
    },
    claimedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LostFound", lostFoundSchema);
