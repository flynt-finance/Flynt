"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  Wallet,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";

export default function FlyntHero() {
  return (
    <section className="relative isolate overflow-hidden  py-24 lg:py-32 transition-colors duration-500">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* LEFT — STRATEGIC CONTENT */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full bg-bg-elevated border border-border-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-green-primary" />
              Unified Financial Operating System
            </motion.div>

            <h1 className="mb-6 text-5xl font-medium tracking-tight text-text-primary md:text-7xl">
              Your Money. <br />
              <span className="text-text-muted font-light italic">
                on autopilots.
              </span>
            </h1>

            <p className="mb-10 max-w-lg text-lg leading-relaxed text-text-secondary">
              Flynt aggregates all your accounts and uses AI to proactively
              guide you toward smarter spending, saving, and investing — no
              expertise required.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/waitlist"
                className="group rounded-xl inline-flex items-center justify-center bg-green-primary px-8 py-4 text-sm font-bold text-white transition-all hover:bg-green-hover"
              >
                Join waitlist
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <div className="flex -space-x-2">
                {/* Visual indicator of connected banks */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-bg-primary bg-bg-elevated flex items-center justify-center text-[10px] font-bold text-text-muted"
                  >
                    {i === 1 ? (
                      <Image
                        src="/banks/zenith.svg"
                        alt="Zenith"
                        width={16}
                        height={16}
                      />
                    ) : i === 2 ? (
                      <Image
                        src="/banks/access.svg"
                        alt="Access"
                        width={16}
                        height={16}
                      />
                    ) : (
                      <Image
                        src="/banks/gtbank.jpeg"
                        alt="gtbank"
                        width={16}
                        height={16}
                      />
                    )}
                  </div>
                ))}
                <div className="flex items-center ml-4 text-xs font-medium text-text-muted">
                  +3 Banks Connected
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — THE "REASONING" INTERFACE */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-xl border border-border-primary bg-bg-card backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-border-subtle bg-bg-elevated px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-primary animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">
                    AI Intelligence Layer
                  </span>
                </div>
                <BarChart3 className="h-4 w-4 text-text-muted" />
              </div>

              {/* Terminal Content */}
              <div className="p-8">
                {/* Step 1: Aggregation */}
                <div className="mb-8">
                  <p className="text-[10px] font-bold uppercase text-text-muted mb-3 tracking-widest">
                    Live Aggregation
                  </p>
                  <div className="flex gap-2">
                    {["Zenith Bank", "Access", "GTBank"].map((bank) => (
                      <div
                        key={bank}
                        className="flex-1 rounded border border-border-subtle bg-bg-elevated p-2 text-center text-[10px] font-mono text-text-secondary"
                      >
                        {bank}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 2: The Logic (THE CORE VALUE) */}
                <div className="relative space-y-4">
                  <div className="rounded-lg border border-border-primary p-5 bg-bg-elevated">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 rounded bg-bg-elevated">
                        <Wallet className="h-4 w-4 text-orange" />
                      </div>
                      <span className="text-[10px] font-bold text-text-muted uppercase">
                        Optimization Alert
                      </span>
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed italic">
                      &quot;International break detected. Pause{" "}
                      <span className="font-bold text-text-primary underline decoration-orange/50">
                        DSTV Subscription
                      </span>{" "}
                      for 14 days?&quot;
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-4">
                      <span className="text-xs font-bold text-text-muted">
                        Reallocating
                      </span>
                      <span className="text-sm font-mono font-bold text-green-primary">
                        ₦20,000.00
                      </span>
                    </div>
                  </div>

                  {/* Step 3: The Result */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-4 rounded-lg bg-green-primary p-4 text-white shadow-lg"
                  >
                    <div className="h-10 w-10 rounded bg-white/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                        Portfolio Action
                      </p>
                      <p className="text-sm font-bold">
                        Acquired Fractional Palantir (PLTR)
                      </p>
                    </div>
                    <ArrowUpRight className="ml-auto h-5 w-5 opacity-50" />
                  </motion.div>
                </div>
              </div>

              {/* System Footer */}
              <div className="border-t border-border-subtle bg-bg-elevated px-8 py-4 flex justify-between items-center">
                <span className="text-[10px] font-mono text-text-muted uppercase">
                  Strategy: Growth Focus
                </span>
                <span className="text-[10px] font-mono text-green-primary font-bold">
                  syncing..
                </span>
              </div>
            </div>

            {/* Background Glows (Dark Mode Only) */}
            <div className="absolute -z-10 -top-20 -right-20 h-64 w-64 rounded-full bg-green-primary/10 blur-[100px] hidden dark:block" />
            <div className="absolute -z-10 -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue/10 blur-[100px] hidden dark:block" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
