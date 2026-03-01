"use client";

import { ReactNode, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
	open: boolean;
	contentClassName?: string;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	footer?: ReactNode;
	ariaLabel?: string;
	/** When false, clicking the overlay or pressing Escape will not close the modal (e.g. during loading). Default true. */
	closeOnOverlayClick?: boolean;
}

export default function Modal({
	open,
	onClose,
	title,
	children,
	footer,
	ariaLabel,
	contentClassName,
	closeOnOverlayClick = true,
}: ModalProps) {
	const overlayRef = useRef<HTMLDivElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (closeOnOverlayClick && e.key === "Escape") {
				e.preventDefault();
				onClose();
			}
		},
		[onClose, closeOnOverlayClick]
	);

	const handleOverlayClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (closeOnOverlayClick && e.target === overlayRef.current) {
				onClose();
			}
		},
		[onClose, closeOnOverlayClick]
	);

	useEffect(() => {
		if (!open) return;
		previousActiveElement.current =
			document.activeElement as HTMLElement | null;
		const focusable = overlayRef.current?.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		const first = focusable?.[0] as HTMLElement | undefined;
		first?.focus();
		return () => {
			previousActiveElement.current?.focus();
		};
	}, [open]);

	if (!open) return null;

	return (
		<div
			ref={overlayRef}
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur"
			onClick={handleOverlayClick}
			onKeyDown={handleKeyDown}
			role="dialog"
			aria-modal="true"
			aria-label={ariaLabel ?? title}
		>
			<div
				className={cn(
					"transIn w-full max-w-3xl rounded-xl border border-border-primary bg-bg-card shadow-xl flex flex-col max-h-[90vh] overflow-hidden transition-all duration-300",
					contentClassName
				)}
				onClick={(e) => e.stopPropagation()}
			>
				{title && (
					<h2 className="dark:bg-bg-card bg-[#F7F7F7]  shrink-0 px-6 py-4 text-xl font-bold text-text-primary text-center">
						{title}
					</h2>
				)}
				<div className="flex-1  overflow-y-auto px-6 py-4 text-text-primary rounded-t-3xl border border-border-primary">
					{children}
				</div>
				{footer && (
					<div className="shrink-0 flex items-center justify-end gap-3 px-6 py-4 bg-bg-elevated">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
}
