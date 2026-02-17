"use client";
import Link from "next/link";
import { Heart, ShoppingBag, CreditCard } from "lucide-react";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";

export default function QuickActions() {
  const { wishlistItems } = useWishlist();

  // Take first 4 items for preview
  const displayItems = wishlistItems.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Wishlist Preview */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Heart size={20} className="text-secondary" /> Wishlist
        </h2>
        <Link href="/dashboard/wishlist" className="text-sm text-zinc-400 hover:text-white transition-colors">
          View All
        </Link>
      </div>
      
      {displayItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
           {displayItems.map((item) => (
              <Link 
                href={`/products/${item.productId || item._id}`} 
                key={item._id || item.productId}
              >
                <div className="aspect-square bg-zinc-800/50 rounded-xl border border-white/5 flex items-center justify-center group cursor-pointer hover:border-secondary/50 transition-all relative overflow-hidden">
                   {/* Product Image */}
                   <div className="absolute inset-0">
                     {item.image ? (
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                          <Heart className="text-zinc-700" />
                        </div>
                     )}
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                   </div>
    
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col justify-end p-3">
                     <p className="text-xs text-white font-medium truncate w-full mb-1">{item.name}</p>
                     <div className="flex items-center gap-1 text-[10px] text-secondary">
                        <ShoppingBag size={10} />
                        <span>View Product</span>
                     </div>
                   </div>
                </div>
              </Link>
           ))}
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-8 text-center">
            <p className="text-zinc-500 text-sm mb-4">Your wishlist is empty.</p>
            <Link href="/products" className="text-secondary text-xs font-bold hover:underline">
                Browse Products
            </Link>
        </div>
      )}

      {/* Payment Manage Card */}
      <div className="bg-gradient-to-br from-secondary/20 to-purple-600/10 p-6 rounded-2xl border border-white/5 mt-6 relative overflow-hidden">
         <div className="relative z-10">
           <h3 className="font-bold text-white mb-2">Payment Methods</h3>
           <p className="text-xs text-zinc-300 mb-4">Manage your saved cards and payment preferences.</p>
           <Link href="/dashboard/payments">
             <button className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-200 transition-colors w-full">
               Manage Cards
             </button>
           </Link>
         </div>
         <CreditCard className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12" />
      </div>
    </div>
  );
}
