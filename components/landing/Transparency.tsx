"use client";

import { motion, Variants } from "framer-motion";
import { BrainCircuit, ShieldCheck, Zap, Server } from "lucide-react";

const features = [
  {
    id: "explainable-ai",
    title: "Explainable AI",
    desc: 'We don\'t just give advice — we explain the "why" behind every insight so you always understand the reasoning.',
    icon: <BrainCircuit className="w-5 h-5" />,
  },
  {
    id: "bank-grade-security",
    title: "Bank-Grade Security",
    desc: "Your data is encrypted at rest and in transit, meeting the highest compliance standards in the industry.",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    id: "direct-action",
    title: "Direct Action",
    desc: "Act on recommendations — like adjusting spending or reallocating funds — directly within the platform.",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "reliable-infrastructure",
    title: "Reliable Infrastructure",
    desc: "High availability and low latency for a seamless experience, every time you open the app.",
    icon: <Server className="w-5 h-5" />,
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Transparency() {
  return (
    <section className="relative bg-bg-secondary dark:bg-[#0D1131] py-24 lg:py-32 overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-1 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20 max-w-2xl px-3"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-emerald-500" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500">
              Trust &amp; Performance
            </h2>
          </div>
          <h3 className="text-4xl font-medium tracking-tight text-text-secondary dark:text-white md:text-5xl">
            Built for{" "}
            <span className="text-slate-400 font-light italic">
              transparency.
            </span>
          </h3>
          <p className="mt-6 text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-lg">
            We prioritize transparency and security so you can focus on your
            goals — not worry about your data.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 bg-bg-primary dark:bg-[#0A0D27]/60 p-8 transition-all hover:border-emerald-500/30"
            >
              {/* Icon */}
              <div className="mb-8 inline-flex p-3 rounded bg-bg-secondary dark:bg-white/5 text-slate-700 dark:text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h4 className="text-base font-semibold text-text-secondary dark:text-white">
                  {feature.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>

              {/* Decorative glow */}
              <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
