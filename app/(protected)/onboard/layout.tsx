import { cookies, headers } from "next/headers";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { BackgroundGrid } from "@/components/ui/background-grid";
import { HeaderLogo } from "@/components/HeaderLogo";
import {
	FLYNT_USER_COOKIE,
	getInitialUserFromCookie,
	getInitialUserFromHeaders,
} from "@/lib/auth-user-header";
import OnboardLayoutClient from "./OnboardLayoutClient";

export default async function OnboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const headersList = await headers();
	const cookieStore = await cookies();
	const fromCookie = getInitialUserFromCookie(
		cookieStore.get(FLYNT_USER_COOKIE)?.value
	);
	const fromHeader = getInitialUserFromHeaders(headersList);
	const initialUser = fromCookie ?? fromHeader;

	return (
		<OnboardLayoutClient initialUser={initialUser}>
			<div className="flex min-h-screen flex-col bg-bg-primary relative overflow-hidden">
				<BackgroundGrid />
				<header className="relative flex shrink-0 justify-center pt-8 pb-2">
					<div
						className="flex items-center gap-2 uppercase font-extrabold tracking-wider text-text-primary transition-colors hover:text-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary/20 focus:ring-offset-2 rounded-lg px-2 py-1"
						aria-label="Flynt home"
					>
						<HeaderLogo width={120} height={40} />
					</div>
					<div className="absolute right-4 top-8">
						<ThemeToggle />
					</div>
				</header>

				<main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
					<div className="w-full">{children}</div>
				</main>

				<footer className="shrink-0 py-6 text-center text-xs text-text-muted">
					All rights reserved © 2026 Flynt
				</footer>
			</div>
		</OnboardLayoutClient>
	);
}
