"use client";

import { motion } from "framer-motion";
import { Building2, CreditCard, ShoppingCart, Smartphone } from "lucide-react";

const audiences = [
  {
    icon: <Building2 className="w-5 h-5" />,
    title: "Banks & Neobanks",
    desc: "Protect customer accounts from unauthorized transfers, card fraud, and account takeovers — without slowing down legitimate payments.",
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: "Payment Processors",
    desc: "Screen every payment before it clears. Reduce chargebacks and protect merchants from fraudulent transactions at scale.",
  },
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    title: "E-Commerce Platforms",
    desc: "Catch fake orders, stolen cards, and refund abuse before you ship a single product or lose revenue.",
  },
  {
    icon: <Smartphone className="w-5 h-5" />,
    title: "Fintech Apps",
    desc: "Add enterprise-grade fraud protection to your wallet, lending, or remittance app through a single API integration.",
  },
];

export default function WhoItsFor() {
  return (
    <section className="py-16 lg:py-24 bg-bg-primary">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center max-w-2xl mx-auto"
        >
          <span className="text-xs font-bold tracking-[0.2em] text-green-primary uppercase">
            Who It&apos;s For
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-medium text-text-primary">
            Any business that moves money
          </h2>
          <p className="mt-4 text-sm text-text-secondary leading-relaxed">
            If your system handles payments, transfers, or financial transactions,
            Flynt plugs in and starts protecting you — no matter your size or industry.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {audiences.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-xl border border-border-primary bg-bg-card p-6 hover:border-emerald-500/30 transition-colors"
            >
              <div className="mb-4 inline-flex p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                {item.icon}
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
