"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Package, Search, X, Save, Edit3, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const PRODUCTS_API = "http://localhost:4000/products";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(PRODUCTS_API);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditForm({
      // Start with all existing product fields to ensure we don't lose data on PUT
      ...product,
      name: product.name || "",
      description: product.description || "",
      price: product.price || 45,
      color: product.color || "",
      tagline: product.tagline || "",
      highlight: Array.isArray(product.highlight)
        ? product.highlight.join(", ")
        : "",
      inStock: product.inStock !== false,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (productId) => {
    try {
      // 1. Find original product to ensure we verify ID
      const original = products.find(p => p._id === productId);
      if (!original) return;

      // 2. Construct the update object for PATCH (send only fields that might have changed)
      const updateData = {
        name: editForm.name,
        description: editForm.description,
        color: editForm.color,
        tagline: editForm.tagline,
        price: parseFloat(editForm.price) || 45,
        highlight: typeof editForm.highlight === 'string' 
          ? editForm.highlight.split(",").map((h) => h.trim()).filter(Boolean)
          : editForm.highlight,
        inStock: editForm.inStock
      };

      await axios.patch(`${PRODUCTS_API}/${productId}`, updateData);
      
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, ...updateData } : p
        )
      );
      setEditingId(null);
      setEditForm({});
      toast.success("Product updated!");
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Failed to update product.");
    }
  };

  const toggleStock = async (product) => {
    const newStatus = product.inStock === false ? true : false;
    try {
      // 1. Construct partial object with new stock status
      const updatedFields = {
        inStock: newStatus,
      };

      // 2. Send partial object via PATCH
      await axios.patch(`${PRODUCTS_API}/${product._id}`, updatedFields);

      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, inStock: newStatus } : p
        )
      );
      toast.success(newStatus ? "Marked as In Stock" : "Marked as Out of Stock");
    } catch (err) {
      console.error("Error toggling stock:", err);
      toast.error("Failed to update stock status.");
    }
  };

  const filtered = products.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.color || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Package size={28} className="text-secondary" /> Product Management
          </h1>
          <p className="text-zinc-400 text-sm mt-1">{products.length} products total</p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-secondary/50 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((product) => {
            const isEditing = editingId === product._id;
            const isOutOfStock = product.inStock === false;

            return (
              <div
                key={product._id}
                className={`relative bg-zinc-900/40 border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOutOfStock
                    ? "border-red-500/30"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                {/* Out of Stock Badge */}
                {isOutOfStock && (
                  <div className="absolute top-4 right-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-red-600/30 animate-pulse">
                    <AlertTriangle size={12} />
                    OUT OF STOCK
                  </div>
                )}

                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className={`relative w-full sm:w-40 h-40 bg-black flex-shrink-0 ${isOutOfStock ? "opacity-50 grayscale" : ""}`}>
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package size={32} className="text-zinc-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-5">
                    {isEditing ? (
                      /* Edit Form */
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="Product Name"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50"
                        />
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          placeholder="Description"
                          rows={2}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50 resize-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            placeholder="Price"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50"
                          />
                          <input
                            type="text"
                            value={editForm.color}
                            onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                            placeholder="Color"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50"
                          />
                        </div>
                        <input
                          type="text"
                          value={editForm.tagline}
                          onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                          placeholder="Tagline"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50"
                        />
                        <input
                          type="text"
                          value={editForm.highlight}
                          onChange={(e) => setEditForm({ ...editForm, highlight: e.target.value })}
                          placeholder="Highlights (comma separated)"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50"
                        />
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => saveEdit(product._id)}
                            className="flex items-center gap-1.5 bg-secondary text-white px-4 py-2 rounded-lg text-xs font-bold hover:brightness-110 transition-all"
                          >
                            <Save size={14} /> Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center gap-1.5 bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-700 transition-all"
                          >
                            <X size={14} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display Mode */
                      <>
                        <h3 className="font-bold text-white text-lg mb-1">{product.name}</h3>
                        <p className="text-zinc-400 text-sm line-clamp-2 mb-2">{product.description}</p>
                        <div className="flex items-center gap-3 text-xs text-zinc-500 mb-4">
                          <span className="bg-zinc-800 px-2 py-1 rounded">{product.color}</span>
                          <span>${(product.price || 45).toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all border border-white/5"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => toggleStock(product)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                              isOutOfStock
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                            }`}
                          >
                            <AlertTriangle size={14} />
                            {isOutOfStock ? "Mark In Stock" : "Mark Out of Stock"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          No products found.
        </div>
      )}
    </div>
  );
}
