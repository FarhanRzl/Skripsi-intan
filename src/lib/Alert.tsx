// Disusun dari pola pemakaian: <Alert icon="error" message="..." />
// TODO: timpa dengan versi asli kalau ada varian icon lain selain "error"

interface AlertProps {
	icon?: 'error' | 'warning' | 'info';
	message: string;
}

const ICON_MAP: Record<string, string> = {
	error: 'error',
	warning: 'warning',
	info: 'info'
};

export default function Alert({ icon = 'error', message }: AlertProps) {
	return (
		<div className="flex items-start gap-2 bg-danger-surface border border-danger-main rounded-xl px-3 py-2.5">
			<span className="material-symbols-outlined text-danger-main shrink-0" style={{ fontSize: '1.1rem' }}>
				{ICON_MAP[icon] ?? 'error'}
			</span>
			<p className="text-sm text-danger-main leading-snug">{message}</p>
		</div>
	);
}
