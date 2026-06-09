"use client";

import React from "react";
import {
  ShieldAlert,
  Zap,
  Brain,
  BarChart4,
  Lock,
  Code,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

const capabilities = [
  {
    id: "realtime",
    title: "Real-Time Fraud Detection",
    desc: "Every transaction is checked the moment it happens — not hours or days later. Stop fraud while it's still happening.",
    icon: <ShieldAlert className="w-5 h-5" />,
    size: "lg",
  },
  {
    id: "scoring",
    title: "Smart Risk Scoring",
    desc: "Each transaction gets a clear risk score from 0 to 100. Set your own thresholds for when to approve, flag, or block.",
    icon: <BarChart4 className="w-5 h-5" />,
    size: "lg",
  },
  {
    id: "automation",
    title: "Automated Actions",
    desc: "Flynt doesn't just alert you — it can block suspicious payments, hold transfers for review, or route cases to your team.",
    icon: <Zap className="w-5 h-5" />,
    size: "md",
  },
  {
    id: "patterns",
    title: "Pattern Recognition",
    desc: "The API learns what normal behavior looks like for your users and spots deviations — like sudden large transfers or unusual locations.",
    icon: <Brain className="w-5 h-5" />,
    size: "lg",
  },
  {
    id: "explainable",
    title: "Clear Explanations",
    desc: "No black boxes. Every decision includes a simple reason — so your team and your customers understand what happened and why.",
    icon: <Code className="w-5 h-5" />,
    size: "md",
  },
  {
    id: "security",
    title: "Bank-Grade Security",
    desc: "Your data is encrypted end-to-end. Flynt never stores sensitive payment details — we analyze signals, not hoard data.",
    icon: <Lock className="w-5 h-5" />,
    size: "md",
  },
];

export default function CoreCapabilities() {
  return (
    <section className="bg-bg-primary dark:bg-[#0A0D27] py-10 lg:py-32">
      <div className="container mx-auto max-w-7xl px-1">
        <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-emerald-500" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500">
                What Flynt Does
              </h2>
            </div>
            <h3 className="text-4xl font-medium tracking-tight text-text-secondary dark:text-white md:text-5xl">
              Clarity. Intelligence.{" "}
              <span className="text-slate-400 font-light italic">
                Automation.
              </span>
            </h3>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
              Flynt gives your system the ability to see threats clearly, think
              fast, and act without waiting for a human — all through a single
              API.
            </p>
          </div>
        </div>

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
              <div className="flex justify-between items-start mb-16">
                <div className="p-3 bg-bg-primary dark:bg-white/5 rounded text-slate-900 dark:text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  {cap.icon}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-text-secondary dark:text-white flex items-center gap-2">
                  {cap.title}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                  {cap.desc}
                </p>
              </div>

              <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
