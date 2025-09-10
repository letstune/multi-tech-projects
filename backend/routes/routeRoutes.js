const express = require("express");
const router = express.Router();
const RouteStatus = require("../models/RouteStatus");
const { getDirections } = require("../utils/openRouteService");

// GET all routes with live status
router.get("/", async (req, res) => {
  try {
    const routes = await RouteStatus.find().sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: routes });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching routes",
        error: error.message,
      });
  }
});

// POST/PUT route status (admin)
router.post("/", async (req, res) => {
  try {
    const { name, from, to, status, liveMessage, coordinates } = req.body;
    let route = await RouteStatus.findOneAndUpdate(
      { name, from, to },
      { status, liveMessage, coordinates, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res
      .status(200)
      .json({ success: true, data: route, message: "Route status updated" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating route",
        error: error.message,
      });
  }
});

// GET route details
router.get("/:id", async (req, res) => {
  try {
    const route = await RouteStatus.findById(req.params.id);
    if (!route)
      return res
        .status(404)
        .json({ success: false, message: "Route not found" });
    res.status(200).json({ success: true, data: route });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching route",
        error: error.message,
      });
  }
});

// GET directions (OpenRouteService)
router.get("/track", async (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng } = req.query;
    if (!fromLat || !fromLng || !toLat || !toLng) {
      return res
        .status(400)
        .json({
          success: false,
          message: "fromLat, fromLng, toLat, toLng required",
        });
    }
    const from = { lat: parseFloat(fromLat), lng: parseFloat(fromLng) };
    const to = { lat: parseFloat(toLat), lng: parseFloat(toLng) };
    const orsData = await getDirections({ from, to });
    res.status(200).json({ success: true, data: orsData });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error getting directions",
        error: error.message,
      });
  }
});

module.exports = router;
