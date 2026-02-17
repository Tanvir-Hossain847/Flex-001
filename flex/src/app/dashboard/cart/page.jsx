"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductContext";

export default function CartPage() {
  const { cartItems, loading, removeFromCart, updateQuantity } = useCart();
  const { products } = useProducts();

  // Enrich cart items with full product details from the products API
  const cart = cartItems.map((item) => {
    const productData = products.find((p) => p._id === item.productId);
    return {
      ...item,
      name: productData?.name || item.name,
      image: productData?.image || item.image,
      color: productData?.color || item.color,
      price: productData?.price || item.price || 45,
      description: productData?.description || "",
      tagline: productData?.tagline || "",
    };
  });

  const subtotal = cart.reduce((acc, item) => acc + ((item.price || 45) * (item.quantity || 1)), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm">Loading your cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="p-8 bg-zinc-900/50 rounded-full border border-white/5 shadow-2xl shadow-secondary/10">
           <ShoppingBag size={64} className="text-zinc-600 mb-2" />
        </div>
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-zinc-400 max-w-sm">Looks like you haven't added anything to your cart yet. Browse our products to find something you love.</p>
        <Link 
          href="/products" 
          className="bg-secondary text-white px-8 py-3 rounded-full font-bold hover:scale-105 hover:shadow-[0_0_20px_rgba(255,11,85,0.4)] transition-all flex items-center gap-2"
        >
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        Shopping Cart <span className="text-sm font-normal text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-white/10">{cart.length} items</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div 
              key={item._id} 
              className="flex flex-col sm:flex-row gap-6 p-6 bg-zinc-900/40 border border-white/5 rounded-2xl hover:border-white/10 transition-colors group relative overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative w-full sm:w-32 aspect-square rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/5">
                {item.image ? (
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ShoppingBag size={32} className="text-zinc-600" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white line-clamp-1">{item.name}</h3>
                    <p className="font-bold text-lg text-white">${((item.price || 45) * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-zinc-400 mb-4">{item.color}</p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  {/* Quantity Control */}
                  <div className="flex items-center gap-4 bg-black/50 rounded-lg p-1 border border-white/10 w-fit">
                    <button 
                      onClick={() => updateQuantity(item._id, Math.max(1, (item.quantity || 1) - 1))}
                      className="p-1 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-medium text-white w-4 text-center">{item.quantity || 1}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                      className="p-1 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-400 transition-colors group/delete"
                  >
                    <Trash2 size={16} />
                    <span className="opacity-0 group-hover/delete:opacity-100 transition-opacity hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6 text-sm text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="text-white font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              <div className="h-px bg-white/10 my-4" />
              
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link href={"/checkout"} className="w-full bg-secondary text-white py-4 rounded-xl font-bold hover:shadow-[0_0_30px_rgba(255,11,85,0.4)] hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight size={18} />
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
              <ShieldCheck size={14} className="text-green-500" />
              <span>Secure Transactions Encrypted</span>
            </div>
            
            <div className="mt-4 flex justify-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all">
               {/* Payment Icons Placeholder */}
               <div className="w-8 h-5 bg-white/10 rounded" />
               <div className="w-8 h-5 bg-white/10 rounded" />
               <div className="w-8 h-5 bg-white/10 rounded" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
