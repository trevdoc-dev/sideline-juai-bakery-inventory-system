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
        <div className="m-8 w-[70%]">{children}</div>
      </SidebarProvider>
    </AuthGuard>
  );
}
