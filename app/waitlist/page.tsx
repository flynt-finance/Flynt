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
	{ value: "fraud_prevention", label: "Prevent payment fraud" },
	{ value: "transaction_monitoring", label: "Monitor transactions in real time" },
	{ value: "chargeback_reduction", label: "Reduce chargebacks & losses" },
	{ value: "compliance", label: "Meet compliance requirements" },
	{ value: "automation", label: "Automate fraud review workflows" },
];

const SAVING_METHODS_OPTIONS: SelectOption[] = [
	{ value: "bank", label: "Bank or neobank" },
	{ value: "fintech", label: "Fintech / wallet app" },
	{ value: "payment_processor", label: "Payment processor" },
	{ value: "ecommerce", label: "E-commerce platform" },
	{ value: "other", label: "Other financial services" },
];

const MONTHLY_RANGE_OPTIONS: SelectOption[] = [
	{ value: "under_50k", label: "Under 10,000 transactions / month" },
	{ value: "50k_200k", label: "10,000 – 50,000 / month" },
	{ value: "200k_500k", label: "50,000 – 200,000 / month" },
	{ value: "above_500k", label: "200,000+ / month" },
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
						Request a Flynt demo
					</h1>
					<p className="mt-2 text-sm text-text-secondary">
						Tell us about your business and we&apos;ll show you how the fraud
						detection API works.
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
							label="What do you need Flynt for?"
							options={PRIMARY_GOAL_OPTIONS}
							value={formValues.primaryGoal}
							onChange={(v) => updateField("primaryGoal", v)}
							error={errors.primaryGoal}
							placeholder="Select your use case"
							required
							aria-required="true"
						/>
						<Select
							id="waitlist-currentSavingMethods"
							label="Your industry"
							options={SAVING_METHODS_OPTIONS}
							value={formValues.currentSavingMethods}
							onChange={(v) => updateField("currentSavingMethods", v)}
							error={errors.currentSavingMethods}
							placeholder="Select your industry"
							required
							aria-required="true"
						/>
						<Select
							id="waitlist-monthlySavingsRange"
							label="Monthly transaction volume"
							options={MONTHLY_RANGE_OPTIONS}
							value={formValues.monthlySavingsRange}
							onChange={(v) => updateField("monthlySavingsRange", v)}
							error={errors.monthlySavingsRange}
							placeholder="Select transaction volume"
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
							{isSubmitting ? "Submitting…" : "Request demo"}
						</Button>
					</form>
				</Card>
			</main>

			<footer className="container mx-auto px-4 py-8 text-center text-text-muted">
				<p>© 2026 Flynt. Fraud detection API for modern businesses.</p>
			</footer>

			<WaitlistSuccessModal
				open={successModalOpen}
				onClose={() => setSuccessModalOpen(false)}
				onContinue={handleContinue}
			/>
		</div>
	);
}
