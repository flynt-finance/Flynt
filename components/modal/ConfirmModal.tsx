"use client";

import Modal from "./Modal";
import Button from "@/components/ui/Button";

interface ConfirmModalProps {
	open: boolean;
	onClose: () => void;
	title: string;
	subtitle: string;
	confirmLabel: string;
	cancelLabel?: string;
	onConfirm: () => void;
	/** "danger" for destructive actions (e.g. unlink). Default "default". */
	variant?: "default" | "danger";
}

export default function ConfirmModal({
	open,
	onClose,
	title,
	subtitle,
	confirmLabel,
	cancelLabel = "Cancel",
	onConfirm,
	variant = "default",
}: ConfirmModalProps) {
	const handleConfirm = () => {
		onConfirm();
		// Caller is responsible for closing when appropriate (e.g. after async success)
	};

	const confirmButtonClass =
		variant === "danger"
			? "bg-error hover:bg-error/90 text-white focus:ring-error/20"
			: "";

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={title}
			footer={
				<>
					<Button
						type="button"
						variant="secondary"
						onClick={onClose}
						aria-label={cancelLabel}
					>
						{cancelLabel}
					</Button>
					<Button
						type="button"
						variant="primary"
						onClick={handleConfirm}
						aria-label={confirmLabel}
						className={confirmButtonClass}
					>
						{confirmLabel}
					</Button>
				</>
			}
		>
			<p className="text-sm text-text-secondary">{subtitle}</p>
		</Modal>
	);
}
