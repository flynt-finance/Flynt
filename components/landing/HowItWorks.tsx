"use client";

import { Plug, Eye, ShieldCheck, MessageSquare } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Plug Flynt into your system",
    desc: "Add our API to your app, payment platform, or banking system. It takes minutes — no need to rebuild anything you already have.",
    icon: <Plug className="w-5 h-5 text-green-primary" />,
  },
  {
    id: "02",
    title: "Flynt watches every transaction",
    desc: "As money moves through your system, Flynt analyzes each transaction in real time — learning what normal looks like for your business.",
    icon: <Eye className="w-5 h-5 text-blue" />,
  },
  {
    id: "03",
    title: "Threats are caught instantly",
    desc: "When something looks wrong — unusual amounts, strange patterns, or known fraud signals — Flynt flags or blocks it automatically.",
    icon: <ShieldCheck className="w-5 h-5 text-green-primary" />,
  },
  {
    id: "04",
    title: "You get clear answers",
    desc: "Every decision comes with a plain-language explanation. Your team always knows why a transaction was approved, flagged, or blocked.",
    icon: <MessageSquare className="w-5 h-5 text-orange" />,
  },
];

export default function FinanceWorkflow() {
  return (
    <section className="py-3 md:py-24 text-text-primary">
      <div className="container mx-auto max-w-7xl px-1">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-green-primary uppercase">
              How It Works
            </span>
            <h2 className="mt-2 text-4xl font-light tracking-tight text-text-primary md:text-5xl">
              Four simple steps.
              <span className="font-semibold text-text-secondary">
                {" "}
                Serious protection.
              </span>
            </h2>
          </div>
          <p className="max-w-md text-text-secondary text-base leading-relaxed">
            Think of Flynt as a smart security layer that sits inside your
            existing system. You keep your tools — we add the intelligence and
            automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-primary border border-border-primary overflow-hidden rounded-xl">
          {steps.map((step) => (
            <div
              key={step.id}
              className="group relative bg-bg-card p-8 transition-all hover:bg-bg-elevated"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-text-muted">
                  Step {step.id}
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

              <div className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-hover:bg-green-primary transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
