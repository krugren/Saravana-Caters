"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, MessageSquare, FileText, CalendarDays, Users, 
  ChefHat, UtensilsCrossed, Package, ShoppingCart, BarChart3, 
  CheckSquare, Settings, History, Image, Quote
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard",         href: "/dashboard",    icon: LayoutDashboard },
  { name: "Enquiries",         href: "/enquiries",    icon: MessageSquare },
  { name: "Quotations",        href: "/quotations",   icon: FileText },
  { name: "Bookings",          href: "/bookings",     icon: CalendarDays },
  { name: "Customers",         href: "/customers",    icon: Users },
  { name: "Kitchen",           href: "/kitchen",      icon: ChefHat },
  { name: "Recipes & Menus",   href: "/menus",        icon: UtensilsCrossed },
  { name: "Inventory",         href: "/inventory",    icon: Package },
  { name: "Procurement",       href: "/procurement",  icon: ShoppingCart },
  { name: "Intelligence",      href: "/intelligence", icon: BarChart3 },
  { name: "Tasks",             href: "/tasks",        icon: CheckSquare },
  { name: "Testimonials",      href: "/testimonials", icon: Quote, badgeKey: "pendingReviews" },
  { name: "Photo Gallery",     href: "/photos",       icon: Image },
  { name: "Business Settings", href: "/config",       icon: Settings },
  { name: "Audit Trail",       href: "/audit",        icon: History },
];

export function Sidebar({ user, pendingReviews = 0 }: { user: any; pendingReviews?: number }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-forest-green text-white flex-col transition-all duration-300 hidden md:flex shrink-0">
      <div className="p-6">
        <h1 className="font-display text-2xl text-white">Saravana Caters</h1>
        <p className="font-sans text-white/80 text-sm mt-1">Operations Platform</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const badge = item.badgeKey === "pendingReviews" ? pendingReviews : 0;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary-container text-white" 
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <span className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </span>
              {badge > 0 && (
                <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="text-sm font-medium text-white truncate max-w-[130px]">{user?.name || "User"}</p>
            <p className="text-xs text-white/60">{user?.role || "Admin"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
