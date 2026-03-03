"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Wallet,
  ChevronRight,
  Loader2,
  FileSearch,
  Download,
} from "lucide-react";

interface LiquidityTerminalProps {
  totalBalance: number;
  connectedBanks: { name: string; amount: number; color: string }[];
}

export default function LiquidityTerminal({
  totalBalance = 4820340,
  connectedBanks = [
    { name: "Zenith", amount: 2100000, color: "bg-red-500" },
    { name: "Access", amount: 1520340, color: "bg-orange-500" },
    { name: "UBA", amount: 1200000, color: "bg-red-700" },
  ],
}: LiquidityTerminalProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [auditStatus, setAuditStatus] = useState<
    "idle" | "scanning" | "complete"
  >("idle");

  const runAuditProtocol = () => {
    if (auditStatus === "complete") {
      // Logic for actual file download would go here
      console.log("Downloading Audit Report...");
      return;
    }

    setAuditStatus("scanning");

    // Simulate AI deep-scan across banking nodes
    setTimeout(() => {
      setAuditStatus("complete");
    }, 3500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative h-96 overflow-hidden rounded-2xl border border-slate-100 dark:border-white/10 dark:bg-[#0D1131] bg-bg-secondary p-8"
    >
      {/* Privacy Mask Background Overlay */}
      <AnimatePresence>
        {!isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 backdrop-blur-md bg-white/10 dark:bg-[#0A0D27]/40 flex items-center justify-center pointer-events-none"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Privacy Mode Active
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Wallet className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Total Aggregated Liquidity
              </h3>
              <p className="text-[9px] font-mono text-emerald-500 uppercase">
                Live Node Sync: Zenith • Access • UBA
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-400 dark:text-slate-500"
          >
            {isVisible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Balance Display */}
        <div className="mb-8">
          <motion.div
            animate={{ filter: isVisible ? "blur(0px)" : "blur(8px)" }}
            className="text-4xl md:text-5xl font-mono font-medium tracking-tight text-text-secondary dark:text-white"
          >
            {isVisible
              ? `₦${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : "₦ ••••••••"}
          </motion.div>
        </div>

        {/* Institutional Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-slate-100 dark:border-white/5">
          {connectedBanks.map((bank) => (
            <div key={bank.name} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${bank.color}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {bank.name}
                </span>
              </div>
              <motion.span
                animate={{ filter: isVisible ? "blur(0px)" : "blur(4px)" }}
                className="text-sm font-mono font-medium text-text-secondary dark:text-slate-300"
              >
                {isVisible ? `₦${bank.amount.toLocaleString()}` : "₦ ••••"}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Audit Report Trigger Section */}
        <div className="mt-8 space-y-3">
          <button
            onClick={runAuditProtocol}
            disabled={auditStatus === "scanning"}
            className={`group flex items-center justify-center gap-2 w-full py-4 rounded-lg border transition-all ${
              auditStatus === "complete"
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                : "border-dashed border-slate-200 dark:border-white/10 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50"
            }`}
          >
            <AnimatePresence mode="wait">
              {auditStatus === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                  <FileSearch className="w-3.5 h-3.5" />
                  Request Full Treasury Audit
                  <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </motion.div>
              )}

              {auditStatus === "scanning" && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Analyzing Fiscal Patterns...
                </motion.div>
              )}

              {auditStatus === "complete" && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Governance Report
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Audit Progress Bar */}
          {auditStatus === "scanning" && (
            <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.5, ease: "easeInOut" }}
                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Decorative terminal corner */}
      <div className="absolute top-0 right-0 p-1 pointer-events-none opacity-50">
        <div className="w-8 h-8 border-t border-r border-slate-200 dark:border-white/10 rounded-tr-xl" />
      </div>
    </motion.div>
  );
}
