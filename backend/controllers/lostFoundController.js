// Comprehensive Lost & Found controller with MongoDB integration
const express = require("express");
const router = express.Router();
const LostFound = require("../models/LostFound");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Get all lost and found items
const getLostFoundItems = async (req, res) => {
  try {
    const { type, status, category, search } = req.query;
    let filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { itemName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { reportedBy: { $regex: search, $options: "i" } },
      ];
    }

    const items = await LostFound.find(filter).sort({ dateReported: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new lost/found item
const addLostFoundItem = async (req, res) => {
  try {
    const item = new LostFound(req.body);
    const savedItem = await item.save();
    res.status(201).json({ success: true, data: savedItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update lost/found item
const updateLostFoundItem = async (req, res) => {
  try {
    const updatedItem = await LostFound.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete lost/found item
const deleteLostFoundItem = async (req, res) => {
  try {
    const deletedItem = await LostFound.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get lost and found statistics
const getLostFoundStats = async (req, res) => {
  try {
    const totalReports = await LostFound.countDocuments();
    const lostItems = await LostFound.countDocuments({ type: "lost" });
    const foundItems = await LostFound.countDocuments({ type: "found" });
    const resolved = await LostFound.countDocuments({ status: "claimed" });
    const pending = await LostFound.countDocuments({ status: "active" });

    // Category breakdown
    const categoryStats = await LostFound.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Recent activity (last 10 items)
    const recentActivity = await LostFound.find()
      .sort({ dateReported: -1 })
      .limit(10)
      .select("type itemName dateReported status");

    // Monthly trend
    const monthlyTrend = await LostFound.aggregate([
      {
        $match: {
          dateReported: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth() - 5,
              1
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateReported" },
            month: { $month: "$dateReported" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalReports,
        lostItems,
        foundItems,
        resolved,
        pending,
        categories: categoryStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        recentActivity: recentActivity.map((item) => ({
          type: item.type,
          item: item.itemName,
          time: item.dateReported,
          status: item.status,
        })),
        monthlyTrend,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Match lost and found items using AI-like logic
const matchLostFoundItems = async (req, res) => {
  try {
    const lostItems = await LostFound.find({
      type: "lost",
      status: "active",
    });
    const foundItems = await LostFound.find({
      type: "found",
      status: "active",
    });

    const matches = [];

    lostItems.forEach((lostItem) => {
      foundItems.forEach((foundItem) => {
        let matchScore = 0;

        // Check item name similarity
        if (
          lostItem.itemName
            .toLowerCase()
            .includes(foundItem.itemName.toLowerCase()) ||
          foundItem.itemName
            .toLowerCase()
            .includes(lostItem.itemName.toLowerCase())
        ) {
          matchScore += 40;
        }

        // Check category match
        if (lostItem.category === foundItem.category) {
          matchScore += 30;
        }

        // Check location proximity (simplified)
        if (lostItem.location === foundItem.location) {
          matchScore += 20;
        }

        // Check date proximity (within 7 days)
        const timeDiff = Math.abs(
          new Date(foundItem.dateReported) - new Date(lostItem.dateReported)
        );
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        if (daysDiff <= 7) {
          matchScore += 10;
        }

        if (matchScore >= 50) {
          matches.push({
            lostItem: {
              id: lostItem._id,
              name: lostItem.itemName,
              reportedBy: lostItem.reportedBy,
              contact: lostItem.contactNumber,
            },
            foundItem: {
              id: foundItem._id,
              name: foundItem.itemName,
              reportedBy: foundItem.reportedBy,
              contact: foundItem.contactNumber,
            },
            matchScore,
            confidence:
              matchScore >= 80 ? "High" : matchScore >= 60 ? "Medium" : "Low",
          });
        }
      });
    });

    res.json({
      success: true,
      data: matches.sort((a, b) => b.matchScore - a.matchScore),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/lost-found - Get all lost & found reports
router.get("/", (req, res) => {
  try {
    const { type, status, priority } = req.query;

    let filteredData = [...lostFoundData];

    if (type) {
      filteredData = filteredData.filter((item) =>
        item.type.toLowerCase().includes(type.toLowerCase())
      );
    }

    if (status) {
      filteredData = filteredData.filter((item) => item.status === status);
    }

    if (priority) {
      filteredData = filteredData.filter((item) => item.priority === priority);
    }

    const statistics = {
      total: lostFoundData.length,
      active: lostFoundData.filter((item) => item.status === "Active").length,
      resolved: lostFoundData.filter((item) => item.status === "Resolved")
        .length,
      highPriority: lostFoundData.filter((item) => item.priority === "High")
        .length,
      withAIMatches: lostFoundData.filter(
        (item) => item.aiAnalysis.potentialMatches.length > 0
      ).length,
    };

    res.json({
      success: true,
      data: filteredData.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ),
      statistics,
      message: "Lost & found data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving lost & found data",
      error: error.message,
    });
  }
});

// POST /api/lost-found/report - Submit new lost/found report
router.post("/report", (req, res) => {
  try {
    const reportData = req.body;

    // Generate new ID
    const newId = String(
      Math.max(...lostFoundData.map((item) => parseInt(item._id))) + 1
    );

    const newReport = {
      _id: newId,
      ...reportData,
      status: "Active",
      priority: reportData.category === "person" ? "High" : "Medium",
      assignedOfficer: "Auto-assigned by system",
      timeline: [
        {
          timestamp: new Date().toISOString(),
          action: "Case reported",
          details: `New ${reportData.type} report submitted`,
          officer: "System",
        },
      ],
      timestamp: new Date().toISOString(),
    };

    lostFoundData.push(newReport);

    res.status(201).json({
      success: true,
      data: newReport,
      message: `${reportData.type} report submitted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting report",
      error: error.message,
    });
  }
});

// PUT /api/lost-found/:id/status - Update report status
router.put("/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, officerName } = req.body;

    const reportIndex = lostFoundData.findIndex((item) => item._id === id);
    if (reportIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const oldStatus = lostFoundData[reportIndex].status;
    lostFoundData[reportIndex].status = status;

    lostFoundData[reportIndex].timeline.push({
      timestamp: new Date().toISOString(),
      action: "Status updated",
      details: `Status changed from ${oldStatus} to ${status}. ${notes || ""}`,
      officer: officerName || "System",
    });

    res.json({
      success: true,
      data: lostFoundData[reportIndex],
      message: "Report status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating report status",
      error: error.message,
    });
  }
});

// Export multer upload middleware
exports.uploadImages = upload.array("images", 5);

module.exports = {
  getLostFoundItems,
  addLostFoundItem,
  updateLostFoundItem,
  deleteLostFoundItem,
  getLostFoundStats,
  matchLostFoundItems,
};
