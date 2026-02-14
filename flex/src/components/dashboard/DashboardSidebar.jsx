"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  History, 
  User, 
  Settings, 
  LogOut,
  CreditCard,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming utils exists, if not I'll inline helper
import { useAuth } from "@/context/AuthContext";

// Helper if cn doesn't exist
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: ShoppingBag, label: "My Cart", href: "/dashboard/cart" },
  { icon: Heart, label: "Wishlist", href: "/dashboard/wishlist" },
  { icon: History, label: "Order History", href: "/dashboard/orders" },
  { icon: CreditCard, label: "Payments", href: "/dashboard/payments" },
  { icon: Star, label: "My Reviews", href: "/dashboard/reviews" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  // { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 min-h-[calc(100vh-80px)] hidden md:flex flex-col bg-zinc-950/50 backdrop-blur-md border-r border-white/5 p-6 sticky top-20">
      <div className="mb-8">
        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Manage your account</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={classNames(
                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out",
                isActive 
                  ? "bg-secondary/10 text-secondary shadow-[0_0_20px_rgba(255,11,85,0.15)] ring-1 ring-secondary/20" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5 hover:translate-x-1"
              )}
            >
              <Icon 
                size={20} 
                className={classNames(
                  "transition-colors duration-300",
                  isActive ? "text-secondary" : "text-zinc-500 group-hover:text-white"
                )} 
              />
              <span className="font-medium text-sm">{item.label}</span>
              
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(255,11,85,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 group"
        >
          <LogOut size={20} className="text-zinc-500 group-hover:text-red-400 transition-colors" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
