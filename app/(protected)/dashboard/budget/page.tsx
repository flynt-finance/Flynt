"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Target,
	Zap,
	TrendingUp,
	ShieldCheck,
	AlertCircle,
	BrainCircuit,
	History,
	Bell,
} from "lucide-react";
import {
	useGovernanceSummaryQuery,
	useSaveGovernanceAllocationsMutation,
} from "@/lib/api/requests";
import { useGlobalLoader } from "@/contexts/GlobalLoaderContext";
import { ConfirmModal } from "@/components/modal";
import type { GovernanceAllocationItem } from "@/lib/api/types";

const ALLOCATION_KEYS = {
	ESSENTIALS: "ESSENTIALS",
	DISCRETIONARY: "DISCRETIONARY",
	SAVINGS: "SAVINGS",
} as const;

interface StatCardProps {
	title: string;
	value: number;
	status?: "warning" | "active";
	icon: React.ComponentType<{ size?: number }>;
}

const StatCard = ({ title, value, status, icon: Icon }: StatCardProps) => (
	<div className="bg-bg-secondary dark:bg-[#0D1131] border border-slate-200 dark:border-white/5 p-5 rounded-xl relative overflow-hidden group">
		<div className="flex justify-between items-start mb-4">
			<div className="p-2 rounded-xl bg-bg-primary dark:bg-white/5 text-slate-600 dark:text-slate-400">
				<Icon size={18} />
			</div>
			{status ? (
				<span
					className={`text-[10px] font-bold uppercase tracking-widest ${
						status === "warning" ? "text-orange-500" : "text-emerald-500"
					}`}
				>
					● {status === "warning" ? "Warning" : "Active"}
				</span>
			) : null}
		</div>
		<p className="text-xs font-medium text-slate-500 uppercase tracking-tighter">
			{title}
		</p>
		<p className="text-2xl font-mono font-bold text-text-secondary dark:text-white mt-1">
			₦{value.toLocaleString()}
		</p>
	</div>
);

function getAllocationByKey(
	allocations: GovernanceAllocationItem[],
	key: string
): GovernanceAllocationItem | undefined {
	return allocations.find((a) => a.key === key);
}

export default function BudgetPage() {
	const { data, isLoading, isSuccess, refetch } = useGovernanceSummaryQuery();
	const saveMutation = useSaveGovernanceAllocationsMutation();
	const { showLoader, hideLoader } = useGlobalLoader();

	const [confirmOpen, setConfirmOpen] = useState(false);
	const [essentialsPct, setEssentialsPct] = useState(50);
	const [discretionaryPct, setDiscretionaryPct] = useState(30);
	const [savingsPct, setSavingsPct] = useState(20);

	const summaryData = data?.data;
	const metrics = summaryData?.metrics;
	const cycle = summaryData?.cycle;
	const totalInflow = metrics?.totalInflow ?? 0;

	useEffect(() => {
		const list = summaryData?.allocations ?? [];
		if (!isSuccess || list.length === 0) return;
		const ess = getAllocationByKey(list, ALLOCATION_KEYS.ESSENTIALS);
		const disc = getAllocationByKey(list, ALLOCATION_KEYS.DISCRETIONARY);
		const sav = getAllocationByKey(list, ALLOCATION_KEYS.SAVINGS);
		if (ess) setEssentialsPct(ess.targetPercentage);
		if (disc) setDiscretionaryPct(disc.targetPercentage);
		if (sav) setSavingsPct(sav.targetPercentage);
	}, [isSuccess, summaryData]);

	const totalPct = essentialsPct + discretionaryPct + savingsPct;
	const canSave = totalPct === 100;
	const isOverAllocated = totalInflow > 0 && totalPct > 100;

	const handleSaveClick = useCallback(() => {
		if (!canSave) return;
		setConfirmOpen(true);
	}, [canSave]);

	const handleConfirmSave = useCallback(async () => {
		if (!canSave) return;
		showLoader({
			title: "Saving allocation",
			subtitle: "Updating your budget percentages…",
		});
		setConfirmOpen(false);
		try {
			await saveMutation.mutateAsync({
				essentials: essentialsPct,
				discretionary: discretionaryPct,
				savings: savingsPct,
			});
			await refetch();
		} finally {
			hideLoader();
		}
	}, [
		canSave,
		essentialsPct,
		discretionaryPct,
		savingsPct,
		saveMutation,
		refetch,
		showLoader,
		hideLoader,
	]);

	const allocationRows = [
		{
			key: ALLOCATION_KEYS.ESSENTIALS,
			label: "Essentials",
			desc: "Rent, power, data & food",
			pct: essentialsPct,
			setPct: setEssentialsPct,
			color: "bg-emerald-500",
		},
		{
			key: ALLOCATION_KEYS.DISCRETIONARY,
			label: "Discretionary",
			desc: "Lifestyle, dining & movie nights",
			pct: discretionaryPct,
			setPct: setDiscretionaryPct,
			color: "bg-blue-500",
		},
		{
			key: ALLOCATION_KEYS.SAVINGS,
			label: "Savings",
			desc: "Emergency fund & stock index",
			pct: savingsPct,
			setPct: setSavingsPct,
			color: "bg-purple-500",
		},
	];

	if (isLoading) {
		return (
			<div className="max-w-7xl mx-auto p-6 pb-24 flex items-center justify-center min-h-[40vh]">
				<div
					className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"
					role="status"
					aria-label="Loading budget"
				/>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto space-y-8 p-6 pb-24">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<div className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
							Fiscal Year 2026
						</div>
						<span className="text-slate-400 text-xs font-medium">
							{cycle?.label ?? "Cycle"}
						</span>
					</div>
					<h1 className="text-4xl font-black tracking-tight text-text-secondary dark:text-white">
						Financial Governance
					</h1>
				</div>

				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={handleSaveClick}
						disabled={!canSave}
						aria-label="Save allocation"
						className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:scale-105 transition-transform shadow-xl shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
					>
						Save Allocation
					</button>
				</div>
			</div>

			{/* Primary Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<StatCard
					title="Monthly Inflow"
					value={metrics?.totalInflow ?? 0}
					icon={TrendingUp}
				/>
				<StatCard
					title="Allocated"
					value={metrics?.allocatedAmount ?? 0}
					icon={Target}
					status={isOverAllocated ? "warning" : "active"}
				/>
				<StatCard
					title="Total Spent"
					value={metrics?.totalSpent ?? 0}
					icon={Zap}
				/>
				<div className="bg-emerald-500 p-5 rounded-xl text-white shadow-lg shadow-emerald-500/20">
					<p className="text-xs font-bold uppercase tracking-widest text-emerald-100">
						Safe to Spend
					</p>
					<p className="text-3xl font-mono font-bold mt-2">
						₦{(metrics?.safeToSpend ?? 0).toLocaleString()}
					</p>
					<div className="mt-4 h-1 w-full bg-white/20 rounded-full overflow-hidden">
						<div
							className="h-full bg-white transition-all duration-300"
							style={{
								width: `${
									totalInflow > 0
										? Math.min(
												100,
												((metrics?.safeToSpend ?? 0) / totalInflow) * 100
										  )
										: 0
								}%`,
							}}
						/>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Allocation Controller */}
				<div className="lg:col-span-2 space-y-6">
					<section className="bg-bg-secondary dark:bg-[#0D1131] border border-slate-200 dark:border-white/5 rounded-xl p-8">
						<div className="flex items-center justify-between mb-8">
							<h2 className="text-xl font-bold flex items-center gap-2 text-text-secondary dark:text-white">
								<BrainCircuit className="text-emerald-500" /> Live Allocation
							</h2>
							<div className="text-xs font-mono text-slate-400">
								Drag to adjust (must total 100%)
							</div>
						</div>

						<div className="space-y-12">
							{allocationRows.map((row) => (
								<div key={row.key} className="group">
									<div className="flex justify-between items-end mb-4">
										<div>
											<h4 className="font-bold text-text-secondary dark:text-white">
												{row.label}
											</h4>
											<p className="text-xs text-text-primary">{row.desc}</p>
										</div>
										<div className="text-right">
											<span className="text-xl font-mono font-bold">
												₦
												{Math.round(
													(totalInflow * row.pct) / 100
												).toLocaleString()}
											</span>
											<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
												{row.pct}% of Inflow
											</p>
										</div>
									</div>
									<input
										type="range"
										min="0"
										max="100"
										step="1"
										value={row.pct}
										onChange={(e) =>
											row.setPct(
												Math.min(100, parseInt(e.target.value, 10) || 0)
											)
										}
										aria-label={`${row.label} percentage`}
										className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-bg-primary dark:bg-white/5 accent-emerald-500"
									/>
								</div>
							))}
						</div>

						<AnimatePresence>
							{!canSave && totalPct !== 0 && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-amber-600 dark:text-amber-400"
								>
									<AlertCircle size={20} aria-hidden />
									<p className="text-sm font-bold">
										Total must equal 100% to save. Current: {totalPct}%
									</p>
								</motion.div>
							)}
						</AnimatePresence>
					</section>

					{/* Quick Actions Bar - static */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<QuickAction
							icon={ShieldCheck}
							label="Safe Lock"
							sub="Secure leftovers"
							color="text-emerald-500"
						/>
						<QuickAction
							icon={Bell}
							label="Alerts"
							sub="Smart reminders"
							color="text-purple-500"
						/>
						<QuickAction
							icon={History}
							label="Audit"
							sub="View past cycles"
							color="text-blue-500"
						/>
					</div>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					<div className="bg-bg-primary dark:bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden border border-border-primary dark:border-white/5">
						<div className="relative z-10">
							<h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-primary dark:text-white">
								<Zap className="text-yellow-400 fill-yellow-400" /> Flynt AI
								Suggests
							</h3>
							<p className="text-sm text-text-primary leading-relaxed mb-6">
								&quot;We noticed your **Discretionary** spend usually peaks on
								Fridays. If you cut 10% from dining out, you could hit your
								**Savings** goal 4 months earlier.&quot;
							</p>
							<button
								type="button"
								className="w-full py-3 rounded-xl text-text-primary bg-bg-secondary dark:bg-white/5 hover:bg-white/20 border border-white/10 text-xs font-bold uppercase tracking-widest transition-all"
								aria-label="Apply AI optimization"
							>
								Apply AI Optimization
							</button>
						</div>
						<div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/20 blur-[100px]" />
					</div>

					<div className="bg-bg-primary dark:bg-[#0D1131] border border-border-primary dark:border-white/5 rounded-xl p-8">
						<h3 className="font-bold mb-4 text-text-secondary dark:text-white">
							Rule of Thumb
						</h3>
						<div className="space-y-4">
							<RuleItem label="Needs" percent={50} current={essentialsPct} />
							<RuleItem label="Wants" percent={30} current={discretionaryPct} />
							<RuleItem label="Invest" percent={20} current={savingsPct} />
						</div>
					</div>
				</div>
			</div>

			<ConfirmModal
				open={confirmOpen}
				onClose={() => setConfirmOpen(false)}
				title="Save allocation"
				subtitle={`Save budget as Essentials ${essentialsPct}%, Discretionary ${discretionaryPct}%, Savings ${savingsPct}%?`}
				confirmLabel="Save"
				cancelLabel="Cancel"
				onConfirm={handleConfirmSave}
			/>
		</div>
	);
}

interface QuickActionProps {
	icon: React.ComponentType<{ size?: number }>;
	label: string;
	sub: string;
	color: string;
}

function QuickAction({ icon: Icon, label, sub, color }: QuickActionProps) {
	return (
		<button
			type="button"
			className="p-4 rounded-xl bg-bg-secondary dark:bg-[#0D1131] border border-slate-200 dark:border-white/5 flex flex-col items-center text-center gap-1 group hover:border-emerald-500/50 transition-all"
			aria-label={label}
		>
			<div
				className={`p-3 rounded-xl bg-bg-primary dark:bg-white/5 ${color} mb-2 group-hover:scale-110 transition-transform`}
			>
				<Icon size={20} />
			</div>
			<span className="text-sm font-bold text-text-secondary dark:text-white">
				{label}
			</span>
			<span className="text-[10px] text-text-primary font-bold uppercase tracking-tighter">
				{sub}
			</span>
		</button>
	);
}

interface RuleItemProps {
	label: string;
	percent: number;
	current: number;
}

function RuleItem({ label, percent, current }: RuleItemProps) {
	const diff = current - percent;
	return (
		<div className="space-y-1">
			<div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
				<span className="text-text-primary dark:text-slate-400">
					{label} ({percent}%)
				</span>
				<span className={diff > 0 ? "text-orange-500" : "text-emerald-500"}>
					{current}%
				</span>
			</div>
			<div className="h-1 w-full bg-bg-secondary dark:bg-white/5 rounded-full">
				<div
					className={`h-full rounded-full ${
						diff > 0 ? "bg-orange-500" : "bg-emerald-500"
					}`}
					style={{ width: `${Math.min(100, current)}%` }}
				/>
			</div>
		</div>
	);
}
