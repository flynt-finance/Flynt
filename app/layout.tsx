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
  title: "Flynt — Fraud Detection API",
  description:
    "Flynt is a fraud detection API you plug into your system. It watches every transaction, spots suspicious activity, and takes action automatically — giving your business clarity, intelligence, and automation.",
  keywords: [
    "fraud detection API",
    "transaction monitoring",
    "fraud prevention",
    "real-time fraud detection",
    "payment fraud",
    "fintech API",
    "risk scoring",
    "automated fraud prevention",
  ],
  authors: [{ name: "Flynt" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Flynt — Fraud Detection API",
    description:
      "Plug Flynt into your system for real-time fraud detection. Clarity, intelligence, and automation — through a single API.",
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
    cookieStore.get(FLYNT_USER_COOKIE)?.value,
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
