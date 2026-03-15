"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Loader2 } from "lucide-react";
import {
	TransactionItem,
	TransactionDetailModal,
} from "@/components/dashboard";
import { Pagination } from "@/components/ui";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTriggerButton,
} from "@/components/ui/dropdown-menu";
import {
	useLinkedAccountsQuery,
	useTransactionsQuery,
	useTransactionsSummaryQuery,
} from "@/lib/api/requests";
import type { Transaction } from "@/lib/api/types";
import type {
	LinkedAccountsApiResponse,
	TransactionsApiResponse,
	TransactionSummaryApiResponse,
} from "@/lib/api/types";

const TYPE_OPTIONS = [
	{ value: "all", label: "All" },
	{ value: "debit", label: "Debit" },
	{ value: "credit", label: "Credit" },
] as const;

const TRANSACTIONS_LIMIT = 50;

const getLastFourFromAccountNumber = (accountNumber: string): string => {
	const digits = accountNumber.replace(/\D/g, "");
	if (digits.length >= 4) return digits.slice(-4);
	return accountNumber.slice(-4) || "****";
};

export default function TransactionsPage() {
	const [page, setPage] = useState(1);
	const [typeFilter, setTypeFilter] = useState<"all" | "debit" | "credit">(
		"all"
	);
	const [search, setSearch] = useState("");
	const [accountId, setAccountId] = useState("");
	const [selectedTransaction, setSelectedTransaction] =
		useState<Transaction | null>(null);

	const { data: linkedAccountsResponse } = useLinkedAccountsQuery();
	const linkedAccountsRes = linkedAccountsResponse as
		| LinkedAccountsApiResponse
		| undefined;
	const linkedAccounts =
		linkedAccountsRes?.success && Array.isArray(linkedAccountsRes?.data)
			? linkedAccountsRes.data
			: [];

	const selectedAccount = linkedAccounts.find((a) => a.id === accountId);
	const accountLabel =
		accountId === "" || !selectedAccount
			? "All accounts"
			: `${
					selectedAccount.bankName || selectedAccount.institution
			  } ****${getLastFourFromAccountNumber(selectedAccount.accountNumber)}`;

	const queryParams = {
		limit: TRANSACTIONS_LIMIT,
		page,
		...(typeFilter !== "all" && { type: typeFilter }),
		...(search.trim() !== "" && { search: search.trim() }),
		...(accountId !== "" && { accountId }),
	};

	const { data: transactionsResponse, isLoading: isTransactionsLoading } =
		useTransactionsQuery(queryParams);
	const { data: summaryResponse, isLoading: isSummaryLoading } =
		useTransactionsSummaryQuery();

	const summaryRes = summaryResponse as
		| TransactionSummaryApiResponse
		| undefined;
	const summaryData =
		summaryRes?.success && summaryRes?.data ? summaryRes.data : null;

	const res = transactionsResponse as TransactionsApiResponse | undefined;
	const transactionsData = res?.success && res?.data ? res.data : null;
	const transactions = transactionsData?.transactions ?? [];
	const total = transactionsData?.total ?? 0;
	const totalPages = transactionsData?.totalPages ?? 0;
	const hasTransactions = !isTransactionsLoading && transactions.length > 0;
	const isEmpty =
		!isTransactionsLoading && (!transactionsData || transactions.length === 0);

	const handlePageChange = useCallback((newPage: number) => {
		setPage(newPage);
	}, []);

	const handleTypeChange = useCallback((value: "all" | "debit" | "credit") => {
		setTypeFilter(value);
		setPage(1);
	}, []);

	const handleAccountChange = useCallback((value: string) => {
		setAccountId(value);
		setPage(1);
	}, []);

	return (
		<div className="mx-auto max-w-7xl space-y-6 p-4 sm:space-y-8 sm:p-6">
			{/* Header */}
			<header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div className="min-w-0">
					<div className="mb-1 flex items-center gap-2">
						<div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
						<span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-500">
							Live Ledger Sync
						</span>
					</div>
					<h1 className="truncate text-2xl font-bold tracking-tight text-text-secondary dark:text-white sm:text-3xl">
						Transaction Analytics
					</h1>
				</div>

				<div className="flex shrink-0 flex-wrap gap-2 sm:gap-3">
					{isSummaryLoading ? (
						<>
							<div className="flex min-w-28 items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 dark:border-white/10 dark:bg-white/5">
								<Loader2
									className="h-4 w-4 shrink-0 animate-spin text-slate-400"
									aria-hidden
								/>
								<div className="h-4 w-12 rounded bg-slate-200 dark:bg-white/10 animate-pulse" />
							</div>
							<div className="flex min-w-28 items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 dark:border-white/10 dark:bg-white/5">
								<Loader2
									className="h-4 w-4 shrink-0 animate-spin text-slate-400"
									aria-hidden
								/>
								<div className="h-4 w-12 rounded bg-slate-200 dark:bg-white/10 animate-pulse" />
							</div>
						</>
					) : summaryData ? (
						<>
							<div className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 dark:border-white/10 dark:bg-white/5">
								<p className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">
									{summaryData.inflow.label}
								</p>
								<p
									className="text-sm font-mono font-bold"
									style={{ color: summaryData.inflow.statusColor }}
								>
									{summaryData.inflow.displayAmount}
								</p>
							</div>
							<div className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 dark:border-white/10 dark:bg-white/5">
								<p className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">
									{summaryData.outflow.label}
								</p>
								<p
									className="text-sm font-mono font-bold"
									style={{ color: summaryData.outflow.statusColor }}
								>
									{summaryData.outflow.displayAmount}
								</p>
							</div>
						</>
					) : (
						<>
							<div className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 dark:border-white/10 dark:bg-white/5">
								<p className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">
									Inflow
								</p>
								<p className="text-sm font-mono font-bold text-emerald-500">
									—
								</p>
							</div>
							<div className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 dark:border-white/10 dark:bg-white/5">
								<p className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">
									Outflow
								</p>
								<p className="text-sm font-mono font-bold text-red-500">—</p>
							</div>
						</>
					)}
				</div>
			</header>

			{/* Control Bar */}
			<div className="sticky top-14 z-30 flex flex-col gap-3 rounded-xl border border-slate-200 bg-bg-secondary p-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#0D1131]/80 sm:top-16 sm:gap-4 sm:rounded-2xl sm:p-4 md:flex-row md:items-center">
				<div className="relative flex min-w-0 flex-1">
					<Search
						className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
						aria-hidden
					/>
					<input
						type="text"
						placeholder="Search merchant or category..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
						className="w-full border-none bg-transparent py-2 pl-10 text-sm text-slate-900 placeholder:text-slate-500 focus:ring-0 dark:text-white"
						aria-label="Search transactions"
					/>
				</div>

				<div className="flex items-center gap-2 overflow-x-auto px-2 md:px-0">
					<Filter
						className="hidden h-4 w-4 text-slate-400 md:block"
						aria-hidden
					/>
					{TYPE_OPTIONS.map((opt) => (
						<button
							key={opt.value}
							type="button"
							onClick={() => handleTypeChange(opt.value)}
							className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
								typeFilter === opt.value
									? "bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900"
									: "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
							}`}
							aria-pressed={typeFilter === opt.value}
							aria-label={`Filter by ${opt.label}`}
						>
							{opt.label}
						</button>
					))}

					<DropdownMenu>
						<DropdownMenuTriggerButton
							type="button"
							className="shrink-0 min-w-32 sm:min-w-40"
							aria-label="Filter by linked account"
						>
							<span className="truncate">{accountLabel}</span>
						</DropdownMenuTriggerButton>
						<DropdownMenuContent
							align="end"
							className="max-h-[min(20rem,70vh)] overflow-y-auto"
						>
							<DropdownMenuItem onSelect={() => handleAccountChange("")}>
								All accounts
							</DropdownMenuItem>
							{linkedAccounts.map((a) => (
								<DropdownMenuItem
									key={a.id}
									onSelect={() => handleAccountChange(a.id)}
								>
									{a.bankName || a.institution} ****
									{getLastFourFromAccountNumber(a.accountNumber)}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Transaction Feed */}
			<div className="min-w-0 space-y-2 overflow-hidden">
				{isTransactionsLoading && (
					<div className="space-y-2">
						{Array.from({ length: 8 }).map((_, i) => (
							<div
								key={i}
								className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-bg-secondary p-3 dark:border-white/5 dark:bg-[#0D1131] sm:rounded-2xl sm:p-4"
							>
								<div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
									<div className="h-10 w-10 shrink-0 rounded-lg bg-border-subtle animate-pulse sm:h-12 sm:w-12 sm:rounded-xl" />
									<div className="min-w-0 flex-1 space-y-2">
										<div className="h-4 w-32 rounded bg-border-subtle animate-pulse sm:w-40" />
										<div className="h-3 w-20 rounded bg-border-subtle animate-pulse sm:w-24" />
									</div>
								</div>
								<div className="h-5 w-14 shrink-0 rounded bg-border-subtle animate-pulse sm:h-6 sm:w-20" />
							</div>
						))}
					</div>
				)}

				<AnimatePresence mode="popLayout">
					{hasTransactions &&
						transactions.map((txn) => (
							<motion.div
								key={txn.id}
								layout
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.98 }}
								className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-bg-secondary transition-all hover:border-emerald-500/30 dark:border-white/5 dark:bg-[#0D1131] dark:hover:bg-white/2 sm:rounded-2xl"
							>
								<TransactionItem
									transaction={txn}
									onClick={() => setSelectedTransaction(txn)}
								/>
							</motion.div>
						))}
				</AnimatePresence>

				{isEmpty && (
					<div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 py-20 dark:border-white/5">
						<Search className="mb-4 h-8 w-8 text-slate-300" aria-hidden />
						<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
							No matching transactions
						</p>
					</div>
				)}
			</div>

			{hasTransactions && totalPages > 1 && (
				<div className="sticky bottom-0 z-20 w-full rounded-xl border border-slate-200 bg-bg-secondary p-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#0D1131]/80 sm:rounded-2xl sm:p-4">
					<Pagination
						currentPage={page}
						totalPages={totalPages}
						onPageChange={handlePageChange}
						total={total}
						limit={TRANSACTIONS_LIMIT}
					/>
				</div>
			)}

			<TransactionDetailModal
				isOpen={selectedTransaction !== null}
				onClose={() => setSelectedTransaction(null)}
				transaction={selectedTransaction}
			/>
		</div>
	);
}
