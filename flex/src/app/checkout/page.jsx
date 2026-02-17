"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { ShieldCheck, MapPin, Truck, CreditCard, ArrowRight } from "lucide-react";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "Dhaka", // Default to Inside Dhaka
    zip: "",
  });

  // Derived Values
  const subtotal = cartItems.reduce((acc, item) => acc + ((item.price || 45) * (item.quantity || 1)), 0);
  const deliveryCharge = formData.city === "Dhaka" ? 90 : 120;
  const total = subtotal + deliveryCharge;

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Order Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      router.push("/products");
      return;
    }

    if (!formData.phone || !formData.address) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    const orderData = {
      ...formData,
      items: cartItems,
      subtotal,
      deliveryCharge,
      total,
      paymentMethod: "COD",
      status: "Pending",
      orderDate: new Date().toISOString(),
    };

    try {
      // API call to save order
      await axios.post(`http://localhost:4000/orders`, orderData);
      
      // Clear Cart
      await clearCart();
      
      // Success Feedback
      toast.success("Order completed successfully!");
      router.push("/dashboard/orders"); // Redirect to orders page
      
    } catch (error) {
      console.error("Order failed:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !loading) {
     router.push("/dashboard/cart");
     return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-left-8 duration-500">
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-secondary" /> Shipping Details
            </h2>
            
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                    placeholder="john@example.com"
                    required
                    readOnly={!!user?.email} // Read-only if logged in
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                  placeholder="+880 1XXX XXXXXX"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Delivery Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors min-h-[100px]"
                  placeholder="House, Road, Area..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Location</label>
                  <div className="relative">
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors appearance-none"
                    >
                      <option value="Dhaka">Inside Dhaka (90tk)</option>
                      <option value="Outside Dhaka">Outside Dhaka (120tk)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      ▼
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Zip Code (Optional)</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                    placeholder="1230"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Payment Method */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="text-secondary" /> Payment Method
            </h2>
            <div className="p-4 border border-secondary/50 bg-secondary/10 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                </div>
                <span className="font-bold text-white">Cash on Delivery (COD)</span>
              </div>
              <Truck size={20} className="text-secondary" />
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 h-fit sticky top-24 animate-in slide-in-from-right-8 duration-500 delay-100">
          <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
          
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
               <div key={item._id} className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <span className="text-white font-bold">{item.quantity}x</span> {item.name}
                  </span>
                  <span className="text-white font-medium">${((item.price || 45) * (item.quantity || 1)).toFixed(2)}</span>
               </div>
            ))}
          </div>

          <div className="h-px bg-white/10 my-4" />

          <div className="space-y-2 text-sm text-zinc-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className="text-secondary font-medium">{deliveryCharge}tk</span>
            </div>
          </div>
          
          <div className="h-px bg-white/10 my-4" />
          
          <div className="flex justify-between text-xl font-bold text-white mb-8">
            <span>Total</span>
            <div className="text-right">
              <span>${subtotal.toFixed(2)}</span>
              <span className="block text-xs text-zinc-500 font-normal">+ {deliveryCharge}tk delivery</span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="w-full bg-secondary text-white py-4 rounded-xl font-bold hover:shadow-[0_0_30px_rgba(255,11,85,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>Place Order <ArrowRight size={18} /></>
            )}
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <ShieldCheck size={14} className="text-green-500" />
            <span>Secure Checkout</span>
          </div>
        </div>

      </div>
    </div>
  );
}
