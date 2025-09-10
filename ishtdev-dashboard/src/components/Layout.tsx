"use client";

import { ReactNode } from "react";
import Tabs from "./Tabs";
import DemoMapView from "./DemoMapView";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-900 text-white p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Real-time Monitoring System</span>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
          <Tabs />
        </aside>
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Demo MapView always visible at top */}
          <div className="mb-6">
            <DemoMapView />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
