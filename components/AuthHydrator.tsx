"use client";

import { useRef } from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import type { User } from "@/lib/api/types";

interface AuthHydratorProps {
	initialUser: User | null;
}

/** Hydrates auth store from server so no client /auth/me request is made. */
export default function AuthHydrator({ initialUser }: AuthHydratorProps) {
	const hydrated = useRef(false);
	if (initialUser != null && !hydrated.current) {
		hydrated.current = true;
		useAuthStore.getState().setData({ user: initialUser });
	}
	return null;
}
