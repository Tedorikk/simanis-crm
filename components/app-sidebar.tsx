"use client";

import { Home, Map, MapPin, Contact, ChartCandlestick } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { clsx } from 'clsx'
import { usePathname } from 'next/navigation'

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Kelola Kontak",
    url: "/dashboard/contact",
    icon: Contact,
  },
  {
    title: "Kelola Paket Tur",
    url: "/dashboard/tour-packet",
    icon: Map,
  },
  {
    title: "Kelola Tempat Wisata",
    url: "/dashboard/tourism-spot",
    icon: MapPin,
  },
  {
    title: "Kelola Pemasaran",
    url: "/dashboard/marketing",
    icon: ChartCandlestick,
  },
]

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupLabel>Simanis - CRM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem 
                  key={item.title} 
                  className={clsx("bg-primary text-primary-foreground hover:bg-slate-100", {
                    "bg-slate-200 text-primary-foreground rounded-md border-transparent hover:bg-slate-200": pathname === item.url,
                  })}
                >
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