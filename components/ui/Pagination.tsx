"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const MAX_VISIBLE_PAGES = 7;

/** Returns at most 7 page numbers with ellipsis where gaps exist. */
function getPaginationItems(
	currentPage: number,
	totalPages: number
): (number | "ellipsis")[] {
	if (totalPages <= MAX_VISIBLE_PAGES) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}
	const current = currentPage;
	const windowStart = Math.max(1, current - 2);
	const windowEnd = Math.min(totalPages, current + 2);
	const pages = new Set<number>([1, totalPages]);
	for (let p = windowStart; p <= windowEnd; p++) pages.add(p);
	const sorted = Array.from(pages).sort((a, b) => a - b);
	const result: (number | "ellipsis")[] = [];
	for (let i = 0; i < sorted.length; i++) {
		if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("ellipsis");
		result.push(sorted[i]);
	}
	return result;
}

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	total?: number;
	limit?: number;
}

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	total = 0,
	limit = 50,
}: PaginationProps) {
	const start = total === 0 ? 0 : (currentPage - 1) * limit + 1;
	const end = Math.min(currentPage * limit, total);
	const paginationItems = getPaginationItems(currentPage, totalPages);

	const handlePrev = () => {
		if (currentPage > 1) onPageChange(currentPage - 1);
	};

	const handleNext = () => {
		if (currentPage < totalPages) onPageChange(currentPage + 1);
	};

	const handleKeyDown = (
		e: React.KeyboardEvent,
		action: "prev" | "next" | "page",
		value?: number
	) => {
		if (e.key !== "Enter" && e.key !== " ") return;
		e.preventDefault();
		if (action === "prev") handlePrev();
		else if (action === "next") handleNext();
		else if (value !== undefined) onPageChange(value);
	};

	if (totalPages <= 1) return null;

	return (
		<div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
			{total > 0 && (
				<p className="order-2 text-center text-xs text-text-muted sm:order-1 sm:text-left sm:text-sm">
					Showing <span className="font-medium text-text-primary">{start}</span>
					–<span className="font-medium text-text-primary">{end}</span> of{" "}
					<span className="font-medium text-text-primary">{total}</span>
				</p>
			)}
			<div className="order-1 flex w-full items-center justify-center gap-2 sm:order-2 sm:w-auto">
				<button
					type="button"
					onClick={handlePrev}
					onKeyDown={(e) => handleKeyDown(e, "prev")}
					disabled={currentPage <= 1}
					aria-label="Previous page"
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-primary bg-bg-card text-text-primary transition-colors hover:bg-bg-elevated disabled:pointer-events-none disabled:opacity-50"
				>
					<ChevronLeft className="h-4 w-4" aria-hidden />
				</button>
				{/* Mobile: compact "Page X of Y" */}
				<span className="min-w-18 text-center text-sm font-medium text-text-primary sm:hidden">
					{currentPage} / {totalPages}
				</span>
				{/* Desktop: max 7 page numbers with ellipsis */}
				<span className="hidden flex-wrap items-center justify-center gap-1 px-1 sm:flex">
					{paginationItems.map((item, index) =>
						item === "ellipsis" ? (
							<span
								key={`ellipsis-${index}`}
								className="flex h-9 min-w-9 items-center justify-center px-1 text-sm text-text-muted"
								aria-hidden
							>
								…
							</span>
						) : (
							<button
								key={item}
								type="button"
								onClick={() => onPageChange(item)}
								onKeyDown={(e) => handleKeyDown(e, "page", item)}
								aria-label={`Page ${item}`}
								aria-current={currentPage === item ? "page" : undefined}
								className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors ${
									currentPage === item
										? "border-green-primary bg-green-primary/10 text-green-primary"
										: "border-border-primary bg-bg-card text-text-primary hover:bg-bg-elevated"
								}`}
							>
								{item}
							</button>
						)
					)}
				</span>
				<button
					type="button"
					onClick={handleNext}
					onKeyDown={(e) => handleKeyDown(e, "next")}
					disabled={currentPage >= totalPages}
					aria-label="Next page"
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-primary bg-bg-card text-text-primary transition-colors hover:bg-bg-elevated disabled:pointer-events-none disabled:opacity-50"
				>
					<ChevronRight className="h-4 w-4" aria-hidden />
				</button>
			</div>
		</div>
	);
}
