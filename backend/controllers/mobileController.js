const Location = require("../models/Location");
const { getDirections: fetchDirections } = require("../utils/openRouteService");

// Get public locations for mobile users
exports.getPublicLocations = async (req, res) => {
  try {
    const locations = await Location.find({ status: "active" })
      .select("name type coordinates description amenities operatingHours")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    console.error("Error fetching public locations:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching locations",
      error: error.message,
    });
  }
};

// Get real-time crowd levels
exports.getCrowdLevels = async (req, res) => {
  try {
    const locations = await Location.find({ status: "active" })
      .select("name capacity currentOccupancy type coordinates")
      .sort({ name: 1 });

    const crowdData = locations.map((location) => ({
      _id: location._id,
      name: location.name,
      type: location.type,
      coordinates: location.coordinates,
      capacity: location.capacity,
      currentOccupancy: location.currentOccupancy,
      occupancyPercentage:
        location.capacity > 0
          ? Math.round((location.currentOccupancy / location.capacity) * 100)
          : 0,
      crowdLevel:
        location.capacity > 0
          ? location.currentOccupancy / location.capacity >= 0.8
            ? "high"
            : location.currentOccupancy / location.capacity >= 0.5
            ? "medium"
            : "low"
          : "unknown",
    }));

    res.status(200).json({
      success: true,
      count: crowdData.length,
      data: crowdData,
    });
  } catch (error) {
    console.error("Error fetching crowd levels:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching crowd levels",
      error: error.message,
    });
  }
};

// Submit lost and found item
exports.submitLostFoundItem = async (req, res) => {
  try {
    // For now, just return a success response
    // This would integrate with the LostFound model when implemented
    res.status(201).json({
      success: true,
      message: "Lost & Found item submitted successfully",
      data: {
        id: Date.now().toString(),
        ...req.body,
        status: "submitted",
        submittedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error submitting lost found item:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting lost & found item",
      error: error.message,
    });
  }
};

// Get public alerts
exports.getPublicAlerts = async (req, res) => {
  try {
    // Placeholder for alerts - would integrate with Alert model
    const alerts = [
      {
        id: "1",
        title: "Temple Timings",
        message: "Temple is open from 6:00 AM to 10:00 PM",
        type: "info",
        priority: "normal",
        createdAt: new Date(),
      },
    ];

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching alerts",
      error: error.message,
    });
  }
};

// Emergency SOS
exports.emergencySOS = async (req, res) => {
  try {
    const { location, message, contactNumber } = req.body;

    // In a real implementation, this would:
    // 1. Create an emergency alert
    // 2. Notify security/admin
    // 3. Log the incident

    console.log("EMERGENCY SOS RECEIVED:", {
      location,
      message,
      contactNumber,
      timestamp: new Date(),
      ip: req.ip,
    });

    res.status(201).json({
      success: true,
      message: "Emergency alert sent successfully. Help is on the way.",
      data: {
        alertId: Date.now().toString(),
        status: "sent",
        estimatedResponse: "5-10 minutes",
      },
    });
  } catch (error) {
    console.error("Error processing emergency SOS:", error);
    res.status(500).json({
      success: false,
      message: "Error processing emergency request",
      error: error.message,
    });
  }
};

// Get directions
exports.getDirections = async (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng } = req.query;
    if (!fromLat || !fromLng || !toLat || !toLng) {
      return res.status(400).json({
        success: false,
        message: "fromLat, fromLng, toLat, and toLng are required",
      });
    }
    const from = { lat: parseFloat(fromLat), lng: parseFloat(fromLng) };
    const to = { lat: parseFloat(toLat), lng: parseFloat(toLng) };
    const orsData = await fetchDirections({ from, to });
    res.status(200).json({
      success: true,
      message: "Directions retrieved successfully",
      data: orsData,
    });
  } catch (error) {
    console.error("Error getting directions:", error);
    res.status(500).json({
      success: false,
      message: "Error getting directions",
      error: error.message,
    });
  }
};

// Get nearby amenities
exports.getNearbyAmenities = async (req, res) => {
  try {
    const { latitude, longitude, radius = 500 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    // Find nearby locations within radius
    const nearbyLocations = await Location.find({
      status: "active",
      $and: [
        {
          "coordinates.latitude": {
            $gte: parseFloat(latitude) - radius / 111000,
            $lte: parseFloat(latitude) + radius / 111000,
          },
        },
        {
          "coordinates.longitude": {
            $gte: parseFloat(longitude) - radius / 111000,
            $lte: parseFloat(longitude) + radius / 111000,
          },
        },
      ],
    }).select("name type coordinates description amenities");

    res.status(200).json({
      success: true,
      count: nearbyLocations.length,
      data: nearbyLocations,
    });
  } catch (error) {
    console.error("Error fetching nearby amenities:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching nearby amenities",
      error: error.message,
    });
  }
};

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comments, category, contactInfo } = req.body;

    // Log feedback (in real implementation, save to database)
    console.log("FEEDBACK RECEIVED:", {
      rating,
      comments,
      category,
      contactInfo,
      timestamp: new Date(),
      ip: req.ip,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully. Thank you for your input!",
      data: {
        feedbackId: Date.now().toString(),
        status: "received",
        submittedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting feedback",
      error: error.message,
    });
  }
};

// Get event schedule
exports.getEventSchedule = async (req, res) => {
  try {
    // Placeholder events - in real implementation would come from database
    const events = [
      {
        id: "1",
        title: "Morning Aarti",
        description: "Daily morning prayers and aarti",
        startTime: "06:00",
        endTime: "07:00",
        location: "Main Temple",
        type: "daily",
        date: new Date().toISOString().split("T")[0],
      },
      {
        id: "2",
        title: "Evening Aarti",
        description: "Daily evening prayers and aarti",
        startTime: "19:00",
        endTime: "20:00",
        location: "Main Temple",
        type: "daily",
        date: new Date().toISOString().split("T")[0],
      },
    ];

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching event schedule:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching event schedule",
      error: error.message,
    });
  }
};

// Get real-time updates
exports.getRealTimeUpdates = async (req, res) => {
  try {
    const updates = [
      {
        id: "1",
        type: "crowd",
        title: "Current Status",
        message: "Temple crowd level is currently moderate",
        timestamp: new Date(),
        priority: "normal",
      },
      {
        id: "2",
        type: "service",
        title: "Prasadam Available",
        message: "Fresh prasadam is now available at the food court",
        timestamp: new Date(),
        priority: "normal",
      },
    ];

    res.status(200).json({
      success: true,
      count: updates.length,
      data: updates,
    });
  } catch (error) {
    console.error("Error fetching real-time updates:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching real-time updates",
      error: error.message,
    });
  }
};
