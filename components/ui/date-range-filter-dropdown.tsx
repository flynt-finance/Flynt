"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
	format,
	startOfDay,
	endOfDay,
	subDays,
	subMonths,
	startOfMonth,
	endOfMonth,
	isBefore,
} from "date-fns";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, type CalendarRange } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export interface DateRangeValue {
	startDate: string;
	endDate: string;
}

const PRESETS = [
	{ id: "today", label: "Today" },
	{ id: "yesterday", label: "Yesterday" },
	{ id: "last7", label: "Last 7 days" },
	{ id: "lastMonth", label: "Last month" },
	{ id: "last6Months", label: "Last 6 months" },
	{ id: "lastYear", label: "Last year" },
] as const;

const getPresetRange = (
	presetId: (typeof PRESETS)[number]["id"]
): { from: Date; to: Date } => {
	const today = new Date();
	const end = endOfDay(today);
	switch (presetId) {
		case "today":
			return { from: startOfDay(today), to: end };
		case "yesterday": {
			const yesterday = subDays(today, 1);
			return { from: startOfDay(yesterday), to: endOfDay(yesterday) };
		}
		case "last7":
			return { from: startOfDay(subDays(today, 6)), to: end };
		case "lastMonth": {
			const lastMonthEnd = endOfMonth(subMonths(today, 1));
			const endCap = isBefore(lastMonthEnd, today) ? lastMonthEnd : end;
			return {
				from: startOfMonth(subMonths(today, 1)),
				to: endCap,
			};
		}
		case "last6Months":
			return { from: startOfMonth(subMonths(today, 5)), to: end };
		case "lastYear":
			return { from: startOfMonth(subMonths(today, 11)), to: end };
		default:
			return { from: startOfDay(today), to: end };
	}
};

const toDateRange = (value: DateRangeValue | null): CalendarRange => {
	if (!value) return undefined;
	const from = value.startDate ? new Date(value.startDate) : undefined;
	const to = value.endDate ? new Date(value.endDate) : undefined;
	if (!from && !to) return undefined;
	return { from, to };
};

const toValue = (range: CalendarRange): DateRangeValue | null => {
	if (!range?.from) return null;
	const to = range.to ?? range.from;
	return {
		startDate: format(range.from, "yyyy-MM-dd"),
		endDate: format(to, "yyyy-MM-dd"),
	};
};

const formatRangeLabel = (value: DateRangeValue): string => {
	const from = new Date(value.startDate);
	const to = new Date(value.endDate);
	return `${format(from, "d MMM")} – ${format(to, "d MMM yyyy")}`;
};

interface DateRangeFilterDropdownProps {
	value: DateRangeValue | null;
	onRangeSelect: (value: DateRangeValue | null) => void;
	className?: string;
	triggerClassName?: string;
}

export const DateRangeFilterDropdown = React.forwardRef<
	HTMLButtonElement,
	DateRangeFilterDropdownProps
>(function DateRangeFilterDropdown(
	{ value, onRangeSelect, className, triggerClassName },
	ref
) {
	const [open, setOpen] = React.useState(false);
	const [draft, setDraft] = React.useState<CalendarRange>(() =>
		toDateRange(value)
	);

	React.useEffect(() => {
		if (open) {
			setDraft(toDateRange(value));
		}
	}, [open, value]);

	const triggerLabel = value ? formatRangeLabel(value) : "Date range";

	const handlePresetClick = (presetId: (typeof PRESETS)[number]["id"]) => {
		const { from, to } = getPresetRange(presetId);
		setDraft({ from, to });
	};

	const handleSelect = () => {
		const next = toValue(draft);
		onRangeSelect(next ?? null);
		setOpen(false);
	};

	const handleRemove = () => {
		setDraft(undefined);
		onRangeSelect(null);
		setOpen(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			(e.currentTarget as HTMLButtonElement).click();
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					ref={ref}
					type="button"
					className={cn(
						"inline-flex h-9 min-w-32 items-center justify-between gap-2 rounded-lg border border-border-primary bg-bg-card px-3 py-2 text-sm text-text-primary shadow-sm transition-colors hover:bg-bg-elevated focus:outline-none focus:ring-2 focus:ring-green-primary/20 disabled:pointer-events-none disabled:opacity-50",
						triggerClassName,
						className
					)}
					aria-label="Filter by date range"
					aria-haspopup="dialog"
					aria-expanded={open}
					tabIndex={0}
					onKeyDown={handleKeyDown}
				>
					<span className="truncate">{triggerLabel}</span>
					<ChevronDown className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
				</button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-auto p-0" sideOffset={4}>
				<div className="flex flex-col sm:flex-row w-full">
					<div className="flex flex-col border-b border-border-primary py-2 sm:border-b-0 sm:border-r sm:py-3 px-3">
						{PRESETS.map((preset) => (
							<button
								key={preset.id}
								type="button"
								className="rounded-lg px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-elevated focus:bg-bg-elevated focus:outline-none"
								onClick={() => handlePresetClick(preset.id)}
								onKeyDown={handleKeyDown}
								tabIndex={0}
								aria-label={`Set range to ${preset.label}`}
							>
								{preset.label}
							</button>
						))}
					</div>
					<div className="p-2 sm:p-3 relative flex-auto">
						<Calendar
							selected={draft}
							onSelect={setDraft}
							defaultMonth={draft?.from ?? draft?.to ?? new Date()}
						/>
					</div>
				</div>
				<div className="flex items-center justify-end gap-2 border-t border-border-primary p-3">
					<button
						type="button"
						onClick={handleRemove}
						onKeyDown={handleKeyDown}
						className="rounded-lg border border-border-primary bg-bg-card px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-elevated focus:outline-none focus:ring-2 focus:ring-green-primary/20"
						aria-label="Remove date range filter"
						tabIndex={0}
					>
						Remove
					</button>
					<button
						type="button"
						onClick={handleSelect}
						onKeyDown={handleKeyDown}
						className="rounded-lg bg-green-primary px-3 py-2 text-sm font-semibold text-white hover:bg-green-hover focus:outline-none focus:ring-2 focus:ring-green-primary/20"
						aria-label="Apply date range"
						tabIndex={0}
					>
						Select
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
});
