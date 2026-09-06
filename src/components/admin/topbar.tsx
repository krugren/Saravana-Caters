"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { MobileSidebar } from "./mobile-sidebar";

export function Topbar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();

  const title = pathname.split("/")[1] || "Dashboard";
  const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <header className="h-16 bg-background border-b border-outline/20 flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-2 md:gap-0">
        {/* MobileSidebar self-contains its trigger button */}
        <MobileSidebar user={user} />
        <h2 className="font-display text-xl font-semibold text-on-surface">
          {formattedTitle}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search... (Ctrl+K)"
            className="h-9 w-64 bg-surface-container-low rounded-lg pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant/70"
          />
        </div>

        {/* Notifications — @base-ui DropdownMenuTrigger uses render prop not asChild */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="relative text-on-surface-variant">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium">New Enquiry Received</span>
                <span className="text-xs text-on-surface-variant">Wedding for 500 guests on Oct 12th</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium">Inventory Alert</span>
                <span className="text-xs text-on-surface-variant">Basmati Rice is below minimum threshold</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User account menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-error">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
