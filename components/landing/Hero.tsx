"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, ShieldCheck } from "lucide-react";

type RiskLevel = "low" | "medium" | "high";

interface Transaction {
  id: number;
  text: string;
  risk: RiskLevel;
}

const BANKS = ["Zenith", "Access", "GTBank"];
const TYPES = ["POS", "Transfer", "ATM"];

function getRiskLevel(): RiskLevel {
  const roll = Math.random();
  if (roll < 0.08) return "high";
  if (roll < 0.28) return "medium";
  return "low";
}

const RISK_CONFIG = {
  low: {
    label: "LOW RISK",
    riskScore: "18%",
    statusLabel: "Clean",
    cardBorder: "border-gray-500/30 bg-gray-500/10 text-gray-400",
    panelBorder: "border-gray-500/30",
    badgeText: "text-gray-400",
    scoreBold: "text-gray-400",
    statusBold: "text-gray-400",
    actionBg: null,
  },
  medium: {
    label: "MEDIUM RISK",
    riskScore: "61%",
    statusLabel: "Flagged",
    cardBorder: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    panelBorder: "border-amber-500/30",
    badgeText: "text-amber-400",
    scoreBold: "text-amber-500",
    statusBold: "text-amber-400",
    actionBg: "bg-amber-500",
  },
  high: {
    label: "HIGH RISK",
    riskScore: "92%",
    statusLabel: "Blocked",
    cardBorder: "border-red-500/30 bg-red-500/10 text-red-400",
    panelBorder: "border-red-500/30",
    badgeText: "text-red-400",
    scoreBold: "text-red-500",
    statusBold: "text-red-400",
    actionBg: "bg-red-500",
  },
};

function generateTransaction(): Transaction {
  const amount = Math.floor(Math.random() * 500000) + 5000;
  const bank = BANKS[Math.floor(Math.random() * BANKS.length)];
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  const hour = Math.floor(Math.random() * 24);
  const min = Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0");
  const hourStr = hour.toString().padStart(2, "0");
  const risk: RiskLevel = getRiskLevel();

  return {
    id: Date.now() + Math.random(),
    text: `₦${amount.toLocaleString()} • ${type} • ${bank} • ${hourStr}:${min}`,
    risk,
  };
}

export default function FlyntHero() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [flagged, setFlagged] = useState<Transaction | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const tx = generateTransaction();
      setTransactions((prev) => [tx, ...prev].slice(0, 5));
      if (tx.risk !== "low") setFlagged(tx);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const config = flagged ? RISK_CONFIG[flagged.risk] : RISK_CONFIG["low"];

  return (
    <section className="relative isolate overflow-hidden py-6 lg:py-12">
      <div className="px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-start">
          {/* LEFT */}
          <div>
            <h1 className="mb-6 text-5xl font-medium tracking-tight text-text-primary">
              Real-Time Intelligence. <br />
              <span className="text-text-muted font-light italic">
                for Better Financial Decisions
              </span>
            </h1>
            <p className="mb-10 max-w-lg text-lg text-text-secondary">
              Flynt monitors transactions across accounts, detects anomalies
              instantly, and takes action before fraud escalates.
            </p>
            <div className="flex gap-4">
              <Link
                href="/waitlist"
                className="bg-green-primary px-6 py-3 rounded-xl text-white font-bold"
              >
                Request Demo
              </Link>
              {/* API Docs button — hidden until docs are ready */}
              {/* <Link
                href="/docs"
                className="border px-6 py-3 rounded-xl font-bold"
              >
                API Docs
              </Link> */}
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-xl border bg-bg-card shadow-xl overflow-hidden">
            {/* HEADER */}
            <div className="flex justify-between px-6 py-4 border-b bg-bg-elevated">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-primary rounded-full animate-pulse" />
                <span className="text-xs font-mono uppercase">
                  Fraud Engine
                </span>
              </div>
              <BarChart3 className="h-4 w-4" />
            </div>

            <div className="p-6 space-y-4">
              {/* TRANSACTION STREAM */}
              <div>
                <p className="text-xs mb-2 uppercase text-text-muted">
                  Live Transactions
                </p>
                <div className="space-y-2 h-[160px] overflow-hidden">
                  <AnimatePresence initial={false}>
                    {transactions.map((tx) => {
                      const c = RISK_CONFIG[tx.risk];
                      return (
                        <motion.div
                          key={tx.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          layout={false}
                          className={`flex justify-between px-3 py-2 rounded border text-xs font-mono ${c.cardBorder}`}
                        >
                          {tx.text}
                          {tx.risk === "high" && <span>⚠</span>}
                          {tx.risk === "medium" && <span>◆</span>}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* ANOMALY PANEL */}
              <div
                className={`border p-4 rounded transition-colors duration-300 ${config.panelBorder}`}
              >
                <div className="flex justify-between text-xs mb-2">
                  <span
                    className={`font-bold uppercase transition-colors duration-300 ${config.badgeText}`}
                  >
                    Anomaly Detected
                  </span>
                  <span
                    className={`font-mono transition-colors duration-300 ${config.badgeText}`}
                  >
                    {flagged ? config.label : "Monitoring"}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  {flagged ? flagged.text : "Scanning transactions..."}
                </p>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-bg-elevated rounded">
                  <p className="text-xs">Risk</p>
                  <p className={`font-bold ${config.scoreBold}`}>
                    {flagged ? config.riskScore : "—"}
                  </p>
                </div>
                <div className="p-3 bg-bg-elevated rounded">
                  <p className="text-xs">Status</p>
                  <p className={`font-bold ${config.statusBold}`}>
                    {flagged ? config.statusLabel : "Clean"}
                  </p>
                </div>
                <div className="p-3 bg-bg-elevated rounded">
                  <p className="text-xs">System</p>
                  <p className="font-bold text-green-primary">Active</p>
                </div>
              </div>

              {/* ACTION BANNER */}
              <div className="h-[44px]">
                <AnimatePresence mode="wait">
                  {flagged && config.actionBg && (
                    <motion.div
                      key={flagged.id + "-action"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-center gap-3 ${config.actionBg} text-white p-3 rounded`}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <p className="text-xs font-bold">
                        {flagged.risk === "high"
                          ? "Transaction Blocked"
                          : "Transaction Flagged for Review"}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
