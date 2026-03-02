import { cookies, headers } from "next/headers";
import DashboardLayoutClient from "./DashboardLayoutClient";
import {
	FLYNT_USER_COOKIE,
	getInitialUserFromCookie,
	getInitialUserFromHeaders,
} from "@/lib/auth-user-header";

export default async function DashboardLayout({
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
		<DashboardLayoutClient initialUser={initialUser}>
			{children}
		</DashboardLayoutClient>
	);
}
