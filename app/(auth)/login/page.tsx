"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/modal/Modal";
import { loginSchema } from "@/lib/validations/auth";
import { loginRequest, twoFaVerifyLoginRequest } from "@/lib/api/requests";
import { setToken } from "@/lib/auth-cookie";
import { useAuthStore } from "@/stores/use-auth-store";
import { showErrorToast } from "@/lib/api/client";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import type {
	LoginResponseData,
	LoginResponseData2FaRequired,
} from "@/lib/api/types";

const OTP_LENGTH = 6;

function isLogin2FaRequired(
	data: LoginResponseData
): data is LoginResponseData2FaRequired {
	return "requiresTwoFactor" in data && data.requiresTwoFactor === true;
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

const AppleIcon = () => (
	<svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
		<path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
	</svg>
);

interface FormErrors {
	email?: string;
	password?: string;
}

export default function LoginPage() {
	const router = useRouter();
	const setData = useAuthStore((s) => s.setData);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});
	const [isLoading, setIsLoading] = useState(false);
	const [twoFaModalOpen, setTwoFaModalOpen] = useState(false);
	const [preAuthToken, setPreAuthToken] = useState<string | null>(null);
	const [twoFaOtp, setTwoFaOtp] = useState<string[]>(
		Array(OTP_LENGTH).fill("")
	);
	const [isVerifying, setIsVerifying] = useState(false);
	const twoFaInputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const handleTogglePassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleTwoFaOtpChange = useCallback((index: number, value: string) => {
		if (value.length > 1) {
			const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
			setTwoFaOtp((prev) => {
				const next = [...prev];
				digits.forEach((d, i) => {
					if (index + i < OTP_LENGTH) next[index + i] = d;
				});
				return next;
			});
			const nextFocus = Math.min(index + digits.length, OTP_LENGTH - 1);
			twoFaInputRefs.current[nextFocus]?.focus();
			return;
		}
		const digit = value.replace(/\D/g, "").slice(-1);
		setTwoFaOtp((prev) => {
			const next = [...prev];
			next[index] = digit;
			return next;
		});
		if (digit && index < OTP_LENGTH - 1) {
			twoFaInputRefs.current[index + 1]?.focus();
		}
	}, []);

	const handleTwoFaKeyDown = useCallback(
		(index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Backspace" && !twoFaOtp[index] && index > 0) {
				twoFaInputRefs.current[index - 1]?.focus();
				setTwoFaOtp((prev) => {
					const next = [...prev];
					next[index - 1] = "";
					return next;
				});
			}
		},
		[twoFaOtp]
	);

	const handleTwoFaPaste = useCallback((e: React.ClipboardEvent) => {
		e.preventDefault();
		const pasted = e.clipboardData
			.getData("text")
			.replace(/\D/g, "")
			.slice(0, OTP_LENGTH);
		if (!pasted) return;
		const digits = pasted.split("");
		setTwoFaOtp((prev) => {
			const next = [...prev];
			digits.forEach((d, i) => {
				next[i] = d;
			});
			return next;
		});
		const nextFocus = Math.min(digits.length, OTP_LENGTH - 1);
		twoFaInputRefs.current[nextFocus]?.focus();
	}, []);

	const handleVerify2Fa = useCallback(async () => {
		if (!preAuthToken) return;
		const code = twoFaOtp.join("");
		if (code.length !== OTP_LENGTH) return;
		setIsVerifying(true);
		try {
			const response = await twoFaVerifyLoginRequest({ preAuthToken, code });
			if (response.success && response.data) {
				setToken(response.data.token);
				setData({ user: response.data.user });
				toast.success("Two-factor authentication successful", {
					description: "You have been signed in.",
				});
				setTwoFaModalOpen(false);
				setPreAuthToken(null);
				setTwoFaOtp(Array(OTP_LENGTH).fill(""));
				router.push("/dashboard");
			}
		} catch {
			// Error toast handled by client
		} finally {
			setIsVerifying(false);
		}
	}, [preAuthToken, twoFaOtp, setData, router]);

	const handleTwoFaModalClose = useCallback(() => {
		if (isVerifying) return;
		setTwoFaModalOpen(false);
		setPreAuthToken(null);
		setTwoFaOtp(Array(OTP_LENGTH).fill(""));
	}, [isVerifying]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		try {
			await loginSchema.validate({ email, password }, { abortEarly: false });
		} catch (err) {
			const yupErr = err as {
				inner?: Array<{ path?: string; message?: string }>;
			};
			const next: FormErrors = {};
			if (yupErr.inner) {
				for (const item of yupErr.inner) {
					if (item.path) next[item.path as keyof FormErrors] = item.message;
				}
			}
			setErrors(next);
			return;
		}
		setIsLoading(true);
		try {
			const response = await loginRequest({ email, password });
			if (response.success && response.data) {
				if (isLogin2FaRequired(response.data)) {
					setPreAuthToken(response.data.preAuthToken);
					setTwoFaModalOpen(true);
				} else {
					setToken(response.data.token);
					setData({ user: response.data.user });
					router.push("/dashboard");
				}
			} else {
				showErrorToast(response, {
					title: "Login failed",
					message: "Please try again.",
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="mb-6 flex flex-col items-center text-center">
				<h1 className="text-xl font-medium text-text-primary">
					Welcome back to FLYNT
				</h1>
				<p className="mt-1 text-sm text-text-secondary">
					Continue your journey to financial freedom today
				</p>
			</div>

			<div className="grid grid-cols-2 gap-3 mb-6">
				<button
					type="button"
					className="flex items-center justify-center gap-2 rounded-xl border border-border-primary bg-bg-card py-2.5 px-4 text-sm font-medium text-text-primary transition-colors hover:bg-bg-elevated focus:outline-none focus:ring-2 focus:ring-green-primary/20 focus:ring-offset-2"
					aria-label="Sign in with Apple"
				>
					<AppleIcon />
					<span>Sign in with Apple</span>
				</button>
				<GoogleSignInButton label="Sign in with Google" />
			</div>

			<div className="relative mb-6 flex items-center">
				<div className="grow border-t border-border-primary" aria-hidden />
				<span className="px-3 text-xs font-medium text-text-muted">OR</span>
				<div className="grow border-t border-border-primary" aria-hidden />
			</div>

			<Card>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						label="Email Address*"
						type="email"
						placeholder="name@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						icon={<MailIcon />}
						iconPosition="left"
						error={errors.email}
						required
						autoComplete="email"
						aria-required="true"
					/>
					<Input
						label="Password*"
						type={showPassword ? "text" : "password"}
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						icon={<LockIcon />}
						iconPosition="left"
						error={errors.password}
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
						autoComplete="current-password"
						aria-required="true"
					/>
					<div className="flex justify-end">
						<Link
							href="/forgot-password"
							className="text-xs font-medium text-green-primary hover:text-green-hover underline focus:outline-none focus:ring-2 focus:ring-green-primary/20 focus:ring-offset-2 rounded"
							aria-label="Forgot password?"
						>
							Forgot password?
						</Link>
					</div>

					<Button
						type="submit"
						variant="primary"
						fullWidth
						size="lg"
						className="mt-2"
						disabled={isLoading}
						aria-busy={isLoading}
					>
						{isLoading ? "Signing in…" : "Sign in"}
					</Button>
				</form>
			</Card>

			<p className="mt-6 text-center text-sm text-text-secondary">
				Don&apos;t have an account?{" "}
				<Link
					href="/register"
					className="font-medium text-green-primary hover:text-green-hover underline focus:outline-none focus:ring-2 focus:ring-green-primary/20 focus:ring-offset-2 rounded"
				>
					Sign up
				</Link>
			</p>

			<Modal
				open={twoFaModalOpen}
				onClose={handleTwoFaModalClose}
				title="Two-factor authentication"
				ariaLabel="Two-factor authentication"
				closeOnOverlayClick={!isVerifying}
				contentClassName="max-w-md!"
				footer={
					<Button
						type="button"
						onClick={handleVerify2Fa}
						disabled={twoFaOtp.join("").length !== OTP_LENGTH || isVerifying}
						aria-busy={isVerifying}
						className="cursor-pointer"
					>
						{isVerifying ? "Verifying…" : "Verify"}
					</Button>
				}
			>
				<p className="text-sm text-text-secondary mb-4">
					Enter the 6-digit code from your authenticator app.
				</p>
				<div
					className="flex gap-2 justify-center"
					role="group"
					aria-label="6-digit verification code"
				>
					{twoFaOtp.map((digit, index) => (
						<input
							key={index}
							ref={(el) => {
								twoFaInputRefs.current[index] = el;
							}}
							type="text"
							inputMode="numeric"
							maxLength={6}
							value={digit}
							onChange={(e) => handleTwoFaOtpChange(index, e.target.value)}
							onKeyDown={(e) => handleTwoFaKeyDown(index, e)}
							onPaste={handleTwoFaPaste}
							disabled={isVerifying}
							className="h-12 w-12 rounded-lg border border-border-primary bg-bg-card text-center text-lg font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20 focus:border-green-primary disabled:opacity-60"
							aria-label={`Digit ${index + 1}`}
						/>
					))}
				</div>
			</Modal>
		</div>
	);
}
