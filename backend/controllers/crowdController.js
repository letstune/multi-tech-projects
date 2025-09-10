// controllers/crowdController.js
const CrowdData = require("../models/CrowdData");
const axios = require("axios"); // For hypothetical AI API call

// Mock AI-based crowd data with predictions
let crowdData = [
  {
    _id: "1",
    zoneName: "Main Ghat Area",
    coordinates: { lat: 25.4358, lng: 81.8463 },
    currentDensity: 85,
    maxCapacity: 5000,
    currentCount: 4250,
    prediction: {
      nextHour: 92,
      next30Min: 88,
      riskLevel: "High",
      recommendedAction: "Deploy additional crowd control and restrict entry",
      confidence: 94,
    },
    surveillance: {
      activeCameras: 12,
      anomalyDetected: true,
      lastAnomaly: "Overcrowding detected",
      aiAlertLevel: "Critical",
    },
    devoteeFlow: {
      entryRate: 45, // people per minute
      exitRate: 32,
      avgStayTime: 35, // minutes
      peakHours: ["06:00-09:00", "17:00-20:00"],
    },
    weatherImpact: {
      temperature: 28,
      humidity: 65,
      windSpeed: 5,
      comfortIndex: "Moderate",
    },
    timestamp: new Date().toISOString(),
  },
  {
    _id: "2",
    zoneName: "Puja Kendra Complex",
    coordinates: { lat: 25.4368, lng: 81.8473 },
    currentDensity: 65,
    maxCapacity: 3000,
    currentCount: 1950,
    prediction: {
      nextHour: 70,
      next30Min: 68,
      riskLevel: "Medium",
      recommendedAction: "Monitor closely and prepare for crowd increase",
      confidence: 87,
    },
    surveillance: {
      activeCameras: 8,
      anomalyDetected: false,
      lastAnomaly: null,
      aiAlertLevel: "Normal",
    },
    devoteeFlow: {
      entryRate: 25,
      exitRate: 22,
      avgStayTime: 45,
      peakHours: ["05:00-08:00", "18:00-21:00"],
    },
    weatherImpact: {
      temperature: 27,
      humidity: 60,
      windSpeed: 8,
      comfortIndex: "Good",
    },
    timestamp: new Date().toISOString(),
  },
  {
    _id: "3",
    zoneName: "Service & Rest Area",
    coordinates: { lat: 25.4348, lng: 81.8453 },
    currentDensity: 45,
    maxCapacity: 2000,
    currentCount: 900,
    prediction: {
      nextHour: 40,
      next30Min: 42,
      riskLevel: "Low",
      recommendedAction: "Normal operations - good flow management",
      confidence: 91,
    },
    surveillance: {
      activeCameras: 6,
      anomalyDetected: false,
      lastAnomaly: null,
      aiAlertLevel: "Normal",
    },
    devoteeFlow: {
      entryRate: 15,
      exitRate: 18,
      avgStayTime: 25,
      peakHours: ["12:00-14:00", "19:00-21:00"],
    },
    weatherImpact: {
      temperature: 26,
      humidity: 58,
      windSpeed: 10,
      comfortIndex: "Excellent",
    },
    timestamp: new Date().toISOString(),
  },
];

// AI prediction algorithms (simulated)
const generateAIPrediction = (currentData) => {
  const { currentDensity, devoteeFlow, weatherImpact } = currentData;

  // Simulate AI calculation based on various factors
  const flowRate = devoteeFlow.entryRate - devoteeFlow.exitRate;
  const weatherFactor =
    weatherImpact.comfortIndex === "Excellent"
      ? 1.1
      : weatherImpact.comfortIndex === "Good"
      ? 1.05
      : weatherImpact.comfortIndex === "Moderate"
      ? 1.0
      : 0.9;

  const predicted30Min = Math.min(
    100,
    Math.max(0, currentDensity + flowRate * 0.5 * weatherFactor)
  );

  const predictedHour = Math.min(
    100,
    Math.max(0, currentDensity + flowRate * 1.2 * weatherFactor)
  );

  let riskLevel = "Low";
  let recommendedAction = "Normal operations";

  if (predictedHour > 80) {
    riskLevel = "High";
    recommendedAction = "Deploy crowd control, restrict entry if needed";
  } else if (predictedHour > 60) {
    riskLevel = "Medium";
    recommendedAction = "Monitor closely, prepare intervention";
  }

  return {
    nextHour: Math.round(predictedHour),
    next30Min: Math.round(predicted30Min),
    riskLevel,
    recommendedAction,
    confidence: Math.round(85 + Math.random() * 10), // 85-95% confidence
  };
};

// Get all crowd data with AI predictions
const getCrowdData = async (req, res) => {
  try {
    // Update predictions in real-time
    const updatedCrowdData = crowdData.map((zone) => ({
      ...zone,
      prediction: generateAIPrediction(zone),
      timestamp: new Date().toISOString(),
    }));

    const totalPeople = updatedCrowdData.reduce(
      (sum, zone) => sum + zone.currentCount,
      0
    );
    const avgDensity = Math.round(
      updatedCrowdData.reduce((sum, zone) => sum + zone.currentDensity, 0) /
        updatedCrowdData.length
    );
    const highRiskZones = updatedCrowdData.filter(
      (zone) => zone.prediction.riskLevel === "High"
    ).length;

    res.json({
      success: true,
      data: updatedCrowdData,
      analytics: {
        totalPeople,
        avgDensity,
        highRiskZones,
        totalZones: updatedCrowdData.length,
        activeAnomalies: updatedCrowdData.filter(
          (zone) => zone.surveillance.anomalyDetected
        ).length,
      },
      message: "AI crowd data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving crowd data",
      error: error.message,
    });
  }
};

// Add new crowd data
const addCrowdData = async (req, res) => {
  try {
    const { zoneId, density } = req.body;
    const prediction = await predictCrowdDensity(density);
    const crowdData = new CrowdData({ zoneId, density, prediction });
    await crowdData.save();
    // Check for alerts
    if (prediction > 100) {
      // Threshold for congestion
      // Trigger alert logic (e.g., send notification)
      console.log("Congestion alert for zone:", zoneId);
    }
    res.json({ success: true, data: crowdData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update crowd data
const updateCrowdData = async (req, res) => {
  try {
    const data = await CrowdData.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete crowd data
const deleteCrowdData = async (req, res) => {
  try {
    await CrowdData.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addCrowdData = addCrowdData;
exports.getHeatmap = async (req, res) => {
  try {
    const heatmapData = crowdData.map((zone) => ({
      lat: zone.coordinates.lat,
      lng: zone.coordinates.lng,
      intensity: zone.currentDensity / 100,
      radius: Math.max(20, zone.currentDensity * 2),
      color:
        zone.currentDensity > 80
          ? "#ff4444"
          : zone.currentDensity > 60
          ? "#ffaa00"
          : zone.currentDensity > 40
          ? "#44aaff"
          : "#44ff44",
    }));

    res.json({
      success: true,
      data: heatmapData,
      message: "Heatmap data generated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating heatmap data",
      error: error.message,
    });
  }
};

exports.getPredictions = async (req, res) => {
  try {
    const predictions = crowdData.map((zone) => ({
      zoneId: zone._id,
      zoneName: zone.zoneName,
      currentDensity: zone.currentDensity,
      prediction: generateAIPrediction(zone),
      coordinates: zone.coordinates,
    }));

    res.json({
      success: true,
      data: predictions,
      generatedAt: new Date().toISOString(),
      message: "AI predictions generated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating predictions",
      error: error.message,
    });
  }
};

exports.getSurveillance = async (req, res) => {
  try {
    const surveillanceData = crowdData.map((zone) => ({
      zoneId: zone._id,
      zoneName: zone.zoneName,
      surveillance: zone.surveillance,
      coordinates: zone.coordinates,
      timestamp: zone.timestamp,
    }));

    const totalCameras = crowdData.reduce(
      (sum, zone) => sum + zone.surveillance.activeCameras,
      0
    );
    const activeAnomalies = crowdData.filter(
      (zone) => zone.surveillance.anomalyDetected
    ).length;

    res.json({
      success: true,
      data: surveillanceData,
      summary: {
        totalCameras,
        activeAnomalies,
        systemStatus: activeAnomalies > 0 ? "Alert" : "Normal",
      },
      message: "Surveillance data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving surveillance data",
      error: error.message,
    });
  }
};

exports.updateDensity = async (req, res) => {
  try {
    const { zoneId, newDensity, peopleCount } = req.body;

    const zoneIndex = crowdData.findIndex((zone) => zone._id === zoneId);
    if (zoneIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Zone not found",
      });
    }

    // Update crowd data
    crowdData[zoneIndex].currentDensity = newDensity;
    crowdData[zoneIndex].currentCount =
      peopleCount || crowdData[zoneIndex].currentCount;
    crowdData[zoneIndex].timestamp = new Date().toISOString();

    // Generate new AI prediction
    crowdData[zoneIndex].prediction = generateAIPrediction(
      crowdData[zoneIndex]
    );

    // Check for anomalies
    if (newDensity > 80) {
      crowdData[zoneIndex].surveillance.anomalyDetected = true;
      crowdData[zoneIndex].surveillance.lastAnomaly = "High density detected";
      crowdData[zoneIndex].surveillance.aiAlertLevel = "Critical";
    } else if (newDensity > 60) {
      crowdData[zoneIndex].surveillance.aiAlertLevel = "Warning";
    } else {
      crowdData[zoneIndex].surveillance.anomalyDetected = false;
      crowdData[zoneIndex].surveillance.aiAlertLevel = "Normal";
    }

    res.json({
      success: true,
      data: crowdData[zoneIndex],
      message: "Crowd density updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating crowd density",
      error: error.message,
    });
  }
};

exports.simulateEmergency = async (req, res) => {
  try {
    const { zoneId, emergencyType = "overcrowding" } = req.body;

    const zoneIndex = crowdData.findIndex((zone) => zone._id === zoneId);
    if (zoneIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Zone not found",
      });
    }

    // Simulate emergency scenario
    crowdData[zoneIndex].currentDensity = 95;
    crowdData[zoneIndex].surveillance.anomalyDetected = true;
    crowdData[
      zoneIndex
    ].surveillance.lastAnomaly = `Emergency simulation: ${emergencyType}`;
    crowdData[zoneIndex].surveillance.aiAlertLevel = "Critical";
    crowdData[zoneIndex].prediction = {
      nextHour: 98,
      next30Min: 97,
      riskLevel: "Critical",
      recommendedAction: "IMMEDIATE EVACUATION REQUIRED",
      confidence: 99,
    };

    res.json({
      success: true,
      data: crowdData[zoneIndex],
      message: "Emergency scenario simulated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error simulating emergency",
      error: error.message,
    });
  }
};

exports.deleteCrowdData = deleteCrowdData;
exports.getCrowdData = getCrowdData;
exports.updateCrowdData = updateCrowdData;

// GET /api/crowd/analytics - Get detailed analytics
const getCrowdAnalytics = async (req, res) => {
  try {
    const { timeframe = "24h" } = req.query;

    // Update all zone data with real-time predictions
    const updatedCrowdData = crowdData.map((zone) => ({
      ...zone,
      prediction: generateAIPrediction(zone),
      timestamp: new Date().toISOString(),
    }));

    const totalCapacity = updatedCrowdData.reduce(
      (sum, zone) => sum + zone.maxCapacity,
      0
    );
    const totalCurrent = updatedCrowdData.reduce(
      (sum, zone) => sum + zone.currentCount,
      0
    );
    const overallDensity = Math.round((totalCurrent / totalCapacity) * 100);

    const zoneAnalytics = updatedCrowdData.map((zone) => ({
      zoneName: zone.zoneName,
      zoneId: zone._id,
      coordinates: zone.coordinates,
      efficiency: Math.round(
        (zone.devoteeFlow.exitRate / zone.devoteeFlow.entryRate) * 100
      ),
      avgStayTime: zone.devoteeFlow.avgStayTime,
      capacityUtilization: Math.round(
        (zone.currentCount / zone.maxCapacity) * 100
      ),
      riskScore:
        zone.prediction.riskLevel === "High"
          ? 3
          : zone.prediction.riskLevel === "Medium"
          ? 2
          : 1,
      currentDensity: zone.currentDensity,
      prediction: zone.prediction,
      surveillance: zone.surveillance,
      devoteeFlow: zone.devoteeFlow,
      weatherImpact: zone.weatherImpact,
    }));

    // Peak hours analysis
    const peakHoursData = updatedCrowdData.map((zone) => ({
      zoneName: zone.zoneName,
      peakHours: zone.devoteeFlow.peakHours,
      entryRate: zone.devoteeFlow.entryRate,
      exitRate: zone.devoteeFlow.exitRate,
    }));

    // Risk assessment
    const highRiskZones = updatedCrowdData.filter(
      (zone) => zone.prediction.riskLevel === "High"
    );
    const mediumRiskZones = updatedCrowdData.filter(
      (zone) => zone.prediction.riskLevel === "Medium"
    );
    const lowRiskZones = updatedCrowdData.filter(
      (zone) => zone.prediction.riskLevel === "Low"
    );

    const recommendations = [
      overallDensity > 70
        ? "Consider implementing crowd flow restrictions"
        : null,
      updatedCrowdData.some((zone) => zone.surveillance.anomalyDetected)
        ? "Active anomalies detected - investigate immediately"
        : null,
      highRiskZones.length > 1
        ? "Multiple high-risk zones - deploy additional resources"
        : null,
      overallDensity > 85
        ? "CRITICAL: Overall capacity approaching maximum - implement emergency protocols"
        : null,
    ].filter(Boolean);

    // Real-time statistics
    const realTimeStats = {
      totalPeople: totalCurrent,
      totalCapacity,
      overallDensity,
      avgDensity: Math.round(
        updatedCrowdData.reduce((sum, zone) => sum + zone.currentDensity, 0) /
          updatedCrowdData.length
      ),
      efficiency: Math.round(
        zoneAnalytics.reduce((sum, zone) => sum + zone.efficiency, 0) /
          zoneAnalytics.length
      ),
      activeAnomalies: updatedCrowdData.filter(
        (zone) => zone.surveillance.anomalyDetected
      ).length,
      totalCameras: updatedCrowdData.reduce(
        (sum, zone) => sum + zone.surveillance.activeCameras,
        0
      ),
      riskDistribution: {
        high: highRiskZones.length,
        medium: mediumRiskZones.length,
        low: lowRiskZones.length,
      },
    };

    res.json({
      success: true,
      data: {
        overview: realTimeStats,
        zoneAnalytics,
        peakHours: peakHoursData,
        riskAssessment: {
          highRiskZones: highRiskZones.map((zone) => ({
            name: zone.zoneName,
            density: zone.currentDensity,
            prediction: zone.prediction,
          })),
          mediumRiskZones: mediumRiskZones.map((zone) => ({
            name: zone.zoneName,
            density: zone.currentDensity,
            prediction: zone.prediction,
          })),
        },
        recommendations,
        lastUpdated: new Date().toISOString(),
        timeframe,
        refreshInterval: 30, // seconds
      },
      message: "Real-time analytics generated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating analytics",
      error: error.message,
    });
  }
};

// Real-time data simulation function
const simulateRealTimeUpdates = () => {
  crowdData = crowdData.map((zone) => {
    // Simulate small changes in crowd density
    const densityChange = (Math.random() - 0.5) * 10; // ±5% change
    const newDensity = Math.max(
      0,
      Math.min(100, zone.currentDensity + densityChange)
    );

    // Update count based on density
    const newCount = Math.round((newDensity / 100) * zone.maxCapacity);

    // Simulate entry/exit rate fluctuations
    const entryRateChange = (Math.random() - 0.5) * 10;
    const exitRateChange = (Math.random() - 0.5) * 8;

    return {
      ...zone,
      currentDensity: Math.round(newDensity),
      currentCount: newCount,
      devoteeFlow: {
        ...zone.devoteeFlow,
        entryRate: Math.max(0, zone.devoteeFlow.entryRate + entryRateChange),
        exitRate: Math.max(0, zone.devoteeFlow.exitRate + exitRateChange),
      },
      weatherImpact: {
        ...zone.weatherImpact,
        temperature: zone.weatherImpact.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(
          30,
          Math.min(90, zone.weatherImpact.humidity + (Math.random() - 0.5) * 10)
        ),
      },
      timestamp: new Date().toISOString(),
    };
  });

  // Broadcast real-time updates via WebSocket if available
  if (typeof global.broadcastRealTimeUpdates === "function") {
    const summary = {
      totalPeople: crowdData.reduce((sum, zone) => sum + zone.currentCount, 0),
      avgDensity: Math.round(
        crowdData.reduce((sum, zone) => sum + zone.currentDensity, 0) /
          crowdData.length
      ),
      highRiskZones: crowdData.filter(
        (zone) => generateAIPrediction(zone).riskLevel === "High"
      ).length,
      activeAnomalies: crowdData.filter(
        (zone) => zone.surveillance.anomalyDetected
      ).length,
      lastUpdate: new Date().toISOString(),
    };

    global.broadcastRealTimeUpdates({
      zones: crowdData.map((zone) => ({
        ...zone,
        prediction: generateAIPrediction(zone),
      })),
      summary,
    });
  }
};

// Start real-time simulation (update every 30 seconds)
const realTimeInterval = setInterval(simulateRealTimeUpdates, 30000);

// Real-time updates endpoint
const getRealTimeUpdates = async (req, res) => {
  try {
    // Force update before sending
    simulateRealTimeUpdates();

    const updatedCrowdData = crowdData.map((zone) => ({
      ...zone,
      prediction: generateAIPrediction(zone),
      timestamp: new Date().toISOString(),
    }));

    const totalPeople = updatedCrowdData.reduce(
      (sum, zone) => sum + zone.currentCount,
      0
    );
    const avgDensity = Math.round(
      updatedCrowdData.reduce((sum, zone) => sum + zone.currentDensity, 0) /
        updatedCrowdData.length
    );
    const highRiskZones = updatedCrowdData.filter(
      (zone) => zone.prediction.riskLevel === "High"
    ).length;
    const activeAnomalies = updatedCrowdData.filter(
      (zone) => zone.surveillance.anomalyDetected
    ).length;

    res.json({
      success: true,
      data: {
        zones: updatedCrowdData,
        summary: {
          totalPeople,
          avgDensity,
          highRiskZones,
          activeAnomalies,
          totalZones: updatedCrowdData.length,
        },
        realTimeStatus: {
          lastUpdate: new Date().toISOString(),
          updateInterval: 30, // seconds
          isLive: true,
          nextUpdateIn: 30,
        },
      },
      message: "Real-time crowd data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving real-time updates",
      error: error.message,
    });
  }
};

// Function to get zone by ID
const getZoneById = async (req, res) => {
  try {
    const { zoneId } = req.params;
    const zone = crowdData.find((z) => z._id === zoneId);

    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "Zone not found",
      });
    }

    const updatedZone = {
      ...zone,
      prediction: generateAIPrediction(zone),
      timestamp: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: updatedZone,
      message: "Zone data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving zone data",
      error: error.message,
    });
  }
};

// Get all crowd data
exports.getAllCrowdData = async (req, res) => {
  try {
    const {
      location,
      zone,
      density,
      riskLevel,
      latest,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    // Build query filters
    if (location) query["location.name"] = { $regex: location, $options: "i" };
    if (zone) query["location.zone"] = zone;
    if (density) query["crowdData.density"] = density;
    if (riskLevel) query["alerts.riskLevel"] = riskLevel;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    let crowdData;
    let total;

    if (latest === "true") {
      // Get latest data for each location
      crowdData = await CrowdData.getLatestByLocations();
      total = crowdData.length;
    } else {
      crowdData = await CrowdData.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      total = await CrowdData.countDocuments(query);
    }

    res.status(200).json({
      success: true,
      count: crowdData.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: crowdData,
    });
  } catch (error) {
    console.error("Error fetching crowd data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching crowd data",
      error: error.message,
    });
  }
};

// Get single crowd data entry
exports.getCrowdData = async (req, res) => {
  try {
    const crowdData = await CrowdData.findById(req.params.id);

    if (!crowdData) {
      return res.status(404).json({
        success: false,
        message: "Crowd data not found",
      });
    }

    res.status(200).json({
      success: true,
      data: crowdData,
    });
  } catch (error) {
    console.error("Error fetching crowd data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching crowd data",
      error: error.message,
    });
  }
};

// Create new crowd data entry
exports.createCrowdData = async (req, res) => {
  try {
    const crowdData = await CrowdData.create(req.body);

    res.status(201).json({
      success: true,
      message: "Crowd data created successfully",
      data: crowdData,
    });
  } catch (error) {
    console.error("Error creating crowd data:", error);

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
      message: "Error creating crowd data",
      error: error.message,
    });
  }
};

// Update crowd data
exports.updateCrowdData = async (req, res) => {
  try {
    const crowdData = await CrowdData.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!crowdData) {
      return res.status(404).json({
        success: false,
        message: "Crowd data not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Crowd data updated successfully",
      data: crowdData,
    });
  } catch (error) {
    console.error("Error updating crowd data:", error);

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
      message: "Error updating crowd data",
      error: error.message,
    });
  }
};

// Delete crowd data
exports.deleteCrowdData = async (req, res) => {
  try {
    const crowdData = await CrowdData.findByIdAndDelete(req.params.id);

    if (!crowdData) {
      return res.status(404).json({
        success: false,
        message: "Crowd data not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Crowd data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting crowd data:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting crowd data",
      error: error.message,
    });
  }
};

// Get crowd statistics
exports.getCrowdStats = async (req, res) => {
  try {
    const { location, date } = req.query;

    // Overall statistics
    const overallStats = await CrowdData.aggregate([
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          avgOccupancy: { $avg: "$crowdData.currentCount" },
          maxOccupancy: { $max: "$crowdData.currentCount" },
          avgWaitTime: { $avg: "$crowdData.waitTime" },
          criticalAlerts: {
            $sum: { $cond: [{ $eq: ["$alerts.riskLevel", "critical"] }, 1, 0] },
          },
          highRiskAlerts: {
            $sum: { $cond: [{ $eq: ["$alerts.riskLevel", "high"] }, 1, 0] },
          },
        },
      },
    ]);

    // Zone-wise statistics
    const zoneStats = await CrowdData.aggregate([
      {
        $group: {
          _id: "$location.zone",
          count: { $sum: 1 },
          avgOccupancy: { $avg: "$crowdData.currentCount" },
          maxOccupancy: { $max: "$crowdData.currentCount" },
          avgCapacity: { $avg: "$crowdData.capacity" },
        },
      },
    ]);

    // Density distribution
    const densityStats = await CrowdData.aggregate([
      {
        $group: {
          _id: "$crowdData.density",
          count: { $sum: 1 },
        },
      },
    ]);

    let hourlyStats = null;
    if (location && date) {
      hourlyStats = await CrowdData.getHourlyStats(location, date);
    }

    res.status(200).json({
      success: true,
      data: {
        overall: overallStats[0] || {},
        byZone: zoneStats,
        byDensity: densityStats,
        hourly: hourlyStats,
      },
    });
  } catch (error) {
    console.error("Error fetching crowd statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching crowd statistics",
      error: error.message,
    });
  }
};

// Get overcapacity alerts
exports.getOvercapacityAlerts = async (req, res) => {
  try {
    const alerts = await CrowdData.getOvercapacityAlerts();

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
};

// Get latest data for dashboard
exports.getDashboardData = async (req, res) => {
  try {
    const latestData = await CrowdData.getLatestByLocations();

    // Calculate summary statistics
    const totalOccupancy = latestData.reduce(
      (sum, data) => sum + data.crowdData.currentCount,
      0
    );
    const totalCapacity = latestData.reduce(
      (sum, data) => sum + data.crowdData.capacity,
      0
    );
    const averageOccupancyRate =
      totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0;

    const criticalLocations = latestData.filter(
      (data) => data.alerts.riskLevel === "critical"
    );
    const highRiskLocations = latestData.filter(
      (data) => data.alerts.riskLevel === "high"
    );

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalOccupancy,
          totalCapacity,
          averageOccupancyRate: Math.round(averageOccupancyRate),
          criticalLocations: criticalLocations.length,
          highRiskLocations: highRiskLocations.length,
          totalLocations: latestData.length,
        },
        locations: latestData,
        alerts: {
          critical: criticalLocations,
          high: highRiskLocations,
        },
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
};

// Bulk update crowd data (for sensor data)
exports.bulkUpdateCrowdData = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        message: "Updates must be an array",
      });
    }

    const results = [];
    const errors = [];

    for (const updateData of updates) {
      try {
        const crowdData = await CrowdData.create(updateData);
        results.push(crowdData);
      } catch (error) {
        errors.push({
          data: updateData,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Processed ${results.length} updates`,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error bulk updating crowd data:", error);
    res.status(500).json({
      success: false,
      message: "Error bulk updating crowd data",
      error: error.message,
    });
  }
};
