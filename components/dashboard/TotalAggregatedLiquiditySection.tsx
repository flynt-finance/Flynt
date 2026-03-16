"use client";

import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { useLiquidityQuery } from "@/lib/api/requests";
import type { LiquidityApiResponse } from "@/lib/api/types";
import LiquidityTerminal from "@/components/ui/LiquidityTerminal";

const BANK_COLORS = [
	"bg-red-600",
	"bg-orange-500",
	"bg-red-800",
	"bg-emerald-500",
];

const CARD_CLASS =
	"relative h-96 overflow-hidden rounded-2xl border border-slate-100 dark:border-white/10 dark:bg-[#0D1131] bg-bg-secondary p-8";

export default function TotalAggregatedLiquiditySection() {
	const { data: liquidityResponse, isLoading } = useLiquidityQuery();

	const res = liquidityResponse as LiquidityApiResponse | undefined;
	const liquidityData = res?.success && res?.data ? res.data : null;
	const hasAccounts =
		liquidityData?.accounts && liquidityData.accounts.length > 0;
	const isEmpty =
		!isLoading && (res?.success !== true || !liquidityData?.accounts?.length);

	if (isLoading) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className={CARD_CLASS}
			>
				<div className="relative z-10">
					<div className="flex items-center justify-between mb-8">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
								<Wallet className="w-4 h-4 text-emerald-500" aria-hidden />
							</div>
							<div className="space-y-1">
								<div className="h-3 w-40 rounded bg-border-subtle animate-pulse" />
								<div className="h-2.5 w-32 rounded bg-border-subtle animate-pulse" />
							</div>
						</div>
					</div>
					<div className="mb-8">
						<div className="h-12 w-48 rounded bg-border-subtle animate-pulse" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-slate-100 dark:border-white/5">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex flex-col gap-2">
								<div className="flex items-center gap-2">
									<div className="h-1.5 w-1.5 rounded-full bg-border-subtle animate-pulse" />
									<div className="h-3 w-16 rounded bg-border-subtle animate-pulse" />
								</div>
								<div className="h-4 w-20 rounded bg-border-subtle animate-pulse" />
							</div>
						))}
					</div>
				</div>
				<div className="absolute top-0 right-0 p-1 pointer-events-none opacity-50">
					<div className="w-8 h-8 border-t border-r border-slate-200 dark:border-white/10 rounded-tr-xl" />
				</div>
			</motion.div>
		);
	}

	if (isEmpty) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className={CARD_CLASS}
			>
				<div className="relative z-10 flex flex-col items-center justify-center h-full min-h-80 text-center px-4">
					<div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
						<Wallet className="w-12 h-12 text-emerald-500" aria-hidden />
					</div>
					<p className="text-base font-bold text-text-primary mb-1">
						No liquidity data
					</p>
					<p className="text-sm text-text-muted max-w-xs">
						Connect your bank accounts to see your aggregated balance here.
					</p>
				</div>
				<div className="absolute top-0 right-0 p-1 pointer-events-none opacity-50">
					<div className="w-8 h-8 border-t border-r border-slate-200 dark:border-white/10 rounded-tr-xl" />
				</div>
			</motion.div>
		);
	}

	const connectedBanks =
		liquidityData!.accounts.map((acc, i) => ({
			name: acc.bankName,
			amount: acc.balance,
			color: BANK_COLORS[i % BANK_COLORS.length],
		})) ?? [];

	return (
		<LiquidityTerminal
			totalBalance={liquidityData!.totalBalance}
			connectedBanks={connectedBanks}
		/>
	);
}
