const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getAlerts() {
  const res = await fetch(`${API}/alerts`);
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
}

export async function createAlert(data) {
  const res = await fetch(`${API}/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create alert");
  return res.json();
}

export async function updateAlert(id, data) {
  const res = await fetch(`${API}/alerts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update alert");
  return res.json();
}

export async function acknowledgeAlert(id) {
  const res = await fetch(`${API}/alerts/${id}/acknowledge`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to acknowledge alert");
  return res.json();
}

export async function resolveAlert(id) {
  const res = await fetch(`${API}/alerts/${id}/resolve`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to resolve alert");
  return res.json();
}

export async function escalateAlert(id) {
  const res = await fetch(`${API}/alerts/${id}/escalate`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to escalate alert");
  return res.json();
}

export async function getAlertStats() {
  const res = await fetch(`${API}/alerts/stats/summary`);
  if (!res.ok) throw new Error("Failed to fetch alert stats");
  return res.json();
}
