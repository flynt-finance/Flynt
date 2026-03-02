"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getRegisterData, clearAllAuthStorage } from "@/lib/auth-cookie";
import { verifyOtpRequest, sendOtpRequest } from "@/lib/api/requests";
import { useAuthStore } from "@/stores/use-auth-store";

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN_SECONDS = 60;
const OTP_COUNTDOWN_KEY = "flynt_otp_countdown";

interface OtpCountdownSession {
	endTime: number;
	durationSeconds: number;
}

const MailIcon = () => (
	<svg
		className="h-10 w-10"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		aria-hidden
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.5}
			d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
		/>
	</svg>
);

function VerifyForm({
	email,
	onVerifySuccess,
}: {
	email: string;
	onVerifySuccess: () => void;
}) {
	const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
	const [countdown, setCountdown] = useState(0);
	const [isVerifying, setIsVerifying] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const endTimeRef = useRef<number>(0);

	const otpString = otp.join("");
	const canVerify = otpString.length === OTP_LENGTH && !isVerifying;

	const persistCountdown = useCallback(
		(endTime: number, durationSeconds: number) => {
			if (typeof sessionStorage === "undefined") return;
			sessionStorage.setItem(
				OTP_COUNTDOWN_KEY,
				JSON.stringify({ endTime, durationSeconds })
			);
		},
		[]
	);

	const clearCountdownSession = useCallback(() => {
		if (typeof sessionStorage === "undefined") return;
		sessionStorage.removeItem(OTP_COUNTDOWN_KEY);
	}, []);

	useEffect(() => {
		if (typeof sessionStorage === "undefined") return;
		const raw = sessionStorage.getItem(OTP_COUNTDOWN_KEY);
		const now = Date.now();
		if (raw) {
			try {
				const parsed = JSON.parse(raw) as OtpCountdownSession;
				if (parsed?.endTime > now) {
					const remaining = Math.ceil((parsed.endTime - now) / 1000);
					setCountdown(remaining);
					endTimeRef.current = parsed.endTime;
					return;
				}
			} catch {
				// invalid, start fresh
			}
		}
		const endTime = now + RESEND_COUNTDOWN_SECONDS * 1000;
		endTimeRef.current = endTime;
		setCountdown(RESEND_COUNTDOWN_SECONDS);
		persistCountdown(endTime, RESEND_COUNTDOWN_SECONDS);
	}, [persistCountdown]);

	useEffect(() => {
		if (countdown <= 0) return;
		const timer = setInterval(() => {
			const now = Date.now();
			const remaining = Math.ceil((endTimeRef.current - now) / 1000);
			if (remaining <= 0) {
				setCountdown(0);
				clearCountdownSession();
			} else {
				setCountdown(remaining);
			}
		}, 1000);
		return () => clearInterval(timer);
	}, [countdown, clearCountdownSession]);

	const handleOtpChange = useCallback((index: number, value: string) => {
		if (value.length > 1) {
			const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
			setOtp((prev) => {
				const next = [...prev];
				digits.forEach((d, i) => {
					if (index + i < OTP_LENGTH) next[index + i] = d;
				});
				return next;
			});
			const nextFocus = Math.min(index + digits.length, OTP_LENGTH - 1);
			inputRefs.current[nextFocus]?.focus();
			return;
		}
		const digit = value.replace(/\D/g, "").slice(-1);
		setOtp((prev) => {
			const next = [...prev];
			next[index] = digit;
			return next;
		});
		if (digit && index < OTP_LENGTH - 1) {
			inputRefs.current[index + 1]?.focus();
		}
	}, []);

	const handleKeyDown = useCallback(
		(index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Backspace" && !otp[index] && index > 0) {
				inputRefs.current[index - 1]?.focus();
				setOtp((prev) => {
					const next = [...prev];
					next[index - 1] = "";
					return next;
				});
			}
		},
		[otp]
	);

	const handlePaste = useCallback((e: React.ClipboardEvent) => {
		e.preventDefault();
		const pasted = e.clipboardData
			.getData("text")
			.replace(/\D/g, "")
			.slice(0, OTP_LENGTH);
		if (!pasted) return;
		const digits = pasted.split("");
		setOtp((prev) => {
			const next = [...prev];
			digits.forEach((d, i) => {
				next[i] = d;
			});
			return next;
		});
		const nextFocus = Math.min(digits.length, OTP_LENGTH - 1);
		inputRefs.current[nextFocus]?.focus();
	}, []);

	const handleVerify = useCallback(async () => {
		if (!canVerify || !email.trim()) return;
		setIsVerifying(true);
		try {
			const response = await verifyOtpRequest({
				email: email.trim(),
				otp: otpString,
			});
			if (response.success) {
				onVerifySuccess();
			}
		} finally {
			setIsVerifying(false);
		}
	}, [canVerify, email, otpString, onVerifySuccess]);

	const handleResend = useCallback(async () => {
		if (countdown > 0 || !email.trim() || isResending) return;
		setIsResending(true);
		try {
			await sendOtpRequest({ email: email.trim() });
			const raw =
				typeof sessionStorage !== "undefined"
					? sessionStorage.getItem(OTP_COUNTDOWN_KEY)
					: null;
			let lastDuration = RESEND_COUNTDOWN_SECONDS;
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as OtpCountdownSession;
					if (parsed?.durationSeconds) lastDuration = parsed.durationSeconds;
				} catch {
					// ignore
				}
			}
			const newDuration = 2 * lastDuration;
			const now = Date.now();
			const endTime = now + newDuration * 1000;
			endTimeRef.current = endTime;
			setCountdown(newDuration);
			persistCountdown(endTime, newDuration);
			toast.success("Verification code sent", {
				description: "Check your email.",
			});
		} finally {
			setIsResending(false);
		}
	}, [countdown, email, isResending, persistCountdown]);

	const displayEmail = email || "your email";

	return (
		<div className="flex flex-col items-center">
			<div
				className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-primary/15 text-green-primary"
				aria-hidden
			>
				<MailIcon />
			</div>
			<h1 className="text-xl font-bold text-text-primary">Verify your email</h1>
			<p className="mt-2 text-sm text-text-secondary text-center">
				We&apos;ve sent a 6-digit code to{" "}
				<strong className="text-text-primary">{displayEmail}</strong>
			</p>

			<div
				className="mt-6 flex gap-2"
				role="group"
				aria-label="One-time password verification code"
			>
				{otp.map((digit, index) => (
					<input
						key={index}
						ref={(el) => {
							inputRefs.current[index] = el;
						}}
						type="text"
						inputMode="numeric"
						maxLength={6}
						value={digit}
						onChange={(e) => handleOtpChange(index, e.target.value)}
						onKeyDown={(e) => handleKeyDown(index, e)}
						onPaste={handlePaste}
						disabled={isVerifying}
						className="h-12 w-12 rounded-lg border border-border-primary bg-bg-card text-center text-2xl font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20 focus:border-green-primary disabled:opacity-60"
						aria-label={`Digit ${index + 1}`}
					/>
				))}
			</div>

			<Button
				type="button"
				variant="primary"
				fullWidth
				size="lg"
				className="mt-6 cursor-pointer"
				onClick={handleVerify}
				disabled={!canVerify}
				aria-label="Verify code"
				aria-busy={isVerifying}
			>
				{isVerifying ? "Verifying…" : "Verify"}
			</Button>

			<div className="mt-6 text-center">
				<p className="text-sm text-text-secondary">
					Didn&apos;t receive the code?
				</p>
				{countdown > 0 ? (
					<p className="mt-1 text-sm font-semibold text-text-primary">
						{countdown} seconds
					</p>
				) : (
					<button
						type="button"
						onClick={handleResend}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								handleResend();
							}
						}}
						disabled={isResending}
						className="mt-1 text-sm font-semibold text-green-primary hover:text-green-hover focus:outline-none focus:ring-2 focus:ring-green-primary/20 focus:ring-offset-2 rounded cursor-pointer disabled:opacity-60"
						aria-label="Resend code"
					>
						{isResending ? "Sending…" : "Resend code"}
					</button>
				)}
			</div>
		</div>
	);
}

function VerifyEmailContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const registerData = getRegisterData();
	const email = registerData?.email ?? searchParams.get("email") ?? "";

	const handleVerifySuccess = useCallback(() => {
		clearAllAuthStorage();
		useAuthStore.getState().setData({ user: null });
		toast.success("Email verified. Please sign in.");
		router.push("/login");
	}, [router]);

	return (
		<div className="w-full max-w-md mx-auto">
			<Card
				variant="elevated"
				padding="lg"
				className="border border-border-primary"
			>
				<VerifyForm email={email} onVerifySuccess={handleVerifySuccess} />
			</Card>
			<div className="flex flex-col items-center justify-center">
				<p className="mt-4 text-center text-xs text-text-muted">
					Check your spam folder or try resending the code
				</p>
				<Link
					href="#"
					className="mt-2 inline-block text-xs font-medium text-text-primary dark:text-green-primary hover:underline focus:outline-none focus:ring-2 focus:ring-green-primary/20 focus:ring-offset-2 rounded"
				>
					Can&apos;t find the email?
				</Link>
			</div>
		</div>
	);
}

export default function VerifyEmailPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<VerifyEmailContent />
		</Suspense>
	);
}
