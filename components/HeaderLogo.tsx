import Link from "next/link";

const DEFAULT_WIDTH = 120;
const DEFAULT_HEIGHT = 40;

interface HeaderLogoProps {
	width?: number;
	height?: number;
	className?: string;
}

export function HeaderLogo({
	width = DEFAULT_WIDTH,
	height = DEFAULT_HEIGHT,
	className = "",
}: HeaderLogoProps) {
	return (
		<Link
			href="/"
			className={`shrink-0 bg-contain bg-no-repeat bg-center ${className}`.trim()}
			style={{
				width,
				height,
				backgroundImage: "var(--header-logo-url)",
			}}
			role="img"
			aria-label="Flynt"
		/>
	);
}
