"use client";

import React, { useEffect, useState } from "react";
import { getRoutes } from "@/api/routes";

interface Route {
  _id: string;
  name: string;
  from: string;
  to: string;
  status: string;
  liveMessage?: string;
  coordinates?: { lat: number; lng: number }[];
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await getRoutes();
        setRoutes(response.data || []);
      } catch {
        // Use mock data when API fails (for development/build)
        const mockRoutes = [
          {
            _id: "1",
            name: "Main Entrance Route",
            from: "Parking Area A",
            to: "Main Temple",
            status: "open",
            liveMessage: "Traffic flowing normally"
          },
          {
            _id: "2",
            name: "Side Entrance Route",
            from: "Parking Area B",
            to: "Side Temple",
            status: "congested",
            liveMessage: "Heavy traffic, expect delays"
          },
          {
            _id: "3",
            name: "Emergency Route",
            from: "Emergency Gate",
            to: "Medical Center",
            status: "closed",
            liveMessage: "Route temporarily closed for maintenance"
          }
        ];
        setRoutes(mockRoutes);
        setError("Using demo data - API not available");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200";
      case "congested":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "closed":
        return "bg-red-100 text-red-800 border-red-200";
      case "maintenance":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">🛣️ Route Management</h1>
        <p className="text-blue-100">
          Monitor and manage all routes in real-time
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Route Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Routes</p>
              <p className="text-3xl font-bold text-gray-900">
                {routes.filter((r) => r.status === "open").length}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Congested</p>
              <p className="text-3xl font-bold text-gray-900">
                {routes.filter((r) => r.status === "congested").length}
              </p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Closed Routes</p>
              <p className="text-3xl font-bold text-gray-900">
                {routes.filter((r) => r.status === "closed").length}
              </p>
            </div>
            <div className="text-4xl">❌</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-3xl font-bold text-gray-900">
                {routes.filter((r) => r.status === "maintenance").length}
              </p>
            </div>
            <div className="text-4xl">🔧</div>
          </div>
        </div>
      </div>

      {/* Routes List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          All Routes ({routes.length})
        </h3>
        
        {routes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-6xl mb-4">🛣️</div>
            <p className="text-lg">No routes found</p>
            <p className="text-sm">Routes will appear here when available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((route) => (
              <div
                key={route._id}
                className={`border rounded-lg p-4 ${getStatusColor(route.status)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-lg">{route.name}</h4>
                  <span className="text-2xl">{getStatusIcon(route.status)}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="font-medium">From:</span>
                    <span className="ml-2">{route.from}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium">To:</span>
                    <span className="ml-2">{route.to}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium">Status:</span>
                    <span className="ml-2 capitalize font-semibold">
                      {route.status}
                    </span>
                  </div>
                  
                  {route.liveMessage && (
                    <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-sm">
                      <span className="font-medium">Live Update:</span>
                      <p className="mt-1">{route.liveMessage}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button type="button" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  <button type="button" className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
