"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, MessageSquare, FileText, CalendarDays, Users,
  ChefHat, UtensilsCrossed, Package, ShoppingCart, BarChart3,
  CheckSquare, Settings, History,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Enquiries", href: "/enquiries", icon: MessageSquare },
  { name: "Quotations", href: "/quotations", icon: FileText },
  { name: "Bookings", href: "/bookings", icon: CalendarDays },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Kitchen", href: "/kitchen", icon: ChefHat },
  { name: "Recipes & Menus", href: "/menus", icon: UtensilsCrossed },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Procurement", href: "/procurement", icon: ShoppingCart },
  { name: "Intelligence", href: "/intelligence", icon: BarChart3 },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Configuration", href: "/config", icon: Settings },
  { name: "Audit Trail", href: "/audit", icon: History },
];

export function MobileSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button — kept outside Sheet to avoid asChild/render complexity */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden mr-2"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5 text-on-surface" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-forest-green border-r-0">
          {/* SheetTitle with sr-only satisfies accessibility without @radix-ui dep */}
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h1 className="font-display text-2xl text-white">Saravana Caters</h1>
              <p className="font-sans text-white/80 text-sm mt-1">Operations Platform</p>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary-container text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
