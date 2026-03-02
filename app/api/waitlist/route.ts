import { NextResponse } from "next/server";
import { waitlistFormSchema } from "@/lib/validations/waitlist";

const WAITLIST_SCRIPT_URL = process.env.WAITLIST_GOOGLE_SCRIPT_URL;

export async function POST(request: Request) {
	if (!WAITLIST_SCRIPT_URL) {
		console.error("[waitlist] WAITLIST_GOOGLE_SCRIPT_URL is not set");
		return NextResponse.json(
			{ success: false, message: "Waitlist is not configured." },
			{ status: 500 }
		);
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ success: false, message: "Invalid JSON body." },
			{ status: 400 }
		);
	}

	const parsed = waitlistFormSchema.safeParse(body);
	if (!parsed.success) {
		const firstError = parsed.error.flatten().fieldErrors;
		const message = Object.values(firstError).flat().find(Boolean) ?? "Validation failed.";
		return NextResponse.json(
			{ success: false, message },
			{ status: 400 }
		);
	}

	const payload = {
		...parsed.data,
		submittedAt: new Date().toISOString(),
	};

	try {
		const res = await fetch(WAITLIST_SCRIPT_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		if (!res.ok) {
			console.error("[waitlist] Google script responded with", res.status, await res.text());
			return NextResponse.json(
				{ success: false, message: "Something went wrong. Please try again later." },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error("[waitlist] Failed to send to Google Sheet", err);
		return NextResponse.json(
			{ success: false, message: "Something went wrong. Please try again later." },
			{ status: 500 }
		);
	}
}
