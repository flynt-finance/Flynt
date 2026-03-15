"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Droplets,
	CheckCircle2,
	ArrowRight,
	ZapOff,
	Loader2,
	ShieldAlert,
	Landmark,
	AlertCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLeaksQuery } from "@/lib/api/requests";
import type { LeakItem, LeaksApiResponse } from "@/lib/api/types";

const LEAK_ICON_MAP: Record<string, LucideIcon> = {
	ShieldAlert,
	Landmark,
	AlertCircle,
};

const LEAK_DEFAULT_ICON = ShieldAlert;

export default function FinancialLeaksSystem() {
	const [pluggingId, setPluggingId] = useState<string | null>(null);
	const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

	const { data: leaksResponse, isLoading: isLeaksLoading } = useLeaksQuery();

	const leaksData = useMemo(() => {
		const res = leaksResponse as LeaksApiResponse | undefined;
		if (!res?.success || !Array.isArray(res?.data))
			return { list: [], meta: null };
		return { list: res.data, meta: res.meta ?? null };
	}, [leaksResponse]);

	const displayedLeaks = useMemo(() => {
		return leaksData.list.filter((item) => !hiddenIds.has(item.id));
	}, [leaksData.list, hiddenIds]);

	const totalLeakage =
		leaksData.meta?.totalLeaked ??
		displayedLeaks.reduce((acc, curr) => acc + curr.amount, 0);
	const vulnerabilityCount =
		leaksData.meta?.vulnerabilitiesCount ?? displayedLeaks.length;

	const handlePlugLeak = (id: string) => {
		setPluggingId(id);
		setTimeout(() => {
			setHiddenIds((prev) => new Set(prev).add(id));
			setPluggingId(null);
		}, 1500);
	};

	const isEmpty = !isLeaksLoading && displayedLeaks.length === 0;

	return (
		<div className="w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-bg-secondary dark:bg-[#0D1131]">
			{/* Diagnostic Header */}
			<div className="bg-bg-secondary p-6 text-white">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2">
						<Droplets className="w-5 h-5 text-blue-400 animate-pulse" />
						<h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary">
							Leak Detection System
						</h3>
					</div>
				</div>

				{isLeaksLoading ? (
					<div className="space-y-2">
						<div className="h-9 w-32 rounded bg-border-subtle animate-pulse" />
						<div className="h-3 w-48 rounded bg-border-subtle animate-pulse" />
					</div>
				) : (
					<div className="space-y-1">
						<div className="text-3xl font-bold text-text-secondary dark:text-white tracking-tight">
							₦{totalLeakage.toLocaleString()}
							<span className="text-xs text-text-secondary ml-2 font-normal uppercase tracking-tighter">
								/ monthly leakage
							</span>
						</div>
						<p className="text-[10px] text-text-secondary font-mono italic">
							{vulnerabilityCount > 0
								? `> ${vulnerabilityCount} vulnerabilities identified`
								: "> All leaks successfully plugged"}
						</p>
					</div>
				)}
			</div>

			{/* Leaks Feed */}
			<div className="p-4 space-y-3 min-h-[300px] bg-slate-50/50 dark:bg-transparent">
				{isLeaksLoading && (
					<>
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/2 animate-pulse"
								aria-hidden
							>
								<div className="flex gap-3 flex-1">
									<div className="mt-1 h-2 w-2 rounded-full shrink-0 bg-border-subtle" />
									<div className="space-y-2 flex-1">
										<div className="h-4 w-3/4 rounded bg-border-subtle" />
										<div className="h-3 w-full rounded bg-border-subtle" />
										<div className="h-3 w-20 rounded bg-border-subtle" />
									</div>
								</div>
							</div>
						))}
					</>
				)}

				{!isLeaksLoading && (
					<AnimatePresence mode="popLayout">
						{displayedLeaks.map((leak) => (
							<LeakRow
								key={leak.id}
								leak={leak}
								isPlugging={pluggingId === leak.id}
								onPlugLeak={handlePlugLeak}
							/>
						))}
					</AnimatePresence>
				)}

				{isEmpty && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="flex flex-col items-center justify-center py-12 text-center"
					>
						<div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
							<CheckCircle2 className="h-6 w-6 text-emerald-500" />
						</div>
						<h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
							Treasury Secured
						</h4>
						<p className="text-xs text-slate-500">
							No active leaks detected in current fiscal cycle.
						</p>
					</motion.div>
				)}
			</div>

			{/* Footer Governance Note */}
			<div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10">
				<button
					type="button"
					className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors"
					aria-label="View full vulnerability report"
				>
					View full vulnerability report
					<ArrowRight className="w-3 h-3" />
				</button>
			</div>
		</div>
	);
}

interface LeakRowProps {
	leak: LeakItem;
	isPlugging: boolean;
	onPlugLeak: (id: string) => void;
}

function LeakRow({ leak, isPlugging, onPlugLeak }: LeakRowProps) {
	const IconComponent = LEAK_ICON_MAP[leak.ui.icon] ?? LEAK_DEFAULT_ICON;
	const statusColor = leak.ui?.statusColor ?? "#9CA3AF";

	return (
		<motion.div
			layout
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
			className="relative group flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/2 hover:border-blue-500/30 transition-all"
		>
			<div className="flex gap-3">
				<div
					className="mt-1 h-2 w-2 rounded-full shrink-0"
					style={{
						backgroundColor: statusColor,
						boxShadow:
							statusColor === "#EF4444"
								? "0 0 8px rgba(239,68,68,0.5)"
								: undefined,
					}}
					aria-hidden
				/>
				<div className="flex gap-2 items-start">
					<IconComponent
						className="h-4 w-4 shrink-0 mt-0.5 text-text-muted"
						aria-hidden
					/>
					<div>
						<h4 className="text-sm font-bold text-text-secondary dark:text-white leading-none mb-1">
							{leak.label}
						</h4>
						<p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mb-2">
							{leak.description}
						</p>
						<div className="text-xs font-bold text-slate-900 dark:text-blue-400 font-mono">
							- ₦{leak.amount.toLocaleString()}
						</div>
					</div>
				</div>
			</div>

			<button
				type="button"
				onClick={() => onPlugLeak(leak.id)}
				disabled={isPlugging}
				className={`shrink-0 flex items-center justify-center h-10 w-10 rounded-lg border transition-all ${
					isPlugging
						? "bg-blue-500 border-blue-500 text-white"
						: "border-slate-200 dark:border-white/10 text-slate-400 hover:border-blue-500 hover:text-blue-500"
				} disabled:opacity-70 disabled:cursor-not-allowed`}
				aria-label={`Plug leak: ${leak.label}`}
			>
				{isPlugging ? (
					<Loader2 className="w-4 h-4 animate-spin" />
				) : (
					<ZapOff className="w-4 h-4" />
				)}
			</button>
		</motion.div>
	);
}
