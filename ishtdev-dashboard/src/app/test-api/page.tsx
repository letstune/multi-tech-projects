"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";

interface TestResult {
  status: number;
  success: boolean;
  data?: unknown;
  error?: string;
  url: string;
}

type TestResults = Record<string, TestResult>;

export default function TestAPIPage() {
  const [results, setResults] = useState<TestResults>({});
  const [loading, setLoading] = useState(false);

  const testEndpoints = useMemo(() => [
    { name: "Test Endpoint", url: "/test" },
    { name: "Locations", url: "/locations" },
    { name: "Routes", url: "/routes" },
    { name: "Crowd Data", url: "/crowd" },
    { name: "Crowd Realtime", url: "/crowd/realtime" },
    { name: "Mobile Locations", url: "/mobile/locations" },
  ], []);

  const testAPI = async (endpoint: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const fullUrl = `${apiUrl}${endpoint}`;
    
    console.log(`Testing: ${fullUrl}`);
    
    try {
      const response = await fetch(fullUrl);
      const data = await response.json();
      
      return {
        status: response.status,
        success: response.ok,
        data: data,
        url: fullUrl
      };
    } catch (error) {
      return {
        status: 0,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        url: fullUrl
      };
    }
  };

  const runAllTests = useCallback(async () => {
    setLoading(true);
    const testResults: TestResults = {};

    for (const endpoint of testEndpoints) {
      console.log(`Testing ${endpoint.name}...`);
      testResults[endpoint.name] = await testAPI(endpoint.url);
    }

    setResults(testResults);
    setLoading(false);
  }, [testEndpoints]);

  useEffect(() => {
    runAllTests();
  }, [runAllTests]);

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">🔧 API Connection Test</h1>
        
        <div className="mb-4">
          <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        </div>

        <button
          type="button"
          onClick={runAllTests}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-6 hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "🔄 Run Tests Again"}
        </button>

        <div className="space-y-4">
          {testEndpoints.map((endpoint) => {
            const result = results[endpoint.name];
            
            return (
              <div
                key={endpoint.name}
                className={`border rounded-lg p-4 ${
                  result?.success
                    ? "border-green-500 bg-green-50"
                    : result?.success === false
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{endpoint.name}</h3>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      result?.success
                        ? "bg-green-200 text-green-800"
                        : result?.success === false
                        ? "bg-red-200 text-red-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {result?.success ? "✅ Success" : result?.success === false ? "❌ Failed" : "⏳ Testing..."}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  <strong>URL:</strong> {result?.url || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}${endpoint.url}`}
                </p>
                
                {result?.status && (
                  <p className="text-sm mb-2">
                    <strong>Status:</strong> {result.status}
                  </p>
                )}
                
                {result?.error && (
                  <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded text-sm">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
                
                {result?.data !== undefined && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium">View Response Data</summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">🔍 Troubleshooting Tips:</h3>
          <ul className="text-sm space-y-1">
            <li>• Make sure backend server is running on port 5000</li>
            <li>• Check CORS configuration in backend</li>
            <li>• Verify environment variables are loaded</li>
            <li>• Check browser console for additional errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
