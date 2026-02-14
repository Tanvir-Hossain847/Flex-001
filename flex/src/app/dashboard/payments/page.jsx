"use client";
import React from "react";
import { CreditCard, Plus, History } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold text-white mb-6">Payment Methods</h1>

      {/* Saved Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Visa Card Mock */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-12 translate-x-12" />
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <CreditCard className="text-white/80 w-10 h-10" />
            <span className="text-white font-bold italic text-xl">VISA</span>
          </div>

          <div className="space-y-4 relative z-10">
            <p className="font-mono text-zinc-400 text-lg tracking-widest">
              •••• •••• •••• 4242
            </p>
            <div className="flex justify-between text-xs text-zinc-500 uppercase tracking-wide">
              <span>Card Holder</span>
              <span>Expires</span>
            </div>
            <div className="flex justify-between text-white font-medium">
              <span>John Doe</span>
              <span>12/28</span>
            </div>
          </div>
        </div>

        {/* Mastercard Mock */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -translate-y-12 translate-x-12" />
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <CreditCard className="text-white/80 w-10 h-10" />
            <span className="text-white font-bold italic text-xl">Mastercard</span>
          </div>

          <div className="space-y-4 relative z-10">
            <p className="font-mono text-zinc-400 text-lg tracking-widest">
              •••• •••• •••• 8829
            </p>
            <div className="flex justify-between text-xs text-zinc-500 uppercase tracking-wide">
              <span>Card Holder</span>
              <span>Expires</span>
            </div>
            <div className="flex justify-between text-white font-medium">
              <span>John Doe</span>
              <span>09/26</span>
            </div>
          </div>
        </div>

        {/* Add New Card */}
        <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-2xl hover:border-secondary/50 hover:bg-secondary/5 transition-all group min-h-[220px]">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="text-zinc-400 group-hover:text-secondary" />
          </div>
          <span className="font-bold text-zinc-400 group-hover:text-white">Add New Card</span>
        </button>
      </div>

      {/* Payment History Table */}
      <h2 className="text-xl font-bold text-white mt-12 mb-6 flex items-center gap-2">
        <History className="text-secondary" /> Payment History
      </h2>
      
      <div className="overflow-hidden rounded-2xl border border-white/5">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-zinc-900/50 text-xs uppercase font-medium text-zinc-500">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-zinc-900/20 backdrop-blur-sm">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-white">#TRX-88229{i}</td>
                <td className="px-6 py-4">Feb {10 + i}, 2025</td>
                <td className="px-6 py-4 font-bold text-white">${(100 * i).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <CreditCard size={14} /> Visa •••• 4242
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
