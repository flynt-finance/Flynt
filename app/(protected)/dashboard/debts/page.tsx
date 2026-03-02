"use client";

import { useDebts, Importance } from "@/contexts/DebtContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  AlertTriangle,
  Calendar,
  Trash2,
  CheckCircle2,
  TrendingDown,
  Clock,
  ArrowRight,
} from "lucide-react";

// Helper for dynamic styling based on weight
const getWeightConfig = (importance: Importance) => {
  const configs: Record<
    Importance,
    { accent: string; bg: string; border: string; glow: string; label: string }
  > = {
    critical: {
      accent: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      glow: "shadow-red-500/10",
      label: "Urgent Action Required",
    },
    high: {
      accent: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      glow: "shadow-orange-500/10",
      label: "Priority Obligation",
    },
    medium: {
      accent: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      glow: "shadow-yellow-500/10",
      label: "Standard Debt",
    },
    low: {
      accent: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      glow: "shadow-blue-500/10",
      label: "Flexible Terms",
    },
  };
  return configs[importance] || configs.medium;
};

export default function DebtsPage() {
  const { debts, deleteDebt } = useDebts();
  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  const handleDelete = (id: string, name: string) => {
    // In a real Flynt UI, we'd use a custom Modal, but keeping logic consistent
    if (window.confirm(`Confirm full settlement for "${name}"?`)) {
      deleteDebt(id);
      toast.success(`Debt for ${name} cleared from ledger.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Header Ledger Summary */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="text-red-500" size={20} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Liability Tracker
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-text-secondary dark:text-white">
            Debt Notes
          </h1>
        </div>

        <div className="bg-bg-secondary dark:bg-[#0D1131] border border-slate-200 dark:border-white/5 p-4 rounded-xl  flex items-center gap-6">
          <div className="pr-6 border-r border-slate-100 dark:border-white/5">
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">
              Outstanding
            </p>
            <p className="text-2xl font-mono font-bold text-red-500">
              ₦{totalDebt.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">
              Active Notes
            </p>
            <p className="text-2xl font-mono font-bold text-text-secondary dark:text-white">
              {debts.length}
            </p>
          </div>
        </div>
      </header>

      {debts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-24 flex flex-col bg-bg-secondary dark:bg-[#0D1131] items-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl"
        >
          <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-xl font-bold text-text-secondary dark:text-white">Clean Slate</h2>
          <p className="text-slate-500 text-sm">
            You have no outstanding debt notes at this time.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {debts.map((debt) => {
              const config = getWeightConfig(debt.importance);
              const isOverdue = new Date(debt.deadline) < new Date();

              return (
                <motion.div
                  key={debt.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  className={`group relative bg-white dark:bg-[#0D1131] border-t-4 ${config.border.replace("border-", "border-t-")} border-x border-b border-slate-200 dark:border-white/5 p-6 rounded-xl hover:shadow-2xl ${config.glow} transition-all`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={`${config.bg} ${config.accent} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}
                    >
                      {config.label}
                    </div>
                    <button
                      onClick={() => handleDelete(debt.id, debt.name)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-1 mb-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-tight">
                      {debt.name}
                    </h3>
                    <p className="text-3xl font-mono font-bold text-slate-900 dark:text-white">
                      ₦{debt.amount.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={14} />
                        <span>
                          Due {new Date(debt.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      {isOverdue && (
                        <div className="flex items-center gap-1 text-red-500 animate-pulse">
                          <AlertTriangle size={14} />
                          <span>OVERDUE</span>
                        </div>
                      )}
                    </div>

                    {/* Visual Progress Bar - Represents "Time to Deadline" */}
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }} // Logic could be (TimeElapsed / TotalTime)
                        className={`h-full ${isOverdue ? "bg-red-500" : "bg-slate-400"}`}
                      />
                    </div>

                    <button className="w-full group/btn flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all">
                      Settle Note
                      <ArrowRight
                        size={14}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Debt Strategy Tips */}
      <footer className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl bg-bg-secondary dark:bg-slate-900 text-white flex gap-4 items-start">
          <div className="p-3 bg-bg-primary rounded-xl text-yellow-400">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="font-bold mb-1 text-text-secondary dark:text-slate-300">Snowball Method</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pay off your smallest debts first to build momentum. The
              psychological win of clearing a note is powerful.
            </p>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-bg-secondary dark:bg-slate-900 border border-slate-200 dark:border-white/5 dark:text-white flex gap-4 items-start">
          <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl text-blue-500">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="font-bold mb-1 text-text-secondary dark:text-slate-300">Interest Warning</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unsettled debts can impact your internal Flynt credit score. Aim
              to clear &quot;Critical&quot; notes 48 hours before deadline.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
