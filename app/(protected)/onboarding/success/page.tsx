"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Loader2, Database, CheckCircle2 } from "lucide-react";

export default function OnboardingSuccessPage() {
  const router = useRouter();
  const [stage, setStage] = useState<"sync" | "loading" | "ready">("sync");
  const [logIndex, setLogIndex] = useState(0);
  const timers = useRef<number[]>([]);

  // Simulation logs to show FlInitializing Protocolynt's deep integration
  const syncLogs = [
    {
      text: "Establishing secure handshake with Zenith node...",
      status: "OK",
      color: "text-emerald-500",
    },
    {
      text: "Requesting UBA transaction history (24-month lookback)...",
      status: "WAIT",
      color: "text-slate-400",
    },
    {
      text: "UBA handshake confirmed.",
      status: "OK",
      color: "text-emerald-500",
    },
    {
      text: "Parsing Access Bank merchant metadata...",
      status: "SYNC",
      color: "text-blue-400",
    },
    {
      text: "Neutralizing duplicate transaction IDs...",
      status: "OK",
      color: "text-emerald-500",
    },
    {
      text: "Mapping liquidity across 3 institutional endpoints...",
      status: "LOAD",
      color: "text-amber-500",
    },
    {
      text: "Finalizing unified fiscal ledger...",
      status: "READY",
      color: "text-emerald-500",
    },
  ];

  useEffect(() => {
    const SYNC_DURATION = 10000;
    const LOADING_DURATION = 5000;
    const READY_DURATION = 2500;

    // Log typing simulation
    const logInterval = setInterval(() => {
      setLogIndex((prev) => (prev < syncLogs.length - 1 ? prev + 1 : prev));
    }, 1400);

    // Stage sequence
    const t1 = window.setTimeout(() => {
      setStage("loading");
      clearInterval(logInterval);
      const t2 = window.setTimeout(() => {
        setStage("ready");
        const t3 = window.setTimeout(() => {
          router.push("/dashboard");
        }, READY_DURATION);
        timers.current.push(t3);
      }, LOADING_DURATION);
      timers.current.push(t2);
    }, SYNC_DURATION);
    timers.current.push(t1);

    return () => {
      timers.current.forEach((id) => clearTimeout(id));
      clearInterval(logInterval);
      timers.current = [];
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary dark:bg-[#0A0D27] p-6 transition-colors duration-500">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1] bg-[radial-gradient(#808080_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          {stage === "sync" && (
            <motion.div
              key="sync"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center"
            >
              <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner">
                <Database className="h-8 w-8 text-emerald-500" />
              </div>

              <h2 className="mb-2 text-2xl font-medium tracking-tight text-text-secondary dark:text-white">
                Initializing Protocol
              </h2>
              <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
                Establishing encrypted handshake with banking nodes...
              </p>

              {/* DYNAMIC TERMINAL LOG */}
              <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-bg-secondary dark:bg-black/40 p-5 font-mono text-[10px] text-left min-h-[140px] shadow-2xl">
                <div className="space-y-2">
                  {syncLogs.slice(0, logIndex + 1).map((log, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between gap-4"
                    >
                      <span className="text-slate-500 truncate italic">
                        {">"} {log.text}
                      </span>
                      <span className={`${log.color} font-bold shrink-0`}>
                        [{log.status}]
                      </span>
                    </motion.div>
                  ))}
                </div>
                {logIndex < syncLogs.length - 1 && (
                  <motion.div
                    animate={{ opacity: [0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="h-3 w-1 bg-emerald-500 mt-2"
                  />
                )}
              </div>
            </motion.div>
          )}

          {stage === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-slate-200 dark:border-white/10 bg-bg-secondary dark:bg-[#0D1131] p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Synthesizing Governance View
                </span>
              </div>

              <div className="animate-pulse space-y-6">
                <div className="h-8 w-3/4 rounded bg-bg-secondary dark:bg-white/5" />
                <div className="h-32 rounded bg-bg-secondary dark:bg-white/5" />
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-12 rounded bg-bg-secondary dark:bg-white/5" />
                  <div className="h-12 rounded bg-bg-secondary dark:bg-white/5" />
                  <div className="h-12 rounded bg-bg-secondary dark:bg-white/5" />
                </div>
              </div>
              <p className="mt-6 text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Optimizing decision engine...
              </p>
            </motion.div>
          )}

          {stage === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="relative inline-flex mb-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 flex"
                >
                  <CheckCircle2 className="h-10 w-10" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-full border-2 border-emerald-500"
                />
              </div>

              <h3 className="text-2xl font-medium text-text-secondary dark:text-white mb-2">
                Handshake Verified
              </h3>
              <p className="text-sm text-text-muted dark:text-slate-400 mb-8">
                Your financial state is now unified. <br />
                Redirecting to your terminal view...
              </p>

              <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 rounded">
                <ShieldCheck className="h-3 w-3" />
                Secure Session Active
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
