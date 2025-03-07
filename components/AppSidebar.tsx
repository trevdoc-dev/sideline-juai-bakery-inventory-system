"use client";

import {
  ChartColumnIncreasing,
  Croissant,
  Home,
  ScrollText,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar";
import Image from "next/image";
import JUAILogo from "../public/images/juai-logo.png";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Get current path
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider"; // Import auth hook

// Menu items.
const items = [
  {
    title: "Home",
    url: "/auth/dashboard",
    icon: Home,
  },
  {
    title: "Ingredients",
    url: "/auth/ingredients",
    icon: ScrollText,
  },
  {
    title: "Breads",
    url: "/auth/breads",
    icon: Croissant,
  },
  {
    title: "Sales Report",
    url: "/auth/sales-report",
    icon: ChartColumnIncreasing,
  },
];

export function AppSidebar() {
  const [isComponentReady, setIsComponentReady] = useState(false);
  const pathname = usePathname(); // Get current path
  const { logout } = useAuth(); // Get logout function

  useEffect(() => {
    setIsComponentReady(true);
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <Image
            alt="JU&AI Bakeshop Inventory System LOGO"
            src={JUAILogo}
            className="mx-auto h-44 w-auto"
            style={{ marginBottom: isComponentReady ? "16px" : "" }}
            priority
          />
          <SidebarGroupLabel className="text-sm font-bold mx-auto">
            JU&AI Bakeshop
          </SidebarGroupLabel>
          <SidebarGroupLabel
            style={{ marginBottom: isComponentReady ? "16px" : "" }}
            className="text-sm font-bold mx-auto -translate-y-3"
          >
            Inventory System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url; // Check if current page matches

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                          isActive
                            ? "bg-gray-200 text-gray-900 font-bold"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 ${
                            isActive ? "text-gray-900" : "text-gray-500"
                          }`}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* Settings */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/auth/settings"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                      pathname === "/auth/settings"
                        ? "bg-gray-200 text-gray-900 font-bold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Settings
                      className={`h-5 w-5 ${
                        pathname === "/auth/settings"
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}
                    />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Logout Button */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-red-600 hover:bg-red-100"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
