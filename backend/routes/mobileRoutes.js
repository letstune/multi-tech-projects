const express = require("express");
const router = express.Router();
const {
  getPublicLocations,
  getCrowdLevels,
  submitLostFoundItem,
  getPublicAlerts,
  emergencySOS,
  getDirections,
  getNearbyAmenities,
  submitFeedback,
  getEventSchedule,
  getRealTimeUpdates,
} = require("../controllers/mobileController");

// Test route
router.get("/", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Mobile endpoint working",
      data: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching mobile data",
      error: error.message,
    });
  }
});

// Placeholder for POST requests
router.post("/", async (req, res) => {
  try {
    res.status(201).json({
      success: true,
      message: "Mobile data created (placeholder)",
      data: req.body,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating mobile data",
      error: error.message,
    });
  }
});

// Public location information
router.get("/locations", getPublicLocations);

// Real-time crowd levels
router.get("/crowd-levels", getCrowdLevels);

// Lost and found
router.post("/lost-found", submitLostFoundItem);

// Public alerts and announcements
router.get("/alerts", getPublicAlerts);

// Emergency SOS
router.post("/emergency", emergencySOS);

// Navigation and directions
router.get("/directions", getDirections);

// Nearby amenities
router.get("/amenities", getNearbyAmenities);

// Feedback and complaints
router.post("/feedback", submitFeedback);

// Event schedule
router.get("/events", getEventSchedule);

// Real-time updates
router.get("/updates", getRealTimeUpdates);

module.exports = router;
