import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
	variant?: "primary" | "secondary" | "ghost" | "outline";
	size?: "sm" | "md" | "lg";
	children: ReactNode;
	fullWidth?: boolean;
	loading?: boolean;
}

export default function Button({
	variant = "primary",
	size = "md",
	children,
	fullWidth = false,
	loading = false,
	className = "",
	disabled,
	...props
}: ButtonProps) {
	const baseStyles =
		"font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-green-primary/20 inline-flex items-center justify-center gap-2";

	const variantStyles = {
		primary: "bg-green-primary text-white hover:bg-green-hover",
		secondary:
			"bg-bg-elevated text-text-primary hover:bg-bg-card border border-border-primary",
		ghost: "bg-transparent text-green-primary hover:bg-green-primary/5",
		outline:
			"bg-transparent border border-green-primary text-green-primary hover:bg-green-primary hover:text-white hover:border-green-hover",
	};

	const sizeStyles = {
		sm: "px-3 py-1.5 text-xs",
		md: "px-4 py-2.5 text-sm",
		lg: "px-6 py-3 text-base",
	};

	const widthStyle = fullWidth ? "w-full" : "";
	const isDisabled = disabled ?? loading;

	return (
		<motion.button
			whileHover={isDisabled ? undefined : { scale: 1.02 }}
			whileTap={isDisabled ? undefined : { scale: 0.98 }}
			transition={{ type: "spring", stiffness: 400, damping: 17 }}
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
			disabled={isDisabled}
			aria-busy={loading}
			{...props}
		>
			{loading && (
				<Loader2
					className="h-4 w-4 shrink-0 animate-spin"
					strokeWidth={2.5}
					aria-hidden
				/>
			)}
			{children}
		</motion.button>
	);
}
