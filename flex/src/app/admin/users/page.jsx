"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const USERS_API = "http://localhost:4000/users";
const ROLES = ["user", "admin", "moderator"];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(USERS_API);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`${USERS_API}/${userId}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      toast.success(`Role updated to "${newRole}"`);
    } catch (err) {
      console.error("Error updating role:", err);
      toast.error("Failed to update role.");
    }
  };

  const filtered = users.filter(
    (u) =>
      (u.displayName || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users size={28} className="text-secondary" /> User Management
          </h1>
          <p className="text-zinc-400 text-sm mt-1">{users.length} registered users</p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search users..."
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
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-bold">
                            {(user.displayName || "U")[0].toUpperCase()}
                          </div>
                        )}
                        <span className="text-white font-medium text-sm">{user.displayName || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={user.role || "user"}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className={`appearance-none bg-transparent border rounded-lg px-3 py-1.5 pr-8 text-xs font-bold uppercase tracking-wider cursor-pointer focus:outline-none transition-colors ${
                            user.role === "admin"
                              ? "border-secondary/40 text-secondary bg-secondary/10"
                              : "border-white/10 text-zinc-300 hover:border-white/20"
                          }`}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r} className="bg-zinc-900 text-white">
                              {r}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-sm">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              No users found matching "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
