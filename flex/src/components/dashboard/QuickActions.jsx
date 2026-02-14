"use client";
import Link from "next/link";
import { Heart, ShoppingBag, CreditCard } from "lucide-react";
import Image from "next/image";

const wishlistItems = [
  {
    id: 1,
    name: "Wireless Headphones",
    image:
      "https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882424/Flex_red_hhethd.png",
  },
  {
    id: 2,
    name: "Smart Watch",
    image:
      "https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882424/Flex_blue_f16qpn.png",
  },
  {
    id: 3,
    name: "Gaming Mouse",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    image:
      "https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882422/flex_white_djnry7.png",
  },
];

export default function QuickActions() {
  return (
    <div className="space-y-6">
      {/* Wishlist Preview */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Heart size={20} className="text-secondary" /> Wishlist
        </h2>
        <Link href="/dashboard/wishlist" className="text-sm text-zinc-400 hover:text-white transition-colors">
          View
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
         {wishlistItems.map((item) => (
            <div key={item.id} className="aspect-square bg-zinc-800/50 rounded-xl border border-white/5 flex items-center justify-center group cursor-pointer hover:border-secondary/50 transition-all relative overflow-hidden">
               {/* Product Image */}
               <div className="absolute inset-0">
                 <Image 
                   src={item.image} 
                   alt={item.name} 
                   fill 
                   className="object-cover group-hover:scale-110 transition-transform duration-500"
                 />
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
         ))}
      </div>

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
