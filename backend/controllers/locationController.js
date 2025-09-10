// controllers/locationController.js
const Location = require("../models/Location");

// Get all locations
const getLocations = async (req, res) => {
  try {
    const { type, status, nearby } = req.query;
    let query = {};

    if (type) query.type = type;
    if (status) query.status = status;

    let locations;
    if (nearby) {
      const [lat, lng, distance] = nearby.split(",").map(Number);
      locations = await Location.findNearby(lat, lng, distance || 1000);
    } else {
      locations = await Location.find(query).sort({ createdAt: -1 });
    }

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
};

// Get single location
const getLocationById = async (req, res) => {
  try {
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
};

// Add new location
const addLocation = async (req, res) => {
  try {
    const locationData = req.body;

    // Validate required fields
    if (!locationData.name || !locationData.type || !locationData.coordinates) {
      return res.status(400).json({
        success: false,
        message: "Name, type, and coordinates are required",
      });
    }

    // Validate coordinates
    if (
      !locationData.coordinates.latitude ||
      !locationData.coordinates.longitude
    ) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const location = await Location.create(locationData);

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
};

// Update location
const updateLocation = async (req, res) => {
  try {
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
};

// Delete location
const deleteLocation = async (req, res) => {
  try {
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
};

// Update location occupancy
const updateOccupancy = async (req, res) => {
  try {
    const { currentOccupancy } = req.body;

    if (typeof currentOccupancy !== "number" || currentOccupancy < 0) {
      return res.status(400).json({
        success: false,
        message: "Current occupancy must be a non-negative number",
      });
    }

    const location = await Location.findByIdAndUpdate(
      req.params.id,
      { currentOccupancy },
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Occupancy updated successfully",
      data: location,
    });
  } catch (error) {
    console.error("Error updating occupancy:", error);
    res.status(500).json({
      success: false,
      message: "Error updating occupancy",
      error: error.message,
    });
  }
};

// Get location statistics
const getLocationStats = async (req, res) => {
  try {
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
};

module.exports = {
  getLocations,
  addLocation,
  updateLocation,
  deleteLocation,
  getLocationById,
  updateOccupancy,
  getLocationStats,
};
