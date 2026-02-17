"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaSpinner, FaImage, FaHeart, FaRegHeart } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, isWishlisted } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p._id === id);

  // Map backend color names to hex codes for the glow effect
  const colorMap = {
    "OBSIDIAN": "#1a1a1a",
    "RED": "#CF0F47",
    "BLUE": "#0055FF",
    "WHITE": "#E5E5E5",
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center">
        <FaSpinner className="text-5xl text-red-600 animate-spin mb-4" />
        <p className="text-gray-400 font-mono tracking-widest uppercase text-sm">Synchronizing Core Logic...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-3xl font-black uppercase mb-4 text-red-600">{error || "Product Not Found"}</h2>
        <Link 
          href="/products"
          className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-red-600 hover:text-white transition-all"
        >
          Return to Lineup
        </Link>
      </div>
    );
  }

  const displayColor = colorMap[product.color] || "#333";

  return (
    <div className="bg-black min-h-screen text-white selection:bg-red-600 selection:text-white">
      {/* Header */}
      <section className="pt-32 pb-12 px-6 border-b border-white/5 bg-gradient-to-b from-neutral-900 to-black">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/products"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Lineup
          </Link>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            {product.name}
          </h1>
          <p className="text-red-600 mt-2 font-mono uppercase tracking-[0.3em] font-bold text-sm">
            {product.tagline || "Advanced Thermal Core"}
          </p>
        </div>
      </section>

      {/* Product Content */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">
        {/* Image Section */}
        <div className="relative min-h-[500px] flex items-center justify-center bg-neutral-900/30 border border-white/5 rounded-3xl p-10 overflow-hidden group">
          {/* Dynamic Glow */}
          <div
            className="absolute w-72 h-72 rounded-full blur-[120px] opacity-40 group-hover:opacity-60 transition-opacity duration-700"
            style={{ backgroundColor: displayColor }}
          />

          {product.image ? (
            <div className="relative w-full h-full flex items-center justify-center z-10">
                <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-700"
                />
            </div>
          ) : (
            <div className="opacity-20 text-center z-10">
              <FaImage className="text-8xl mb-4 mx-auto" />
              <p className="font-mono uppercase tracking-widest">Awaiting Visualization</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col">
          <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-8">
            <h2 className="text-5xl font-black tracking-tighter">
              $45.00
            </h2>
            <span className="text-gray-500 font-mono text-sm uppercase">Signature Series</span>
          </div>

          <p className="text-gray-400 mb-12 leading-relaxed text-lg font-light">
            {product.description}
          </p>

          {/* Features */}
          <div className="mb-12">
            <h3 className="text-sm font-bold mb-6 uppercase tracking-[0.4em] text-red-600">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {(product.highlight || []).map((feat, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-4 bg-white/5 border border-white/5 rounded-xl px-6 py-4 hover:border-red-600/30 transition-all duration-300"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 group-hover:scale-150 transition-transform" />
                  <span className="text-gray-300 font-medium tracking-wide">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Controls */}
          <div className="mt-auto space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-between bg-neutral-900 p-2 rounded-2xl border border-white/5 max-w-[200px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-xl font-bold"
                >
                  -
                </button>
                <span className="text-xl font-mono font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-xl font-bold"
                >
                  +
                </button>
              </div>

              {/* Wishlist Toggle */}
              <button
                onClick={() => addToWishlist(product)}
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isWishlisted(product._id)
                    ? "bg-red-600/20 border-red-600/50 text-red-500"
                    : "border-white/10 text-gray-400 hover:text-red-500 hover:border-red-600/30"
                }`}
              >
                {isWishlisted(product._id) ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(product, quantity);
                setQuantity(1);
              }}
              className="group relative w-full overflow-hidden bg-white text-black font-black py-6 rounded-2xl flex items-center justify-center gap-4 hover:bg-red-600 hover:text-white transition-all duration-500 shadow-2xl hover:shadow-[0_0_40px_rgba(207,15,71,0.4)]"
            >
              <span className="relative z-10 uppercase tracking-[0.2em] text-lg">Add to Cart</span>
              <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
