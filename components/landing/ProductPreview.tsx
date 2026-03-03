"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CreditCard,
  Cpu,
  Activity,
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const activityFeed = [
  {
    id: 1,
    type: "action",
    label: "DSTV subscription paused",
    detail: "₦8,500 → Palantir (PLTR)",
    time: "2m ago",
    icon: <Zap className="w-3 h-3" />,
    color: "emerald",
  },
  {
    id: 2,
    type: "alert",
    label: "Spend limit triggered",
    detail: "Transport budget 92% used",
    time: "14m ago",
    icon: <AlertCircle className="w-3 h-3" />,
    color: "amber",
  },
  {
    id: 3,
    type: "sync",
    label: "Zenith Bank synced",
    detail: "Balance updated — ₦1,204,100",
    time: "1h ago",
    icon: <CheckCircle2 className="w-3 h-3" />,
    color: "blue",
  },
  {
    id: 4,
    type: "insight",
    label: "Cash flow forecast ready",
    detail: "Projected surplus: ₦42,000",
    time: "3h ago",
    icon: <TrendingUp className="w-3 h-3" />,
    color: "indigo",
  },
];

const colorMap: Record<string, string> = {
  emerald: "text-emerald-500 bg-emerald-500/10",
  amber: "text-amber-500 bg-amber-500/10",
  blue: "text-blue-500 bg-blue-500/10",
  indigo: "text-indigo-500 bg-indigo-500/10",
};

// ─── Component ────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ProductPreview() {
  return (
    <section className="relative bg-bg-primary dark:bg-[#0A0D27] py-24 lg:py-32 overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-1 relative z-10">
        {/* ── SECTION HEADER ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-end"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-emerald-500" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500">
                Live OS Preview
              </h2>
            </div>
            <h3 className="text-4xl font-medium tracking-tight text-text-secondary dark:text-white md:text-5xl">
              Fragmented data, <br />
              <span className="text-slate-400 font-light italic">
                unified intelligence.
              </span>
            </h3>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md lg:text-right">
            Flynt aggregates every account you own into a single operating layer
            — then acts on the insights automatically, so you never have to
            switch between apps again.
          </p>
        </motion.div>

        {/* ── DASHBOARD MOCKUP PANEL ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-bg-secondary dark:bg-[#0D1131]/60 overflow-hidden"
        >
          {/* Panel top bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              </div>
              <span className="ml-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                flynt://dashboard/overview
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-widest">
                Live
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-white/5">
            {/* Left: summary stats */}
            <div className="p-8 space-y-6">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1">
                  Net Worth
                </p>
                <p className="text-3xl font-mono font-bold text-text-secondary dark:text-white">
                  ₦8,204,100
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] font-mono text-emerald-500">
                    +₦142,000 this month
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { bank: "Zenith Bank", amount: "₦4,204,100", pct: 51 },
                  { bank: "Access Bank", amount: "₦2,812,000", pct: 34 },
                  { bank: "UBA", amount: "₦1,188,000", pct: 15 },
                ].map((b) => (
                  <div key={b.bank}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {b.bank}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-text-secondary dark:text-white">
                        {b.amount}
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-slate-100 dark:bg-white/5">
                      <motion.div
                        className="h-1 rounded-full bg-emerald-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${b.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
                    Income
                  </p>
                  <p className="text-base font-mono font-bold text-text-secondary dark:text-white mt-0.5">
                    ₦620k
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
                    Expenses
                  </p>
                  <p className="text-base font-mono font-bold text-text-secondary dark:text-white mt-0.5">
                    ₦478k
                  </p>
                </div>
              </div>
            </div>

            {/* Center: AI insight card */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-amber-500">
                    Neural Suggestion
                  </span>
                  <div className="h-px flex-1 bg-amber-500/20" />
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-amber-500/10 text-amber-500 mt-0.5">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-secondary dark:text-white">
                        Pause DSTV subscription
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        You haven't used DSTV in 18 days. Pausing saves
                        ₦8,500/month — redirect to Palantir (PLTR) for compound
                        growth.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 rounded-sm bg-emerald-500 px-3 py-2 text-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        Apply Action
                      </span>
                    </div>
                    <div className="rounded-sm border border-slate-200 dark:border-white/10 px-3 py-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Dismiss
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fiscal health bar */}
                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                      Fiscal Health Score
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-500">
                      A+ / 94.2
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/5">
                    <motion.div
                      className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: "94%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Non-custodial · End-to-end encrypted</span>
              </div>
            </div>

            {/* Right: Live activity feed */}
            <div className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-slate-400">
                  Activity Feed
                </span>
                <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {activityFeed.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-white/5 bg-white/50 dark:bg-white/[0.02]"
                    >
                      <div
                        className={`p-1.5 rounded flex-shrink-0 mt-0.5 ${colorMap[item.color]}`}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-text-secondary dark:text-white truncate">
                          {item.label}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {item.detail}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 flex-shrink-0 mt-0.5">
                        {item.time}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
