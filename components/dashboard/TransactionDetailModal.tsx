"use client";

import type { Transaction } from "@/lib/api/types";
import { formatTransactionAmount } from "@/lib/utils";
import { getCategoryIconComponent } from "@/lib/transactions/category-icons";
import Modal from "@/components/modal/Modal";

interface TransactionDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	transaction: Transaction | null;
}

const formatDetailDate = (dateString: string): string => {
	return new Date(dateString).toLocaleDateString("en-NG", {
		weekday: "short",
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

export default function TransactionDetailModal({
	isOpen,
	onClose,
	transaction,
}: TransactionDetailModalProps) {
	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			title="Transaction details"
			ariaLabel="Transaction details"
			contentClassName="max-w-md"
		>
			{transaction ? (
				<div className="space-y-4">
					<div className="flex items-center gap-3 rounded-xl border border-border-primary bg-bg-card p-4">
						<div
							className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
								!transaction.category?.color ? "bg-bg-elevated" : ""
							}`}
							style={
								transaction.category?.color
									? {
											backgroundColor: `${transaction.category.color}20`,
									  }
									: undefined
							}
						>
							{(() => {
								const IconComponent = getCategoryIconComponent(
									transaction.category?.icon
								);
								return (
									<IconComponent
										className="h-6 w-6"
										style={
											transaction.category?.color
												? { color: transaction.category.color }
												: undefined
										}
										aria-hidden
									/>
								);
							})()}
						</div>
						<div className="min-w-0 flex-1">
							<p className="truncate font-bold text-text-primary">
								{transaction.narration}
							</p>
							<p className="text-sm text-text-muted">
								{transaction.category?.name ?? "Uncategorized"}
							</p>
						</div>
						<span
							className={`shrink-0 text-lg font-extrabold ${
								transaction.type === "OUTFLOW" ? "text-error" : "text-success"
							}`}
						>
							{transaction.type === "OUTFLOW" ? "-" : "+"}
							{formatTransactionAmount(
								Math.abs(transaction.amount),
								transaction.currency
							)}
						</span>
					</div>

					<dl className="space-y-3">
						<div className="flex justify-between rounded-lg border border-border-primary bg-bg-card px-4 py-3">
							<dt className="text-sm font-medium text-text-muted">Date</dt>
							<dd className="text-sm font-medium text-text-primary">
								{formatDetailDate(transaction.date)}
							</dd>
						</div>
						<div className="flex justify-between rounded-lg border border-border-primary bg-bg-card px-4 py-3">
							<dt className="text-sm font-medium text-text-muted">Type</dt>
							<dd className="text-sm font-medium text-text-primary">
								{transaction.type === "OUTFLOW" ? "Debit" : "Credit"}
							</dd>
						</div>
						{transaction.reference && (
							<div className="flex justify-between rounded-lg border border-border-primary bg-bg-card px-4 py-3">
								<dt className="text-sm font-medium text-text-muted">
									Reference
								</dt>
								<dd className="truncate text-sm font-medium text-text-primary">
									{transaction.reference}
								</dd>
							</div>
						)}
						<div className="flex justify-between rounded-lg border border-border-primary bg-bg-card px-4 py-3">
							<dt className="text-sm font-medium text-text-muted">Currency</dt>
							<dd className="text-sm font-medium text-text-primary">
								{transaction.currency}
							</dd>
						</div>
					</dl>
				</div>
			) : (
				<p className="text-sm text-text-muted">No transaction selected.</p>
			)}
		</Modal>
	);
}
