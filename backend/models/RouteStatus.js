const mongoose = require("mongoose");

const routeStatusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["open", "closed", "congested", "diverted"],
      default: "open",
    },
    liveMessage: { type: String },
    coordinates: [{ lat: Number, lng: Number }],
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RouteStatus", routeStatusSchema);
