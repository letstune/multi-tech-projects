"use client";

import React, { useEffect, useState } from "react";
import { getLocations } from "@/api/locations";
import { getRoutes, getDirections } from "@/api/routes";

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

export default function ProfessionalMapView() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Location | null>(null);
  const [directions, setDirections] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getLocations().catch(() => ({ data: [] })),
      getRoutes().catch(() => ({ data: [] })),
    ])
      .then(([locRes, routeRes]) => {
        setLocations(locRes.data || []);
        setRoutes(routeRes.data || []);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : String(err))
      )
      .finally(() => setLoading(false));
  }, []);

  const handleDirections = async (to: Location) => {
    if (!to.coordinates?.lat || !to.coordinates?.lng) {
      setError("Invalid destination coordinates");
      return;
    }
    // For demo, use a fixed from location (could use user location in real app)
    const fromLat = 25.4358;
    const fromLng = 81.8463;
    try {
      const res = await getDirections(
        fromLat,
        fromLng,
        to.coordinates.lat,
        to.coordinates.lng
      );
      setDirections(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const safeCoordinates = (coords?: { lat?: number; lng?: number }) => {
    if (
      !coords ||
      typeof coords.lat !== "number" ||
      typeof coords.lng !== "number"
    ) {
      return "N/A";
    }
    return `${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}`;
  };

  if (loading) return <div>Loading map...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Map View</h2>
      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Locations Panel */}
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Locations ({locations.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {locations.map((loc) => (
              <div key={loc._id} className="bg-white p-3 rounded shadow border">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{loc.name}</h4>
                    <p className="text-sm text-gray-600">Type: {loc.type}</p>
                    <p className="text-sm text-gray-600">
                      Coordinates: {safeCoordinates(loc.coordinates)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Capacity: {loc.capacity || "N/A"}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelected(loc)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Select
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDirections(loc)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                      disabled={!loc.coordinates?.lat || !loc.coordinates?.lng}
                    >
                      Directions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Routes Panel */}
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Routes ({routes.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {routes.map((route) => (
              <div
                key={route._id}
                className="bg-white p-3 rounded shadow border"
              >
                <h4 className="font-medium">{route.name}</h4>
                <p className="text-sm text-gray-600">
                  From: {route.from} → To: {route.to}
                </p>
                <p
                  className={`text-sm font-medium ${
                    route.status === "open"
                      ? "text-green-600"
                      : route.status === "congested"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  Status: {route.status}
                </p>
                {route.liveMessage && (
                  <p className="text-sm text-gray-700 mt-1">
                    {route.liveMessage}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Location Details */}
      {selected && (
        <div className="mt-6 bg-blue-50 p-4 rounded">
          <h4 className="text-lg font-semibold mb-2">Selected Location</h4>
          <p>
            <strong>Name:</strong> {selected.name}
          </p>
          <p>
            <strong>Type:</strong> {selected.type}
          </p>
          <p>
            <strong>Coordinates:</strong>{" "}
            {safeCoordinates(selected.coordinates)}
          </p>
          <p>
            <strong>Capacity:</strong> {selected.capacity || "N/A"}
          </p>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="mt-2 bg-gray-500 text-white px-3 py-1 rounded"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Directions Details */}
      {directions && (
        <div className="mt-6 bg-green-50 p-4 rounded">
          <h4 className="text-lg font-semibold mb-2">Directions</h4>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(directions, null, 2)}
          </pre>
          <button
            type="button"
            onClick={() => setDirections(null)}
            className="mt-2 bg-gray-500 text-white px-3 py-1 rounded"
          >
            Clear Directions
          </button>
        </div>
      )}
    </div>
  );
}
