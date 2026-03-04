"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { waitlistFormSchema } from "@/lib/validations/waitlist";
import { z } from "zod";

// ─── Option lists ─────────────────────────────────────────────────────────────

const primaryGoals = [
  { value: "save_more", label: "Save more consistently" },
  { value: "invest", label: "Start or grow investments" },
  { value: "manage_debt", label: "Manage & eliminate debt" },
  { value: "track_spending", label: "Track & reduce spending" },
  { value: "passive_income", label: "Build passive income" },
];

const savingMethods = [
  { value: "bank_savings", label: "Bank savings account" },
  { value: "piggy_bank", label: "Piggybank / Cowrywise" },
  { value: "stocks_etf", label: "Stocks / ETFs" },
  { value: "real_estate", label: "Real estate" },
  { value: "nothing", label: "Nothing yet" },
];

const savingsRanges = [
  { value: "0_10k", label: "₦0 – ₦10,000" },
  { value: "10k_50k", label: "₦10,000 – ₦50,000" },
  { value: "50k_200k", label: "₦50,000 – ₦200,000" },
  { value: "200k_plus", label: "₦200,000+" },
];

const hearOptions = [
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "friend", label: "Friend / Referral" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "other", label: "Other" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type FormValues = z.infer<typeof waitlistFormSchema>;
type FieldErrors = Partial<Record<keyof FormValues, string>>;

const emptyForm: FormValues = {
  fullName: "",
  email: "",
  phone: "",
  primaryGoal: "",
  currentSavingMethods: "",
  monthlySavingsRange: "",
  howDidYouHear: "",
};

// ─── Field helpers ────────────────────────────────────────────────────────────

function InputField({
  label,
  id,
  error,
  ...props
}: {
  label: string;
  id: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
      >
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm bg-bg-primary dark:bg-white/5 text-text-secondary dark:text-white placeholder:text-slate-400 outline-none transition focus:ring-1 focus:ring-emerald-500
          ${error ? "border-red-500/60 focus:ring-red-500" : "border-slate-200 dark:border-white/10 focus:border-emerald-500/40"}`}
        {...props}
      />
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  id,
  options,
  error,
  value,
  onChange,
}: {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  error?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm bg-bg-primary dark:bg-[#0D1131] text-text-secondary dark:text-white outline-none transition focus:ring-1 focus:ring-emerald-500
          ${error ? "border-red-500/60 focus:ring-red-500" : "border-slate-200 dark:border-white/10 focus:border-emerald-500/40"}`}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TrustStats() {
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [serverError, setServerError] = useState("");

  const set = (field: keyof FormValues) => (val: string) =>
    setForm((f) => ({ ...f, [field]: val }));

  // Validate only step-1 fields before advancing
  const validateStep1 = () => {
    const step1Schema = waitlistFormSchema.pick({
      fullName: true,
      email: true,
      phone: true,
    });
    const result = step1Schema.safeParse(form);
    if (!result.success) {
      const errs: FieldErrors = {};
      result.error.issues.forEach((e) => {
        const key = e.path[0] as keyof FormValues;
        errs[key] = e.message;
      });
      setErrors(errs);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Full validation
    const result = waitlistFormSchema.safeParse(form);
    if (!result.success) {
      const errs: FieldErrors = {};
      result.error.issues.forEach((e) => {
        const key = e.path[0] as keyof FormValues;
        errs[key] = e.message;
      });
      setErrors(errs);
      return;
    }

    setStatus("loading");
    setServerError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setServerError(
          json.message ?? "Something went wrong. Please try again.",
        );
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setServerError(
        "Network error. Please check your connection and try again.",
      );
      setStatus("error");
    }
  };

  return (
    <section className="relative bg-bg-primary dark:bg-[#0A0D27] py-24 lg:py-32 overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

      <div className="container mx-auto max-w-6xl px-1">
        {/* ── CTA CARD ─────────────────────────────────────────────────── */}
        <div className="relative group">
          {/* Glow ring */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />

          <div className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-bg-secondary dark:bg-[#0E1233] overflow-hidden">
            {/* Carbon texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
              {/* ── LEFT: Headline ──────────────────────────────────────── */}
              <div className="flex flex-col justify-between p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-white/5">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="h-px w-8 bg-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500">
                      Early Access
                    </span>
                  </div>

                  <h2 className="text-4xl font-medium tracking-tight text-text-secondary dark:text-white md:text-5xl leading-tight">
                    Join the{" "}
                    <span className="text-emerald-400 font-serif italic">
                      Flynt Waitlist.
                    </span>
                  </h2>

                  <p className="mt-6 text-slate-400 text-sm leading-relaxed max-w-sm">
                    Stop managing accounts. Start governing your capital. Beta
                    access is limited — join the waitlist to secure your spot.
                  </p>
                </div>

                {/* Trust signals */}
                <div className="mt-10 flex flex-col gap-3">
                  {[
                    "No credit card required",
                    "End-to-end encrypted · Non-custodial",
                    "Early access perks for waitlist members",
                  ].map((point) => (
                    <div key={point} className="flex items-center gap-2.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── RIGHT: Form / Success ───────────────────────────────── */}
              <div className="p-10 lg:p-16 flex items-center">
                <AnimatePresence mode="wait">
                  {/* ── SUCCESS STATE ─────────────────────────────────── */}
                  {status === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full text-center"
                    >
                      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-semibold text-text-secondary dark:text-white mb-3">
                        You&apos;re on the list!
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        Thanks
                        {form.fullName
                          ? `, ${form.fullName.split(" ")[0]}`
                          : ""}
                        . We&apos;ll reach out to{" "}
                        <span className="text-text-secondary dark:text-white font-medium">
                          {form.email}
                        </span>{" "}
                        when your spot opens.
                      </p>
                    </motion.div>
                  ) : (
                    /* ── FORM ─────────────────────────────────────────── */
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="w-full space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Step indicator */}
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`h-1 rounded-full flex-1 transition-colors ${step >= 1 ? "bg-emerald-500" : "bg-slate-200 dark:bg-white/10"}`}
                        />
                        <div
                          className={`h-1 rounded-full flex-1 transition-colors ${step === 2 ? "bg-emerald-500" : "bg-slate-200 dark:bg-white/10"}`}
                        />
                        <span className="text-[10px] font-mono text-slate-400 ml-1">
                          {step}/2
                        </span>
                      </div>

                      <AnimatePresence mode="wait">
                        {/* Step 1: contact info */}
                        {step === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            className="space-y-4"
                          >
                            <InputField
                              id="fullName"
                              label="Full name"
                              placeholder="Jane Doe"
                              value={form.fullName}
                              onChange={(e) => set("fullName")(e.target.value)}
                              error={errors.fullName}
                            />
                            <InputField
                              id="email"
                              label="Email"
                              type="email"
                              placeholder="name@example.com"
                              value={form.email}
                              onChange={(e) => set("email")(e.target.value)}
                              error={errors.email}
                            />
                            <InputField
                              id="phone"
                              label="Phone number"
                              type="tel"
                              placeholder="+234 800 000 0000"
                              value={form.phone}
                              onChange={(e) => set("phone")(e.target.value)}
                              error={errors.phone}
                            />

                            <button
                              type="button"
                              onClick={handleNextStep}
                              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-1 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-white transition-all hover:bg-emerald-400 active:scale-[0.98]"
                            >
                              Continue
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        )}

                        {/* Step 2: profile questions */}
                        {step === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            className="space-y-4"
                          >
                            <SelectField
                              id="primaryGoal"
                              label="Primary financial goal"
                              options={primaryGoals}
                              value={form.primaryGoal}
                              onChange={set("primaryGoal")}
                              error={errors.primaryGoal}
                            />
                            <SelectField
                              id="currentSavingMethods"
                              label="Current saving / investment method"
                              options={savingMethods}
                              value={form.currentSavingMethods}
                              onChange={set("currentSavingMethods")}
                              error={errors.currentSavingMethods}
                            />
                            <SelectField
                              id="monthlySavingsRange"
                              label="Monthly savings range"
                              options={savingsRanges}
                              value={form.monthlySavingsRange}
                              onChange={set("monthlySavingsRange")}
                              error={errors.monthlySavingsRange}
                            />
                            <SelectField
                              id="howDidYouHear"
                              label="How did you hear about Flynt?"
                              options={hearOptions}
                              value={form.howDidYouHear}
                              onChange={set("howDidYouHear")}
                              error={errors.howDidYouHear}
                            />

                            {serverError && (
                              <p className="text-[11px] text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                {serverError}
                              </p>
                            )}

                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="rounded-lg border border-slate-200 dark:border-white/10 px-5 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 transition hover:bg-slate-50 dark:hover:bg-white/5"
                              >
                                Back
                              </button>
                              <button
                                type="submit"
                                disabled={status === "loading"}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-1 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-white transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {status === "loading" ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Joining…
                                  </>
                                ) : (
                                  <>
                                    Join Waitlist
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </>
                                )}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
