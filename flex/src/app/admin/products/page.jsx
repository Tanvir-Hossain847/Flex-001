"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import {
  Package,
  Search,
  X,
  Save,
  Edit3,
  AlertTriangle,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const PRODUCTS_API = "http://localhost:4000/products";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    tagline: "",
    color: "",
    description: "",
    highlight: "",
    image: "",
  });

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
      const original = products.find((p) => p._id === productId);
      if (!original) return;

      // 2. Construct the update object for PATCH (send only fields that might have changed)
      const updateData = {
        name: editForm.name,
        description: editForm.description,
        color: editForm.color,
        tagline: editForm.tagline,
        price: parseFloat(editForm.price) || 45,
        highlight:
          typeof editForm.highlight === "string"
            ? editForm.highlight
                .split(",")
                .map((h) => h.trim())
                .filter(Boolean)
            : editForm.highlight,
        inStock: editForm.inStock,
      };

      await axios.patch(`${PRODUCTS_API}/${productId}`, updateData);

      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, ...updateData } : p)),
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
          p._id === product._id ? { ...p, inStock: newStatus } : p,
        ),
      );
      toast.success(
        newStatus ? "Marked as In Stock" : "Marked as Out of Stock",
      );
    } catch (err) {
      console.error("Error toggling stock:", err);
      toast.error("Failed to update stock status.");
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        name: createForm.name,
        tagline: createForm.tagline,
        color: createForm.color,
        description: createForm.description,
        highlight: createForm.highlight
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean),
        image: createForm.image,
        createdAt: new Date().toISOString(),
      };

      const response = await axios.post(PRODUCTS_API, productData);

      // Add new product to the list
      setProducts((prev) => [...prev, response.data]);

      // Reset form and close modal
      setCreateForm({
        name: "",
        tagline: "",
        color: "",
        description: "",
        highlight: "",
        image: "",
      });
      setIsCreateModalOpen(false);

      toast.success("Product created successfully!");
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    if (!isSubmitting) {
      setIsCreateModalOpen(false);
      setCreateForm({
        name: "",
        tagline: "",
        color: "",
        description: "",
        highlight: "",
        image: "",
      });
    }
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isCreateModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isCreateModalOpen, isSubmitting]);

  const handleDeleteProduct = (productId, productName) => {
    toast.warning(`Delete "${productName}"?`, {
      description: "This action cannot be undone.",
      duration: 5000,
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await axios.delete(`${PRODUCTS_API}/${productId}`);

            // Remove product from the list
            setProducts((prev) => prev.filter((p) => p._id !== productId));

            toast.success("Product deleted successfully!");
          } catch (err) {
            console.error("Error deleting product:", err);
            toast.error("Failed to delete product. Please try again.");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const filtered = products.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.color || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Package size={28} className="text-secondary" /> Product Management
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            {products.length} products total
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
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
                  <div
                    className={`relative w-full sm:w-40 h-40 bg-black flex-shrink-0 ${isOutOfStock ? "opacity-50 grayscale" : ""}`}
                  >
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
                  <div className="flex-1 p-5 relative">
                    {isEditing ? (
                      /* Edit Form */
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="Product Name"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50"
                        />
                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Description"
                          rows={2}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50 resize-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                price: e.target.value,
                              })
                            }
                            placeholder="Price"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50"
                          />
                          <input
                            type="text"
                            value={editForm.color}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                color: e.target.value,
                              })
                            }
                            placeholder="Color"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50"
                          />
                        </div>
                        <input
                          type="text"
                          value={editForm.tagline}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              tagline: e.target.value,
                            })
                          }
                          placeholder="Tagline"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50"
                        />
                        <input
                          type="text"
                          value={editForm.highlight}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              highlight: e.target.value,
                            })
                          }
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
                        <h3 className="font-bold text-white text-lg mb-1">
                          {product.name}
                        </h3>
                        <p className="text-zinc-400 text-sm line-clamp-2 mb-2">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-zinc-500 mb-4">
                          <span className="bg-zinc-800 px-2 py-1 rounded">
                            {product.color}
                          </span>
                          <span>${(product.price || 45).toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
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
                            {isOutOfStock
                              ? "Mark In Stock"
                              : "Mark Out of Stock"}
                          </button>
                        </div>

                        {/* Delete Button - Bottom Right */}
                        <button
                          onClick={() =>
                            handleDeleteProduct(product._id, product.name)
                          }
                          className="absolute bottom-5 right-5 p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all group"
                          title="Delete Product"
                        >
                          <Trash2
                            size={16}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </button>
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

      {/* Floating Create Button */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-8 right-8 bg-secondary text-white p-4 rounded-full shadow-2xl shadow-secondary/40 hover:shadow-secondary/60 hover:scale-110 active:scale-95 transition-all duration-300 z-40 group"
        aria-label="Create Product"
      >
        <Plus
          size={28}
          className="group-hover:rotate-90 transition-transform duration-300"
        />
      </button>

      {/* Create Product Modal */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div
            className="bg-zinc-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-zinc-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Package size={24} className="text-secondary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Create New Product
                  </h2>
                  <p className="text-sm text-zinc-400 mt-0.5">
                    Add a new product to your catalog
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
              >
                <X size={24} className="text-zinc-400" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateProduct} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  placeholder="e.g., Flex Obsidian"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-secondary/50 transition-colors"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Tagline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={createForm.tagline}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, tagline: e.target.value })
                  }
                  placeholder="e.g., Night fuel. Zero crash."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-secondary/50 transition-colors"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Color <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={createForm.color}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, color: e.target.value })
                  }
                  placeholder="e.g., OBSIDIAN or #1a1a1a"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-secondary/50 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the product features and benefits..."
                  rows={4}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-secondary/50 transition-colors resize-none"
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Highlights
                </label>
                <input
                  type="text"
                  value={createForm.highlight}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, highlight: e.target.value })
                  }
                  placeholder="e.g., Matte Finish, 24h Cold, Ceramic Core (comma separated)"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-secondary/50 transition-colors"
                />
                <p className="text-xs text-zinc-500 mt-1.5">
                  Separate multiple highlights with commas
                </p>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={createForm.image}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, image: e.target.value })
                  }
                  placeholder="https://example.com/image.png"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-secondary/50 transition-colors"
                />
              </div>

              {/* Image Preview */}
              {createForm.image && (
                <div className="relative w-full h-48 bg-black rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src={createForm.image}
                    alt="Preview"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-secondary text-white px-6 py-3.5 rounded-xl font-bold hover:brightness-110 hover:shadow-[0_0_20px_rgba(255,11,85,0.4)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Create Product
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-6 py-3.5 bg-zinc-800 text-zinc-300 rounded-xl font-bold hover:bg-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
