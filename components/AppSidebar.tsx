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

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Ingredients",
    url: "/ingredients",
    icon: ScrollText,
  },
  {
    title: "Breads",
    url: "/breads",
    icon: Croissant,
  },
  {
    title: "Sales Report",
    url: "/sales-report",
    icon: ChartColumnIncreasing,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [isComponentReady, setIsComponentReady] = useState(false);

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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
