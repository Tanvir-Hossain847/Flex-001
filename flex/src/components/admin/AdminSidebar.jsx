"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Image as ImageIcon, 
  LogOut,
  Shield,
  Home,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Package, label: "Orders", href: "/admin/orders" }, // Reusing Package icon or can use ShoppingBag/Clipboard
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: ImageIcon, label: "Hero Manager", href: "/admin/hero" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 min-h-[calc(100vh-80px)] hidden md:flex flex-col bg-zinc-950/50 backdrop-blur-md border-r border-white/5 p-6 sticky top-20">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={20} className="text-secondary" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-secondary to-red-400 bg-clip-text text-transparent">
            Admin Panel
          </h2>
        </div>
        <p className="text-xs text-zinc-500 mt-1">Manage your platform</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out",
                isActive 
                  ? "bg-secondary/10 text-secondary shadow-[0_0_20px_rgba(255,11,85,0.15)] ring-1 ring-secondary/20" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5 hover:translate-x-1"
              ].join(" ")}
            >
              <Icon 
                size={20} 
                className={[
                  "transition-colors duration-300",
                  isActive ? "text-secondary" : "text-zinc-500 group-hover:text-white"
                ].join(" ")} 
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
        <Link
          href="/dashboard"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300 group"
        >
          <LayoutDashboard size={20} className="text-zinc-500 group-hover:text-white transition-colors" />
          <span className="font-medium text-sm">User Dashboard</span>
        </Link>
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
