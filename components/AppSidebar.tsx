"use client";

import {
  ChartColumnIncreasing,
  Croissant,
  Home,
  ScrollText,
  Settings,
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
import { usePathname } from "next/navigation"; // Import for checking active path
import Link from "next/link";

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
  {
    title: "Settings",
    url: "/auth/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [isComponentReady, setIsComponentReady] = useState(false);
  const pathname = usePathname(); // Get current path

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
          <SidebarGroupLabel
            style={{ marginBottom: isComponentReady ? "16px" : "" }}
          >
            JU&AI Bakeshop Inventory System
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
