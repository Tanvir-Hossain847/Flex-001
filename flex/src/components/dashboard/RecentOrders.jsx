"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Package, Truck, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function RecentOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchRecentOrders();
    }
  }, [user?.email]);

  const fetchRecentOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/orders?email=${user.email}`);
      // Sort by newest first and take top 5
      const sorted = Array.isArray(response.data) 
        ? response.data
            .sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0))
            .slice(0, 5)
        : [];
      setOrders(sorted);
    } catch (error) {
      console.error("Failed to fetch recent orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="lg:col-span-2 space-y-6 animate-pulse">
         <div className="h-8 w-48 bg-white/5 rounded-lg" />
         <div className="bg-zinc-900/40 border border-white/5 rounded-2xl h-64" />
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock size={20} className="text-secondary" /> Recent Orders
        </h2>
        <Link href="/dashboard/orders" className="text-sm text-zinc-400 hover:text-white transition-colors">
          View all
        </Link>
      </div>
          
      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
        {orders.length > 0 ? (
          <div className="divide-y divide-white/5">
            {orders.map((order) => {
              const orderId = (order.id || order._id || "UNKNOWN").toString();
              return (
              <div key={orderId} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg transition-colors ${
                    order.status === "Confirmed" 
                      ? "bg-green-500/10 text-green-400 group-hover:bg-green-500/20"
                      : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700"
                  }`}>
                    {order.status === "Confirmed" ? <Truck size={20} /> : <Package size={20} />}
                  </div>
                  <div>
                    <p className="font-semibold text-white">#{orderId.slice(0, 8)}</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(order.orderDate).toLocaleDateString()} • {order.items?.length || 0} Items
                    </p>
                  </div>
                </div>
                    
                <div className="text-right flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <p className="font-bold text-white">${order.total?.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    order.status === "Confirmed" 
                      ? "bg-green-500/10 text-green-400 border-green-500/20" 
                      : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  }`}>
                    {order.status === "Confirmed" ? "In Delivery" : "Pending"}
                  </span>
                </div>
              </div>
            )})}
          </div>
        ) : (
          <div className="p-12 text-center text-zinc-500 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
               <Package size={24} className="opacity-50" />
            </div>
            <p>No recent orders found.</p>
            <Link href="/products" className="text-secondary text-sm hover:underline">
              Start shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
