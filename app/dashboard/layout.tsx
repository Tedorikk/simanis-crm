"use client";

import * as React from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
      } else {
        const data = await response.json();
        console.error('Error logging out:', data.error);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="h-full overflow-hidden">
        <header className="flex items-center justify-between w-full h-16 fixed top-0 z-50 border-b px-4 bg-white/50 hover:bg-white/75 backdrop-blur-sm transition ease-in-out">
            <SidebarTrigger className="-ml-1 justify-self-start" />
          <DropdownMenu>
            <DropdownMenuTrigger>
              {/* Avatar with fixed size, no flex-1 or w-full */}
              <Avatar className="w-12 h-12 justify-self-end mr-0 md:mr-14 sm:md-0">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>ADM</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onSelect={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-auto pt-10">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
