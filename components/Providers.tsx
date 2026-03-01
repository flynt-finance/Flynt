"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DebtProvider } from "@/contexts/DebtContext";
import ThemeAwareToaster from "@/components/ThemeAwareToaster";

const queryClient = new QueryClient();

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

if (
	typeof window !== "undefined" &&
	!googleClientId &&
	process.env.NODE_ENV === "development"
) {
	console.warn(
		"Google Sign-In: NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing. Add it to .env.local and ensure Authorized JavaScript origins include this app URL (e.g. http://localhost:3000)."
	);
}

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<GoogleOAuthProvider clientId={googleClientId}>
				<ThemeProvider>
					<DebtProvider>{children}</DebtProvider>
					<ThemeAwareToaster />
				</ThemeProvider>
			</GoogleOAuthProvider>
		</QueryClientProvider>
	);
}
