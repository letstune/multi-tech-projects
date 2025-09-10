"use client";

import React, { useEffect, useState } from "react";
import {
  getRealtimeCrowd,
  getCrowdPrediction,
  getCrowdAlerts,
  uploadCrowdData,
  simulateEmergency,
} from "@/api/crowd";

type RealtimeZone = {
  _id: string;
  name: string;
  type: string;
  currentOccupancy: number;
  capacity: number;
  crowdLevel: string;
  updatedAt?: string;
};

type Prediction = {
  location: string;
  predictedLevel: string;
  time: string;
  message: string;
};

type CrowdAlert = {
  _id?: string;
  locationId?: string;
  crowdLevel?: string;
  timestamp?: string;
};

export default function CrowdTab() {
  const [realtime, setRealtime] = useState<RealtimeZone[]>([]);
  const [prediction, setPrediction] = useState<Prediction[]>([]);
  const [alerts, setAlerts] = useState<CrowdAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({
    locationId: "",
    currentOccupancy: "",
    crowdLevel: "low",
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([getRealtimeCrowd(), getCrowdPrediction(), getCrowdAlerts()])
      .then(([r, p, a]) => {
        setRealtime(r.data);
        setPrediction(p.data);
        setAlerts(a.data);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : String(err))
      )
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async () => {
    try {
      await uploadCrowdData({
        ...form,
        currentOccupancy: parseInt(form.currentOccupancy, 10),
      });
      setForm({ locationId: "", currentOccupancy: "", crowdLevel: "low" });
      // Refresh real-time data
      getRealtimeCrowd().then((r) => setRealtime(r.data));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleSimulateEmergency = async () => {
    try {
      await simulateEmergency({ location: "Main Temple" });
      alert("Emergency simulation triggered!");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="text-black p-4">
      <h2>Crowd Monitoring</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpload();
        }}
      >
        <input
          value={form.locationId}
          onChange={(e) => setForm({ ...form, locationId: e.target.value })}
          placeholder="Location ID"
          required
        />
        <input
          type="number"
          value={form.currentOccupancy}
          onChange={(e) =>
            setForm({ ...form, currentOccupancy: e.target.value })
          }
          placeholder="Current Occupancy"
          required
        />
        <select
          value={form.crowdLevel}
          onChange={(e) => setForm({ ...form, crowdLevel: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <button type="submit">Upload Crowd Data</button>
      </form>
      <button onClick={handleSimulateEmergency}>Simulate Emergency</button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h3>Real-Time Crowd</h3>
          <ul>
            {realtime.map((zone) => (
              <li key={zone._id}>
                {zone.name} ({zone.type}) - {zone.currentOccupancy}/
                {zone.capacity} - Level: {zone.crowdLevel}
              </li>
            ))}
          </ul>
          <h3>AI Prediction</h3>
          <ul>
            {prediction.map((pred, idx) => (
              <li key={idx}>
                {pred.location} - Predicted: {pred.predictedLevel} at{" "}
                {new Date(pred.time).toLocaleTimeString()}
                <br />
                {pred.message}
              </li>
            ))}
          </ul>
          <h3>Alerts</h3>
          <ul>
            {alerts.map((alert, idx) => (
              <li key={alert._id || alert.locationId || idx}>
                {alert.locationId || alert._id} - Level: {alert.crowdLevel} -{" "}
                {alert.timestamp && new Date(alert.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
