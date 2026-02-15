"use client";

import { useParams } from "next/navigation";
import { products } from "@/data/products";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id.toString() === id);

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-red-600 selection:text-white">
      {/* Header */}
      <section className="pt-5 pb-12 px-6 border-b border-white/5 bg-gradient-to-b from-neutral-900 to-black">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/products"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
          >
            <FaArrowLeft /> Back to Products
          </Link>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            {product.name}
          </h1>
          <p className="text-gray-500 mt-2 font-mono">{product.category}</p>
        </div>
      </section>

      {/* Product Content */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">
        {/* Image Section */}
        <div className="relative flex items-center justify-center bg-neutral-900/30 border border-white/5 rounded-3xl p-10 overflow-hidden">
          {product.color && (
            <div
              className="absolute w-72 h-72 rounded-full blur-[120px] opacity-40"
              style={{ backgroundColor: product.color }}
            />
          )}

          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="relative z-10 h-100 object-contain drop-shadow-2xl"
            />
          ) : (
            <div className="opacity-20 text-center">
              <p>Coming Soon</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col">
          <h2 className="text-4xl font-bold mb-4">
            ${product.price}
          </h2>

          <p className="text-gray-400 mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-red-600">
              Key Features
            </h3>
            <ul className="space-y-3">
              {product.features.map((feat, index) => (
                <li
                  key={index}
                  className="border border-white/10 rounded-lg px-4 py-3 text-gray-300"
                >
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-gray-400">Quantity:</span>
            <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-white/10"
              >
                -
              </button>
              <span className="px-6">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-white/10"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button className="w-full bg-white text-black font-bold py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg">
            Add to Cart <FaArrowRight />
          </button>
        </div>
      </section>
    </div>
  );
}
