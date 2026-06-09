"use client";

import { motion, Variants } from "framer-motion";
import { BrainCircuit, ShieldCheck, Zap, Server } from "lucide-react";

const features = [
  {
    id: "explainable-ai",
    title: "Decisions You Can Explain",
    desc: "When Flynt blocks or flags a transaction, you get a clear reason — not a mysterious score. Easy to share with customers, auditors, or your compliance team.",
    icon: <BrainCircuit className="w-5 h-5" />,
  },
  {
    id: "bank-grade-security",
    title: "Built for Trust",
    desc: "Data is encrypted in transit and at rest. Flynt is designed to meet the security standards that banks and fintechs require.",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    id: "direct-action",
    title: "Acts, Not Just Alerts",
    desc: "Most tools tell you something went wrong after the damage is done. Flynt can block, hold, or escalate — automatically, in milliseconds.",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "reliable-infrastructure",
    title: "Always On",
    desc: "Fraud doesn't sleep, and neither does Flynt. Our API is built for high uptime and low latency — so protection never goes offline.",
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-1 relative z-10">
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
              Why Teams Choose Flynt
            </h2>
          </div>
          <h3 className="text-4xl font-medium tracking-tight text-text-secondary dark:text-white md:text-5xl">
            Protection you can{" "}
            <span className="text-slate-400 font-light italic">
              actually trust.
            </span>
          </h3>
          <p className="mt-6 text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-lg">
            Fraud tools are only useful if your team understands them and your
            customers feel safe. Flynt is built to be transparent from day one.
          </p>
        </motion.div>

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
              <div className="mb-8 inline-flex p-3 rounded bg-bg-secondary dark:bg-white/5 text-slate-700 dark:text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-semibold text-text-secondary dark:text-white">
                  {feature.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>

              <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
