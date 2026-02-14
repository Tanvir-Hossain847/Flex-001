"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentOrders from "@/components/dashboard/RecentOrders";
import QuickActions from "@/components/dashboard/QuickActions";

export default function DashboardOverview() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-secondary">{user?.displayName || "Reader"}</span>!
          </h1>
          <p className="text-zinc-400 text-sm">Here's what's happening with your store today.</p>
        </div>
        <Link 
          href="/products" 
          className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-secondary hover:text-white transition-all shadow-lg shadow-white/10 hover:shadow-secondary/20 flex items-center gap-2 w-fit"
        >
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders - Takes up 2 columns */}
        <RecentOrders />

        {/* Wishlist Preview / Quick Actions - Takes up 1 column */}
        <QuickActions />

      </div>
    </div>
  );
}
