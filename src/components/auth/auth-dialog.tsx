// src/components/auth/auth-dialog.tsx
"use client";

import { useState } from "react";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import { MainAuthView } from "./main-auth-view";
import { useRouter } from "next/navigation";

interface AuthDialogProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AuthDialog({
  defaultOpen = false,
  onOpenChange,
}: AuthDialogProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [currentView, setCurrentView] = useState<"main" | "login" | "register">(
    "main"
  );
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };
  const handleAuthSuccess = () => {
    handleOpenChange(false);
    router.refresh(); // Refresh the page to update session state
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-3xl flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-lg">
        {currentView === "main" && (
          <MainAuthView
            onLoginClick={() => setCurrentView("login")}
            onRegisterClick={() => setCurrentView("register")}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {currentView === "login" && (
          <LoginForm
            onBack={() => setCurrentView("main")}
            onRegisterClick={() => setCurrentView("register")}
            onSuccess={handleAuthSuccess}
          />
        )}

        {currentView === "register" && (
          <RegisterForm
            onBack={() => setCurrentView("main")}
            onLoginClick={() => setCurrentView("login")}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </div>
  );
}
