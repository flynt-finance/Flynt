"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, ArrowRight, Globe } from "lucide-react";

const stats = [
	{
		label: "Governance Accuracy",
		value: "99.4%",
		desc: "Policy compliance rate",
		icon: <ShieldCheck className="w-4 h-4" />,
	},
	{
		label: "Capital Optimization",
		value: "₦60k",
		desc: "Average monthly redirect",
		icon: <Zap className="w-4 h-4 text-emerald-500" />,
	},
	{
		label: "Network Latency",
		value: "<2ms",
		desc: "Real-time sync speed",
		icon: <Lock className="w-4 h-4" />,
	},
];

export default function TrustStats() {
	return (
		<section className="relative bg-bg-primary dark:bg-[#0A0D27] py-24 lg:py-32 overflow-hidden">
			{/* Decorative background element */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

			<div className="container mx-auto max-w-6xl px-6">
				{/* INSTITUTIONAL TRUST BAR */}
				<div className="">
					<div className="flex flex-col items-center">
						{/* <div className="flex items-center gap-3 mb-8">
              <Globe className="w-3 h-3 text-slate-400 animate-spin-slow" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-500">
                Verified Bank Integrations
              </span>
            </div> */}

						{/* <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-40 dark:opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
              <Image
                src="/banks/zenith.svg"
                alt="Zenith"
                width={110}
                height={30}
                className="object-contain"
              />
              <Image
                src="/banks/access.svg"
                alt="Access"
                width={110}
                height={30}
                className="object-contain"
              />
              <Image
                src="/banks/gtbank.jpeg"
                alt="GTBank"
                width={110}
                height={30}
                className="object-contain"
              />
              <Image
                src="/banks/uba.png"
                alt="UBA"
                width={80}
                height={30}
                className="object-contain"
              />
            </div> */}
					</div>
				</div>

				{/* STATS INFRASTRUCTURE */}
				{/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative p-8 rounded-lg border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded bg-white dark:bg-white/5 shadow-sm border border-slate-100 dark:border-white/10 text-slate-400 dark:text-emerald-500">
                  {stat.icon}
                </div>
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              </div>
              <div className="text-4xl font-mono font-bold text-slate-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {stat.label}
              </div>
              <div className="mt-1 text-[10px] text-slate-400 italic">
                {stat.desc}
              </div>
            </motion.div>
          ))}
        </div> */}

				{/* THE FINAL CALL TO ACTION: "THE VAULT" */}
				<div className="relative group">
					<div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

					<div className="relative rounded-2xl border border-slate-900 dark:border-white/10 bg-bg-secondary dark:bg-[#0E1233] p-12 lg:p-20 overflow-hidden text-center">
						{/* Grid Pattern Overlay */}
						<div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

						<div className="relative z-10 max-w-2xl mx-auto">
							<h2 className="mb-6 text-4xl font-medium tracking-tight text-text-secondary md:text-5xl">
								Deploy the{" "}
								<span className="text-emerald-400 font-serif italic">
									Flynt Protocol.
								</span>
							</h2>
							<p className="mb-12 text-slate-400 text-sm md:text-base leading-relaxed uppercase tracking-widest">
								Stop managing accounts. Start governing your capital. Beta
								access is limited to institutional-ready profiles.
							</p>

							<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
								{/* <a
									href="/waitlist"
									className="w-full sm:w-auto inline-flex items-center justify-center rounded-sm bg-emerald-500 px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#0A0D27] transition-all hover:bg-white hover:scale-105"
								>
									Request Access
									<ArrowRight className="ml-2 h-4 w-4" />
								</a> */}
								<a
									href="/waitlist"
									className="w-full sm:w-auto inline-flex items-center justify-center rounded-sm border border-white/20 bg-transparent px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-text-secondary transition hover:bg-white/10"
								>
									Join waitlist
								</a>
							</div>

							{/* <div className="mt-12 flex items-center justify-center gap-4 py-4 border-t border-white/5 opacity-40">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-mono text-white uppercase tracking-widest">
                    System Status: Ready
                  </span>
                </div>
                <div className="h-3 w-px bg-white/20" />
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-white uppercase tracking-widest">
                    Encrypted via RSA-4096
                  </span>
                </div>
              </div> */}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
