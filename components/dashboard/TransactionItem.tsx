"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { Transaction } from "@/lib/api/types";
import { getCategoryIconComponent } from "@/lib/transactions/category-icons";

interface LegacyTransactionItemProps {
	merchant: string;
	amount: number;
	category: string;
	date: string;
	icon: string;
	transaction?: never;
	onClick?: () => void;
}

interface ApiTransactionItemProps {
	transaction: Transaction;
	merchant?: never;
	amount?: never;
	category?: never;
	date?: never;
	icon?: never;
	onClick?: () => void;
}

type TransactionItemProps =
	| LegacyTransactionItemProps
	| ApiTransactionItemProps;

function isApiTransactionProps(
	props: TransactionItemProps
): props is ApiTransactionItemProps {
	return "transaction" in props && props.transaction != null;
}

const formatTransactionDate = (dateString: string): string => {
	return new Date(dateString)
		.toLocaleDateString("en-NG", {
			day: "2-digit",
			month: "short",
		})
		.toUpperCase();
};

export default function TransactionItem(props: TransactionItemProps) {
	let merchant: string;
	let amount: number;
	let categoryName: string;
	let dateStr: string;
	let iconNode: React.ReactNode;
	let iconBgColor: string | undefined;
	let isApiTransaction = false;
	let typeLabel: string | null = null;
	let bankName: string | null = null;
	let statusLabel: string | null = null;

	if (isApiTransactionProps(props)) {
		const t = props.transaction;
		isApiTransaction = true;
		merchant = t.narration;
		amount = t.type === "OUTFLOW" ? -Math.abs(t.amount) : Math.abs(t.amount);
		categoryName = t.category?.name ?? "Uncategorized";
		dateStr = formatTransactionDate(t.date);
		typeLabel = t.type === "INFLOW" ? "INCOME" : "DEBIT";
		bankName = t.bankName ?? null;
		statusLabel = t.status ?? "COMPLETED";
		const IconComponent = getCategoryIconComponent(t.category?.icon);
		const color = t.category?.color;
		if (color) iconBgColor = color;
		iconNode = (
			<IconComponent
				className="h-5 w-5"
				style={color ? { color } : undefined}
				aria-hidden
			/>
		);
	} else {
		merchant = props.merchant;
		amount = props.amount;
		categoryName = props.category;
		dateStr = props.date;
		iconNode = props.icon;
	}

	const isNegative = amount < 0;
	const onClick = props.onClick;

	const content = isApiTransaction ? (
		<>
			<div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
				<motion.div
					whileHover={{ scale: 1.1 }}
					transition={{ type: "spring", stiffness: 300 }}
					className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg sm:h-12 sm:w-12 sm:rounded-xl ${
						!iconBgColor ? "bg-bg-elevated" : ""
					}`}
					style={
						iconBgColor ? { backgroundColor: `${iconBgColor}20` } : undefined
					}
				>
					{iconNode}
				</motion.div>
				<div className="min-w-0 flex-1 space-y-1">
					<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
						<p className="min-w-0 truncate font-bold text-text-primary text-sm sm:text-base">
							{merchant}
						</p>
						<span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border-primary bg-bg-elevated px-1.5 py-0.5 sm:px-2">
							<span
								className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500"
								aria-hidden
							/>
							<span className="text-[9px] font-mono font-bold uppercase tracking-wider text-text-muted">
								{bankName ?? "—"}
							</span>
						</span>
					</div>
					<div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-medium text-text-muted sm:text-[11px]">
						<span className="flex shrink-0 items-center gap-1 uppercase tracking-tighter">
							<Calendar className="h-3 w-3 shrink-0" aria-hidden />
							{dateStr}
						</span>
						{typeLabel && (
							<>
								<span
									className="h-1 w-1 shrink-0 rounded-full bg-slate-400"
									aria-hidden
								/>
								<span className="shrink-0 rounded border border-border-primary bg-bg-elevated px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest">
									{typeLabel}
								</span>
							</>
						)}
					</div>
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-2 text-right sm:gap-4">
				<div className="min-w-0">
					<p
						className={`truncate font-mono font-bold text-sm sm:text-lg ${
							isNegative ? "text-error" : "text-success"
						}`}
					>
						{isNegative ? "-" : "+"}₦{Math.abs(amount).toLocaleString()}
					</p>
					{isApiTransaction && statusLabel && (
						<p className="text-[9px] font-bold uppercase tracking-widest text-text-muted">
							{statusLabel}
						</p>
					)}
				</div>
				{isNegative ? (
					<ArrowUpRight
						className="h-4 w-4 shrink-0 text-text-muted sm:h-5 sm:w-5"
						aria-hidden
					/>
				) : (
					<ArrowDownLeft
						className="h-4 w-4 shrink-0 text-success sm:h-5 sm:w-5"
						aria-hidden
					/>
				)}
			</div>
		</>
	) : (
		<>
			<div className="flex items-center gap-3">
				<motion.div
					whileHover={{ scale: 1.2, rotate: 10 }}
					transition={{ type: "spring", stiffness: 300 }}
					className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
						!iconBgColor ? "bg-bg-elevated" : ""
					}`}
					style={
						iconBgColor ? { backgroundColor: `${iconBgColor}20` } : undefined
					}
				>
					{iconNode}
				</motion.div>
				<div className="min-w-0">
					<p className="truncate font-medium text-text-primary text-sm">
						{merchant}
					</p>
					<p className="text-xs text-text-muted">
						{categoryName} • {dateStr}
					</p>
				</div>
			</div>
			<motion.span
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.1 }}
				className={`shrink-0 font-semibold ${
					isNegative ? "text-error" : "text-success"
				}`}
			>
				{isNegative ? "-" : "+"}₦{Math.abs(amount).toLocaleString()}
			</motion.span>
		</>
	);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (onClick && (e.key === "Enter" || e.key === " ")) {
			e.preventDefault();
			onClick();
		}
	};

	const paddingClass = isApiTransaction ? "p-3 sm:p-4" : "p-3";

	if (onClick) {
		return (
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				whileHover={{ x: 4, backgroundColor: "var(--bg-hover)" }}
				transition={{ duration: 0.2 }}
				className={`flex min-w-0 cursor-pointer items-center justify-between gap-2 rounded-lg ${paddingClass}`}
				onClick={onClick}
				onKeyDown={handleKeyDown}
				role="button"
				tabIndex={0}
				aria-label={`View transaction: ${merchant}`}
			>
				{content}
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			whileHover={{ x: 4, backgroundColor: "var(--bg-hover)" }}
			transition={{ duration: 0.2 }}
			className={`flex min-w-0 items-center justify-between gap-2 rounded-lg ${paddingClass}`}
		>
			{content}
		</motion.div>
	);
}
