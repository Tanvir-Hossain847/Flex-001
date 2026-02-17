"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Package, CheckCircle, Clock, Truck, Search, Eye } from "lucide-react";
import { toast } from "sonner";

const ORDERS_API = "http://localhost:4000/orders";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(ORDERS_API);
      // Sort by newest first (assuming ID or date can be used, or just reverse)
      // If backend doesn't sort, we can sort by date if available
      const sorted = Array.isArray(response.data) 
        ? response.data.sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0))
        : [];
      setOrders(sorted);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      // Update status to "Confirmed"
      // Note: Backend using json-server might require patches to separate endpoints if complex
      // But standard REST PATCH to /orders/:id is typical
      await axios.patch(`${ORDERS_API}/${orderId}`, { status: "Confirmed" });
      
      // Update local state
      setOrders(prev => prev.map(order => 
        (order.id === orderId || order._id === orderId) ? { ...order, status: "Confirmed" } : order
      ));
      
      toast.success("Order confirmed successfully!");
    } catch (error) {
      console.error("Failed to confirm order:", error);
      toast.error("Failed to confirm order.");
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => 
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-zinc-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
           <p className="text-zinc-400">View and manage customer orders</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Search by ID, email, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-secondary transition-colors text-white placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
             <thead className="bg-white/5 text-zinc-400 font-medium uppercase text-xs">
               <tr>
                 <th className="px-6 py-4">Order ID</th>
                 <th className="px-6 py-4">Customer</th>
                 <th className="px-6 py-4">Date</th>
                 <th className="px-6 py-4">Items</th>
                 <th className="px-6 py-4">Total</th>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
               {filteredOrders.length === 0 ? (
                 <tr>
                   <td colSpan="7" className="px-6 py-12 text-center text-zinc-500">
                     No orders found.
                   </td>
                 </tr>
               ) : (
                 filteredOrders.map((order) => (
                   <tr key={order.id || order._id || Math.random()} className="hover:bg-white/5 transition-colors">
                     <td className="px-6 py-4 font-mono text-zinc-300">
                       #{(order.id || order._id || "UNKNOWN").toString().slice(0, 8)}
                     </td>
                     <td className="px-6 py-4">
                       <div className="font-medium text-white">{order.name}</div>
                       <div className="text-xs text-zinc-500">{order.email}</div>
                     </td>
                     <td className="px-6 py-4 text-zinc-400">
                       {new Date(order.orderDate).toLocaleDateString()}
                     </td>
                     <td className="px-6 py-4 text-zinc-300">
                       {order.items?.length || 0} items
                     </td>
                     <td className="px-6 py-4 font-bold text-white">
                       ${order.total?.toFixed(2)}
                     </td>
                     <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                         order.status === "Confirmed" 
                           ? "bg-green-500/10 text-green-400 border-green-500/20"
                           : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                       }`}>
                         {order.status || "Pending"}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                         {order.status !== "Confirmed" && (
                           <button 
                             onClick={() => handleConfirmOrder(order.id || order._id)}
                             className="text-xs bg-secondary hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1"
                           >
                             <CheckCircle size={14} /> Confirm
                           </button>
                         )}
                         {order.status === "Confirmed" && (
                            <span className="text-xs text-green-500 flex items-center gap-1 justify-end font-medium">
                               <Truck size={14} /> In Delivery
                            </span>
                         )}
                       </div>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
