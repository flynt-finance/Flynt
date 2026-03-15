"use client";

import React from "react";
import { motion } from "framer-motion";
import {
	Lightbulb,
	AlertTriangle,
	TrendingDown,
	ArrowUpRight,
	Sparkles,
	ShieldAlert,
	Calendar,
} from "lucide-react";
import Image from "next/image";
import { useDebts, Debt } from "@/contexts/DebtContext";

interface InsightItem {
	id: string;
	type:
		| "optimization"
		| "warning"
		| "positive"
		| "market-alert"
		| "savings-advice"
		| "debt-advisor";
	title: string;
	description: string;
	actionText?: string;
	actionLink?: string;
	ctaType?: "primary" | "secondary";
	logo?: string;
	isDebtAction?: boolean;
}

const staticInsights: InsightItem[] = [
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
];

interface FlyntInsightsProps {
	onAddDebt?: () => void;
}

export default function FlyntInsights({ onAddDebt }: FlyntInsightsProps) {
	const { debts } = useDebts();

	const getDebtAdvice = (): InsightItem | null => {
		if (debts.length === 0) {
			return {
				id: "setup-debt",
				type: "optimization",
				title: "Setup Debt Tracking",
				description:
					"Take control of your liabilities. Add your debt notes to get AI-powered repayment strategies.",
				actionText: "Create Debt Note",
				ctaType: "primary",
				isDebtAction: true,
			};
		}

		// Find the most pressing debt
		// Priority: Critical importance first, then high, then closest deadline
		const sortedDebts = [...debts].sort((a, b) => {
			const importanceMap = { critical: 3, high: 2, medium: 1, low: 0 };
			if (importanceMap[a.importance] !== importanceMap[b.importance]) {
				return importanceMap[b.importance] - importanceMap[a.importance];
			}
			return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
		});

		const topDebt = sortedDebts[0];
		const today = new Date();
		const deadline = new Date(topDebt.deadline);
		const diffDays = Math.ceil(
			(deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
		);

		let priorityReason = "";
		if (topDebt.importance === "critical") priorityReason = "Critical Priority";
		else if (diffDays <= 3) priorityReason = "Approaching Deadline";
		else priorityReason = "High Impact";

		return {
			id: `debt-advice-${topDebt.id}`,
			type: "debt-advisor",
			title: `Priority: ${topDebt.name}`,
			description: `Flynt AI suggests tackling this first: ${topDebt.rationale} (${priorityReason})`,
			actionText: "View Debt Details",
			ctaType: "primary",
			actionLink: "/dashboard/debts",
		};
	};

	const debtInsight = getDebtAdvice();
	const allInsights = debtInsight
		? [debtInsight, ...staticInsights]
		: staticInsights;

	const getStyles = (type: InsightItem["type"]) => {
		switch (type) {
			case "debt-advisor":
				return {
					bg: "bg-indigo-50/50 dark:bg-indigo-500/10",
					border: "border-indigo-100 dark:border-indigo-500/30",
					iconBg: "bg-indigo-100 dark:bg-indigo-500/30",
					iconColor: "text-indigo-600 dark:text-indigo-400",
					icon: <ShieldAlert className="w-4 h-4" />,
				};
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
						<h2 className="text-lg font-bold tracking-tight text-text-secondary dark:text-white uppercase leading-none">
							Flynt Intelligence
						</h2>
						<p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
							{allInsights.length} active opportunities
						</p>
					</div>
				</div>
				<button
					onClick={onAddDebt}
					className="flex h-8 items-center gap-1.5 px-3 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors uppercase tracking-wider"
				>
					<Calendar className="w-3 h-3" />
					Debt Note
				</button>
			</div>

			{/* Scrollable Content */}
			<div className="flex-1 overflow-y-auto px-6 py-4">
				{/* Insight List */}
				<div className="space-y-4 pb-4">
					{allInsights.map((item) => {
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
											<div className={`${styles.iconColor}`}>{styles.icon}</div>
										)}
									</div>

									{/* Content */}
									<div className="flex-1">
										{/* Title */}
										<div className="flex items-center justify-between">
											<h4 className="text-sm font-semibold text-slate-800 dark:text-white tracking-tight">
												{item.title}
											</h4>
											{item.type === "debt-advisor" && (
												<span className="text-[8px] font-black uppercase tracking-widest bg-indigo-500 text-white px-1.5 py-0.5 rounded shadow-sm">
													AI Advice
												</span>
											)}
										</div>

										{/* Description */}
										<p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
											{item.description}
										</p>

										{/* CTA */}
										{item.actionText && (
											<div className="mt-4 flex items-center justify-between">
												<span className="text-[10px] uppercase tracking-widest text-slate-400">
													{item.type === "debt-advisor"
														? "AI Repayment Strategy"
														: "Suggested Action"}
												</span>

												<button
													onClick={() => {
														if (item.isDebtAction && onAddDebt) {
															onAddDebt();
														} else if (item.actionLink) {
															window.location.href = item.actionLink;
														}
													}}
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
