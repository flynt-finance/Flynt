"use client";

import Modal from "@/components/modal/Modal";
import Button from "@/components/ui/Button";

const CONFETTI_GIF_URL =
	"https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif";

interface WaitlistSuccessModalProps {
	open: boolean;
	onClose: () => void;
	onContinue: () => void;
}

export default function WaitlistSuccessModal({
	open,
	onClose,
	onContinue,
}: WaitlistSuccessModalProps) {
	const handleContinue = () => {
		onClose();
		onContinue();
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title="Demo request received!"
			ariaLabel="Demo request success"
			contentClassName="max-w-[400px]"
			footer={
				<Button
					type="button"
					variant="primary"
					size="lg"
					onClick={handleContinue}
					aria-label="Continue to home page"
				>
					Continue
				</Button>
			}
		>
			<div className="flex flex-col items-center text-center space-y-4">
				<img
					src={CONFETTI_GIF_URL}
					alt=""
					className="w-full max-w-[240px] h-auto rounded-lg object-cover"
					aria-hidden
				/>
				<p className="text-text-primary text-base">
					Thanks for your interest. Our team will reach out shortly to schedule
					your demo.
				</p>
			</div>
		</Modal>
	);
}
