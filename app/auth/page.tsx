import { redirect } from "next/navigation";

export default function AuthenticatedHome() {
  redirect("/auth/dashboard");
}
