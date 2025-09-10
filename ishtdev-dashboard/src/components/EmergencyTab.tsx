"use client";

import React, { useState, useEffect, useMemo } from "react";

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  location: string;
  status: "available" | "busy" | "offline";
  specialization?: string;
}

interface Emergency {
  id: string;
  type: "medical" | "fire" | "security" | "crowd" | "weather" | "technical";
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  description: string;
  timestamp: string;
  status: "active" | "responded" | "resolved";
  assignedTeam?: string;
  responseTime?: number;
  reportedBy: string;
  coordinates?: { lat: number; lng: number };
}

interface Resource {
  id: string;
  name: string;
  type: "medical" | "security" | "fire" | "communication" | "transport";
  location: string;
  status: "available" | "deployed" | "maintenance";
  capacity?: number;
  currentLoad?: number;
}

const EmergencyTab = () => {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(
    null
  );
  const [showNewEmergencyForm, setShowNewEmergencyForm] = useState(false);

  // Mock data - memoized to prevent dependency issues
  const mockEmergencies: Emergency[] = useMemo(() => [
    {
      id: "emr001",
      type: "medical",
      severity: "high",
      location: "Main Bathing Ghat",
      description:
        "Person collapsed during bathing ritual, requires immediate medical attention",
      timestamp: "2024-01-20T10:15:00Z",
      status: "active",
      assignedTeam: "Medical Team Alpha",
      reportedBy: "Security Officer Sharma",
      coordinates: { lat: 25.4358, lng: 81.8463 },
    },
    {
      id: "emr002",
      type: "crowd",
      severity: "critical",
      location: "Puja Kendra Central",
      description: "Dangerous crowd surge detected, risk of stampede",
      timestamp: "2024-01-20T10:08:00Z",
      status: "responded",
      assignedTeam: "Crowd Control Unit",
      responseTime: 3,
      reportedBy: "AI Surveillance System",
      coordinates: { lat: 25.4368, lng: 81.8473 },
    },
    {
      id: "emr003",
      type: "security",
      severity: "medium",
      location: "Main Entrance",
      description: "Suspicious package found near security checkpoint",
      timestamp: "2024-01-20T09:45:00Z",
      status: "resolved",
      assignedTeam: "Bomb Squad",
      responseTime: 12,
      reportedBy: "Gate Security",
      coordinates: { lat: 25.4348, lng: 81.8453 },
    },
    {
      id: "emr004",
      type: "fire",
      severity: "low",
      location: "Food Court A",
      description: "Smoke detected from kitchen area, possible fire hazard",
      timestamp: "2024-01-20T09:30:00Z",
      status: "resolved",
      assignedTeam: "Fire Safety Team",
      responseTime: 8,
      reportedBy: "Kitchen Staff",
      coordinates: { lat: 25.4338, lng: 81.8443 },
    },
  ], []);

  const mockContacts: EmergencyContact[] = useMemo(() => [
    {
      id: "con001",
      name: "Dr. Priya Sharma",
      role: "Chief Medical Officer",
      phone: "+91-9876543210",
      location: "Medical Center",
      status: "available",
      specialization: "Emergency Medicine",
    },
    {
      id: "con002",
      name: "Inspector Raj Kumar",
      role: "Security Head",
      phone: "+91-9876543211",
      location: "Control Room",
      status: "busy",
      specialization: "Crowd Control",
    },
    {
      id: "con003",
      name: "Fire Officer Gupta",
      role: "Fire Safety Chief",
      phone: "+91-9876543212",
      location: "Fire Station",
      status: "available",
      specialization: "Fire & Rescue",
    },
    {
      id: "con004",
      name: "Tech Lead Singh",
      role: "IT Emergency Response",
      phone: "+91-9876543213",
      location: "IT Center",
      status: "available",
      specialization: "System Recovery",
    },
    {
      id: "con005",
      name: "Ambulance Team Leader",
      role: "Emergency Medical Services",
      phone: "+91-9876543214",
      location: "Ambulance Station",
      status: "available",
      specialization: "Critical Care Transport",
    },
  ], []);

  const mockResources: Resource[] = useMemo(() => [
    {
      id: "res001",
      name: "Ambulance Unit 1",
      type: "medical",
      location: "Medical Center",
      status: "available",
      capacity: 4,
      currentLoad: 0,
    },
    {
      id: "res002",
      name: "Fire Truck Alpha",
      type: "fire",
      location: "Fire Station",
      status: "available",
      capacity: 8,
      currentLoad: 0,
    },
    {
      id: "res003",
      name: "Security Patrol Unit 3",
      type: "security",
      location: "Patrolling",
      status: "deployed",
      capacity: 6,
      currentLoad: 4,
    },
    {
      id: "res004",
      name: "Emergency Communication Hub",
      type: "communication",
      location: "Control Room",
      status: "available",
      capacity: 100,
      currentLoad: 15,
    },
    {
      id: "res005",
      name: "Emergency Transport Bus",
      type: "transport",
      location: "Main Gate",
      status: "maintenance",
      capacity: 40,
      currentLoad: 0,
    },
  ], []);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEmergencies(mockEmergencies);
      setContacts(mockContacts);
      setResources(mockResources);
      setIsLoading(false);
    }, 1000);
  }, [mockEmergencies, mockContacts, mockResources]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800";
      case "responded":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-red-100 text-red-800";
      case "deployed":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEmergencyIcon = (type: string) => {
    switch (type) {
      case "medical":
        return "🏥";
      case "fire":
        return "🔥";
      case "security":
        return "🚔";
      case "crowd":
        return "👥";
      case "weather":
        return "🌪️";
      case "technical":
        return "⚙️";
      default:
        return "🚨";
    }
  };

  const activeEmergencies = emergencies.filter((e) => e.status === "active");
  const criticalEmergencies = emergencies.filter(
    (e) => e.severity === "critical"
  );
  const availableContacts = contacts.filter((c) => c.status === "available");
  const deployedResources = resources.filter((r) => r.status === "deployed");

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="ml-2">Loading emergency data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Emergency Response Center
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowNewEmergencyForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <span>🚨</span>
            <span>Report Emergency</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Emergency Protocols
          </button>
        </div>
      </div>

      {/* Emergency Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Emergencies
              </p>
              <p className="text-3xl font-bold text-red-600">
                {activeEmergencies.length}
              </p>
              <p className="text-sm text-red-600">
                Immediate attention required
              </p>
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
                Critical Level
              </p>
              <p className="text-3xl font-bold text-orange-600">
                {criticalEmergencies.length}
              </p>
              <p className="text-sm text-orange-600">Highest priority</p>
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Available Responders
              </p>
              <p className="text-3xl font-bold text-green-600">
                {availableContacts.length}
              </p>
              <p className="text-sm text-green-600">Ready for deployment</p>
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Deployed Resources
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {deployedResources.length}
              </p>
              <p className="text-sm text-blue-600">Currently in action</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Active Emergencies */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Active Emergencies
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {activeEmergencies.length > 0 ? (
            activeEmergencies.map((emergency) => (
              <div key={emergency.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">
                      {getEmergencyIcon(emergency.type)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {emergency.type.toUpperCase()} EMERGENCY
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                            emergency.severity
                          )}`}
                        >
                          {emergency.severity}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            emergency.status
                          )}`}
                        >
                          {emergency.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {emergency.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>📍 {emergency.location}</span>
                        <span>
                          🕒 {new Date(emergency.timestamp).toLocaleString()}
                        </span>
                        <span>👤 Reported by: {emergency.reportedBy}</span>
                        {emergency.assignedTeam && (
                          <span>🚑 {emergency.assignedTeam}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedEmergency(emergency)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                    >
                      View Details
                    </button>
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No active emergencies at this time
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Contacts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Emergency Contacts
            </h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {contacts.map((contact) => (
              <div key={contact.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {contact.name}
                    </h4>
                    <p className="text-sm text-gray-600">{contact.role}</p>
                    <p className="text-xs text-gray-500">
                      {contact.specialization}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        contact.status
                      )}`}
                    >
                      {contact.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {contact.phone}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Resources */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Emergency Resources
            </h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {resources.map((resource) => (
              <div key={resource.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {resource.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {resource.type.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">{resource.location}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        resource.status
                      )}`}
                    >
                      {resource.status}
                    </span>
                    {resource.capacity && (
                      <p className="text-xs text-gray-500 mt-1">
                        {resource.currentLoad}/{resource.capacity} capacity
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Detail Modal */}
      {selectedEmergency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="mr-2">
                    {getEmergencyIcon(selectedEmergency.type)}
                  </span>
                  Emergency Details
                </h3>
                <button
                  onClick={() => setSelectedEmergency(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <p className="text-sm text-gray-900 capitalize">
                      {selectedEmergency.type}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Severity
                    </label>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                        selectedEmergency.severity
                      )}`}
                    >
                      {selectedEmergency.severity}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedEmergency.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedEmergency.location}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reported By
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedEmergency.reportedBy}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Timestamp
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedEmergency.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedEmergency.status
                      )}`}
                    >
                      {selectedEmergency.status}
                    </span>
                  </div>
                </div>

                {selectedEmergency.assignedTeam && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Assigned Team
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedEmergency.assignedTeam}
                    </p>
                  </div>
                )}

                {selectedEmergency.responseTime && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Response Time
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedEmergency.responseTime} minutes
                    </p>
                  </div>
                )}

                {selectedEmergency.coordinates && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Coordinates
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedEmergency.coordinates.lat},{" "}
                      {selectedEmergency.coordinates.lng}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6 pt-4 border-t">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Update Status
                </button>
                <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Assign Team
                </button>
                <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                  View Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Emergency Form Modal */}
      {showNewEmergencyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Report Emergency
                </h3>
                <button
                  onClick={() => setShowNewEmergencyForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Type
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    title="Select emergency type"
                    aria-label="Emergency type"
                  >
                    <option value="">Select Type</option>
                    <option value="medical">Medical Emergency</option>
                    <option value="fire">Fire Emergency</option>
                    <option value="security">Security Issue</option>
                    <option value="crowd">Crowd Control</option>
                    <option value="weather">Weather Emergency</option>
                    <option value="technical">Technical Failure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity Level
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    title="Select severity level"
                    aria-label="Severity level"
                  >
                    <option value="">Select Severity</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Exact location of emergency"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Detailed description of the emergency"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reporter Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowNewEmergencyForm(false)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Report Emergency
                </button>
                <button
                  onClick={() => setShowNewEmergencyForm(false)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyTab;
