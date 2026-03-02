"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Target,
  Zap,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  BrainCircuit,
  History,
  Bell,
} from "lucide-react";

// Mock Components - Assume these are your UI primitives
interface StatCardProps {
  title: string;
  value: number;
  status?: string;
  icon: React.ComponentType<{ size: number }>;
}

const StatCard = ({ title, value, status, icon: Icon }: StatCardProps) => (
  <div className="bg-bg-secondary dark:bg-[#0D1131] border border-slate-200 dark:border-white/5 p-5 rounded-xl relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-xl bg-bg-primary dark:bg-white/5 text-slate-600 dark:text-slate-400">
        <Icon size={18} />
      </div>
      <span
        className={`text-[10px] font-bold uppercase tracking-widest ${status === "warning" ? "text-orange-500" : "text-emerald-500"}`}
      >
        ● {status || "Active"}
      </span>
    </div>
    <p className="text-xs font-medium text-slate-500 uppercase tracking-tighter">
      {title}
    </p>
    <p className="text-2xl font-mono font-bold text-text-secondary dark:text-white mt-1">
      ₦{value.toLocaleString()}
    </p>
  </div>
);

export default function BudgetPage() {
  const [essentials, setEssentials] = useState(150000);
  const [discretionary, setDiscretionary] = useState(90000);
  const [savings, setSavings] = useState(60000);

  const totalIncome = 300000;
  const totalAllocated = essentials + discretionary + savings;
  const remaining = totalIncome - totalAllocated;

  const spent = 84500;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 pb-24">
      {/* Header Intelligence */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
              Fiscal Year 2026
            </div>
            <span className="text-slate-400 text-xs font-medium">
              Cycle: Feb 01 - Feb 28
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-text-secondary dark:text-white">
            Financial Governance
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:scale-105 transition-transform shadow-xl shadow-emerald-500/10">
            <Plus size={18} /> Save Allocation
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Inflow"
          value={totalIncome}
          icon={TrendingUp}
        />
        <StatCard
          title="Allocated"
          value={totalAllocated}
          icon={Target}
          status={remaining < 0 ? "warning" : "active"}
        />
        <StatCard title="Total Spent" value={spent} icon={Zap} />
        <div className="bg-emerald-500 p-5 rounded-xl text-white shadow-lg shadow-emerald-500/20">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-100">
            Safe to Spend
          </p>
          <p className="text-3xl font-mono font-bold mt-2">
            ₦{remaining.toLocaleString()}
          </p>
          <div className="mt-4 h-1 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white" style={{ width: "65%" }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Allocation Controller */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-bg-secondary dark:bg-[#0D1131] border border-slate-200 dark:border-white/5 rounded-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2 text-text-secondary dark:text-white">
                <BrainCircuit className="text-emerald-500" /> Live Allocation
              </h2>
              <div className="text-xs font-mono text-slate-400">
                Drag to adjust
              </div>
            </div>

            <div className="space-y-12">
              {[
                {
                  label: "Essentials",
                  val: essentials,
                  set: setEssentials,
                  color: "bg-emerald-500",
                  desc: "Rent, power, data & food",
                },
                {
                  label: "Discretionary",
                  val: discretionary,
                  set: setDiscretionary,
                  color: "bg-blue-500",
                  desc: "Lifestyle, dining & movie nights",
                },
                {
                  label: "Savings",
                  val: savings,
                  set: setSavings,
                  color: "bg-purple-500",
                  desc: "Emergency fund & stock index",
                },
              ].map((item) => (
                <div key={item.label} className="group">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h4 className="font-bold text-text-secondary dark:text-white">
                        {item.label}
                      </h4>
                      <p className="text-xs text-text-primary">{item.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-mono font-bold">
                        ₦{item.val.toLocaleString()}
                      </span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {Math.round((item.val / totalIncome) * 100)}% of Inflow
                      </p>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={totalIncome}
                    step="1000"
                    value={item.val}
                    onChange={(e) => item.set(parseInt(e.target.value))}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-bg-primary dark:bg-white/5 accent-emerald-500`}
                  />
                </div>
              ))}
            </div>

            <AnimatePresence>
              {remaining < 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500"
                >
                  <AlertCircle size={20} />
                  <p className="text-sm font-bold">
                    Deficit Detected: You are over-allocated by ₦
                    {Math.abs(remaining).toLocaleString()}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Quick Actions Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickAction
              icon={ShieldCheck}
              label="Safe Lock"
              sub="Secure leftovers"
              color="text-emerald-500"
            />
            <QuickAction
              icon={Bell}
              label="Alerts"
              sub="Smart reminders"
              color="text-purple-500"
            />
            <QuickAction
              icon={History}
              label="Audit"
              sub="View past cycles"
              color="text-blue-500"
            />
          </div>
        </div>

        {/* Sidebar Intelligence */}
        <div className="space-y-6">
          <div className="bg-bg-primary dark:bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden border border-border-primary dark:border-white/5">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-primary dark:text-white">
                <Zap className="text-yellow-400 fill-yellow-400" /> Flynt AI
                Suggests
              </h3>
              <p className="text-sm text-text-primary leading-relaxed mb-6">
                &quot;We noticed your **Discretionary** spend usually peaks on
                Fridays. If you cut 10% from dining out, you could hit your
                **Savings** goal 4 months earlier.&quot;
              </p>
              <button className="w-full py-3 rounded-xl text-text-primary bg-bg-secondary dark:bg-white/5 hover:bg-white/20 border border-white/10 text-xs font-bold uppercase tracking-widest transition-all">
                Apply AI Optimization
              </button>
            </div>
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/20 blur-[100px]" />
          </div>

          <div className="bg-bg-primary dark:bg-[#0D1131] border border-border-primary dark:border-white/5 rounded-xl p-8">
            <h3 className="font-bold mb-4">Rule of Thumb</h3>
            <div className="space-y-4">
              <RuleItem
                label="Needs"
                percent={50}
                current={Math.round((essentials / totalIncome) * 100)}
              />
              <RuleItem
                label="Wants"
                percent={30}
                current={Math.round((discretionary / totalIncome) * 100)}
              />
              <RuleItem
                label="Invest"
                percent={20}
                current={Math.round((savings / totalIncome) * 100)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: React.ComponentType<{ size: number }>;
  label: string;
  sub: string;
  color: string;
}

function QuickAction({ icon: Icon, label, sub, color }: QuickActionProps) {
  return (
    <button className="p-4 rounded-xl bg-bg-secondary dark:bg-[#0D1131] border border-slate-200 dark:border-white/5 flex flex-col items-center text-center gap-1 group hover:border-emerald-500/50 transition-all">
      <div
        className={`p-3 rounded-xl bg-bg-primary dark:bg-white/5 ${color} mb-2 group-hover:scale-110 transition-transform`}
      >
        <Icon size={20} />
      </div>
      <span className="text-sm font-bold text-text-secondary dark:text-white">{label}</span>
      <span className="text-[10px] text-text-primary font-bold uppercase tracking-tighter">
        {sub}
      </span>
    </button>
  );
}

interface RuleItemProps {
  label: string;
  percent: number;
  current: number;
}

function RuleItem({ label, percent, current }: RuleItemProps) {
  const diff = current - percent;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
        <span className="text-text-primary dark:text-slate-400">
          {label} ({percent}%)
        </span>
        <span className={diff > 0 ? "text-orange-500" : "text-emerald-500"}>
          {current}%
        </span>
      </div>
      <div className="h-1 w-full bg-bg-secondary dark:bg-white/5 rounded-full">
        <div
          className={`h-full rounded-full ${diff > 0 ? "bg-orange-500" : "bg-emerald-500"}`}
          style={{ width: `${current}%` }}
        />
      </div>
    </div>
  );
}
