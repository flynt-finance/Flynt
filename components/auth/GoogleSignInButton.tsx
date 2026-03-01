"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import { socialAuthRequest } from "@/lib/api/requests";
import { setToken } from "@/lib/auth-cookie";
import { useAuthStore } from "@/stores/use-auth-store";

type GoogleSignInButtonLabel = "Sign in with Google" | "Sign up with Google";

interface GoogleSignInButtonProps {
	label?: GoogleSignInButtonLabel;
}

const DEFAULT_LABEL: GoogleSignInButtonLabel = "Sign in with Google";

export function GoogleSignInButton({
	label = DEFAULT_LABEL,
}: GoogleSignInButtonProps) {
	const router = useRouter();
	const setData = useAuthStore((s) => s.setData);
	const [isLoading, setIsLoading] = useState(false);

	const handleSuccess = useCallback(
		async (credentialResponse: CredentialResponse) => {
			const credential = credentialResponse.credential;
			if (!credential) return;
			setIsLoading(true);
			try {
				const response = await socialAuthRequest({
					provider: "google",
					token: credential,
				});
				if (response.success && response.data) {
					setToken(response.data.token);
					setData({ user: response.data.user });
					toast.success(response.message ?? "Social login successful", {
						description: "You have been signed in.",
					});
					router.push("/dashboard");
				} else {
					toast.error("Social login failed", {
						description: response.message ?? "Please try again.",
					});
				}
			} catch {
				// Error toast handled by API client interceptor
			} finally {
				setIsLoading(false);
			}
		},
		[setData, router]
	);

	const handleError = useCallback(() => {
		setIsLoading(false);
	}, []);

	const textProp =
		label === "Sign up with Google" ? "signup_with" : "signin_with";

	return (
		<div
			className={`gBtn flex items-center justify-center h-[42px] [&_iframe]:max-w-full! [&_div]:justify-center! ${
				isLoading ? "pointer-events-none opacity-60" : ""
			}`}
			aria-busy={isLoading}
		>
			<GoogleLogin
				onSuccess={handleSuccess}
				onError={handleError}
				text={textProp}
				theme="outline"
				size="large"
				shape="rectangular"
				width="100%"
			/>
		</div>
	);
}
