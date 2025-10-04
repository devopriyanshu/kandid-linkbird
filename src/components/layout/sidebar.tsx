"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  MessageSquare,
  Users,
  Target,
  BarChart3,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Leads", path: "/leads" },
    { icon: Target, label: "Campaign", path: "/campaign" },
    { icon: MessageSquare, label: "Messages", path: "/messages", badge: "19" },
    { icon: Users, label: "LinkedIn Accounts", path: "/linkedin-accounts" },
  ];

  const settingsItems = [
    { icon: Settings, label: "Setting & Billing", path: "/settings" },
  ];

  const adminItems = [
    { icon: BarChart3, label: "Activity logs", path: "/admin/activity-logs" },
    { icon: Users, label: "User logs", path: "/admin/user-logs" },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-100">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">LB</span>
            </div>
            <span className="font-semibold text-lg">LinkBird</span>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">LB</span>
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium">PE</span>
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">Kandid</div>
              <div className="text-xs text-gray-500">Personal</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 px-2 py-4">
        {/* Overview Section */}
        <div className="mb-6">
          {!isCollapsed && (
            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Overview
            </div>
          )}
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  pathname === item.path
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon className="w-4 h-4" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Section */}
        <div className="mb-6">
          {!isCollapsed && (
            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Settings
            </div>
          )}
          <nav className="space-y-1">
            {settingsItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                  isCollapsed ? "justify-center" : ""
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon className="w-4 h-4" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Admin Panel Section */}
        <div>
          {!isCollapsed && (
            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Admin Panel
            </div>
          )}
          <nav className="space-y-1">
            {adminItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                  isCollapsed ? "justify-center" : ""
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon className="w-4 h-4" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">BK</span>
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">Bhavya From Kand...</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                bhavya@kandid.ai
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
};
