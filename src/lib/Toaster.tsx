import { useSyncExternalStore } from 'react';

interface ToastData {
	title: string;
	description?: string;
	color?: string;
	bg?: string;
	border?: string;
	icon?: string;
}

interface ToastItem {
	id: number;
	data: ToastData;
}

let toasts: ToastItem[] = [];
let idCounter = 0;
const listeners = new Set<() => void>();

function emitChange() {
	for (const listener of listeners) listener();
}

/**
 * Padanan `addToast` dari Toaster.svelte — dipakai persis sama:
 *   addToast({ data: { title, description, color, bg, border, icon } })
 */
export function addToast({ data, duration = 4000 }: { data: ToastData; duration?: number }) {
	const id = ++idCounter;
	toasts = [...toasts, { id, data }];
	emitChange();

	setTimeout(() => {
		toasts = toasts.filter((t) => t.id !== id);
		emitChange();
	}, duration);
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function getSnapshot() {
	return toasts;
}

export default function Toaster() {
	const currentToasts = useSyncExternalStore(subscribe, getSnapshot);

	return (
		<div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 space-y-2 w-[90%] max-w-sm">
			{currentToasts.map((toast) => (
				<div
					key={toast.id}
					className="rounded-xl border px-4 py-3 shadow-md"
					style={{
						backgroundColor: toast.data.bg ?? '#fff',
						borderColor: toast.data.border ?? '#ccc'
					}}
				>
					<p className="text-sm font-semibold" style={{ color: toast.data.color ?? '#111' }}>
						{toast.data.title}
					</p>
					{toast.data.description && (
						<p className="text-xs text-neutral-600 mt-0.5">{toast.data.description}</p>
					)}
				</div>
			))}
		</div>
	);
}
