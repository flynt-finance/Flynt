"use client";

import { ShieldCheck, Cpu, Zap, RefreshCw, Brain, Ban } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Secure Data Integration",
    desc: "Connect to financial institutions, credit bureaus, and transaction sources through secure, API-driven integrations.",
    icon: <ShieldCheck className="w-5 h-5 text-green-primary" />,
  },
  {
    id: "02",
    title: "Real-Time Data Aggregation",
    desc: "Aggregate and normalize fragmented financial data into a unified, real-time intelligence layer across systems.",
    icon: <Cpu className="w-5 h-5 text-blue" />,
  },
  {
    id: "03",
    title: "Decision Engine",
    desc: "Analyze cash flow, transaction patterns, and obligations to generate dynamic risk scores and financial signals.",
    icon: <Brain className="w-5 h-5 text-green-primary" />,
  },
  {
    id: "04",
    title: "Automated Actions",
    desc: "Trigger real-time decisions such as loan approvals, credit limits, payment optimizations, and risk controls via API.",
    icon: <Zap className="w-5 h-5 text-orange" />,
  },
  {
    id: "05",
    title: "Continuous Monitoring",
    desc: "Track financial behavior in real time to detect changes, update risk profiles, and adapt decisions dynamically.",
    icon: <RefreshCw className="w-5 h-5 text-purple" />,
  },
  {
    id: "06",
    title: "Risk & Fraud Detection",
    desc: "Identify anomalies, detect fraud signals, and prevent losses with proactive, system-level intelligence.",
    icon: <Ban className="w-5 h-5 text-red-500" />,
  },
];

export default function FinanceWorkflow() {
  return (
    <section className="py-3 md:py-24 text-text-primary">
      <div className="container mx-auto max-w-7xl px-1">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-green-primary uppercase">
              Embedded Decision Layer
            </span>
            <h2 className="mt-2 text-4xl font-light tracking-tight text-text-primary md:text-5xl ">
              Stop viewing data.
              <span className="font-semibold text-text-secondary">
                {" "}
                Start executing decisions
              </span>
            </h2>
          </div>
          <p className="max-w-md text-text-secondary text-base leading-relaxed">
            Flynt transforms fragmented financial data into a decision engine
            that scores risk, approves actions, and powers automated workflows
            across your platform via API.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border-primary border border-border-primary overflow-hidden rounded-xl">
          {steps.map((step) => (
            <div
              key={step.id}
              className="group relative bg-bg-card p-8 transition-all hover:bg-bg-elevated"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-text-muted">
                  [{step.id}]
                </span>
                <div className="p-2 bg-bg-elevated rounded-md group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3 text-text-primary">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary mb-6">
                {step.desc}
              </p>

              {/* Decorative Finance Element */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-hover:bg-green-primary transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
