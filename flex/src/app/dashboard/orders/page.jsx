"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Link from "next/link";

export default function UserOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
    }
  }, [user?.email]);

  const fetchOrders = async () => {
    try {
      // Filter by email using json-server query filtering
      const response = await axios.get(`http://localhost:4000/orders?email=${user.email}`);
      const sorted = Array.isArray(response.data)
        ? response.data.sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0))
        : [];
      setOrders(sorted);
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
      toast.error("Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return (
        <div className="flex items-center justify-center h-64">
           <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
     );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
         <h1 className="text-3xl font-bold text-white">Order History</h1>
         <div className="text-center py-20 bg-zinc-900/40 rounded-3xl border border-dashed border-white/10">
            <Package size={48} className="mx-auto text-zinc-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No past orders</h3>
            <p className="text-zinc-400 mb-6">You haven't placed any orders yet.</p>
            <Link href="/products" className="bg-secondary text-white px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">
               Start Shopping
            </Link>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold text-white mb-6">Order History</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="border border-white/5 rounded-2xl bg-zinc-900/40 overflow-hidden hover:border-white/10 transition-colors"
          >
             <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                   <div className="flex items-center gap-4">
                      {/* Status Icon */}
                      <div className={`p-3 rounded-xl ${
                         order.status === "Confirmed" 
                           ? "bg-green-500/10 text-green-400" 
                           : "bg-yellow-500/10 text-yellow-400"
                      }`}>
                         {order.status === "Confirmed" ? <Truck size={24} /> : <Clock size={24} />}
                      </div>
                      
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-white text-lg">Order #{(order.id || order._id || "UNKNOWN").toString().slice(0, 8)}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                               order.status === "Confirmed" 
                                 ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                 : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            }`}>
                               {order.status === "Confirmed" ? "In Delivery" : "Pending"}
                            </span>
                         </div>
                         <p className="text-zinc-500 text-sm">
                            {new Date(order.orderDate).toLocaleDateString()} • {order.items?.length || 0} Items
                         </p>
                      </div>
                   </div>

                   <div className="text-right">
                      <p className="text-xl font-bold text-white">${order.total?.toFixed(2)}</p>
                      <p className="text-xs text-zinc-500">Payment: {order.paymentMethod}</p>
                   </div>
                </div>

                {/* Confirm Message */}
                {order.status === "Confirmed" && (
                   <div className="mb-6 bg-green-500/5 border border-green-500/10 rounded-xl p-4 flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-0.5" size={18} />
                      <div>
                         <p className="text-sm font-bold text-green-400">Order Confirmed!</p>
                         <p className="text-xs text-zinc-400 mt-1">
                            Your order has been confirmed and is currently being prepared for delivery. Get ready!
                         </p>
                      </div>
                   </div>
                )}

                {/* Items Preview */}
                <div className="bg-black/20 rounded-xl p-4 space-y-3">
                   {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-3">
                            <span className="font-bold text-zinc-500">{item.quantity}x</span>
                            <span className="text-zinc-300">{item.name}</span>
                         </div>
                         <span className="text-zinc-400">${item.price?.toFixed(2)}</span>
                      </div>
                   ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-zinc-500">
                    <div className="flex flex-col">
                       <span className="uppercase tracking-wider font-bold mb-1">Shipping To</span>
                       <span>{order.address}, {order.city}</span>
                    </div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
