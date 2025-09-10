const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Devotees endpoint working",
      data: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching devotees",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(201).json({
      success: true,
      message: "Devotee created (placeholder)",
      data: req.body,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating devotee",
      error: error.message,
    });
  }
});

module.exports = router;
