const Alert = require("../models/Alert");

// Get all alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const {
      type,
      status,
      priority,
      category,
      active,
      location,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    // Build query filters
    if (type) query.type = type;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    // Active alerts filter
    if (active === "true") {
      query.status = "active";
      query.$or = [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }];
    }

    // Location-based filter
    if (location) {
      const [lat, lng, radius] = location.split(",").map(Number);
      if (lat && lng) {
        const radiusInKm = radius || 1;
        query["location.coordinates.latitude"] = {
          $gte: lat - radiusInKm / 111,
          $lte: lat + radiusInKm / 111,
        };
        query["location.coordinates.longitude"] = {
          $gte: lng - radiusInKm / 111,
          $lte: lng + radiusInKm / 111,
        };
      }
    }

    const alerts = await Alert.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Alert.countDocuments(query);

    res.status(200).json({
      success: true,
      count: alerts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
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

// Get single alert
exports.getAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    console.error("Error fetching alert:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching alert",
      error: error.message,
    });
  }
};

// Create new alert
exports.createAlert = async (req, res) => {
  try {
    const alertData = {
      ...req.body,
      metadata: {
        ...req.body.metadata,
        reportedBy: req.user?.id || req.body.metadata?.reportedBy || "admin",
        source: req.body.metadata?.source || "manual",
        ipAddress: req.ip,
      },
    };

    const alert = await Alert.create(alertData);

    res.status(201).json({
      success: true,
      message: "Alert created successfully",
      data: alert,
    });
  } catch (error) {
    console.error("Error creating alert:", error);

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
      message: "Error creating alert",
      error: error.message,
    });
  }
};

// Update alert
exports.updateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alert updated successfully",
      data: alert,
    });
  } catch (error) {
    console.error("Error updating alert:", error);

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
      message: "Error updating alert",
      error: error.message,
    });
  }
};

// Delete alert
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alert deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting alert:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting alert",
      error: error.message,
    });
  }
};

// Acknowledge alert
exports.acknowledgeAlert = async (req, res) => {
  try {
    const { userId, username } = req.body;
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    await alert.acknowledge(
      userId || req.user?.id || "admin",
      username || req.user?.username || "admin"
    );

    res.status(200).json({
      success: true,
      message: "Alert acknowledged successfully",
      data: alert,
    });
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    res.status(500).json({
      success: false,
      message: "Error acknowledging alert",
      error: error.message,
    });
  }
};

// Resolve alert
exports.resolveAlert = async (req, res) => {
  try {
    const { userId, username, resolution } = req.body;
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    await alert.resolve(
      userId || req.user?.id || "admin",
      username || req.user?.username || "admin",
      resolution
    );

    res.status(200).json({
      success: true,
      message: "Alert resolved successfully",
      data: alert,
    });
  } catch (error) {
    console.error("Error resolving alert:", error);
    res.status(500).json({
      success: false,
      message: "Error resolving alert",
      error: error.message,
    });
  }
};

// Escalate alert
exports.escalateAlert = async (req, res) => {
  try {
    const { department, userId, reason } = req.body;
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    await alert.escalate(department, userId || req.user?.id, reason);

    res.status(200).json({
      success: true,
      message: "Alert escalated successfully",
      data: alert,
    });
  } catch (error) {
    console.error("Error escalating alert:", error);
    res.status(500).json({
      success: false,
      message: "Error escalating alert",
      error: error.message,
    });
  }
};

// Get alert statistics
exports.getAlertStats = async (req, res) => {
  try {
    const stats = await Alert.aggregate([
      {
        $group: {
          _id: null,
          totalAlerts: { $sum: 1 },
          activeAlerts: {
            $sum: {
              $cond: [{ $eq: ["$status", "active"] }, 1, 0],
            },
          },
          resolvedAlerts: {
            $sum: {
              $cond: [{ $eq: ["$status", "resolved"] }, 1, 0],
            },
          },
          criticalAlerts: {
            $sum: {
              $cond: [{ $eq: ["$priority", "critical"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const typeStats = await Alert.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ["$status", "active"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const priorityStats = await Alert.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {},
        byType: typeStats,
        byPriority: priorityStats,
      },
    });
  } catch (error) {
    console.error("Error fetching alert stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching alert statistics",
      error: error.message,
    });
  }
};
