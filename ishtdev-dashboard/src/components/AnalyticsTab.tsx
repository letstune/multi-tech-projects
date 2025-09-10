"use client";

import React, { useState, useEffect, useMemo } from "react";

interface AnalyticsData {
  totalDevotees: number;
  avgWaitTime: number;
  peakHours: { hour: number; count: number }[];
  locationStats: { name: string; visits: number; avgTime: number }[];
  safetyIncidents: number;
  crowdPrediction: { time: string; prediction: number }[];
  performanceMetrics: {
    responseTime: number;
    systemUptime: number;
    dataAccuracy: number;
    userSatisfaction: number;
  };
}

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");

  const getChartHeightClass = (percentage: number): string => {
    const rounded = Math.round(percentage / 10) * 10; // Round to nearest 10
    if (rounded <= 10) return "chart-height-10";
    if (rounded <= 20) return "chart-height-20";
    if (rounded <= 30) return "chart-height-30";
    if (rounded <= 40) return "chart-height-40";
    if (rounded <= 50) return "chart-height-50";
    if (rounded <= 60) return "chart-height-60";
    if (rounded <= 70) return "chart-height-70";
    if (rounded <= 80) return "chart-height-80";
    if (rounded <= 90) return "chart-height-90";
    return "chart-height-100";
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

  // Mock analytics data - memoized to prevent dependency issues
  const mockAnalytics: AnalyticsData = useMemo(() => ({
    totalDevotees: 45672,
    avgWaitTime: 18,
    peakHours: [
      { hour: 6, count: 2500 },
      { hour: 7, count: 4200 },
      { hour: 8, count: 3800 },
      { hour: 9, count: 5100 },
      { hour: 10, count: 4900 },
      { hour: 11, count: 3200 },
      { hour: 12, count: 2800 },
      { hour: 17, count: 4800 },
      { hour: 18, count: 5200 },
      { hour: 19, count: 3900 },
    ],
    locationStats: [
      { name: "Main Bathing Ghat", visits: 15420, avgTime: 25 },
      { name: "Puja Kendra Central", visits: 12850, avgTime: 32 },
      { name: "Medical Center", visits: 2140, avgTime: 8 },
      { name: "Food Court A", visits: 8920, avgTime: 15 },
      { name: "Rest Zone 1", visits: 6342, avgTime: 45 },
    ],
    safetyIncidents: 3,
    crowdPrediction: [
      { time: "06:00", prediction: 2500 },
      { time: "07:00", prediction: 4200 },
      { time: "08:00", prediction: 3800 },
      { time: "09:00", prediction: 5100 },
      { time: "10:00", prediction: 4900 },
      { time: "11:00", prediction: 3200 },
      { time: "12:00", prediction: 2800 },
    ],
    performanceMetrics: {
      responseTime: 0.8,
      systemUptime: 99.9,
      dataAccuracy: 98.5,
      userSatisfaction: 4.7,
    },
  }), []);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(mockAnalytics);
      setIsLoading(false);
    }, 1000);
  }, [selectedTimeframe, mockAnalytics]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Analytics & Reports
        </h2>
        <div className="flex space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
            title="Select time period"
            aria-label="Time period selection"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Devotees
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {formatNumber(analyticsData.totalDevotees)}
              </p>
              <p className="text-sm text-green-600">↑ 15% from yesterday</p>
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
              <p className="text-3xl font-bold text-orange-600">
                {analyticsData.avgWaitTime}min
              </p>
              <p className="text-sm text-red-600">↑ 2min from yesterday</p>
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Safety Incidents
              </p>
              <p className="text-3xl font-bold text-red-600">
                {analyticsData.safetyIncidents}
              </p>
              <p className="text-sm text-green-600">↓ 2 from yesterday</p>
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
              <p className="text-sm font-medium text-gray-600">System Uptime</p>
              <p className="text-3xl font-bold text-green-600">
                {analyticsData.performanceMetrics.systemUptime}%
              </p>
              <p className="text-sm text-green-600">Excellent performance</p>
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Peak Hours Analysis
          </h3>
          <div className="h-64">
            <div className="flex items-end justify-between h-full">
              {analyticsData.peakHours.map((hour, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`bg-blue-500 w-6 rounded-t min-h-[8px] ${getChartHeightClass(
                      (hour.count / 5200) * 100
                    )}`}
                  ></div>
                  <span className="text-xs text-gray-600 mt-1">
                    {String(hour.hour).padStart(2, "0")}:00
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Peak time: 18:00 with {formatNumber(5200)} devotees
          </p>
        </div>

        {/* Location Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Location Performance
          </h3>
          <div className="space-y-4">
            {analyticsData.locationStats.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{location.name}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{formatNumber(location.visits)} visits</span>
                    <span>{location.avgTime}min avg</span>
                  </div>
                </div>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-blue-500 h-2 rounded-full ${getProgressBarClass(
                      (location.visits / 15420) * 100
                    )}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crowd Prediction */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          AI-Powered Crowd Prediction
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-48 flex items-end justify-between">
              {analyticsData.crowdPrediction.map((prediction, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`bg-purple-500 w-8 rounded-t min-h-[12px] ${getChartHeightClass(
                      (prediction.prediction / 5100) * 100
                    )}`}
                  ></div>
                  <span className="text-xs text-gray-600 mt-1">
                    {prediction.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900">
                Next Peak Prediction
              </h4>
              <p className="text-2xl font-bold text-purple-700">
                09:00 - 10:00
              </p>
              <p className="text-sm text-purple-600">
                Expected: 5,100 devotees
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900">Recommended Action</h4>
              <p className="text-sm text-green-700">
                Deploy additional staff at Main Bathing Ghat
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Generated Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          AI-Generated Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-medium text-blue-900">Crowd Pattern</h4>
            <p className="text-sm text-blue-700 mt-1">
              Morning rush (7-9 AM) shows 23% increase compared to last week
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <h4 className="font-medium text-yellow-900">Optimization</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Redirecting crowd to Zone B could reduce wait time by 8 minutes
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h4 className="font-medium text-green-900">Efficiency</h4>
            <p className="text-sm text-green-700 mt-1">
              Medical response time improved by 40% with new deployment strategy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
