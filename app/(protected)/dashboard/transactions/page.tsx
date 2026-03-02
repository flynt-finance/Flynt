"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  MoreHorizontal,
  Calendar,
} from "lucide-react";

// Mock data enhanced with card associations
const transactions = [
  {
    id: 1,
    merchant: "Uber Eats",
    amount: -5000,
    category: "Food",
    date: "2026-01-28",
    icon: "🍔",
    status: "completed",
    card: "Zenith",
    cardColor: "bg-red-500",
  },
  {
    id: 2,
    merchant: "Jumia Food",
    amount: -3500,
    category: "Food",
    date: "2026-01-27",
    icon: "🍕",
    status: "completed",
    card: "Access",
    cardColor: "bg-orange-500",
  },
  {
    id: 3,
    merchant: "Uber",
    amount: -2000,
    category: "Transport",
    date: "2026-01-26",
    icon: "🚗",
    status: "completed",
    card: "Zenith",
    cardColor: "bg-red-500",
  },
  {
    id: 5,
    merchant: "DSTV",
    amount: -15000,
    category: "Bills",
    date: "2026-01-23",
    icon: "📺",
    status: "completed",
    card: "UBA",
    cardColor: "bg-red-700",
  },
  {
    id: 13,
    merchant: "Salary",
    amount: 300000,
    category: "Income",
    date: "2026-01-01",
    icon: "💰",
    status: "completed",
    card: "Zenith",
    cardColor: "bg-red-500",
  },
  // ... adding more for the UI feel
];

const categories = [
  "all",
  "Food",
  "Transport",
  "Bills",
  "Subscriptions",
  "Income",
];

export default function TransactionsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredTransactions = transactions.filter((txn) => {
    const matchesFilter = filter === "all" || txn.category === filter;
    const matchesSearch = txn.merchant
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Header Intelligence Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-500">
              Live Ledger Sync
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-secondary dark:text-white">
            Transaction Analytics
          </h1>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <p className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">
              Inflow
            </p>
            <p className="text-sm font-mono font-bold text-emerald-500">
              +₦300,000
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <p className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">
              Outflow
            </p>
            <p className="text-sm font-mono font-bold text-red-500">-₦25,500</p>
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <div className="sticky top-4 z-30 flex flex-col md:flex-row gap-4 p-2 rounded-2xl bg-bg-secondary dark:bg-[#0D1131]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search merchant, card, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none py-2 pl-10 text-sm focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto px-2 md:px-0">
          <Filter className="h-4 w-4 text-slate-400 hidden md:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filter === cat
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.map((txn) => (
            <motion.div
              key={txn.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="group relative flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-bg-secondary dark:bg-[#0D1131] hover:border-emerald-500/30 dark:hover:bg-white/[0.02] transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Visual Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bg-primary dark:bg-white/5 text-xl group-hover:scale-110 transition-transform">
                  {txn.icon}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-text-secondary dark:text-white">
                      {txn.merchant}
                    </h3>
                    {/* CARD INDICATOR */}
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-bg-secondary dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${txn.cardColor}`}
                      />
                      <span className="text-[9px] font-mono font-bold uppercase text-slate-500">
                        {txn.card}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
                    <span className="flex items-center gap-1 uppercase tracking-tighter">
                      <Calendar className="h-3 w-3" />
                      {new Date(txn.date).toLocaleDateString("en-NG", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="uppercase tracking-widest text-[9px] px-1.5 py-0.5 rounded bg-bg-primary dark:bg-white/5">
                      {txn.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right flex items-center gap-4">
                <div className="hidden md:block">
                  <p
                    className={`text-lg font-mono font-bold ${txn.amount > 0 ? "text-emerald-500" : "text-text-secondary dark:text-white"}`}
                  >
                    {txn.amount > 0 ? "+" : ""}₦
                    {Math.abs(txn.amount).toLocaleString()}
                  </p>
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">
                    {txn.status}
                  </p>
                </div>

                {txn.amount > 0 ? (
                  <ArrowDownLeft className="h-5 w-5 text-emerald-500" />
                ) : (
                  <ArrowUpRight className="h-5 w-5 text-slate-300" />
                )}

                <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
            <Search className="h-8 w-8 text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
              Zero Matching Protocols Found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
