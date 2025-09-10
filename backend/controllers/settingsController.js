const Settings = require("../models/Settings");

// Get all settings or by category
exports.getSettings = async (req, res) => {
  try {
    const { category, key, publicOnly } = req.query;
    let query = {};

    if (category) query.category = category;
    if (key) query.key = key;
    if (publicOnly === "true") query.isPublic = true;

    const settings = await Settings.find(query).sort({ category: 1, key: 1 });

    // Transform to key-value format if requested
    if (req.query.format === "keyvalue") {
      const keyValueSettings = {};
      settings.forEach((setting) => {
        if (!keyValueSettings[setting.category]) {
          keyValueSettings[setting.category] = {};
        }
        keyValueSettings[setting.category][setting.key] = setting.value;
      });

      return res.status(200).json({
        success: true,
        data: keyValueSettings,
      });
    }

    res.status(200).json({
      success: true,
      count: settings.length,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching settings",
      error: error.message,
    });
  }
};

// Get single setting
exports.getSetting = async (req, res) => {
  try {
    const { category, key } = req.params;
    const setting = await Settings.findOne({ category, key });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.error("Error fetching setting:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching setting",
      error: error.message,
    });
  }
};

// Create or update setting
exports.upsertSetting = async (req, res) => {
  try {
    const {
      category,
      key,
      value,
      description,
      dataType,
      isPublic,
      isEditable,
    } = req.body;

    if (!category || !key || value === undefined) {
      return res.status(400).json({
        success: false,
        message: "Category, key, and value are required",
      });
    }

    const setting = await Settings.setSetting(category, key, value, {
      description,
      dataType,
      isPublic,
      isEditable,
      updatedBy: req.user?.id || "admin",
    });

    res.status(200).json({
      success: true,
      message: "Setting saved successfully",
      data: setting,
    });
  } catch (error) {
    console.error("Error saving setting:", error);

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
      message: "Error saving setting",
      error: error.message,
    });
  }
};

// Update setting by ID
exports.updateSetting = async (req, res) => {
  try {
    const setting = await Settings.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user?.id || "admin" },
      { new: true, runValidators: true }
    );

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Setting updated successfully",
      data: setting,
    });
  } catch (error) {
    console.error("Error updating setting:", error);

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
      message: "Error updating setting",
      error: error.message,
    });
  }
};

// Delete setting
exports.deleteSetting = async (req, res) => {
  try {
    const setting = await Settings.findByIdAndDelete(req.params.id);

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Setting deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting setting:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting setting",
      error: error.message,
    });
  }
};

// Bulk update settings
exports.bulkUpdateSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    if (!Array.isArray(settings)) {
      return res.status(400).json({
        success: false,
        message: "Settings must be an array",
      });
    }

    const results = [];
    const errors = [];

    for (const settingData of settings) {
      try {
        const { category, key, value } = settingData;
        const setting = await Settings.setSetting(category, key, value, {
          ...settingData,
          updatedBy: req.user?.id || "admin",
        });
        results.push(setting);
      } catch (error) {
        errors.push({
          setting: settingData,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Updated ${results.length} settings`,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error bulk updating settings:", error);
    res.status(500).json({
      success: false,
      message: "Error bulk updating settings",
      error: error.message,
    });
  }
};
