"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  AlertTriangle,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

interface InsightItem {
  id: string;
  type:
    | "optimization"
    | "warning"
    | "positive"
    | "market-alert"
    | "savings-advice";
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  ctaType?: "primary" | "secondary";
  logo?: string;
}

const insights: InsightItem[] = [
  {
    id: "dstv-save",
    type: "savings-advice",
    title: "Save ₦15,000 on DSTV",
    description:
      "International breaks are coming up. Pause your DSTV Premium subscription for 2 weeks and save ₦15,000.",
    actionText: "Pause Subscription",
    ctaType: "primary",
    logo: "/dstv.png",
  },
  {
    id: "dangote-ipo",
    type: "market-alert",
    title: "Dangote Refinery IPO",
    description:
      "Dangote refinery is expanding, and IPO is expected in a few months. Here's why analysts think it's a strong buy.",
    actionText: "Monitor Stock News",
    ctaType: "secondary",
    logo: "/dangote.webp",
  },
  {
    id: "mtn-bamboo",
    type: "market-alert",
    title: "MTN FiberX Boost",
    description:
      "MTN FiberX is generating massive revenue, boosting MTN's position in the telecom sector.",
    actionText: "Buy with Bamboo",
    ctaType: "primary",
    logo: "/mtn.png",
  },
  {
    id: "1",
    type: "optimization",
    title: "Save ₦5,840/month",
    description:
      "We found 2 subscriptions you might not be using. Canceling them could save you money each month.",
    actionText: "Take action",
  },
];

export default function FlyntInsights() {
  const getStyles = (type: InsightItem["type"]) => {
    switch (type) {
      case "savings-advice":
        return {
          bg: "bg-green-50/50 dark:bg-green-500/10",
          border: "border-green-100 dark:border-green-500/30",
          iconBg: "bg-green-100 dark:bg-green-500/30",
          iconColor: "text-green-600 dark:text-green-400",
          icon: <Sparkles className="w-4 h-4" />,
        };
      case "market-alert":
        return {
          bg: "bg-blue-50/50 dark:bg-blue-500/10",
          border: "border-blue-100 dark:border-blue-500/30",
          iconBg: "bg-blue-100 dark:bg-blue-500/30",
          iconColor: "text-blue-600 dark:text-blue-400",
          icon: <TrendingDown className="w-4 h-4 rotate-180" />,
        };
      case "optimization":
        return {
          bg: "bg-emerald-50/50 dark:bg-emerald-500/5",
          border: "border-emerald-100 dark:border-emerald-500/20",
          iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
          iconColor: "text-emerald-600 dark:text-emerald-400",
          icon: <Lightbulb className="w-4 h-4" />,
        };
      case "warning":
        return {
          bg: "bg-amber-50/50 dark:bg-amber-500/5",
          border: "border-amber-100 dark:border-amber-500/20",
          iconBg: "bg-amber-100 dark:bg-amber-500/20",
          iconColor: "text-amber-600 dark:text-amber-400",
          icon: <AlertTriangle className="w-4 h-4" />,
        };
      case "positive":
        return {
          bg: "bg-blue-50/50 dark:bg-blue-500/5",
          border: "border-blue-100 dark:border-blue-500/20",
          iconBg: "bg-blue-100 dark:bg-blue-500/20",
          iconColor: "text-blue-600 dark:text-blue-400",
          icon: <TrendingDown className="w-4 h-4" />,
        };
      default:
        return {
          bg: "bg-slate-50/50 dark:bg-slate-500/5",
          border: "border-slate-100 dark:border-slate-500/20",
          iconBg: "bg-slate-100 dark:bg-slate-500/20",
          iconColor: "text-slate-600 dark:text-slate-400",
          icon: <Sparkles className="w-4 h-4" />,
        };
    }
  };

  return (
    <div className="w-full h-96 rounded-2xl border border-slate-200 dark:border-white/10 bg-bg-secondary dark:bg-[#0D1131] flex flex-col shadow-sm">
      {/* Fixed Header */}
      <div className="flex items-center justify-between mb-2 p-6 shrink-0">
        <div className="flex items-center gap-3">
          <motion.div
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20"
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Outer Pulse Ring */}
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-emerald-400/40"
              animate={{
                scale: [1, 1.6],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />

            {/* Logo */}
            <Image
              src={"/favicon.ico"}
              alt="Flynt Logo"
              width={28}
              height={28}
              className="rounded-full"
            />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-text-secondary dark:text-white uppercase leading-none">
              Flynt Intelligence
            </h3>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
              {insights.length} active opportunities
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Insight List */}
        <div className="space-y-4 pb-4">
          {insights.map((item) => {
            const styles = getStyles(item.type);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -4 }}
                className={`group relative p-6 rounded-2xl border bg-white/60 dark:bg-white/5 backdrop-blur-sm
  ${styles.border} transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="relative shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-white/10 shadow-sm overflow-hidden border border-slate-200 dark:border-white/10 group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-all">
                    {item.logo ? (
                      <Image
                        src={item.logo}
                        alt={item.title}
                        width={38}
                        height={38}
                        className="object-contain rounded-full"
                      />
                    ) : (
                      <Image
                        src={"/favicon.ico"}
                        alt="Flynt Logo"
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Title */}
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white tracking-tight">
                      {item.title}
                    </h4>

                    {/* Description */}
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>

                    {/* CTA */}
                    {item.actionText && (
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-slate-400">
                          Suggested Action
                        </span>

                        <button
                          className={`group/btn inline-flex items-center gap-1 text-xs font-semibold transition-all
              ${
                item.ctaType === "primary"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-600 dark:text-slate-300"
              }`}
                        >
                          {item.actionText}
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 shrink-0">
        <p className="text-[9px] font-mono text-center text-slate-400 dark:text-slate-600 uppercase tracking-widest">
          Analysis based on 90-day fiscal history
        </p>
      </div>
    </div>
  );
}
