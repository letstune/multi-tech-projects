"use client";

import React, { useState, useEffect } from "react";

export default function ConnectionTest() {
  const [apiUrl, setApiUrl] = useState("");
  const [backendStatus, setBackendStatus] = useState("Testing...");
  const [locationsData, setLocationsData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check environment variable
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    console.log("Environment variable NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("Final API URL:", url);
    setApiUrl(url);

    // Test backend connection
    testBackendConnection(url);
  }, []);

  const testBackendConnection = async (url: string) => {
    try {
      console.log("Testing backend connection to:", url);
      
      // Test basic connection
      const testResponse = await fetch(`${url}/test`);
      console.log("Test response status:", testResponse.status);
      
      if (testResponse.ok) {
        const testData = await testResponse.json();
        console.log("Test response data:", testData);
        setBackendStatus("✅ Backend Connected");
        
        // Test locations endpoint
        const locationsResponse = await fetch(`${url}/locations`);
        console.log("Locations response status:", locationsResponse.status);
        
        if (locationsResponse.ok) {
          const locationsData = await locationsResponse.json();
          console.log("Locations data:", locationsData);
          setLocationsData(locationsData);
        } else {
          throw new Error(`Locations API failed: ${locationsResponse.status}`);
        }
      } else {
        throw new Error(`Backend test failed: ${testResponse.status}`);
      }
    } catch (err) {
      console.error("Connection test failed:", err);
      setBackendStatus("❌ Backend Connection Failed");
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const retryConnection = () => {
    setError("");
    setBackendStatus("Testing...");
    setLocationsData(null);
    testBackendConnection(apiUrl);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🔗 Frontend-Backend Connection Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="font-semibold">API URL:</label>
          <p className="text-blue-600">{apiUrl}</p>
        </div>
        
        <div>
          <label className="font-semibold">Backend Status:</label>
          <p className={backendStatus.includes("✅") ? "text-green-600" : "text-red-600"}>
            {backendStatus}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {locationsData && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>✅ Locations Data Received:</strong>
            <pre className="mt-2 text-sm overflow-auto">
              {JSON.stringify(locationsData, null, 2)}
            </pre>
          </div>
        )}
        
        <button
          onClick={retryConnection}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🔄 Retry Connection
        </button>
        
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <ul className="text-sm space-y-1">
            <li><strong>Frontend URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</li>
            <li><strong>Backend URL:</strong> {apiUrl}</li>
            <li><strong>Environment:</strong> {process.env.NODE_ENV}</li>
            <li><strong>CORS Origin:</strong> Expected from backend</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
