const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getSettings() {
  const res = await fetch(`${API}/settings`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function createSetting(data) {
  const res = await fetch(`${API}/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create setting");
  return res.json();
}

export async function updateSetting(key, data) {
  const res = await fetch(`${API}/settings/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update setting");
  return res.json();
}

export async function bulkUpdateSettings(settings) {
  const res = await fetch(`${API}/settings/bulk`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings }),
  });
  if (!res.ok) throw new Error("Failed to bulk update settings");
  return res.json();
}

export async function deleteSetting(key) {
  const res = await fetch(`${API}/settings/${key}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete setting");
  return res.json();
}
