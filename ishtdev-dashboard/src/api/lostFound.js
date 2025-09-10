const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getLostFound() {
  const res = await fetch(`${API}/lost-found`);
  if (!res.ok) throw new Error("Failed to fetch lost & found items");
  return res.json();
}

export async function reportLostFound(data) {
  const res = await fetch(`${API}/lost-found/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to report lost & found");
  return res.json();
}

export async function matchLostFound(imageUrl) {
  const res = await fetch(
    `${API}/lost-found/match?imageUrl=${encodeURIComponent(imageUrl)}`
  );
  if (!res.ok) throw new Error("Failed to match lost & found");
  return res.json();
}

export async function getLostFoundHistory(reporter) {
  const res = await fetch(
    `${API}/lost-found/history?reporter=${encodeURIComponent(reporter)}`
  );
  if (!res.ok) throw new Error("Failed to fetch lost & found history");
  return res.json();
}

export async function resolveLostFound(id) {
  const res = await fetch(`${API}/lost-found/${id}/resolve`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to resolve lost & found");
  return res.json();
}
