"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { FaArrowRight, FaImage } from "react-icons/fa"; // Added FaImage for placeholder

export default function ProductsPage() {
  const [filter, setFilter] = useState("All");

  // Filter Logic
  const filteredProducts =
    filter === "All" ? products : products.filter((p) => p.category === filter);

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
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              // ADDED: "flex flex-col h-full" to make the card stretch to fill the grid height
              className="group relative bg-neutral-900/30 border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
            >
              {/* New Badge */}
              {product.isNew && (
                <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  New Drop
                </div>
              )}

              <div className="relative h-[400px] flex items-center justify-center p-8 bg-gradient-to-b from-white/5 to-transparent shrink-0">
                {/* 1. Only show Glow if color exists */}
                {product.color && (
                  <div
                    className="absolute w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-50 transition-opacity duration-700"
                    style={{ backgroundColor: product.color }}
                  />
                )}

                {/* 2. Conditional Rendering: Show Image OR Placeholder */}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="relative z-10 h-full w-auto object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                ) : (
                  // Fallback for missing images
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
                      {product.category}
                    </p>
                  </div>
                  <span className="text-xl font-bold text-white">
                    ${product.price}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                  {product.description}
                </p>

                {/* Features Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.features.slice(0, 2).map((feat, i) => (
                    <span
                      key={i}
                      className="text-xs border border-white/10 px-3 py-1 rounded-md text-gray-400"
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button className="mt-auto w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(207,15,71,0.4)]">
                  Add to Cart <FaArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
