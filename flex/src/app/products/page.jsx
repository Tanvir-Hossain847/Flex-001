"use client";

import { useState } from "react";
import { FaArrowRight, FaImage, FaSpinner, FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductsPage() {
  const { products: productList, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, isWishlisted } = useWishlist();
  const [filter, setFilter] = useState("All");

  // Map backend color names to hex codes if needed for the glow effect
  const colorMap = {
    "OBSIDIAN": "#1a1a1a",
    "RED": "#CF0F47",
    "BLUE": "#0055FF",
    "WHITE": "#E5E5E5",
  };

  // Filter Logic - Using "Signature" as default category since it's not in the data structure
  const filteredProducts = productList.filter((p) => {
    if (filter === "All") return true;
    // For now, if category is not in backend, we treat them all as Signature
    if (filter === "Signature") return true; 
    return false; // Accessories etc. not available if not in backend
  });

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center">
        <FaSpinner className="text-5xl text-red-600 animate-spin mb-4" />
        <p className="text-gray-400 font-mono tracking-widest uppercase text-sm">Initializing Lineup...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-3xl font-black uppercase mb-4 text-red-600">Sync Error</h2>
        <p className="text-gray-400 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-red-600 hover:text-white transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-red-600 selection:text-white">
      {/* Header Section */}
      <section className="pt-32 pb-12 px-6 border-b border-white/5 bg-gradient-to-b from-neutral-900 to-black">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
            The <span className="text-red-600">Lineup.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Engineered for the relentless. Choose your fuel and upgrade your
            daily carry.
          </p>
        </div>
      </section>

      {/* Controls / Filter Bar */}
      <section className="py-8 px-6 sticky top-20 z-40 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Filter Tabs */}
          <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
            {["All", "Signature", "Accessories"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  filter === cat
                    ? "bg-white text-black shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Result Count */}
          <span className="text-gray-500 text-sm font-mono hidden md:block">
            Showing {filteredProducts.length} Products
          </span>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // New if within 7 days
            const displayColor = colorMap[product.color] || "#333";

            return (
              <Link href={`/products/${product._id}`} key={product._id}>
                <div
                  className="group relative bg-neutral-900/30 border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                >
                  {/* New Badge */}
                  {isNew && (
                    <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      New Drop
                    </div>
                  )}

                  {/* Out of Stock Badge */}
                  {product.inStock === false && (
                    <div className="absolute top-4 right-4 z-10 bg-zinc-800 text-red-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-red-500/30 shadow-lg animate-pulse">
                      Out of Stock
                    </div>
                  )}

                  <div className="relative h-100 flex items-center justify-center p-8 bg-gradient-to-b from-white/5 to-transparent shrink-0">
                    {/* Glow Effect */}
                    <div
                      className="absolute w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-50 transition-opacity duration-700"
                      style={{ backgroundColor: displayColor }}
                    />

                    {/* Image Rendering */}
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="relative z-10 h-full w-auto object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center opacity-20">
                        <FaImage className="text-6xl mb-2" />
                        <span className="text-xs uppercase tracking-widest font-bold">
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-500 text-sm font-mono">
                          Signature Serie
                        </p>
                      </div>
                      <span className="text-xl font-bold text-white">
                        $45.0
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Features Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {(product.highlight || []).slice(0, 3).map((feat, i) => (
                        <span
                          key={i}
                          className="text-xs border border-white/10 px-3 py-1 rounded-md text-gray-400"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto flex gap-2">
                       <button
                        className="flex-[2] bg-white text-black font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(207,15,71,0.4)]"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="p-4 rounded-xl border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300"
                        title="Add to Cart"
                      >
                         <FaShoppingBag />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToWishlist(product);
                        }}
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          isWishlisted(product._id)
                            ? "bg-red-600/20 border-red-600/50 text-red-500"
                            : "border-white/10 text-gray-400 hover:text-red-500 hover:border-red-600/30"
                        }`}
                      >
                        {isWishlisted(product._id) ? <FaHeart /> : <FaRegHeart />}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
