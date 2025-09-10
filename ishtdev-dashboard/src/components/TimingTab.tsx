"use client";

import React, { useEffect, useState } from "react";
import {
  getTimingHistory,
  logEntry,
  logExit,
  getOverstayAlerts,
} from "@/api/timing";

interface TimingRecord {
  _id: string;
  devoteeId: string;
  zone: string;
  entryTime: string;
  exitTime?: string;
  durationMinutes?: number;
  overstay: boolean;
  alertSent: boolean;
}

interface OverstayAlert {
  _id: string;
  devoteeId: string;
  zone: string;
  durationMinutes: number;
  entryTime: string;
}

export default function TimingTab() {
  const [timingRecords, setTimingRecords] = useState<TimingRecord[]>([]);
  const [overstayAlerts, setOverstayAlerts] = useState<OverstayAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    devoteeId: "",
    zone: "",
    action: "entry" as "entry" | "exit",
  });

  useEffect(() => {
    setLoading(true);
    getOverstayAlerts()
      .then((res) => {
        setOverstayAlerts(res.data || []);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : String(err))
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { devoteeId: form.devoteeId, zone: form.zone };

      if (form.action === "entry") {
        await logEntry(data);
      } else {
        await logExit(data);
      }

      setForm({ devoteeId: "", zone: "", action: "entry" });

      // Refresh alerts
      getOverstayAlerts().then((res) => setOverstayAlerts(res.data || []));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const loadDevoteeHistory = async (devoteeId: string) => {
    try {
      const res = await getTimingHistory(devoteeId);
      setTimingRecords(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Devotee Timing Tracker</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Entry/Exit Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Log Entry/Exit</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Devotee ID
              </label>
              <input
                type="text"
                value={form.devoteeId}
                onChange={(e) =>
                  setForm({ ...form, devoteeId: e.target.value })
                }
                placeholder="Enter devotee ID"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Zone</label>
              <select
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Zone</option>
                <option value="Snan Ghat">Snan Ghat</option>
                <option value="Main Temple">Main Temple</option>
                <option value="Food Court">Food Court</option>
                <option value="Parking Area">Parking Area</option>
                <option value="Security Check">Security Check</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Action</label>
              <select
                value={form.action}
                onChange={(e) =>
                  setForm({
                    ...form,
                    action: e.target.value as "entry" | "exit",
                  })
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="entry">Entry</option>
                <option value="exit">Exit</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Log {form.action === "entry" ? "Entry" : "Exit"}
          </button>
        </form>
      </div>

      {/* Overstay Alerts */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Overstay Alerts ({overstayAlerts.length})
        </h3>
        {loading ? (
          <div className="text-center py-4">Loading alerts...</div>
        ) : overstayAlerts.length > 0 ? (
          <div className="space-y-3">
            {overstayAlerts.map((alert) => (
              <div
                key={alert._id}
                className="bg-red-50 border border-red-200 p-3 rounded"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-red-800">
                      Devotee {alert.devoteeId} - {alert.zone}
                    </h4>
                    <p className="text-sm text-red-600">
                      Duration: {alert.durationMinutes} minutes
                    </p>
                    <p className="text-sm text-red-600">
                      Entry: {new Date(alert.entryTime).toLocaleString()}
                    </p>
                  </div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                    OVERSTAY
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No overstay alerts
          </div>
        )}
      </div>

      {/* Devotee History Lookup */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Devotee History</h3>
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter devotee ID to view history"
              className="flex-1 p-2 border rounded-md"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const target = e.target as HTMLInputElement;
                  if (target.value.trim()) {
                    loadDevoteeHistory(target.value.trim());
                  }
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector(
                  'input[placeholder*="devotee ID"]'
                ) as HTMLInputElement;
                if (input?.value.trim()) {
                  loadDevoteeHistory(input.value.trim());
                }
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Load History
            </button>
          </div>
        </div>

        {timingRecords.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Timing Records:</h4>
            {timingRecords.map((record) => (
              <div key={record._id} className="border p-3 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{record.zone}</p>
                    <p className="text-sm text-gray-600">
                      Entry: {new Date(record.entryTime).toLocaleString()}
                    </p>
                    {record.exitTime && (
                      <p className="text-sm text-gray-600">
                        Exit: {new Date(record.exitTime).toLocaleString()}
                      </p>
                    )}
                    {record.durationMinutes && (
                      <p className="text-sm text-gray-600">
                        Duration: {record.durationMinutes} minutes
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {record.overstay && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                        OVERSTAY
                      </span>
                    )}
                    {!record.exitTime && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
