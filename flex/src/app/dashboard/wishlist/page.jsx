"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const initialWishlist = [
  {
    id: 1,
    name: "Limited Edition Jacket",
    price: 349.99,
    image:
      "https://res.cloudinary.com/do3iu9q7d/image/upload/v1770882422/flex_white_djnry7.png",
    inStock: true,
  },
  {
    id: 2,
    name: "Sneakers High Tops",
    price: 129.5,
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=60",
    inStock: false,
  },
  {
    id: 3,
    name: "Minimalist Watch",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&auto=format&fit=crop&q=60",
    inStock: true,
  },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const removeItem = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          My Wishlist{" "}
          <span className="text-sm font-normal text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-white/10">
            {wishlist.length} Items
          </span>
        </h1>
        {wishlist.length > 0 && (
          <button
            onClick={() => setWishlist([])}
            className="text-xs text-zinc-500 hover:text-red-400 underline transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/40 rounded-3xl border border-dashed border-white/10">
          <Heart size={48} className="mx-auto text-zinc-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Your Wishlist is Empty
          </h3>
          <p className="text-zinc-400 mb-6">
            Save items you love so you can find them easily later.
          </p>
          <Link
            href="/products"
            className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-secondary hover:text-white transition-all"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group relative bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300"
            >
              {/* Product Image */}
              <div className="aspect-[4/5] relative overflow-hidden bg-black">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Quick Actions Overlay */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 delay-100">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="bg-black/50 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Status Badge */}
                {!item.inStock && (
                  <div className="absolute top-3 left-3 bg-red-500/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md">
                    OUT OF STOCK
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white truncate pr-4">
                    {item.name}
                  </h3>
                  <Link
                    href={`/products/${item.id}`}
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>

                <p className="text-zinc-400 text-sm mb-4">
                  ${item.price.toFixed(2)}
                </p>

                <button
                  disabled={!item.inStock}
                  className="w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm font-semibold transition-all border border-white/5 flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag
                    size={16}
                    className="group-hover/btn:scale-110 transition-transform"
                  />
                  {item.inStock ? "Add to Cart" : "Unavailable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
