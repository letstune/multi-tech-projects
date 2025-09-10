const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getRoutes() {
  const res = await fetch(`${API}/routes`);
  if (!res.ok) throw new Error("Failed to fetch routes");
  return res.json();
}

export async function getRouteById(id) {
  const res = await fetch(`${API}/routes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch route");
  return res.json();
}

export async function createOrUpdateRoute(data) {
  const res = await fetch(`${API}/routes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create/update route");
  return res.json();
}

export async function updateRouteStatus(routeId, status, liveMessage) {
  const res = await fetch(`${API}/routes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      _id: routeId,
      status,
      liveMessage,
      updatedAt: new Date()
    }),
  });
  if (!res.ok) throw new Error("Failed to update route status");
  return res.json();
}

export async function simulateRouteUpdate(routeId) {
  const statuses = ["open", "congested", "closed"];
  const messages = {
    open: "Traffic flowing normally",
    congested: "Heavy traffic, expect delays",
    closed: "Route temporarily closed"
  };

  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  return updateRouteStatus(routeId, randomStatus, messages[randomStatus]);
}

export async function getDirections(fromLat, fromLng, toLat, toLng) {
  // Try OpenRouteService first
  const orsApiKey = process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY;

  if (orsApiKey) {
    try {
      const orsResponse = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsApiKey}&start=${fromLng},${fromLat}&end=${toLng},${toLat}`
      );
      if (orsResponse.ok) {
        const orsData = await orsResponse.json();
        return { data: orsData };
      }
    } catch (error) {
      console.warn("OpenRouteService failed, trying backend:", error);
    }
  }

  // Fallback to backend
  const res = await fetch(
    `${API}/routes/track?fromLat=${fromLat}&fromLng=${fromLng}&toLat=${toLat}&toLng=${toLng}`
  );
  if (!res.ok) throw new Error("Failed to get directions");
  return res.json();
}
