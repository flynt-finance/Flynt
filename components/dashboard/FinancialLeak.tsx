"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  XCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ZapOff,
} from "lucide-react";

interface Leak {
  id: string;
  source: string;
  amount: number;
  reason: string;
  severity: "critical" | "moderate" | "minor";
}

const initialLeaks: Leak[] = [
  {
    id: "l1",
    source: "Bank Charges",
    amount: 24500,
    reason: "Unauthorized recurring fee from Zenith Bank",
    severity: "critical",
  },
  {
    id: "l2",
    source: "Uber Logic",
    amount: 12000,
    reason: "Surge pricing anomaly detected",
    severity: "moderate",
  },
  {
    id: "l3",
    source: "Undefined POS Transaction",
    amount: 1200,
    reason: "Suspicious card charge with no merchant info",
    severity: "minor",
  },
];

export default function FinancialLeaksSystem() {
  const [leaks, setLeaks] = useState<Leak[]>(initialLeaks);
  const [pluggingId, setPluggingId] = useState<string | null>(null);

  const plugLeak = (id: string) => {
    setPluggingId(id);
    // Simulate smart contract or bank API call to cancel/block
    setTimeout(() => {
      setLeaks(leaks.filter((l) => l.id !== id));
      setPluggingId(null);
    }, 1500);
  };

  const totalLeakage = leaks.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-bg-secondary dark:bg-[#0D1131]">
      {/* Diagnostic Header */}
      <div className="bg-bg-secondary p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-400 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary">
              Leak Detection System
            </h3>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-3xl  font-bold text-text-secondary dark:text-white tracking-tight">
            ₦{totalLeakage.toLocaleString()}
            <span className="text-xs text-text-secondary ml-2 font-normal uppercase tracking-tighter">
              / monthly leakage
            </span>
          </div>
          <p className="text-[10px] text-text-secondary  font-mono italic">
            {leaks.length > 0
              ? `> ${leaks.length} vulnerabilities identified`
              : "> All leaks successfully plugged"}
          </p>
        </div>
      </div>

      {/* Leaks Feed */}
      <div className="p-4 space-y-3 min-h-[300px] bg-slate-50/50 dark:bg-transparent">
        <AnimatePresence mode="popLayout">
          {leaks.map((leak) => (
            <motion.div
              key={leak.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              className="relative group flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/2 hover:border-blue-500/30 transition-all"
            >
              <div className="flex gap-3">
                <div
                  className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                    leak.severity === "critical"
                      ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                      : leak.severity === "moderate"
                        ? "bg-amber-500"
                        : "bg-slate-400"
                  }`}
                />
                <div>
                  <h4 className="text-sm font-bold text-text-secondary dark:text-white leading-none mb-1">
                    {leak.source}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mb-2">
                    {leak.reason}
                  </p>
                  <div className="text-xs font-bold text-slate-900 dark:text-blue-400 font-mono">
                    - ₦{leak.amount.toLocaleString()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => plugLeak(leak.id)}
                disabled={pluggingId === leak.id}
                className={`shrink-0 flex items-center justify-center h-10 w-10 rounded-lg border transition-all ${
                  pluggingId === leak.id
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-slate-200 dark:border-white/10 text-slate-400 hover:border-blue-500 hover:text-blue-500"
                }`}
              >
                {pluggingId === leak.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ZapOff className="w-4 h-4" />
                )}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {leaks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Treasury Secured
            </h4>
            <p className="text-xs text-slate-500">
              No active leaks detected in current fiscal cycle.
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer Governance Note */}
      <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10">
        <button className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">
          View full vulnerability report
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function Loader2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  );
}
