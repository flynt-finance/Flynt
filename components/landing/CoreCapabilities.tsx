"use client";

import React from "react";
import {
  ShieldAlert,
  Layers,
  Repeat,
  TrendingUp,
  CreditCard,
  BarChart4,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

const capabilities = [
  {
    id: "predictive",
    title: "Secure Aggregation",
    desc: "A single, encrypted source of truth for all your accounts — banks, credit cards, loans, and investments.",
    icon: <ShieldAlert className="w-5 h-5" />,
    status: "Active Scan",
    size: "lg",
  },
  {
    id: "debt",
    title: "Real-Time Monitoring",
    desc: "Intelligent analysis of your cash flow to deliver personalized, actionable fiscal guidance.",
    icon: <Layers className="w-5 h-5" />,
    status: "Logic: Online",
    size: "lg",
  },
  {
    id: "subscriptions",
    title: "Leakage Prevention",
    desc: "Autonomous identification and termination of inefficient recurring drains.",
    icon: <Repeat className="w-5 h-5" />,
    status: "Monitoring",
    size: "md",
  },
  {
    id: "insights",
    title: "Equity Allocation",
    desc: "Data-driven stock recommendations aligned with your risk profile and liquid position.",
    icon: <TrendingUp className="w-5 h-5" />,
    status: "Market Sync",
    size: "md",
  },
  {
    id: "virtual",
    title: "Smart Card Governance",
    desc: "Dynamic spend limits enforced at the point of authorization based on your active budget.",
    icon: <CreditCard className="w-5 h-5" />,
    status: "Secure",
    size: "md",
  },
  {
    id: "credit",
    title: "Credit Intelligence",
    desc: "Seamless monitoring and real-time insights into your institutional creditworthiness.",
    icon: <BarChart4 className="w-5 h-5" />,
    status: "Verified",
    size: "md",
  },
];

export default function CoreCapabilities() {
  return (
    <section className="bg-bg-primary dark:bg-[#0A0D27] py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-emerald-500" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500">
                Operating Modules
              </h2>
            </div>
            <h3 className="text-4xl font-medium tracking-tight text-text-secondary dark:text-white md:text-5xl">
              Everything you need for <br />
              <span className="text-slate-400 font-light italic">
                Financial clarity.
              </span>
            </h3>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
          {capabilities.map((cap, idx) => (
            <motion.div
              key={cap.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`
                relative group overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 
                bg-bg-secondary dark:bg-[#0D1131]/50 p-8 transition-all hover:border-emerald-500/30
                ${cap.size === "lg" ? "md:col-span-3 lg:col-span-6" : "md:col-span-3 lg:col-span-3"}
              `}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-16">
                <div className="p-3 bg-bg-primary dark:bg-white/5 rounded text-slate-900 dark:text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  {cap.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-text-secondary dark:text-slate-500">
                    {cap.status}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-text-secondary dark:text-white flex items-center gap-2">
                  {cap.title}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                  {cap.desc}
                </p>
              </div>

              {/* Decorative Background Element (Visible on Dark Mode) */}
              <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
            </motion.div>
          ))}
        </div>

        {/* Network Status Footer */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-slate-100 dark:border-white/5 pt-8">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
              Connected Nodes:
            </span>
            <div className="flex gap-4 opacity-40 grayscale hover:grayscale-0 transition-all">
              {/* Small Bank Placeholder Icons */}
              <div className="text-[10px] font-mono font-bold text-text-secondary dark:text-white border border-slate-200 dark:border-white/10 px-2 py-1 rounded">
                ZENITH
              </div>
              <div className="text-[10px] font-mono font-bold text-text-secondary dark:text-white border border-slate-200 dark:border-white/10 px-2 py-1 rounded">
                ACCESS
              </div>
              <div className="text-[10px] font-mono font-bold text-text-secondary dark:text-white border border-slate-200 dark:border-white/10 px-2 py-1 rounded">
                GTB
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Real-time Synchronization Active
          </div>
        </div>
      </div>
    </section>
  );
}
