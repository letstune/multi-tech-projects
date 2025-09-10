// routes/timingRoutes.js
const express = require("express");
const router = express.Router();
const DevoteeTiming = require("../models/DevoteeTiming");

router.get("/", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Timing endpoint working",
      data: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching timing data",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(201).json({
      success: true,
      message: "Timing data created (placeholder)",
      data: req.body,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating timing data",
      error: error.message,
    });
  }
});

// POST /api/timing/entry - Log devotee entry
router.post("/entry", async (req, res) => {
  try {
    const { devoteeId, zone } = req.body;
    if (!devoteeId || !zone) {
      return res
        .status(400)
        .json({ success: false, message: "devoteeId and zone required" });
    }
    const entry = await DevoteeTiming.create({
      devoteeId,
      zone,
      entryTime: new Date(),
    });
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging entry",
      error: error.message,
    });
  }
});

// POST /api/timing/exit - Log devotee exit
router.post("/exit", async (req, res) => {
  try {
    const { devoteeId, zone } = req.body;
    if (!devoteeId || !zone) {
      return res
        .status(400)
        .json({ success: false, message: "devoteeId and zone required" });
    }
    const timing = await DevoteeTiming.findOne({
      devoteeId,
      zone,
      exitTime: { $exists: false },
    }).sort({ entryTime: -1 });
    if (!timing) {
      return res.status(404).json({
        success: false,
        message: "No active entry found for devotee in this zone",
      });
    }
    const exitTime = new Date();
    const durationMinutes = Math.round((exitTime - timing.entryTime) / 60000);
    const overstay = durationMinutes > 60; // Example: 60 min safe duration
    timing.exitTime = exitTime;
    timing.durationMinutes = durationMinutes;
    timing.overstay = overstay;
    await timing.save();
    res.status(200).json({ success: true, data: timing });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging exit",
      error: error.message,
    });
  }
});

// GET /api/timing/alerts - Get overstay alerts
router.get("/alerts", async (req, res) => {
  try {
    const overstays = await DevoteeTiming.find({
      overstay: true,
      alertSent: false,
    });
    res.status(200).json({ success: true, data: overstays });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching alerts",
      error: error.message,
    });
  }
});

// GET /api/timing/history/:devoteeId - Get devotee timing history
router.get("/history/:devoteeId", async (req, res) => {
  try {
    const history = await DevoteeTiming.find({
      devoteeId: req.params.devoteeId,
    }).sort({ entryTime: -1 });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching history",
      error: error.message,
    });
  }
});

module.exports = router;
