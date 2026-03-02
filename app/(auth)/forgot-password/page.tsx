"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
	forgotPasswordSchema,
	resetPasswordSchema,
	type ForgotPasswordFormValues,
	type ResetPasswordFormValues,
} from "@/lib/validations/auth";
import {
	forgotPasswordRequest,
	verifyOtpRequest,
	resetPasswordRequest,
} from "@/lib/api/requests";
import { clearAllAuthStorage } from "@/lib/auth-cookie";
import { useAuthStore } from "@/stores/use-auth-store";

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN_SECONDS = 60;
const FORGOT_OTP_COUNTDOWN_KEY = "flynt_forgot_otp_countdown";

type Step = "email" | "otp" | "reset";

interface OtpCountdownSession {
	endTime: number;
	durationSeconds: number;
}

const MailIcon = () => (
	<svg
		className="h-4 w-4"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		aria-hidden
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
		/>
	</svg>
);

const LockIcon = () => (
	<svg
		className="h-4 w-4"
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

const EyeIcon = () => (
	<svg
		className="h-4 w-4"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		aria-hidden
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
		/>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
		/>
	</svg>
);

const EyeOffIcon = () => (
	<svg
		className="h-4 w-4"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		aria-hidden
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
		/>
	</svg>
);

interface VerifyOtpSectionProps {
	email: string;
	onVerifySuccess: (otp: string) => void;
}

function VerifyOtpSection({ email, onVerifySuccess }: VerifyOtpSectionProps) {
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
				FORGOT_OTP_COUNTDOWN_KEY,
				JSON.stringify({ endTime, durationSeconds })
			);
		},
		[]
	);

	const clearCountdownSession = useCallback(() => {
		if (typeof sessionStorage === "undefined") return;
		sessionStorage.removeItem(FORGOT_OTP_COUNTDOWN_KEY);
	}, []);

	useEffect(() => {
		if (typeof sessionStorage === "undefined") return;
		const raw = sessionStorage.getItem(FORGOT_OTP_COUNTDOWN_KEY);
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
				onVerifySuccess(otpString);
			}
		} finally {
			setIsVerifying(false);
		}
	}, [canVerify, email, otpString, onVerifySuccess]);

	const handleResend = useCallback(async () => {
		if (countdown > 0 || !email.trim() || isResending) return;
		setIsResending(true);
		try {
			await forgotPasswordRequest({ email: email.trim() });
			const raw =
				typeof sessionStorage !== "undefined"
					? sessionStorage.getItem(FORGOT_OTP_COUNTDOWN_KEY)
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
			const newDuration = Math.min(2 * lastDuration, 120);
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
			<h1 className="text-xl font-bold text-text-primary">Verify code</h1>
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
						tabIndex={0}
					>
						{isResending ? "Sending…" : "Resend code"}
					</button>
				)}
			</div>
		</div>
	);
}

interface ResetPasswordSectionProps {
	email: string;
	otp: string;
}

function ResetPasswordSection({ email, otp }: ResetPasswordSectionProps) {
	const router = useRouter();
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<
		Partial<Record<keyof ResetPasswordFormValues, string>>
	>({});
	const [isLoading, setIsLoading] = useState(false);

	const handleTogglePassword = useCallback(() => {
		setShowPassword((prev) => !prev);
	}, []);

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setErrors({});
			const values: ResetPasswordFormValues = {
				email,
				otp,
				newPassword,
				confirmPassword,
			};
			try {
				await resetPasswordSchema.validate(values, { abortEarly: false });
			} catch (err) {
				const yupErr = err as {
					inner?: Array<{ path?: string; message?: string }>;
				};
				const next: Partial<Record<keyof ResetPasswordFormValues, string>> = {};
				if (yupErr.inner) {
					for (const item of yupErr.inner) {
						if (item.path)
							next[item.path as keyof ResetPasswordFormValues] = item.message;
					}
				}
				setErrors(next);
				return;
			}
			setIsLoading(true);
			try {
				const response = await resetPasswordRequest({
					email,
					otp,
					newPassword,
				});
				if (response.success) {
					clearAllAuthStorage();
					useAuthStore.getState().setData({ user: null });
					toast.success("Password reset successfully", {
						description: "You can now sign in with your new password.",
					});
					router.push("/login");
				}
			} finally {
				setIsLoading(false);
			}
		},
		[email, otp, newPassword, confirmPassword, router]
	);

	return (
		<div className="flex flex-col">
			<h1 className="text-xl font-bold text-text-primary">Reset password</h1>
			<p className="mt-2 text-sm text-text-secondary">
				Enter your new password below.
			</p>

			<form onSubmit={handleSubmit} className="mt-6 space-y-4">
				<Input
					label="New password*"
					type={showPassword ? "text" : "password"}
					placeholder="••••••••"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					icon={<LockIcon />}
					iconPosition="left"
					error={errors.newPassword}
					rightElement={
						<button
							type="button"
							onClick={handleTogglePassword}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									handleTogglePassword();
								}
							}}
							className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-green-primary/20"
							aria-label={showPassword ? "Hide password" : "Show password"}
							tabIndex={0}
						>
							{showPassword ? <EyeOffIcon /> : <EyeIcon />}
						</button>
					}
					required
					autoComplete="new-password"
					aria-required="true"
				/>
				<Input
					label="Confirm password*"
					type={showPassword ? "text" : "password"}
					placeholder="••••••••"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					icon={<LockIcon />}
					iconPosition="left"
					error={errors.confirmPassword}
					required
					autoComplete="new-password"
					aria-required="true"
				/>

				<Button
					type="submit"
					variant="primary"
					fullWidth
					size="lg"
					className="mt-2 cursor-pointer"
					disabled={isLoading}
					aria-busy={isLoading}
				>
					{isLoading ? "Resetting…" : "Reset password"}
				</Button>
			</form>
		</div>
	);
}

export default function ForgotPasswordPage() {
	const [step, setStep] = useState<Step>("email");
	const [email, setEmail] = useState("");
	const [verifiedOtp, setVerifiedOtp] = useState("");
	const [emailError, setEmailError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleEmailSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setEmailError("");
			const values: ForgotPasswordFormValues = { email };
			try {
				await forgotPasswordSchema.validate(values, { abortEarly: false });
			} catch (err) {
				const yupErr = err as {
					inner?: Array<{ path?: string; message?: string }>;
				};
				if (yupErr.inner?.[0]) {
					setEmailError(yupErr.inner[0].message ?? "Invalid email");
				}
				return;
			}
			setIsLoading(true);
			try {
				const response = await forgotPasswordRequest({ email: email.trim() });
				if (response.success) {
					toast.success("Password reset OTP sent to your email", {
						description: "Check your inbox for the verification code.",
					});
					setStep("otp");
				}
			} finally {
				setIsLoading(false);
			}
		},
		[email]
	);

	const handleVerifyOtpSuccess = useCallback((otp: string) => {
		setVerifiedOtp(otp);
		setStep("reset");
	}, []);

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="mb-6 flex flex-col items-center text-center">
				<h1 className="text-xl font-medium text-text-primary">
					Forgot password
				</h1>
				<p className="mt-1 text-sm text-text-secondary">
					We&apos;ll send a verification code to your email
				</p>
			</div>

			{step === "email" && (
				<Card
					variant="elevated"
					padding="lg"
					className="border border-border-primary"
				>
					<form onSubmit={handleEmailSubmit} className="space-y-4">
						<Input
							label="Email address*"
							type="email"
							placeholder="name@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							icon={<MailIcon />}
							iconPosition="left"
							error={emailError}
							required
							autoComplete="email"
							aria-required="true"
							aria-label="Email address"
						/>
						<Button
							type="submit"
							variant="primary"
							fullWidth
							size="lg"
							className="mt-2 cursor-pointer"
							disabled={isLoading}
							aria-busy={isLoading}
						>
							{isLoading ? "Sending…" : "Send reset code"}
						</Button>
					</form>
				</Card>
			)}

			{step === "otp" && (
				<Card
					variant="elevated"
					padding="lg"
					className="border border-border-primary"
				>
					<VerifyOtpSection
						email={email}
						onVerifySuccess={handleVerifyOtpSuccess}
					/>
				</Card>
			)}

			{step === "reset" && (
				<Card
					variant="elevated"
					padding="lg"
					className="border border-border-primary"
				>
					<ResetPasswordSection email={email} otp={verifiedOtp} />
				</Card>
			)}

			<p className="mt-6 text-center text-sm text-text-secondary">
				Remember your password?{" "}
				<Link
					href="/login"
					className="font-medium text-green-primary hover:text-green-hover underline focus:outline-none focus:ring-2 focus:ring-green-primary/20 focus:ring-offset-2 rounded"
				>
					Sign in
				</Link>
			</p>
		</div>
	);
}
