"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Image as ImageIcon, Save, X, Edit3, GripVertical } from "lucide-react";
import { toast } from "sonner";

const THERMOS_API = "http://localhost:4000/thermos";

const COLOR_OPTIONS = [
  { label: "Obsidian", value: "OBSIDIAN" },
  { label: "Pacific", value: "PACIFIC" },
  { label: "Ember", value: "EMBER" },
  { label: "Arctic", value: "ARCTIC" },
];

export default function HeroManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(THERMOS_API);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching hero items:", err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditForm({
      name: item.name || "",
      tagline: item.tagline || "",
      description: item.description || "",
      image: item.image || "",
      color: item.color || "OBSIDIAN",
      highlight: Array.isArray(item.highlight)
        ? item.highlight.join(", ")
        : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (itemId) => {
    try {
      const updateData = {
        ...editForm,
        highlight: editForm.highlight
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean),
      };

      await axios.put(`${THERMOS_API}/${itemId}`, updateData);
      setItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, ...updateData } : item
        )
      );
      setEditingId(null);
      setEditForm({});
      toast.success("Hero item updated!");
    } catch (err) {
      console.error("Error updating hero item:", err);
      toast.error("Failed to update hero item.");
    }
  };

  const colorMap = {
    OBSIDIAN: "#050509",
    PACIFIC: "#0066FF",
    EMBER: "#C3110C",
    ARCTIC: "#F5F5F7",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <ImageIcon size={28} className="text-secondary" /> Hero Manager
        </h1>
        <p className="text-zinc-400 text-sm mt-1">Manage the carousel items displayed on the homepage hero section.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item, idx) => {
            const isEditing = editingId === item._id;
            const bgColor = colorMap[item.color] || "#050509";

            return (
              <div
                key={item._id}
                className="relative bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Preview */}
                  <div
                    className="relative w-full md:w-56 h-56 flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle, ${bgColor}dd 0%, ${bgColor} 50%, #000000 100%)`,
                    }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-4"
                      />
                    ) : (
                      <ImageIcon size={48} className="text-zinc-600" />
                    )}

                    {/* Slide Number */}
                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/10">
                      Slide {idx + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            placeholder="Name"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50"
                          />
                          <input
                            type="text"
                            value={editForm.tagline}
                            onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                            placeholder="Tagline"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50"
                          />
                        </div>
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          placeholder="Description"
                          rows={3}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50 resize-none"
                        />
                        <input
                          type="text"
                          value={editForm.image}
                          onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                          placeholder="Image URL"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <select
                            value={editForm.color}
                            onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50 appearance-none cursor-pointer"
                          >
                            {COLOR_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value} className="bg-zinc-900">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={editForm.highlight}
                            onChange={(e) => setEditForm({ ...editForm, highlight: e.target.value })}
                            placeholder="Highlights (comma separated)"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary/50"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => saveEdit(item._id)}
                            className="flex items-center gap-1.5 bg-secondary text-white px-5 py-2 rounded-lg text-xs font-bold hover:brightness-110 transition-all"
                          >
                            <Save size={14} /> Save Changes
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
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-white">{item.name}</h3>
                            <p className="text-secondary text-sm font-medium italic">{item.tagline}</p>
                          </div>
                          <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase"
                            style={{
                              backgroundColor: bgColor,
                              color: item.color === "ARCTIC" ? "#000" : "#fff",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            {item.color}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">
                          {item.description}
                        </p>
                        {item.highlight && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {(Array.isArray(item.highlight) ? item.highlight : []).map(
                              (h, i) => (
                                <span
                                  key={i}
                                  className="bg-white/5 border border-white/5 text-zinc-300 text-xs px-2 py-1 rounded-md"
                                >
                                  {h}
                                </span>
                              )
                            )}
                          </div>
                        )}
                        <button
                          onClick={() => startEdit(item)}
                          className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all border border-white/5"
                        >
                          <Edit3 size={14} /> Edit Hero Item
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

      {!loading && items.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          No hero items found.
        </div>
      )}
    </div>
  );
}
