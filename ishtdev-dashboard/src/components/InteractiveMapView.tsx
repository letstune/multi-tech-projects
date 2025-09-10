"use client";
import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { getLocations } from "@/api/locations";
import { getRoutes, getDirections } from "@/api/routes";
import { getRealtimeCrowd } from "@/api/crowd";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

interface Location {
  _id: string;
  name: string;
  type: string;
  coordinates?: { lat?: number; lng?: number };
  capacity?: number;
}

interface Route {
  _id: string;
  name: string;
  from: string;
  to: string;
  status: string;
  liveMessage?: string;
  coordinates?: { lat: number; lng: number }[];
}

interface CrowdData {
  _id: string;
  name: string;
  currentOccupancy: number;
  capacity: number;
  crowdLevel: string;
  coordinates?: { lat?: number; lng?: number };
}

export default function InteractiveMapView() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [crowdData, setCrowdData] = useState<CrowdData[]>([]);
  const [error, setError] = useState("");
  const [directions, setDirections] = useState<[number, number][] | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Default center (Prayagraj coordinates)
  const defaultCenter: [number, number] = [25.4358, 81.8463];

  // Function to fetch all data
  const fetchAllData = async (showLoadingState = true) => {
    if (showLoadingState) setLoading(true);

    try {
      const [locRes, routeRes, crowdRes] = await Promise.all([
        getLocations().catch(() => ({ data: [] })),
        getRoutes().catch(() => ({ data: [] })),
        getRealtimeCrowd().catch(() => ({ data: [] })),
      ]);

      setLocations(locRes.data || []);
      setRoutes(routeRes.data || []);
      setCrowdData(crowdRes.data || []);
      setLastUpdated(new Date());
      setError(""); // Clear any previous errors

      console.log("Data refreshed:", {
        locations: locRes.data?.length || 0,
        routes: routeRes.data?.length || 0,
        crowd: crowdRes.data?.length || 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      console.error("Error fetching data:", err);
    } finally {
      if (showLoadingState) setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllData(true);
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAllData(false); // Don't show loading state for auto-refresh
      }, 30000); // Refresh every 30 seconds

      setRefreshInterval(interval);
      console.log("Auto-refresh enabled: every 30 seconds");

      return () => {
        clearInterval(interval);
        setRefreshInterval(null);
      };
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
        console.log("Auto-refresh disabled");
      }
    }
  }, [autoRefresh, refreshInterval]);

  useEffect(() => {
    // Load Leaflet CSS
    if (typeof window !== "undefined") {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      // Fix for default markers
      const script = document.createElement("script");
      script.innerHTML = `
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      `;
      document.head.appendChild(script);
      setMapLoaded(true);
    }
  }, []);

  const handleGetDirections = async (to: Location) => {
    if (!to.coordinates?.lat || !to.coordinates?.lng) {
      setError("Invalid destination coordinates");
      return;
    }
    try {
      const res = await getDirections(
        defaultCenter[0],
        defaultCenter[1],
        to.coordinates.lat,
        to.coordinates.lng
      );
      if (res.data.routes && res.data.routes.length > 0) {
        const coords = res.data.routes[0].geometry.coordinates.map(
          (coord: number[]) => [coord[1], coord[0]] as [number, number]
        );
        setDirections(coords);
      }
    } catch (err) {
      console.error("Directions error:", err);
      setError("Could not get directions");
    }
  };

  const getCrowdColor = (crowdLevel: string) => {
    switch (crowdLevel) {
      case "low":
        return "#22c55e"; // green
      case "medium":
        return "#eab308"; // yellow
      case "high":
        return "#f97316"; // orange
      case "critical":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  const getCrowdRadius = (currentOccupancy: number, capacity: number) => {
    const percentage = (currentOccupancy / capacity) * 100;
    return Math.max(50, Math.min(200, percentage * 2));
  };

  const getRouteColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "#10b981"; // Green
      case "congested":
        return "#f59e0b"; // Yellow/Orange
      case "closed":
        return "#ef4444"; // Red
      case "blocked":
        return "#dc2626"; // Dark Red
      case "maintenance":
        return "#8b5cf6"; // Purple
      default:
        return "#6b7280"; // Gray
    }
  };

  const getRouteWeight = (status: string) => {
    switch (status?.toLowerCase()) {
      case "closed":
      case "blocked":
        return 6; // Thicker for closed routes
      case "congested":
        return 5; // Medium thick for congested
      case "open":
        return 4; // Normal for open routes
      default:
        return 3; // Thin for unknown status
    }
  };

  const getRouteOpacity = (status: string) => {
    switch (status?.toLowerCase()) {
      case "closed":
      case "blocked":
        return 0.9; // More opaque for closed routes
      case "congested":
        return 0.8; // Medium opacity for congested
      case "open":
        return 0.7; // Normal for open routes
      default:
        return 0.5; // Less opaque for unknown status
    }
  };

  const validLocations = useMemo(() => {
    return locations.filter(
      (loc) =>
        loc.coordinates?.lat &&
        loc.coordinates?.lng &&
        typeof loc.coordinates.lat === "number" &&
        typeof loc.coordinates.lng === "number"
    );
  }, [locations]);

  const validCrowdData = useMemo(() => {
    return crowdData.filter(
      (crowd) =>
        crowd.coordinates?.lat &&
        crowd.coordinates?.lng &&
        typeof crowd.coordinates.lat === "number" &&
        typeof crowd.coordinates.lng === "number"
    );
  }, [crowdData]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <span className="ml-4">Loading map data...</span>
      </div>
    );

  return (
    <div className="w-full h-screen bg-gray-50">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-lg max-w-xs">
        <h3 className="font-semibold mb-2">Map Controls</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
              className="mr-2"
            />
            Show Crowd Heatmap
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showRoutes}
              onChange={(e) => setShowRoutes(e.target.checked)}
              className="mr-2"
            />
            Show Routes
          </label>
          <hr className="my-2" />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="mr-2"
            />
            Auto-refresh (30s)
          </label>
          <button
            type="button"
            onClick={() => fetchAllData(false)}
            className="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
          >
            🔄 Refresh Now
          </button>
          {lastUpdated && (
            <p className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg">
        <h3 className="font-semibold mb-2">Legend</h3>
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            Low Crowd
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            Medium Crowd
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
            High Crowd
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            Critical Crowd
          </div>
        </div>
      </div>

      {error && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Map Container */}
      <div className="h-full w-full">
        {mapLoaded && typeof window !== "undefined" ? (
          <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Location Markers */}
            {validLocations.map((loc) => (
              <Marker
                key={loc._id}
                position={[loc.coordinates!.lat!, loc.coordinates!.lng!]}
                eventHandlers={{
                  click: () => setSelectedLocation(loc),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{loc.name}</h3>
                    <p className="text-gray-600">Type: {loc.type}</p>
                    <p className="text-gray-600">
                      Capacity: {loc.capacity || "N/A"}
                    </p>
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => handleGetDirections(loc)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Get Directions
                      </button>
                      <button
                        onClick={() =>
                          window.open(
                            `https://maps.google.com/?q=${
                              loc.coordinates!.lat
                            },${loc.coordinates!.lng}`,
                            "_blank"
                          )
                        }
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Open in Google Maps
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Crowd Heatmap Circles */}
            {showHeatmap &&
              validCrowdData.map((crowd) => (
                <Circle
                  key={crowd._id}
                  center={[crowd.coordinates!.lat!, crowd.coordinates!.lng!]}
                  radius={getCrowdRadius(
                    crowd.currentOccupancy,
                    crowd.capacity
                  )}
                  color={getCrowdColor(crowd.crowdLevel)}
                  fillColor={getCrowdColor(crowd.crowdLevel)}
                  fillOpacity={0.3}
                  weight={2}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold">{crowd.name}</h3>
                      <p>
                        Current: {crowd.currentOccupancy}/{crowd.capacity}
                      </p>
                      <p
                        className="font-medium dynamic-color"
                        style={
                          {
                            "--text-color": getCrowdColor(crowd.crowdLevel),
                          } as React.CSSProperties
                        }
                      >
                        Level: {crowd.crowdLevel.toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Occupancy:{" "}
                        {Math.round(
                          (crowd.currentOccupancy / crowd.capacity) * 100
                        )}
                        %
                      </p>
                    </div>
                  </Popup>
                </Circle>
              ))}

            {/* Route Traces */}
            {showRoutes &&
              routes.map((route) => {
                if (route.coordinates && route.coordinates.length > 1) {
                  return (
                    <Polyline
                      key={route._id}
                      positions={route.coordinates.map((coord) => [
                        coord.lat,
                        coord.lng,
                      ])}
                      color={getRouteColor(route.status)}
                      weight={getRouteWeight(route.status)}
                      opacity={getRouteOpacity(route.status)}
                      dashArray={route.status === "closed" || route.status === "blocked" ? "10, 10" : undefined}
                    >
                      <Popup>
                        <div className="p-2 min-w-[200px]">
                          <h3 className="font-bold text-lg">{route.name}</h3>
                          <p className="text-gray-600">
                            {route.from} → {route.to}
                          </p>
                          <p
                            className="font-medium text-sm px-2 py-1 rounded mt-1 inline-block dynamic-bg-color"
                            style={
                              {
                                "--bg-color": getRouteColor(route.status) + "20",
                                "--text-color": getRouteColor(route.status),
                                "--border-color": getRouteColor(route.status),
                              } as React.CSSProperties
                            }
                          >
                            Status: {route.status.toUpperCase()}
                          </p>
                          {route.liveMessage && (
                            <p className="text-sm mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                              <strong>Live Update:</strong> {route.liveMessage}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "Unknown"}
                          </p>
                        </div>
                      </Popup>
                    </Polyline>
                  );
                }
                return null;
              })}

            {/* Directions Polyline */}
            {directions && (
              <Polyline
                positions={directions}
                color="#3b82f6"
                weight={5}
                opacity={0.8}
                dashArray="10, 10"
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">Directions</h3>
                    <p>Route to selected location</p>
                    <button
                      onClick={() => setDirections(null)}
                      className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Clear Route
                    </button>
                  </div>
                </Popup>
              </Polyline>
            )}
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-lg">Loading interactive map...</p>
              <p className="text-sm text-gray-600">
                Please wait while we load the map components
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      {selectedLocation && (
        <div className="absolute bottom-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg max-w-sm">
          <h3 className="font-bold text-lg mb-2">{selectedLocation.name}</h3>
          <p className="text-gray-600">Type: {selectedLocation.type}</p>
          <p className="text-gray-600">
            Capacity: {selectedLocation.capacity || "N/A"}
          </p>
          <p className="text-gray-600">
            Coordinates: {selectedLocation.coordinates?.lat?.toFixed(4)},{" "}
            {selectedLocation.coordinates?.lng?.toFixed(4)}
          </p>
          <button
            onClick={() => setSelectedLocation(null)}
            className="mt-2 bg-gray-500 text-white px-3 py-1 rounded text-sm"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
