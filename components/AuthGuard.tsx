"use client";

import { useAuth } from "@/context/AuthProvider";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthLoaded } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isAuthLoaded) {
      if (!user) {
        router.replace("/login");
      }
      setIsChecking(false);
    }
  }, [user, isAuthLoaded, router]);

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderCircle className="h-12 w-12 animate-spin text-gray-600" />
      </div>
    );
  }

  return <>{children}</>;
}
