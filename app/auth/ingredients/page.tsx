"use client";

import { useAuth } from "@/context/AuthProvider";

export default function IngredientsPage() {
  const { logout } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Ingredients</h1>
      <p>Welcome to your dashboard!</p>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 mt-4">
        Logout
      </button>
    </div>
  );
}
