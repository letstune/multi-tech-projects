"use client";

import React, { useEffect, useState } from "react";
import {
  getLostFound,
  reportLostFound,
  resolveLostFound,
} from "@/api/lostFound";

interface LostFoundItem {
  _id: string;
  type: "lost" | "found";
  item: string;
  description?: string;
  status: "open" | "claimed" | "resolved";
  location: string;
  coordinates?: { lat?: number; lng?: number };
  reporter?: string;
  imageUrl?: string;
  reportedAt: string;
}

export default function LostFoundTab() {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    type: "lost" as "lost" | "found",
    item: "",
    description: "",
    location: "",
    coordinates: { lat: "", lng: "" },
    reporter: "",
  });

  useEffect(() => {
    setLoading(true);
    getLostFound()
      .then((res) => setItems(res.data || []))
      .catch((err) =>
        setError(err instanceof Error ? err.message : String(err))
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        coordinates: {
          lat: parseFloat(form.coordinates.lat) || 25.4358,
          lng: parseFloat(form.coordinates.lng) || 81.8463,
        },
      };
      const res = await reportLostFound(data);
      setItems((prev) => [res.data, ...prev]);
      setForm({
        type: "lost",
        item: "",
        description: "",
        location: "",
        coordinates: { lat: "", lng: "" },
        reporter: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await resolveLostFound(id);
      setItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "resolved" as const } : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const safeCoordinates = (coords?: { lat?: number; lng?: number }) => {
    if (
      !coords ||
      typeof coords.lat !== "number" ||
      typeof coords.lng !== "number"
    ) {
      return "N/A";
    }
    return `${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}`;
  };

  return (
    <div className="p-6 text-black  ">
      <h2 className="text-2xl font-bold mb-6">Lost & Found</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Report Form */}
      <div className="bg-white text-black p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Report Lost/Found Item</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as "lost" | "found" })
                }
                className="w-full p-2 border rounded-md"
                required
                title="Select item type"
                aria-label="Item type (lost or found)"
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Item</label>
              <input
                type="text"
                value={form.item}
                onChange={(e) => setForm({ ...form, item: e.target.value })}
                placeholder="e.g., Wallet, Phone, Keys"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Detailed description..."
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g., Main Ghat, Food Court"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Reporter Name
              </label>
              <input
                type="text"
                value={form.reporter}
                onChange={(e) => setForm({ ...form, reporter: e.target.value })}
                placeholder="Your name"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Latitude (optional)
              </label>
              <input
                type="number"
                value={form.coordinates.lat}
                onChange={(e) =>
                  setForm({
                    ...form,
                    coordinates: { ...form.coordinates, lat: e.target.value },
                  })
                }
                placeholder="25.4358"
                className="w-full p-2 border rounded-md"
                step="any"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Longitude (optional)
              </label>
              <input
                type="number"
                value={form.coordinates.lng}
                onChange={(e) =>
                  setForm({
                    ...form,
                    coordinates: { ...form.coordinates, lng: e.target.value },
                  })
                }
                placeholder="81.8463"
                className="w-full p-2 border rounded-md"
                step="any"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Report Item
          </button>
        </form>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            All Reports ({items.length})
          </h3>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            item.type === "lost"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.type.toUpperCase()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            item.status === "open"
                              ? "bg-yellow-100 text-yellow-800"
                              : item.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-medium">{item.item}</h4>
                      {item.description && (
                        <p className="text-gray-600 text-sm mt-1">
                          {item.description}
                        </p>
                      )}
                      <div className="text-sm text-gray-500 mt-2">
                        <p>Location: {item.location}</p>
                        <p>Coordinates: {safeCoordinates(item.coordinates)}</p>
                        <p>Reporter: {item.reporter || "Anonymous"}</p>
                        <p>
                          Reported: {new Date(item.reportedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      {item.status === "open" && (
                        <button
                          onClick={() => handleResolve(item._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No lost & found reports yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
