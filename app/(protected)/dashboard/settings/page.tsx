"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/modal/Modal";
import { changePasswordSchema } from "@/lib/validations/auth";
import type { ChangePasswordFormValues } from "@/lib/validations/auth";
import {
	changePasswordRequest,
	useTwoFaStatusQuery,
	useTwoFaDisableMutation,
	twoFaSetupRequest,
	twoFaConfirmRequest,
	TWO_FA_STATUS_QUERY_KEY,
} from "@/lib/api/requests";
import { clearToken } from "@/lib/auth-cookie";
import { useAuthStore } from "@/stores/use-auth-store";

const OTP_LENGTH = 6;

type SettingsTab = "security";

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

const ShieldIcon = () => (
	<svg
		className="h-5 w-5"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		aria-hidden
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
		/>
	</svg>
);

const tabs: {
	id: SettingsTab;
	label: string;
	icon: React.ReactNode;
	tabId: string;
}[] = [
	{
		id: "security",
		label: "Security",
		icon: <ShieldIcon />,
		tabId: "security-tab",
	},
];

type EnableTwoFaStep = "loading" | "qr" | "token";

export default function SettingsPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { setData } = useAuthStore();
	const [activeTab, setActiveTab] = useState<SettingsTab>("security");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [errors, setErrors] = useState<
		Partial<Record<keyof ChangePasswordFormValues, string>>
	>({});
	const [isLoading, setIsLoading] = useState(false);

	const { data: twoFaStatusData, isLoading: twoFaStatusLoading } =
		useTwoFaStatusQuery();
	const twoFaEnabled = twoFaStatusData?.data?.enabled ?? false;
	const disableMutation = useTwoFaDisableMutation();

	const [enableModalOpen, setEnableModalOpen] = useState(false);
	const [disableModalOpen, setDisableModalOpen] = useState(false);
	const [disablePassword, setDisablePassword] = useState("");
	const [enableStep, setEnableStep] = useState<EnableTwoFaStep>("loading");
	const [setupData, setSetupData] = useState<{
		qrCode: string;
		secret: string;
		backupCodes: string[];
	} | null>(null);
	const [selectedBackupCode, setSelectedBackupCode] = useState("");
	const [tokenOtp, setTokenOtp] = useState<string[]>(
		Array(OTP_LENGTH).fill("")
	);
	const [isConfirming, setIsConfirming] = useState(false);
	const tokenInputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const enableModalOpenedRef = useRef(false);

	const handleToggleCurrentPassword = useCallback(() => {
		setShowCurrentPassword((prev) => !prev);
	}, []);

	const handleToggleNewPassword = useCallback(() => {
		setShowNewPassword((prev) => !prev);
	}, []);

	useEffect(() => {
		if (!enableModalOpen || enableModalOpenedRef.current) return;
		enableModalOpenedRef.current = true;
		setEnableStep("loading");
		setSetupData(null);
		setSelectedBackupCode("");
		setTokenOtp(Array(OTP_LENGTH).fill(""));
		twoFaSetupRequest()
			.then((res) => {
				if (res.success && res.data) {
					setSetupData({
						qrCode: res.data.qrCode,
						secret: res.data.secret,
						backupCodes: res.data.backupCodes,
					});
					setEnableStep("qr");
				}
			})
			.catch(() => {});
	}, [enableModalOpen]);

	useEffect(() => {
		if (!enableModalOpen) enableModalOpenedRef.current = false;
	}, [enableModalOpen]);

	const handleTwoFaToggle = useCallback(() => {
		if (twoFaEnabled) {
			setDisableModalOpen(true);
		} else {
			setEnableModalOpen(true);
		}
	}, [twoFaEnabled]);

	const handleDisableModalClose = useCallback(() => {
		setDisableModalOpen(false);
		setDisablePassword("");
	}, []);

	const handleDisableSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!disablePassword.trim()) return;
			try {
				const result = await disableMutation.mutateAsync({
					password: disablePassword,
				});
				if ((result as { success?: boolean })?.success) {
					toast.success("2FA disabled", {
						description: "Two-factor authentication has been turned off.",
					});
					handleDisableModalClose();
				}
			} catch {
				// Error toast handled by client
			}
		},
		[disablePassword, disableMutation, handleDisableModalClose]
	);

	const handleTokenOtpChange = useCallback((index: number, value: string) => {
		if (value.length > 1) {
			const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
			setTokenOtp((prev) => {
				const next = [...prev];
				digits.forEach((d, i) => {
					if (index + i < OTP_LENGTH) next[index + i] = d;
				});
				return next;
			});
			const nextFocus = Math.min(index + digits.length, OTP_LENGTH - 1);
			tokenInputRefs.current[nextFocus]?.focus();
			return;
		}
		const digit = value.replace(/\D/g, "").slice(-1);
		setTokenOtp((prev) => {
			const next = [...prev];
			next[index] = digit;
			return next;
		});
		if (digit && index < OTP_LENGTH - 1) {
			tokenInputRefs.current[index + 1]?.focus();
		}
	}, []);

	const handleTokenKeyDown = useCallback(
		(index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Backspace" && !tokenOtp[index] && index > 0) {
				tokenInputRefs.current[index - 1]?.focus();
				setTokenOtp((prev) => {
					const next = [...prev];
					next[index - 1] = "";
					return next;
				});
			}
		},
		[tokenOtp]
	);

	const handleTokenPaste = useCallback((e: React.ClipboardEvent) => {
		e.preventDefault();
		const pasted = e.clipboardData
			.getData("text")
			.replace(/\D/g, "")
			.slice(0, OTP_LENGTH);
		if (!pasted) return;
		const digits = pasted.split("");
		setTokenOtp((prev) => {
			const next = [...prev];
			digits.forEach((d, i) => {
				next[i] = d;
			});
			return next;
		});
		const nextFocus = Math.min(digits.length, OTP_LENGTH - 1);
		tokenInputRefs.current[nextFocus]?.focus();
	}, []);

	const handleEnableModalClose = useCallback(() => {
		setEnableModalOpen(false);
		setEnableStep("loading");
		setSetupData(null);
		setSelectedBackupCode("");
		setTokenOtp(Array(OTP_LENGTH).fill(""));
	}, []);

	const handleConfirm2Fa = useCallback(async () => {
		if (!setupData || !selectedBackupCode) return;
		const tokenString = tokenOtp.join("");
		if (tokenString.length !== OTP_LENGTH) return;
		setIsConfirming(true);
		try {
			const res = await twoFaConfirmRequest({
				secret: setupData.secret,
				token: tokenString,
				backupCodes: selectedBackupCode,
			});
			if (res.success) {
				await queryClient.invalidateQueries({
					queryKey: [TWO_FA_STATUS_QUERY_KEY],
				});
				toast.success("2FA enabled", {
					description:
						"Two-factor authentication is now active on your account.",
				});
				handleEnableModalClose();
			}
		} catch {
			// Error toast handled by client
		} finally {
			setIsConfirming(false);
		}
	}, [
		setupData,
		selectedBackupCode,
		tokenOtp,
		queryClient,
		handleEnableModalClose,
	]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setErrors({});
			const values: ChangePasswordFormValues = {
				currentPassword,
				newPassword,
				confirmPassword,
			};
			try {
				await changePasswordSchema.validate(values, { abortEarly: false });
			} catch (err) {
				const yupErr = err as {
					inner?: Array<{ path?: string; message?: string }>;
				};
				const next: Partial<Record<keyof ChangePasswordFormValues, string>> =
					{};
				if (yupErr.inner) {
					for (const item of yupErr.inner) {
						if (item.path)
							next[item.path as keyof ChangePasswordFormValues] = item.message;
					}
				}
				setErrors(next);
				return;
			}
			setIsLoading(true);
			try {
				const response = await changePasswordRequest({
					currentPassword,
					newPassword,
				});
				if (response.success) {
					clearToken();
					setData({ user: null });
					toast.success("Password changed", {
						description: "Please sign in with your new password.",
					});
					router.push("/login");
				}
			} finally {
				setIsLoading(false);
			}
		},
		[currentPassword, newPassword, confirmPassword, setData, router]
	);

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-8">
			<header>
				<h1 className="text-2xl font-bold text-text-primary">Settings</h1>
				<p className="mt-1 text-sm text-text-secondary">
					Manage your account and preferences.
				</p>
			</header>

			<div className="flex flex-col sm:flex-row gap-6">
				<nav
					className="flex sm:flex-col gap-1 shrink-0"
					role="tablist"
					aria-label="Settings sections"
				>
					{tabs.map((tab) => {
						const isActive = activeTab === tab.id;
						return (
							<button
								key={tab.id}
								id={tab.tabId}
								type="button"
								role="tab"
								aria-selected={isActive}
								aria-label={tab.label}
								tabIndex={isActive ? 0 : -1}
								onClick={() => setActiveTab(tab.id)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										setActiveTab(tab.id);
									}
								}}
								className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
									isActive
										? "bg-green-primary/10 text-green-primary"
										: "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
								}`}
							>
								{tab.icon}
								{tab.label}
							</button>
						);
					})}
				</nav>

				<div
					className="flex-1 min-w-0"
					role="tabpanel"
					aria-labelledby={
						activeTab === "security" ? "security-tab" : undefined
					}
				>
					{activeTab === "security" && (
						<>
							<Card padding="lg" variant="default">
								<h2 className="text-2xl font-semibold text-text-primary">
									Change password
								</h2>
								<p className="mt-1 text-sm text-text-secondary">
									Update your password. You will be signed out and must sign in
									again with your new password.
								</p>
								<form
									onSubmit={handleSubmit}
									className="mt-6 space-y-4 max-w-md"
								>
									<Input
										label="Current password"
										type={showCurrentPassword ? "text" : "password"}
										placeholder="••••••••"
										value={currentPassword}
										onChange={(e) => setCurrentPassword(e.target.value)}
										icon={<LockIcon />}
										iconPosition="left"
										error={errors.currentPassword}
										rightElement={
											<button
												type="button"
												onClick={handleToggleCurrentPassword}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														handleToggleCurrentPassword();
													}
												}}
												className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-green-primary/20"
												aria-label={
													showCurrentPassword
														? "Hide password"
														: "Show password"
												}
												tabIndex={0}
											>
												{showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
											</button>
										}
										required
										autoComplete="current-password"
										aria-required="true"
									/>
									<Input
										label="New password"
										type={showNewPassword ? "text" : "password"}
										placeholder="••••••••"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										icon={<LockIcon />}
										iconPosition="left"
										error={errors.newPassword}
										rightElement={
											<button
												type="button"
												onClick={handleToggleNewPassword}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														handleToggleNewPassword();
													}
												}}
												className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-green-primary/20"
												aria-label={
													showNewPassword ? "Hide password" : "Show password"
												}
												tabIndex={0}
											>
												{showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
											</button>
										}
										required
										autoComplete="new-password"
										aria-required="true"
									/>
									<Input
										label="Confirm new password"
										type={showNewPassword ? "text" : "password"}
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
										size="lg"
										className="mt-2 cursor-pointer"
										disabled={isLoading}
										aria-busy={isLoading}
									>
										{isLoading ? "Updating…" : "Change password"}
									</Button>
								</form>
							</Card>

							<Card padding="lg" variant="default" className="mt-6">
								<div className="flex items-center justify-between gap-4">
									<div>
										<h2 className="text-2xl font-semibold text-text-primary">
											Two-factor authentication
										</h2>
										<p className="mt-1 text-sm text-text-secondary">
											Add an extra layer of security by requiring a code from
											your authenticator app when signing in.
										</p>
									</div>
									<div className="shrink-0 flex items-center gap-3">
										{twoFaStatusLoading ? (
											<div
												className="h-6 w-11 shrink-0 rounded-full bg-bg-elevated animate-pulse"
												aria-hidden
											/>
										) : (
											<button
												type="button"
												role="switch"
												aria-checked={twoFaEnabled}
												aria-label={
													twoFaEnabled
														? "Two-factor authentication is on; click to disable"
														: "Two-factor authentication is off; click to enable"
												}
												onClick={handleTwoFaToggle}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														handleTwoFaToggle();
													}
												}}
												className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary/20 focus:ring-offset-2 ${
													twoFaEnabled ? "bg-green-primary" : "bg-bg-elevated"
												}`}
												tabIndex={0}
											>
												<span
													className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
														twoFaEnabled ? "translate-x-6" : "translate-x-1"
													}`}
												/>
											</button>
										)}
										<span className="text-sm text-text-secondary">
											{twoFaStatusLoading
												? "Loading…"
												: twoFaEnabled
												? "On"
												: "Off"}
										</span>
									</div>
								</div>
							</Card>
						</>
					)}
				</div>
			</div>

			<Modal
				open={disableModalOpen}
				onClose={handleDisableModalClose}
				title="Disable two-factor authentication"
				ariaLabel="Disable two-factor authentication"
				closeOnOverlayClick={!disableMutation.isPending}
				contentClassName="max-w-md!"
				footer={
					<>
						<Button
							type="button"
							variant="secondary"
							onClick={handleDisableModalClose}
							className="cursor-pointer"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							form="disable-2fa-form"
							variant="primary"
							disabled={disableMutation.isPending}
							aria-busy={disableMutation.isPending}
							className="cursor-pointer"
						>
							{disableMutation.isPending ? "Disabling…" : "Disable 2FA"}
						</Button>
					</>
				}
			>
				<form
					id="disable-2fa-form"
					onSubmit={handleDisableSubmit}
					className="space-y-4"
				>
					<Input
						label="Current password"
						type="password"
						placeholder="••••••••"
						value={disablePassword}
						onChange={(e) => setDisablePassword(e.target.value)}
						required
						autoComplete="current-password"
						aria-required="true"
					/>
				</form>
			</Modal>

			<Modal
				open={enableModalOpen}
				onClose={handleEnableModalClose}
				title="Enable two-factor authentication"
				ariaLabel="Enable two-factor authentication"
				closeOnOverlayClick={enableStep !== "loading" && !isConfirming}
				contentClassName={enableStep === "token" ? "max-w-md!" : undefined}
				footer={
					enableStep === "qr" ? (
						<Button
							type="button"
							onClick={() => setEnableStep("token")}
							disabled={!selectedBackupCode}
							className="cursor-pointer"
						>
							Continue to verification
						</Button>
					) : enableStep === "token" ? (
						<>
							<Button
								type="button"
								variant="secondary"
								onClick={handleEnableModalClose}
								className="cursor-pointer"
							>
								Cancel
							</Button>
							<Button
								type="button"
								onClick={handleConfirm2Fa}
								disabled={
									tokenOtp.join("").length !== OTP_LENGTH || isConfirming
								}
								aria-busy={isConfirming}
								className="cursor-pointer"
							>
								{isConfirming ? "Verifying…" : "Enable 2FA"}
							</Button>
						</>
					) : undefined
				}
			>
				{enableStep === "loading" && (
					<div
						className="transIn space-y-4"
						aria-busy="true"
						aria-label="Loading"
					>
						<div className="h-48 w-48 mx-auto rounded-xl bg-bg-elevated animate-pulse" />
						<div className="h-4 w-full max-w-xs mx-auto rounded bg-text-muted/20 animate-pulse" />
						<div className="h-4 w-3/4 max-w-sm mx-auto rounded bg-text-muted/20 animate-pulse" />
					</div>
				)}
				{enableStep === "qr" && setupData && (
					<div className="transIn space-y-6">
						<p className="text-sm text-text-secondary">
							Scan this QR code with your authenticator app or enter the code
							manually.
						</p>
						<div className="flex justify-center">
							<img
								src={setupData.qrCode}
								alt="QR code for 2FA"
								className="h-48 w-48 rounded-lg border border-border-primary"
							/>
						</div>
						<div>
							<p className="text-sm font-medium text-text-primary mb-2">
								Select one backup code to verify (you will use it to complete
								setup):
							</p>
							<div className="flex flex-wrap gap-2">
								{setupData.backupCodes.map((code) => (
									<button
										key={code}
										type="button"
										onClick={() => setSelectedBackupCode(code)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												setSelectedBackupCode(code);
											}
										}}
										className={`rounded-lg border px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary/20 cursor-pointer ${
											selectedBackupCode === code
												? "border-green-primary bg-green-primary/10 text-green-primary"
												: "border-border-primary bg-bg-card hover:bg-bg-elevated text-text-primary"
										}`}
										tabIndex={0}
										aria-pressed={selectedBackupCode === code}
									>
										{code}
									</button>
								))}
							</div>
						</div>
					</div>
				)}
				{enableStep === "token" && (
					<div className="transIn space-y-4">
						<p className="text-sm text-text-secondary">
							Enter the 6-digit code from your authenticator app.
						</p>
						<div
							className="flex gap-2 justify-center"
							role="group"
							aria-label="6-digit verification code"
						>
							{tokenOtp.map((digit, index) => (
								<input
									key={index}
									ref={(el) => {
										tokenInputRefs.current[index] = el;
									}}
									type="text"
									inputMode="numeric"
									maxLength={6}
									value={digit}
									onChange={(e) => handleTokenOtpChange(index, e.target.value)}
									onKeyDown={(e) => handleTokenKeyDown(index, e)}
									onPaste={handleTokenPaste}
									disabled={isConfirming}
									className="h-12 w-12 rounded-lg border border-border-primary bg-bg-card text-center text-lg font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20 focus:border-green-primary disabled:opacity-60"
									aria-label={`Digit ${index + 1}`}
								/>
							))}
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
