"use client";

import React, { useEffect, useState } from "react";

interface Alert {
  id: number;
  type: string;
  severity: string;
  message: string;
  location: string;
  timestamp: string;
  status: string;
  coordinates: { lat: number; lng: number };
}

const AlertsTab = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, unknown>>({});

  const fetchAlerts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/alerts");
      const result = await response.json();
      if (result.success) {
        setAlerts(result.data);
        setStats({
          totalAlerts: result.totalAlerts,
          activeAlerts: result.activeAlerts,
          criticalAlerts: result.criticalAlerts,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500 text-white";
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-100 text-red-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await fetch(`http://localhost:5000/api/alerts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchAlerts();
    } catch (error) {
      console.error("Failed to update alert:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800">Total Alerts</h3>
          <p className="text-2xl font-bold text-red-600">
            {(stats.totalAlerts as number) || 0}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-orange-800">Active</h3>
          <p className="text-2xl font-bold text-orange-600">
            {(stats.activeAlerts as number) || 0}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800">Critical</h3>
          <p className="text-2xl font-bold text-red-600">
            {(stats.criticalAlerts as number) || 0}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800">Response Time</h3>
          <p className="text-2xl font-bold text-blue-600">2.5m</p>
        </div>
      </div>

      {/* Real-time Alert Stream */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-50 px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-red-900">
            🚨 Live Alert Stream
          </h2>
          <p className="text-sm text-red-600">
            Real-time monitoring • Auto-refresh every 15 seconds
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {alerts.map((alert) => (
            <div key={alert.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getSeverityColor(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {alert.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {alert.location}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{alert.message}</p>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    <span>
                      📍 {alert.coordinates.lat.toFixed(4)},{" "}
                      {alert.coordinates.lng.toFixed(4)}
                    </span>
                    <span>
                      🕐 {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={alert.status}
                    onChange={(e) =>
                      handleStatusChange(alert.id, e.target.value)
                    }
                    className={`text-xs font-semibold rounded-full px-3 py-1 border-0 ${getStatusColor(
                      alert.status
                    )}`}
                    title="Change alert status"
                    aria-label="Alert status"
                  >
                    <option value="Active">Active</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <button type="button" className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                    View Map
                  </button>
                  <button type="button" className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                    Dispatch
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Prediction & Auto-Response */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">
            🤖 AI Predictions
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 shadow">
              <h4 className="font-medium text-gray-800">Next 30 Minutes</h4>
              <p className="text-sm text-gray-600">
                2 congestion alerts predicted at Main Ghat
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow">
              <h4 className="font-medium text-gray-800">Traffic Diversion</h4>
              <p className="text-sm text-gray-600">
                Auto-redirect to Route 3 & 5 in 10 minutes
              </p>
              <button type="button" className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-xs">
                Configure
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">
            ⚡ Auto-Response System
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 shadow">
              <h4 className="font-medium text-gray-800">Emergency Protocols</h4>
              <p className="text-sm text-gray-600">
                Auto-dispatch ambulance for medical alerts
              </p>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Enabled
              </span>
            </div>
            <div className="bg-white rounded-lg p-3 shadow">
              <h4 className="font-medium text-gray-800">Crowd Control</h4>
              <p className="text-sm text-gray-600">
                Smart barriers activated automatically
              </p>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Controls */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-4">
          🚨 Emergency Controls
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button type="button" className="bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700">
            Mass Alert
          </button>
          <button type="button" className="bg-orange-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-orange-700">
            Traffic Stop
          </button>
          <button type="button" className="bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700">
            Medical Alert
          </button>
          <button type="button" className="bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700">
            Evacuation
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertsTab;
