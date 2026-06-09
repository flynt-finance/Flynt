import { z } from "zod";

export const waitlistFormSchema = z.object({
	fullName: z.string().min(2, "Full name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email"),
	phone: z.string().min(10, "Please enter a valid phone number"),
	primaryGoal: z.string().min(1, "Please select your use case"),
	currentSavingMethods: z
		.string()
		.min(1, "Please select your industry"),
	monthlySavingsRange: z
		.string()
		.min(1, "Please select your transaction volume"),
	howDidYouHear: z.string().min(1, "Please select how you heard about us"),
});

export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;
