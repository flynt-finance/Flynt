"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { registerSchema, validatePhone } from "@/lib/validations/auth";
import { registerRequest } from "@/lib/api/requests";
import { setRegisterData } from "@/lib/auth-cookie";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import Image from "next/image";

const DIAL_CODE_TO_ISO: Record<string, string> = {
	"+234": "NG",
	"+254": "KE",
	"+1": "US",
	"+44": "GB",
	"+233": "GH",
};

const UserIcon = () => (
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
			d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
		/>
	</svg>
);

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

const ChevronDownIcon = () => (
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
			d="M19 9l-7 7-7-7"
		/>
	</svg>
);

const AppleIcon = () => (
	<svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
		<path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
	</svg>
);

const InfoIcon = () => (
	<svg
		className="h-4 w-4 shrink-0"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		aria-hidden
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
);

interface FormErrors {
	name?: string;
	email?: string;
	password?: string;
	phone?: string;
	countryCode?: string;
}

export default function RegisterPage() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [countryCode, setCountryCode] = useState("+234");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<FormErrors>({});
	const [isLoading, setIsLoading] = useState(false);

	const handleTogglePassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value.replace(/\D/g, "").slice(0, 15);
		setPhone(raw);
		const fullPhone = raw ? `${countryCode}${raw}` : "";
		const message = fullPhone ? validatePhone(fullPhone) : null;
		setErrors((prev) =>
			message !== null
				? { ...prev, phone: message }
				: { ...prev, phone: undefined }
		);
	};

	const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const next = e.target.value;
		setCountryCode(next);
		const fullPhone = phone ? `${next}${phone}` : "";
		const message = fullPhone ? validatePhone(fullPhone) : null;
		setErrors((prev) =>
			message !== null
				? { ...prev, phone: message }
				: { ...prev, phone: undefined }
		);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		const nationalDigits = phone.trim().replace(/\D/g, "");
		const payload = {
			name: fullName.trim(),
			email: email.trim(),
			password,
			phone: phone.trim() ? `${countryCode}${nationalDigits}` : "",
			countryCode: DIAL_CODE_TO_ISO[countryCode],
		};
		try {
			await registerSchema.validate(payload, { abortEarly: false });
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
			const response = await registerRequest({
				email: payload.email,
				password: payload.password,
				name: payload.name,
				phone: payload.phone,
				countryCode: payload.countryCode,
			});
			if (response.success && response.data) {
				setRegisterData(response.data);
				router.push("/verify-email");
			} else {
				toast.error(response.message ?? "Registration failed");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="flex flex-col items-center text-center mb-6">
				{/* <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-primary/15 text-green-primary"
          aria-hidden
        >
          <UserPlusIcon />
        </div> */}
				<h1 className="text-xl font-medium text-text-primary">
					Create a new account
				</h1>
				<p className="mt-1 text-sm text-text-secondary">
					Start your journey to financial freedom today
				</p>
			</div>

			<div className="grid grid-cols-2 gap-3 mb-6">
				<button
					type="button"
					className="flex items-center justify-center gap-2 rounded-xl border border-border-primary bg-bg-card py-2.5 px-4 text-sm font-medium text-text-primary transition-colors hover:bg-bg-elevated focus:outline-none focus:ring-2 focus:ring-green-primary/20 focus:ring-offset-2"
					aria-label="Sign up with Apple"
				>
					<AppleIcon />
					<span>Sign up with Apple</span>
				</button>
				<GoogleSignInButton label="Sign up with Google" />
			</div>

			<div className="relative mb-6 flex items-center">
				<div className="grow border-t border-border-primary" aria-hidden />
				<span className="px-3 text-xs font-medium text-text-muted">OR</span>
				<div className="grow border-t border-border-primary" aria-hidden />
			</div>
			<Card
				variant="elevated"
				padding="lg"
				className="border border-border-primary"
			>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						label="Full name*"
						type="text"
						placeholder="Adebayo Odunsi"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						icon={<UserIcon />}
						iconPosition="left"
						error={errors.name}
						required
						autoComplete="name"
						aria-required="true"
					/>
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
					<div className="w-full">
						<label className="block text-sm font-medium text-text-primary mb-2">
							Phone Number*
						</label>
						<div
							className={`flex rounded-xl border bg-bg-card overflow-hidden focus-within:ring-2 focus-within:ring-green-primary/20 focus-within:border-green-primary ${
								errors.phone ? "border-red-500" : "border-border-primary"
							}`}
						>
							<div className="relative flex items-center border-r border-border-primary bg-bg-elevated">
								<select
									className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed dark:text-black"
									value={countryCode}
									onChange={handleCountryCodeChange}
									aria-label="Select country code"
								>
									<option value="+234">NG (+234)</option>
									<option value="+1">US (+1)</option>
									<option value="+44">UK (+44)</option>
									<option value="+233">GH (+233)</option>
									<option value="+254">KE (+254)</option>
								</select>
								<div className="flex items-center gap-1.5 px-3 py-2.5 pointer-events-none">
									<span className="flex items-center justify-center shrink-0">
										{countryCode === "+234" && (
											<Image
												src="https://flagcdn.com/w40/ng.png"
												alt="Nigeria"
												width={20}
												height={20}
												className="w-5 h-5 rounded-full object-cover"
											/>
										)}
										{countryCode === "+1" && (
											<Image
												src="https://flagcdn.com/w40/us.png"
												alt="USA"
												width={20}
												height={20}
												className="w-5 h-5 rounded-full object-cover"
											/>
										)}
										{countryCode === "+44" && (
											<Image
												src="https://flagcdn.com/w40/gb.png"
												alt="UK"
												width={20}
												height={20}
												className="w-5 h-5 rounded-full object-cover"
											/>
										)}
										{countryCode === "+233" && (
											<Image
												src="https://flagcdn.com/w40/gh.png"
												alt="Ghana"
												width={20}
												height={20}
												className="w-5 h-5 rounded-full object-cover"
											/>
										)}
										{countryCode === "+254" && (
											<Image
												src="https://flagcdn.com/w40/ke.png"
												alt="Kenya"
												width={20}
												height={20}
												className="w-5 h-5 rounded-full object-cover"
											/>
										)}
									</span>
									<span className="text-sm font-medium text-text-primary">
										{countryCode}
									</span>
									<span className="text-text-muted">
										<ChevronDownIcon />
									</span>
								</div>
							</div>
							<input
								type="tel"
								inputMode="numeric"
								placeholder="8012345678"
								value={phone}
								onChange={handlePhoneChange}
								className="flex-1 min-w-0 bg-bg-card px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none border-0"
								required
								autoComplete="tel"
								aria-required="true"
								aria-invalid={Boolean(errors.phone)}
								aria-describedby={errors.phone ? "phone-error" : undefined}
							/>
						</div>
						{errors.phone ? (
							<p
								id="phone-error"
								className="mt-1.5 text-sm text-red-500"
								role="alert"
							>
								{errors.phone}
							</p>
						) : null}
					</div>
					<div>
						<Input
							label="Password*"
							type={showPassword ? "text" : "password"}
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							icon={<LockIcon />}
							iconPosition="left"
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
							error={errors.password}
							required
							autoComplete="new-password"
							aria-required="true"
						/>
						<p className="mt-1.5 flex items-center gap-1.5 text-xs text-text-muted">
							<InfoIcon />
							<span>8+ characters, 1 uppercase, 1 number</span>
						</p>
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
						{isLoading ? "Signing up…" : "Sign up"}
					</Button>
				</form>
			</Card>

			<p className="mt-6 text-center text-sm text-text-secondary">
				Already have an account?{" "}
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
