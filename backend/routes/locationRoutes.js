const express = require("express");
const router = express.Router();

// GET all locations
router.get("/", async (req, res) => {
  try {
    const Location = require("../models/Location");
    const locations = await Location.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching locations",
      error: error.message,
    });
  }
});

// POST new location
router.post("/", async (req, res) => {
  try {
    const Location = require("../models/Location");
    const location = await Location.create(req.body);

    res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: location,
    });
  } catch (error) {
    console.error("Error creating location:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating location",
      error: error.message,
    });
  }
});

// GET location statistics
router.get("/stats", async (req, res) => {
  try {
    const Location = require("../models/Location");
    const totalLocations = await Location.countDocuments();
    const activeLocations = await Location.countDocuments({ status: "active" });
    const totalCapacity = await Location.aggregate([
      { $group: { _id: null, total: { $sum: "$capacity" } } },
    ]);
    const totalOccupancy = await Location.aggregate([
      { $group: { _id: null, total: { $sum: "$currentOccupancy" } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLocations,
        activeLocations,
        totalCapacity: totalCapacity[0]?.total || 0,
        totalOccupancy: totalOccupancy[0]?.total || 0,
        occupancyRate: totalCapacity[0]?.total
          ? Math.round(
              ((totalOccupancy[0]?.total || 0) / totalCapacity[0].total) * 100
            )
          : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching location stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching location statistics",
      error: error.message,
    });
  }
});

// GET single location
router.get("/:id", async (req, res) => {
  try {
    const Location = require("../models/Location");
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching location",
      error: error.message,
    });
  }
});

// PUT update location
router.put("/:id", async (req, res) => {
  try {
    const Location = require("../models/Location");
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      data: location,
    });
  } catch (error) {
    console.error("Error updating location:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating location",
      error: error.message,
    });
  }
});

// DELETE location
router.delete("/:id", async (req, res) => {
  try {
    const Location = require("../models/Location");
    const location = await Location.findByIdAndDelete(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting location",
      error: error.message,
    });
  }
});

module.exports = router;
