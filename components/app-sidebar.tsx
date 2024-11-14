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

import Link from 'next/link'
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Simanis - CRM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem 
                  key={item.title} 
                  className={clsx("bg-transparent", {
                    "bg-sky-200 rounded-md border-transparent": pathname === item.url,
                  })}
                >
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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