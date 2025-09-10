# Ishtdev Dashboard - Complete Setup Guide

## 🚀 Quick Start

### 1. Install Required Dependencies

```bash
# Navigate to dashboard directory
cd c:\Users\n\Desktop\Ishtdev-\ishtdev-dashboard

# Install map dependencies
npm install leaflet react-leaflet
npm install @types/leaflet --save-dev

# If not already installed
npm install next react react-dom
```

### 2. Environment Configuration

Create a `.env.local` file in the dashboard root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# OpenRouteService API Key (Free at openrouteservice.org)
NEXT_PUBLIC_OPENROUTESERVICE_API_KEY=your_ors_api_key_here
```

**Get your free OpenRouteService API key:**

1. Go to https://openrouteservice.org/
2. Sign up for a free account
3. Create an API key
4. Add it to your `.env.local` file

### 3. Start the Backend

```bash
# Navigate to backend directory
cd c:\Users\n\Desktop\Ishtdev-\backend

# Install dependencies (if not done)
npm install

# Start the backend server
npm start
# Should run on http://localhost:5000
```

### 4. Start the Dashboard

```bash
# Navigate to dashboard directory
cd c:\Users\n\Desktop\Ishtdev-\ishtdev-dashboard

# Start the development server
npm run dev
# Should run on http://localhost:3000
```

## 🗺️ Map Features

### Interactive Map Component (`InteractiveMapView.tsx`)

- **OpenStreetMap Integration**: Free, open-source map tiles
- **Location Markers**: All geo-tagged places with popups
- **Crowd Heatmap**: Real-time crowd density visualization
- **Route Tracing**: Live route status with color coding
- **Directions**: Get directions using OpenRouteService
- **Controls**: Toggle heatmap and routes on/off

### Map Controls

- **Green Circles**: Low crowd density
- **Yellow Circles**: Medium crowd density
- **Orange Circles**: High crowd density
- **Red Circles**: Critical crowd density
- **Blue Dashed Line**: Directions/Route trace

## 📱 Dashboard Components Status

### ✅ Completed & Working

- **LocationsTab**: CRUD for geo-tagged places with map integration
- **CrowdTab**: Real-time crowd monitoring with emergency simulation
- **LostFoundTab**: Report and manage lost/found items
- **AlertsTab**: Create and manage alerts with severity levels
- **SettingsTab**: Manage application settings by category
- **TimingTab**: Track devotee entry/exit with overstay alerts
- **InteractiveMapView**: Full map with heatmap, markers, and routes

### 🔧 Backend Integrations

- **MongoDB**: Real-time data storage
- **OpenRouteService**: Free routing and directions
- **Location Services**: Geo-tagged place management
- **Crowd Analytics**: Real-time density monitoring
- **Alert System**: Emergency notifications

## 🔧 Troubleshooting

### Common Issues

**1. "Cannot find module 'leaflet'" Error**

```bash
npm install leaflet react-leaflet @types/leaflet
```

**2. "Bad Request" when creating locations**

- Check that latitude and longitude are valid numbers
- Ensure backend is running on port 5000
- Verify MongoDB connection in backend

**3. Map not loading**

- Check that `.env.local` exists and has correct API URL
- Verify Leaflet CSS is loading (should be automatic)

**4. Directions not working**

- Add your OpenRouteService API key to `.env.local`
- Check API key is valid at openrouteservice.org

**5. Crowd heatmap not showing**

- Ensure crowd data has valid coordinates
- Check that crowd API endpoint is working
- Toggle "Show Crowd Heatmap" in map controls

### Backend Debug

If getting 400 errors:

```bash
# Check backend logs
cd c:\Users\n\Desktop\Ishtdev-\backend
npm start

# Should show:
# Server running on port 5000
# MongoDB connected successfully
```

## 🎯 Usage Guide

### Creating Locations

1. Go to Locations tab
2. Fill in name, type, coordinates, and capacity
3. Click "Add Location"
4. Location will appear on map automatically

### Viewing Live Data

1. Go to Interactive Map
2. See real-time crowd heatmap (colored circles)
3. Click markers for location details
4. Use "Get Directions" for routing

### Managing Crowds

1. Use Crowd tab to upload crowd data
2. View real-time occupancy on map
3. Simulate emergencies for testing

### Tracking Routes

1. Routes show live status (green=open, red=closed)
2. Click route lines for details
3. Get directions between any two points

## 🚀 Next Steps

1. **Mobile App**: All API endpoints support mobile integration
2. **Real-time Updates**: Consider WebSocket for live data
3. **Advanced Analytics**: Add more crowd prediction features
4. **Custom Markers**: Create custom icons for different location types

All components are now fully integrated with your MongoDB backend and ready for production use!
