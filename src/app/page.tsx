import type { ReactNode } from "react";
import AppShell from "@/components/layout/app-shell";
import AuthDialog from "@/components/auth/auth-dialog";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="relative min-h-screen">
        {/* Blurred AppShell in background */}
        <div className="blur-sm pointer-events-none select-none">
          <AppShell>
            <div className="p-8 space-y-6">
              {/* Mock dashboard content to show in background */}
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="h-32 bg-gray-100 rounded-lg"></div>
                  <div className="h-32 bg-gray-100 rounded-lg"></div>
                  <div className="h-32 bg-gray-100 rounded-lg"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-64 bg-gray-100 rounded-lg"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-48 bg-gray-100 rounded-lg"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-48 bg-gray-100 rounded-lg"></div>
                </div>
              </div>
            </div>
          </AppShell>
        </div>

        {/* Auth Dialog Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <AuthDialog defaultOpen />
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
