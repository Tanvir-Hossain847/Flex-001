"use client";
import { Package, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link"; 
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function StatsGrid() {
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart(); 

  // Placeholder for orders and spent until we have that data
  // But wishlist count is now real!
  
  const stats = [
    { 
      label: "Active Cart", 
      value: cartCount.toString(), 
      icon: ShoppingBag, 
      color: "text-blue-400", 
      bg: "bg-blue-400/10",
      href: "/dashboard/cart" 
    },
    { 
      label: "Wishlist Items", 
      value: wishlistCount.toString(), 
      icon: Heart, 
      color: "text-pink-400", 
      bg: "bg-pink-400/10",
      href: "/dashboard/wishlist"
    },
    { 
      label: "Total Orders", 
      value: "0", // Placeholder until order history API exists
      icon: Package, 
      color: "text-green-400", 
      bg: "bg-green-400/10",
      href: "/dashboard/orders" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        // Render the card content
        const CardContent = (
          <div className="p-6 h-full rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 group relative overflow-hidden cursor-pointer">
            <div className={`absolute -right-6 -top-6 p-8 rounded-full ${stat.bg} filter blur-xl opacity-50 group-hover:opacity-100 transition-opacity`} />
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-zinc-400 text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );

        return stat.href ? (
          <Link key={index} href={stat.href} className="block">
            {CardContent}
          </Link>
        ) : (
          <div key={index}>
            {CardContent}
          </div>
        );
      })}
    </div>
  );
}
