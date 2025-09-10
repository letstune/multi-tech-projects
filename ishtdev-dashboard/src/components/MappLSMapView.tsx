"use client";

import React, { useEffect, useRef, useState } from "react";

// Type definitions for Mappls API
interface MappLSWindow extends Window {
  mappls?: {
    Map: new (
      element: HTMLElement,
      options: Record<string, unknown>
    ) => MappLSMap;
    Marker: new (options: Record<string, unknown>) => MappLSMarker;
  };
  initializeMap?: () => void;
}

interface MappLSMap {
  addListener?: (event: string, callback: () => void) => void;
}

interface MappLSMarker {
  addListener: (event: string, callback: () => void) => void;
}

// Hardcoded locations for demonstration
const DEMO_LOCATIONS = [
  {
    id: "1",
    name: "Main Ghat",
    type: "Ghat",
    coordinates: { lat: 25.4358, lng: 81.8463 },
    capacity: 5000,
    currentCrowd: 3200,
    status: "crowded",
    description: "Primary bathing ghat with high visitor traffic",
  },
  {
    id: "2",
    name: "Security Office",
    type: "Security",
    coordinates: { lat: 25.4368, lng: 81.8473 },
    capacity: 50,
    currentCrowd: 12,
    status: "normal",
    description: "Main security control center",
  },
  {
    id: "3",
    name: "Food Court",
    type: "Food",
    coordinates: { lat: 25.4348, lng: 81.8453 },
    capacity: 800,
    currentCrowd: 450,
    status: "moderate",
    description: "Central food and refreshment area",
  },
  {
    id: "4",
    name: "Parking Area A",
    type: "Parking",
    coordinates: { lat: 25.4378, lng: 81.8483 },
    capacity: 200,
    currentCrowd: 180,
    status: "crowded",
    description: "Main vehicle parking zone",
  },
  {
    id: "5",
    name: "Medical Center",
    type: "Medical",
    coordinates: { lat: 25.4338, lng: 81.8443 },
    capacity: 100,
    currentCrowd: 25,
    status: "normal",
    description: "Emergency medical services",
  },
  {
    id: "6",
    name: "Lost & Found Center",
    type: "Service",
    coordinates: { lat: 25.4388, lng: 81.8493 },
    capacity: 30,
    currentCrowd: 8,
    status: "normal",
    description: "Lost and found items center",
  },
];

interface Location {
  id: string;
  name: string;
  type: string;
  coordinates: { lat: number; lng: number };
  capacity: number;
  currentCrowd: number;
  status: string;
  description: string;
}

export default function MappLSMapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if API key is available
    const apiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY;
    if (!apiKey || apiKey === "your_mappls_api_key_here") {
      setError(
        "Mappls API key not configured. Please add NEXT_PUBLIC_MAPPLS_API_KEY to your environment variables."
      );
      return;
    }

    // Load Mappls script
    const script = document.createElement("script");
    script.src = `https://apis.mappls.com/advancedmaps/api/v1.0/map_sdk?layer=vector&v=3.0&key=${apiKey}&callback=initializeMap`;
    script.async = true;

    // Initialize map callback
    (window as MappLSWindow).initializeMap = () => {
      try {
        const mappLSWindow = window as MappLSWindow;
        if (mapRef.current && mappLSWindow.mappls) {
          // Initialize Mappls map
          const map = new mappLSWindow.mappls.Map(mapRef.current, {
            center: [81.8463, 25.4358], // Varanasi coordinates [lng, lat]
            zoom: 15,
            search: false,
            traffic: true,
            geolocation: false,
            clickableIcons: false,
          });

          // Add markers for each location
          DEMO_LOCATIONS.forEach((location) => {
            const markerColor = getMarkerColor(location.status);
            const marker = new mappLSWindow.mappls!.Marker({
              map: map,
              position: [location.coordinates.lng, location.coordinates.lat],
              fitbounds: false,
              icon: {
                url: `data:image/svg+xml;base64,${btoa(`
                  <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25C30 6.716 23.284 0 15 0z" fill="${markerColor}"/>
                    <circle cx="15" cy="15" r="8" fill="white"/>
                    <text x="15" y="19" text-anchor="middle" font-size="12" fill="${markerColor}">${getLocationIcon(
                  location.type
                )}</text>
                  </svg>
                `)}`,
                size: [30, 40],
                anchor: [15, 40],
              },
            });

            // Add click event to marker
            marker.addListener("click", () => {
              setSelectedLocation(location);
            });
          });

          setMapLoaded(true);
        }
      } catch (err) {
        setError(
          "Failed to initialize map: " +
            (err instanceof Error ? err.message : String(err))
        );
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      delete (window as MappLSWindow).initializeMap;
    };
  }, []);

  const getMarkerColor = (status: string) => {
    switch (status) {
      case "normal":
        return "#10B981"; // green
      case "moderate":
        return "#F59E0B"; // yellow
      case "crowded":
        return "#EF4444"; // red
      default:
        return "#6B7280"; // gray
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "Ghat":
        return "🕉️";
      case "Security":
        return "🛡️";
      case "Food":
        return "🍽️";
      case "Parking":
        return "🚗";
      case "Medical":
        return "🏥";
      case "Service":
        return "ℹ️";
      default:
        return "📍";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600 bg-green-100";
      case "moderate":
        return "text-yellow-600 bg-yellow-100";
      case "crowded":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCrowdPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  return (
    <div className="bg-white text-black rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          🗺️ Live Location Map
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live Updates</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-black  ">
        {/* Map Container */}
        <div className="lg:col-span-2">
          <div className="relative">
            <div
              ref={mapRef}
              className="w-full h-96 rounded-lg border border-gray-300 min-h-[400px]"
            >
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Mappls Map...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Map Legend */}
            <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg">
              <h4 className="font-semibold text-sm mb-2">Status Legend</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Normal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Crowded</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Details Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Locations Overview
          </h3>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {DEMO_LOCATIONS.filter((l) => l.status === "normal").length}
              </div>
              <div className="text-xs text-green-600">Normal</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                {DEMO_LOCATIONS.filter((l) => l.status === "crowded").length}
              </div>
              <div className="text-xs text-red-600">Crowded</div>
            </div>
          </div>

          {/* Location List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {DEMO_LOCATIONS.map((location) => (
              <div
                key={location.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedLocation?.id === location.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedLocation(location)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{location.name}</span>
                  <span className="text-lg">
                    {getLocationIcon(location.type)}
                  </span>
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-full inline-block ${getStatusColor(
                    location.status
                  )}`}
                >
                  {location.status} (
                  {getCrowdPercentage(location.currentCrowd, location.capacity)}
                  %)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Location Details */}
      {selectedLocation && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-blue-900">
              {getLocationIcon(selectedLocation.type)} {selectedLocation.name}
            </h4>
            <button
              type="button"
              onClick={() => setSelectedLocation(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <div>
              <div className="text-sm text-blue-600">Type</div>
              <div className="font-medium">{selectedLocation.type}</div>
            </div>
            <div>
              <div className="text-sm text-blue-600">Capacity</div>
              <div className="font-medium">{selectedLocation.capacity}</div>
            </div>
            <div>
              <div className="text-sm text-blue-600">Current Crowd</div>
              <div className="font-medium">{selectedLocation.currentCrowd}</div>
            </div>
            <div>
              <div className="text-sm text-blue-600">Occupancy</div>
              <div className="font-medium">
                {getCrowdPercentage(
                  selectedLocation.currentCrowd,
                  selectedLocation.capacity
                )}
                %
              </div>
            </div>
          </div>

          <p className="text-sm text-blue-800">
            {selectedLocation.description}
          </p>

          <div className="mt-3 flex space-x-2">
            <button
              type="button"
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              View Details
            </button>
            <button
              type="button"
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Get Directions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
