"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { ShoppingBag, ArrowRight } from "lucide-react";

const OurProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/products");
        // Assuming response.data is the array or response.data.products
        const data = Array.isArray(response.data) ? response.data : response.data.products || [];
        setProducts(data.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-black text-white min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </section>
    );
  }

  if (error) {
     return null; // Or show error message if desired, but failing silently/gracefully on homepage is often better than a broken section
  }

  if (products.length === 0) {
      return null;
  }

  return (
    <section className="py-24 md:py-32 bg-black relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-secondary/5 via-black to-black pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter mb-4">
              Our <span className="text-secondary">Collection</span>
            </h2>
            <p className="text-neutral-400 max-w-md">
              Engineered for performance. Designed for aesthetic.
            </p>
          </div>
          <Link 
            href="/products" 
            className="group flex items-center gap-2 text-white font-medium hover:text-secondary transition-colors"
          >
            View All Products
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product._id || product.id} 
              className="group relative bg-neutral-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-secondary/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,11,85,0.15)] flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-800/50">
                 {product.image || product.imageUrl || product.thumbnail ? (
                    <Image
                    src={product.image || product.imageUrl || product.thumbnail}
                    alt={product.name || product.title || "Product"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">No Image</div>
                 )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                {/* Quick Action */}
                <button className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-secondary hover:text-white">
                  <ShoppingBag size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-auto">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-secondary transition-colors">
                    {product.name || product.title || "Unnamed Product"}
                    </h3>
                    <p className="text-sm text-neutral-400 line-clamp-2 mb-4">
                    {product.description || "No description available."}
                    </p>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <span className="text-xl font-bold text-white">
                    ${product.price ? product.price.toFixed(2) : "0.00"}
                  </span>
                  <button className="text-xs font-bold uppercase tracking-wider text-secondary border border-secondary px-4 py-2 rounded-lg hover:bg-secondary hover:text-white transition-all duration-300">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurProducts;
