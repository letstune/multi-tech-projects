"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Overview", href: "/dashboard", icon: "📊" },
  { name: "Crowd", href: "/dashboard/crowd", icon: "👥" },
  { name: "Locations", href: "/dashboard/locations", icon: "📍" },
  { name: "Routes", href: "/dashboard/routes", icon: "🛣️" },
  { name: "Lost & Found", href: "/dashboard/lostfound", icon: "🔍" },
  { name: "Alerts", href: "/dashboard/alerts", icon: "🚨" },
];

const Tabs = () => {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-blue-100 text-blue-800 font-semibold"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Tabs;
