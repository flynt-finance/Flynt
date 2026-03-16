"use client";

import Modal from "@/components/modal/Modal";
import { Button } from "@/components/ui";

interface LinkedAccount {
	id: string;
	name: string;
	icon: string;
	lastFour: string;
	balance: number;
}

interface UnlinkAccountModalProps {
	isOpen: boolean;
	onClose: () => void;
	account: LinkedAccount | null;
	/** Called when user clicks "Unlink Account"; parent should close this modal and open the confirmation modal. */
	onUnlinkClick: () => void;
}

export default function UnlinkAccountModal({
	isOpen,
	onClose,
	account,
	onUnlinkClick,
}: UnlinkAccountModalProps) {
	if (!account) return null;

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			title="Account Details"
			ariaLabel="Account details"
			footer={
				<Button
					type="button"
					variant="primary"
					fullWidth
					onClick={onUnlinkClick}
					className="py-4 bg-error hover:bg-error/90 text-white rounded-xl font-black uppercase tracking-wider shadow-lg shadow-error/20 focus:ring-error/20"
					aria-label="Unlink this account"
				>
					Unlink Account
				</Button>
			}
		>
			<div className="space-y-6">
				<div className="p-6 rounded-xl bg-bg-elevated border border-border-primary flex flex-col items-center text-center">
					<div className="h-20 w-20 rounded-full bg-green-primary/10 flex items-center justify-center border border-green-primary/20 mb-4">
						<div className="p-4 bg-green-primary rounded-xl text-white shadow-lg shadow-green-primary/20">
							<svg
								className="w-8 h-8"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden
							>
								<path d="M12 3L4 9v12h16V9l-8-6zm0 2.5L17.5 9.5 12 13.6 6.5 9.5 12 5.5zM6 19v-8.4l6 4.5 6-4.5V19H6z" />
							</svg>
						</div>
					</div>
					<h3 className="text-2xl font-black text-text-primary">
						{account.name}
					</h3>
					<p className="text-text-secondary font-medium tracking-widest mt-1">
						**** **** **** {account.lastFour}
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="p-4 rounded-xl bg-bg-elevated border border-border-primary">
						<p className="text-[10px] font-black text-text-secondary uppercase tracking-wider mb-1">
							Available Balance
						</p>
						<p className="text-lg font-black text-text-primary">
							₦{account.balance.toLocaleString()}
						</p>
					</div>
					<div className="p-4 rounded-xl bg-bg-elevated border border-border-primary">
						<p className="text-[10px] font-black text-text-secondary uppercase tracking-wider mb-1">
							Status
						</p>
						<div className="flex items-center gap-2">
							<div
								className="h-2 w-2 rounded-full bg-green-primary shadow-[0_0_8px_rgba(0,217,163,0.5)]"
								aria-hidden
							/>
							<p className="text-sm font-black text-green-primary uppercase tracking-tight">
								Active
							</p>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
}
