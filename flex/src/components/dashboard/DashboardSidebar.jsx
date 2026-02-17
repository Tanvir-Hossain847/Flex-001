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
  Shield,
  Home,
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
  // { icon: Star, label: "My Reviews", href: "/dashboard/reviews" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  // { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { logout, userData } = useAuth();
  
  // Close sidebar on route change for mobile
  // (Optional but good UX)
  
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950/90 backdrop-blur-xl border-r border-white/5 p-6 
        transform transition-transform duration-300 ease-in-out
        md:relative md:transform-none md:bg-zinc-950/50 md:min-h-[calc(100vh-80px)] md:sticky md:top-20 md:flex md:flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Manage your account</p>
          </div>
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden text-zinc-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose} // Close on nav click
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

        <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300 group"
          >
            <Home size={20} className="text-zinc-500 group-hover:text-white transition-colors" />
            <span className="font-medium text-sm">Back to Home</span>
          </Link>
          {userData?.role === "admin" && (
            <Link
              href="/admin"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-400 bg-amber-400/5 hover:bg-amber-400/10 transition-all duration-300 group ring-1 ring-amber-400/20"
            >
              <Shield size={20} className="text-amber-400" />
              <span className="font-medium text-sm">Admin Panel</span>
            </Link>
          )}
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 group"
          >
            <LogOut size={20} className="text-zinc-500 group-hover:text-red-400 transition-colors" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
