const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const Location = require("./models/Location");
const RouteStatus = require("./models/RouteStatus");
const CrowdData = require("./models/CrowdData");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected for seeding");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Sample data
const locations = [
  {
    name: "Main Temple",
    type: "temple",
    coordinates: { latitude: 28.6139, longitude: 77.209 },
    description: "Main worship area with beautiful architecture",
    capacity: 500,
    currentOccupancy: 250,
    status: "active",
    amenities: ["Prasadam", "Water", "Seating", "Audio System"],
    operatingHours: { open: "05:00", close: "22:00" },
    isEmergencyPoint: true,
  },
  {
    name: "Parking Area A",
    type: "parking",
    coordinates: { latitude: 28.614, longitude: 77.2095 },
    description: "Main parking facility for devotees",
    capacity: 100,
    currentOccupancy: 75,
    status: "active",
    amenities: ["Security", "CCTV", "Lighting"],
    operatingHours: { open: "04:00", close: "23:00" },
  },
  {
    name: "Food Court",
    type: "food",
    coordinates: { latitude: 28.6135, longitude: 77.2085 },
    description: "Dining and refreshment area",
    capacity: 200,
    currentOccupancy: 50,
    status: "active",
    amenities: ["Vegetarian Food", "Water", "Seating", "Washroom"],
    operatingHours: { open: "06:00", close: "21:00" },
  },
  {
    name: "Security Office",
    type: "security",
    coordinates: { latitude: 28.6142, longitude: 77.2088 },
    description: "Main security and control room",
    capacity: 20,
    currentOccupancy: 5,
    status: "active",
    amenities: ["CCTV Monitoring", "Communication", "First Aid"],
    operatingHours: { open: "00:00", close: "23:59" },
    isEmergencyPoint: true,
  },
  {
    name: "Rest Area",
    type: "facility",
    coordinates: { latitude: 28.6138, longitude: 77.2092 },
    description: "Comfortable seating area for elderly and families",
    capacity: 150,
    currentOccupancy: 30,
    status: "active",
    amenities: ["Seating", "Shade", "Water", "Clean Restrooms"],
    operatingHours: { open: "05:00", close: "22:00" },
  },
];

// Sample route data
const routes = [
  {
    name: "Main Temple to Parking A",
    from: "Main Temple",
    to: "Parking Area A",
    status: "open",
    liveMessage: "Clear route, normal traffic flow",
    coordinates: [
      { lat: 28.6139, lng: 77.209 },
      { lat: 28.614, lng: 77.2095 }
    ]
  },
  {
    name: "Parking A to Food Court",
    from: "Parking Area A",
    to: "Food Court",
    status: "congested",
    liveMessage: "Heavy traffic, expect 5-10 min delay",
    coordinates: [
      { lat: 28.614, lng: 77.2095 },
      { lat: 28.6135, lng: 77.2085 }
    ]
  },
  {
    name: "Food Court to Security Office",
    from: "Food Court",
    to: "Security Office",
    status: "open",
    liveMessage: "Normal flow",
    coordinates: [
      { lat: 28.6135, lng: 77.2085 },
      { lat: 28.6145, lng: 77.208 }
    ]
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    // Clear existing data
    await Location.deleteMany({});
    await RouteStatus.deleteMany({});
    await CrowdData.deleteMany({});
    console.log("Cleared existing data");

    // Insert sample locations
    const insertedLocations = await Location.insertMany(locations);
    console.log("✅ Locations seeded successfully");

    // Insert sample routes
    const insertedRoutes = await RouteStatus.insertMany(routes);
    console.log("✅ Routes seeded successfully");

    // Insert sample crowd data for each location
    const crowdData = insertedLocations.map(location => ({
      locationId: location._id,
      currentOccupancy: location.currentOccupancy,
      crowdLevel: location.currentOccupancy > (location.capacity * 0.8) ? 'high' :
                  location.currentOccupancy > (location.capacity * 0.5) ? 'medium' : 'low',
      timestamp: new Date()
    }));

    const insertedCrowdData = await CrowdData.insertMany(crowdData);
    console.log("✅ Crowd data seeded successfully");

    // Display statistics
    const locationCount = await Location.countDocuments();
    const routeCount = await RouteStatus.countDocuments();
    const crowdCount = await CrowdData.countDocuments();

    console.log(`\n📊 Database Statistics:`);
    console.log(`   Locations: ${locationCount}`);
    console.log(`   Routes: ${routeCount}`);
    console.log(`   Crowd Data: ${crowdCount}`);

    // Display inserted locations
    console.log("\n📍 Inserted Locations:");
    insertedLocations.forEach((location, index) => {
      console.log(`${index + 1}. ${location.name} (${location.type})`);
    });

    // Display inserted routes
    console.log("\n🛣️  Inserted Routes:");
    insertedRoutes.forEach((route, index) => {
      console.log(`${index + 1}. ${route.name} - Status: ${route.status}`);
    });

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
};

// Run seeding
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
  await mongoose.connection.close();
  console.log("\n🔐 Database connection closed");
  console.log("🎉 Seeding completed successfully!");
  process.exit(0);
};

// Execute if called directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedDatabase, connectDB };
