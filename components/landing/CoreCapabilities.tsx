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
    size: "lg",
  },
  {
    id: "debt",
    title: "Real-Time Monitoring",
    desc: "Stay updated with every transaction as it happens, with instant categorization and alerts.",
    icon: <Layers className="w-5 h-5" />,
    size: "lg",
  },
  {
    id: "forcasting",
    title: "AI Forecasting",
    desc: "Predictive cash-flow analysis to see your future balance and plan with confidence.",
    icon: <Repeat className="w-5 h-5" />,
    size: "md",
  },
  {
    id: "insights",
    title: "Risk Scoring",
    desc: "Proactive alerts to identify financial vulnerabilities before they become problems.",
    icon: <TrendingUp className="w-5 h-5" />,
    size: "lg",
  },
  {
    id: "expense",
    title: "Expense Optimization",
    desc: "Automatically identify and cancel unused subscriptions to stop money leaks.",
    icon: <CreditCard className="w-5 h-5" />,
    size: "md",
  },
  {
    id: "reallocation",
    title: "Smart Reallocation",
    desc: "Guidance on moving idle funds toward savings and investments for maximum growth.",
    icon: <BarChart4 className="w-5 h-5" />,
    size: "md",
  },
  {
    id: "planning",
    title: "Long-Term Planning",
    desc: "Support for sustainable, multi-year financial health with evolving recommendations",
    icon: <BarChart4 className="w-5 h-5" />,
    size: "md",
  },
];

export default function CoreCapabilities() {
  return (
    <section className="bg-bg-primary dark:bg-[#0A0D27] py-10 lg:py-32">
      <div className="container mx-auto max-w-7xl px-1">
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
      </div>
    </section>
  );
}
