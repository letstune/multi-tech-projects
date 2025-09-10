"use client";

import React, { useState, ReactNode } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Marker, Popup } from "react-leaflet";
// Report Generator component
type ReportGeneratorProps = {
  onClose: () => void;
};
function ReportGenerator(props: ReportGeneratorProps) {
  const { onClose } = props;
  const [reportType, setReportType] = useState("Daily Summary");
  const handleGenerate = () => {
    onClose();
    alert(`Report generated: ${reportType}`);
  };
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Report Type
      </label>
      <select
        className="block w-full border rounded p-2 mb-2"
        value={reportType}
        onChange={(e) => setReportType(e.target.value)}
      >
        <option>Daily Summary</option>
        <option>Crowd Analysis</option>
        <option>Lost &amp; Found</option>
        <option>Emergency Events</option>
      </select>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded w-full"
        onClick={handleGenerate}
      >
        Generate
      </button>
      <p className="text-xs text-gray-500 mt-2">
        <b>Daily Summary:</b> Overview of all activities.
        <br />
        <b>Crowd Analysis:</b> Crowd density and movement trends.
        <br />
        <b>Lost &amp; Found:</b> Reports and resolutions.
        <br />
        <b>Emergency Events:</b> Emergency alert logs.
      </p>
    </div>
  );
}
// Dynamically import MapContainer and TileLayer to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

// Simple Modal component
type ModalProps = {
  onClose: () => void;
  title: string;
  children: ReactNode;
};
function Modal({ onClose, title, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // Modal state
  const [showMap, setShowMap] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showCrowd, setShowCrowd] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Quick Actions handlers
  const handleViewLiveMap = () => setShowMap(true);
  const handleEmergencyAlert = () => setShowEmergency(true);
  const handleCrowdAnalysis = () => setShowCrowd(true);
  const handleGenerateReport = () => setShowReport(true);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2 text-white">Admin Dashboard</h1>
        <p className="text-blue-100">
          Real-time monitoring and control system for crowd management, safety,
          and lost & found
        </p>
      </div>
      {/* Real-time Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Visitors
              </p>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">No visitors yet</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">No active alerts</p>
            </div>
            <div className="text-4xl">🚨</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Safety Score</p>
              <p className="text-3xl font-bold text-gray-900">0%</p>
              <p className="text-sm text-gray-600">No data</p>
            </div>
            <div className="text-4xl">🛡️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lost & Found</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">No items reported</p>
            </div>
            <div className="text-4xl">🔍</div>
          </div>
        </div>
      </div>
      {/* Route Status Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            🛣️ Route Status Overview
          </h3>
          <span className="text-sm text-gray-500">Real-time updates</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">✅</span>
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <p className="text-sm font-medium text-green-800">Open Routes</p>
            <p className="text-xs text-green-600">Normal traffic flow</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">⚠️</span>
              <span className="text-2xl font-bold text-yellow-600">1</span>
            </div>
            <p className="text-sm font-medium text-yellow-800">Congested</p>
            <p className="text-xs text-yellow-600">Heavy traffic</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">❌</span>
              <span className="text-2xl font-bold text-red-600">0</span>
            </div>
            <p className="text-sm font-medium text-red-800">Closed Routes</p>
            <p className="text-xs text-red-600">Temporarily blocked</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🔧</span>
              <span className="text-2xl font-bold text-purple-600">0</span>
            </div>
            <p className="text-sm font-medium text-purple-800">Maintenance</p>
            <p className="text-xs text-purple-600">Under repair</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
          <p className="text-sm text-blue-800">
            <strong>Live Update:</strong> All major routes are operational. Food
            Court to Security Office experiencing moderate congestion.
          </p>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleViewLiveMap}
          >
            View Live Map
          </button>
          <button
            className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
            onClick={handleEmergencyAlert}
          >
            Emergency Alert
          </button>
          <button
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
            onClick={handleCrowdAnalysis}
          >
            Crowd Analysis
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            onClick={handleGenerateReport}
          >
            Generate Report
          </button>
        </div>
      </div>
      {/* Modals for Quick Actions */}
      {/* Live Map Modal */}
      {showMap && (
        <Modal onClose={() => setShowMap(false)} title="Live Map">
          <div className="w-full h-[600px] flex items-center justify-center">
            <div
              className="w-full h-full"
              style={{ height: 550, width: "100%" }}
            >
              <MapContainer
                center={[25.3176, 82.9739]}
                zoom={13}
                style={{ height: "100%", width: "100%", minHeight: 500 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Kumbh Mela Ghats Markers */}
                <Marker position={[25.3176, 82.9739]}>
                  <Popup>Main Ghat (Dashashwamedh)</Popup>
                </Marker>
                <Marker position={[25.3097, 82.9732]}>
                  <Popup>Assi Ghat</Popup>
                </Marker>
                <Marker position={[25.3167, 82.9901]}>
                  <Popup>Manikarnika Ghat</Popup>
                </Marker>
                <Marker position={[25.3126, 82.9738]}>
                  <Popup>Harishchandra Ghat</Popup>
                </Marker>
                <Marker position={[25.3207, 82.9735]}>
                  <Popup>Rajendra Prasad Ghat</Popup>
                </Marker>
                <Marker position={[25.3145, 82.9736]}>
                  <Popup>Shivala Ghat</Popup>
                </Marker>
                {/* Medical Points */}
                <Marker position={[25.3185, 82.9755]}>
                  <Popup>Medical Camp 1</Popup>
                </Marker>
                <Marker position={[25.3115, 82.9725]}>
                  <Popup>Medical Camp 2</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </Modal>
      )}
      {/* Emergency Alert Modal */}
      {showEmergency && (
        <Modal onClose={() => setShowEmergency(false)} title="Emergency Alert">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select className="mt-1 block w-full border rounded p-2">
                <option>Medical</option>
                <option>Fire</option>
                <option>Security</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="mt-1 block w-full border rounded p-2"
                rows={3}
                placeholder="Describe the emergency..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  setShowEmergency(false);
                  alert("Emergency alert sent!");
                }}
              >
                Send Alert
              </button>
            </div>
          </form>
        </Modal>
      )}
      {/* Crowd Analysis Modal */}
      {showCrowd && (
        <Modal onClose={() => setShowCrowd(false)} title="Crowd Analysis">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Current Density:</span>
              <span className="text-green-600 font-bold">Moderate</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Predicted Peak:</span>
              <span className="text-orange-600 font-bold">2:00 PM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Hotspot:</span>
              <span className="text-red-600 font-bold">Main Ghat</span>
            </div>
            <div className="mt-4">
              <span className="block text-xs text-gray-500">
                (Demo data. Integrate with backend for live analysis.)
              </span>
            </div>
          </div>
        </Modal>
      )}
      {/* Generate Report Modal */}
      {showReport && (
        <Modal onClose={() => setShowReport(false)} title="Generate Report">
          <ReportGenerator onClose={() => setShowReport(false)} />
        </Modal>
      )}
      {/* Live Updates Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔴 Live Activity Feed
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
              <div className="text-red-600 font-bold">🚨</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  High crowd density at Main Ghat
                </p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-600 font-bold">📍</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New lost person report received
                </p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="text-green-600 font-bold">✅</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Route 3 congestion resolved
                </p>
                <p className="text-xs text-gray-500">8 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="text-yellow-600 font-bold">⚠️</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  AI predicted congestion in 30 min
                </p>
                <p className="text-xs text-gray-500">12 minutes ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 AI Insights
          </h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800">Crowd Prediction</h4>
              <p className="text-sm text-gray-600 mt-1">
                Peak crowd expected at 2:00 PM near Snan Ghat 1
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full w-[85%]"></div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800">Safety Optimization</h4>
              <p className="text-sm text-gray-600 mt-1">
                Recommend opening alternative routes
              </p>
              <button type="button" className="mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm">
                Apply
              </button>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800">Resource Allocation</h4>
              <p className="text-sm text-gray-600 mt-1">
                Deploy 3 additional volunteers to Zone 2
              </p>
              <button type="button" className="mt-2 bg-orange-600 text-white px-3 py-1 rounded text-sm">
                Deploy
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* System Status */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">AI Monitoring: Active</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">
              Camera Network: Online
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">GPS Tracking: Active</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-700">
              Emergency Systems: Standby
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Communication: Online</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Database: Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
