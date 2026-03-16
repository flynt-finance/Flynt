"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarRange = DateRange | undefined;

interface CalendarProps {
	selected?: CalendarRange;
	onSelect?: (range: CalendarRange) => void;
	disabled?: { after?: Date; before?: Date; from?: Date; to?: Date };
	className?: string;
	classNames?: {
		months?: string;
		month?: string;
		month_caption?: string;
		nav?: string;
		button_previous?: string;
		button_next?: string;
		month_grid?: string;
		weekdays?: string;
		weekday?: string;
		week?: string;
		day?: string;
		day_button?: string;
		selected?: string;
		today?: string;
		outside?: string;
		disabled?: string;
		range_start?: string;
		range_end?: string;
		range_middle?: string;
		hidden?: string;
	};
}

const Calendar = React.forwardRef<
	HTMLDivElement,
	CalendarProps &
		Omit<
			React.ComponentProps<typeof DayPicker>,
			"mode" | "selected" | "onSelect"
		>
>(({ className, classNames, selected, onSelect, disabled, ...props }, _ref) => {
	const today = new Date();
	const disableAfterToday = disabled ?? { after: today };

	return (
		<DayPicker
			mode="range"
			selected={selected}
			onSelect={onSelect}
			disabled={disableAfterToday}
			className={cn("p-3", className)}
			classNames={{
				months: "flex flex-col sm:flex-row gap-2",
				month: "flex flex-col gap-4",
				month_caption: "flex justify-center pt-1 relative items-center",
				nav: "flex items-center gap-1",
				button_previous: cn(
					"absolute left-1 h-7 w-7 rounded-md bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-bg-elevated inline-flex items-center justify-center"
				),
				button_next: cn(
					"absolute right-1 h-7 w-7 rounded-md bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-bg-elevated inline-flex items-center justify-center"
				),
				month_grid: "w-full border-collapse space-y-1",
				weekdays: "flex",
				weekday: "rounded-md w-8 font-normal text-[0.8rem] text-text-muted",
				week: "flex w-full mt-2",
				day: "relative p-0 text-center text-sm focus-within:relative [&:has([aria-selected])]:bg-bg-elevated [&:has([aria-selected].day-outside)]:bg-bg-elevated/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
				day_button:
					"h-8 w-8 rounded-md p-0 font-normal aria-selected:opacity-100 hover:bg-bg-elevated focus:bg-bg-elevated focus:outline-none",
				selected:
					"bg-green-primary text-white hover:bg-green-primary hover:text-white focus:bg-green-primary focus:text-white",
				today:
					"bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
				outside:
					"day-outside text-text-muted opacity-50 aria-selected:bg-bg-elevated/50",
				disabled: "text-text-muted opacity-50",
				range_start: "rounded-l-md",
				range_end: "rounded-r-md",
				range_middle: "rounded-none bg-green-primary/20",
				hidden: "invisible",
				...classNames,
			}}
			components={{
				Chevron: ({ orientation }) => {
					const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
					return <Icon className="h-4 w-4" aria-hidden />;
				},
			}}
			{...props}
		/>
	);
});
Calendar.displayName = "Calendar";

export { Calendar };
