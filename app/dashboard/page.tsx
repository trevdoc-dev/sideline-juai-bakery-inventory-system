"use client";

import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthProvider";

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <AuthGuard>
      <div>
        <h1>Welcome to your dashboard!</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 mt-4"
        >
          Logout
        </button>
      </div>
    </AuthGuard>
  );
}
