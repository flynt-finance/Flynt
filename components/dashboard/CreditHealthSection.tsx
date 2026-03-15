"use client";

import { useState, useCallback } from "react";
import CreditScoreGauge from "./CreditScoreGauge";
import Modal from "@/components/modal/Modal";
import { useCreditScoreQuery } from "@/lib/api/requests";
import type { CreditScoreData, CreditScoreFactor } from "@/lib/api/types";

const formatGeneratedAt = (dateString: string): string => {
	return new Date(dateString).toLocaleDateString("en-NG", {
		weekday: "short",
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const formatCurrency = (value: number): string => {
	return `₦${value.toLocaleString()}`;
};

const formatRatingLabel = (rating: string): string => {
	return rating.charAt(0).toUpperCase() + rating.slice(1).toLowerCase();
};

interface CreditScoreDetailContentProps {
	data: CreditScoreData;
}

function CreditScoreDetailContent({ data }: CreditScoreDetailContentProps) {
	const { score, rating, generatedAt, factors, financialSummary } = data;
	const factorList: { key: string; factor: CreditScoreFactor }[] = [
		{ key: "spendingBehavior", factor: factors.spendingBehavior },
		{ key: "cashflowHealth", factor: factors.cashflowHealth },
		{ key: "debtExposure", factor: factors.debtExposure },
	];

	return (
		<div className="space-y-6">
			<div className="flex flex-col items-center gap-2 rounded-xl border border-border-primary bg-bg-card p-6">
				<span className="text-5xl font-mono font-bold text-text-primary">
					{score}
				</span>
				<span className="rounded-full bg-green-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-green-primary">
					{formatRatingLabel(rating)}
				</span>
			</div>

			<div>
				<h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">
					Generated
				</h4>
				<p className="text-sm text-text-primary">
					{formatGeneratedAt(generatedAt)}
				</p>
			</div>

			<div>
				<h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">
					Score factors
				</h4>
				<ul className="space-y-3">
					{factorList.map(({ key, factor }) => (
						<li
							key={key}
							className="flex items-center justify-between rounded-lg border border-border-primary bg-bg-card px-4 py-3"
						>
							<span className="text-sm font-medium text-text-primary">
								{factor.label}
							</span>
							<div className="flex items-center gap-3">
								<span className="text-sm font-mono font-bold text-text-secondary">
									{factor.score}
								</span>
								<span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
									{Math.round(factor.weight * 100)}% weight
								</span>
							</div>
						</li>
					))}
				</ul>
			</div>

			<div>
				<h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">
					Financial summary
				</h4>
				<dl className="space-y-3">
					<div className="flex justify-between rounded-lg border border-border-primary bg-bg-card px-4 py-3">
						<dt className="text-sm font-medium text-text-muted">
							Monthly inflow
						</dt>
						<dd className="text-sm font-medium text-text-primary font-mono">
							{formatCurrency(financialSummary.monthlyInflow)}
						</dd>
					</div>
					<div className="flex justify-between rounded-lg border border-border-primary bg-bg-card px-4 py-3">
						<dt className="text-sm font-medium text-text-muted">
							Monthly outflow
						</dt>
						<dd className="text-sm font-medium text-text-primary font-mono">
							{formatCurrency(financialSummary.monthlyOutflow)}
						</dd>
					</div>
					<div className="flex justify-between rounded-lg border border-border-primary bg-bg-card px-4 py-3">
						<dt className="text-sm font-medium text-text-muted">
							Current debt
						</dt>
						<dd className="text-sm font-medium text-text-primary font-mono">
							{formatCurrency(financialSummary.currentDebt)}
						</dd>
					</div>
				</dl>
			</div>
		</div>
	);
}

export default function CreditHealthSection() {
	const { data, isLoading } = useCreditScoreQuery();
	const [modalOpen, setModalOpen] = useState(false);

	const scoreData: CreditScoreData | undefined = data?.data;
	const handleCardClick = useCallback(() => {
		setModalOpen(true);
	}, []);

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setModalOpen(true);
		}
	}, []);

	return (
		<>
			<button
				type="button"
				onClick={handleCardClick}
				onKeyDown={handleKeyDown}
				className="h-32 w-full text-left rounded-xl border border-border-primary bg-bg-card shadow-sm px-6 flex items-center gap-6 hover:border-green-primary/50 focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:ring-offset-2 transition-all cursor-pointer"
				aria-label="View credit health details"
			>
				<div className="w-24 shrink-0">
					{isLoading ? (
						<div
							className="w-24 h-12 flex items-center justify-center rounded-lg bg-bg-elevated animate-pulse"
							aria-hidden
						>
							<span className="text-lg font-mono text-text-muted">—</span>
						</div>
					) : scoreData ? (
						<CreditScoreGauge score={scoreData.score} hideLabels />
					) : (
						<div className="w-24 h-12 flex items-center justify-center rounded-lg bg-bg-elevated">
							<span className="text-sm font-medium text-text-muted">
								Unavailable
							</span>
						</div>
					)}
				</div>
				<div>
					<h3 className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">
						Credit Health
					</h3>
					<p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter leading-tight">
						Verified by Nigerian <br /> Credit Bureau
					</p>
				</div>
			</button>

			<Modal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				title="Credit Health"
				ariaLabel="Credit Health details"
				contentClassName="max-w-md"
			>
				{isLoading && !scoreData ? (
					<div
						className="flex items-center justify-center py-12"
						role="status"
						aria-label="Loading credit score"
					>
						<div className="h-10 w-10 animate-spin rounded-full border-2 border-green-primary border-t-transparent" />
					</div>
				) : scoreData ? (
					<CreditScoreDetailContent data={scoreData} />
				) : (
					<p className="text-sm text-text-muted py-4">
						Credit score is unavailable. Try again later.
					</p>
				)}
			</Modal>
		</>
	);
}
