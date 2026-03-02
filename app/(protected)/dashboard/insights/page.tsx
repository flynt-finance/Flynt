"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  MoreHorizontal,
  X,
} from "lucide-react";

// Mock Data Extensions
const SUMMARY_STATS = [
  {
    label: "Active Nodes",
    value: "05",
    sub: "Unread",
    icon: BrainCircuit,
    color: "text-blue-500",
  },
  {
    label: "Projected Delta",
    value: "₦16k",
    sub: "Potential",
    icon: Zap,
    color: "text-emerald-500",
  },
  {
    label: "Model Integrity",
    value: "86%",
    sub: "Accuracy",
    icon: ShieldCheck,
    color: "text-purple-500",
  },
  {
    label: "Fiscal Pulse",
    value: "92/100",
    sub: "Health",
    icon: Sparkles,
    color: "text-orange-500",
  },
];

export default function InsightsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 p-6 pb-24 dark:text-white">
      {/* Dynamic Intelligence Header */}
      <header className="flex flex-col md:flex-row justify-between gap-6 items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Live Prediction Engine
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-text-secondary dark:text-white">
            Financial Intelligence
          </h1>
          <p className="text-slate-500 text-sm">
            Real-time heuristics and predictive spending trajectories.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-bg-secondary dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10">
          {["Overview", "Forecasts", "Strategy"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-xl text-xs text-text-primary font-bold transition-all ${tab === "Overview" ? "bg-bg-primary dark:bg-white/10 shadow-sm" : "text-text-secondary hover:text-text-primary dark:hover:text-white hover:bg-bg-elevated dark:hover:bg-white/5"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SUMMARY_STATS.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-bg-secondary dark:bg-[#0D1131] border border-slate-200 dark:border-white/5 p-5 rounded-xl relative overflow-hidden group"
          >
            <stat.icon size={18} className={`${stat.color} mb-3`} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary dark:text-slate-400">
              {stat.label}
            </p>
            <p className="text-2xl font-mono font-bold mt-1 text-text-secondary ">{stat.value}</p>
            <span className="text-[10px] font-medium text-text-secondary">
              {stat.sub}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Predictions */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-bg-secondary dark:bg-[#0D1131] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2 text-text-secondary">
                <TrendingUp className="text-text-secondary" /> Spending
                Trajectories
              </h2>
              <div className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full uppercase tracking-widest">
                EOM Projection
              </div>
            </div>

            <div className="space-y-10">
              <PredictionItem
                category="Food & Dining"
                current={12450}
                predicted={18500}
                budget={20000}
                confidence={85}
                status="on-track"
              />
              <PredictionItem
                category="Logistics"
                current={8500}
                predicted={11200}
                budget={8000}
                confidence={72}
                status="warning"
              />
            </div>
          </section>

          {/* Neural Feed (Insights) */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 ml-4">
              System Alerts
            </h2>
            <InsightCard
              type="warning"
              title="Budget Exhaustion Imminent"
              message="At current velocity, your Food budget will reach 100% in 4.2 days."
              cta="Audit Expenses"
            />
            <InsightCard
              type="info"
              title="Subscription Audit"
              message="Detected 3 recurring charges. Potential ghost-subscription detected: 'Netflix Premium'."
              cta="Resolve"
            />
          </div>
        </div>

        {/* Right Column: AI Strategy */}
        <aside className="space-y-6 text-text-secondary">
          <div className="bg-bg-secondary dark:bg-[#0D1131] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500 flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-text-secondary">Flynt Strategy</h3>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">
                    Optimized for Feb 2026
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Your savings velocity is currently **8% above benchmark**.
                Clearing two minor debt notes could unlock a **₦12,500** monthly
                cashflow surplus.
              </p>

              <div className="space-y-3">
                <StrategyTask text="Switch to weekly meal prep" saving="₦12k" />
                <StrategyTask text="Review transport routing" saving="₦4k" />
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 blur-[80px]" />
          </div>

          <div className="p-8 rounded-[2.5rem] bg-bg-secondary dark:bg-[#0D1131] border border-slate-200 dark:border-white/5">
            <h4 className="font-bold mb-4">Historical Accuracy</h4>
            {/* Simple sparkline visual representation */}
            <div className="flex items-end gap-1 h-12 mb-2">
              {[40, 70, 45, 90, 65, 80, 86].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-emerald-500/20 rounded-t-sm"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">
              System Reliability: 99.4% Uptime
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PredictionItem({
  category,
  current,
  predicted,
  budget,
  confidence,
  status,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  const isOver = predicted > budget;
  return (
    <div className="group">
      <div className="flex justify-between items-end mb-4 text-text-secondary">
        <div>
          <h4 className="font-bold text-lg text-text-secondary">{category}</h4>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400">
            <Clock size={12} /> {confidence}% Prediction Confidence
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-mono font-bold">
            ₦{predicted.toLocaleString()}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Limit: ₦{budget.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="relative h-3 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-bg-primary dark:bg-white/20"
          style={{ width: `${(current / budget) * 100}%` }}
        />
        <div
          className={`absolute top-0 h-full border-l-2 border-dashed border-white dark:border-slate-900 ${isOver ? "bg-red-500" : "bg-emerald-500"}`}
          style={{
            left: `${(current / budget) * 100}%`,
            width: `${((predicted - current) / budget) * 100}%`,
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-bold uppercase">
        <span className="text-slate-400">
          Consumed: ₦{current.toLocaleString()}
        </span>
        <span className={isOver ? "text-red-500" : "text-emerald-500"}>
          {isOver ? "Critical Breach Projected" : "Within Threshold"}
        </span>
      </div>
    </div>
  );
}

interface InsightCardProps {
  type: "warning" | "info";
  title: string;
  message: string;
  cta: string;
}

function InsightCard({ type, title, message, cta }: InsightCardProps) {
  return (
    <div
      className={`p-6 rounded-3xl text-text-secondary border ${type === "warning" ? "bg-red-500/5 border-red-500/20" : "bg-blue-500/5 border-blue-500/20"} flex gap-4 items-start`}
    >
      <div
        className={`p-2 rounded-xl ${type === "warning" ? "bg-red-500/20 text-red-500" : "bg-blue-500/20 text-blue-500"}`}
      >
        {type === "warning" ? <Zap size={18} /> : <BrainCircuit size={18} />}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-sm mb-1">{title}</h4>
          <button className="text-slate-400 hover:text-slate-900">
            <X size={14} />
          </button>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed mb-4">{message}</p>
        <button className="flex text-text-secondary items-center gap-1 text-[10px] font-bold uppercase tracking-widest  dark:text-white hover:gap-2 transition-all">
          {cta} <ArrowUpRight size={12} />
        </button>
      </div>
    </div>
  );
}

interface StrategyTaskProps {
  text: string;
  saving: string;
}

function StrategyTask({ text, saving }: StrategyTaskProps) {
  return (
    <div className="flex items-center text-text-secondary justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
      <span className="text-xs font-medium">{text}</span>
      <span className="text-[10px] font-mono font-bold text-emerald-400">
        +{saving}
      </span>
    </div>
  );
}
