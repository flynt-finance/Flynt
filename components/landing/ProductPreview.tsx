"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  Ban,
  CheckCircle2,
  Activity,
  Plug,
} from "lucide-react";

const activityFeed = [
  {
    id: 1,
    type: "block",
    label: "Fraud blocked",
    detail: "₦450,000 transfer — unusual location",
    time: "2m ago",
    icon: <Ban className="w-3 h-3" />,
    color: "red",
  },
  {
    id: 2,
    type: "flag",
    label: "Flagged for review",
    detail: "₦85,000 POS — new device detected",
    time: "8m ago",
    icon: <AlertTriangle className="w-3 h-3" />,
    color: "amber",
  },
  {
    id: 3,
    type: "approve",
    label: "Transaction approved",
    detail: "₦12,500 transfer — low risk (14%)",
    time: "12m ago",
    icon: <CheckCircle2 className="w-3 h-3" />,
    color: "emerald",
  },
  {
    id: 4,
    type: "sync",
    label: "API health check",
    detail: "All endpoints responding — 12ms avg",
    time: "1h ago",
    icon: <Activity className="w-3 h-3" />,
    color: "blue",
  },
];

const colorMap: Record<string, string> = {
  emerald: "text-emerald-500 bg-emerald-500/10",
  amber: "text-amber-500 bg-amber-500/10",
  blue: "text-blue-500 bg-blue-500/10",
  red: "text-red-500 bg-red-500/10",
};

export default function ProductPreview() {
  return (
    <section className="relative bg-bg-primary dark:bg-[#0A0D27] py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-1 relative z-10">
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
                See It In Action
              </h2>
            </div>
            <h3 className="text-4xl font-medium tracking-tight text-text-secondary dark:text-white md:text-5xl">
              Your fraud dashboard,{" "}
              <span className="text-slate-400 font-light italic">
                powered by Flynt.
              </span>
            </h3>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md lg:text-right">
            Once Flynt is connected, your team gets a clear view of every
            transaction — what was approved, what was flagged, and what was
            stopped before it caused damage.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-bg-secondary dark:bg-[#0D1131]/60 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              </div>
              <span className="ml-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                flynt://fraud-monitor
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Plug className="w-3 h-3 text-emerald-500" />
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-widest">
                API Connected
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-white/5">
            {/* Left: fraud stats */}
            <div className="p-8 space-y-6">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1">
                  Transactions Today
                </p>
                <p className="text-3xl font-mono font-bold text-text-secondary dark:text-white">
                  24,891
                </p>
                <p className="text-[10px] font-mono text-slate-400 mt-1">
                  Scanned by Flynt API
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Approved", count: "24,712", pct: 99.3, color: "bg-emerald-500" },
                  { label: "Flagged", count: "156", pct: 0.6, color: "bg-amber-500" },
                  { label: "Blocked", count: "23", pct: 0.1, color: "bg-red-500" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {s.label}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-text-secondary dark:text-white">
                        {s.count}
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-slate-100 dark:bg-white/5">
                      <motion.div
                        className={`h-1 rounded-full ${s.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.pct}%` }}
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
                    Fraud Prevented
                  </p>
                  <p className="text-base font-mono font-bold text-emerald-500 mt-0.5">
                    ₦4.2M
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
                    Avg Response
                  </p>
                  <p className="text-base font-mono font-bold text-text-secondary dark:text-white mt-0.5">
                    12ms
                  </p>
                </div>
              </div>
            </div>

            {/* Center: latest alert */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-red-500">
                    Latest Alert
                  </span>
                  <div className="h-px flex-1 bg-red-500/20" />
                </div>

                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-red-500/10 text-red-500 mt-0.5">
                      <Ban className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-secondary dark:text-white">
                        Transfer blocked — High risk (92%)
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        ₦450,000 sent from Lagos to an account in a high-risk
                        region. Amount is 8× the user&apos;s average. Device
                        fingerprint mismatch detected.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-bg-primary dark:bg-white/5 p-3">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                      Why Flynt blocked this
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Unusual amount + new recipient + location mismatch =
                      92% fraud probability. Customer notified automatically.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                      Protection Score
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-500">
                      99.7% effective
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/5">
                    <motion.div
                      className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: "99.7%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Encrypted · SOC 2 ready · Audit trail enabled</span>
              </div>
            </div>

            {/* Right: activity feed */}
            <div className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-slate-400">
                  Live Activity
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
