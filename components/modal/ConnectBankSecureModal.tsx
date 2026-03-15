"use client";

import { ShieldCheck } from "@phosphor-icons/react";
import Modal from "./Modal";
import Button from "@/components/ui/Button";
import Image from "next/image";

const LockIcon = () => (
	<svg
		className="h-6 w-6 shrink-0"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		aria-hidden
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
		/>
	</svg>
);

const CheckIcon = () => (
	<svg
		className="h-5 w-5 shrink-0"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		aria-hidden
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M5 13l4 4L19 7"
		/>
	</svg>
);

const XIcon = () => (
	<svg
		className="h-5 w-5 shrink-0"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		aria-hidden
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M6 18L18 6M6 6l12 12"
		/>
	</svg>
);

interface ConnectBankSecureModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	/** Primary button label. Default "I Understand, Continue". */
	primaryButtonText?: string;
}

export default function ConnectBankSecureModal({
	open,
	onClose,
	onConfirm,
	primaryButtonText = "I Understand, Continue",
}: ConnectBankSecureModalProps) {
	const handleConfirm = () => {
		onConfirm();
		onClose();
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title="Connect your bank securely"
			footer={
				<>
					<Button
						type="button"
						variant="secondary"
						onClick={onClose}
						aria-label="Cancel"
					>
						Cancel
					</Button>
					<Button
						type="button"
						variant="primary"
						onClick={handleConfirm}
						aria-label={primaryButtonText}
					>
						{primaryButtonText}
					</Button>
				</>
			}
		>
			<div className="grid gap-6 sm:grid-cols-2">
				<div className="space-y-4 border-r border-border-primary">
					<p className="text-sm text-text-secondary w-3/4">
						We need read-only access to analyze your transactions and provide
						personalized advice.
					</p>
					<ul className="space-y-5 text-sm text-text-primary">
						<li className="flex items-center gap-2">
							<span className="text-purple" aria-hidden>
								<LockIcon />
							</span>
							256-bit Encryption
						</li>
						<li className="flex items-center gap-2 border-y border-border-primary border-x-0 py-5">
							<span className="text-green-primary" aria-hidden>
								<ShieldCheck size={25} weight="duotone" />
							</span>
							SSL Secured
						</li>
						<li className="flex items-center gap-2">
							<Image src="/mono.svg" alt="Mono" width={25} height={25} />
							<span className="text-text-primary font-medium">
								Powered by Mono
							</span>
						</li>
					</ul>
				</div>
				<div className="space-y-4">
					<p className="text-sm font-medium text-text-primary">
						Permissions Granted
					</p>
					<ul className="space-y-2 text-sm text-text-secondary">
						{[
							"Read your transaction history",
							"Analyze spending patterns",
							"Categorize expenses",
							"Generate insights",
						].map((item) => (
							<li key={item} className="flex items-center gap-2">
								<span className="text-green-primary" aria-hidden>
									<CheckIcon />
								</span>
								{item}
							</li>
						))}
					</ul>
					<p className="text-sm font-medium text-text-primary pt-2">
						Permissions Denied
					</p>
					<ul className="space-y-2 text-sm text-text-secondary">
						{["Move or transfer money", "Make payments"].map((item) => (
							<li key={item} className="flex items-center gap-2">
								<span className="text-error" aria-hidden>
									<XIcon />
								</span>
								{item}
							</li>
						))}
					</ul>
				</div>
			</div>
		</Modal>
	);
}
