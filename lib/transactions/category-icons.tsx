"use client";

import {
	ArrowRightLeft,
	Receipt,
	ShoppingCart,
	UtensilsCrossed,
	Car,
	Home,
	Tv,
	Film,
	AlertTriangle,
	ShieldCheck,
	Wallet,
	CircleDollarSign,
	type LucideIcon,
} from "lucide-react";

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
	ArrowRightLeft,
	Receipt,
	ShoppingCart,
	UtensilsCrossed,
	Car,
	Home,
	Tv,
	Film,
	AlertTriangle,
	ShieldCheck,
	Wallet,
	CircleDollarSign,
};

const DEFAULT_ICON = Receipt;

/**
 * Resolve category icon name from API to a Lucide React component.
 * Returns the default icon when the name is unknown.
 */
export function getCategoryIconComponent(
	iconName: string | null | undefined
): LucideIcon {
	if (!iconName || typeof iconName !== "string") return DEFAULT_ICON;
	const trimmed = iconName.trim();
	return CATEGORY_ICON_MAP[trimmed] ?? DEFAULT_ICON;
}
