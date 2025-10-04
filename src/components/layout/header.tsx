"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ isCollapsed, onToggleSidebar }: HeaderProps) {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.refresh(); // rerun server components -> landing / auth dialog
  }

  return (
    <header className="flex items-center justify-between border-b px-6 py-3 bg-white">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="p-2"
        >
          {isCollapsed ? (
            <Menu className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </Button>
        <div className="text-sm text-muted-foreground">Dashboard</div>
      </div>
      <div>
        <Button variant="ghost" onClick={handleSignOut}>
          Logout
        </Button>
      </div>
    </header>
  );
}
