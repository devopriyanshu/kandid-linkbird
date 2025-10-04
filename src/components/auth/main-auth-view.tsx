// src/components/auth/main-auth-view.tsx
"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export const MainAuthView = ({
  onLoginClick,
  onRegisterClick,
  onAuthSuccess,
}: {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onAuthSuccess: () => void;
}) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });
      // The redirect will happen automatically, so we don't need to call onAuthSuccess here
    } catch (error) {
      console.error("Google auth failed:", error);
      alert("Google authentication failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="text-center pt-4">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Continue with an account
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        You must log in or register to continue.
      </p>

      {/* Google Button */}
      <button
        onClick={handleGoogleAuth}
        disabled={isGoogleLoading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="font-medium">Continue with Google</span>
      </button>

      {/* Email Login Button */}
      <button
        onClick={onLoginClick}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-6"
      >
        Login with Email
      </button>

      {/* Register Link */}
      <button
        onClick={onRegisterClick}
        className="text-gray-600 hover:text-gray-800 font-medium underline underline-offset-4"
      >
        New User? Create New Account
      </button>
    </div>
  );
};
