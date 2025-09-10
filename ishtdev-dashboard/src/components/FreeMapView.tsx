"use client";
import React, { useEffect, useState } from "react";
import { getLocations } from "@/api/locations";
import { getRealtimeCrowd } from "@/api/crowd";

interface Location {
  _id: string;
  name: string;
  type: string;
  coordinates?: { lat?: number; lng?: number };
  capacity?: number;
}

interface CrowdData {
  _id: string;
  name: string;
  currentOccupancy: number;
  capacity: number;
  crowdLevel: string;
  coordinates?: { lat?: number; lng?: number };
}

// Simple OpenStreetMap component without external dependencies
export default function FreeMapView() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [crowdData, setCrowdData] = useState<CrowdData[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // Removed unused selectedLocation state

  // Prayagraj coordinates
  const defaultCenter = { lat: 25.4358, lng: 81.8463 };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getLocations().catch(() => ({ data: [] })),
      getRealtimeCrowd().catch(() => ({ data: [] })),
    ])
      .then(([locRes, crowdRes]) => {
        setLocations(locRes.data || []);
        setCrowdData(crowdRes.data || []);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : String(err))
      )
      .finally(() => setLoading(false));
  }, []);

  const validLocations = locations.filter(
    (loc) =>
      loc.coordinates?.lat &&
      loc.coordinates?.lng &&
      typeof loc.coordinates.lat === "number" &&
      typeof loc.coordinates.lng === "number"
  );

  const validCrowdData = crowdData.filter(
    (crowd) =>
      crowd.coordinates?.lat &&
      crowd.coordinates?.lng &&
      typeof crowd.coordinates.lat === "number" &&
      typeof crowd.coordinates.lng === "number"
  );

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

  const openInOpenStreetMap = (lat: number, lng: number) => {
    window.open(
      `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=16#map=16/${lat}/${lng}`,
      "_blank"
    );
  };

  const getDirectionsOSM = (toLat: number, toLng: number) => {
    const fromLat = defaultCenter.lat;
    const fromLng = defaultCenter.lng;
    window.open(
      `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${fromLat}%2C${fromLng}%3B${toLat}%2C${toLng}`,
      "_blank"
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <span className="ml-4">Loading map data...</span>
      </div>
    );

  return (
    <div className="w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          Interactive Map - Free OpenStreetMap
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Embedded OpenStreetMap */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="h-96 w-full">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                defaultCenter.lng - 0.02
              }%2C${defaultCenter.lat - 0.02}%2C${defaultCenter.lng + 0.02}%2C${
                defaultCenter.lat + 0.02
              }&layer=mapnik&marker=${defaultCenter.lat}%2C${
                defaultCenter.lng
              }`}
              width="100%"
              height="100%"
              className="border-0"
              title="OpenStreetMap"
            />
          </div>
          <div className="p-4 bg-gray-50">
            <p className="text-sm text-gray-600">
              📍 Centered on Prayagraj (Allahabad) - Click &quot;View Larger Map&quot; in
              the iframe to interact
            </p>
          </div>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <h3 className="col-span-full text-xl font-semibold mb-4">
            📍 Locations ({validLocations.length})
          </h3>
          {validLocations.map((loc) => {
            const crowd = validCrowdData.find((c) => c._id === loc._id);
            return (
              <div key={loc._id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{loc.name}</h4>
                    <p className="text-gray-600 text-sm">{loc.type}</p>
                  </div>
                  {crowd && (
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium text-white crowd-indicator`}
                      data-level={crowd.crowdLevel}
                    >
                      {crowd.crowdLevel.toUpperCase()}
                    </div>
                  )}
                </div>

                {crowd && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Occupancy</span>
                      <span>
                        {crowd.currentOccupancy}/{crowd.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full crowd-indicator ${getProgressBarClass(
                          Math.min(
                            100,
                            (crowd.currentOccupancy / crowd.capacity) * 100
                          )
                        )}`}
                        data-level={crowd.crowdLevel}
                      />
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-600 mb-3">
                  <p>
                    📍 {loc.coordinates!.lat!.toFixed(4)},{" "}
                    {loc.coordinates!.lng!.toFixed(4)}
                  </p>
                  <p>👥 Capacity: {loc.capacity || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() =>
                      openInOpenStreetMap(
                        loc.coordinates!.lat!,
                        loc.coordinates!.lng!
                      )
                    }
                    className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                  >
                    📍 View on OpenStreetMap
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      getDirectionsOSM(
                        loc.coordinates!.lat!,
                        loc.coordinates!.lng!
                      )
                    }
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    🗺️ Get Directions (OSM)
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Crowd Heatmap Summary */}
        {validCrowdData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              🌡️ Live Crowd Heatmap
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["low", "medium", "high", "critical"].map((level) => {
                const count = validCrowdData.filter(
                  (c) => c.crowdLevel === level
                ).length;
                return (
                  <div
                    key={level}
                    className={`text-center p-3 rounded-lg crowd-bg`}
                    data-level={level}
                  >
                    <div
                      className={`w-6 h-6 rounded-full mx-auto mb-2 crowd-indicator`}
                      data-level={level}
                    />
                    <p className="font-medium capitalize">{level} Crowd</p>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-gray-600">locations</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">📖 Map Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2" />
              Low Crowd Density
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2" />
              Medium Crowd Density
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded-full mr-2" />
              High Crowd Density
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2" />
              Critical Crowd Density
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              🗺️ <strong>Free Services Used:</strong>
            </p>
            <p>• OpenStreetMap for mapping (100% free, open-source)</p>
            <p>
              • OpenRouteService for directions (free API with registration)
            </p>
            <p>• No Google Maps or paid services required</p>
          </div>
        </div>
      </div>
    </div>
  );
}
