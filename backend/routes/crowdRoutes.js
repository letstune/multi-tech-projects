const express = require("express");
const router = express.Router();
const CrowdData = require("../models/CrowdData");
const Location = require("../models/Location");
const { predictCrowd } = require("../utils/aiCrowdPredictor");

// GET all crowd data
router.get("/", async (req, res) => {
  try {
    const data = await CrowdData.find().sort({ timestamp: -1 });
    res.status(200).json({
      success: true,
      data,
      total: data.length,
      message: "Crowd data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching crowd data",
      error: error.message,
    });
  }
});

// POST new crowd data
router.post("/", async (req, res) => {
  try {
    const newData = await CrowdData.create(req.body);
    res.status(201).json({
      success: true,
      data: newData,
      message: "Crowd data created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating crowd data",
      error: error.message,
    });
  }
});

// GET real-time crowd heatmap (latest per location)
router.get("/realtime", async (req, res) => {
  try {
    // Get all locations
    const locations = await Location.find();
    // For each location, get the latest crowd data
    const realtime = await Promise.all(
      locations.map(async (loc) => {
        const latest = await CrowdData.findOne({ locationId: loc._id }).sort({
          timestamp: -1,
        });
        return {
          _id: loc._id,
          name: loc.name,
          type: loc.type,
          coordinates: loc.coordinates,
          capacity: loc.capacity,
          currentOccupancy: latest ? latest.currentOccupancy : 0,
          crowdLevel: latest ? latest.crowdLevel : "unknown",
          updatedAt: latest ? latest.timestamp : null,
        };
      })
    );
    res.status(200).json({
      success: true,
      data: realtime,
      message: "Real-time crowd data",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching real-time crowd data",
      error: error.message,
    });
  }
});

// GET AI crowd prediction
router.get("/prediction", async (req, res) => {
  try {
    const prediction = await predictCrowd();
    res.status(200).json({ success: true, data: prediction });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error predicting crowd",
      error: error.message,
    });
  }
});

// GET crowd statistics
router.get("/stats", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Crowd statistics retrieved successfully",
      data: {
        overview: {
          totalEntries: 445,
          avgOccupancy: 52,
          currentAlerts: 1,
          peakHour: "18:00",
          totalCapacity: 850,
          currentOccupancy: 445,
        },
        byLocation: [
          {
            location: "Main Temple",
            avgOccupancy: 60,
            peakTime: "19:00",
            currentCount: 250,
            capacity: 500,
          },
          {
            location: "Food Court",
            avgOccupancy: 25,
            peakTime: "12:00",
            currentCount: 75,
            capacity: 200,
          },
          {
            location: "Parking Area",
            avgOccupancy: 85,
            peakTime: "20:00",
            currentCount: 120,
            capacity: 150,
          },
        ],
        trends: {
          hourly: [
            { hour: 6, avgCount: 50 },
            { hour: 12, avgCount: 200 },
            { hour: 18, avgCount: 400 },
            { hour: 20, avgCount: 350 },
          ],
        },
      },
    });
  } catch (error) {
    console.error("Error fetching crowd stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching crowd stats",
      error: error.message,
    });
  }
});

// GET dashboard data
router.get("/dashboard", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: {
        summary: {
          totalLocations: 5,
          totalCapacity: 850,
          totalOccupancy: 445,
          averageOccupancyRate: 52,
          criticalLocations: 0,
          highRiskLocations: 1,
          activeAlerts: 1,
        },
        locations: [
          {
            name: "Main Temple",
            currentCount: 250,
            capacity: 500,
            occupancyPercentage: 50,
            crowdLevel: "medium",
            status: "normal",
            coordinates: { latitude: 28.6139, longitude: 77.209 },
          },
          {
            name: "Food Court",
            currentCount: 75,
            capacity: 200,
            occupancyPercentage: 37,
            crowdLevel: "low",
            status: "normal",
            coordinates: { latitude: 28.6135, longitude: 77.2085 },
          },
          {
            name: "Parking Area",
            currentCount: 120,
            capacity: 150,
            occupancyPercentage: 80,
            crowdLevel: "high",
            status: "alert",
            coordinates: { latitude: 28.614, longitude: 77.2095 },
          },
        ],
        alerts: {
          critical: [],
          high: [
            {
              id: "1",
              location: "Parking Area",
              message: "Approaching capacity limit (80% full)",
              type: "capacity",
              timestamp: new Date(),
              priority: "high",
            },
          ],
        },
        recentActivity: [
          {
            time: new Date(),
            location: "Main Temple",
            activity: "Normal crowd flow",
            type: "info",
          },
          {
            time: new Date(Date.now() - 300000), // 5 minutes ago
            location: "Parking Area",
            activity: "High occupancy alert triggered",
            type: "warning",
          },
        ],
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
});

// GET crowd alerts (congestion/diversion)
router.get("/alerts", async (req, res) => {
  try {
    const critical = await CrowdData.find({
      crowdLevel: { $in: ["high", "critical"] },
    }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, data: critical });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching crowd alerts",
      error: error.message,
    });
  }
});

// GET overcapacity alerts
router.get("/alerts/overcapacity", async (req, res) => {
  try {
    const alerts = [
      {
        id: "1",
        location: "Parking Area",
        currentCount: 120,
        capacity: 150,
        occupancyPercentage: 80,
        alertLevel: "warning",
        message: "Location approaching maximum capacity",
        triggeredAt: new Date(),
        estimatedWaitTime: 10,
      },
    ];

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error("Error fetching overcapacity alerts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching overcapacity alerts",
      error: error.message,
    });
  }
});

// POST bulk crowd data update
router.post("/bulk", async (req, res) => {
  try {
    const { updates } = req.body;
    console.log("Bulk crowd data update received:", updates);

    if (!Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        message: "Updates must be an array",
      });
    }

    // Simulate processing bulk updates
    const processedUpdates = updates.map((update) => ({
      ...update,
      id: Date.now().toString() + Math.random(),
      processedAt: new Date(),
      status: "processed",
    }));

    res.status(200).json({
      success: true,
      message: `Processed ${updates.length} crowd data updates`,
      data: {
        processed: updates.length,
        timestamp: new Date(),
        updates: processedUpdates,
      },
    });
  } catch (error) {
    console.error("Error bulk updating crowd data:", error);
    res.status(500).json({
      success: false,
      message: "Error bulk updating crowd data",
      error: error.message,
    });
  }
});

// GET crowd data by location
router.get("/location/:locationId", async (req, res) => {
  try {
    const { locationId } = req.params;

    res.status(200).json({
      success: true,
      message: "Location-specific crowd data retrieved",
      data: {
        locationId,
        name: "Main Temple",
        currentCount: 250,
        capacity: 500,
        occupancyPercentage: 50,
        crowdLevel: "medium",
        waitTime: 5,
        lastUpdated: new Date(),
        hourlyData: [
          { hour: 6, count: 50 },
          { hour: 12, count: 200 },
          { hour: 18, count: 400 },
          { hour: 20, count: 250 },
        ],
      },
    });
  } catch (error) {
    console.error("Error fetching location crowd data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching location crowd data",
      error: error.message,
    });
  }
});

// GET crowd data by location
router.get("/location/:locationId", async (req, res) => {
  try {
    const { locationId } = req.params;

    res.status(200).json({
      success: true,
      message: "Location-specific crowd data retrieved",
      data: {
        locationId,
        name: "Main Temple",
        currentCount: 250,
        capacity: 500,
        occupancyPercentage: 50,
        crowdLevel: "medium",
        waitTime: 5,
        lastUpdated: new Date(),
        hourlyData: [
          { hour: 6, count: 50 },
          { hour: 12, count: 200 },
          { hour: 18, count: 400 },
          { hour: 20, count: 250 },
        ],
      },
    });
  } catch (error) {
    console.error("Error fetching location crowd data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching location crowd data",
      error: error.message,
    });
  }
});

// POST simulate emergency (for testing)
router.post("/simulate-emergency", async (req, res) => {
  try {
    console.log("Emergency simulation triggered:", req.body);
    res.status(200).json({
      success: true,
      message: "Emergency simulation triggered",
      data: {
        alertId: Date.now().toString(),
        type: "emergency",
        location: req.body.location || "Main Temple",
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Error simulating emergency:", error);
    res.status(500).json({
      success: false,
      message: "Error simulating emergency",
      error: error.message,
    });
  }
});

module.exports = router;
