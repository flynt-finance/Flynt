"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/api/types";

interface OnboardLayoutClientProps {
	children: React.ReactNode;
	initialUser: User | null;
}

export default function OnboardLayoutClient({
	children,
	initialUser,
}: OnboardLayoutClientProps) {
	const router = useRouter();

	useEffect(() => {
		if (initialUser?.onboardingCompleted === true) {
			router.replace("/dashboard");
		}
	}, [initialUser?.onboardingCompleted, router]);

	return <>{children}</>;
}
