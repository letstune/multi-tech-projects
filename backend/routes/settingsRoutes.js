const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");

// GET all settings
router.get("/", async (req, res) => {
  try {
    const settings = await Settings.find();
    res.status(200).json({
      success: true,
      data: settings,
      total: settings.length,
      message: "Settings retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching settings",
      error: error.message,
    });
  }
});

// POST new setting
router.post("/", async (req, res) => {
  try {
    const { key, value, category, description } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: key, value",
      });
    }
    const newSetting = await Settings.create({
      key,
      value,
      category,
      description,
    });
    res.status(201).json({
      success: true,
      data: newSetting,
      message: "Setting created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating setting",
      error: error.message,
    });
  }
});

// PUT update setting by key
router.put("/:key", async (req, res) => {
  try {
    const updatedSetting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSetting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedSetting,
      message: "Setting updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating setting",
      error: error.message,
    });
  }
});

// PUT bulk update settings
router.put("/bulk", async (req, res) => {
  try {
    const { settings } = req.body;
    if (!Array.isArray(settings)) {
      return res.status(400).json({
        success: false,
        message: "Settings must be an array",
      });
    }
    const results = [];
    for (const s of settings) {
      const updated = await Settings.findOneAndUpdate({ key: s.key }, s, {
        new: true,
        upsert: true,
        runValidators: true,
      });
      results.push(updated);
    }
    res.status(200).json({
      success: true,
      data: results,
      message: "Bulk settings updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error bulk updating settings",
      error: error.message,
    });
  }
});

// DELETE setting by key
router.delete("/:key", async (req, res) => {
  try {
    const deletedSetting = await Settings.findOneAndDelete({
      key: req.params.key,
    });
    if (!deletedSetting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }
    res.status(200).json({
      success: true,
      data: deletedSetting,
      message: "Setting deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting setting",
      error: error.message,
    });
  }
});

module.exports = router;
