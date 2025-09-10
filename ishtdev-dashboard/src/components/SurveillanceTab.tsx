"use client";

import React, { useState, useEffect, useMemo } from "react";

interface Camera {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "maintenance";
  lastSeen: string;
  type: "fixed" | "ptz" | "dome";
  resolution: string;
  nightVision: boolean;
  crowdCount?: number;
  alerts: number;
}

interface Alert {
  id: string;
  type:
    | "crowd_density"
    | "suspicious_activity"
    | "emergency"
    | "equipment_failure";
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  timestamp: string;
  description: string;
  resolved: boolean;
  assignedTo?: string;
}

const SurveillanceTab = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Mock data - memoized to prevent dependency issues
  const mockCameras: Camera[] = useMemo(() => [
    {
      id: "cam001",
      name: "Main Entrance Camera",
      location: "Main Gate",
      status: "online",
      lastSeen: "2024-01-20T10:30:00Z",
      type: "fixed",
      resolution: "4K",
      nightVision: true,
      crowdCount: 150,
      alerts: 2,
    },
    {
      id: "cam002",
      name: "Bathing Ghat PTZ",
      location: "Main Bathing Ghat",
      status: "online",
      lastSeen: "2024-01-20T10:29:45Z",
      type: "ptz",
      resolution: "1080p",
      nightVision: true,
      crowdCount: 320,
      alerts: 5,
    },
    {
      id: "cam003",
      name: "Puja Area Dome",
      location: "Puja Kendra Central",
      status: "online",
      lastSeen: "2024-01-20T10:30:15Z",
      type: "dome",
      resolution: "4K",
      nightVision: true,
      crowdCount: 280,
      alerts: 1,
    },
    {
      id: "cam004",
      name: "Medical Center View",
      location: "Medical Emergency Center",
      status: "offline",
      lastSeen: "2024-01-20T09:15:32Z",
      type: "fixed",
      resolution: "1080p",
      nightVision: false,
      crowdCount: 0,
      alerts: 1,
    },
    {
      id: "cam005",
      name: "Food Court Monitor",
      location: "Food Court A",
      status: "maintenance",
      lastSeen: "2024-01-20T08:45:12Z",
      type: "dome",
      resolution: "1080p",
      nightVision: true,
      crowdCount: 0,
      alerts: 0,
    },
    {
      id: "cam006",
      name: "Emergency Exit Cam",
      location: "Emergency Exit Point",
      status: "online",
      lastSeen: "2024-01-20T10:29:55Z",
      type: "fixed",
      resolution: "1080p",
      nightVision: true,
      crowdCount: 45,
      alerts: 0,
    },
  ], []);

  const mockAlerts: Alert[] = useMemo(() => [
    {
      id: "alert001",
      type: "crowd_density",
      severity: "high",
      location: "Main Bathing Ghat",
      timestamp: "2024-01-20T10:25:00Z",
      description:
        "High crowd density detected - exceeding safe capacity by 15%",
      resolved: false,
      assignedTo: "Officer Sharma",
    },
    {
      id: "alert002",
      type: "suspicious_activity",
      severity: "medium",
      location: "Main Gate",
      timestamp: "2024-01-20T10:20:00Z",
      description: "Unattended bag detected near entrance for over 10 minutes",
      resolved: false,
      assignedTo: "Security Team Alpha",
    },
    {
      id: "alert003",
      type: "equipment_failure",
      severity: "low",
      location: "Medical Emergency Center",
      timestamp: "2024-01-20T09:15:00Z",
      description: "Camera offline - possible network connectivity issue",
      resolved: false,
      assignedTo: "IT Support",
    },
    {
      id: "alert004",
      type: "emergency",
      severity: "critical",
      location: "Puja Kendra Central",
      timestamp: "2024-01-20T09:45:00Z",
      description:
        "Medical emergency detected - person down requiring assistance",
      resolved: true,
      assignedTo: "Medical Team",
    },
  ], []);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCameras(mockCameras);
      setAlerts(mockAlerts);
      setIsLoading(false);
    }, 1000);
  }, [mockCameras, mockAlerts]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 border-green-200";
      case "offline":
        return "bg-red-100 text-red-800 border-red-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "crowd_density":
        return "👥";
      case "suspicious_activity":
        return "⚠️";
      case "emergency":
        return "🚨";
      case "equipment_failure":
        return "🔧";
      default:
        return "📢";
    }
  };

  const filteredCameras =
    filterStatus === "all"
      ? cameras
      : cameras.filter((camera) => camera.status === filterStatus);

  const onlineCameras = cameras.filter((c) => c.status === "online").length;
  const totalAlerts = alerts.filter((a) => !a.resolved).length;
  const criticalAlerts = alerts.filter(
    (a) => !a.resolved && a.severity === "critical"
  ).length;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading surveillance data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          AI Surveillance System
        </h2>
        <div className="flex space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
            title="Filter cameras by status"
            aria-label="Camera status filter"
          >
            <option value="all">All Cameras</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <div className="flex bg-gray-200 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded-l-lg ${
                viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-600"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-r-lg ${
                viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-600"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Online Cameras
              </p>
              <p className="text-3xl font-bold text-green-600">
                {onlineCameras}/{cameras.length}
              </p>
              <p className="text-sm text-green-600">System operational</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-3xl font-bold text-orange-600">
                {totalAlerts}
              </p>
              <p className="text-sm text-orange-600">Require attention</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Critical Issues
              </p>
              <p className="text-3xl font-bold text-red-600">
                {criticalAlerts}
              </p>
              <p className="text-sm text-red-600">Immediate action</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Detection</p>
              <p className="text-3xl font-bold text-purple-600">Active</p>
              <p className="text-sm text-purple-600">Real-time analysis</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Grid/List View */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Camera Network
          </h3>
        </div>
        <div className="p-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCameras.map((camera) => (
                <div
                  key={camera.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedCamera(camera)}
                >
                  <div className="bg-gray-900 h-32 flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg
                        className="w-8 h-8 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm">
                        {camera.status === "online" ? "Live Feed" : "No Signal"}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">
                        {camera.name}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          camera.status
                        )}`}
                      >
                        {camera.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {camera.location}
                    </p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        {camera.resolution} • {camera.type.toUpperCase()}
                      </span>
                      {camera.nightVision && <span>🌙 Night Vision</span>}
                    </div>
                    {camera.crowdCount !== undefined &&
                      camera.crowdCount > 0 && (
                        <div className="mt-2 text-sm">
                          <span className="text-blue-600 font-medium">
                            👥 {camera.crowdCount} people detected
                          </span>
                        </div>
                      )}
                    {camera.alerts > 0 && (
                      <div className="mt-2">
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          {camera.alerts} alert{camera.alerts > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Camera
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crowd Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alerts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCameras.map((camera) => (
                    <tr key={camera.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {camera.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {camera.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {camera.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            camera.status
                          )}`}
                        >
                          {camera.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {camera.type.toUpperCase()} • {camera.resolution}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {camera.crowdCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {camera.alerts > 0 ? (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            {camera.alerts}
                          </span>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedCamera(camera)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Settings
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Active Alerts</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {alerts
            .filter((alert) => !alert.resolved)
            .map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">
                      {getAlertTypeIcon(alert.type)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {alert.type.replace("_", " ").toUpperCase()}
                        </h4>
                        <span
                          className={`w-2 h-2 rounded-full ${getSeverityColor(
                            alert.severity
                          )}`}
                        ></span>
                        <span className="text-xs text-gray-500 capitalize">
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {alert.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>📍 {alert.location}</span>
                        <span>
                          🕒 {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                        {alert.assignedTo && <span>👤 {alert.assignedTo}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                      View Details
                    </button>
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Camera Detail Modal */}
      {selectedCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedCamera.name}
                </h3>
                <button
                  onClick={() => setSelectedCamera(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Live Feed Placeholder */}
              <div className="bg-gray-900 h-64 rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg
                    className="w-12 h-12 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p>
                    {selectedCamera.status === "online"
                      ? "Live Feed"
                      : "Camera Offline"}
                  </p>
                </div>
              </div>

              {/* Camera Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedCamera.location}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      selectedCamera.status
                    )}`}
                  >
                    {selectedCamera.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedCamera.type.toUpperCase()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Resolution
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedCamera.resolution}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Night Vision
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedCamera.nightVision ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Crowd Count
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedCamera.crowdCount || 0} people
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Start Recording
                </button>
                <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Take Screenshot
                </button>
                <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                  AI Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveillanceTab;
