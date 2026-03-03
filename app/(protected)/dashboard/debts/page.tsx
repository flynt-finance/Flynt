"use client";

import { useState } from "react";
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
  Plus,
  Brain,
} from "lucide-react";

/* -----------------------------
   Types
------------------------------ */

type Importance = "critical" | "high" | "medium" | "low";

interface Debt {
  id: string;
  name: string;
  amount: number;
  deadline: string;
  status: "active" | "settled";
  importance: Importance;
  aiInsight: string;
}

/* -----------------------------
   Dummy AI Logic
------------------------------ */

// Simulated monthly inflow
const MONTHLY_INFLOW = 350000;

function analyzeDebt(
  amount: number,
  deadline: string,
): { importance: Importance; insight: string } {
  const daysLeft =
    (new Date(deadline).getTime() - new Date().getTime()) /
    (1000 * 60 * 60 * 24);

  let importance: Importance = "medium";

  if (daysLeft < 3) importance = "critical";
  else if (daysLeft < 7) importance = "high";
  else if (daysLeft < 21) importance = "medium";
  else importance = "low";

  const canRepay = amount <= MONTHLY_INFLOW * 0.4;

  let insight = "";

  if (importance === "critical" && !canRepay) {
    insight =
      "⚠️ This debt is critical and exceeds safe repayment range. Renegotiation is advised immediately.";
  } else if (importance === "critical" && canRepay) {
    insight =
      "🚨 Immediate repayment recommended. You have sufficient inflow coverage.";
  } else if (!canRepay) {
    insight =
      "Your current inflow may struggle to cover this comfortably. Consider staggered repayment.";
  } else {
    insight =
      "This debt is manageable within your inflow. Schedule repayment before deadline.";
  }

  return { importance, insight };
}

/* -----------------------------
   Styling Config
------------------------------ */

const getWeightConfig = (importance: Importance) => {
  const configs: Record<
    Importance,
    { accent: string; bg: string; border: string; label: string }
  > = {
    critical: {
      accent: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500",
      label: "Critical",
    },
    high: {
      accent: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500",
      label: "High",
    },
    medium: {
      accent: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500",
      label: "Medium",
    },
    low: {
      accent: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500",
      label: "Low",
    },
  };
  return configs[importance];
};

/* -----------------------------
   Page Component
------------------------------ */

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    amount: "",
    deadline: "",
    status: "active",
  });

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  const createDebt = () => {
    if (!form.name || !form.amount || !form.deadline) {
      toast.error("All fields are required.");
      return;
    }

    const { importance, insight } = analyzeDebt(
      Number(form.amount),
      form.deadline,
    );

    const newDebt: Debt = {
      id: crypto.randomUUID(),
      name: form.name,
      amount: Number(form.amount),
      deadline: form.deadline,
      status: "active",
      importance,
      aiInsight: insight,
    };

    setDebts((prev) => [newDebt, ...prev]);

    toast.success("Debt note created with AI assessment.");
    setOpenModal(false);
    setForm({ name: "", amount: "", deadline: "", status: "active" });
  };

  const deleteDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-text-secondary dark:text-white">
            Debt Notes
          </h1>
          <p className="text-sm text-slate-500">
            Outstanding: ₦{totalDebt.toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-all"
        >
          <Plus size={16} />
          Create Debt Note
        </button>
      </header>

      {/* Debt Cards */}
      {debts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-24 flex flex-col bg-bg-secondary dark:bg-[#0D1131] items-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl"
        >
          <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-xl font-bold text-text-secondary dark:text-white">
            Clean Slate
          </h2>
          <p className="text-slate-500 text-sm">
            You have no outstanding debt notes at this time.
          </p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {debts.map((debt) => {
              const config = getWeightConfig(debt.importance);
              const isOverdue = new Date(debt.deadline) < new Date();

              return (
                <motion.div
                  key={debt.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-6 rounded-xl border-t-4 ${config.border} border bg-white dark:bg-[#0D1131]`}
                >
                  <div className="flex justify-between mb-4">
                    <span
                      className={`${config.bg} ${config.accent} px-3 py-1 rounded-full text-xs font-bold`}
                    >
                      {config.label}
                    </span>

                    <button
                      onClick={() => deleteDebt(debt.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 className="font-bold text-lg">{debt.name}</h3>
                  <p className="text-2xl font-mono mb-4">
                    ₦{debt.amount.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between text-xs mb-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={14} />
                      {new Date(debt.deadline).toLocaleDateString()}
                    </div>
                    {isOverdue && (
                      <span className="text-red-500 flex items-center gap-1">
                        <AlertTriangle size={14} /> OVERDUE
                      </span>
                    )}
                  </div>

                  {/* AI Insight */}
                  <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-500">
                      <Brain size={14} />
                      Flynt AI Assessment
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {debt.aiInsight}
                    </p>
                  </div>

                  <button className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-900 hover:text-white transition-all text-xs font-bold">
                    Settle Note
                    <ArrowRight size={14} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-[#0D1131] p-8 rounded-2xl w-full max-w-md space-y-6"
            >
              <h2 className="text-xl font-bold">Create Debt Note</h2>

              <input
                placeholder="Debt Name"
                className="w-full p-3 rounded-xl border"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-full p-3 rounded-xl border"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              <input
                type="date"
                className="w-full p-3 rounded-xl border"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setOpenModal(false)}
                  className="text-sm text-slate-500"
                >
                  Cancel
                </button>
                <button
                  onClick={createDebt}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
