import { AppSidebar } from "../../components/AppSidebar";
import AuthGuard from "../../components/AuthGuard";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        {children}
      </SidebarProvider>
    </AuthGuard>
  );
}
