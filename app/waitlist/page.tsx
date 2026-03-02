"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	waitlistFormSchema,
	type WaitlistFormValues,
} from "@/lib/validations/waitlist";
import ThemeToggle from "@/components/ThemeToggle";
import { HeaderLogo } from "@/components/HeaderLogo";
import { Card, Input, Button, Select } from "@/components/ui";
import type { SelectOption } from "@/components/ui";
import WaitlistSuccessModal from "@/components/WaitlistSuccessModal";

const PRIMARY_GOAL_OPTIONS: SelectOption[] = [
	{ value: "save_emergency", label: "Save for emergency" },
	{ value: "invest_growth", label: "Invest for growth" },
	{ value: "pay_debt", label: "Pay off debt" },
	{ value: "budget_better", label: "Budget better" },
	{ value: "other", label: "Other" },
];

const SAVING_METHODS_OPTIONS: SelectOption[] = [
	{ value: "bank_savings", label: "Bank savings" },
	{ value: "stocks", label: "Stocks" },
	{ value: "mutual_funds", label: "Mutual funds" },
	{ value: "crypto", label: "Crypto" },
	{ value: "none", label: "None" },
	{ value: "other", label: "Other" },
];

const MONTHLY_RANGE_OPTIONS: SelectOption[] = [
	{ value: "under_50k", label: "Under ₦50k" },
	{ value: "50k_200k", label: "₦50k–₦200k" },
	{ value: "200k_500k", label: "₦200k–₦500k" },
	{ value: "above_500k", label: "Above ₦500k" },
];

const HEAR_ABOUT_OPTIONS: SelectOption[] = [
	{ value: "social_media", label: "Social media" },
	{ value: "friend_family", label: "Friend/family" },
	{ value: "search", label: "Search" },
	{ value: "blog", label: "Blog" },
	{ value: "other", label: "Other" },
];

const INITIAL_FORM: WaitlistFormValues = {
	fullName: "",
	email: "",
	phone: "",
	primaryGoal: "",
	currentSavingMethods: "",
	monthlySavingsRange: "",
	howDidYouHear: "",
};

export default function WaitlistPage() {
	const router = useRouter();
	const [formValues, setFormValues] =
		useState<WaitlistFormValues>(INITIAL_FORM);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [successModalOpen, setSuccessModalOpen] = useState(false);

	const updateField = useCallback(
		<K extends keyof WaitlistFormValues>(
			field: K,
			value: WaitlistFormValues[K]
		) => {
			setFormValues((prev) => ({ ...prev, [field]: value }));
			setErrors((prev) => {
				const next = { ...prev };
				delete next[field];
				return next;
			});
		},
		[]
	);

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setErrors({});

			const result = waitlistFormSchema.safeParse(formValues);
			if (!result.success) {
				const fieldErrors: Record<string, string> = {};
				const flattened = result.error.flatten();
				Object.entries(flattened.fieldErrors).forEach(([key, messages]) => {
					const msg = Array.isArray(messages) ? messages[0] : messages;
					if (msg) fieldErrors[key] = msg;
				});
				setErrors(fieldErrors);
				return;
			}

			setIsSubmitting(true);
			try {
				const res = await fetch("/api/waitlist", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(result.data),
				});

				const data = await res.json().catch(() => ({}));

				if (!res.ok) {
					const message =
						typeof data?.message === "string"
							? data.message
							: "Something went wrong. Please try again.";
					toast.error("Could not join waitlist", { description: message });
					return;
				}

				toast.success("You're on the list! We'll be in touch soon.");
				setSuccessModalOpen(true);
			} finally {
				setIsSubmitting(false);
			}
		},
		[formValues]
	);

	const handleContinue = useCallback(() => {
		setSuccessModalOpen(false);
		router.push("/");
	}, [router]);

	return (
		<div className="min-h-screen bg-bg-primary">
			<header className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle">
				<div className="container px-4 py-6 mx-auto max-w-7xl flex items-center justify-between">
					<div className="flex items-center gap-4">
						<HeaderLogo />
					</div>
					<div className="flex items-center gap-3">
						<ThemeToggle />
						{/* <Link
							href="/waitlist"
							className="rounded-lg border border-border-primary bg-transparent px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-green-primary/10"
						>
							Join waitlist
						</Link> */}
						{/* <Link
							href="/waitlist"
							className="rounded-lg bg-green-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-hover"
						>
							View Demo
						</Link> */}
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-10 max-w-2xl">
				<div className="mb-8 text-center">
					<h1 className="text-2xl font-bold text-text-primary">
						Join the Flynt waitlist
					</h1>
					<p className="mt-2 text-sm text-text-secondary">
						Tell us a bit about yourself and your goals.
					</p>
				</div>

				<Card padding="lg">
					<form onSubmit={handleSubmit} className="space-y-5">
						<Input
							id="waitlist-fullName"
							label="Full name"
							placeholder="e.g. Jane Doe"
							value={formValues.fullName}
							onChange={(e) => updateField("fullName", e.target.value)}
							error={errors.fullName}
							required
							autoComplete="name"
							aria-required="true"
						/>
						<Input
							id="waitlist-email"
							label="Email"
							type="email"
							placeholder="name@example.com"
							value={formValues.email}
							onChange={(e) => updateField("email", e.target.value)}
							error={errors.email}
							required
							autoComplete="email"
							aria-required="true"
						/>
						<Input
							id="waitlist-phone"
							label="Phone number"
							type="tel"
							placeholder="e.g. 08012345678"
							value={formValues.phone}
							onChange={(e) => updateField("phone", e.target.value)}
							error={errors.phone}
							required
							autoComplete="tel"
							aria-required="true"
						/>
						<Select
							id="waitlist-primaryGoal"
							label="Primary goal"
							options={PRIMARY_GOAL_OPTIONS}
							value={formValues.primaryGoal}
							onChange={(v) => updateField("primaryGoal", v)}
							error={errors.primaryGoal}
							placeholder="Select your primary goal"
							required
							aria-required="true"
						/>
						<Select
							id="waitlist-currentSavingMethods"
							label="Current saving / investment methods"
							options={SAVING_METHODS_OPTIONS}
							value={formValues.currentSavingMethods}
							onChange={(v) => updateField("currentSavingMethods", v)}
							error={errors.currentSavingMethods}
							placeholder="Select current methods"
							required
							aria-required="true"
						/>
						<Select
							id="waitlist-monthlySavingsRange"
							label="Monthly savings and investment range"
							options={MONTHLY_RANGE_OPTIONS}
							value={formValues.monthlySavingsRange}
							onChange={(v) => updateField("monthlySavingsRange", v)}
							error={errors.monthlySavingsRange}
							placeholder="Select monthly range"
							required
							aria-required="true"
						/>
						<Select
							id="waitlist-howDidYouHear"
							label="How did you hear about us?"
							options={HEAR_ABOUT_OPTIONS}
							value={formValues.howDidYouHear}
							onChange={(v) => updateField("howDidYouHear", v)}
							error={errors.howDidYouHear}
							placeholder="Select an option"
							required
							aria-required="true"
						/>
						<Button
							type="submit"
							variant="primary"
							size="lg"
							fullWidth
							disabled={isSubmitting}
							aria-busy={isSubmitting}
						>
							{isSubmitting ? "Submitting…" : "Join waitlist"}
						</Button>
					</form>
				</Card>
			</main>

			<footer className="container mx-auto px-4 py-8 text-center text-text-muted">
				<p>© 2026 Flynt Finance.</p>
			</footer>

			<WaitlistSuccessModal
				open={successModalOpen}
				onClose={() => setSuccessModalOpen(false)}
				onContinue={handleContinue}
			/>
		</div>
	);
}
