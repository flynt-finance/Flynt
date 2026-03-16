declare module "@mono.co/connect.js" {
	interface ConnectOptions {
		key: string;
		scope: string;
		data?: { customer: { name: string; email: string; id?: string } };
		onSuccess?: (data: { code: string }) => void;
		onClose?: () => void;
		onLoad?: () => void;
		onEvent?: (eventName: string, data: Record<string, unknown>) => void;
		reference?: string;
	}

	interface ConnectInstance {
		setup: (config?: Record<string, unknown>) => void;
		open: () => void;
		close: () => void;
		reauthorise?: (accountId: string) => void;
	}

	export default class Connect {
		constructor(options: ConnectOptions);
		setup: (config?: Record<string, unknown>) => void;
		open: () => void;
		close: () => void;
		reauthorise?: (accountId: string) => void;
	}
}
