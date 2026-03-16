"use client";

import { useQuery } from "@tanstack/react-query";

const NIGERIAN_BANKS_DATA_URL =
	"https://supermx1.github.io/nigerian-banks-api/data.json";
const NIGERIAN_BANKS_LOGOS_BASE =
	"https://supermx1.github.io/nigerian-banks-api/logos";

/** Fallback when bank slug is not found (generic bank icon as data URI) */
const FALLBACK_LOGO =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3'/%3E%3C/svg%3E";

interface NigerianBankEntry {
	id: number;
	name: string;
	slug: string;
	code: string;
	logo?: string;
	longcode?: string | null;
	ussd?: string;
	ussd_transfer?: string;
}

/** Common bank name aliases (API/institution name -> slug from Nigerian banks API) */
const BANK_NAME_ALIASES: Record<string, string> = {
	GTBank: "guaranty-trust-bank",
	"GT Bank": "guaranty-trust-bank",
	"Guaranty Trust Bank": "guaranty-trust-bank",
	UBA: "united-bank-for-africa",
	"United Bank for Africa": "united-bank-for-africa",
	FCMB: "first-city-monument-bank",
	"First City Monument Bank": "first-city-monument-bank",
	"First Bank": "first-bank-of-nigeria",
	"First Bank of Nigeria": "first-bank-of-nigeria",
	Stanbic: "stanbic-ibtc-bank",
	"Stanbic IBTC Bank": "stanbic-ibtc-bank",
	"Stanbic IBTC": "stanbic-ibtc-bank",
	"Access Bank (Diamond)": "access-bank-diamond",
	"Access Bank": "access-bank",
	"Zenith Bank": "zenith-bank",
	"Union Bank": "union-bank-of-nigeria",
	"Union Bank of Nigeria": "union-bank-of-nigeria",
	"Heritage Bank": "heritage-bank",
	"Sterling Bank": "sterling-bank",
	"Keystone Bank": "keystone-bank",
	"Polaris Bank": "polaris-bank",
	"Fidelity Bank": "fidelity-bank",
	"Ecobank Nigeria": "ecobank-nigeria",
	"Ecobank": "ecobank-nigeria",
	"Kuda Bank": "kuda-bank",
	Kuda: "kuda-bank",
	"Providus Bank": "providus-bank",
	"Jaiz Bank": "jaiz-bank",
	"Suntrust Bank": "suntrust-bank",
	"Optimus Bank Limited": "optimus-bank-ltd",
	"Parallex Bank": "parallex-bank",
	"TAJ Bank": "taj-bank",
	"Lotus Bank": "lotus-bank",
	"PremiumTrust Bank": "premiumtrust-bank-ng",
	"Globus Bank": "globus-bank",
	"Moniepoint MFB": "moniepoint-mfb-ng",
	Moniepoint: "moniepoint-mfb-ng",
};

const normalizeName = (name: string): string =>
	name.trim().toLowerCase().replace(/\s+/g, " ");

const fetchNigerianBanks = async (): Promise<NigerianBankEntry[]> => {
	const res = await fetch(NIGERIAN_BANKS_DATA_URL);
	if (!res.ok) throw new Error("Failed to fetch Nigerian banks data");
	const data = (await res.json()) as NigerianBankEntry[];
	return Array.isArray(data) ? data : [];
};

/** Build name -> slug map from API list; includes normalized names and aliases */
const buildNameToSlugMap = (
	entries: NigerianBankEntry[],
	aliases: Record<string, string>
): Map<string, string> => {
	const map = new Map<string, string>();
	for (const entry of entries) {
		const normalized = normalizeName(entry.name);
		if (!map.has(normalized)) map.set(normalized, entry.slug);
		// Also store original name for exact match
		if (!map.has(entry.name)) map.set(entry.name, entry.slug);
	}
	for (const [alias, slug] of Object.entries(aliases)) {
		map.set(alias, slug);
		map.set(normalizeName(alias), slug);
	}
	return map;
};

/** Returns logo URL for a bank name, or fallback if not found. Safe to call before banks data has loaded. */
export const getBankLogoUrl = (
	bankName: string,
	nameToSlug: Map<string, string> | null
): string => {
	if (!bankName?.trim()) return FALLBACK_LOGO;
	const slug =
		nameToSlug?.get(bankName.trim()) ??
		nameToSlug?.get(normalizeName(bankName)) ??
		BANK_NAME_ALIASES[bankName.trim()];
	if (!slug) return FALLBACK_LOGO;
	return `${NIGERIAN_BANKS_LOGOS_BASE}/${slug}.png`;
};

const NIGERIAN_BANKS_QUERY_KEY = "nigerian-banks";

/** Fetches Nigerian banks data and exposes getBankLogoUrl. Cached ~5–10 min. */
export const useNigerianBanks = (): {
	getBankLogoUrl: (bankName: string) => string;
	isLoading: boolean;
	nameToSlug: Map<string, string> | null;
} => {
	const { data: entries, isLoading } = useQuery({
		queryKey: [NIGERIAN_BANKS_QUERY_KEY],
		queryFn: fetchNigerianBanks,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
	});

	const nameToSlug =
		entries != null && entries.length > 0
			? buildNameToSlugMap(entries, BANK_NAME_ALIASES)
			: null;

	const getBankLogoUrlForName = (bankName: string): string =>
		getBankLogoUrl(bankName, nameToSlug);

	return {
		getBankLogoUrl: getBankLogoUrlForName,
		isLoading,
		nameToSlug,
	};
};
