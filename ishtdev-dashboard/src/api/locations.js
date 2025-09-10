const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getLocations() {
  const res = await fetch(`${API}/locations`);
  if (!res.ok) throw new Error("Failed to fetch locations");
  return res.json();
}

export async function getLocationById(id) {
  const res = await fetch(`${API}/locations/${id}`);
  if (!res.ok) throw new Error("Failed to fetch location");
  return res.json();
}

export async function createLocation(data) {
  const res = await fetch(`${API}/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create location");
  return res.json();
}

export async function updateLocation(id, data) {
  const res = await fetch(`${API}/locations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update location");
  return res.json();
}

export async function deleteLocation(id) {
  const res = await fetch(`${API}/locations/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete location");
  return res.json();
}
