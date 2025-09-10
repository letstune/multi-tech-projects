// routes/lostFoundRoutes.js
const express = require("express");
const router = express.Router();
const LostFound = require("../models/LostFound");
const { matchLostFound } = require("../utils/aiLostFoundMatcher");

// @desc    Get all lost and found items
// @route   GET /api/lostfound
// @access  Public
router.get("/", async (req, res) => {
  try {
    const items = await LostFound.find().sort({ reportedAt: -1 });
    res.status(200).json({
      success: true,
      data: items,
      total: items.length,
      message: "Lost & Found items retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching lost & found items",
      error: error.message,
    });
  }
});

// @desc    Create a lost or found item
// @route   POST /api/lostfound
// @access  Public
router.post("/", async (req, res) => {
  try {
    const {
      type,
      item,
      description,
      location,
      coordinates,
      reporter,
      imageUrl,
    } = req.body;
    if (
      !type ||
      !item ||
      !location ||
      coordinates.lat === undefined ||
      coordinates.lng === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: type, item, location, coordinates",
      });
    }
    const newItem = await LostFound.create({
      type,
      item,
      description,
      location,
      coordinates,
      reporter,
      imageUrl,
      status: "open",
    });
    res.status(201).json({
      success: true,
      data: newItem,
      message: "Lost & Found item created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating lost & found item",
      error: error.message,
    });
  }
});

// @desc    Get stats for lost and found items
// @route   GET /api/lostfound/stats
// @access  Public
router.get("/stats", async (req, res) => {
  try {
    const totalItems = await LostFound.countDocuments();
    const lostItems = await LostFound.countDocuments({ type: "lost" });
    const foundItems = await LostFound.countDocuments({ type: "found" });
    const claimedItems = await LostFound.countDocuments({ status: "claimed" });
    res.status(200).json({
      success: true,
      data: {
        totalItems,
        lostItems,
        foundItems,
        claimedItems,
      },
      message: "Lost & Found stats retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching stats",
      error: error.message,
    });
  }
});

// @desc    Get a single lost and found item
// @route   GET /api/lostfound/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Lost & Found item not found",
      });
    }
    res.status(200).json({
      success: true,
      data: item,
      message: "Lost & Found item retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching item",
      error: error.message,
    });
  }
});

// @desc    Update a lost and found item
// @route   PUT /api/lostfound/:id
// @access  Public
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await LostFound.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Lost & Found item not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedItem,
      message: "Lost & Found item updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating item",
      error: error.message,
    });
  }
});

// @desc    Delete a lost and found item
// @route   DELETE /api/lostfound/:id
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await LostFound.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Lost & Found item not found",
      });
    }
    res.status(200).json({
      success: true,
      data: deletedItem,
      message: "Lost & Found item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting item",
      error: error.message,
    });
  }
});

// @desc    Claim a lost and found item
// @route   PATCH /api/lostfound/:id/claim
// @access  Public
router.patch("/:id/claim", async (req, res) => {
  try {
    const claimedBy = req.body.claimedBy || "admin";
    const item = await LostFound.findByIdAndUpdate(
      req.params.id,
      { status: "claimed", claimedBy, claimedAt: new Date() },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Lost & Found item not found",
      });
    }
    res.status(200).json({
      success: true,
      data: item,
      message: "Lost & Found item claimed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error claiming item",
      error: error.message,
    });
  }
});

// @desc    Report a lost or found item (mobile)
// @route   POST /api/lost-found/report
// @access  Public
router.post("/report", async (req, res) => {
  try {
    const {
      type,
      item,
      description,
      location,
      coordinates,
      reporter,
      imageUrl,
    } = req.body;
    if (
      !type ||
      !item ||
      !location ||
      !coordinates ||
      coordinates.lat === undefined ||
      coordinates.lng === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: type, item, location, coordinates",
      });
    }
    const newItem = await LostFound.create({
      type,
      item,
      description,
      location,
      coordinates,
      reporter,
      imageUrl,
      status: "open",
    });
    res.status(201).json({
      success: true,
      data: newItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating lost & found item",
      error: error.message,
    });
  }
});

// @desc    Match a lost or found item using AI (mobile)
// @route   GET /api/lost-found/match
// @access  Public
router.get("/match", async (req, res) => {
  try {
    const { imageUrl } = req.query;
    if (!imageUrl)
      return res
        .status(400)
        .json({ success: false, message: "imageUrl required" });
    const matches = await matchLostFound({ imageUrl });
    res.status(200).json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error matching lost & found",
      error: error.message,
    });
  }
});

// @desc    Get report history of lost and found items (mobile)
// @route   GET /api/lost-found/history
// @access  Public
router.get("/history", async (req, res) => {
  try {
    const { reporter } = req.query;
    if (!reporter)
      return res
        .status(400)
        .json({ success: false, message: "reporter required" });
    const history = await LostFound.find({ reporter }).sort({ reportedAt: -1 });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching history",
      error: error.message,
    });
  }
});

// @desc    Resolve a lost and found item (admin)
// @route   PATCH /api/lost-found/:id/resolve
// @access  Public
router.patch("/:id/resolve", async (req, res) => {
  try {
    const item = await LostFound.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    );
    if (!item)
      return res.status(404).json({
        success: false,
        message: "Lost & Found item not found",
      });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error resolving item",
      error: error.message,
    });
  }
});

module.exports = router;
