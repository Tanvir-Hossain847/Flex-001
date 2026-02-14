"use client";
import React from "react";
import Link from "next/link";
import { Clock, Package } from "lucide-react";

const recentOrders = [
  { id: "#ORD-7382", date: "Feb 10, 2025", status: "Processing", total: "$120.00", items: 3 },
  { id: "#ORD-7381", date: "Jan 28, 2025", status: "Delivered", total: "$240.50", items: 5 },
  { id: "#ORD-7380", date: "Jan 15, 2025", status: "Cancelled", total: "$89.99", items: 1 },
];

export default function RecentOrders() {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock size={20} className="text-secondary" /> Recent Orders
        </h2>
        <Link href="/dashboard/orders" className="text-sm text-zinc-400 hover:text-white transition-colors">
          View all
        </Link>
      </div>
          
      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
        {recentOrders.length > 0 ? (
          <div className="divide-y divide-white/5">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-800 rounded-lg group-hover:bg-zinc-700 transition-colors">
                    <Package size={20} className="text-zinc-400 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{order.id}</p>
                    <p className="text-xs text-zinc-500">{order.date} • {order.items} Items</p>
                  </div>
                </div>
                    
                <div className="text-right">
                  <p className="font-bold text-white">{order.total}</p>
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    order.status === "Delivered" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                    order.status === "Processing" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                    "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-500">
            No recent orders found.
          </div>
        )}
      </div>
    </div>
  );
}
