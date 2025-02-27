"use client";

import LoginForm from "../../components/login/LoginForm";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/authenticated");
    }
  }, [user, router]);

  return (
    <div>
      <LoginForm />
    </div>
  );
}
