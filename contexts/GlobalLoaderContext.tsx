"use client";

import {
	createContext,
	useContext,
	useState,
	useCallback,
	useMemo,
	type ReactNode,
} from "react";
import { Loader2 } from "lucide-react";

const DEFAULT_TITLE = "Loading";
const DEFAULT_SUBTITLE = "";

interface GlobalLoaderState {
	visible: boolean;
	title: string;
	subtitle: string;
}

interface GlobalLoaderContextType {
	showLoader: (options?: { title?: string; subtitle?: string }) => void;
	hideLoader: () => void;
}

const GlobalLoaderContext = createContext<GlobalLoaderContextType | undefined>(
	undefined
);

interface FullscreenLoaderProps {
	visible: boolean;
	title: string;
	subtitle: string;
}

function FullscreenLoader({ visible, title, subtitle }: FullscreenLoaderProps) {
	if (!visible) return null;

	return (
		<div
			className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/50 backdrop-blur-sm"
			role="status"
			aria-live="polite"
			aria-busy="true"
			aria-label={title || "Loading"}
		>
			<Loader2
				className="h-12 w-12 animate-spin text-green-primary"
				aria-hidden
			/>
			{title ? (
				<p className="text-lg font-bold text-text-primary">{title}</p>
			) : null}
			{subtitle ? <p className="text-sm text-text-muted">{subtitle}</p> : null}
		</div>
	);
}

export function GlobalLoaderProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<GlobalLoaderState>({
		visible: false,
		title: DEFAULT_TITLE,
		subtitle: DEFAULT_SUBTITLE,
	});

	const showLoader = useCallback(
		(options?: { title?: string; subtitle?: string }) => {
			setState({
				visible: true,
				title: options?.title ?? DEFAULT_TITLE,
				subtitle: options?.subtitle ?? DEFAULT_SUBTITLE,
			});
		},
		[]
	);

	const hideLoader = useCallback(() => {
		setState((prev) => ({ ...prev, visible: false }));
	}, []);

	const value = useMemo(
		() => ({ showLoader, hideLoader }),
		[showLoader, hideLoader]
	);

	return (
		<GlobalLoaderContext.Provider value={value}>
			{children}
			<FullscreenLoader
				visible={state.visible}
				title={state.title}
				subtitle={state.subtitle}
			/>
		</GlobalLoaderContext.Provider>
	);
}

export function useGlobalLoader(): GlobalLoaderContextType {
	const context = useContext(GlobalLoaderContext);
	if (context === undefined) {
		throw new Error(
			"useGlobalLoader must be used within a GlobalLoaderProvider"
		);
	}
	return context;
}
