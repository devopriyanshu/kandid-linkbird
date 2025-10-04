"use client";

import { useState } from "react";
import Header from "./header";
import { Sidebar } from "./sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header isCollapsed={isCollapsed} onToggleSidebar={toggleSidebar} />
        <main className="p-6 overflow-auto bg-gray-50 flex-1">{children}</main>
      </div>
    </div>
  );
}
