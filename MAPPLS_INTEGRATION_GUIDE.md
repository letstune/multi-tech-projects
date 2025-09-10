# Mappls Integration Guide

This guide explains how to integrate Mappls (formerly MapmyIndia) mapping services into the Ishtdev dashboard.

## Overview

The dashboard includes two map components:
1. **DemoMapView** - A demo map with hardcoded locations (currently active)
2. **MappLSMapView** - Full Mappls integration (requires API key)

## Getting Started with Mappls

### 1. Create a Mappls Developer Account

1. Visit [https://developer.mappls.com/](https://developer.mappls.com/)
2. Sign up for a developer account
3. Verify your email and complete the registration

### 2. Get Your API Key

1. Log in to the Mappls Developer Console
2. Create a new project or select an existing one
3. Navigate to "API Keys" section
4. Generate a new API key for Maps SDK
5. Make sure to enable the following services:
   - Maps SDK
   - Geocoding API
   - Routing API (optional)
   - Places API (optional)

### 3. Configure Environment Variables

1. Open `ishtdev-dashboard/.env.local`
2. Replace the placeholder with your actual API key:
   ```
   NEXT_PUBLIC_MAPPLS_API_KEY=your_actual_mappls_api_key_here
   ```

### 4. Switch to Mappls Map

To use the full Mappls integration instead of the demo map:

1. Open `ishtdev-dashboard/src/components/Layout.tsx`
2. Replace the import:
   ```typescript
   // Change from:
   import DemoMapView from "./DemoMapView";
   
   // To:
   import MappLSMapView from "./MappLSMapView";
   ```
3. Update the component usage:
   ```typescript
   // Change from:
   <DemoMapView />
   
   // To:
   <MappLSMapView />
   ```

## Features

### Demo Map Features
- ✅ Interactive location markers
- ✅ Real-time status indicators
- ✅ Location details panel
- ✅ Crowd level visualization
- ✅ No API key required

### Mappls Map Features
- 🗺️ Real Mappls map tiles
- 📍 Custom markers with status colors
- 🚗 Traffic information
- 📱 Mobile-responsive design
- 🔄 Real-time updates
- 🎯 Click-to-select locations
- 📊 Detailed location information

## Hardcoded Locations

The system includes 6 demo locations around Varanasi:

1. **Main Ghat** (25.4358, 81.8463) - Primary bathing area
2. **Security Office** (25.4368, 81.8473) - Security control center
3. **Food Court** (25.4348, 81.8453) - Food and refreshments
4. **Parking Area A** (25.4378, 81.8483) - Vehicle parking
5. **Medical Center** (25.4338, 81.8443) - Emergency medical services
6. **Lost & Found Center** (25.4388, 81.8493) - Lost items center

Each location includes:
- Name and type
- GPS coordinates
- Capacity and current crowd count
- Status (normal/moderate/crowded)
- Description

## Customization

### Adding New Locations

To add new locations, edit the `DEMO_LOCATIONS` array in either:
- `DemoMapView.tsx` (for demo map)
- `MappLSMapView.tsx` (for Mappls map)

Example:
```typescript
{
  id: "7",
  name: "New Location",
  type: "Custom",
  coordinates: { lat: 25.4400, lng: 81.8500 },
  capacity: 1000,
  currentCrowd: 500,
  status: "moderate",
  description: "Description of the new location"
}
```

### Customizing Marker Icons

Update the `getLocationIcon()` function to add new location types:
```typescript
const getLocationIcon = (type: string) => {
  switch (type) {
    case "NewType": return "🆕";
    // ... existing cases
    default: return "📍";
  }
};
```

### Styling Status Colors

Modify the `getStatusColor()` function to change status appearance:
```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case "normal": return "text-green-600 bg-green-100";
    case "moderate": return "text-yellow-600 bg-yellow-100";
    case "crowded": return "text-red-600 bg-red-100";
    default: return "text-gray-600 bg-gray-100";
  }
};
```

## API Integration

The map components can be integrated with your backend API:

1. **Location Data**: Fetch from `/api/locations`
2. **Real-time Updates**: Use WebSocket connections
3. **Status Updates**: POST to `/api/locations/:id/status`

## Troubleshooting

### Common Issues

1. **Map not loading**
   - Check if API key is correctly set
   - Verify API key has Maps SDK enabled
   - Check browser console for errors

2. **Markers not appearing**
   - Verify location coordinates are valid
   - Check if locations array is properly formatted

3. **API key errors**
   - Ensure the key is active and not expired
   - Check if domain is whitelisted in Mappls console

### Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Production Deployment

Before deploying to production:

1. Update environment variables with production API key
2. Configure domain whitelist in Mappls console
3. Enable HTTPS (required for geolocation features)
4. Test all map features thoroughly

## Support

For Mappls-specific issues:
- [Mappls Documentation](https://developer.mappls.com/docs/)
- [Mappls Support](https://developer.mappls.com/support/)

For dashboard-specific issues:
- Check the main project README
- Review the codebase documentation
