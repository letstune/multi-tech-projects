const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getTimingHistory(devoteeId) {
  const res = await fetch(`${API}/timing/history/${devoteeId}`);
  if (!res.ok) throw new Error("Failed to fetch devotee timing history");
  return res.json();
}

export async function logEntry(data) {
  const res = await fetch(`${API}/timing/entry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to log entry");
  return res.json();
}

export async function logExit(data) {
  const res = await fetch(`${API}/timing/exit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to log exit");
  return res.json();
}

export async function getOverstayAlerts() {
  const res = await fetch(`${API}/timing/alerts`);
  if (!res.ok) throw new Error("Failed to fetch overstay alerts");
  return res.json();
}
