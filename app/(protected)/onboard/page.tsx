"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ConnectBankSecureModal } from "@/components/modal";
import { onboardingCompleteRequest } from "@/lib/api/requests";
import { showErrorToast } from "@/lib/api/client";
import { useAuthStore } from "@/stores/use-auth-store";
import Connect from "@mono.co/connect.js";
import {
	Bank,
	Briefcase,
	BuildingOffice,
	CalendarCheck,
	CaretLeft,
	CaretRight,
	ChartLine,
	ChartPieSlice,
	Laptop,
	Money,
	Target,
	User,
} from "@phosphor-icons/react/dist/ssr";
import type { OnboardingCompletePayload } from "@/lib/api/types";

const STEP_LABELS = [
	"Employment Status",
	"Income Range",
	"Financial Goal",
	"Budgeting Experience",
	"Connect Account",
] as const;

const TOTAL_STEPS = STEP_LABELS.length;

type Phase = "welcome" | "stepper";
type EmploymentStatus =
	| "salaried"
	| "self-employed"
	| "freelancer"
	| "business-owner"
	| null;
type IncomeRange = "100k-250k" | "250k-500k" | "500k-1m" | "1m+" | null;
type FinancialGoal =
	| "control-spending"
	| "save-more"
	| "start-investing"
	| "plan-future"
	| null;
type BudgetingExperience = "new" | "some-experience" | "experienced" | null;

// Icons
const LogoIcon = () => (
	<svg
		className="h-10 w-10"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		aria-hidden
	>
		<circle cx="12" cy="12" r="10" strokeWidth={2} strokeDasharray="4 2" />
	</svg>
);

const LockIcon = () => (
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
			d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
		/>
	</svg>
);

const DocumentIcon = () => (
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
			d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		/>
	</svg>
);

const UsersIcon = () => (
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
			d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
		/>
	</svg>
);

const MailCheckIcon = () => (
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
			d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
		/>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M5 13l4 4L19 7"
		/>
	</svg>
);

const CheckIcon = () => (
	<svg
		className="h-4 w-4"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		strokeWidth={2.5}
		aria-hidden
	>
		<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
	</svg>
);

const mapFinancialGoalToApi = (
	value: FinancialGoal
): OnboardingCompletePayload["financialGoal"] => {
	if (value === "save-more") return "save-money";
	if (
		value === "control-spending" ||
		value === "start-investing" ||
		value === "plan-future"
	) {
		return value;
	}
	return "control-spending";
};

export default function OnboardPage() {
	const router = useRouter();
	const user = useAuthStore((s) => s.user);
	const [phase, setPhase] = useState<Phase>("welcome");
	const [currentStep, setCurrentStep] = useState(1);
	const [employmentStatus, setEmploymentStatus] =
		useState<EmploymentStatus>(null);
	const [incomeRange, setIncomeRange] = useState<IncomeRange>(null);
	const [financialGoal, setFinancialGoal] = useState<FinancialGoal>(null);
	const [budgetingExperience, setBudgetingExperience] =
		useState<BudgetingExperience>(null);
	const [authorizeAccess, setAuthorizeAccess] = useState(false);
	const [connectModalOpen, setConnectModalOpen] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);
	const linkedInstitutionNameRef = useRef<string>("");

	const handleGetStarted = useCallback(() => {
		setPhase("stepper");
		setCurrentStep(1);
	}, []);

	const handleConnectConfirm = useCallback(() => {
		if (
			!employmentStatus ||
			!incomeRange ||
			!financialGoal ||
			!budgetingExperience ||
			!authorizeAccess
		) {
			showErrorToast(new Error("Please complete all steps and consent."), {
				title: "Missing information",
				message: "Please complete all steps and accept the consent.",
			});
			return;
		}
		const monoPublicKey = process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY?.trim();
		if (!monoPublicKey) {
			showErrorToast(new Error("Mono is not configured."), {
				title: "Configuration error",
				message: "Please try again later or contact support.",
			});
			return;
		}
		setConnectModalOpen(false);
		linkedInstitutionNameRef.current = "";
		setIsConnecting(true);

		const customer = {
			name: user?.name ?? "",
			email: user?.email ?? "",
		};

		const connect = new Connect({
			key: monoPublicKey,
			scope: "auth",
			data: { customer },
			onSuccess: async ({ code }: { code: string }) => {
				const mono = linkedInstitutionNameRef.current || "Unknown";
				const payload: OnboardingCompletePayload = {
					employmentStatus,
					incomeRange,
					financialGoal: mapFinancialGoalToApi(financialGoal),
					budgetingExperience,
					mono,
					monoCode: code,
					authorizationConsent: authorizeAccess,
				};
				try {
					const response = await onboardingCompleteRequest(payload);
					if (response?.success) {
						router.replace("/onboard/success");
						return;
					}
					showErrorToast(
						new Error(
							response?.message ?? "Onboarding could not be completed."
						),
						{
							title: "Error",
							message: response?.message ?? "Please try again.",
						}
					);
				} catch (err) {
					showErrorToast(err, {
						title: "Connection failed",
						message: "Could not complete setup. Please try again.",
					});
				} finally {
					setIsConnecting(false);
				}
			},
			onClose: () => {
				setIsConnecting(false);
			},
			onEvent: (
				eventName: string,
				data: { institution?: { name?: string } }
			) => {
				if (eventName === "ACCOUNT_LINKED" && data?.institution?.name) {
					linkedInstitutionNameRef.current = data.institution.name;
				}
			},
		});

		connect.setup();
		connect.open();
	}, [
		employmentStatus,
		incomeRange,
		financialGoal,
		budgetingExperience,
		authorizeAccess,
		user?.name,
		user?.email,
		router,
	]);

	const canConnectAccount =
		!!employmentStatus &&
		!!incomeRange &&
		!!financialGoal &&
		!!budgetingExperience &&
		authorizeAccess;

	const hasMonoPublicKey =
		typeof window !== "undefined"
			? !!process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY?.trim()
			: true;

	return (
		<>
			{phase === "welcome" && (
				<Card
					variant="elevated"
					padding="lg"
					className="border border-border-primary w-2xl mx-auto"
				>
					<div className="flex flex-col items-center text-center">
						<div
							className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-primary/15 text-green-primary"
							aria-hidden
						>
							<LogoIcon />
						</div>
						<h1 className="text-2xl font-bold text-text-primary">
							Welcome to Flynt
						</h1>
						<p className="mt-2 text-sm text-text-secondary">
							Your intelligent financial advisor for smarter money decisions.
						</p>
						<p className="mt-1 text-sm text-text-secondary">
							Connect your accounts and get personalized insights in minutes.
						</p>
						<div className="mt-6 flex flex-wrap items-center justify-center gap-6">
							<span className="flex items-center gap-2 text-sm text-purple">
								<LockIcon />
								Bank-grade Security
							</span>
							<span className="flex items-center gap-2 text-sm text-green-primary">
								<DocumentIcon />
								Read-only Access
							</span>
							<span className="flex items-center gap-2 text-sm text-orange">
								<UsersIcon />
								50k+ Nigerians
							</span>
						</div>
						<Button
							type="button"
							variant="primary"
							fullWidth
							size="lg"
							className="mt-8 cursor-pointer"
							onClick={handleGetStarted}
							aria-label="Get started"
						>
							Get Started
						</Button>
					</div>
				</Card>
			)}

			{phase === "stepper" && (
				<>
					<div
						className="mb-6 flex flex-wrap items-center justify-center gap-1 text-xs sm:gap-2"
						role="progressbar"
						aria-valuenow={currentStep}
						aria-valuemin={1}
						aria-valuemax={TOTAL_STEPS}
						aria-label={`Onboarding progress, step ${currentStep} of ${TOTAL_STEPS}: ${
							STEP_LABELS[currentStep - 1]
						}`}
					>
						{STEP_LABELS.map((label, i) => {
							const stepNum = i + 1;
							const isCompleted = currentStep > stepNum;
							const isActive = currentStep === stepNum;
							return (
								<span key={stepNum} className="flex items-center gap-1.5">
									<span
										className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
											isCompleted
												? "bg-green-primary text-white"
												: isActive
												? "bg-text-primary text-bg-card"
												: "border border-border-primary text-text-muted"
										}`}
									>
										{isCompleted ? <CheckIcon /> : stepNum}
									</span>
									<span
										className={
											isActive
												? "font-medium text-text-primary"
												: "text-text-muted"
										}
									>
										{label}
									</span>
									{stepNum < TOTAL_STEPS && <CaretRight size={16} />}
								</span>
							);
						})}
					</div>

					{currentStep === 1 && (
						<Card
							variant="elevated"
							padding="lg"
							className="border border-border-primary w-2xl mx-auto"
						>
							<div className="flex flex-col items-center text-center">
								<div
									className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-primary/15 text-green-primary"
									aria-hidden
								>
									<User size={30} weight="duotone" />
								</div>
								<h2 className="text-xl font-bold text-text-primary">
									What&apos;s Your Employment Status?
								</h2>
								<p className="mt-1 text-sm text-text-secondary">
									This helps us personalize your financial advice
								</p>
								<div className="mt-6 grid w-full grid-cols-2 gap-3">
									{[
										{
											value: "salaried" as const,
											label: "Salaried Employee",
											icon: <Briefcase size={20} weight="duotone" />,
										},
										{
											value: "self-employed" as const,
											label: "Self-employed",
											icon: <User size={20} weight="duotone" />,
										},
										{
											value: "freelancer" as const,
											label: "Freelancer",
											icon: <Laptop size={20} weight="duotone" />,
										},
										{
											value: "business-owner" as const,
											label: "Business Owner",
											icon: <BuildingOffice size={20} weight="duotone" />,
										},
									].map(({ value, label, icon }) => (
										<button
											key={value}
											type="button"
											onClick={() => setEmploymentStatus(value)}
											className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-primary/20 ${
												employmentStatus === value
													? "border-2 border-green-primary bg-green-primary/5 text-green-primary"
													: "border-border-primary text-text-primary hover:bg-bg-elevated"
											}`}
										>
											<span
												className={
													employmentStatus === value
														? "text-green-primary"
														: "text-text-muted"
												}
											>
												{icon}
											</span>
											{label}
										</button>
									))}
								</div>
								<Button
									type="button"
									variant="primary"
									fullWidth
									size="lg"
									className="mt-6 cursor-pointer"
									onClick={() => setCurrentStep(2)}
								>
									Next
								</Button>
							</div>
						</Card>
					)}

					{currentStep === 2 && (
						<Card
							variant="elevated"
							padding="lg"
							className="border border-border-primary w-2xl mx-auto"
						>
							<div className="flex flex-col items-center text-center">
								<div
									className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-primary/15 text-green-primary"
									aria-hidden
								>
									<MailCheckIcon />
								</div>
								<h2 className="text-xl font-bold text-text-primary">
									What&apos;s Your Monthly Income Range?
								</h2>
								<p className="mt-1 text-sm text-text-secondary">
									We use this to calibrate your savings targets
								</p>
								<div className="mt-6 grid w-full grid-cols-2 gap-3">
									{[
										{ value: "100k-250k" as const, label: "₦100k - ₦250k" },
										{ value: "250k-500k" as const, label: "₦250k - ₦500k" },
										{ value: "500k-1m" as const, label: "₦500k - ₦1m" },
										{ value: "1m+" as const, label: "₦1m+" },
									].map(({ value, label }) => (
										<button
											key={value}
											type="button"
											onClick={() => setIncomeRange(value)}
											className={`rounded-xl border p-4 text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-primary/20 ${
												incomeRange === value
													? "border-2 border-green-primary bg-green-primary/5 text-text-primary"
													: "border-border-primary text-text-primary hover:bg-bg-elevated"
											}`}
										>
											{label}
										</button>
									))}
								</div>
								<div className="mt-6 flex w-full flex-col gap-3">
									<Button
										type="button"
										variant="primary"
										fullWidth
										size="lg"
										className="cursor-pointer"
										onClick={() => setCurrentStep(3)}
									>
										Next
									</Button>
									<button
										type="button"
										onClick={() => setCurrentStep(1)}
										className="w-full flex items-center justify-center gap-1 cursor-pointer text-center text-sm font-medium text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20 rounded"
									>
										<CaretLeft size={20} /> Back
									</button>
								</div>
							</div>
						</Card>
					)}

					{currentStep === 3 && (
						<Card
							variant="elevated"
							padding="lg"
							className="border border-border-primary w-2xl mx-auto"
						>
							<div className="flex flex-col items-center text-center">
								<div
									className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-primary/15 text-green-primary"
									aria-hidden
								>
									<Target size={32} weight="duotone" />
								</div>
								<h2 className="text-xl font-bold text-text-primary">
									What&apos;s Your Main Financial Goal?
								</h2>
								<p className="mt-1 text-sm text-text-secondary">
									We&apos;ll prioritize features that help you achieve this
								</p>
								<div className="mt-6 grid w-full grid-cols-2 gap-3">
									{[
										{
											value: "control-spending" as const,
											label: "Control my spending",
											icon: <ChartPieSlice size={20} weight="duotone" />,
										},
										{
											value: "save-more" as const,
											label: "Save more money",
											icon: <Money size={20} weight="duotone" />,
										},
										{
											value: "start-investing" as const,
											label: "Start investing",
											icon: <ChartLine size={20} />,
										},
										{
											value: "plan-future" as const,
											label: "Plan for the future",
											icon: <CalendarCheck size={20} weight="duotone" />,
										},
									].map(({ value, label, icon }) => (
										<button
											key={value}
											type="button"
											onClick={() => setFinancialGoal(value)}
											className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-primary/20 ${
												financialGoal === value
													? "border-2 border-green-primary bg-green-primary/5 text-green-primary"
													: "border-border-primary text-text-primary hover:bg-bg-elevated"
											}`}
										>
											<span
												className={
													financialGoal === value
														? "text-green-primary"
														: "text-text-muted"
												}
											>
												{icon}
											</span>
											{label}
										</button>
									))}
								</div>
								<div className="mt-6 flex w-full flex-col gap-3">
									<Button
										type="button"
										variant="primary"
										fullWidth
										size="lg"
										className="cursor-pointer"
										onClick={() => setCurrentStep(4)}
									>
										Next
									</Button>
									<button
										type="button"
										onClick={() => setCurrentStep(2)}
										className="w-full flex items-center justify-center gap-1 cursor-pointer text-center text-sm font-medium text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20 rounded"
									>
										<CaretLeft size={20} /> Back
									</button>
								</div>
							</div>
						</Card>
					)}

					{currentStep === 4 && (
						<Card
							variant="elevated"
							padding="lg"
							className="border border-border-primary w-2xl mx-auto"
						>
							<div className="flex flex-col items-center text-center">
								<div
									className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-primary/15 text-green-primary"
									aria-hidden
								>
									<ChartPieSlice size={32} weight="duotone" />
								</div>
								<h2 className="text-xl font-bold text-text-primary">
									What&apos;s your budgeting experience?
								</h2>
								<p className="mt-1 text-sm text-text-secondary">
									We&apos;ll tailor tips to your level
								</p>
								<div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
									{[
										{
											value: "new" as const,
											label: "New to budgeting",
										},
										{
											value: "some-experience" as const,
											label: "Some experience",
										},
										{
											value: "experienced" as const,
											label: "Experienced",
										},
									].map(({ value, label }) => (
										<button
											key={value}
											type="button"
											onClick={() => setBudgetingExperience(value)}
											className={`rounded-xl border p-4 text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-primary/20 ${
												budgetingExperience === value
													? "border-2 border-green-primary bg-green-primary/5 text-text-primary"
													: "border-border-primary text-text-primary hover:bg-bg-elevated"
											}`}
										>
											{label}
										</button>
									))}
								</div>
								<div className="mt-6 flex w-full flex-col gap-3">
									<Button
										type="button"
										variant="primary"
										fullWidth
										size="lg"
										className="cursor-pointer"
										onClick={() => setCurrentStep(5)}
									>
										Next
									</Button>
									<button
										type="button"
										onClick={() => setCurrentStep(3)}
										className="w-full flex items-center justify-center gap-1 cursor-pointer text-center text-sm font-medium text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20 rounded"
									>
										<CaretLeft size={20} /> Back
									</button>
								</div>
							</div>
						</Card>
					)}

					{currentStep === 5 && (
						<>
							<Card
								variant="elevated"
								padding="lg"
								className="border border-border-primary w-2xl mx-auto"
							>
								<div className="flex flex-col items-center text-center">
									<div
										className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-primary/15 text-green-primary"
										aria-hidden
									>
										<Bank size={32} />
									</div>
									<h2 className="text-xl font-bold text-text-primary">
										Connect your bank account.
									</h2>
									<p className="mt-1 text-sm text-text-secondary">
										Securely link your primary account for analysis.
									</p>
								</div>

								<div className="mt-6 space-y-4">
									<p className="flex items-center gap-2 text-xs text-text-muted">
										<LockIcon />
										Your credentials are never stored on our servers.
									</p>

									<label className="flex cursor-pointer items-start gap-3">
										<input
											type="checkbox"
											checked={authorizeAccess}
											onChange={(e) => setAuthorizeAccess(e.target.checked)}
											className="mt-1 h-4 w-4 rounded border-border-primary text-green-primary focus:ring-green-primary/20"
											aria-label="Authorize Flynt to access transaction history"
										/>
										<span className="text-sm text-text-secondary">
											I authorize Flynt to access my transaction history for the
											purpose of financial analysis and advice.
										</span>
									</label>

									<Button
										type="button"
										variant="primary"
										fullWidth
										size="lg"
										className="cursor-pointer"
										disabled={
											!canConnectAccount || isConnecting || !hasMonoPublicKey
										}
										loading={isConnecting}
										onClick={() => setConnectModalOpen(true)}
										aria-label={
											isConnecting ? "Connecting to bank..." : "Connect account"
										}
									>
										{isConnecting ? "Connecting..." : "Connect Account"}
									</Button>

									<button
										type="button"
										onClick={() => setCurrentStep(4)}
										className="w-full flex items-center justify-center gap-1 cursor-pointer text-center text-sm font-medium text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20 rounded"
									>
										<CaretLeft size={20} /> Back
									</button>
								</div>
							</Card>

							<p className="mt-4 text-center text-xs text-text-muted">
								You&apos;ll choose your bank and sign in securely in the Mono
								window.
							</p>
						</>
					)}
				</>
			)}

			<ConnectBankSecureModal
				open={connectModalOpen}
				onClose={() => setConnectModalOpen(false)}
				onConfirm={handleConnectConfirm}
			/>
		</>
	);
}
