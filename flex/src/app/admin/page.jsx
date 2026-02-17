"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Package, Image as ImageIcon, TrendingUp } from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState({ users: 0, products: 0, heroItems: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes, thermosRes] = await Promise.all([
          axios.get("http://localhost:4000/users"),
          axios.get("http://localhost:4000/products"),
          axios.get("http://localhost:4000/thermos"),
        ]);
        setStats({
          users: Array.isArray(usersRes.data) ? usersRes.data.length : 0,
          products: Array.isArray(productsRes.data) ? productsRes.data.length : 0,
          heroItems: Array.isArray(thermosRes.data) ? thermosRes.data.length : 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "from-blue-500 to-blue-700" },
    { label: "Products", value: stats.products, icon: Package, color: "from-emerald-500 to-emerald-700" },
    { label: "Hero Items", value: stats.heroItems, icon: ImageIcon, color: "from-purple-500 to-purple-700" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Admin <span className="text-secondary">Overview</span>
        </h1>
        <p className="text-zinc-400 text-sm">Platform statistics and quick insights.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="relative overflow-hidden bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <TrendingUp size={16} className="text-zinc-600" />
                </div>
                <p className="text-3xl font-bold text-white">{card.value}</p>
                <p className="text-sm text-zinc-400 mt-1">{card.label}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
