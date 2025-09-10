const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getRealtimeCrowd() {
  const res = await fetch(`${API}/crowd/realtime`);
  if (!res.ok) throw new Error("Failed to fetch real-time crowd data");
  return res.json();
}

export async function getCrowdPrediction() {
  const res = await fetch(`${API}/crowd/prediction`);
  if (!res.ok) throw new Error("Failed to fetch crowd prediction");
  return res.json();
}

export async function getCrowdAlerts() {
  const res = await fetch(`${API}/crowd/alerts`);
  if (!res.ok) throw new Error("Failed to fetch crowd alerts");
  return res.json();
}

export async function uploadCrowdData(data) {
  const res = await fetch(`${API}/crowd`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to upload crowd data");
  return res.json();
}

export async function simulateEmergency(data) {
  const res = await fetch(`${API}/crowd/simulate-emergency`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to simulate emergency");
  return res.json();
}
