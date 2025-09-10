"use client";

import React, { useState } from "react";

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

export default function DemoMapView() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

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
        return "text-green-600 bg-green-100 border-green-200";
      case "moderate":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "crowded":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getCrowdPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const getProgressBarClass = (percentage: number): string => {
    const rounded = Math.round(percentage / 5) * 5; // Round to nearest 5
    if (rounded <= 10) return "progress-bar-10";
    if (rounded <= 20) return "progress-bar-20";
    if (rounded <= 25) return "progress-bar-25";
    if (rounded <= 30) return "progress-bar-30";
    if (rounded <= 40) return "progress-bar-40";
    if (rounded <= 50) return "progress-bar-50";
    if (rounded <= 60) return "progress-bar-60";
    if (rounded <= 70) return "progress-bar-70";
    if (rounded <= 75) return "progress-bar-75";
    if (rounded <= 80) return "progress-bar-80";
    if (rounded <= 85) return "progress-bar-85";
    if (rounded <= 90) return "progress-bar-90";
    if (rounded <= 95) return "progress-bar-95";
    return "progress-bar-100";
  };

  const getMarkerPosition = (location: Location) => {
    // Convert lat/lng to relative positions on the demo map
    const baseX = 50; // Center X
    const baseY = 50; // Center Y
    const offsetX = (location.coordinates.lng - 81.8463) * 5000; // Scale factor
    const offsetY = (location.coordinates.lat - 25.4358) * 5000; // Scale factor

    return {
      x: Math.max(5, Math.min(95, baseX + offsetX)),
      y: Math.max(5, Math.min(95, baseY - offsetY)), // Invert Y for map coordinates
    };
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demo Map Container */}
        <div className="lg:col-span-2">
          <div className="relative">
            <div className="w-full h-96 rounded-lg border border-gray-300 bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
              {/* Demo Map Background */}
              <div className="absolute inset-0 opacity-20">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                >
                  {/* River representation */}
                  <path
                    d="M10,30 Q30,25 50,30 T90,35"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.6"
                  />
                  <path
                    d="M10,35 Q30,30 50,35 T90,40"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.4"
                  />

                  {/* Roads */}
                  <line
                    x1="0"
                    y1="50"
                    x2="100"
                    y2="50"
                    stroke="#6B7280"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  <line
                    x1="50"
                    y1="0"
                    x2="50"
                    y2="100"
                    stroke="#6B7280"
                    strokeWidth="1"
                    opacity="0.3"
                  />

                  {/* Buildings/Areas */}
                  <rect
                    x="20"
                    y="60"
                    width="15"
                    height="10"
                    fill="#E5E7EB"
                    opacity="0.5"
                  />
                  <rect
                    x="65"
                    y="15"
                    width="20"
                    height="15"
                    fill="#E5E7EB"
                    opacity="0.5"
                  />
                </svg>
              </div>

              {/* Location Markers */}
              {DEMO_LOCATIONS.map((location) => {
                const position = getMarkerPosition(location);
                const isSelected = selectedLocation?.id === location.id;

                return (
                  <div
                    key={location.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 dynamic-position ${
                      isSelected ? "scale-125 z-20" : "hover:scale-110 z-10"
                    }`}
                    style={
                      {
                        "--pos-x": `${position.x}%`,
                        "--pos-y": `${position.y}%`,
                      } as React.CSSProperties
                    }
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div
                      className={`relative ${
                        isSelected ? "animate-bounce" : ""
                      }`}
                    >
                      {/* Marker Pin */}
                      <div
                        className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-sm ${
                          location.status === "normal"
                            ? "bg-green-500"
                            : location.status === "moderate"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {getLocationIcon(location.type)}
                      </div>

                      {/* Location Label */}
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap">
                        {location.name}
                      </div>

                      {/* Status Indicator */}
                      <div
                        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${
                          location.status === "normal"
                            ? "bg-green-400"
                            : location.status === "moderate"
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }`}
                      ></div>
                    </div>
                  </div>
                );
              })}

              {/* Demo Map Title */}
              <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow">
                <h3 className="font-semibold text-sm text-gray-800">
                  Kumbh Mela Area
                </h3>
                <p className="text-xs text-gray-600">Varanasi, Uttar Pradesh</p>
              </div>
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

            {/* Demo Notice */}
            <div className="absolute bottom-4 left-4 bg-blue-100 border border-blue-200 px-3 py-2 rounded-lg">
              <p className="text-xs text-blue-800">
                📍 Demo Map - Click markers to view details
              </p>
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
                  className={`text-xs px-2 py-1 rounded-full inline-block border ${getStatusColor(
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

          <p className="text-sm text-blue-800 mb-3">
            {selectedLocation.description}
          </p>

          {/* Crowd Level Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-sm text-blue-600 mb-1">
              <span>Crowd Level</span>
              <span>
                {getCrowdPercentage(
                  selectedLocation.currentCrowd,
                  selectedLocation.capacity
                )}
                %
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  selectedLocation.status === "normal"
                    ? "bg-green-500"
                    : selectedLocation.status === "moderate"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                } ${getProgressBarClass(
                  getCrowdPercentage(
                    selectedLocation.currentCrowd,
                    selectedLocation.capacity
                  )
                )}`}
              ></div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>
            <button
              type="button"
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
            >
              Get Directions
            </button>
            <button
              type="button"
              className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
            >
              Send Alert
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
