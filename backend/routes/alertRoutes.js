const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

// GET /api/alerts - Get all alerts
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 });
    const activeAlerts = alerts.filter(
      (alert) => alert.status === "Active"
    ).length;
    const criticalAlerts = alerts.filter(
      (alert) => alert.severity === "Critical"
    ).length;
    res.json({
      success: true,
      data: alerts,
      totalAlerts: alerts.length,
      activeAlerts,
      criticalAlerts,
      message: "Alerts retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving alerts",
      error: error.message,
    });
  }
});

// GET /api/alerts/:id - Get specific alert
router.get("/:id", async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }
    res.json({
      success: true,
      data: alert,
      message: "Alert retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving alert",
      error: error.message,
    });
  }
});

// POST /api/alerts - Create new alert
router.post("/", async (req, res) => {
  try {
    const { type, severity, message, location, coordinates } = req.body;
    if (
      !type ||
      !severity ||
      !message ||
      !location ||
      !coordinates ||
      coordinates.lat === undefined ||
      coordinates.lng === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: type, severity, message, location, coordinates",
      });
    }
    const newAlert = await Alert.create({
      type,
      severity,
      message,
      location,
      coordinates,
      status: req.body.status || "Active",
    });
    res.status(201).json({
      success: true,
      data: newAlert,
      message: "Alert created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating alert",
      error: error.message,
    });
  }
});

// PUT /api/alerts/:id - Update alert
router.put("/:id", async (req, res) => {
  try {
    const updatedAlert = await Alert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAlert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }
    res.json({
      success: true,
      data: updatedAlert,
      message: "Alert updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating alert",
      error: error.message,
    });
  }
});

// DELETE /api/alerts/:id - Delete alert
router.delete("/:id", async (req, res) => {
  try {
    const deletedAlert = await Alert.findByIdAndDelete(req.params.id);
    if (!deletedAlert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }
    res.json({
      success: true,
      data: deletedAlert,
      message: "Alert deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting alert",
      error: error.message,
    });
  }
});

// PATCH /api/alerts/:id/acknowledge - Acknowledge alert
router.patch("/:id/acknowledge", async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: "Acknowledged" },
      { new: true }
    );
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }
    res.json({
      success: true,
      data: alert,
      message: "Alert acknowledged successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error acknowledging alert",
      error: error.message,
    });
  }
});

// PATCH /api/alerts/:id/resolve - Resolve alert
router.patch("/:id/resolve", async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: "Resolved" },
      { new: true }
    );
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }
    res.json({
      success: true,
      data: alert,
      message: "Alert resolved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error resolving alert",
      error: error.message,
    });
  }
});

// PATCH /api/alerts/:id/escalate - Escalate alert
router.patch("/:id/escalate", async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { severity: "Critical" },
      { new: true }
    );
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }
    res.json({
      success: true,
      data: alert,
      message: "Alert escalated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error escalating alert",
      error: error.message,
    });
  }
});

// GET /api/alerts/stats/summary - Get alert statistics
router.get("/stats/summary", async (req, res) => {
  try {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const alerts = await Alert.find();
    const stats = {
      total: alerts.length,
      active: alerts.filter((a) => a.status === "Active").length,
      resolved: alerts.filter((a) => a.status === "Resolved").length,
      critical: alerts.filter((a) => a.severity === "Critical").length,
      last24Hours: alerts.filter((a) => new Date(a.timestamp) > last24Hours)
        .length,
      byType: alerts.reduce((acc, alert) => {
        acc[alert.type] = (acc[alert.type] || 0) + 1;
        return acc;
      }, {}),
      bySeverity: alerts.reduce((acc, alert) => {
        acc[alert.severity] = (acc[alert.severity] || 0) + 1;
        return acc;
      }, {}),
      avgResponseTime: "2.5 minutes", // Mock data
    };
    res.json({
      success: true,
      data: stats,
      message: "Alert statistics retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving alert statistics",
      error: error.message,
    });
  }
});

module.exports = router;
