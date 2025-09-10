"use client";

import React, { useEffect, useState } from "react";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "@/api/locations";
import { getRoutes } from "@/api/routes";

interface Location {
  _id: string;
  name: string;
  type: string;
  coordinates: { lat: number; lng: number };
  capacity: number;
  liveStatus?: string;
  currentCapacity?: number;
  waitTime?: number;
  contactInfo?: {
    officer: string;
    phone: string;
  };
}

interface Route {
  _id: string;
  name: string;
  from: string;
  to: string;
  status: string;
  liveMessage?: string;
  coordinates?: { lat: number; lng: number }[];
  updatedAt?: string;
}

export default function LocationsTab() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    type: "",
    coordinates: { lat: "", lng: "" },
    capacity: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showRoutes, setShowRoutes] = useState(false);

  useEffect(() => {
    console.log("LocationsTab: Starting to fetch data...");
    setLoading(true);
    Promise.all([
      getLocations().catch(() => ({ data: [] })),
      getRoutes().catch(() => ({ data: [] })),
    ])
      .then(([locRes, routeRes]) => {
        console.log("LocationsTab: Received responses:", {
          locations: locRes,
          routes: routeRes,
        });
        setLocations(locRes.data || []);
        setRoutes(routeRes.data || []);
      })
      .catch((err) => {
        console.error("LocationsTab: Error fetching data:", err);
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => setLoading(false));
  }, []);

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

  const handleCreate = async () => {
    try {
      // Validate form data before sending
      if (
        !form.name ||
        !form.type ||
        !form.coordinates.lat ||
        !form.coordinates.lng
      ) {
        setError("Please fill in all required fields");
        return;
      }

      const lat = parseFloat(form.coordinates.lat);
      const lng = parseFloat(form.coordinates.lng);

      if (isNaN(lat) || isNaN(lng)) {
        setError("Please enter valid latitude and longitude values");
        return;
      }

      const locationData = {
        name: form.name,
        type: form.type,
        coordinates: { lat, lng },
        capacity: form.capacity || 0,
      };

      console.log("Sending location data:", locationData);

      const res = await createLocation(locationData);
      setLocations((prev) => [res.data, ...prev]);
      setForm({
        name: "",
        type: "",
        coordinates: { lat: "", lng: "" },
        capacity: 0,
      });
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Create location error:", err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLocation(id);
      setLocations((prev) => prev.filter((loc) => loc._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleEdit = (loc: Location) => {
    setEditingId(loc._id);
    setForm({
      name: loc.name,
      type: loc.type,
      coordinates: {
        lat: loc.coordinates?.lat?.toString() || "",
        lng: loc.coordinates?.lng?.toString() || "",
      },
      capacity: loc.capacity,
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await updateLocation(editingId!, {
        ...form,
        coordinates: {
          lat: parseFloat(form.coordinates.lat),
          lng: parseFloat(form.coordinates.lng),
        },
      });
      setLocations((prev) =>
        prev.map((loc) => (loc._id === editingId ? res.data : loc))
      );
      setEditingId(null);
      setForm({
        name: "",
        type: "",
        coordinates: { lat: "", lng: "" },
        capacity: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="p-6 text-black">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Locations Management
          </h2>
          <p className="text-gray-600 text-sm">
            Manage locations and monitor route status
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setShowRoutes(!showRoutes)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showRoutes ? "Hide Routes" : "Show Routes"} 🛣️
          </button>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Location
          </button>
        </div>
      </div>

      {/* Route Status Summary */}
      {showRoutes && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">
            🛣️ Route Status Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["open", "congested", "closed", "maintenance"].map((status) => {
              const count = routes.filter(
                (r) => r.status?.toLowerCase() === status
              ).length;
              const getStatusColor = (status: string) => {
                switch (status) {
                  case "open":
                    return "bg-green-100 text-green-800 border-green-300";
                  case "congested":
                    return "bg-yellow-100 text-yellow-800 border-yellow-300";
                  case "closed":
                    return "bg-red-100 text-red-800 border-red-300";
                  case "maintenance":
                    return "bg-purple-100 text-purple-800 border-purple-300";
                  default:
                    return "bg-gray-100 text-gray-800 border-gray-300";
                }
              };
              const getStatusIcon = (status: string) => {
                switch (status) {
                  case "open":
                    return "✅";
                  case "congested":
                    return "⚠️";
                  case "closed":
                    return "❌";
                  case "maintenance":
                    return "🔧";
                  default:
                    return "❓";
                }
              };
              return (
                <div
                  key={status}
                  className={`p-3 rounded-lg border ${getStatusColor(status)}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{getStatusIcon(status)}</span>
                    <span className="text-xl font-bold">{count}</span>
                  </div>
                  <p className="text-xs font-medium capitalize">
                    {status} Routes
                  </p>
                </div>
              );
            })}
          </div>
          {routes.length > 0 && (
            <p className="text-xs text-blue-600 mt-2">
              Total routes: {routes.length} | Last updated:{" "}
              {new Date().toLocaleTimeString()}
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (editingId) {
            handleUpdate();
          } else {
            handleCreate();
          }
        }}
        className="mb-6"
      >
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          placeholder="Type"
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            value={form.coordinates.lat}
            onChange={(e) =>
              setForm({
                ...form,
                coordinates: { ...form.coordinates, lat: e.target.value },
              })
            }
            placeholder="Latitude (e.g., 25.4358)"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            value={form.coordinates.lng}
            onChange={(e) =>
              setForm({
                ...form,
                coordinates: { ...form.coordinates, lng: e.target.value },
              })
            }
            placeholder="Longitude (e.g., 81.8463)"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <input
          type="number"
          value={form.capacity}
          onChange={(e) =>
            setForm({ ...form, capacity: Number(e.target.value) })
          }
          placeholder="Capacity"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {editingId ? "Update" : "Add"} Location
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({
                name: "",
                type: "",
                coordinates: { lat: "", lng: "" },
                capacity: 0,
              });
            }}
            className="w-full mt-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading locations...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div
              key={loc._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {loc.name}
                  </h3>
                  <p className="text-sm text-gray-600">{loc.type}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    loc.liveStatus || "Unknown"
                  )}`}
                >
                  {loc.liveStatus || "Unknown"}
                </span>
              </div>

              {/* Capacity Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Capacity</span>
                  <span>{loc.currentCapacity || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getCapacityColor(
                      loc.currentCapacity || 0
                    )} ${getProgressBarClass(loc.currentCapacity || 0)}`}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Wait Time</p>
                  <p className="font-semibold">{loc.waitTime || 0}m</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Coordinates</p>
                  <p className="font-semibold text-xs">
                    {loc.coordinates &&
                    typeof loc.coordinates.lat === "number" &&
                    typeof loc.coordinates.lng === "number"
                      ? `${loc.coordinates.lat.toFixed(
                          3
                        )}, ${loc.coordinates.lng.toFixed(3)}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              {loc.contactInfo && (
                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm font-medium text-blue-900">
                    {loc.contactInfo.officer}
                  </p>
                  <p className="text-sm text-blue-700">
                    {loc.contactInfo.phone}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(loc)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                  onClick={() => {
                    if (loc.coordinates?.lat && loc.coordinates?.lng) {
                      window.open(
                        `https://www.openstreetmap.org/?mlat=${loc.coordinates.lat}&mlon=${loc.coordinates.lng}&zoom=16#map=16/${loc.coordinates.lat}/${loc.coordinates.lng}`,
                        "_blank"
                      );
                    } else {
                      alert("No valid coordinates available for this location");
                    }
                  }}
                >
                  📍 OpenStreetMap
                </button>
                <button
                  onClick={() => handleDelete(loc._id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {locations.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No locations found. Add your first location above!
          </p>
        </div>
      )}
    </div>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-green-100 text-green-800";
    case "Congested":
      return "bg-yellow-100 text-yellow-800";
    case "Closed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getCapacityColor = (capacity: number) => {
  if (capacity > 80) return "bg-red-500";
  if (capacity > 60) return "bg-yellow-500";
  return "bg-green-500";
};
