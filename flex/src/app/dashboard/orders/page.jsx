"use client";
import React, { useState } from "react";
import { Package, Truck, CheckCircle, Clock, ChevronDown, MapPin, AlertCircle, RefreshCw, XCircle } from "lucide-react";
import { toast } from "sonner";

// Enhanced Mock Data
const INITIAL_ORDERS = [
  {
    id: "ORD-9283",
    date: "Feb 12, 2025",
    total: "$342.50",
    status: "Processing",
    canCancel: true,
    isReturnable: false,
    items: [
      { name: "Wireless Headphones", price: 299.99, qty: 1 },
      { name: "Headphone Stand", price: 42.51, qty: 1 }
    ],
    tracking: null
  },
  {
    id: "ORD-8821",
    date: "Jan 15, 2025",
    total: "$1,299.00",
    status: "Delivered",
    canCancel: false,
    isReturnable: true,
    items: [
      { name: "Gaming Laptop", price: 1299.00, qty: 1 }
    ],
    tracking: "TRK-11223344"
  },
  {
    id: "ORD-7721",
    date: "Dec 20, 2024",
    total: "$59.99",
    status: "Cancelled",
    canCancel: false,
    isReturnable: false,
    items: [
      { name: "RGB Mousepad", price: 59.99, qty: 1 }
    ],
    tracking: null
  },
  {
    id: "ORD-6619",
    date: "Nov 05, 2024",
    total: "$120.00",
    status: "Returned",
    canCancel: false,
    isReturnable: false,
    items: [
      { name: "Mechanical Keyboard", price: 120.00, qty: 1 }
    ],
    tracking: "TRK-99887766"
  }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeAction, setActiveAction] = useState(null); // { type: 'cancel' | 'return', orderId: '...' }
  const [reason, setReason] = useState("");

  const toggleOrder = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
    setActiveAction(null); // Reset action panel when toggling
    setReason("");
  };

  const handleActionClick = (type, orderId, e) => {
    e.stopPropagation(); // Prevent toggling the accordion
    setActiveAction({ type, orderId });
    setReason("");
  };

  const processAction = () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason.");
      return;
    }

    const { type, orderId } = activeAction;
    
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id === orderId) {
        if (type === 'cancel') {
          return { ...order, status: "Cancelled", canCancel: false, isReturnable: false };
        } else if (type === 'return') {
          return { ...order, status: "Return Requested", canCancel: false, isReturnable: false };
        }
      }
      return order;
    }));

    toast.success(type === 'cancel' ? "Order cancelled successfully." : "Return request submitted.");
    setActiveAction(null);
    setReason("");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold text-white mb-6">Order History</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const isActionActive = activeAction?.orderId === order.id;
          
          return (
            <div 
              key={order.id} 
              className={`border rounded-2xl bg-zinc-900/40 overflow-hidden transition-all duration-300 ${
                expandedOrder === order.id ? "border-white/20 bg-zinc-900/60" : "border-white/5 hover:border-white/10"
              }`}
            >
              {/* Order Header */}
              <div 
                className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                onClick={() => toggleOrder(order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    order.status === "Delivered" ? "bg-green-500/10 text-green-400" :
                    order.status === "Processing" ? "bg-blue-500/10 text-blue-400" :
                    order.status === "Cancelled" ? "bg-red-500/10 text-red-500" :
                    order.status === "Returned" ? "bg-orange-500/10 text-orange-400" :
                    order.status === "Return Requested" ? "bg-purple-500/10 text-purple-400" :
                    "bg-zinc-500/10 text-zinc-400"
                  }`}>
                    {order.status === "Delivered" ? <CheckCircle size={20} /> :
                     order.status === "Processing" ? <Clock size={20} /> :
                     order.status === "Cancelled" ? <XCircle size={20} /> :
                     order.status === "Returned" || order.status === "Return Requested" ? <RefreshCw size={20} /> :
                     <Package size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{order.id}</h3>
                    <p className="text-zinc-500 text-sm">{order.status} • {order.items.length} Items</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                    <p className="font-bold text-white">{order.total}</p>
                    <p className="text-xs text-zinc-500">{order.date}</p>
                  </div>
                  <div className={`bg-white/5 p-2 rounded-full transition-transform duration-300 ${expandedOrder === order.id ? "rotate-180" : ""}`}>
                    <ChevronDown size={20} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${expandedOrder === order.id ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="border-t border-white/5 bg-black/20 p-6 space-y-6">
                    
                    {/* Action Panel (Cancel/Return Form) */}
                    {isActionActive && (
                      <div className="bg-zinc-900 border border-white/10 rounded-xl p-4 mb-4 animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 mb-3 text-white font-bold">
                          <AlertCircle size={18} className={activeAction.type === 'cancel' ? "text-red-500" : "text-orange-500"} />
                          {activeAction.type === 'cancel' ? "Cancel Order" : "Return Request"}
                        </div>
                        <p className="text-sm text-zinc-400 mb-3">
                          {activeAction.type === 'cancel' 
                            ? "Are you sure you want to cancel this order? This action cannot be undone." 
                            : "Please select a reason for returning this item. Our team will review your request."}
                        </p>
                        
                        <div className="space-y-3">
                           {activeAction.type === 'return' ? (
                             <select 
                               className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-secondary"
                               value={reason}
                               onChange={(e) => setReason(e.target.value)}
                             >
                                <option value="" disabled>Select a reason...</option>
                                <option value="defective">Defective or Damaged</option>
                                <option value="wrong_item">Wrong Item Received</option>
                                <option value="changed_mind">Changed Mind</option>
                                <option value="other">Other</option>
                             </select>
                           ) : (
                             <select 
                               className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-secondary"
                               value={reason}
                               onChange={(e) => setReason(e.target.value)}
                             >
                                <option value="" disabled>Select a reason...</option>
                                <option value="mistake">Ordered by mistake</option>
                                <option value="shipping_time">Shipping time too long</option>
                                <option value="price">Found better price</option>
                                <option value="other">Other</option>
                             </select>
                           )}

                           <div className="flex gap-3 justify-end pt-2">
                             <button 
                               onClick={() => setActiveAction(null)}
                               className="text-xs text-zinc-400 hover:text-white px-3 py-2"
                             >
                               Abort
                             </button>
                             <button 
                               onClick={processAction}
                               className={`text-xs px-4 py-2 rounded-lg font-bold text-white transition-colors shadow-lg ${
                                 activeAction.type === 'cancel' ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"
                               }`}
                             >
                               Confirm {activeAction.type === 'cancel' ? "Cancellation" : "Return"}
                             </button>
                           </div>
                        </div>
                      </div>
                    )}

                    {/* Tracking Info */}
                    {order.tracking && (
                      <div className="flex items-center gap-3 bg-zinc-800/50 p-4 rounded-xl border border-white/5">
                        <Truck size={20} className="text-secondary" />
                        <div>
                          <p className="text-sm font-bold text-white">Tracking Number</p>
                          <p className="text-xs text-zinc-400 font-mono">{order.tracking}</p>
                        </div>
                        <button className="ml-auto text-xs bg-white text-black px-3 py-1.5 rounded-full font-bold hover:bg-zinc-200">
                          Track
                        </button>
                      </div>
                    )}

                    {/* Items List */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Items in Order</h4>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {order.canCancel && !isActionActive && (
                            <button 
                              onClick={(e) => handleActionClick('cancel', order.id, e)}
                              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors bg-red-500/5"
                            >
                              <XCircle size={14} /> Cancel Order
                            </button>
                          )}
                          {order.isReturnable && !isActionActive && (
                            <button 
                              onClick={(e) => handleActionClick('return', order.id, e)}
                              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-colors bg-orange-500/5"
                            >
                              <RefreshCw size={14} /> Return Item
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-white/5 last:border-0">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center text-xs text-zinc-500 font-bold">
                                x{item.qty}
                              </div>
                              <span className="text-white font-medium">{item.name}</span>
                            </div>
                            <span className="text-zinc-400">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address (Mock) */}
                    <div className="flex items-start gap-3 pt-2">
                       <MapPin size={18} className="text-zinc-500 mt-0.5" />
                       <div>
                         <p className="text-sm font-bold text-white">Shipping Address</p>
                         <p className="text-xs text-zinc-400 mt-1">
                           John Doe<br/>
                           123 Main St, Apt 4B<br/>
                           New York, NY 10001
                         </p>
                       </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
