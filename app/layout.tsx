import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import AuthHydrator from "@/components/AuthHydrator";
import {
	FLYNT_USER_COOKIE,
	getInitialUserFromCookie,
	getInitialUserFromHeaders,
} from "@/lib/auth-user-header";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Flynt - Spend Smarter, Save Faster",
	description:
		"AI-powered financial control that prevents overspending before it happens",
	keywords: [
		"fintech",
		"budgeting",
		"virtual cards",
		"spending control",
		"Nigeria",
	],
	authors: [{ name: "Flynt Finance" }],
	openGraph: {
		title: "Flynt - Spend Smarter, Save Faster",
		description:
			"AI-powered financial control that prevents overspending before it happens",
		type: "website",
	},
};

export const dynamic = "force-dynamic";

const themeScript = `
(function() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light';
  document.documentElement.classList.add(theme);
})();
`;
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersList = await headers();
	const cookieStore = await cookies();
	const fromCookie = getInitialUserFromCookie(
		cookieStore.get(FLYNT_USER_COOKIE)?.value
	);
	const fromHeader = getInitialUserFromHeaders(headersList);
	const initialUser = fromCookie ?? fromHeader;

	return (
		<html lang="en" className={montserrat.variable} suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{ __html: themeScript }}
					suppressHydrationWarning
				/>
			</head>
			<body className="font-sans antialiased bg-bg-primary text-text-primary">
				<Providers>
					<AuthHydrator initialUser={initialUser} />
					{children}
				</Providers>
			</body>
		</html>
	);
}
